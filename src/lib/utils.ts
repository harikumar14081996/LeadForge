import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Serializes an object for client-side consumption, primarily converting Prisma Decimals to numbers.
 * Uses JSON.parse(JSON.stringify()) as a robust way to strip non-serializable types.
 */
export function serializeForClient<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}
