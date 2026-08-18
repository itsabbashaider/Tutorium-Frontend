export const BOOKING_DAYS = [
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
];

export const getDayName = (day) => {
  return (
    BOOKING_DAYS.find(
      (item) => item.value === Number(day)
    )?.label || "Unknown day"
  );
};

export const formatBookingDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleDateString([], {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const formatBookingDateTime = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleString([], {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

export const formatBookingTime = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
};

export const formatTimeValue = (value) => {
  if (!value) return "—";

  const normalized = String(value).slice(0, 5);

  const [hours, minutes] = normalized.split(":");

  if (
    hours === undefined ||
    minutes === undefined
  ) {
    return normalized;
  }

  const date = new Date();

  date.setHours(
    Number(hours),
    Number(minutes),
    0,
    0
  );

  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
};

export const formatBookingCurrency = (value) => {
  if (value === undefined || value === null) {
    return "—";
  }

  const amount = Number(value);

  if (Number.isNaN(amount)) {
    return "—";
  }

  return `Rs. ${amount.toLocaleString()}`;
};

export const getBookingStatusStyle = (status) => {
  const styles = {
    PENDING: {
      label: "Pending",
      className: "bg-amber-50 text-amber-700",
    },

    ACCEPTED: {
      label: "Accepted",
      className: "bg-blue-50 text-blue-700",
    },

    REJECTED: {
      label: "Rejected",
      className: "bg-red-50 text-red-700",
    },

    CANCELLED: {
      label: "Cancelled",
      className: "bg-gray-100 text-gray-600",
    },

    COMPLETED: {
      label: "Completed",
      className: "bg-green-50 text-green-700",
    },
  };

  return (
    styles[status] || {
      label: status || "Unknown",
      className: "bg-gray-100 text-gray-600",
    }
  );
};