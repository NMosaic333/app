import { useEffect, useState, useMemo } from "react";
import { api } from "@/utils/api";
import { connectWallet } from "@/utils/blockchain";
import { NavBar } from "@/components/NavBar";
import { LoanForm } from "@/components/LoanForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

export default function UserDashboard() {
  const [address, setAddress] = useState("");
  const [loans, setLoans] = useState([]);

  const approved = useMemo(() => loans.filter((l) => l.status === "APPROVED"), [loans]);

  const fetchLoans = async (addr) => {
    if (!addr) return;
    const res = await api.get(`/loans`, { params: { wallet_address: addr } });
    setLoans(res.data);
  };

  const onConnect = async () => {
    try {
      const { address } = await connectWallet();
      setAddress(address);
      fetchLoans(address);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    // Placeholder for initial fetch
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-800">
      <NavBar onConnect={onConnect} address={address} />

      <main className="mx-auto max-w-6xl px-4 py-10 space-y-10">
        {/* Welcome Section */}
        {address ? (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center"
          >
            <h1 className="text-3xl font-semibold tracking-tight">
              Welcome back, <span className="text-emerald-600">{address.slice(0, 8)}...</span>
            </h1>
            <p className="text-slate-500 mt-2">
              Manage your loan applications and check your approval status below.
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-blue-500 bg-clip-text text-transparent">
              Secure Your Loan Effortlessly
            </h1>
            <p className="text-slate-600 mt-3">
              Connect your wallet to start your loan application process.
            </p>
            <button
              onClick={onConnect}
              className="mt-6 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-lg transition-all duration-200"
            >
              Connect Wallet
            </button>
          </motion.div>
        )}

        {address && (
          <>
            {/* Loan Application Form */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white/60 backdrop-blur-lg rounded-2xl shadow-sm border border-slate-200 p-6"
            >
              <LoanForm walletAddress={address} onCreated={() => fetchLoans(address)} />
            </motion.section>

            {/* Approved Applications */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="bg-white/80 backdrop-blur-lg shadow-md rounded-2xl border-slate-200">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <span>✅ Approved Applications</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {approved.map((l) => (
                      <motion.div
                        key={l.id}
                        whileHover={{ scale: 1.02 }}
                        className="rounded-xl border p-4 bg-emerald-50 shadow-sm"
                      >
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-lg">
                            ${l.amount} / {l.term_months}m
                          </p>
                          <Badge className="bg-emerald-600 text-white">APPROVED</Badge>
                        </div>
                        <p className="text-xs text-slate-600 mt-2">
                          Hash: {l.certificate_hash?.slice(0, 18)}...
                        </p>
                      </motion.div>
                    ))}
                    {approved.length === 0 && (
                      <p className="text-sm text-slate-500">No approved applications yet.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.section>

            {/* All Applications */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="bg-white/80 backdrop-blur-lg shadow-md rounded-2xl border-slate-200">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Your Applications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {loans.map((l) => (
                      <motion.div
                        key={l.id}
                        whileHover={{ scale: 1.01 }}
                        className="rounded-xl border p-4 hover:shadow-md transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-lg">
                            ${l.amount} / {l.term_months}m
                          </p>
                          <Badge
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
                        </div>
                        <p className="text-xs text-slate-500 mt-2">
                          Hash: {l.certificate_hash?.slice(0, 18)}...
                        </p>
                      </motion.div>
                    ))}
                    {loans.length === 0 && (
                      <p className="text-sm text-slate-500">No applications yet.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.section>
          </>
        )}
      </main>
    </div>
  );
}