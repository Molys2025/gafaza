/**
 * Centralised logging.
 *
 * Debug output is silenced in production builds, while warnings and errors
 * always go through a single place. Point `setErrorReporter` at Sentry (or any
 * other collector) once there is an account, and every existing call site
 * starts reporting without further edits.
 */

type LogContext = Record<string, unknown>;

type ErrorReporter = (error: unknown, context?: LogContext) => void;

let errorReporter: ErrorReporter | null = null;

/** Wires an external collector, e.g. Sentry.captureException. */
export const setErrorReporter = (reporter: ErrorReporter | null): void => {
  errorReporter = reporter;
};

const isProduction = import.meta.env.PROD;

/** Keys whose values must never leave the browser in a log line. */
const SENSITIVE_KEYS = /^(password|token|access_token|refresh_token|apikey|api_key|secret|authorization)$/i;

const redact = (context?: LogContext): LogContext | undefined => {
  if (!context) return undefined;

  return Object.fromEntries(
    Object.entries(context).map(([key, value]) =>
      SENSITIVE_KEYS.test(key) ? [key, '[redacted]'] : [key, value],
    ),
  );
};

export const logger = {
  /** Development-only noise; stripped from production builds. */
  debug(message: string, context?: LogContext): void {
    if (!isProduction) {
      console.debug(`[gafaza] ${message}`, redact(context) ?? '');
    }
  },

  info(message: string, context?: LogContext): void {
    if (!isProduction) {
      console.info(`[gafaza] ${message}`, redact(context) ?? '');
    }
  },

  warn(message: string, context?: LogContext): void {
    console.warn(`[gafaza] ${message}`, redact(context) ?? '');
  },

  /** Always logged, and forwarded to the reporter when one is configured. */
  error(message: string, error?: unknown, context?: LogContext): void {
    console.error(`[gafaza] ${message}`, error ?? '', redact(context) ?? '');

    if (errorReporter) {
      try {
        errorReporter(error ?? new Error(message), { message, ...redact(context) });
      } catch (reporterError) {
        console.error('[gafaza] error reporter failed', reporterError);
      }
    }
  },
};
