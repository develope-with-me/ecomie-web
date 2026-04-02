import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { Heart, Mail, Lock, User, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import ecomieLogo from "@/images/ecomie-logo.png";
import {isNonNullArray} from "@/lib/utils";
import { useTranslation } from 'react-i18next';

const loginSchema = z.object({
  email: z.string().trim().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const signupSchema = z.object({
  firstName: z.string().trim().min(1, { message: "First name is required" }).max(50),
  lastName: z.string().trim().min(1, { message: "Last name is required" }).max(50),
  email: z.string().trim().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const emailSchema = z.object({
  email: z.string().trim().email({ message: "Invalid email address" }),
});

type AuthView = 'login' | 'signup' | 'forgotPassword' | 'resendConfirmation';

const Auth = () => {
  const [view, setView] = useState<AuthView>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { signIn, signUp, user, loading, forgotPassword, resendConfirmationEmail } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const validation = loginSchema.safeParse({ email, password });
      if (!validation.success) {
        toast({
          title: t("auth.validationError"),
          description: validation.error.errors[0].message,
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      const result = await signIn(email, password);
      if (result.error) {
        toast({
          title: t("auth.loginFailed"),
          description: isNonNullArray(result.error.invalidParams) ? result.error.invalidParams[0].reason : result.error.detail || result.error.message,
          variant: "destructive",
        });
      } else if (result.success === false) {
        toast({
          title: t("auth.loginFailed"),
          description: result.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: t("auth.welcomeBackMessage"),
          description: t("auth.loggedInSuccessfully"),
        });
        navigate('/dashboard');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const validation = signupSchema.safeParse({ firstName, lastName, email, password });
      if (!validation.success) {
        toast({
          title: t("auth.validationError"),
          description: validation.error.errors[0].message,
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      const { error } = await signUp(email, password, firstName, lastName);

      if (!error) {
          toast({
              title: t("auth.welcomeToEcomie"),
              description: t("auth.accountCreated"),
          });
          navigate('/dashboard');
      } else if(error.title === "Unique Constraint") {
          toast({
              title: t("auth.accountExists"),
              description: t("auth.emailAlreadyRegistered"),
              variant: "destructive",
          });
      } else {
          toast({
              title: t("auth.signUpFailed"),
              description: isNonNullArray(error.invalidParams)  ? error.invalidParams[0].reason : error.detail,
              variant: "destructive",
          });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const validation = emailSchema.safeParse({ email });
      if (!validation.success) {
        toast({
          title: t("auth.validationError"),
          description: validation.error.errors[0].message,
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      const { error } = await forgotPassword(email);
      if (error) {
        toast({
          title: t("auth.passwordResetFailed"),
          description: isNonNullArray(error.invalidParams)  ? error.invalidParams[0].reason : error.detail,
          variant: "destructive",
        });
      } else {
        toast({
          title: t("auth.passwordResetLinkSent"),
          description: t("auth.checkYourEmailForResetLink"),
        });
        setView('login');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendConfirmationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const validation = emailSchema.safeParse({ email });
      if (!validation.success) {
        toast({
          title: t("auth.validationError"),
          description: validation.error.errors[0].message,
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      const { error } = await resendConfirmationEmail(email);
      if (error) {
        toast({
          title: t("auth.resendConfirmationFailed"),
          description: isNonNullArray(error.invalidParams)  ? error.invalidParams[0].reason : error.detail,
          variant: "destructive",
        });
      } else {
        toast({
          title: t("auth.confirmationLinkSent"),
          description: t("auth.checkYourEmailForConfirmationLink"),
        });
        setView('login');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    switch (view) {
      case 'login':
        return handleLoginSubmit(e);
      case 'signup':
        return handleSignupSubmit(e);
      case 'forgotPassword':
        return handleForgotPasswordSubmit(e);
      case 'resendConfirmation':
        return handleResendConfirmationSubmit(e);
      default:
        return handleLoginSubmit(e);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setFirstName('');
    setLastName('');
  };

  const handleViewChange = (newView: AuthView) => {
    resetForm();
    setView(newView);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-heavenly">
        <div className="animate-pulse text-primary">{t("common.loading")}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-heavenly">
      <header className="bg-primary/95 backdrop-blur-md shadow-gentle">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 bg-gradient-heavenly rounded-full flex items-center justify-center shadow-gentle">
              <img src={ecomieLogo} className="w-full h-full" alt="ECOMIE Logo"/>
            </div>
            <span className="text-xl font-bold text-primary-foreground">ECOMIE</span>
          </div>
        </div>
      </header>

      <div className="flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("auth.backToHome")}
          </Button>

          <Card className="border-0 shadow-divine">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-divine rounded-full flex items-center justify-center shadow-gentle">
                    <img src={ecomieLogo} className="w-6 h-6" alt="ECOMIE Logo"/>
                </div>
              </div>
              <h1 className="text-2xl font-bold text-foreground">
              {view === 'login' && t("auth.welcomeBack")}
              {view === 'signup' && t("auth.joinEcomie")}
              {view === 'forgotPassword' && t("auth.forgotPassword")}
              {view === 'resendConfirmation' && t("auth.resendConfirmation")}
            </h1>
            <p className="text-muted-foreground">
              {view === 'login' && t("auth.signInToContinue")}
              {view === 'signup' && t("auth.createAccountToStart")}
              {view === 'forgotPassword' && t("auth.enterEmailToResetPassword")}
              {view === 'resendConfirmation' && t("auth.enterEmailToResendConfirmation")}
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {view === 'signup' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">{t("common.firstName")}</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="John"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">{t("common.lastName")}</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="Doe"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">{t("common.email")}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {view !== 'forgotPassword' && view !== 'resendConfirmation' && (
                <div className="space-y-2">
                  <Label htmlFor="password">{t("auth.password")}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              )}

              <Button 
                type="submit" 
                variant="cta" 
                className="w-full" 
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting 
                  ? t("auth.pleaseWait") 
                  : view === 'login' && t("auth.signIn")
                  || view === 'signup' && t("auth.createAccount")
                  || view === 'forgotPassword' && t("auth.sendResetLink")
                  || view === 'resendConfirmation' && t("auth.resendLink")}
              </Button>
            </form>

            <div className="mt-6 text-center space-y-2">
              {view === 'login' && (
                <>
                  <button
                    onClick={() => handleViewChange('forgotPassword')}
                    className="text-primary font-medium hover:underline text-sm"
                  >
                    {t("auth.forgotPassword")}
                  </button>
                  <p className="text-muted-foreground">
                    {t("auth.dontHaveAccount")}
                    <button
                      onClick={() => handleViewChange('signup')}
                      className="ml-2 text-primary font-medium hover:underline"
                    >
                      {t("auth.signUp")}
                    </button>
                  </p>
                </>
              )}

              {view === 'signup' && (
                <>
                  <p className="text-muted-foreground">
                    {t("auth.alreadyHaveAccount")}
                    <button
                      onClick={() => handleViewChange('login')}
                      className="ml-2 text-primary font-medium hover:underline"
                    >
                      {t("auth.signInLink")}
                    </button>
                  </p>
                  <button
                    onClick={() => handleViewChange('resendConfirmation')}
                    className="text-primary font-medium hover:underline text-sm"
                  >
                    {t("auth.resendConfirmation")}
                  </button>
                </>
              )}

              {view === 'forgotPassword' && (
                <p className="text-muted-foreground">
                  {t("auth.rememberYourPassword")}
                  <button
                    onClick={() => handleViewChange('login')}
                    className="ml-2 text-primary font-medium hover:underline"
                  >
                    {t("auth.signInLink")}
                  </button>
                </p>
              )}

              {view === 'resendConfirmation' && (
                <p className="text-muted-foreground">
                  {t("auth.rememberYourPassword")}
                  <button
                    onClick={() => handleViewChange('login')}
                    className="ml-2 text-primary font-medium hover:underline"
                  >
                    {t("auth.signInLink")}
                  </button>
                </p>
              )}
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  );
};

export default Auth;
