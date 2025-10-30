import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      <section className="bg-[#0B1B3B] text-white">
        <div className="mx-auto max-w-6xl px-4 py-20 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="font-['Space_Grotesk'] text-5xl leading-tight" data-testid="landing-hero-title">Finance that moves with proof</h1>
            <p className="mt-4 text-slate-200 max-w-prose" data-testid="landing-hero-subtitle">Professional loan financing platform with blockchain-verified income certificates. Fast decisions, transparent status.</p>
            <div className="mt-8 flex gap-3">
              <Link to="/dashboard" data-testid="landing-cta-user"><Button className="rounded-full">Apply Now</Button></Link>
              <Link to="/admin" data-testid="landing-cta-admin"><Button variant="outline" className="rounded-full bg-white/10 text-white border-white/30 hover:bg-white/20">Admin</Button></Link>
            </div>
          </div>
          <Card className="bg-white/95 shadow-xl">
            <CardContent className="p-6">
              <ul className="space-y-3 text-slate-700" data-testid="landing-feature-list">
                <li>• Client-side hashing (SHA-256)</li>
                <li>• On-chain certificate storage (Sepolia)</li>
                <li>• Real-time verification for admins</li>
                <li>• Clean, responsive UI</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4 grid md:grid-cols-3 gap-6">
          {["Secure","Transparent","Efficient"].map((t,i)=> (
            <Card key={i}>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg" data-testid={`landing-benefit-${i}`}>{t}</h3>
                <p className="text-sm text-slate-600 mt-2">Designed for compliance-grade operations and delightful UX.</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
