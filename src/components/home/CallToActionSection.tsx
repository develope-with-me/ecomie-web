import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, Gift } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import evangelismShepherd from '@/assets/evangelism-shepherd.jpg';
import { useTranslation } from 'react-i18next';

const CallToActionSection = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const benefits = [
    { key: "home.callToAction.freeToStart" },
    { key: "home.callToAction.noSetupFees" },
    { key: "home.callToAction.trackImpact" },
    { key: "home.callToAction.connectEvangelists" },
    { key: "home.callToAction.joinChallenges" }
  ];

    return (
        <section className="py-20 bg-gradient-divine text-primary-foreground relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_1px_1px,_rgba(255,255,255,0.4)_1px,_transparent_1px)] bg-[length:20px_20px]"></div>
            </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-foreground/10 border border-primary-foreground/20 mb-6">
              <Gift className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">{t("home.callToAction.startJourneyToday")}</span>
            </div>

                        <h2 className="text-3xl md:text-5xl font-bold mb-6">
                            {t("home.callToAction.readyToTransform")}
                        </h2>

                        <p className="text-xl mb-8 text-primary-foreground/90 leading-relaxed">
                            {t("home.callToAction.joinThousands")}
                        </p>

                        <div className="space-y-3 mb-8">
                            {benefits.map((benefit, index) => (
                                <div key={index} className="flex items-center">
                                    <CheckCircle className="w-5 h-5 text-accent mr-3 flex-shrink-0" />
                                    <span className="text-primary-foreground/90">{t(benefit.key)}</span>
                                </div>
                            ))}
                        </div>

            <div className="flex flex-col sm:flex-row gap-4">
              {user ? (
                <>
                  <Button
                    variant="heavenly"
                    size="lg"
                    className="px-8 py-4 text-lg font-semibold"
                    onClick={() => navigate('/dashboard')}
                  >
                    {t("home.callToAction.goToDashboard")}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="px-8 py-4 text-lg border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                    onClick={() => document.getElementById('sessions')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    {t("home.callToAction.viewSessions")}
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="heavenly"
                    size="lg"
                    className="px-8 py-4 text-lg font-semibold"
                    onClick={() => navigate('/auth')}
                  >
                    {t("home.callToAction.createAccount")}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="px-8 py-4 text-lg border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                    onClick={() => navigate('/auth')}
                  >
                    {t("home.callToAction.signIn")}
                  </Button>
                </>
              )}
            </div>

            <div className="mt-8 text-sm text-primary-foreground/70">
              <p>✓ {t("home.callToAction.noCreditCard")} • ✓ {t("home.callToAction.setupMinutes")} • ✓ {t("home.callToAction.securePrivate")}</p>
            </div>
          </div>

                    <div className="relative">
                        <div className="relative">
                            <img
                                src={evangelismShepherd}
                                alt="Shepherd with sheep representing evangelism"
                                className="rounded-lg shadow-2xl w-full max-h-[450px] overflow-hidden object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent rounded-lg"></div>
                        </div>

                        <div className="absolute -top-4 -right-4 bg-card rounded-lg p-4 shadow-divine text-card-foreground">
                            <div className="text-2xl font-bold text-accent">50K+</div>
                            <div className="text-sm text-muted-foreground">{t("home.callToAction.livesTouched")}</div>
                        </div>

                        <div className="absolute -bottom-4 -left-4 bg-card rounded-lg p-4 shadow-divine text-card-foreground">
                            <div className="text-2xl font-bold text-accent">98%</div>
                            <div className="text-sm text-muted-foreground">{t("home.callToAction.satisfaction")}</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CallToActionSection;