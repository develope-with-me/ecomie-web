import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart3, Heart, Globe, Shield, Users, Zap } from 'lucide-react';
import bibleLight from '@/assets/bible-light.jpg';

const ValuePropositionSection = () => {
    const features = [
        {
            icon: BarChart3,
            title: "Track Your Impact",
            description: "Monitor conversations, follow-ups, and conversions with detailed analytics and beautiful visualizations."
        },
        {
            icon: Heart,
            title: "Heart-Centered Ministry",
            description: "Focus on what matters most - building genuine relationships and sharing God's love effectively."
        },
        {
            icon: Globe,
            title: "Global Community",
            description: "Connect with evangelists worldwide, share experiences, and learn from each other's journeys."
        },
        {
            icon: Shield,
            title: "Secure & Private",
            description: "Your ministry data is protected with enterprise-grade security and privacy measures."
        },
        {
            icon: Users,
            title: "Team Collaboration",
            description: "Coordinate with your church team, share insights, and work together more effectively."
        },
        {
            icon: Zap,
            title: "Instant Insights",
            description: "Get immediate feedback on your evangelism efforts with real-time reporting and suggestions."
        }
    ];

    return (
        <section id="features" className="py-20 bg-background">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
                        Why Choose <span className="text-primary">ECOMIE</span>?
                    </h2>
                    <p className="text-xl text-muted-foreground leading-relaxed">
                        We're not just another tracking app. We're a ministry partner designed
                        specifically for modern evangelists who want to measure their Kingdom impact.
                    </p>
                </div>

                {/* Main Feature with Image */}
                <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
                    <div>
                        <h3 className="text-2xl md:text-4xl font-bold text-foreground mb-6">
                            Built on Biblical Principles
                        </h3>
                        <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                            Every feature in ECOMIE is designed with scripture in mind. From the Great Commission
                            to the Parable of the Sower, we help you apply biblical wisdom to modern evangelism methods.
                        </p>
                        <ul className="space-y-3 text-muted-foreground">
                            <li className="flex items-center">
                                <div className="w-2 h-2 bg-accent rounded-full mr-3"></div>
                                Scripture-based tracking categories
                            </li>
                            <li className="flex items-center">
                                <div className="w-2 h-2 bg-accent rounded-full mr-3"></div>
                                Prayer integration for every contact
                            </li>
                            <li className="flex items-center">
                                <div className="w-2 h-2 bg-accent rounded-full mr-3"></div>
                                Discipleship journey mapping
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