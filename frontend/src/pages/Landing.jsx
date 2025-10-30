import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Link } from "react-router-dom";
import { ShieldCheck, BadgeCheck, Banknote, Users, CheckCircle2, Globe, TrendingUp, Wallet, FileText, Star, Building2, MessageSquare, PhoneCall, Mail, Linkedin, Twitter } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* NAVBAR */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-4">
          <h1 className="font-bold text-xl text-[#0B1B3B]">FinChain Finance</h1>
          <nav className="hidden md:flex gap-6 text-sm text-slate-700">
            <a href="#about" className="hover:text-[#0B1B3B]">About</a>
            <a href="#features" className="hover:text-[#0B1B3B]">Features</a>
            <a href="#services" className="hover:text-[#0B1B3B]">Services</a>
            <a href="#testimonials" className="hover:text-[#0B1B3B]">Testimonials</a>
            <a href="#contact" className="hover:text-[#0B1B3B]">Contact</a>
          </nav>
          <div className="flex gap-3">
            <Link to="/dashboard"><Button>Apply Now</Button></Link>
            <Link to="/admin"><Button variant="outline">Admin</Button></Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="bg-[#0B1B3B] text-white">
        <div className="mx-auto max-w-6xl px-4 py-20 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="font-['Space_Grotesk'] text-5xl leading-tight">Finance that moves with proof</h1>
            <p className="mt-4 text-slate-200 max-w-prose">Professional loan financing platform with blockchain-verified income certificates. Fast approvals, transparent processes, and secure data handling.</p>
            <div className="mt-8 flex gap-3">
              <Link to="/dashboard"><Button className="rounded-full">Apply Now</Button></Link>
              <Link to="/admin"><Button variant="outline" className="rounded-full bg-white/10 text-white border-white/30 hover:bg-white/20">Admin Login</Button></Link>
            </div>
          </div>
          <Card className="bg-white/95 shadow-xl">
            <CardContent className="p-6">
              <ul className="space-y-3 text-slate-700">
                <li>• Client-side hashing (SHA-256)</li>
                <li>• On-chain income verification (Sepolia)</li>
                <li>• Secure wallet-based identity</li>
                <li>• Transparent decision flow</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl font-semibold">About FinChain</h2>
            <p className="mt-4 text-slate-600 leading-relaxed">
              FinChain Finance is redefining how lending works — combining traditional credit expertise with modern blockchain-based verification. 
              Every income proof is hashed, verified, and stored immutably to prevent fraud and accelerate approvals.
            </p>
            <div className="mt-6 flex gap-4">
              <Card><CardContent className="p-4 text-center"><Globe className="w-6 h-6 mx-auto text-[#0B1B3B]"/><p className="text-sm mt-2">Global Access</p></CardContent></Card>
              <Card><CardContent className="p-4 text-center"><TrendingUp className="w-6 h-6 mx-auto text-[#0B1B3B]"/><p className="text-sm mt-2">Growth Focused</p></CardContent></Card>
              <Card><CardContent className="p-4 text-center"><Wallet className="w-6 h-6 mx-auto text-[#0B1B3B]"/><p className="text-sm mt-2">Wallet-Linked Loans</p></CardContent></Card>
            </div>
          </div>
          <img src="https://www.techfunnel.com/wp-content/uploads/2024/06/Blockchain-in-Finance.jpg" alt="Office" className="rounded-2xl shadow-lg"/>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-semibold text-center">Platform Highlights</h2>
          <div className="grid md:grid-cols-3 gap-6 mt-10">
            {[{t:"Secure",d:"Bank-grade encryption for data and smart contracts",I:ShieldCheck},
              {t:"Compliant",d:"KYC-ready workflows and transparent audit trail",I:BadgeCheck},
              {t:"Flexible",d:"Multiple loan types tailored for professionals",I:Banknote}].map((f,i)=>{
              const Icon=f.I; return(
              <Card key={i}>
                <CardContent className="p-6 text-center">
                  <Icon className="w-8 h-8 mx-auto text-[#0B1B3B]"/>
                  <h3 className="font-semibold text-lg mt-3">{f.t}</h3>
                  <p className="text-slate-600 text-sm mt-2">{f.d}</p>
                </CardContent>
              </Card>
            )})}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-semibold">Our Loan Services</h2>
          <p className="text-slate-600 mt-3">From self-employed professionals to small businesses — we offer customized products for every need.</p>
          <div className="grid md:grid-cols-4 gap-6 mt-10">
            {["Personal Loans","Equipment Finance","Invoice Loans","Working Capital"].map((s,i)=>(
              <Card key={i}>
                <CardContent className="p-6">
                  <FileText className="w-6 h-6 text-[#0B1B3B] mx-auto"/>
                  <p className="font-semibold mt-3">{s}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-semibold text-center">What Clients Say</h2>
          <div className="grid md:grid-cols-3 gap-6 mt-10">
            {[
              {q:"Approval was quick and transparent.",n:"Aarav Mehta"},
              {q:"Loved the real-time verification system.",n:"Priya Sharma"},
              {q:"Finally a lender that feels trustworthy and modern.",n:"Rahul Desai"}
            ].map((t,i)=>(
              <Card key={i}>
                <CardContent className="p-6">
                  <Star className="w-5 h-5 text-yellow-500"/>
                  <p className="mt-3 text-slate-700 italic">“{t.q}”</p>
                  <p className="mt-4 text-sm text-slate-500">— {t.n}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* PARTNERS */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-semibold">Trusted by Partners</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mt-8">
            {["Visa","Razorpay","Polygon","Chainlink","Supabase"].map((p,i)=>(
              <div key={i} className="text-slate-500 font-semibold">{p}</div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-20">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl font-semibold">Get in Touch</h2>
            <p className="text-slate-600 mt-3">Have questions about your application or partnership opportunities? Our team is here to help you 24/7.</p>
            <ul className="mt-6 space-y-3 text-slate-700">
              <li className="flex items-center gap-2"><PhoneCall className="w-4 h-4"/> +91 98765 43210</li>
              <li className="flex items-center gap-2"><Mail className="w-4 h-4"/> support@finchain.finance</li>
              <li className="flex items-center gap-2"><Building2 className="w-4 h-4"/> Mumbai, India</li>
            </ul>
          </div>
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Send us a Message</h3>
              <form className="space-y-3">
                <input placeholder="Full Name" className="w-full border rounded-md p-2 text-sm"/>
                <input placeholder="Email" className="w-full border rounded-md p-2 text-sm"/>
                <textarea placeholder="Message" rows={3} className="w-full border rounded-md p-2 text-sm"/>
                <Button className="w-full">Submit</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t bg-[#0B1B3B] text-white">
        <div className="max-w-6xl mx-auto px-4 py-8 text-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <span>© {new Date().getFullYear()} FinChain Finance. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <Linkedin className="w-4 h-4"/> <Twitter className="w-4 h-4"/> 
            <a href="#" className="hover:underline">Privacy</a>
            <a href="#" className="hover:underline">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
