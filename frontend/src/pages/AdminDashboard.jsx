import { useEffect, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
// --- START: Mock Dependencies for single-file environment ---
// These files were missing: @/utils/api, @/utils/blockchain, @/components/NavBar

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { NavBar } from "@/components/NavBar";

// 2. Mock API Utility
const mockLoansData = [
    { id: 1, wallet_address: "0x1234567890abcdef1234567890abcdef12345678", amount: 5000, term_months: 12, status: "PENDING", certificate_hash: "0xhash1_valid" },
    { id: 2, wallet_address: "0xabcdef1234567890abcdef1234567890abcdef12", amount: 15000, term_months: 36, status: "APPROVED", certificate_hash: "0xhash2_invalid" },
    { id: 3, wallet_address: "0xdeadbeef1234567890abcdef1234567890abcdef", amount: 2500, term_months: 6, status: "REJECTED", certificate_hash: "0xhash3_valid" },
];

const api = {
  // Mock GET request to fetch loans
  get: async (url) => {
    if (url === "/loans") {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 200));
      return { data: mockLoansData };
    }
    return { data: [] };
  },
  // Mock PATCH request to update loan status
  patch: async (url, data) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 200));
    console.log(`Mock API PATCH: ${url}`, data);
    return {};
  }
};

// 3. Mock Blockchain Utilities
const connectWallet = async () => {
  // Simulate wallet connection and return a mock address
  await new Promise(resolve => setTimeout(resolve, 500));
  return { address: "0xAdmin00000000000000000000000000000000" };
};

const verifyCertificate = async (walletAddress, hash) => {
  // Simulate an on-chain read call delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mock verification logic: only hashes ending in '_valid' are true
  return hash.endsWith("_valid");
};
// --- END: Mock Dependencies ---


