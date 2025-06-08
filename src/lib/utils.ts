import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(value: number | string | null | undefined): string {
  if (value === null || value === undefined) return "0.00";
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return "0.00";
  return num.toFixed(2);
}

export function formatCurrency(value: number | string | null | undefined): string {
  const formatted = formatNumber(value);
  return `₹${parseFloat(formatted).toLocaleString()}`;
}
