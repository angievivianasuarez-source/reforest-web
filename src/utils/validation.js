export function validateRequired(value) {
  return String(value ?? '').trim().length > 0;
}

export function validatePositiveNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0;
}

export function validateEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value ?? '').trim());
}
