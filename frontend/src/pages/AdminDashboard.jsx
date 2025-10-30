import { useEffect, useState } from "react";
import { api } from "@/utils/api";
import { connectWallet, verifyCertificate } from "@/utils/blockchain";
import { NavBar } from "@/components/NavBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function AdminDashboard(){
  const [address, setAddress] = useState("");
  const [loans, setLoans] = useState([]);

  const load = async () => {
    const res = await api.get('/loans');
    setLoans(res.data);
  };

  const onConnect = async () => {
    try{
      const { address } = await connectWallet();
      setAddress(address);
    }catch(e){/* ignore */}
  };

  useEffect(()=>{ load(); }, []);

  const verify = async (loan) => {
    try{
      const ok = await verifyCertificate(loan.wallet_address, loan.certificate_hash);
      toast[ok? 'success' : 'error'](ok? 'Certificate valid' : 'Invalid certificate');
    }catch(e){ toast.error('Verification failed'); }
  };

  const setStatus = async (loan, status) => {
    await api.patch(`/loans/${loan.id}`, { status });
    await load();
  };

  return (
    <div className="min-h-screen bg-white">
      <NavBar onConnect={onConnect} address={address} />
      <main className="mx-auto max-w-6xl px-4 py-8 space-y-8">
        <Card>
          <CardHeader>
            <CardTitle data-testid="admin-loans-title">All Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm" data-testid="admin-loans-table">
                <thead>
                  <tr className="text-left text-slate-500">
                    <th className="py-2">Applicant</th>
                    <th>Amount</th>
                    <th>Term</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loans.map((l)=> (
                    <tr key={l.id} className="border-t">
                      <td className="py-3" data-testid="admin-loan-wallet">{l.wallet_address.slice(0,6)}...{l.wallet_address.slice(-4)}</td>
                      <td>${'{'}l.amount{'}'}</td>
                      <td>{'{'}l.term_months{'}'}m</td>
                      <td><Badge data-testid="admin-loan-status" variant={l.status==='APPROVED'? 'default' : l.status==='REJECTED' ? 'destructive' : 'secondary'}>{l.status}</Badge></td>
                      <td className="space-x-2 py-2">
                        <Button data-testid={`admin-verify-${l.id}`} variant="outline" onClick={()=>verify(l)}>Verify</Button>
                        <Button data-testid={`admin-approve-${l.id}`} className="bg-emerald-600 hover:bg-emerald-700" onClick={()=>setStatus(l,'APPROVED')}>Approve</Button>
                        <Button data-testid={`admin-reject-${l.id}`} variant="destructive" onClick={()=>setStatus(l,'REJECTED')}>Reject</Button>
                      </td>
                    </tr>
                  ))}
                  {loans.length===0 && (
                    <tr><td colSpan={5} className="text-center text-slate-500 py-6" data-testid="admin-no-loans">No applications yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
