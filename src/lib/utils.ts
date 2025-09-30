
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * A utility function to merge Tailwind CSS classes.
 * It uses `clsx` to conditionally apply classes and `tailwind-merge` to merge them without conflicts.
 *
 * @param {...ClassValue} inputs - A list of class names to merge.
 * @returns {string} The merged class names.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a date string to a more readable format.
 *
 * @param {string} dateString - The date string to format.
 * @returns {string} The formatted date string (e.g., "1 de enero de 2024").
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('es-UY', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Calculates the age of a person based on their birth date.
 *
 * @param {Date} birthDate - The birth date of the person.
 * @returns {number} The age of the person in years.
 */
export function calculateAge(birthDate: Date): number {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}
