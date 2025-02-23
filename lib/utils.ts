import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Tailwind CSS klasslarini birlashtirish uchun yordamchi funksiya
 * clsx va tailwind-merge dan foydalanib, keraksiz klasslarni tozalaydi.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
