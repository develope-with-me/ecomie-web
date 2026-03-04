import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, ChevronDown, Heart, User, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import ecomieLogo from "@/images/ecomie-logo.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-primary/95 backdrop-blur-md shadow-gentle">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
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
            <a href="#sessions" className="text-primary-foreground hover:text-accent transition-colors">Sessions</a>
            <a href="#team" className="text-primary-foreground hover:text-accent transition-colors">Team</a>
            <a href="#contact" className="text-primary-foreground hover:text-accent transition-colors">Contact</a>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Button
                  variant="ghost"
                  className="text-primary-foreground hover:bg-primary-foreground/10"
                  onClick={() => navigate('/dashboard')}
                >
                  <User className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
                <Button variant="heavenly" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  className="text-primary-foreground hover:bg-primary-foreground/10"
                  onClick={() => navigate('/auth')}
                >
                  Sign In
                </Button>
                <Button variant="heavenly" onClick={() => navigate('/auth')}>
                  Get Started
                </Button>
              </>
            )}
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
              <a href="#sessions" className="text-primary-foreground hover:text-accent transition-colors">Sessions</a>
              <a href="#team" className="text-primary-foreground hover:text-accent transition-colors">Team</a>
              <a href="#contact" className="text-primary-foreground hover:text-accent transition-colors">Contact</a>

              {user ? (
                <>
                  <Button
                    variant="heavenly"
                    className="w-full"
                    onClick={() => { navigate('/dashboard'); setIsMenuOpen(false); }}
                  >
                    Dashboard
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-primary-foreground/20 text-primary-foreground"
                    onClick={() => { handleSignOut(); setIsMenuOpen(false); }}
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="heavenly"
                    className="w-full"
                    onClick={() => { navigate('/auth'); setIsMenuOpen(false); }}
                  >
                    Get Started
                  </Button>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;