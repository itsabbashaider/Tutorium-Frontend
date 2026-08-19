const currency = {
  format(
    amount,
    locale = "en-US",
    currencyCode = "PKR"
  ) {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currencyCode,
    }).format(amount);
  },
};

export default currency;