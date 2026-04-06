import React, {useState} from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Quote } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const SocialProofSection = () => {
    const { t } = useTranslation();
    const [imgError, setImgError] = useState(false);

    const testimonials = [
        {
            name: "Pastor Michael Johnson",
            role: "Senior Pastor, Grace Community Church",
            content: "ECOMIE has revolutionized how our church approaches evangelism. We've seen a 300% increase in meaningful conversations and follow-ups.",
            rating: 5,
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
        },
        {
            name: "Sarah Williams",
            role: "Missionary, Asia Pacific",
            content: "The global community feature has been incredible. I'm learning from evangelists worldwide and sharing strategies that work in different cultures.",
            rating: 5,
            image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
        },
        {
            name: "David Chen",
            role: "Youth Pastor & Evangelist",
            content: "As a young minister, this platform has given me confidence and structure. The analytics help me understand what resonates with different age groups.",
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
        "Hillsong Church",
        "Elevation Church",
        "Life.Church",
        "Bethel Church",
        "Gateway Church",
        "North Point Community"
    ];

    return (
        <section className="py-20 bg-heavenly-light/50">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 
                        className="text-3xl md:text-5xl font-bold text-foreground mb-6"
                        dangerouslySetInnerHTML={{ __html: t("home.socialProof.trustedBy") }}
                    />
                    <p className="text-xl text-muted-foreground">
                        {t("home.socialProof.joinGrowing")}
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
                    {stats.map((stat, index) => (
                        <div key={index} className="text-center">
                            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.number}</div>
                            <div className="text-muted-foreground">{t(stat.labelKey)}</div>
                        </div>
                    ))}
                </div>

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

                <div className="text-center">
                    <p className="text-muted-foreground mb-8">{t("home.socialProof.trustedByChurches")}</p>
                    <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
                        {churches.map((church, index) => (
                            <div key={index} className="text-lg font-semibold text-muted-foreground">
                                {church}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SocialProofSection;