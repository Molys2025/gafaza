
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/hooks/useAuth';
import { Eye, EyeOff } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [role, setRole] = useState<'job_seeker' | 'work_provider'>('job_seeker');
  
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Veuillez remplir tous les champs');
      setLoading(false);
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    try {
      let success = false;
      
      if (isLogin) {
        success = await signIn(email, password);
      } else {
        success = await signUp(email, password, role);
      }

      if (success) {
        navigate('/');
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-sand-light flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center text-olive-dark">
            {isLogin ? 'Connexion' : 'Créer un compte'}
          </CardTitle>
          <CardDescription className="text-center">
            {isLogin 
              ? 'Connectez-vous à votre compte Zeytna'
              : 'Rejoignez la communauté Zeytna'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
            )}

            {!isLogin && (
              <div className="space-y-2">
                <Label>Je souhaite m'inscrire en tant que</Label>
                <RadioGroup
                  value={role}
                  onValueChange={(v) => setRole(v as 'job_seeker' | 'work_provider')}
                  className="grid grid-cols-2 gap-2"
                >
                  <label
                    htmlFor="role-harvester"
                    className={`flex items-start gap-2 rounded-md border p-3 cursor-pointer ${
                      role === 'job_seeker' ? 'border-olive bg-olive/5' : 'border-input'
                    }`}
                  >
                    <RadioGroupItem value="job_seeker" id="role-harvester" className="mt-0.5" />
                    <span className="flex flex-col">
                      <span className="text-sm font-medium">Cueilleur</span>
                      <span className="text-xs text-muted-foreground">Je cherche du travail de récolte et je candidate aux annonces.</span>
                    </span>
                  </label>
                  <label
                    htmlFor="role-owner"
                    className={`flex items-start gap-2 rounded-md border p-3 cursor-pointer ${
                      role === 'work_provider' ? 'border-olive bg-olive/5' : 'border-input'
                    }`}
                  >
                    <RadioGroupItem value="work_provider" id="role-owner" className="mt-0.5" />
                    <span className="flex flex-col">
                      <span className="text-sm font-medium">Propriétaire</span>
                      <span className="text-xs text-muted-foreground">Je publie des annonces et je recrute des cueilleurs.</span>
                    </span>
                  </label>
                </RadioGroup>
                <p className="text-xs text-muted-foreground">Ce choix définit votre espace ; vous pourrez le modifier plus tard.</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-olive hover:bg-olive-dark text-white"
              disabled={loading}
            >
              {loading ? 'Chargement...' : (isLogin ? 'Se connecter' : 'Créer un compte')}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <Button
              variant="link"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');
              }}
              className="text-olive hover:text-olive-dark"
            >
              {isLogin 
                ? "Pas de compte ? Créer un compte"
                : "Déjà un compte ? Se connecter"
              }
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
