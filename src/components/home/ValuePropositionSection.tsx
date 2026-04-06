import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart3, Heart, Globe, Shield, Users, Zap } from 'lucide-react';
import bibleLight from '@/assets/bible-light.jpg';
import { useTranslation } from 'react-i18next';

const ValuePropositionSection = () => {
    const { t } = useTranslation();

    const features = [
        {
            icon: BarChart3,
            titleKey: "home.valueProposition.trackYourImpact",
            descKey: "home.valueProposition.trackYourImpactDesc"
        },
        {
            icon: Heart,
            titleKey: "home.valueProposition.heartCentered",
            descKey: "home.valueProposition.heartCenteredDesc"
        },
        {
            icon: Globe,
            titleKey: "home.valueProposition.globalCommunity",
            descKey: "home.valueProposition.globalCommunityDesc"
        },
        {
            icon: Shield,
            titleKey: "home.valueProposition.securePrivate",
            descKey: "home.valueProposition.securePrivateDesc"
        },
        {
            icon: Users,
            titleKey: "home.valueProposition.teamCollaboration",
            descKey: "home.valueProposition.teamCollaborationDesc"
        },
        {
            icon: Zap,
            titleKey: "home.valueProposition.instantInsights",
            descKey: "home.valueProposition.instantInsightsDesc"
        }
    ];

    return (
        <section id="features" className="py-20 bg-background">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 
                        className="text-3xl md:text-5xl font-bold text-foreground mb-6"
                        dangerouslySetInnerHTML={{ __html: t("home.valueProposition.whyChoose") }}
                    />
                    <p className="text-xl text-muted-foreground leading-relaxed">
                        {t("home.valueProposition.notJustApp")}
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
                    <div>
                        <h3 className="text-2xl md:text-4xl font-bold text-foreground mb-6">
                            {t("home.valueProposition.builtOnBiblical")}
                        </h3>
                        <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                            {t("home.valueProposition.everyFeature")}
                        </p>
                        <ul className="space-y-3 text-muted-foreground">
                            <li className="flex items-center">
                                <div className="w-2 h-2 bg-accent rounded-full mr-3"></div>
                                {t("home.valueProposition.scriptureBased")}
                            </li>
                            <li className="flex items-center">
                                <div className="w-2 h-2 bg-accent rounded-full mr-3"></div>
                                {t("home.valueProposition.prayerIntegration")}
                            </li>
                            <li className="flex items-center">
                                <div className="w-2 h-2 bg-accent rounded-full mr-3"></div>
                                {t("home.valueProposition.discipleshipJourney")}
                            </li>
                        </ul>
                    </div>
                    <div className="relative">
                        <img
                            src={bibleLight}
                            alt="Bible with divine light"
                            className="rounded-lg shadow-divine w-full max-h-[450px] overflow-hidden object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent rounded-lg"></div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <Card key={index} className="border-0 shadow-gentle hover:shadow-divine transition-all duration-300 hover:scale-105">
                            <CardContent className="p-6">
                                <div className="w-12 h-12 bg-gradient-divine rounded-lg flex items-center justify-center mb-4">
                                    <feature.icon className="w-6 h-6 text-primary-foreground" />
                                </div>
                                <h4 className="text-xl font-semibold text-foreground mb-3">{t(feature.titleKey)}</h4>
                                <p className="text-muted-foreground leading-relaxed">{t(feature.descKey)}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ValuePropositionSection;