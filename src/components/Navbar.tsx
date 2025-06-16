
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, User, ChevronDown, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="bg-olive text-white py-4 px-6 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex-shrink-0 mr-8">
          <Link to="/" className="text-2xl font-bold">
            Zeytna
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/search" className="hover:text-sand transition-colors">
            {t('common.search')}
          </Link>
          <Link to="/owner-profile" className="hover:text-sand transition-colors">
            {t('common.owner')}
          </Link>
          <Link to="/harvester-profile" className="hover:text-sand transition-colors">
            {t('common.harvester')}
          </Link>
          <Link to="/messages" className="hover:text-sand transition-colors">
            {t('common.messages')}
          </Link>
          <Link to="/payment" className="hover:text-sand transition-colors">
            {t('common.payments')}
          </Link>
          <Link to="/evaluation" className="hover:text-sand transition-colors">
            {t('common.evaluations')}
          </Link>
          
          {/* Menu More avec À propos */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center hover:text-sand transition-colors">
              Plus <ChevronDown className="ml-1 h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white text-olive-dark border border-gray-200 shadow-lg z-50">
              <DropdownMenuItem asChild>
                <Link to="/about" className="w-full px-4 py-2 hover:bg-sand-light">
                  {t('common.about')}
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Auth Section */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="bg-olive-light text-white hover:bg-olive-dark border-olive-light">
                  <User className="mr-1 h-3 w-3" />
                  <span className="hidden lg:inline">{user.email?.split('@')[0]}</span>
                  <ChevronDown className="ml-1 h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white text-olive-dark border border-gray-200 shadow-lg z-50">
                <DropdownMenuItem asChild>
                  <Link to="/owner-profile" className="w-full px-4 py-2 hover:bg-sand-light">
                    Mon profil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="w-full px-4 py-2 hover:bg-sand-light cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="outline" size="sm" className="bg-olive-light text-white hover:bg-olive-dark border-olive-light" asChild>
              <Link to="/auth">
                <User className="mr-1 h-3 w-3" />
                <span className="hidden lg:inline">{t('common.login')}</span>
                <span className="lg:hidden">Login</span>
              </Link>
            </Button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-olive-dark py-4 px-6 shadow-lg animate-fadeIn z-50">
          <div className="flex flex-col space-y-4">
            <Link to="/search" className="text-white hover:text-sand transition-colors" onClick={() => setIsOpen(false)}>
              {t('common.search')}
            </Link>
            <Link to="/owner-profile" className="text-white hover:text-sand transition-colors" onClick={() => setIsOpen(false)}>
              {t('common.owner')}
            </Link>
            <Link to="/harvester-profile" className="text-white hover:text-sand transition-colors" onClick={() => setIsOpen(false)}>
              {t('common.harvester')}
            </Link>
            <Link to="/messages" className="text-white hover:text-sand transition-colors" onClick={() => setIsOpen(false)}>
              {t('common.messages')}
            </Link>
            <Link to="/payment" className="text-white hover:text-sand transition-colors" onClick={() => setIsOpen(false)}>
              {t('common.payments')}
            </Link>
            <Link to="/evaluation" className="text-white hover:text-sand transition-colors" onClick={() => setIsOpen(false)}>
              {t('common.evaluations')}
            </Link>
            <Link to="/about" className="text-white hover:text-sand transition-colors" onClick={() => setIsOpen(false)}>
              {t('common.about')}
            </Link>
            
            {user ? (
              <>
                <Link to="/owner-profile" className="text-white hover:text-sand transition-colors" onClick={() => setIsOpen(false)}>
                  Mon profil
                </Link>
                <Button 
                  variant="outline" 
                  className="bg-olive-light text-white hover:bg-olive-dark w-full"
                  onClick={() => {
                    handleSignOut();
                    setIsOpen(false);
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Déconnexion
                </Button>
              </>
            ) : (
              <Button variant="outline" className="bg-olive-light text-white hover:bg-olive-dark w-full" asChild>
                <Link to="/auth" onClick={() => setIsOpen(false)}>
                  <User className="mr-2 h-4 w-4" />
                  {t('common.login')}
                </Link>
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
