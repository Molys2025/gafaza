
import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, User, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

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

          <Button variant="outline" className="bg-olive-light text-white hover:bg-olive-dark">
            <User className="mr-2 h-4 w-4" />
            {t('common.login')}
          </Button>
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
            <Button variant="outline" className="bg-olive-light text-white hover:bg-olive-dark w-full">
              <User className="mr-2 h-4 w-4" />
              {t('common.login')}
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
