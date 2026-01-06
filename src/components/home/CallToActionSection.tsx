import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, Gift } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import evangelismShepherd from '@/assets/evangelism-shepherd.jpg';

const CallToActionSection = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const benefits = [
    "Free to get started",
    "No setup fees",
    "Track your evangelism impact",
    "Connect with other evangelists",
    "Join active challenges"
  ];

    return (
        <section className="py-20 bg-gradient-divine text-primary-foreground relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_1px_1px,_rgba(255,255,255,0.4)_1px,_transparent_1px)] bg-[length:20px_20px]"></div>
            </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-foreground/10 border border-primary-foreground/20 mb-6">
              <Gift className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">Start Your Journey Today</span>
            </div>

                        <h2 className="text-3xl md:text-5xl font-bold mb-6">
                            Ready to Transform Your Evangelism?
                        </h2>

                        <p className="text-xl mb-8 text-primary-foreground/90 leading-relaxed">
                            Join thousands of evangelists who are already using ECOMIE to make a measurable
                            impact for the Kingdom. Your ministry breakthrough is just one click away.
                        </p>

                        {/* Benefits List */}
                        <div className="space-y-3 mb-8">
                            {benefits.map((benefit, index) => (
                                <div key={index} className="flex items-center">
                                    <CheckCircle className="w-5 h-5 text-accent mr-3 flex-shrink-0" />
                                    <span className="text-primary-foreground/90">{benefit}</span>
                                </div>
                            ))}
                        </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              {user ? (
                <>
                  <Button
                    variant="heavenly"
                    size="lg"
                    className="px-8 py-4 text-lg font-semibold"
                    onClick={() => navigate('/dashboard')}
                  >
                    Go to Dashboard
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="px-8 py-4 text-lg border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                    onClick={() => document.getElementById('sessions')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    View Sessions
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
                    Create Account
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="px-8 py-4 text-lg border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                    onClick={() => navigate('/auth')}
                  >
                    Sign In
                  </Button>
                </>
              )}
            </div>

            {/* Trust Badge */}
            <div className="mt-8 text-sm text-primary-foreground/70">
              <p>✓ No credit card required • ✓ Setup in under 2 minutes • ✓ Secure & Private</p>
            </div>
          </div>

                    {/* Image */}
                    <div className="relative">
                        <div className="relative z-10">
                            <img
                                src={evangelismShepherd}
                                alt="Shepherd with sheep representing evangelism"
                                className="rounded-lg shadow-2xl w-full"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent rounded-lg"></div>
                        </div>

                        {/* Floating Stats */}
                        <div className="absolute -top-4 -right-4 bg-card rounded-lg p-4 shadow-divine text-card-foreground">
                            <div className="text-2xl font-bold text-accent">50K+</div>
                            <div className="text-sm text-muted-foreground">Lives Touched</div>
                        </div>

                        <div className="absolute -bottom-4 -left-4 bg-card rounded-lg p-4 shadow-divine text-card-foreground">
                            <div className="text-2xl font-bold text-accent">98%</div>
                            <div className="text-sm text-muted-foreground">Satisfaction</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CallToActionSection;