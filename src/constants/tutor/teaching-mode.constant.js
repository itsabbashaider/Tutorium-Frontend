export const TEACHING_MODES = {
  ONLINE: "ONLINE",
  IN_PERSON: "IN_PERSON",
  BOTH: "BOTH",
};

export const TEACHING_MODE_LABELS = {
  [TEACHING_MODES.ONLINE]: "Remote",
  [TEACHING_MODES.IN_PERSON]: "Onsite",
  [TEACHING_MODES.BOTH]: "Hybrid",
};

export const TEACHING_MODE_OPTIONS = [
  { value: TEACHING_MODES.ONLINE, label: "Remote" },
  { value: TEACHING_MODES.IN_PERSON, label: "Onsite" },
  { value: TEACHING_MODES.BOTH, label: "Hybrid" },
];