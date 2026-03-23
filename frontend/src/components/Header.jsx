import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Link2, UserCircle, Eye } from 'lucide-react';
import { Button } from './ui/Button';
import { cn } from './ui/Button';

export const Header = () => {
  const location = useLocation();

  const navItemClass = (path) => cn(
    "flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200",
    location.pathname === path 
      ? "bg-primary-100 text-primary-700" 
      : "text-slate-500 hover:text-primary-600 hover:bg-primary-50"
  );

  return (
    <header className="bg-white rounded-2xl p-4 flex items-center justify-between shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100 sticky top-6 z-50">
      <div className="flex items-center gap-2 px-2 text-primary-600 font-bold text-xl tracking-tight">
        <Link2 className="w-8 h-8 p-1.5 bg-primary-600 text-white rounded-lg" />
        <span className="hidden md:block">devlinks</span>
      </div>

      <nav className="flex items-center gap-2">
        <Link to="/links" className={navItemClass('/links')}>
          <Link2 size={20} />
          <span className="hidden md:block">Links</span>
        </Link>
        <Link to="/profile" className={navItemClass('/profile')}>
          <UserCircle size={20} />
          <span className="hidden md:block">Profile Details</span>
        </Link>
      </nav>

      <Button variant="outline" className="hidden md:flex">
        Preview
      </Button>
      <Button variant="outline" size="sm" className="md:hidden px-4">
        <Eye size={20} />
      </Button>
    </header>
  );
};
