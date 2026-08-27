export interface IWarrantyInfo {
  textColor: string;
  bgColor: string;
  isExpired: boolean;
  isLessThan6Months: boolean;
  isLessThan1Year: boolean;
  formattedDate: string;
  remainingText: string;
}

export interface ILifecycleInfo {
  statusText: string;
  purchaseDateFormatted: string;
  eolDateFormatted: string;
}

export function getWarrantyColorInfo(warrantyExpiry?: string): IWarrantyInfo {
  if (!warrantyExpiry) {
    return {
      textColor: '#6b7280',
      bgColor: '#f3f4f6',
      isExpired: false,
      isLessThan6Months: false,
      isLessThan1Year: false,
      formattedDate: 'N/A',
      remainingText: 'no warranty date'
    };
  }

  const expiry = new Date(warrantyExpiry);
  const now = new Date();

  if (isNaN(expiry.getTime())) {
    return {
      textColor: '#6b7280',
      bgColor: '#f3f4f6',
      isExpired: false,
      isLessThan6Months: false,
      isLessThan1Year: false,
      formattedDate: warrantyExpiry,
      remainingText: 'invalid date'
    };
  }

  const formattedDate = warrantyExpiry;
  const isExpired = expiry < now;
  const diffTime = expiry.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  let remainingText = '';
  if (isExpired) {
    const daysAgo = Math.abs(diffDays);
    remainingText = `${daysAgo} day${daysAgo === 1 ? '' : 's'} ago`;
  } else {
    remainingText = `${diffDays} day${diffDays === 1 ? '' : 's'} remaining`;
  }

  const isLessThan6Months = !isExpired && diffDays < 180;
  const isLessThan1Year = !isExpired && diffDays >= 180 && diffDays < 365;

  let textColor = '#166534';
  let bgColor = '#dcfce7';

  if (isExpired) {
    textColor = '#991b1b';
    bgColor = '#fee2e2';
  } else if (isLessThan6Months) {
    textColor = '#991b1b';
    bgColor = '#fee2e2';
  } else if (isLessThan1Year) {
    textColor = '#92400e';
    bgColor = '#fef3c7';
  }

  return {
    textColor,
    bgColor,
    isExpired,
    isLessThan6Months,
    isLessThan1Year,
    formattedDate,
    remainingText
  };
}

export function getAssetLifecycleInfo(purchaseDate?: string): ILifecycleInfo {
  if (!purchaseDate) {
    return {
      statusText: 'Unknown purchase date',
      purchaseDateFormatted: 'N/A',
      eolDateFormatted: 'N/A'
    };
  }

  const pDate = new Date(purchaseDate);
  if (isNaN(pDate.getTime())) {
    return {
      statusText: 'Invalid purchase date',
      purchaseDateFormatted: purchaseDate,
      eolDateFormatted: 'N/A'
    };
  }

  // Standard enterprise lifecycle: 4 years EOL
  const eolDate = new Date(pDate);
  eolDate.setFullYear(eolDate.getFullYear() + 4);

  const now = new Date();
  const isEol = now > eolDate;

  const purchaseDateFormatted = purchaseDate;
  const eolDateFormatted = eolDate.toISOString().split('T')[0];

  const statusText = isEol
    ? 'Asset has reached End of Life (EOL)'
    : 'Asset is within active enterprise lifecycle';

  return {
    statusText,
    purchaseDateFormatted,
    eolDateFormatted
  };
}
