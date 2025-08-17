import React from 'react';
import { Heart, Mail, MapPin, Phone, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ecomieLogo from "@/images/ecomie-logo.png";

const apiDomain = import.meta.env.VITE_API_DOMAIN;

const Footer = () => {
    const quickLinks = [
        { name: "Home", href: "#home" },
        { name: "Features", href: "#features" },
        { name: "Pricing", href: "#pricing" },
        { name: "Team", href: "#team" },
        { name: "Contact", href: "#contact" }
    ];

    const resources = [
        { name: "Getting Started Guide", href: "#" },
        { name: "Video Tutorials", href: "#" },
        { name: "Ministry Best Practices", href: "#" },
        { name: "API Documentation", href: `${apiDomain}/swagger-ui/index.html` },
        { name: "Mobile Apps", href: "#" }
    ];

    const support = [
        { name: "Help Center", href: "#" },
        { name: "Contact Support", href: "#" },
        { name: "System Status", href: "#" },
        { name: "Privacy Policy", href: "#" },
        { name: "Terms of Service", href: "#" }
    ];

    return (
        <footer className="bg-primary text-primary-foreground">
            {/* Main Footer */}
            <div className="container mx-auto px-4 py-16">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div className="lg:col-span-1">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="w-10 h-10 bg-gradient-heavenly rounded-full flex items-center justify-center">
                                {/*<Heart className="w-6 h-6 text-primary-foreground" fill="currentColor" />*/}
                                <img src={ecomieLogo} className="w-full h-full" alt="ECOMIE Logo"/>
                            </div>
                            <span className="text-xl font-bold">ECOMIE</span>
                        </div>
                        <p className="text-primary-foreground/80 mb-6 leading-relaxed">
                            Empowering evangelists worldwide to track, measure, and celebrate their Kingdom impact.
                            Because every soul matters.
                        </p>

                        {/* Social Links */}
                        <div className="flex space-x-3">
                            <Button variant="ghost" size="icon" className="text-primary-foreground hover:text-accent hover:bg-primary-foreground/10">
                                <Facebook className="w-5 h-5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-primary-foreground hover:text-accent hover:bg-primary-foreground/10">
                                <Twitter className="w-5 h-5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-primary-foreground hover:text-accent hover:bg-primary-foreground/10">
                                <Instagram className="w-5 h-5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-primary-foreground hover:text-accent hover:bg-primary-foreground/10">
                                <Linkedin className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
                        <ul className="space-y-3">
                            {quickLinks.map((link, index) => (
                                <li key={index}>
                                    <a
                                        href={link.href}
                                        className="text-primary-foreground/80 hover:text-accent transition-colors"
                                    >
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4 className="text-lg font-semibold mb-6">Resources</h4>
                        <ul className="space-y-3">
                            {resources.map((resource, index) => (
                                <li key={index}>
                                    <a
                                        href={resource.href}
                                        className="text-primary-foreground/80 hover:text-accent transition-colors"
                                    >
                                        {resource.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support & Contact */}
                    <div>
                        <h4 className="text-lg font-semibold mb-6">Support</h4>
                        <ul className="space-y-3 mb-6">
                            {support.map((item, index) => (
                                <li key={index}>
                                    <a
                                        href={item.href}
                                        className="text-primary-foreground/80 hover:text-accent transition-colors"
                                    >
                                        {item.name}
                                    </a>
                                </li>
                            ))}
                        </ul>

                        {/* Contact Info */}
                        <div className="space-y-3 text-sm">
                            <div className="flex items-center text-primary-foreground/80">
                                <Mail className="w-4 h-4 mr-2" />
                                domoubrice@gmail.com
                            </div>
                            <div className="flex items-center text-primary-foreground/80">
                                <Phone className="w-4 h-4 mr-2" />
                                +237 650 954 190
                            </div>
                            <div className="flex items-start text-primary-foreground/80">
                                <MapPin className="w-4 h-4 mr-2 mt-0.5" />
                                123 Faith Avenue<br />Kingdom City, TX 12345
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-primary-foreground/20">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center text-sm">
                        <div className="text-primary-foreground/60 mb-4 md:mb-0">
                            © 2025 ECOMIE. All rights reserved. Built for His Glory.
                        </div>
                        <div className="flex items-center space-x-6 text-primary-foreground/60">
                            <a href="#" className="hover:text-accent transition-colors">Privacy Policy</a>
                            <a href="#" className="hover:text-accent transition-colors">Terms of Service</a>
                            <a href="#" className="hover:text-accent transition-colors">Cookies</a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;