export default function AdminDashboard() {
  const [address, setAddress] = useState("");
  const [loans, setLoans] = useState([]);
  const [verifying, setVerifying] = useState(false);
  const [progress, setProgress] = useState(10);
  const [verifyResult, setVerifyResult] = useState(null);
  const [currentCall, setCurrentCall] = useState({ wallet: "", hash: "" });

  const load = async () => {
    try {
        // Use the mock API object defined above
        const res = await api.get("/loans");
        setLoans(res.data);
    } catch (error) {
        console.error("Failed to load loans:", error);
        toast.error("Failed to load loan applications.");
    }
  };

  const onConnect = async () => {
    try {
      // Use the mock connectWallet function defined above
      const { address: connectedAddress } = await connectWallet();
      setAddress(connectedAddress);
      toast.success("Wallet connected successfully!");
    } catch (e) {
      console.log("Wallet connection ignored or failed.", e);
      toast.error("Wallet connection failed.");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const verify = async (loan) => {
    setVerifying(true);
    setProgress(10);
    setVerifyResult(null);
    setCurrentCall({ wallet: loan.wallet_address, hash: loan.certificate_hash });
    
    // Duration for the result message before auto-closing
    const verificationDisplayDuration = 1500; 
    let t;

    try {
      // Start progress simulation
      t = setInterval(() => setProgress((p) => Math.min(90, p + 10)), 300);
      
      // Use the mock verifyCertificate function defined above
      const ok = await verifyCertificate(loan.wallet_address, loan.certificate_hash); 
      
      clearInterval(t);
      setProgress(100);
      setVerifyResult(ok);
      toast[ok ? "success" : "error"](ok ? "Certificate valid" : "Invalid certificate");
    } catch (e) {
      if(t) clearInterval(t);
      setProgress(100);
      setVerifyResult(false);
      toast.error("Verification failed");
    } finally {
        // Automatically close dialog after result is shown
        setTimeout(() => {
            setVerifying(false);
            setProgress(10);
            setVerifyResult(null);
        }, verificationDisplayDuration);
    }
  };

  const setStatus = async (loan, status) => {
    try {
        // Use the mock API patch function
        await api.patch(`/loans/${loan.id}`, { status }); 
        
        // Optimistic UI update/mock update
        setLoans(prevLoans => prevLoans.map(l => 
            l.id === loan.id ? { ...l, status } : l
        ));
        
        toast.success(`Loan ${loan.id} set to ${status}.`);
    } catch (error) {
        console.error("Failed to update status:", error);
        toast.error("Failed to update loan status.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white font-sans">
      {/* NavBar is now defined locally */}
      <NavBar onConnect={onConnect} address={address} /> 

      <main className="mx-auto max-w-6xl px-6 py-10 space-y-8">
        <Card className="shadow-lg border-slate-200 rounded-2xl transition hover:shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-extrabold text-slate-800 border-b pb-2">
              All Loan Applications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-sm border-collapse">
                <thead className="bg-slate-100 text-slate-600 uppercase tracking-wider">
                  <tr>
                    <th className="p-4 text-left font-semibold">Applicant Wallet</th>
                    <th className="p-4 text-center font-semibold">Amount</th>
                    <th className="p-4 text-center font-semibold">Term</th>
                    <th className="p-4 text-center font-semibold">Status</th>
                    <th className="p-4 text-center font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {loans.map((l, i) => (
                    <tr 
                      key={l.id}
                      className={`border-t ${i % 2 === 0 ? "bg-white" : "bg-slate-50"} hover:bg-slate-100 transition duration-150 ease-in-out`}
                    >
                      <td className="py-3 px-4 font-mono text-xs text-slate-800">
                        {l.wallet_address.slice(0, 6)}...{l.wallet_address.slice(-4)}
                      </td>
                      <td className="text-center font-medium text-slate-700">
                        ${l.amount.toLocaleString()}
                      </td>
                      <td className="text-center text-slate-600">{l.term_months}m</td>
                      <td className="text-center">
                        <Badge
                          className="font-medium"
                          variant={
                            l.status === "APPROVED"
                              ? "default"
                              : l.status === "REJECTED"
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {l.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => verify(l)}
                          className="border-slate-300 hover:bg-slate-200 transition duration-150"
                        >
                          Verify Certificate
                        </Button>
                        <Button
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-700 shadow-md hover:shadow-lg transition duration-150"
                          onClick={() => setStatus(l, "APPROVED")}
                          disabled={l.status === 'APPROVED'}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => setStatus(l, "REJECTED")}
                          disabled={l.status === 'REJECTED'}
                        >
                          Reject
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {loans.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="text-center text-slate-500 py-6 italic bg-white"
                      >
                        No applications yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>

      <Dialog
        open={verifying}
        onOpenChange={(o) => {
          // Allow closing only if verification result is final
          if (!o && verifyResult !== null) {
            setVerifying(false);
            setProgress(10);
            setVerifyResult(null);
          }
        }}
      >
        <DialogContent className="rounded-2xl border-slate-200 shadow-xl max-w-lg p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-900">
              Verifying Certificate On-Chain
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-600">
              Calling the <code>verifyCertificate(user, hash)</code> function on the Ethereum Sepolia testnet contract (Mock Call).
            </DialogDescription>
          </DialogHeader>

          <div 
            className="space-y-5 pt-3"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-3 gap-x-3 p-3 bg-slate-50 rounded-lg text-xs text-slate-700 font-mono border border-slate-200">
              <div className="md:col-span-1">
                <span className="font-semibold text-slate-900 block">User Wallet:</span>{" "}
                {currentCall.wallet?.slice(0, 6)}...
                {currentCall.wallet?.slice(-4)}
              </div>
              <div className="md:col-span-2 break-all">
                <span className="font-semibold text-slate-900 block">Certificate Hash:</span>{" "}
                {currentCall.hash}
              </div>
            </div>

            <Progress value={progress} className="h-2 bg-slate-200 [&>div]:bg-blue-500" />
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                {verifyResult === null && (
                  <span className="text-blue-600 font-medium flex items-center gap-2 animate-pulse">
                    <svg className="animate-spin h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Executing read call...
                  </span>
                )}
                {verifyResult === true && (
                  <span className="flex items-center gap-2 text-emerald-700 font-bold">
                    <CheckCircle2 className="w-5 h-5" /> Certificate Valid!
                  </span>
                )}
                {verifyResult === false && (
                  <span className="flex items-center gap-2 text-red-600 font-bold">
                    <XCircle className="w-5 h-5" /> Invalid Certificate
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-500">
                Read-only: No gas fee required.
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
