import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {Menu, X, User, LogOut, Shield, LayoutDashboard, Home, Globe, ChevronDown} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { userApi } from '@/lib/api';
import ecomieLogo from "@/images/ecomie-logo.png";
import { useTranslation } from 'react-i18next';

interface HeaderProps {
  hideNav?: boolean;
}

const Header: React.FC<HeaderProps> = ({ hideNav = false }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState(i18n.language || 'en');

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
      if (!target.closest('.lang-dropdown')) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleLanguageChange = (lang: string) => {
    setCurrentLang(lang);
    i18n.changeLanguage(lang);
    setLangDropdownOpen(false);
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
          {!hideNav && (
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#home" className="text-primary-foreground hover:text-accent transition-colors">{t("home.home")}</a>
              <a href="#features" className="text-primary-foreground hover:text-accent transition-colors">{t("home.features")}</a>
              <a href="#sessions" className="text-primary-foreground hover:text-accent transition-colors">{t("dashboard.sessions")}</a>
              <a href="#team" className="text-primary-foreground hover:text-accent transition-colors">{t("home.headerTeam")}</a>
              <a href="#contact" className="text-primary-foreground hover:text-accent transition-colors">{t("home.headerContact")}</a>
            </nav>
          )}

          {/* Language Selector & Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language Selector */}
            <div className="relative lang-dropdown">
              <button 
                onClick={(e) => { e.stopPropagation(); setLangDropdownOpen(!langDropdownOpen); }}
                className="flex items-center gap-1 text-primary-foreground hover:bg-primary-foreground/10 px-3 py-2 rounded-md transition-colors"
              >
                <Globe className="w-4 h-4" />
                <span className="text-sm uppercase">{currentLang}</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg border z-50">
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleLanguageChange('en'); }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-muted ${currentLang === 'en' ? 'bg-muted text-primary font-medium' : 'text-foreground'}`}
                  >
                    {t("home.english")}
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleLanguageChange('fr'); }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-muted ${currentLang === 'fr' ? 'bg-muted text-primary font-medium' : 'text-foreground'}`}
                  >
                    {t("home.french")}
                  </button>
                </div>
              )}
            </div>
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
                    <span className="font-medium">{user.firstName || t("common.user")}</span>
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
                            {t("common.home")}
                        </button>
                      <button 
                        onClick={() => { setProfileDropdownOpen(false); navigate('/dashboard'); }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        {t("common.dashboard")}
                      </button>
                      {isAdmin && (
                        <button 
                          onClick={() => { setProfileDropdownOpen(false); navigate('/admin'); }}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                        >
                          <Shield className="w-4 h-4" />
                          {t("dashboard.adminPanel")}
                        </button>
                      )}
                      <button 
                        onClick={() => { setProfileDropdownOpen(false); handleSignOut(); }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-muted transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        {t("common.logout")}
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
                  {t("auth.signIn")}
                </Button>
                <Button variant="heavenly" onClick={() => navigate('/auth')}>
                  {t("home.getStarted")}
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
              {hideNav ? (
                <div className="flex items-center gap-2 pt-2 border-t border-primary-foreground/20">
                  <Globe className="w-4 h-4 text-primary-foreground" />
                  <span className="text-primary-foreground text-sm">{t("home.language")}:</span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleLanguageChange('en')}
                      className={`px-3 py-1 rounded text-sm ${currentLang === 'en' ? 'bg-white/20 text-white font-medium' : 'text-white/70 hover:text-white'}`}
                    >
                      EN
                    </button>
                    <button 
                      onClick={() => handleLanguageChange('fr')}
                      className={`px-3 py-1 rounded text-sm ${currentLang === 'fr' ? 'bg-white/20 text-white font-medium' : 'text-white/70 hover:text-white'}`}
                    >
                      FR
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <a href="#home" className="text-primary-foreground hover:text-accent transition-colors">{t("home.home")}</a>
                  <a href="#features" className="text-primary-foreground hover:text-accent transition-colors">{t("home.features")}</a>
                  <a href="#sessions" className="text-primary-foreground hover:text-accent transition-colors">{t("dashboard.sessions")}</a>
                  <a href="#team" className="text-primary-foreground hover:text-accent transition-colors">{t("home.headerTeam")}</a>
                  <a href="#contact" className="text-primary-foreground hover:text-accent transition-colors">{t("home.headerContact")}</a>

                  {/* Language Selector Mobile */}
                  <div className="flex items-center gap-2 pt-2 border-t border-primary-foreground/20">
                    <Globe className="w-4 h-4 text-primary-foreground" />
                    <span className="text-primary-foreground text-sm">{t("home.language")}:</span>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleLanguageChange('en')}
                        className={`px-3 py-1 rounded text-sm ${currentLang === 'en' ? 'bg-white/20 text-white font-medium' : 'text-white/70 hover:text-white'}`}
                      >
                        EN
                      </button>
                      <button 
                        onClick={() => handleLanguageChange('fr')}
                        className={`px-3 py-1 rounded text-sm ${currentLang === 'fr' ? 'bg-white/20 text-white font-medium' : 'text-white/70 hover:text-white'}`}
                      >
                        FR
                      </button>
                    </div>
                  </div>
                </>
              )}

              {user ? (
                <>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-primary-foreground"
                    onClick={() => { navigate('/dashboard'); setIsMenuOpen(false); }}
                  >
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    {t("common.dashboard")}
                  </Button>
                  {isAdmin && (
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-primary-foreground"
                      onClick={() => { navigate('/admin'); setIsMenuOpen(false); }}
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      {t("dashboard.adminPanel")}
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    className="w-full border-primary-foreground/20 text-primary-foreground"
                    onClick={() => { handleSignOut(); setIsMenuOpen(false); }}
                  >
                    {t("common.logout")}
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="heavenly"
                    className="w-full"
                    onClick={() => { navigate('/auth'); setIsMenuOpen(false); }}
                  >
                    {t("home.getStarted")}
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