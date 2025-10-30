import { useEffect, useState } from "react";
import { api } from "@/utils/api";
import { connectWallet, verifyCertificate } from "@/utils/blockchain";
import { NavBar } from "@/components/NavBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";

export default function AdminDashboard(){
  const [address, setAddress] = useState("");
  const [loans, setLoans] = useState([]);
  const [verifying, setVerifying] = useState(false);
  const [progress, setProgress] = useState(10);
  const [verifyResult, setVerifyResult] = useState(null); // true | false | null
  const [currentCall, setCurrentCall] = useState({ wallet:"", hash:"" });

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
    setVerifying(true); setProgress(10); setVerifyResult(null);
    setCurrentCall({ wallet: loan.wallet_address, hash: loan.certificate_hash });
    try{
      // fake progress while awaiting
      const t = setInterval(()=> setProgress((p)=> Math.min(90, p+10)), 300);
      const ok = await verifyCertificate(loan.wallet_address, loan.certificate_hash);
      clearInterval(t);
      setProgress(100);
      setVerifyResult(ok);
      toast[ok? 'success' : 'error'](ok? 'Certificate valid' : 'Invalid certificate');
    }catch(e){ setVerifyResult(false); toast.error('Verification failed'); }
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

      <Dialog open={verifying} onOpenChange={(o)=>{ if(!o){ setVerifying(false); setProgress(10); setVerifyResult(null); }}}>
        <DialogContent data-testid="admin-verify-dialog">
          <DialogHeader>
            <DialogTitle className="text-slate-900">Verifying Certificate on-chain</DialogTitle>
            <DialogDescription data-testid="admin-verify-desc">Calling verifyCertificate(user, hash) on contract 0xF551...BeB9C (Sepolia)</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-3 text-xs text-slate-600">
              <div data-testid="admin-verify-user"><span className="font-medium">User:</span> {currentCall.wallet?.slice(0,6)}...{currentCall.wallet?.slice(-4)}</div>
              <div className="col-span-2" data-testid="admin-verify-hash"><span className="font-medium">Hash:</span> {currentCall.hash?.slice(0,24)}...</div>
            </div>
            <Progress data-testid="admin-verify-progress" value={progress} />
            <div className="flex items-center gap-2 text-sm">
              {verifyResult===null && <span data-testid="admin-verify-status">Contacting contract...</span>}
              {verifyResult===true && <span className="flex items-center gap-1 text-emerald-700" data-testid="admin-verify-success"><CheckCircle2 className="w-4 h-4"/> Certificate valid</span>}
              {verifyResult===false && <span className="flex items-center gap-1 text-red-600" data-testid="admin-verify-fail"><XCircle className="w-4 h-4"/> Invalid certificate</span>}
            </div>
            <div className="text-xs text-slate-500" data-testid="admin-verify-note">This is a read call; no gas required.</div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
