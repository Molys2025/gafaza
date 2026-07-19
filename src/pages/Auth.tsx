
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/hooks/useAuth';
import { Eye, EyeOff, Mail, MessageCircle } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

// Normalise un numéro tunisien vers le format E.164 (+216XXXXXXXX).
const normalizePhone = (raw: string): string => {
  const digits = raw.replace(/[^\d+]/g, '');
  if (digits.startsWith('+')) return digits;
  if (digits.startsWith('216')) return `+${digits}`;
  return `+216${digits}`;
};

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [role, setRole] = useState<'job_seeker' | 'work_provider'>('job_seeker');
  // Flux OTP téléphone (WhatsApp)
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  const { signIn, signUp, signInWithGoogle, sendPhoneOtp, verifyPhoneOtp } = useAuth();
  const navigate = useNavigate();

  const handleGoogle = async () => {
    setError('');
    setLoading(true);
    try {
      // signInWithOAuth redirige le navigateur vers Google ; en cas de succès
      // la promesse résout après le lancement de la redirection.
      await signInWithGoogle();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!phone) {
      setError('Veuillez saisir votre numéro de téléphone');
      return;
    }
    setLoading(true);
    try {
      const ok = await sendPhoneOtp(normalizePhone(phone), isLogin ? undefined : role);
      if (ok) setOtpSent(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (otpCode.length < 6) {
      setError('Le code doit contenir 6 chiffres');
      return;
    }
    setLoading(true);
    try {
      const ok = await verifyPhoneOtp(normalizePhone(phone), otpCode);
      if (ok) navigate('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Choix de la méthode : email/mot de passe ou WhatsApp OTP */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <Button
              type="button"
              variant={authMethod === 'email' ? 'default' : 'outline'}
              className={authMethod === 'email' ? 'bg-olive hover:bg-olive-dark text-white' : ''}
              onClick={() => { setAuthMethod('email'); setError(''); setOtpSent(false); }}
            >
              <Mail className="mr-2 h-4 w-4" /> Email
            </Button>
            <Button
              type="button"
              variant={authMethod === 'phone' ? 'default' : 'outline'}
              className={authMethod === 'phone' ? 'bg-olive hover:bg-olive-dark text-white' : ''}
              onClick={() => { setAuthMethod('phone'); setError(''); }}
            >
              <MessageCircle className="mr-2 h-4 w-4" /> WhatsApp
            </Button>
          </div>

          {authMethod === 'phone' ? (
            otpSent ? (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp">Code reçu sur WhatsApp</Label>
                  <Input
                    id="otp"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456"
                    autoFocus
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Code envoyé au {normalizePhone(phone)}.
                  </p>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-olive hover:bg-olive-dark text-white"
                  disabled={loading}
                >
                  {loading ? 'Vérification...' : 'Vérifier le code'}
                </Button>
                <div className="flex justify-between text-sm">
                  <Button
                    type="button"
                    variant="link"
                    className="text-olive px-0"
                    onClick={() => { setOtpSent(false); setOtpCode(''); setError(''); }}
                  >
                    Modifier le numéro
                  </Button>
                  <Button
                    type="button"
                    variant="link"
                    className="text-olive px-0"
                    disabled={loading}
                    onClick={() => handleSendOtp({ preventDefault: () => {} } as React.FormEvent)}
                  >
                    Renvoyer
                  </Button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Numéro de téléphone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+216 20 123 456"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Un code à 6 chiffres vous sera envoyé sur WhatsApp.
                  </p>
                </div>

                {!isLogin && (
                  <div className="space-y-2">
                    <Label>Je souhaite m'inscrire en tant que</Label>
                    <RadioGroup
                      value={role}
                      onValueChange={(v) => setRole(v as 'job_seeker' | 'work_provider')}
                      className="grid grid-cols-2 gap-2"
                    >
                      <label
                        htmlFor="role-harvester-phone"
                        className={`flex items-start gap-2 rounded-md border p-3 cursor-pointer ${
                          role === 'job_seeker' ? 'border-olive bg-olive/5' : 'border-input'
                        }`}
                      >
                        <RadioGroupItem value="job_seeker" id="role-harvester-phone" className="mt-0.5" />
                        <span className="flex flex-col">
                          <span className="text-sm font-medium">Cueilleur</span>
                          <span className="text-xs text-muted-foreground">Je cherche du travail de récolte et je candidate aux annonces.</span>
                        </span>
                      </label>
                      <label
                        htmlFor="role-owner-phone"
                        className={`flex items-start gap-2 rounded-md border p-3 cursor-pointer ${
                          role === 'work_provider' ? 'border-olive bg-olive/5' : 'border-input'
                        }`}
                      >
                        <RadioGroupItem value="work_provider" id="role-owner-phone" className="mt-0.5" />
                        <span className="flex flex-col">
                          <span className="text-sm font-medium">Propriétaire</span>
                          <span className="text-xs text-muted-foreground">Je publie des annonces et je recrute des cueilleurs.</span>
                        </span>
                      </label>
                    </RadioGroup>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-olive hover:bg-olive-dark text-white"
                  disabled={loading}
                >
                  {loading ? 'Envoi...' : 'Recevoir le code'}
                </Button>
              </form>
            )
          ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
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
          )}

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">ou</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGoogle}
            disabled={loading}
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.1a6.6 6.6 0 0 1 0-4.22V7.04H2.18a11 11 0 0 0 0 9.9l3.66-2.84z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.04l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
              />
            </svg>
            Continuer avec Google
          </Button>

          <div className="mt-4 text-center">
            <Button
              variant="link"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');
                setOtpSent(false);
                setOtpCode('');
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
