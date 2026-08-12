export interface IWarrantyColorInfo {
    color: 'red' | 'yellow' | 'green' | 'gray';
    textColor: string;
    bgColor: string;
    borderColor: string;
    statusText: string;
    isExpired: boolean;
    isLessThan6Months: boolean;
    isLessThan1Year: boolean;
    remainingDays: number | null;
    remainingMonths: number | null;
    remainingText: string;
    formattedDate: string;
}
export interface IAssetLifecycleInfo {
    purchaseDateFormatted: string;
    ageInMonths: number | null;
    ageInYears: number | null;
    eolDateFormatted: string | null;
    remainingMonths: number | null;
    remainingDays: number | null;
    remainingText: string;
    usedPercentage: number | null;
    isLifecycleExpired: boolean;
    statusText: string;
}
/**
 * Formats a date string into clean 'DD-MMM-YYYY' or 'DD MMM YYYY' format
 */
export declare const formatPrettyDate: (dateStr: string | undefined) => string;
/**
 * Calculates complete warranty coverage information, status, and remaining time details.
 */
export declare const getWarrantyColorInfo: (warrantyExpiryStr: string | undefined) => IWarrantyColorInfo;
/**
 * Calculates complete asset lifecycle, purchase date details, age, standard 3-year End-of-Life (EOL) date, and deprecation percentage.
 */
export declare const getAssetLifecycleInfo: (purchaseDateStr: string | undefined) => IAssetLifecycleInfo;
//# sourceMappingURL=WarrantyUtils.d.ts.map