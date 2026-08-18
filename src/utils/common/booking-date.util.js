export const formatBookingDate = (date) => {
  if (!date) {
    return "-";
  }

  return new Date(date).toLocaleDateString("en-PK", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const formatBookingTime = (time) => {
  if (!time) {
    return "-";
  }

  const formattedTime = new Date(
    `1970-01-01T${time}`
  );

  return formattedTime.toLocaleTimeString(
    "en-PK",
    {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }
  );
};

export const formatCurrency = (
  amount
) => {
  if (
    amount === null ||
    amount === undefined
  ) {
    return "-";
  }

  return new Intl.NumberFormat(
    "en-PK",
    {
      style: "currency",
      currency: "PKR",
      maximumFractionDigits: 0,
    }
  ).format(amount);
};