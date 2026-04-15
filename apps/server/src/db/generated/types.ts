import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export const Gender = {
    female: "female",
    male: "male"
} as const;
export type Gender = (typeof Gender)[keyof typeof Gender];
export const AgeGroup = {
    child: "child",
    teenager: "teenager",
    adult: "adult",
    senior: "senior"
} as const;
export type AgeGroup = (typeof AgeGroup)[keyof typeof AgeGroup];
export type profile = {
    id: Generated<string>;
    name: string;
    gender: Gender | null;
    gender_probability: number;
    sample_size: number;
    age: number;
    age_group: AgeGroup;
    country_id: string;
    country_probability: number;
    created_at: Generated<Timestamp>;
    updated_at: Generated<Timestamp>;
};
export type DB = {
    profile: profile;
};
