import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ContactSection = () => {
    const { t } = useTranslation();

    const contactMethods = [
        {
            icon: Mail,
            titleKey: "home.contact.emailUs",
            descKey: "home.contact.getSupport",
            contact: "hello@ecomie.com",
            actionKey: "home.contact.sendMessageBtn"
        },
        {
            icon: Phone,
            titleKey: "home.contact.callUs",
            descKey: "home.contact.speakDirectly",
            contact: "+1 (555) 123-4567",
            actionKey: "home.contact.callNow"
        },
        {
            icon: MapPin,
            titleKey: "home.contact.visitUs",
            descKey: "home.contact.headquarters",
            contact: "123 Faith Avenue, Kingdom City, TX 12345",
            actionKey: "home.contact.getDirections"
        }
    ];

    return (
        <section id="contact" className="py-20 bg-background">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 
                        className="text-3xl md:text-5xl font-bold text-foreground mb-6"
                        dangerouslySetInnerHTML={{ __html: t("home.contact.title") }}
                    />
                    <p className="text-xl text-muted-foreground leading-relaxed">
                        {t("home.contact.subtitle")}
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12">
                    <div>
                        <Card className="border-0 shadow-gentle">
                            <CardContent className="p-8">
                                <h3 className="text-2xl font-bold text-foreground mb-6">{t("home.contact.sendMessage")}</h3>
                                <form className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-2">{t("home.contact.firstName")}</label>
                                            <Input placeholder={t("home.contact.firstNamePlaceholder")} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-2">{t("home.contact.lastName")}</label>
                                            <Input placeholder={t("home.contact.lastNamePlaceholder")} />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">{t("home.contact.email")}</label>
                                        <Input type="email" placeholder={t("home.contact.emailPlaceholder")} />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">{t("home.contact.ministry")}</label>
                                        <Input placeholder={t("home.contact.ministryPlaceholder")} />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">{t("home.contact.howHelp")}</label>
                                        <Textarea
                                            placeholder={t("home.contact.messagePlaceholder")}
                                            rows={4}
                                        />
                                    </div>

                                    <Button variant="cta" size="lg" className="w-full">
                                        {t("home.contact.sendMessageBtn")}
                                        <Send className="w-5 h-5 ml-2" />
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-8">
                        <div>
                            <h3 className="text-2xl font-bold text-foreground mb-6">{t("home.contact.getInTouch")}</h3>
                            <p className="text-muted-foreground mb-8 leading-relaxed">
                                {t("home.contact.supportJourney")}
                            </p>
                        </div>

                        <div className="space-y-6">
                            {contactMethods.map((method, index) => (
                                <Card key={index} className="border-0 shadow-gentle hover:shadow-divine transition-all duration-300">
                                    <CardContent className="p-6">
                                        <div className="flex items-start">
                                            <div className="w-12 h-12 bg-gradient-divine rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                                                <method.icon className="w-6 h-6 text-primary-foreground" />
                                            </div>
                                            <div className="flex-grow">
                                                <h4 className="text-lg font-semibold text-foreground mb-2">{t(method.titleKey)}</h4>
                                                <p className="text-muted-foreground mb-3">{t(method.descKey)}</p>
                                                <p className="text-foreground font-medium mb-4">{method.contact}</p>
                                                <Button variant="outline" size="sm">
                                                    {t(method.actionKey)}
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        <Card className="border-0 shadow-gentle bg-gradient-heavenly">
                            <CardContent className="p-6">
                                <h4 className="text-lg font-semibold text-foreground mb-4">{t("home.contact.officeHours")}</h4>
                                <div className="space-y-2 text-muted-foreground">
                                    <div className="flex justify-between">
                                        <span>{t("home.contact.mondayFriday")}</span>
                                        <span>9:00 AM - 6:00 PM CST</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>{t("home.contact.saturday")}</span>
                                        <span>10:00 AM - 2:00 PM CST</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>{t("home.contact.sunday")}</span>
                                        <span>{t("home.contact.closed")}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactSection;