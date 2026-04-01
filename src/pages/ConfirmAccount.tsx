import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { authApi, EcomieError } from '@/lib/api';

const ConfirmAccount = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    const confirmAccount = async () => {
      const email = searchParams.get('email');
      const token = searchParams.get('token');

      if (!email || !token) {
        setStatus('error');
        return;
      }

      try {
        await authApi.confirmAccount(email, token);
        setStatus('success');
        toast({
          title: t("auth.accountConfirmed"),
          description: t("auth.welcomeToEcomie"),
        });
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } catch (error) {
        setStatus('error');
        const err = error as EcomieError;
        toast({
          title: t("auth.confirmationFailed"),
          description: err.detail || err.invalidParams?.[0]?.reason || t("auth.confirmationError"),
          variant: "destructive",
        });
        setTimeout(() => {
          navigate('/auth?view=resendConfirmation');
        }, 3000);
      }
    };

    confirmAccount();
  }, [searchParams, navigate, toast, t]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-heavenly">
      <div className="text-center">
        {status === 'loading' && (
          <>
            <div className="animate-pulse">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            </div>
            <p className="text-muted-foreground">{t("auth.confirmingAccount")}</p>
          </>
        )}
        {status === 'success' && (
          <>
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-foreground font-medium">{t("auth.accountConfirmedSuccess")}</p>
            <p className="text-muted-foreground mt-2">{t("auth.redirectingToDashboard")}</p>
          </>
        )}
        {status === 'error' && (
          <>
            <div className="w-16 h-16 bg-destructive rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="text-destructive font-medium">{t("auth.confirmationFailed")}</p>
            <p className="text-muted-foreground mt-2">{t("auth.redirectingToResend")}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default ConfirmAccount;
