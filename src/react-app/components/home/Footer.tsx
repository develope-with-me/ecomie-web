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
            {/* Main Footer */}
            <div className="container mx-auto px-2 sm:px-4 py-8 sm:py-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                    {/* Company Info */}
                    <div className="lg:col-span-1">
                        <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-heavenly rounded-full flex items-center justify-center">
                                <img src={ecomieLogo} className="w-full h-full" alt="ECOMIE Logo"/>
                            </div>
                            <span className="text-lg sm:text-xl font-bold">ECOMIE</span>
                        </div>
                        <p className="text-primary-foreground/80 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                            {t("home.footer.description")}
                        </p>

                        {/* Social Links */}
                        <div className="flex space-x-2 sm:space-x-3">
                            <Button variant="ghost" size="icon" className="text-primary-foreground hover:text-accent hover:bg-primary-foreground/10">
                                <Facebook className="w-4 h-4 sm:w-5 sm:h-5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-primary-foreground hover:text-accent hover:bg-primary-foreground/10">
                                <Twitter className="w-4 h-4 sm:w-5 sm:h-5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-primary-foreground hover:text-accent hover:bg-primary-foreground/10">
                                <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-primary-foreground hover:text-accent hover:bg-primary-foreground/10">
                                <Linkedin className="w-4 h-4 sm:w-5 sm:h-5" />
                            </Button>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6">{t("home.footer.quickLinks")}</h4>
                        <ul className="space-y-2 sm:space-y-3">
                            {quickLinks.map((link, index) => (
                                <li key={index}>
                                    <a
                                        href={link.href}
                                        className="text-sm sm:text-base text-primary-foreground/80 hover:text-accent transition-colors"
                                    >
                                        {t(link.nameKey)}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6">{t("home.footer.resources")}</h4>
                        <ul className="space-y-2 sm:space-y-3">
                            {resources.map((resource, index) => (
                                <li key={index}>
                                    <a
                                        href={resource.href}
                                        className="text-sm sm:text-base text-primary-foreground/80 hover:text-accent transition-colors"
                                    >
                                        {t(resource.nameKey)}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support & Contact */}
                    <div>
                        <h4 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6">{t("home.footer.support")}</h4>
                        <ul className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                            {support.map((item, index) => (
                                <li key={index}>
                                    <a
                                        href={item.href}
                                        className="text-sm sm:text-base text-primary-foreground/80 hover:text-accent transition-colors"
                                    >
                                        {t(item.nameKey)}
                                    </a>
                                </li>
                            ))}
                        </ul>

                        {/* Contact Info */}
                        <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                            <div className="flex items-center text-primary-foreground/80">
                                <Mail className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                                <span className="truncate">domoubrice@gmail.com</span>
                            </div>
                            <div className="flex items-center text-primary-foreground/80">
                                <Phone className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                                +237 650 954 190
                            </div>
                            <div className="flex items-start text-primary-foreground/80">
                                <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 mt-0.5" />
                                <span className="text-xs">123 Faith Avenue<br />Kingdom City, TX 12345</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-primary-foreground/20">
                <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center text-xs sm:text-sm gap-2 sm:gap-0">
                        <div className="text-primary-foreground/60 mb-2 sm:mb-0">
                            © 2025 ECOMIE. {t("home.footer.allRightsReserved")}
                        </div>
                        <div className="flex flex-wrap items-center justify-center gap-3 sm:space-x-6 text-primary-foreground/60">
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