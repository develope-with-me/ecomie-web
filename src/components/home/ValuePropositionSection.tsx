import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart3, Heart, Globe, Shield, Users, Zap } from 'lucide-react';
import bibleLight from '@/assets/bible-light.jpg';
import {useGlobalTranslation} from "@/translate/translation-provider";

const ValuePropositionSection = () => {
    const {t} = useGlobalTranslation();
    const features = [
        {
            icon: BarChart3,
            title: t("homePage.trackYourImpact"),
            description: t("homePage.monitorConversations...")
        },
        {
            icon: Heart,
            title: t("homePage.heartCenteredMinistry"),
            description: t("homePage.focusOnWhatMattersMost...")
        },
        {
            icon: Globe,
            title: t("homePage.globalCommunity"),
            description: t("homePage.connectWithEvangelistsWorldwide...")
        },
        {
            icon: Shield,
            title: t("homePage.secure&Private"),
            description: t("homePage.yourMinistryDataIsProtected...")
        },
        {
            icon: Users,
            title: t("homePage.teamCollaboration"),
            description: t("homePage.coordinateWithYourTeam...")
        },
        {
            icon: Zap,
            title: t("homePage.instantInsights"),
            description: t("homePage.getImmediateFeedback...")
        }
    ];

    return (
        <section id="features" className="py-20 bg-background">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
                        {t("homePage.why")} <span className="text-primary">ECOMIE</span>?
                    </h2>
                    <p className="text-xl text-muted-foreground leading-relaxed">
                        {t("homePage.we'reNotJust...")}
                    </p>
                </div>

                {/* Main Feature with Image */}
                <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
                    <div>
                        <h3 className="text-2xl md:text-4xl font-bold text-foreground mb-6">
                            {t("homePage.builtOnBiblicalPrinciples")}
                        </h3>
                        <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                            {t("homePage.everyFeatureIn...")}
                        </p>
                        <ul className="space-y-3 text-muted-foreground">
                            <li className="flex items-center">
                                <div className="w-2 h-2 bg-accent rounded-full mr-3"></div>
                                {t("homePage.scriptureBasedTrackingCategories")}
                            </li>
                            <li className="flex items-center">
                                <div className="w-2 h-2 bg-accent rounded-full mr-3"></div>
                                {t("homePage.prayerIntegrationForEveryContact")}
                            </li>
                            <li className="flex items-center">
                                <div className="w-2 h-2 bg-accent rounded-full mr-3"></div>
                                {t("homePage.discipleshipJourneyMapping")}
                            </li>
                        </ul>
                    </div>
                    <div className="relative">
                        <img
                            src={bibleLight}
                            alt="Bible with divine light"
                            className="rounded-lg shadow-divine w-full"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent rounded-lg"></div>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <Card key={index} className="border-0 shadow-gentle hover:shadow-divine transition-all duration-300 hover:scale-105">
                            <CardContent className="p-6">
                                <div className="w-12 h-12 bg-gradient-divine rounded-lg flex items-center justify-center mb-4">
                                    <feature.icon className="w-6 h-6 text-primary-foreground" />
                                </div>
                                <h4 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h4>
                                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ValuePropositionSection;