export const formatTime = (time) => {
  if (!time) {
    return "—";
  }

  const normalized = String(time).slice(0, 5);

  const [hours, minutes] =
    normalized.split(":");

  if (!hours || !minutes) {
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

export const formatTeachingMode = (mode) => {
  if (!mode) {
    return "Not specified";
  }

  return String(mode)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) =>
      char.toUpperCase()
    );
};


export const formatRating = (rating) => {
  const value = Number(rating);

  if (Number.isNaN(value)) {
    return "—";
  }

  return value.toFixed(1);
};