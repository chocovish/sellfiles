'use client';
import { Button } from '../ui/button';
import { useState } from 'react';
import { BrandLogo } from './brand-logo';
import {
  LayoutDashboard,
  Package,
  Store,
  LogOut,
  Menu,
  X,
  UserCircle2,
  ExternalLink
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { CurrentUserAvatar } from './current-user-avatar';
import { useUser } from '@/hooks/use-user';
import { useUserProfile } from '@/hooks/use-user';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LoaderSkeleton } from '../dashboard/loader-skeletone';
import { Link, useRouter } from '@tanstack/react-router';

export function Header() {
  const user = useUser();
  const {userProfile: profile, isLoading} = useUserProfile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  // Check if user type is buyer
  const isBuyer = profile?.userType !== "seller";


  return (
    <header className="w-full border-b bg-gradient-to-r from-white via-purple-50 to-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="inline-block group">
          <BrandLogo variant="dark" size="sm" />
        </Link>

        {/* Mobile menu button */}
        <button
          className="lg:hidden p-2 hover:bg-purple-50 rounded-full transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className="w-6 h-6 text-gray-700" />
          ) : (
            <Menu className="w-6 h-6 text-gray-700" />
          )}
        </button>

        <nav className={`
          ${isMenuOpen ? 'flex' : 'hidden'} 
          lg:flex flex-col lg:flex-row fixed lg:relative 
          top-[61px] lg:top-auto left-0 right-0 
          bg-white lg:bg-transparent border-b lg:border-0 
          p-4 lg:p-0 shadow-lg lg:shadow-none 
          items-start lg:items-center gap-4 
          w-full lg:w-auto z-50
        `}>
          <Link to="/dashboard" className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors">
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>
          
          {!isBuyer && (
            <Link to="/dashboard/products" className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors">
              <Package className="w-5 h-5" />
              <span>Products</span>
            </Link>
          )}
          
          {!isBuyer && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link 
                    to={profile?.shopSlug ? `/shop/${profile.shopSlug}` : '#'}
                    target={profile?.shopSlug ? "_blank" : undefined}
                    rel={profile?.shopSlug ? "noopener noreferrer" : undefined}
                    className={`flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors ${
                      !profile?.shopSlug ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <Store className="w-5 h-5" />
                    <span>Store</span>
                    {profile?.shopSlug && <ExternalLink className="w-4 h-4 ml-1" />}
                  </Link>
                </TooltipTrigger>
                {!profile?.shopSlug && (
                  <TooltipContent>
                    <p>Please add your shop URL in My Profile section</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          )}
          
          <Link to="/dashboard/myprofile" className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors">
            <UserCircle2 className="w-5 h-5" />
            <span>My Profile</span>
          </Link>
            <Link
              to="#"
              className="cursor-pointer flex pl-0 items-center space-x-2 text-gray-700 hover:text-red-600"
              onClick={handleSignOut}
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </Link>
        </nav>
      </div>
    </header>
  );
}