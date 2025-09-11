import React from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, ChevronDown, Heart } from 'lucide-react';
import ecomieLogo from "@/images/ecomie-logo.png";

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-primary/95 backdrop-blur-md shadow-gentle">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-heavenly rounded-full flex items-center justify-center shadow-gentle">
                            <img src={ecomieLogo} className="w-full h-full" alt="ECOMIE Logo"/>
                            {/*<Heart className="w-6 h-6 text-primary-foreground" fill="currentColor" />*/}
                        </div>
                        <span className="text-xl font-bold text-primary-foreground">ECOMIE</span>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        <a href="#home" className="text-primary-foreground hover:text-accent transition-colors">Home</a>
                        <a href="#features" className="text-primary-foreground hover:text-accent transition-colors">Features</a>
                        <a href="#team" className="text-primary-foreground hover:text-accent transition-colors">Team</a>
                        <a href="#pricing" className="text-primary-foreground hover:text-accent transition-colors">Pricing</a>
                        <a href="#contact" className="text-primary-foreground hover:text-accent transition-colors">Contact</a>
                        <div className="flex items-center space-x-1 text-primary-foreground cursor-pointer">
                            <span>English</span>
                            <ChevronDown className="w-4 h-4" />
                        </div>
                    </nav>

                    {/* CTA Button */}
                    <div className="hidden md:block">
                        <Button variant="heavenly" size="lg">
                            Get Started
                        </Button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-primary-foreground"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden mt-4 pb-4 border-t border-primary-foreground/20">
                        <nav className="flex flex-col space-y-4 mt-4">
                            <a href="#home" className="text-primary-foreground hover:text-accent transition-colors">Home</a>
                            <a href="#features" className="text-primary-foreground hover:text-accent transition-colors">Features</a>
                            <a href="#team" className="text-primary-foreground hover:text-accent transition-colors">Team</a>
                            <a href="#pricing" className="text-primary-foreground hover:text-accent transition-colors">Pricing</a>
                            <a href="#contact" className="text-primary-foreground hover:text-accent transition-colors">Contact</a>
                            <Button variant="heavenly" className="w-full mt-4">
                                Get Started
                            </Button>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;