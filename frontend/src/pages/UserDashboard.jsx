import { useEffect, useState } from "react";
import { api } from "@/utils/api";
import { connectWallet } from "@/utils/blockchain";
import { NavBar } from "@/components/NavBar";
import { LoanForm } from "@/components/LoanForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function UserDashboard(){
  const [address, setAddress] = useState("");
  const [loans, setLoans] = useState([]);

  const fetchLoans = async (addr) => {
    if (!addr) return;
    const res = await api.get(`/loans`, { params: { wallet_address: addr }});
    setLoans(res.data);
  };

  const onConnect = async () => {
    try{
      const { address } = await connectWallet();
      setAddress(address);
      fetchLoans(address);
    }catch(e){/* ignore */}
  };

  useEffect(()=>{ /* initial noop */ }, []);

  return (
    <div className="min-h-screen bg-white">
      <NavBar onConnect={onConnect} address={address} />
      <main className="mx-auto max-w-6xl px-4 py-8 space-y-8">
        <section>
          <LoanForm walletAddress={address} onCreated={()=>fetchLoans(address)} />
        </section>
        <section>
          <Card>
            <CardHeader>
              <CardTitle data-testid="user-loans-title">Your Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {loans.map((l)=> (
                  <div key={l.id} className="rounded-lg border p-4" data-testid="user-loan-card">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">${'{'}l.amount{'}'} / {""}{'{'}l.term_months{'}'}m</p>
                      <Badge data-testid="user-loan-status" variant={l.status==='APPROVED'? 'default' : l.status==='REJECTED' ? 'destructive' : 'secondary'}>{l.status}</Badge>
                    </div>
                    <p className="text-xs text-slate-500 mt-2" data-testid="user-loan-hash">Hash: {l.certificate_hash?.slice(0,18)}...</p>
                  </div>
                ))}
                {loans.length===0 && (
                  <p className="text-sm text-slate-500" data-testid="user-no-loans">No applications yet.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
