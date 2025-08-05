import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, Users } from 'lucide-react';
import heroBackground from '@/assets/hero-background.jpg';

const HeroSection = () => {
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
            <div className="relative z-10 container mx-auto px-4 text-center">
                <div className="max-w-4xl mx-auto">
                    {/* Badge */}
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-heavenly-light/90 text-primary border border-accent/30 mb-6">
                        <BookOpen className="w-4 h-4 mr-2" />
                        <span className="text-sm font-medium">Empowering Evangelists Worldwide</span>
                    </div>

                    {/* Heading */}
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6 leading-tight">
                        Track Your
                        <span className="text-accent block md:inline"> Evangelism Impact</span>
                    </h1>

                    {/* Subheading */}
                    <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8 max-w-3xl mx-auto leading-relaxed">
                        Join thousands of evangelists using our platform to record, track, and celebrate
                        their ministry impact. Because every soul matters.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                        <Button variant="cta" size="lg" className="px-8 py-4 text-lg">
                            Start Your Journey
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                        <Button variant="heavenly" size="lg" className="px-8 py-4 text-lg">
                            Watch Demo
                        </Button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-bold text-accent mb-2">10,000+</div>
                            <div className="text-primary-foreground/80">Active Evangelists</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-bold text-accent mb-2">50,000+</div>
                            <div className="text-primary-foreground/80">Lives Touched</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-bold text-accent mb-2">150+</div>
                            <div className="text-primary-foreground/80">Countries</div>
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