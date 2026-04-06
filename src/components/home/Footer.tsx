import React from 'react';
import { Mail, MapPin, Phone, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ecomieLogo from "@/images/ecomie-logo.png";
import { useTranslation } from 'react-i18next';

const apiDomain = import.meta.env.VITE_API_DOMAIN;

const Footer = () => {
    const { t } = useTranslation();

    const quickLinks = [
        { nameKey: "home.home", href: "#home" },
        { nameKey: "home.features", href: "#features" },
        { nameKey: "home.pricing", href: "#pricing" },
        { nameKey: "home.footerTeam", href: "#team" },
        { nameKey: "home.footerContact", href: "#contact" }
    ];

    const resources = [
        { nameKey: "home.footer.gettingStarted", href: "#" },
        { nameKey: "home.footer.videoTutorials", href: "#" },
        { nameKey: "home.footer.bestPractices", href: "#" },
        { nameKey: "home.footer.apiDocs", href: `${apiDomain}/swagger-ui/index.html` },
        { nameKey: "home.footer.mobileApps", href: "#" }
    ];

    const support = [
        { nameKey: "home.footer.helpCenter", href: "#" },
        { nameKey: "home.footer.contactSupport", href: "#" },
        { nameKey: "home.footer.systemStatus", href: "#" },
        { nameKey: "home.footer.privacyPolicy", href: "#" },
        { nameKey: "home.footer.termsOfService", href: "#" }
    ];

    return (
        <footer className="bg-primary text-primary-foreground">
            <div className="container mx-auto px-4 py-16">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-1">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="w-10 h-10 bg-gradient-heavenly rounded-full flex items-center justify-center">
                                <img src={ecomieLogo} className="w-full h-full" alt="ECOMIE Logo"/>
                            </div>
                            <span className="text-xl font-bold">ECOMIE</span>
                        </div>
                        <p className="text-primary-foreground/80 mb-6 leading-relaxed">
                            {t("home.footer.description")}
                        </p>

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

                    <div>
                        <h4 className="text-lg font-semibold mb-6">{t("home.footer.quickLinks")}</h4>
                        <ul className="space-y-3">
                            {quickLinks.map((link, index) => (
                                <li key={index}>
                                    <a
                                        href={link.href}
                                        className="text-primary-foreground/80 hover:text-accent transition-colors"
                                    >
                                        {t(link.nameKey)}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold mb-6">{t("home.footer.resources")}</h4>
                        <ul className="space-y-3">
                            {resources.map((resource, index) => (
                                <li key={index}>
                                    <a
                                        href={resource.href}
                                        className="text-primary-foreground/80 hover:text-accent transition-colors"
                                    >
                                        {t(resource.nameKey)}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold mb-6">{t("home.footer.support")}</h4>
                        <ul className="space-y-3 mb-6">
                            {support.map((item, index) => (
                                <li key={index}>
                                    <a
                                        href={item.href}
                                        className="text-primary-foreground/80 hover:text-accent transition-colors"
                                    >
                                        {t(item.nameKey)}
                                    </a>
                                </li>
                            ))}
                        </ul>

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

            <div className="border-t border-primary-foreground/20">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center text-sm">
                        <div className="text-primary-foreground/60 mb-4 md:mb-0">
                            © 2025 ECOMIE. {t("home.footer.allRightsReserved")}
                        </div>
                        <div className="flex items-center space-x-6 text-primary-foreground/60">
                            <a href="#" className="hover:text-accent transition-colors">{t("home.footer.privacyPolicy")}</a>
                            <a href="#" className="hover:text-accent transition-colors">{t("home.footer.termsOfService")}</a>
                            <a href="#" className="hover:text-accent transition-colors">{t("home.footer.cookies")}</a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;