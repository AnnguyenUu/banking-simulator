export class CurrencyBuilder {
  private currency!: string;
  private locales!: string;
  private maxDigit!: number;

  withCurrency = (currency: string) => {
    this.currency = currency;
    return this;
  };

  withLocales = (locales: string) => {
    this.locales = locales;
    return this;
  };

  withMaxDigit = (maxDigit: number) => {
    this.maxDigit = maxDigit;
    return this;
  };

  format = (value: number) => {
    if (Number.isNaN(value)) {
      return "";
    }

    return new Intl.NumberFormat(this.locales, {
      style: "currency",
      currency: this.currency,
      maximumFractionDigits: this.maxDigit,
    }).format(value);
  };
}

export const formatCurrency = (value: number) => {
  const currency = new CurrencyBuilder()
  return currency
    .withLocales("en-US")
    .withCurrency("USD")
    .withMaxDigit(2)
    .format(value);
};
