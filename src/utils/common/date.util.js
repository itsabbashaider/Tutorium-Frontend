import {
  format,
  formatDistanceToNow,
} from "date-fns";

export const date = {
  format(value, pattern = "dd MMM yyyy") {
    return format(new Date(value), pattern);
  },

  relative(value) {
    return formatDistanceToNow(
      new Date(value),
      {
        addSuffix: true,
      }
    );
  },

  time(value) {
    return format(
      new Date(value),
      "hh:mm a"
    );
  },

  dateTime(value) {
    return format(
      new Date(value),
      "dd MMM yyyy, hh:mm a"
    );
  },
};

export const formatTimeForInput = (time) => {
  if (!time) return "";

  return String(time).slice(0, 5);
};

export const normalizeTime = (time) => {
  if (!time) return "";

  return String(time).slice(0, 5);
};