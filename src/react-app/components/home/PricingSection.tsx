import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Heart, Crown } from 'lucide-react';

const PricingSection = () => {
    const plans = [
        {
            name: "Faithful",
            price: "Free",
            period: "Forever",
            description: "Perfect for individual evangelists starting their journey",
            icon: Heart,
            features: [
                "Track up to 50 contacts",
                "Basic analytics dashboard",
                "Prayer list integration",
                "Mobile app access",
                "Community forums",
                "Email support"
            ],
            cta: "Start Free",
            popular: false,
            color: "text-peaceful-green"
        },
        {
            name: "Devoted",
            price: "$19",
            period: "per month",
            description: "Ideal for active evangelists and small ministry teams",
            icon: Star,
            features: [
                "Unlimited contacts",
                "Advanced analytics & reports",
                "Team collaboration tools",
                "Custom follow-up templates",
                "Scripture integration",
                "Priority support",
                "Export capabilities",
                "Integration with church systems"
            ],
            cta: "Start Free Trial",
            popular: true,
            color: "text-accent"
        },
        {
            name: "Shepherd",
            price: "$49",
            period: "per month",
            description: "Complete solution for churches and large ministry organizations",
            icon: Crown,
            features: [
                "Everything in Devoted",
                "Multi-church management",
                "Advanced team permissions",
                "Custom branding",
                "API access",
                "Dedicated account manager",
                "Training & onboarding",
                "Custom integrations",
                "White-label options"
            ],
            cta: "Contact Sales",
            popular: false,
            color: "text-primary"
        }
    ];

    const faqs = [
        {
            question: "Is there really a free plan?",
            answer: "Absolutely! We believe every evangelist should have access to basic tracking tools. Our Faithful plan is free forever with core features."
        },
        {
            question: "Can I change plans anytime?",
            answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately."
        },
        {
            question: "Do you offer discounts for churches?",
            answer: "Yes! We offer special pricing for churches and non-profit organizations. Contact our sales team for details."
        },
        {
            question: "What kind of support do you provide?",
            answer: "All plans include email support. Devoted and Shepherd plans get priority support with faster response times."
        }
    ];

    return (
        <section id="pricing" className="py-20 bg-heavenly-light/50">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
                        Choose Your <span className="text-primary">Ministry Plan</span>
                    </h2>
                    <p className="text-xl text-muted-foreground leading-relaxed">
                        Whether you're just starting your evangelism journey or leading a large ministry,
                        we have a plan that fits your calling and budget.
                    </p>
                </div>

                {/* Pricing Cards */}
                <div className="grid md:grid-cols-3 gap-8 mb-16">
                    {plans.map((plan, index) => (
                        <Card key={index} className={`relative border-0 shadow-gentle hover:shadow-divine transition-all duration-300 ${plan.popular ? 'transform scale-105 shadow-divine' : ''}`}>
                            {plan.popular && (
                                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-divine text-primary-foreground">
                                    Most Popular
                                </Badge>
                            )}

                            <CardHeader className="text-center pb-4">
                                <div className={`w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mb-4`}>
                                    <plan.icon className={`w-6 h-6 ${plan.color}`} />
                                </div>
                                <h3 className="text-2xl font-bold text-foreground">{plan.name}</h3>
                                <div className="text-muted-foreground mb-2">{plan.description}</div>
                                <div className="flex items-baseline justify-center">
                                    <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                                    {plan.period !== "Forever" && (
                                        <span className="text-muted-foreground ml-2">/{plan.period}</span>
                                    )}
                                </div>
                            </CardHeader>

                            <CardContent className="pt-0">
                                <ul className="space-y-3 mb-8">
                                    {plan.features.map((feature, featureIndex) => (
                                        <li key={featureIndex} className="flex items-start">
                                            <Check className="w-5 h-5 text-accent mr-3 mt-0.5 flex-shrink-0" />
                                            <span className="text-muted-foreground">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <Button
                                    variant={plan.popular ? "cta" : "divine"}
                                    className="w-full"
                                    size="lg"
                                >
                                    {plan.cta}
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Money Back Guarantee */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center px-6 py-3 rounded-full bg-accent/10 border border-accent/20">
                        <Heart className="w-5 h-5 text-accent mr-2" />
                        <span className="text-foreground font-medium">30-day money-back guarantee • No contracts • Cancel anytime</span>
                    </div>
                </div>

                {/* FAQ */}
                <div className="max-w-3xl mx-auto">
                    <h3 className="text-2xl font-bold text-center text-foreground mb-8">Frequently Asked Questions</h3>
                    <div className="space-y-6">
                        {faqs.map((faq, index) => (
                            <div key={index} className="bg-card rounded-lg p-6 shadow-gentle">
                                <h4 className="text-lg font-semibold text-foreground mb-3">{faq.question}</h4>
                                <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PricingSection;