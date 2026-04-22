import React, {useState} from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Quote } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const SocialProofSection = () => {
    const { t } = useTranslation();
    const [imgError, setImgError] = useState(false);

    const testimonials = [
        {
            name: t("home.socialProof.testimonials.1.name"),
            role: t("home.socialProof.testimonials.1.role"),
            content: t("home.socialProof.testimonials.1.content"),
            rating: 5,
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
        },
        {
            name: t("home.socialProof.testimonials.2.name"),
            role: t("home.socialProof.testimonials.2.role"),
            content: t("home.socialProof.testimonials.2.content"),
            rating: 5,
            image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
        },
        {
            name: t("home.socialProof.testimonials.3.name"),
            role: t("home.socialProof.testimonials.3.role"),
            content: t("home.socialProof.testimonials.3.content"),
            rating: 5,
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
        }
    ];

    const stats = [
        { number: "98%", labelKey: "home.socialProof.userSatisfaction" },
        { number: "2.5x", labelKey: "home.socialProof.moreConversions" },
        { number: "75%", labelKey: "home.socialProof.betterFollowUp" },
        { number: "4.9/5", labelKey: "home.socialProof.appStoreRating" }
    ];

    const churches = [
        t("home.socialProof.churches.hillsong"),
        t("home.socialProof.churches.elevation"),
        t("home.socialProof.churches.lifeChurch"),
        t("home.socialProof.churches.bethel"),
        t("home.socialProof.churches.gateway"),
        t("home.socialProof.churches.northPoint")
    ];

    return (
        <section className="py-20 bg-heavenly-light/50">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2
                        className="text-3xl md:text-5xl font-bold text-foreground mb-6"
                        dangerouslySetInnerHTML={{ __html: t("home.socialProof.trustedBy") }}
                    />
                    <p className="text-xl text-muted-foreground">
                        {t("home.socialProof.joinGrowing")}
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
                    {stats.map((stat, index) => (
                        <div key={index} className="text-center">
                            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.number}</div>
                            <div className="text-muted-foreground">{t(stat.labelKey)}</div>
                        </div>
                    ))}
                </div>

                {/* Testimonials */}
                <div className="grid md:grid-cols-3 gap-8 mb-16">
                    {testimonials.map((testimonial, index) => (
                        <Card key={index} className="border-0 shadow-gentle hover:shadow-divine transition-all duration-300">
                            <CardContent className="p-6">
                                <div className="flex items-center mb-4">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} className="w-5 h-5 text-accent fill-current" />
                                    ))}
                                </div>
                                <Quote className="w-8 h-8 text-accent mb-4" />
                                <p className="text-muted-foreground mb-6 leading-relaxed">"{testimonial.content}"</p>
                                <div className="flex items-center">
                                    {!imgError && (
                                    <img
                                        src={testimonial.image}
                                        alt={testimonial.name}
                                        className="w-12 h-12 rounded-full mr-4 object-cover"
                                        onError={() => setImgError(true)}
                                    />
                                    )}
                                    <div>
                                        <div className="font-semibold text-foreground">{testimonial.name}</div>
                                        <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/*/!* Church Logos *!/*/}
                {/*<div className="text-center">*/}
                {/*    <p className="text-muted-foreground mb-8">{t("home.socialProof.trustedByChurches")}</p>*/}
                {/*    <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">*/}
                {/*        {churches.map((church, index) => (*/}
                {/*            <div key={index} className="text-lg font-semibold text-muted-foreground">*/}
                {/*                {church}*/}
                {/*            </div>*/}
                {/*        ))}*/}
                {/*    </div>*/}
                {/*</div>*/}
            </div>
        </section>
    );
};

export default SocialProofSection;