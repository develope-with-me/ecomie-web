// Simple validators used by Admin forms
export const Validators = {
    required: (val: any) => {
        if (val === undefined || val === null) return false;
        if (typeof val === "string") return val.trim().length > 0;
        if (Array.isArray(val)) return val.length > 0;
        return true;
    },
    isDate: (val: string) => {
        if (!val) return false;
        const d = Date.parse(val);
        return !Number.isNaN(d);
    },
    isPositiveInteger: (val: any) => {
        const n = Number(val);
        return Number.isInteger(n) && n >= 0;
    },
};
export default Validators;