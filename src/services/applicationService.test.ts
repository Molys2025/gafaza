import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * The service talks to Supabase through a fluent builder, so the mock returns
 * itself for every chained call and resolves with whatever the test queued.
 */
const state: { result: { data: unknown; error: unknown } } = {
  result: { data: null, error: null },
};

const builder: Record<string, unknown> = {};
for (const method of ['insert', 'select', 'update', 'eq', 'neq', 'in', 'order']) {
  builder[method] = vi.fn(() => builder);
}
builder.single = vi.fn(() => Promise.resolve(state.result));
builder.maybeSingle = vi.fn(() => Promise.resolve(state.result));
builder.then = undefined;

const rpcMock = vi.fn(() => Promise.resolve(state.result));

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => builder),
    rpc: (...args: unknown[]) => rpcMock(...(args as [])),
  },
}));

const { applyToJob, completeApplication } = await import('./applicationService');

beforeEach(() => {
  state.result = { data: null, error: null };
  rpcMock.mockClear();
});

describe('applyToJob', () => {
  it('renvoie la candidature créée', async () => {
    state.result = { data: { id: 'app-1', status: 'pending' }, error: null };
    const application = await applyToJob('seeker-1', { jobId: 'job-1' });
    expect(application).toEqual({ id: 'app-1', status: 'pending' });
  });

  it('traduit la violation d’unicité en message métier', async () => {
    state.result = { data: null, error: { code: '23505', message: 'duplicate key' } };
    await expect(applyToJob('seeker-1', { jobId: 'job-1' })).rejects.toThrow(
      /déjà candidaté/i,
    );
  });

  it('traduit le refus du trigger de disponibilité', async () => {
    state.result = {
      data: null,
      error: { code: 'P0001', message: 'This job is no longer accepting applications' },
    };
    await expect(applyToJob('seeker-1', { jobId: 'job-1' })).rejects.toThrow(
      /n'accepte plus de candidatures/i,
    );
  });

  it('remonte les autres erreurs telles quelles', async () => {
    state.result = { data: null, error: { code: '42501', message: 'permission denied' } };
    await expect(applyToJob('seeker-1', { jobId: 'job-1' })).rejects.toThrow(
      /permission denied/,
    );
  });
});

describe('completeApplication', () => {
  it('appelle la RPC complete_application', async () => {
    state.result = { data: null, error: null };
    await completeApplication('app-1');
    expect(rpcMock).toHaveBeenCalledWith('complete_application', {
      application_id_param: 'app-1',
    });
  });

  it('traduit le refus « propriétaire seulement »', async () => {
    state.result = {
      data: null,
      error: { message: 'only the job owner can complete this application' },
    };
    await expect(completeApplication('app-1')).rejects.toThrow(/propriétaire/i);
  });

  it('traduit le refus « candidature non acceptée »', async () => {
    state.result = {
      data: null,
      error: { message: 'only an accepted application can be completed' },
    };
    await expect(completeApplication('app-1')).rejects.toThrow(/acceptée/i);
  });
});
