import type { profile } from "@/db/generated/types";
import type { Updateable } from "kysely";

export interface GenderizeResponse {
 count: number;
 gender: 'male' | 'female' | null;
 name: string;
 probability: number;
}

export interface AgifyResponse {
 count: number;
 age: number;
 name: string;
}

export interface NationalizeResponse {
 count: number;
 name: string;
 country: {
  country_id: string;
  probability: number;
 }[]
}

export interface SuccessResponse {
 status: 'success';
 message?: string;
 data: Omit<Updateable<profile>, 'updated_at'>
}

export interface ErrorResponse {
 status: 'error',
 message: string
}