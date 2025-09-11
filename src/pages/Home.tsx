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
import Navbar from "@/components/ui/Navbar";

const Home = () => {
    return (
        <div className="min-h-screen">
            {/*<Navbar/>*/}    {/*To be deleted officially */}
            {/*<Header />*/}     {/*To be deleted officially */}
            <HeroSection />
            <ValuePropositionSection />
            {/*<SocialProofSection />*/}     {/*To be edited to fit real content.*/}
            {/*<CallToActionSection />*/}     {/* To be deleted officially */}
            {/*<TeamSection />*/}          {/*To be edited to fit real content.*/}
            {/*<ContactSection />*/}      {/*This page will be needed in the future and updated to standards*/}
            <Footer />
        </div>
    );
};

export default Home;