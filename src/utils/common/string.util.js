const capitalize = (value = "") => {
  if (!value) return "";

  return value.charAt(0).toUpperCase() + value.slice(1);
};

const titleCase = (value = "") => {
  return value
    .trim()
    .split(" ")
    .filter(Boolean)
    .map(capitalize)
    .join(" ");
};

const truncate = (value = "", length = 100) => {
  if (value.length <= length) {
    return value;
  }

  return `${value.slice(0, length)}...`;
};


const string = {
  capitalize,
  titleCase,
  truncate,
};

export default string;