
import { useState } from 'react';
import { PostgrestError } from '@supabase/supabase-js';

export interface SupabaseErrorInfo {
  message: string;
  details?: string;
  hint?: string;
  code?: string;
}

export const useSupabaseError = () => {
  const [error, setError] = useState<SupabaseErrorInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleError = (error: PostgrestError | Error | null) => {
    if (!error) {
      setError(null);
      return;
    }

    console.error('Supabase Error:', error);

    if ('code' in error) {
      // PostgrestError
      const pgError = error as PostgrestError;
      setError({
        message: pgError.message,
        details: pgError.details,
        hint: pgError.hint,
        code: pgError.code
      });
    } else {
      // Generic Error
      setError({
        message: error.message,
        details: error.toString()
      });
    }
  };

  const clearError = () => setError(null);

  const executeWithErrorHandling = async <T>(
    operation: () => Promise<{ data: T | null; error: PostgrestError | null }>
  ): Promise<T | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await operation();
      
      if (error) {
        handleError(error);
        return null;
      }

      return data;
    } catch (err) {
      handleError(err as Error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    error,
    isLoading,
    handleError,
    clearError,
    executeWithErrorHandling
  };
};
