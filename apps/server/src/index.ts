import { db } from "@/db/db";
import type { AgeGroup, DB } from "@/db/generated/types";
import type { AgifyResponse, ErrorResponse, GenderizeResponse, NationalizeResponse, SuccessResponse } from "@/types";
import { env } from "@hng-i14-task-0-david-uzondu/env/server";
import axios, { Axios, type AxiosResponse } from "axios";
import cors from "cors";
import express, { type NextFunction, type Request, type Response } from "express";
import { sql, type ValueExpression } from "kysely";

const app = express();
app.use(
 cors({
  origin: env.CORS_ORIGIN,
  methods: ["GET", "POST", "OPTIONS"],
 }),
);

app.use(express.json());

app.get("/", (_req, res) => {
 res.status(200).send("OK");
});

class AppError extends Error {
 code: number;
 constructor({ message, code }: {
  message: string,
  code: number
 }) {
  super(message)
  this.code = code;
 }
}


app.post("/api/profiles",
 (req: Request, _res: Response, next: NextFunction) => {
  if (!req.query || req.query.name === undefined) {
   return _res.status(400).json({
    status: "error",
    message: "'name' is required in request query"
   });
  }

  if (req.query.name === "") {
   return _res.status(400).json({
    status: "error",
    message: "'name' cannot be empty"
   });
  }

  if (isNaN(Number(req.query.name)) === false) {
   return _res.status(422).json({
    status: "error",
    message: "'name' must not be a number"
   });
  }
  next()
 },
 async (req: Request<{}, {}, {}, { name: string }>, res: Response<SuccessResponse | ErrorResponse>) => {
  const [genderRes, agifyRes, nationalizeRes]: [AxiosResponse<GenderizeResponse>, AxiosResponse<AgifyResponse>, AxiosResponse<NationalizeResponse>] = await Promise.all([
   axios.get(`https://api.genderize.io/?name=${req.query.name}`),
   axios.get(`https://api.agify.io/?name=${req.query.name}`),
   axios.get(`https://api.nationalize.io/?name=${req.query.name}`),
  ])

  if (genderRes.status !== 200 || agifyRes.status !== 200 || nationalizeRes.status !== 200) throw new AppError({
   message: `Error calling ${genderRes.status !== 200 ? "Genderize" : agifyRes.status !== 200 ? "Agify" : nationalizeRes.status !== 200 ? "Nationalize" : "classification"} API`,
   code: 502
  });

  let existingUser = await db.selectFrom('profile')
   .where((eb) => eb(sql`LOWER(TRIM(name))`, "=", req.query.name.toLowerCase().trim()))
   .selectAll()
   .executeTakeFirst();

  delete existingUser?.updated_at;

  if (existingUser) {
   return res.status(409).json({
    message: "Profile already exists",
    data: existingUser,
    status: 'success'
   })
  }

  if (genderRes.data.count === 0 || genderRes.data.gender === null || !agifyRes.data.age || nationalizeRes.data.country.length === 0) return res.status(422).json({
   status: 'error',
   message: "No prediction available for the provided name"
  });

  const newProfile = await db.insertInto('profile').values({
   age: agifyRes.data.age,
   age_group: ((age: number): ValueExpression<DB, "profile", AgeGroup> => {
    if (age <= 12) return "child";
    if (age <= 19) return "teenager";
    if (age <= 59) return "adult";
    return 'senior'
   })(agifyRes.data.age),
   country_id: nationalizeRes.data.country.reduce((a, b) =>
    a.probability > b.probability ? a : b
   ).country_id,
   country_probability: Math.max(...nationalizeRes.data.country.map((c,) => c.probability)),
   gender: genderRes.data.gender,
   gender_probability: genderRes.data.probability,
   name: req.query.name,
   sample_size: genderRes.data.count
  })
   .returningAll()
   .executeTakeFirst();

  delete newProfile.updated_at;


  return res.status(200)
   .json({
    status: 'success',
    data: newProfile
   });
 });


app.use((err: Error, _req: Request, res: Response<ErrorResponse>, _next: NextFunction) => {
 console.error(err)
 if (err instanceof AppError) {
  return res.status(err.code).json({
   status: 'error',
   message: err.message
  })
 }
 if (err instanceof SyntaxError && 'body' in err) {
  return res.status(400).json({
   status: "error",
   message: err.message
  });
 } else {
  return res.status(500).json({
   status: "error",
   message: "Internal server error"
  })
 }
})

app.listen(env.PORT, () => {
 console.log(`Server is running on http://localhost:${env.PORT}`);
});
