
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface DiagnosticResult {
  test: string;
  status: 'success' | 'error' | 'warning';
  message: string;
  details?: any;
}

const SupabaseDiagnostic = () => {
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runDiagnostics = async () => {
    setIsRunning(true);
    const diagnostics: DiagnosticResult[] = [];

    // Test 1: Configuration Supabase
    try {
      const config = {
        url: supabase.supabaseUrl,
        key: supabase.supabaseKey ? 'Configurée' : 'Manquante'
      };
      
      diagnostics.push({
        test: 'Configuration Supabase',
        status: config.key === 'Configurée' ? 'success' : 'error',
        message: `URL: ${config.url}, Clé: ${config.key}`,
        details: config
      });
    } catch (error) {
      diagnostics.push({
        test: 'Configuration Supabase',
        status: 'error',
        message: 'Erreur de configuration',
        details: error
      });
    }

    // Test 2: Connexion réseau
    try {
      const { data, error } = await supabase.from('users').select('count').limit(1);
      diagnostics.push({
        test: 'Connexion réseau',
        status: error ? 'error' : 'success',
        message: error ? `Erreur: ${error.message}` : 'Connexion réussie',
        details: { data, error }
      });
    } catch (error) {
      diagnostics.push({
        test: 'Connexion réseau',
        status: 'error',
        message: 'Échec de connexion',
        details: error
      });
    }

    // Test 3: Authentication
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      diagnostics.push({
        test: 'Authentication',
        status: user ? 'success' : 'warning',
        message: user ? `Utilisateur connecté: ${user.email}` : 'Aucun utilisateur connecté',
        details: { user, error }
      });
    } catch (error) {
      diagnostics.push({
        test: 'Authentication',
        status: 'error',
        message: 'Erreur d\'authentification',
        details: error
      });
    }

    // Test 4: Permissions RLS sur les tables principales
    const tables = ['users', 'jobs', 'applications', 'messages', 'conversations'];
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase.from(table).select('*').limit(1);
        diagnostics.push({
          test: `Permissions RLS - ${table}`,
          status: error ? 'error' : 'success',
          message: error ? `Erreur: ${error.message}` : `Accès autorisé (${data?.length || 0} enregistrements)`,
          details: { table, data, error }
        });
      } catch (error) {
        diagnostics.push({
          test: `Permissions RLS - ${table}`,
          status: 'error',
          message: 'Erreur d\'accès',
          details: { table, error }
        });
      }
    }

    // Test 5: Test d'insertion simple
    try {
      const testData = {
        id: crypto.randomUUID(),
        email: 'test@diagnostic.com',
        role: 'job_seeker' as const,
        first_name: 'Test',
        last_name: 'Diagnostic'
      };

      const { data, error } = await supabase.from('users').insert(testData).select();
      
      if (!error) {
        // Nettoyer le test
        await supabase.from('users').delete().eq('id', testData.id);
        
        diagnostics.push({
          test: 'Test d\'insertion',
          status: 'success',
          message: 'Insertion et suppression réussies',
          details: { data }
        });
      } else {
        diagnostics.push({
          test: 'Test d\'insertion',
          status: 'error',
          message: `Erreur d'insertion: ${error.message}`,
          details: { error }
        });
      }
    } catch (error) {
      diagnostics.push({
        test: 'Test d\'insertion',
        status: 'error',
        message: 'Erreur lors du test d\'insertion',
        details: error
      });
    }

    setResults(diagnostics);
    setIsRunning(false);
  };

  const getStatusIcon = (status: DiagnosticResult['status']) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error': return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: DiagnosticResult['status']) => {
    switch (status) {
      case 'success': return 'border-green-200 bg-green-50';
      case 'error': return 'border-red-200 bg-red-50';
      case 'warning': return 'border-yellow-200 bg-yellow-50';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Diagnostic Supabase</CardTitle>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={runDiagnostics} 
            disabled={isRunning}
            className="mb-4"
          >
            {isRunning ? 'Diagnostic en cours...' : 'Lancer le diagnostic'}
          </Button>

          {results.length > 0 && (
            <div className="space-y-3">
              {results.map((result, index) => (
                <Alert key={index} className={getStatusColor(result.status)}>
                  <div className="flex items-start gap-3">
                    {getStatusIcon(result.status)}
                    <div className="flex-1">
                      <div className="font-medium">{result.test}</div>
                      <AlertDescription className="mt-1">
                        {result.message}
                      </AlertDescription>
                      {result.details && (
                        <details className="mt-2">
                          <summary className="cursor-pointer text-sm text-gray-600">
                            Détails techniques
                          </summary>
                          <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                            {JSON.stringify(result.details, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                </Alert>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SupabaseDiagnostic;
