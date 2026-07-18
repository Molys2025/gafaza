import { describe, it, expect, vi, beforeEach } from 'vitest';

const state: { result: { data: unknown; error: unknown } } = {
  result: { data: null, error: null },
};

const builder: Record<string, unknown> = {};
for (const method of ['insert', 'select', 'eq', 'order']) {
  builder[method] = vi.fn(() => builder);
}
builder.single = vi.fn(() => Promise.resolve(state.result));
builder.maybeSingle = vi.fn(() => Promise.resolve(state.result));

vi.mock('@/integrations/supabase/client', () => ({
  supabase: { from: vi.fn(() => builder) },
}));

const { createRating, getOverallScore, RATING_CRITERIA } = await import('./ratingService');

const input = {
  applicationId: 'app-1',
  ratedId: 'user-2',
  ratingType: 'work_provider' as const,
  scores: { overall: 5 },
};

beforeEach(() => {
  state.result = { data: null, error: null };
});

describe('createRating', () => {
  it('renvoie l’évaluation créée', async () => {
    state.result = { data: { id: 'rating-1' }, error: null };
    await expect(createRating('user-1', input)).resolves.toEqual({ id: 'rating-1' });
  });

  it('traduit le doublon', async () => {
    state.result = { data: null, error: { code: '23505', message: 'duplicate key' } };
    await expect(createRating('user-1', input)).rejects.toThrow(/déjà évalué/i);
  });

  it('traduit le refus RLS en « mission non terminée »', async () => {
    state.result = {
      data: null,
      error: { code: '42501', message: 'new row violates row-level security policy' },
    };
    await expect(createRating('user-1', input)).rejects.toThrow(/mission (soit )?termin/i);
  });

  it('traduit une note hors bornes', async () => {
    state.result = {
      data: null,
      error: { code: 'P0001', message: 'Rating scores must be between 1 and 5' },
    };
    await expect(createRating('user-1', input)).rejects.toThrow(/entre 1 et 5/);
  });
});

describe('getOverallScore', () => {
  const base = { id: 'r', scores: null } as never;

  it('extrait la note globale', () => {
    expect(getOverallScore({ ...(base as object), scores: { overall: 4 } } as never)).toBe(4);
  });

  it('renvoie null si la note est absente', () => {
    expect(getOverallScore({ ...(base as object), scores: {} } as never)).toBeNull();
  });

  it('renvoie null si scores est nul', () => {
    expect(getOverallScore(base)).toBeNull();
  });

  it('renvoie null si la note n’est pas numérique', () => {
    expect(getOverallScore({ ...(base as object), scores: { overall: '4' } } as never)).toBeNull();
  });
});

describe('RATING_CRITERIA', () => {
  it('propose des critères distincts selon la partie notée', () => {
    const providerKeys = RATING_CRITERIA.work_provider.map(c => c.key);
    const seekerKeys = RATING_CRITERIA.job_seeker.map(c => c.key);
    expect(providerKeys).not.toEqual(seekerKeys);
    expect(providerKeys.length).toBeGreaterThan(0);
    expect(seekerKeys.length).toBeGreaterThan(0);
  });

  it('n’inclut pas overall, déjà saisi séparément', () => {
    for (const criteria of Object.values(RATING_CRITERIA)) {
      expect(criteria.map(c => c.key)).not.toContain('overall');
    }
  });
});
