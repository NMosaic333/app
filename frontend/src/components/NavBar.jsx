import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const NavBar = ({ onConnect, address }) => {
  const { pathname } = useLocation();
  return (
    <header className="w-full border-b bg-white/80 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-semibold tracking-wide text-slate-900" data-testid="navbar-logo">FinChain Loans</Link>
        <nav className="flex items-center gap-2">
          <Link to="/" data-testid="navbar-link-home" className={`px-3 py-2 rounded-md text-sm ${pathname==='/'?'text-slate-900':'text-slate-600 hover:text-slate-900'}`}>Home</Link>
          <Link to="/dashboard" data-testid="navbar-link-dashboard" className={`px-3 py-2 rounded-md text-sm ${pathname.startsWith('/dashboard')?'text-slate-900':'text-slate-600 hover:text-slate-900'}`}>User</Link>
          <Link to="/admin" data-testid="navbar-link-admin" className={`px-3 py-2 rounded-md text-sm ${pathname.startsWith('/admin')?'text-slate-900':'text-slate-600 hover:text-slate-900'}`}>Admin</Link>
        </nav>
        <div>
          {address ? (
            <span className="text-xs font-medium text-slate-700" data-testid="navbar-wallet-address">{address.slice(0,6)}...{address.slice(-4)}</span>
          ) : (
            <Button data-testid="navbar-connect-wallet-button" onClick={onConnect} className="rounded-full">Connect Wallet</Button>
          )}
        </div>
      </div>
    </header>
  );
};
