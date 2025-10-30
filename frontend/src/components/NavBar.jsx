import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, Menu, X, Wallet } from "lucide-react";
import { useState } from "react";

export const NavBar = ({ onConnect, address }) => {
  const { pathname } = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-md shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2 group" 
            data-testid="navbar-logo"
          >
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 shadow-md group-hover:shadow-lg transition-all">
              <Shield className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
              FinChain Finance
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Link 
              to="/" 
              data-testid="navbar-link-home" 
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                pathname === '/' 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/dashboard" 
              data-testid="navbar-link-dashboard" 
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                pathname.startsWith('/dashboard') 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Dashboard
            </Link>
            <Link 
              to="/admin" 
              data-testid="navbar-link-admin" 
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                pathname.startsWith('/admin') 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Admin
            </Link>
          </nav>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col gap-2">
              <Link 
                to="/" 
                data-testid="navbar-link-home" 
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  pathname === '/' 
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                Home
              </Link>
              <Link 
                to="/dashboard" 
                data-testid="navbar-link-dashboard" 
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  pathname.startsWith('/dashboard') 
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                Dashboard
              </Link>
              <Link 
                to="/admin" 
                data-testid="navbar-link-admin" 
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  pathname.startsWith('/admin') 
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                Admin
              </Link>
              {!address && (
                <Button 
                  data-testid="navbar-connect-wallet-button-mobile" 
                  onClick={() => {
                    onConnect();
                    setMobileMenuOpen(false);
                  }}
                  className="mt-2 flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  <Wallet className="w-4 h-4" />
                  Connect Wallet
                </Button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};