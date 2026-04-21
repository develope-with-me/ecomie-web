import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Target, Heart } from 'lucide-react';
import {challengeApi, subscriptionApi, Challenge, UserRole, userApi} from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import {isNonNullArray} from "@/lib/utils";
import { useTranslation } from 'react-i18next';

const Subscribe = () => {
  const { challengeId } = useParams<{ challengeId: string }>();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [personalTarget, setPersonalTarget] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    if (challengeId) {
      fetchChallenge();
    }
  }, [challengeId, user, navigate]);

  const fetchChallenge = async () => {
    try {
      const data = await challengeApi.getById(challengeId!);
      setChallenge(data);
      setPersonalTarget(data.target.toString());
    } catch (error) {
      console.error('Error fetching challenge:', error);
      toast({
        title: t("subscribe.challengeNotFound"),
        description: t("subscribe.challengeNotFoundDesc"),
        variant: "destructive",
      });
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !challenge) return;
    
    setSubmitting(true);
    
    try {
        const data = {
            challengeId: challenge.id,
            target: parseInt(personalTarget) || challenge.target,
        };
        await subscriptionApi.create(data);

      toast({
        title: t("subscribe.subscribedSuccessfully"),
        description: t("subscribe.joinedChallenge", { challenge: challenge.name }),
      });
      
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error subscribing:', error);
      toast({
        title: t("subscribe.subscriptionFailed"),
        description: isNonNullArray(error.invalidParams)  ? error.invalidParams[0].reason : error.detail,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-heavenly">
        <div className="animate-pulse text-primary">{t("common.loading")}</div>
      </div>
    );
  }

  if (!challenge) {
    return null;
  }

    const becomeAnEcomiest = async()=> {

        try {
            const genericResponse = await userApi.requestRoleChange("ECOMIEST");

            toast({
                title: t("subscribe.emailSent"),
                description: genericResponse.description
            });
        } catch (error: any) {
            console.error('Error subscribing:', error);
            toast({
                title: t("subscribe.subscriptionFailed"),
                description: isNonNullArray(error.invalidParams)  ? error.invalidParams[0].reason : error.detail,
                variant: "destructive",
            });
        }
    }

return (
    <div className="min-h-screen bg-gradient-heavenly py-8 sm:py-12 px-2 sm:px-4">
      <div className="max-w-2xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-4 sm:mb-6 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-1 sm:mr-2" />
          <span className="sm:hidden">{t("subscribe.back")}</span>
          <span className="hidden sm:inline">{t("subscribe.backToHome")}</span>
        </Button>

        <Card className="border-0 shadow-divine">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-3 sm:mb-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-divine rounded-full flex items-center justify-center shadow-gentle">
                <Heart className="w-6 h-6 sm:w-10 sm:h-10 text-primary-foreground" fill="currentColor" />
              </div>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                { (user?.role !== UserRole.ECOMIEST) ? t("subscribe.ecomiestOnly") : t("subscribe.subscribeToChallenge", { challenge: challenge.name }) }
            </h1>
              {(user?.role === UserRole.ECOMIEST) && (
            <p className="text-sm sm:text-base text-muted-foreground">
              {challenge.description || t("subscribe.commitToMakeDifference")}
            </p>
              )}
          </CardHeader>

          <CardContent>
              {(user?.role !== UserRole.ECOMIEST) ?
              <div className="bg-muted/50 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                  <div className="flex items-center gap-2 text-xs sm:text-sm">
                      <span className="text-foreground">{t("subscribe.contactAdmin")} <a href={""} className="font-bold" onClick={becomeAnEcomiest}>{t("subscribe.becomeAnEcomiest")}</a></span>
                  </div>
              </div>
               :
             <div>
             <div className="bg-muted/50 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
               <div className="flex items-center gap-2 text-xs sm:text-sm">
                 <Target className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                 <span className="text-muted-foreground">{t("subscribe.challengeTarget")}</span>
                 <span className="font-semibold text-foreground">{challenge.target} {t("dashboard.souls")}</span>
               </div>
             </div>

             <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">

               <div className="space-y-2">
                 <Label htmlFor="target">{t("subscribe.yourPersonalTarget")}</Label>
                 <Input
                   id="target"
                   type="number"
                   min="1"
                   placeholder={challenge.target.toString()}
                   value={personalTarget}
                   onChange={(e) => setPersonalTarget(e.target.value)}
                   required
                 />
                 <p className="text-xs text-muted-foreground">
                   {t("subscribe.setYourOwnGoal", { target: challenge.target })}
                 </p>
               </div>

               <Button 
                 type="submit" 
                 variant="cta" 
                 className="w-full" 
                 size="lg"
                 disabled={submitting}
               >
                 {submitting ? t("subscribe.subscribing") : t("subscribe.confirmSubscription")}
               </Button>
             </form>
             </div>
               }
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Subscribe;
