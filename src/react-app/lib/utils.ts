import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"
import {User} from "@/lib/api";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function isNonNullArray(arr) {
    return arr !== null && Array.isArray(arr) && arr.length > 0
}


export function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
};

export function computeUserName(user: User) {
    return user?.firstName && user?.lastName ? `${user?.firstName} ${user?.lastName}`
        : user?.firstName ? user?.firstName
            : user?.lastName ? user?.lastName : "UNKNOWN USER";
}