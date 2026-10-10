export const SECURITY_QUESTIONS_MAP = {
  mother_maiden_name: {
    id: 'mother_maiden_name',
    text: "What is your mother's maiden name?",
  },
  first_pet_name: {
    id: 'first_pet_name',
    text: "What was your first pet's name?",
  },
  birth_city: {
    id: 'birth_city',
    text: 'In what city were you born?',
  },
  favorite_book: {
    id: 'favorite_book',
    text: 'What is your favorite book?',
  },
  high_school_name: {
    id: 'high_school_name',
    text: 'What was the name of your high school?',
  },
  favorite_teacher: {
    id: 'favorite_teacher',
    text: 'Who was your favorite teacher in school?',
  },
};

// Formatted as options array for your Select components
export const SECURITY_QUESTION_OPTIONS = Object.values(SECURITY_QUESTIONS_MAP).map((q) => ({
  value: q.text,
  label: q.text,
}));