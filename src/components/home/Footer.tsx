import React from 'react';
import { Heart, Mail, MapPin, Phone, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
const apiDomain = import.meta.env.VITE_API_DOMAIN;
import ecomieLogo from "@/images/ecomie-logo.png";
import {useGlobalTranslation} from "@/translate/translation-provider";

const Footer = () => {
    const {t} = useGlobalTranslation();
    const quickLinks = [
        { name: t("signUp.home"), href: "/" },
        { name: t("aboutUs"), href: "#aboutUs" },
        { name: t("team"), href: "#team" },
        { name: t("contact"), href: "#contact" }
    ];

    const resources = [
        { name: t("homePage.gettingStartedGuide"), href: "#" },
        { name: t("homePage.videoTutorials"), href: "#" },
        { name: t("homePage.ministryBestPractices"), href: "#" },
        { name: "API Documentation", href: `${apiDomain}/swagger-ui/index.html` },
    ];

    const support = [
        { name: t("homePage.contactSupport"), href: "#" },
        { name: t("homePage.privacyPolicy"), href: "#" },
        { name: t("homePage.termsOfService"), href: "#" }
    ];

    return (
        <footer className="bg-primary text-primary-foreground">
            {/* Main Footer */}
            <div className="container mx-auto px-4 py-16">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div className="lg:col-span-1">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="w-10 h-10 bg-gradient-divine rounded-full flex items-center justify-center">
                                <img src={ecomieLogo} className="w-full" alt=""/>
                            </div>
                            <span className="text-xl font-bold"><i>ECOMIE</i></span>
                        </div>
                        <p className="text-primary-foreground/80 mb-6 leading-relaxed">
                            {t("homePage.empoweringEvangelistsWorldwide...")}
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
                        <h4 className="text-lg font-semibold mb-6">{t("homePage.quickLinks")}</h4>
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
                        <h4 className="text-lg font-semibold mb-6">{t("homePage.resources")}</h4>
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
                        <h4 className="text-lg font-semibold mb-6">{t("homePage.support")}</h4>
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
                            {/*Update to real number*/}
                            {/*<div className="flex items-center text-primary-foreground/80">*/}
                            {/*    <Phone className="w-4 h-4 mr-2" />*/}
                            {/*    +1 (555) 123-4567*/}
                            {/*</div>*/}
                            {/*Update to real address*/}
                            {/*<div className="flex items-start text-primary-foreground/80">*/}
                            {/*    <MapPin className="w-4 h-4 mr-2 mt-0.5" />*/}
                            {/*    123 Faith Avenue<br />Kingdom City, TX 12345*/}
                            {/*</div>*/}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-primary-foreground/20">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center text-sm">
                        <div className="text-primary-foreground/60 mb-4 md:mb-0">
                            © 2024 ECOMIE. {t("homePage.allRightsReserved...")}
                        </div>
                        <div className="flex items-center space-x-6 text-primary-foreground/60">
                            <a href="#" className="hover:text-accent transition-colors">{t("homePage.privacyPolicy")}</a>
                            <a href="#" className="hover:text-accent transition-colors">{t("homePage.termsOfService")}</a>
                            <a href="#" className="hover:text-accent transition-colors">{t("homePage.cookies")}</a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;