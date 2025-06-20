
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSupabaseError } from '@/hooks/useSupabaseError';
import { ErrorDisplay } from '@/components/ui/error-display';
import { supabase } from '@/integrations/supabase/client';

const CRUDTest = () => {
  const [testData, setTestData] = useState({
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    role: 'job_seeker' as const
  });
  
  const [results, setResults] = useState<string[]>([]);
  const { error, isLoading, executeWithErrorHandling, clearError } = useSupabaseError();

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testCreate = async () => {
    clearError();
    addResult('Test création utilisateur...');
    
    const result = await executeWithErrorHandling(async () => {
      const testUser = {
        id: crypto.randomUUID(),
        email: testData.email,
        first_name: testData.firstName,
        last_name: testData.lastName,
        role: testData.role
      };

      return await supabase
        .from('users')
        .insert(testUser)
        .select()
        .single();
    });

    if (result) {
      addResult(`✅ Utilisateur créé avec succès: ${result.email}`);
      return result;
    } else {
      addResult('❌ Échec de la création');
      return null;
    }
  };

  const testRead = async () => {
    clearError();
    addResult('Test lecture utilisateurs...');
    
    const result = await executeWithErrorHandling(async () => {
      return await supabase
        .from('users')
        .select('*')
        .limit(5);
    });

    if (result) {
      addResult(`✅ ${result.length} utilisateurs lus`);
    } else {
      addResult('❌ Échec de la lecture');
    }
  };

  const testUpdate = async () => {
    clearError();
    addResult('Test mise à jour...');
    
    // D'abord créer un utilisateur
    const user = await testCreate();
    if (!user) return;

    const result = await executeWithErrorHandling(async () => {
      return await supabase
        .from('users')
        .update({ first_name: 'Updated' })
        .eq('id', user.id)
        .select()
        .single();
    });

    if (result) {
      addResult(`✅ Utilisateur mis à jour: ${result.first_name}`);
      // Nettoyer
      await supabase.from('users').delete().eq('id', user.id);
    } else {
      addResult('❌ Échec de la mise à jour');
    }
  };

  const testDelete = async () => {
    clearError();
    addResult('Test suppression...');
    
    // D'abord créer un utilisateur
    const user = await testCreate();
    if (!user) return;

    const result = await executeWithErrorHandling(async () => {
      return await supabase
        .from('users')
        .delete()
        .eq('id', user.id)
        .select();
    });

    if (result) {
      addResult(`✅ Utilisateur supprimé avec succès`);
    } else {
      addResult('❌ Échec de la suppression');
    }
  };

  const runAllTests = async () => {
    setResults([]);
    addResult('🚀 Début des tests CRUD...');
    
    await testCreate();
    await testRead();
    await testUpdate();
    await testDelete();
    
    addResult('✨ Tests terminés');
  };

  const clearResults = () => {
    setResults([]);
    clearError();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Test des opérations CRUD</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="email">Email de test</Label>
            <Input
              id="email"
              value={testData.email}
              onChange={(e) => setTestData(prev => ({ ...prev, email: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="firstName">Prénom</Label>
            <Input
              id="firstName"
              value={testData.firstName}
              onChange={(e) => setTestData(prev => ({ ...prev, firstName: e.target.value }))}
            />
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          <Button onClick={runAllTests} disabled={isLoading}>
            Lancer tous les tests
          </Button>
          <Button variant="outline" onClick={testCreate} disabled={isLoading}>
            Test Create
          </Button>
          <Button variant="outline" onClick={testRead} disabled={isLoading}>
            Test Read
          </Button>
          <Button variant="outline" onClick={testUpdate} disabled={isLoading}>
            Test Update
          </Button>
          <Button variant="outline" onClick={testDelete} disabled={isLoading}>
            Test Delete
          </Button>
          <Button variant="secondary" onClick={clearResults}>
            Clear
          </Button>
        </div>

        {error && (
          <ErrorDisplay 
            error={error} 
            onDismiss={clearError}
            showDetails={true}
          />
        )}

        {results.length > 0 && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Résultats des tests:</h4>
            <div className="space-y-1 text-sm font-mono">
              {results.map((result, index) => (
                <div key={index} className="text-gray-700">
                  {result}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CRUDTest;
