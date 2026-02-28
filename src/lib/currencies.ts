import type { CurrencyInfo } from '@/types/invoice';

export const CURRENCIES: readonly CurrencyInfo[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', decimals: 2 },
  { code: 'EUR', name: 'Euro', symbol: '\u20AC', decimals: 2 },
  { code: 'GBP', name: 'British Pound', symbol: '\u00A3', decimals: 2 },
  { code: 'JPY', name: 'Japanese Yen', symbol: '\u00A5', decimals: 0 },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '\u00A5', decimals: 2 },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', decimals: 2 },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', decimals: 2 },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', decimals: 2 },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', decimals: 2 },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', decimals: 2 },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', decimals: 2 },
  { code: 'KRW', name: 'South Korean Won', symbol: '\u20A9', decimals: 0 },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', decimals: 2 },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', decimals: 2 },
  { code: 'INR', name: 'Indian Rupee', symbol: '\u20B9', decimals: 2 },
  { code: 'MXN', name: 'Mexican Peso', symbol: 'MX$', decimals: 2 },
  { code: 'TWD', name: 'Taiwan Dollar', symbol: 'NT$', decimals: 0 },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', decimals: 2 },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', decimals: 2 },
  { code: 'DKK', name: 'Danish Krone', symbol: 'kr', decimals: 2 },
  { code: 'PLN', name: 'Polish Zloty', symbol: 'z\u0142', decimals: 2 },
  { code: 'THB', name: 'Thai Baht', symbol: '\u0E3F', decimals: 2 },
  { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp', decimals: 0 },
  { code: 'HUF', name: 'Hungarian Forint', symbol: 'Ft', decimals: 0 },
  { code: 'CZK', name: 'Czech Koruna', symbol: 'K\u010D', decimals: 2 },
  { code: 'ILS', name: 'Israeli Shekel', symbol: '\u20AA', decimals: 2 },
  { code: 'CLP', name: 'Chilean Peso', symbol: 'CL$', decimals: 0 },
  { code: 'PHP', name: 'Philippine Peso', symbol: '\u20B1', decimals: 2 },
  { code: 'AED', name: 'UAE Dirham', symbol: 'AED', decimals: 2 },
  { code: 'COP', name: 'Colombian Peso', symbol: 'COL$', decimals: 0 },
  { code: 'SAR', name: 'Saudi Riyal', symbol: 'SAR', decimals: 2 },
  { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM', decimals: 2 },
  { code: 'RON', name: 'Romanian Leu', symbol: 'lei', decimals: 2 },
  { code: 'BGN', name: 'Bulgarian Lev', symbol: 'лв', decimals: 2 },
  { code: 'ARS', name: 'Argentine Peso', symbol: 'AR$', decimals: 2 },
  { code: 'NGN', name: 'Nigerian Naira', symbol: '\u20A6', decimals: 2 },
  { code: 'EGP', name: 'Egyptian Pound', symbol: 'E\u00A3', decimals: 2 },
  { code: 'PKR', name: 'Pakistani Rupee', symbol: 'Rs', decimals: 0 },
  { code: 'VND', name: 'Vietnamese Dong', symbol: '\u20AB', decimals: 0 },
  { code: 'BDT', name: 'Bangladeshi Taka', symbol: '\u09F3', decimals: 2 },
  { code: 'QAR', name: 'Qatari Riyal', symbol: 'QR', decimals: 2 },
  { code: 'KWD', name: 'Kuwaiti Dinar', symbol: 'KD', decimals: 3 },
  { code: 'BHD', name: 'Bahraini Dinar', symbol: 'BD', decimals: 3 },
  { code: 'OMR', name: 'Omani Rial', symbol: 'OMR', decimals: 3 },
  { code: 'UAH', name: 'Ukrainian Hryvnia', symbol: '\u20B4', decimals: 2 },
  { code: 'PEN', name: 'Peruvian Sol', symbol: 'S/', decimals: 2 },
  { code: 'TRY', name: 'Turkish Lira', symbol: '\u20BA', decimals: 2 },
  { code: 'RUB', name: 'Russian Ruble', symbol: '\u20BD', decimals: 2 },
  { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh', decimals: 2 },
  { code: 'GHS', name: 'Ghanaian Cedi', symbol: 'GH\u20B5', decimals: 2 },
] as const;

export function getCurrency(code: string): CurrencyInfo {
  return CURRENCIES.find(c => c.code === code) ?? CURRENCIES[0];
}

export function formatCurrency(amount: number, currencyCode: string): string {
  const currency = getCurrency(currencyCode);
  const formatted = amount.toFixed(currency.decimals);
  return `${currency.symbol}${formatted}`;
}
