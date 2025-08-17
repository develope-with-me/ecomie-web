import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const ContactSection = () => {
    const contactMethods = [
        {
            icon: Mail,
            title: "Email Us",
            description: "Get in touch with our ministry team",
            contact: "hello@evangeltrack.com",
            action: "Send Email"
        },
        {
            icon: Phone,
            title: "Call Us",
            description: "Speak directly with our support team",
            contact: "+1 (555) 123-4567",
            action: "Call Now"
        },
        {
            icon: MapPin,
            title: "Visit Us",
            description: "Our ministry headquarters",
            contact: "123 Faith Avenue, Kingdom City, TX 12345",
            action: "Get Directions"
        }
    ];

    return (
        <section id="contact" className="py-20 bg-background">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
                        Let's Connect and <span className="text-primary">Serve Together</span>
                    </h2>
                    <p className="text-xl text-muted-foreground leading-relaxed">
                        Have questions about ECOMIE? Want to discuss how we can support your ministry?
                        We'd love to hear from you and explore how we can work together for the Kingdom.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Contact Form */}
                    <div>
                        <Card className="border-0 shadow-gentle">
                            <CardContent className="p-8">
                                <h3 className="text-2xl font-bold text-foreground mb-6">Send Us a Message</h3>
                                <form className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-2">First Name</label>
                                            <Input placeholder="Enter your first name" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-2">Last Name</label>
                                            <Input placeholder="Enter your last name" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                                        <Input type="email" placeholder="Enter your email address" />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">Ministry/Organization</label>
                                        <Input placeholder="Enter your church or organization name" />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">How can we help you?</label>
                                        <Textarea
                                            placeholder="Tell us about your ministry and how ECOMIE can support your evangelism efforts..."
                                            rows={4}
                                        />
                                    </div>

                                    <Button variant="cta" size="lg" className="w-full">
                                        Send Message
                                        <Send className="w-5 h-5 ml-2" />
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Contact Methods */}
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-2xl font-bold text-foreground mb-6">Get In Touch</h3>
                            <p className="text-muted-foreground mb-8 leading-relaxed">
                                We're here to support your evangelism journey. Reach out to us through any of these channels,
                                and our team will respond within 24 hours.
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
                                                <h4 className="text-lg font-semibold text-foreground mb-2">{method.title}</h4>
                                                <p className="text-muted-foreground mb-3">{method.description}</p>
                                                <p className="text-foreground font-medium mb-4">{method.contact}</p>
                                                <Button variant="outline" size="sm">
                                                    {method.action}
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Office Hours */}
                        <Card className="border-0 shadow-gentle bg-gradient-heavenly">
                            <CardContent className="p-6">
                                <h4 className="text-lg font-semibold text-foreground mb-4">Office Hours</h4>
                                <div className="space-y-2 text-muted-foreground">
                                    <div className="flex justify-between">
                                        <span>Monday - Friday</span>
                                        <span>9:00 AM - 6:00 PM CST</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Saturday</span>
                                        <span>10:00 AM - 2:00 PM CST</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Sunday</span>
                                        <span>Closed (Day of Rest)</span>
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