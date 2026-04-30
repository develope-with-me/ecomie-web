import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import heroBackground from '@/assets/hero-background.jpg';
import { useTranslation } from 'react-i18next';

const HeroSection = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBackground})` }}
      >
        <div className="absolute inset-0 bg-gradient-hero"></div>
      </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-2 sm:px-4 text-center">
                <div className="max-w-4xl mx-auto">
                    {/* Badge */}
                    <div className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-heavenly-light/90 text-primary border border-accent/30 mb-4 sm:mb-6">
                        <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                        <span className="text-xs sm:text-sm font-medium">{t("hero.empowering")}</span>
                    </div>

                    {/* Heading */}
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-7xl font-bold text-primary-foreground mb-4 sm:mb-6 leading-tight">
                        {t("hero.trackYour")}
                        <span className="text-accent block md:inline"> {t("hero.evangelismImpact")}</span>
                    </h1>

                    {/* Subheading */}
                    <p className="text-sm sm:text-base md:text-xl lg:text-2xl text-primary-foreground/90 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed">
                        {t("hero.joinThousands")}
                    </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-8 sm:mb-12">
            {user ? (
              <>
                <Button
                  variant="cta"
                  size="lg"
                  className="px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg w-full sm:w-auto"
                  onClick={() => navigate('/dashboard')}
                >
                  <User className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                  {t("hero.goToDashboard")}
                </Button>
                <Button
                  variant="heavenly"
                  size="lg"
                  className="px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg w-full sm:w-auto"
                  onClick={() => {
                    document.getElementById('sessions')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  {t("hero.viewSessions")}
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="cta"
                  size="lg"
                  className="px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg w-full sm:w-auto"
                  onClick={() => navigate('/auth')}
                >
                  {t("hero.startYourJourney")}
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-1 sm:ml-2" />
                </Button>
                <Button
                  variant="heavenly"
                  size="lg"
                  className="px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg w-full sm:w-auto"
                  onClick={() => navigate('/auth')}
                >
                  {t("auth.signIn")}
                </Button>
              </>
            )}
          </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto">
                        <div className="text-center">
                            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-accent mb-1 sm:mb-2">10,000+</div>
                            <div className="text-xs sm:text-sm text-primary-foreground/80">{t("hero.activeEvangelists")}</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-accent mb-1 sm:mb-2">50,000+</div>
                            <div className="text-xs sm:text-sm text-primary-foreground/80">{t("hero.livesTouched")}</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-accent mb-1 sm:mb-2">150+</div>
                            <div className="text-xs sm:text-sm text-primary-foreground/80">{t("hero.countries")}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                <div className="w-6 h-10 border-2 border-primary-foreground/50 rounded-full flex justify-center">
                    <div className="w-1 h-3 bg-primary-foreground/50 rounded-full mt-2"></div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;