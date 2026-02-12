export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function isEmail(value: string) {
  if (!value) return false;
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@"]+\.)+[^<>()[\]\\.,;:\s@"]{2,})$/i;
  return re.test(String(value).toLowerCase());
}

export function required(value: any) {
  return value !== undefined && value !== null && String(value).trim().length > 0;
}

export function minLength(value: string, len: number) {
  return typeof value === 'string' && value.length >= len;
}

export function validateRegister(data: { email?: string; password?: string; confirmPassword?: string; displayName?: string; }) : ValidationResult {
  const errors: string[] = [];
  if (!required(data.displayName)) errors.push('Full name is required');
  if (!required(data.email)) errors.push('Email is required');
  else if (!isEmail(data.email || '')) errors.push('Email is invalid');
  if (!required(data.password)) errors.push('Password is required');
  else if (!minLength(data.password || '', 6)) errors.push('Password must be at least 6 characters');
  if (data.password !== data.confirmPassword) errors.push('Passwords do not match');
  return { valid: errors.length === 0, errors };
}
