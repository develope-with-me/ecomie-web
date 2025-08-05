import React from 'react';
import Header from '@/components/home/Header';
import HeroSection from '@/components/home/HeroSection';
import ValuePropositionSection from '@/components/home/ValuePropositionSection';
import SocialProofSection from '@/components/home/SocialProofSection';
import CallToActionSection from '@/components/home/CallToActionSection';
import TeamSection from '@/components/home/TeamSection';
import PricingSection from '@/components/home/PricingSection';
import ContactSection from '@/components/home/ContactSection';
import Footer from '@/components/home/Footer';

const Home = () => {
    return (
        <div className="min-h-screen">
            <Header />
            <HeroSection />
            <ValuePropositionSection />
            <SocialProofSection />
            <CallToActionSection />
            <TeamSection />
            <PricingSection />
            <ContactSection />
            <Footer />
        </div>
    );
};

export default Home;