/**
 * Formats a date string into clean 'DD-MMM-YYYY' or 'DD MMM YYYY' format
 */
export const formatPrettyDate = (dateStr) => {
    if (!dateStr)
        return 'N/A';
    const d = new Date(dateStr);
    if (isNaN(d.getTime()))
        return dateStr;
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};
/**
 * Calculates complete warranty coverage information, status, and remaining time details.
 */
export const getWarrantyColorInfo = (warrantyExpiryStr) => {
    if (!warrantyExpiryStr) {
        return {
            color: 'gray',
            textColor: '#4b5563',
            bgColor: '#f3f4f6',
            borderColor: '#e5e7eb',
            statusText: 'N/A',
            isExpired: false,
            isLessThan6Months: false,
            isLessThan1Year: false,
            remainingDays: null,
            remainingMonths: null,
            remainingText: 'No warranty date registered',
            formattedDate: 'N/A'
        };
    }
    const expiryDate = new Date(warrantyExpiryStr);
    if (isNaN(expiryDate.getTime())) {
        return {
            color: 'gray',
            textColor: '#4b5563',
            bgColor: '#f3f4f6',
            borderColor: '#e5e7eb',
            statusText: 'Invalid Date',
            isExpired: false,
            isLessThan6Months: false,
            isLessThan1Year: false,
            remainingDays: null,
            remainingMonths: null,
            remainingText: 'Invalid warranty date format',
            formattedDate: warrantyExpiryStr
        };
    }
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const expDateOnly = new Date(expiryDate.getFullYear(), expiryDate.getMonth(), expiryDate.getDate());
    const formattedDate = expDateOnly.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    // Thresholds: 6 months and 1 year from today
    const sixMonthsFromToday = new Date(today.getFullYear(), today.getMonth() + 6, today.getDate());
    const oneYearFromToday = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());
    const isExpired = expDateOnly.getTime() < today.getTime();
    const diffTime = expDateOnly.getTime() - today.getTime();
    const remainingDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const remainingMonths = Math.round(remainingDays / 30.4375);
    let remainingText = '';
    if (isExpired) {
        const pastDays = Math.abs(remainingDays);
        remainingText = `Expired ${pastDays} day(s) ago`;
    }
    else {
        const remMonths = Math.floor(remainingDays / 30.4375);
        const remDaysMod = Math.round(remainingDays % 30.4375);
        if (remMonths > 0) {
            remainingText = `${remMonths} month(s), ${remDaysMod} day(s) remaining (${remainingDays} days total)`;
        }
        else {
            remainingText = `${remainingDays} day(s) remaining`;
        }
    }
    if (expDateOnly < sixMonthsFromToday) {
        // Less than 6 months (includes expired and < 6 months remaining) -> Red
        return {
            color: 'red',
            textColor: '#b91c1c',
            bgColor: '#fee2e2',
            borderColor: '#fca5a5',
            statusText: isExpired ? '(Expired)' : '(Active - Expiring Soon)',
            isExpired,
            isLessThan6Months: true,
            isLessThan1Year: true,
            remainingDays,
            remainingMonths,
            remainingText,
            formattedDate
        };
    }
    else if (expDateOnly < oneYearFromToday) {
        // Less than 1 year (6 months to 1 year remaining) -> Yellow
        return {
            color: 'yellow',
            textColor: '#b45309',
            bgColor: '#fef3c7',
            borderColor: '#fde68a',
            statusText: '(Active - Expiring < 1 Yr)',
            isExpired: false,
            isLessThan6Months: false,
            isLessThan1Year: true,
            remainingDays,
            remainingMonths,
            remainingText,
            formattedDate
        };
    }
    else {
        // 1 year or more remaining -> Green
        return {
            color: 'green',
            textColor: '#166534',
            bgColor: '#dcfce7',
            borderColor: '#86efac',
            statusText: '(Active)',
            isExpired: false,
            isLessThan6Months: false,
            isLessThan1Year: false,
            remainingDays,
            remainingMonths,
            remainingText,
            formattedDate
        };
    }
};
/**
 * Calculates complete asset lifecycle, purchase date details, age, standard 3-year End-of-Life (EOL) date, and deprecation percentage.
 */
export const getAssetLifecycleInfo = (purchaseDateStr) => {
    if (!purchaseDateStr) {
        return {
            purchaseDateFormatted: 'Not registered',
            ageInMonths: null,
            ageInYears: null,
            eolDateFormatted: null,
            remainingMonths: null,
            remainingDays: null,
            remainingText: 'Purchase date is missing',
            usedPercentage: null,
            isLifecycleExpired: false,
            statusText: 'No purchase date available'
        };
    }
    const pd = new Date(purchaseDateStr);
    if (isNaN(pd.getTime())) {
        return {
            purchaseDateFormatted: purchaseDateStr,
            ageInMonths: null,
            ageInYears: null,
            eolDateFormatted: null,
            remainingMonths: null,
            remainingDays: null,
            remainingText: 'Invalid purchase date format',
            usedPercentage: null,
            isLifecycleExpired: false,
            statusText: 'Invalid date'
        };
    }
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const purchaseDateOnly = new Date(pd.getFullYear(), pd.getMonth(), pd.getDate());
    const purchaseDateFormatted = purchaseDateOnly.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    // Enterprise standard lifecycle: 36 months (3 years)
    const eolDate = new Date(purchaseDateOnly.getFullYear() + 3, purchaseDateOnly.getMonth(), purchaseDateOnly.getDate());
    const eolDateFormatted = eolDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const ageTime = today.getTime() - purchaseDateOnly.getTime();
    const ageDays = Math.max(0, Math.floor(ageTime / (1000 * 60 * 60 * 24)));
    const ageInMonths = Math.round(ageDays / 30.4375);
    const ageInYears = Math.round((ageInMonths / 12) * 10) / 10;
    const remTime = eolDate.getTime() - today.getTime();
    const remainingDays = Math.ceil(remTime / (1000 * 60 * 60 * 24));
    const remainingMonths = Math.round(remainingDays / 30.4375);
    const isLifecycleExpired = remainingDays <= 0;
    const usedPercentage = Math.min(100, Math.max(0, Math.round((ageInMonths / 36) * 100)));
    let remainingText = '';
    if (isLifecycleExpired) {
        const pastDays = Math.abs(remainingDays);
        remainingText = `Lifecycle ended on ${eolDateFormatted} (${pastDays} days ago)`;
    }
    else {
        const remMonths = Math.floor(remainingDays / 30.4375);
        const remDaysMod = Math.round(remainingDays % 30.4375);
        remainingText = `${remMonths} month(s), ${remDaysMod} day(s) remaining until ${eolDateFormatted} (${remainingDays} days remaining)`;
    }
    const statusText = isLifecycleExpired
        ? `⚠️ Lifecycle Expired (Reached standard 3-year lifecycle limit on ${eolDateFormatted})`
        : `✓ Within standard 3-year enterprise lifecycle (${remainingMonths} months remaining until ${eolDateFormatted})`;
    return {
        purchaseDateFormatted,
        ageInMonths,
        ageInYears,
        eolDateFormatted,
        remainingMonths,
        remainingDays,
        remainingText,
        usedPercentage,
        isLifecycleExpired,
        statusText
    };
};
//# sourceMappingURL=WarrantyUtils.js.map