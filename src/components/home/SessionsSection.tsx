import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, Star, Crown, Calendar, Target } from 'lucide-react';
import {sessionApi, challengeApi, Session, Challenge, SessionStatus} from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';

interface SessionWithChallenges extends Session {
  challenges: Challenge[];
}

const challengeIcons: Record<string, React.ElementType> = {
  'Faithful': Heart,
  'Devoted': Star,
  'Shepherd': Crown,
};

const challengeColors: Record<string, string> = {
  'Faithful': 'text-peaceful-green',
  'Devoted': 'text-accent',
  'Shepherd': 'text-primary',
};

const SessionsSection = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [ongoingSession, setOngoingSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const [sessionsData, ongoingSessionData, challengesData] = await Promise.all([
        sessionApi.getAll(),
        sessionApi.getOngoingSession(),
        challengeApi.getAll(),
      ]);

        setOngoingSession(ongoingSessionData);
        setSessions(sessionsData);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = (challengeId: string) => {
    if (!user) {
      navigate('/auth');
    } else {
      navigate(`/subscribe/${challengeId}`);
    }
  };

  const pastSessions = sessions.filter(s => s.status === SessionStatus.ENDED);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const renderChallengeCards = (challenges: Challenge[], isActive: boolean) => (
    <div className="grid md:grid-cols-3 gap-8">
      {challenges.map((challenge) => {
        const IconComponent = challengeIcons[challenge.name] || Heart;
        const colorClass = challengeColors[challenge.name] || 'text-primary';
        
        return (
          <Card 
            key={challenge.id} 
            className="relative border-0 shadow-gentle hover:shadow-divine transition-all duration-300"
          >
            <CardHeader className="text-center pb-4">
              <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mb-4">
                <IconComponent className={`w-6 h-6 ${colorClass}`} />
              </div>
              <h3 className="text-2xl font-bold text-foreground">{challenge.name}</h3>
              <div className="text-muted-foreground mb-2">{challenge.description}</div>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Target className="w-4 h-4" />
                <span>{t("home.sessions.target")}: {challenge.target} {t("home.sessions.souls")}</span>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{t("home.sessions.type")}</span>
                  <Badge variant="secondary">{challenge.type.toString()}</Badge>
                </div>
              </div>
              
              {isActive ? (
                <Button 
                  variant="cta" 
                  className="w-full"
                  size="lg"
                  onClick={() => handleSubscribe(challenge.id)}
                >
                  {t("home.sessions.subscribe")}
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  className="w-full"
                  size="lg"
                  disabled
                >
                  {t("home.sessions.sessionEnded")}
                </Button>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );

  if (loading) {
    return (
      <section id="sessions" className="py-20 bg-heavenly-light/50">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-pulse">{t("common.loading")}</div>
        </div>
      </section>
    );
  }

  const hasNoSessions = sessions.length === 0;

  const faqs = [
    { question: "home.sessions.faq1q", answer: "home.sessions.faq1a" },
    { question: "home.sessions.faq2q", answer: "home.sessions.faq2a" },
    { question: "home.sessions.faq3q", answer: "home.sessions.faq3a" },
    { question: "home.sessions.faq4q", answer: "home.sessions.faq4a" }
  ];

  return (
    <section id="sessions" className="py-20 bg-heavenly-light/50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 
            className="text-3xl md:text-5xl font-bold text-foreground mb-6"
            dangerouslySetInnerHTML={{ __html: t("home.sessions.title") }}
          />
          <p className="text-xl text-muted-foreground leading-relaxed">
            {t("home.sessions.subtitle")}
          </p>
        </div>

        {hasNoSessions ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <Calendar className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">{t("home.sessions.noSessionsYet")}</h3>
              <p className="text-muted-foreground">
                {t("home.sessions.sessionsAppearHere")}
              </p>
            </div>
          </div>
        ) : (
          <Tabs defaultValue="current" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="current">{t("home.sessions.currentSessions")}</TabsTrigger>
              <TabsTrigger value="passed">{t("home.sessions.pastSessions")}</TabsTrigger>
            </TabsList>

            <TabsContent value="current">
              {!ongoingSession ? (
                <div className="text-center py-12">
                  <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">{t("home.sessions.noActiveSessions")}</p>
                </div>
              ) : (
                  <div key={ongoingSession.id} className="mb-12">
                    <div className="text-center mb-8">
                      <Badge variant="default" className="mb-2 bg-peaceful-green">{t("home.sessions.active")}</Badge>
                      <h3 className="text-2xl font-bold text-foreground">{ongoingSession.name}</h3>
                      <p className="text-muted-foreground">{ongoingSession.description}</p>
                      <div className="flex items-center justify-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(ongoingSession.startDate)} - {formatDate(ongoingSession.endDate)}
                        </span>
                      </div>
                    </div>
                    {ongoingSession.challenges?.length > 0 ? (
                      renderChallengeCards(ongoingSession.challenges, true)
                    ) : (
                      <p className="text-center text-muted-foreground">{t("home.sessions.noChallengesYet")}</p>
                    )}
                  </div>
              )}
            </TabsContent>
          </Tabs>
        )}

        <div className="max-w-3xl mx-auto mt-16">
          <h3 className="text-2xl font-bold text-center text-foreground mb-8">{t("home.sessions.frequentlyAsked")}</h3>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-card rounded-lg p-6 shadow-gentle">
                <h4 className="text-lg font-semibold text-foreground mb-3">{t(faq.question)}</h4>
                <p className="text-muted-foreground leading-relaxed">{t(faq.answer)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SessionsSection;
