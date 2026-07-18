import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { logger, setErrorReporter } from './logger';

describe('logger', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'debug').mockImplementation(() => {});
  });

  afterEach(() => {
    setErrorReporter(null);
    vi.restoreAllMocks();
  });

  it('transmet les erreurs au reporter configuré', () => {
    const reporter = vi.fn();
    setErrorReporter(reporter);

    const error = new Error('boom');
    logger.error('échec envoi', error, { jobId: 'job-1' });

    expect(reporter).toHaveBeenCalledTimes(1);
    expect(reporter.mock.calls[0][0]).toBe(error);
  });

  it('masque les valeurs sensibles avant de les transmettre', () => {
    const reporter = vi.fn();
    setErrorReporter(reporter);

    logger.error('échec auth', new Error('x'), {
      password: 'hunter2',
      access_token: 'eyJ...',
      userId: 'user-1',
    });

    const context = reporter.mock.calls[0][1];
    expect(context.password).toBe('[redacted]');
    expect(context.access_token).toBe('[redacted]');
    expect(context.userId).toBe('user-1');
  });

  it('n’échoue pas si le reporter lève', () => {
    setErrorReporter(() => {
      throw new Error('reporter down');
    });

    expect(() => logger.error('échec', new Error('x'))).not.toThrow();
  });

  it('fabrique une erreur quand aucune n’est fournie', () => {
    const reporter = vi.fn();
    setErrorReporter(reporter);

    logger.error('échec sans exception');

    expect(reporter.mock.calls[0][0]).toBeInstanceOf(Error);
  });

  it('n’appelle pas le reporter pour un avertissement', () => {
    const reporter = vi.fn();
    setErrorReporter(reporter);

    logger.warn('attention');

    expect(reporter).not.toHaveBeenCalled();
  });
});
