import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function isNonNullArray(arr) {
    return arr !== null && Array.isArray(arr) && arr.length > 0
}
