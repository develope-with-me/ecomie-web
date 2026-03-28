import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {Menu, X, User, LogOut, Shield, LayoutDashboard, Home} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { userApi } from '@/lib/api';
import ecomieLogo from "@/images/ecomie-logo.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfilePicture = async () => {
      if (user) {
        const pix = await userApi.getMyPix().catch(() => null);
        setProfilePicture(pix);
      }
    };
    fetchProfilePicture();
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.profile-dropdown')) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

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
                <div className="relative profile-dropdown">
                  <button 
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 text-primary-foreground hover:bg-primary-foreground/10 px-3 py-2 rounded-md transition-colors"
                  >
                    {profilePicture ? (
                      <img 
                        src={profilePicture} 
                        alt="Profile" 
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-heavenly flex items-center justify-center">
                        <User className="w-4 h-4 text-primary" />
                      </div>
                    )}
                    <span className="font-medium">{user.firstName || 'User'}</span>
                  </button>
                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border z-50">
                      <div className="px-4 py-3 border-b">
                        <p className="text-sm font-medium text-foreground">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                        <button
                            onClick={() => { setProfileDropdownOpen(false); navigate('/'); }}
                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                        >
                            <Home className="w-4 h-4" />
                            Home
                        </button>
                      <button 
                        onClick={() => { setProfileDropdownOpen(false); navigate('/dashboard'); }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                      </button>
                      {isAdmin && (
                        <button 
                          onClick={() => { setProfileDropdownOpen(false); navigate('/admin'); }}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                        >
                          <Shield className="w-4 h-4" />
                          Admin Panel
                        </button>
                      )}
                      <button 
                        onClick={() => { setProfileDropdownOpen(false); handleSignOut(); }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-muted transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
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
                    variant="ghost"
                    className="w-full justify-start text-primary-foreground"
                    onClick={() => { navigate('/dashboard'); setIsMenuOpen(false); }}
                  >
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                  {isAdmin && (
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-primary-foreground"
                      onClick={() => { navigate('/admin'); setIsMenuOpen(false); }}
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      Admin Panel
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    className="w-full border-primary-foreground/20 text-primary-foreground"
                    onClick={() => { handleSignOut(); setIsMenuOpen(false); }}
                  >
                    Logout
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