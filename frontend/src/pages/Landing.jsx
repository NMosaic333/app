import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Link } from "react-router-dom";
import { ShieldCheck, BadgeCheck, Banknote, Users, CheckCircle2 } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* HERO */}
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

      {/* COMPANY */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4 grid md:grid-cols-3 gap-6">
          {[{t:"Secure", d:"Bank-grade security for data and contracts", I:ShieldCheck}, {t:"Compliant", d:"KYC-ready workflows and full audit trail", I:BadgeCheck}, {t:"Flexible", d:"Personal and professional loan products", I:Banknote}].map((it,i)=>{
            const Icon = it.I; return (
            <Card key={i} data-testid={`landing-pillar-${i}`}>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <Icon className="w-5 h-5 text-[#0B1B3B]"/>
                  <h3 className="font-semibold text-lg">{it.t}</h3>
                </div>
                <p className="text-sm text-slate-600 mt-2">{it.d}</p>
              </CardContent>
            </Card>)})}
        </div>
      </section>

      {/* ABOUT */}
      <section className="py-12 bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 grid md:grid-cols-2 gap-10 items-start">
          <div>
            <h2 className="text-2xl font-semibold" data-testid="landing-about-title">About FinChain</h2>
            <p className="mt-3 text-slate-600" data-testid="landing-about-copy">We are a fintech team combining lending expertise with verifiable on-chain proofs. Our mission is to make capital access instant, fair, and transparent for professionals worldwide.</p>
            <Accordion type="single" collapsible className="mt-6" data-testid="landing-faq">
              <AccordionItem value="f1">
                <AccordionTrigger>How does verification work?</AccordionTrigger>
                <AccordionContent>We hash your uploaded certificate in your browser, then store the hash on-chain. Admins verify by comparing hashes via smart contract.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="f2">
                <AccordionTrigger>Which networks do you support?</AccordionTrigger>
                <AccordionContent>We currently support Sepolia for testing and can extend to mainnet or L2s.</AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold" data-testid="landing-facilities-title">Facilities & Products</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-600" data-testid="landing-facilities-list">
                <li>• Working capital lines</li>
                <li>• Invoice-backed loans</li>
                <li>• Professional income loans</li>
                <li>• Equipment financing</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-semibold" data-testid="landing-testimonials-title">What our customers say</h2>
          <div className="grid md:grid-cols-3 gap-6 mt-6">
            {["Approval was fast and transparent.", "Loved the clear status updates.", "Finally a lender that feels modern."].map((q,i)=> (
              <Card key={i} data-testid={`landing-testimonial-${i}`}>
                <CardContent className="p-6">
                  <p className="text-slate-700">“{q}”</p>
                  <div className="mt-4 flex items-center gap-2 text-sm text-slate-500"><Users className="w-4 h-4"/> Verified Client</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16 bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 grid md:grid-cols-3 gap-6">
          {["Connect wallet","Upload certificate","Get decision"].map((t,i)=> (
            <Card key={i} data-testid={`landing-step-${i}`}>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600"/>
                  <h3 className="font-semibold">{t}</h3>
                </div>
                <p className="text-sm text-slate-600 mt-2">End-to-end in minutes with on-chain verification.</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t">
        <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-slate-600 flex items-center justify-between">
          <span data-testid="landing-footer-brand">© {new Date().getFullYear()} FinChain Finance</span>
          <div className="flex items-center gap-3">
            <a href="#" data-testid="landing-footer-privacy" className="hover:text-slate-900">Privacy</a>
            <a href="#" data-testid="landing-footer-terms" className="hover:text-slate-900">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
