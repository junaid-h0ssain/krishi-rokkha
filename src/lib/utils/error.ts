export function formatError(err: any) {
  if (!err) return 'Unknown error';
  if (typeof err === 'string') return err;
  if (err.message) return err.message;
  try {
    return JSON.stringify(err);
  } catch (e) {
    return String(err);
  }
}

export function logError(err: any, context?: Record<string, any>) {
  const message = formatError(err);
  // Console log for now; replace with remote logging (Sentry, etc.) if available
  console.error('[AppError]', message, context || {});
}
