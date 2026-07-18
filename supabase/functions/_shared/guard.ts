// Shared guards for Edge Functions: authentication and rate limiting.
//
// The OpenAI-backed functions are the expensive ones. Without a check, anyone
// holding the public anon key (it ships in the browser bundle) can call them in
// a loop and burn the account's credits, so they must require a real signed-in
// user and cap how often each one can call.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
};

export const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

/**
 * Resolves the caller from the Authorization header.
 * Returns null when the token is missing or invalid; callers should answer 401.
 */
export const getAuthenticatedUser = async (req: Request): Promise<{ id: string } | null> => {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;

  const token = authHeader.replace('Bearer ', '');

  // The anon key itself is a valid JWT but carries no user, so getUser()
  // rejecting it is exactly the behaviour we want here.
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    { global: { headers: { Authorization: authHeader } } },
  );

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) return null;

  return { id: data.user.id };
};

interface RateLimitBucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, RateLimitBucket>();

/**
 * Fixed-window rate limit, per function instance.
 *
 * Edge instances are ephemeral and there can be several at once, so this is a
 * mitigation rather than a hard quota: it stops a single client hammering one
 * instance. A shared counter (Postgres or Redis) is the next step if abuse
 * actually shows up.
 */
export const checkRateLimit = (
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number },
): { allowed: boolean; retryAfterSeconds: number } => {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now >= bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (bucket.count >= limit) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
    };
  }

  bucket.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
};

/** Opportunistic cleanup so the map does not grow without bound. */
export const pruneRateLimitBuckets = (): void => {
  const now = Date.now();
  for (const [key, bucket] of buckets) {
    if (now >= bucket.resetAt) buckets.delete(key);
  }
};

/**
 * Authentication + rate limit in one call.
 * Returns a ready-to-send Response when the request must be rejected.
 */
export const guardRequest = async (
  req: Request,
  { limit, windowMs }: { limit: number; windowMs: number },
): Promise<{ user: { id: string } } | { response: Response }> => {
  const user = await getAuthenticatedUser(req);

  if (!user) {
    return { response: jsonResponse({ error: 'Authentication required' }, 401) };
  }

  pruneRateLimitBuckets();
  const { allowed, retryAfterSeconds } = checkRateLimit(user.id, { limit, windowMs });

  if (!allowed) {
    return {
      response: new Response(
        JSON.stringify({ error: 'Trop de requêtes, réessayez dans un instant.' }),
        {
          status: 429,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
            'Retry-After': String(retryAfterSeconds),
          },
        },
      ),
    };
  }

  return { user };
};
