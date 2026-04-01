import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import ecomieLogo from "@/images/ecomie-logo.png";
import { useTranslation } from 'react-i18next';
import { authApi } from '@/lib/api';
import { EcomieError } from '@/lib/api';

const resetPasswordSchema = z.object({
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();

  const email = searchParams.get('email');
  const token = searchParams.get('token');

  useEffect(() => {
    if (!email || !token) {
      setIsValidToken(false);
    } else {
      setIsValidToken(true);
    }
  }, [email, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const validation = resetPasswordSchema.safeParse({ password, confirmPassword });
      if (!validation.success) {
        toast({
          title: t("auth.validationError"),
          description: validation.error.errors[0].message,
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      if (!email || !token) {
        toast({
          title: t("auth.resetFailed"),
          description: t("auth.invalidResetLink"),
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      const response = await authApi.resetPassword(email, token, password, confirmPassword);
      if (response.responseMessage.success) {
        toast({
          title: t("auth.passwordResetSuccess"),
          description: t("auth.canNowLoginWithNewPassword"),
        });
        setTimeout(() => navigate('/auth'), 2000);
      } else {
        toast({
          title: t("auth.resetFailed"),
          description: response.responseMessage.description,
          variant: "destructive",
        });
      }
    } catch (error) {
      const err = error as EcomieError;
      toast({
        title: t("auth.resetFailed"),
        description: err.detail || err.invalidParams?.[0]?.reason || t("auth.resetFailed"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isValidToken === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-heavenly">
        <div className="animate-pulse text-primary">{t("common.loading")}</div>
      </div>
    );
  }

  if (!isValidToken) {
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
                  {t("auth.invalidResetLink")}
                </h1>
                <p className="text-muted-foreground">
                  {t("auth.resetLinkExpiredOrInvalid")}
                </p>
              </CardHeader>
              <CardContent className="text-center">
                <Button
                  onClick={() => navigate('/auth')}
                  variant="cta"
                  size="lg"
                >
                  {t("auth.goToLogin")}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
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
              {t("auth.resetYourPassword")}
            </h1>
            <p className="text-muted-foreground">
              {t("auth.enterNewPassword")}
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t("common.email")}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email || ''}
                    disabled
                    className="pl-10 bg-muted"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{t("auth.newPassword")}</Label>
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

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{t("auth.confirmNewPassword")}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                variant="cta" 
                className="w-full" 
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting 
                  ? t("auth.pleaseWait") 
                  : t("auth.resetPassword")}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-muted-foreground">
                {t("auth.dontHaveAccount")}
                <button
                  onClick={() => navigate('/auth')}
                  className="ml-2 text-primary font-medium hover:underline"
                >
                  {t("auth.signUp")}
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
