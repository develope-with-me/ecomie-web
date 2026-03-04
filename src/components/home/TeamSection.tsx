import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Linkedin, Twitter, Mail } from 'lucide-react';

const TeamSection = () => {
    const team = [
        {
            name: "Rev. Jonathan Pierce",
            role: "Founder & CEO",
            bio: "Former missionary with 15 years of evangelism experience. Passionate about combining technology with ministry.",
            image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop&crop=face",
            social: {
                linkedin: "#",
                twitter: "#",
                email: "jonathan@evangeltrack.com"
            }
        },
        {
            name: "Dr. Ruth Martinez",
            role: "Head of Product",
            bio: "PhD in Theology and former church planter. Designs features that truly serve the Great Commission.",
            image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop&crop=face",
            social: {
                linkedin: "#",
                twitter: "#",
                email: "ruth@evangeltrack.com"
            }
        },
        {
            name: "Marcus Thompson",
            role: "CTO",
            bio: "Tech veteran and worship leader. Ensures our platform is both powerful and user-friendly.",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
            social: {
                linkedin: "#",
                twitter: "#",
                email: "marcus@evangeltrack.com"
            }
        },
        {
            name: "Sister Mary Catherine",
            role: "Ministry Advisor",
            bio: "30 years of global missions experience. Guides our platform development with biblical wisdom.",
            image: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=300&h=300&fit=crop&crop=face",
            social: {
                linkedin: "#",
                twitter: "#",
                email: "mary@evangeltrack.com"
            }
        }
    ];

    return (
        <section id="team" className="py-20 bg-background">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
                        Meet Our <span className="text-primary">Ministry Team</span>
                    </h2>
                    <p className="text-xl text-muted-foreground leading-relaxed">
                        A diverse team of ministry veterans, technologists, and biblical scholars
                        united by one mission: empowering evangelists worldwide.
                    </p>
                </div>

                {/* Team Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                    {team.map((member, index) => (
                        <Card key={index} className="border-0 shadow-gentle hover:shadow-divine transition-all duration-300 group">
                            <CardContent className="p-6 text-center">
                                <div className="relative mb-6">
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-24 h-24 rounded-full mx-auto object-cover mb-4 border-4 border-accent/20 group-hover:border-accent/50 transition-colors"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent rounded-full"></div>
                                </div>

                                <h4 className="text-xl font-semibold text-foreground mb-2">{member.name}</h4>
                                <p className="text-accent font-medium mb-3">{member.role}</p>
                                <p className="text-muted-foreground text-sm leading-relaxed mb-4">{member.bio}</p>

                                {/* Social Links */}
                                <div className="flex justify-center space-x-3">
                                    <Button variant="ghost" size="icon" className="w-8 h-8">
                                        <Linkedin className="w-4 h-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="w-8 h-8">
                                        <Twitter className="w-4 h-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="w-8 h-8">
                                        <Mail className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Mission Statement */}
                <div className="text-center max-w-4xl mx-auto">
                    <div className="bg-gradient-heavenly rounded-lg p-8 shadow-gentle">
                        <h3 className="text-2xl font-bold text-foreground mb-4">Our Mission</h3>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            "Therefore go and make disciples of all nations..." - Matthew 28:19.
                            We believe technology should serve the Great Commission, not complicate it.
                            Our team is committed to building tools that help every evangelist track,
                            measure, and celebrate the Kingdom impact they're making every day.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TeamSection;