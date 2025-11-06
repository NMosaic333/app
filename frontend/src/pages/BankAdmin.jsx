import React, { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf"; // v5 compatible
import { api } from "@/utils/api";
import { generateFileHash, verifyCertificate, connectWallet } from "@/utils/blockchain";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle, Home, Users, PieChart, Settings, FileText } from "lucide-react";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function AnotherAdmin() {
  const [loans, setLoans] = useState([]);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfHash, setPdfHash] = useState("");
  const [loading, setLoading] = useState(false);
  const [verifyData, setVerifyData] = useState({ wallet: "", hash: "" });
  const [address, setAddress] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [progress, setProgress] = useState(10);
  const [verifyResult, setVerifyResult] = useState(null);
  const [currentCall, setCurrentCall] = useState({ wallet: "", hash: "" });

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      const res = await api.get("/admin/loans");
      setLoans(res.data);
    } catch (err) {
      console.error("Error fetching loans:", err);
    }
  };

  const openLoan = async (loan) => {
    setSelectedLoan(loan);

    try {
      const fileRes = await api.get(`/admin/loans/${loan.id}/certificate`, {
        responseType: "blob",
      });
      const fileBlob = new Blob([fileRes.data], { type: "application/pdf" });
      setPdfFile(fileBlob);

      const hash = await generateFileHash(fileBlob);
      setPdfHash(hash);
      setVerifyData({ ...verifyData, wallet: address, hash });
    } catch (err) {
      console.error("Error loading certificate:", err);
      setPdfFile(null);
      setPdfHash("");
      toast.error("Error loading certificate");
    }
  };

  // Connect admin wallet
  const onConnect = async () => {
    try {
      const { address: connectedAddress } = await connectWallet();
      setAddress(connectedAddress);
      setVerifyData((prev) => ({ ...prev, wallet: connectedAddress }));
      toast.success("Wallet connected successfully!");
    } catch (e) {
      console.error("Wallet connection failed:", e);
      toast.error("Wallet connection failed.");
    }
  };

  // Approve / Reject — frontend-only version
  const updateLoanStatus = async (status) => {
    if (!selectedLoan) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("status", status);

      // ✅ Use your API helper that returns Axios-style responses
      const res = await api.patch(`/admin/loans/${selectedLoan.id}/status`, formData);

      // Axios responses don’t have `ok` — so remove this check
      // Instead, rely on `res.status` or `res.data`
      if (res.status !== 200) throw new Error("Failed to update status");

      // ✅ Get updated loan from backend (if your API returns it)
      const updatedLoan = res.data;

      // ✅ Update loans list in UI
      setLoans((prevLoans) =>
        prevLoans.map((loan) =>
          loan.id === selectedLoan.id
            ? { ...loan, status: updatedLoan.status || status }
            : loan
        )
      );

      // ✅ Update selected loan directly
      setSelectedLoan((prev) => ({
        ...prev,
        status: updatedLoan.status || status,
      }));

      // ✅ Cleanup
      setPdfFile(null);
      setPdfHash("");
      setVerifyResult(null);

      toast.success(`Loan marked as ${updatedLoan.status || status}`);
    } catch (err) {
      console.error("Error updating loan:", err);
      toast.error("Failed to update loan status");
    } finally {
      setLoading(false);
    }
  };


  const approveLoan = () => updateLoanStatus("APPROVED");
  const rejectLoan = () => updateLoanStatus("REJECTED");

  // Blockchain verification
  const verifyCertificateOnBlockchain = async () => {
    if (!verifyData.wallet || !verifyData.hash) {
      toast.error("Wallet or hash missing");
      return;
    }

    setVerifying(true);
    setProgress(10);
    setVerifyResult(null);
    setCurrentCall({ wallet: verifyData.wallet, hash: verifyData.hash });

    const verificationDisplayDuration = 1500;
    let t;

    try {
      t = setInterval(() => setProgress((p) => Math.min(90, p + 10)), 300);
      const ok = await verifyCertificate(verifyData.wallet, verifyData.hash);
      clearInterval(t);
      setProgress(100);
      setVerifyResult(ok);
      toast[ok ? "success" : "error"](ok ? "Certificate valid" : "Invalid certificate");
    } catch (e) {
      if (t) clearInterval(t);
      setProgress(100);
      setVerifyResult(false);
      console.error(e);
      toast.error("Verification failed");
    } finally {
      setTimeout(() => {
        setVerifying(false);
        setProgress(10);
        setVerifyResult(null);
      }, verificationDisplayDuration);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-blue-900 text-white min-h-screen p-6 hidden md:block">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-white text-blue-900 rounded flex items-center justify-center font-bold">FC</div>
            <div>
              <div className="font-semibold">FinCorp Admin</div>
              <div className="text-xs text-blue-200">Secure Portal</div>
            </div>
          </div>

          <nav className="space-y-3 text-sm">
            <div className="flex items-center gap-2 px-2 py-2 rounded hover:bg-blue-800 cursor-pointer"><Home size={16} /> Dashboard</div>
            <div className="flex items-center gap-2 px-2 py-2 rounded bg-blue-800"><FileText size={16} /> Loan Applications</div>
            <div className="flex items-center gap-2 px-2 py-2 rounded hover:bg-blue-800 cursor-pointer"><Users size={16} /> Users</div>
            <div className="flex items-center gap-2 px-2 py-2 rounded hover:bg-blue-800 cursor-pointer"><PieChart size={16} /> Reports</div>
            <div className="flex items-center gap-2 px-2 py-2 rounded hover:bg-blue-800 cursor-pointer"><Settings size={16} /> Settings</div>
          </nav>

          <div className="mt-8 text-xs text-blue-200">
            <div>Connected: {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Not connected"}</div>
            <button onClick={onConnect} className="mt-2 bg-white text-blue-900 px-3 py-2 rounded text-sm">Connect Wallet</button>
          </div>
        </aside>

        <main className="flex-1 p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-slate-800">Loan Applications</h1>
            <div className="flex items-center gap-3">
              <input placeholder="Search by name or email" className="border p-2 rounded" />
              <select className="border p-2 rounded">
                <option>All</option>
                <option>Pending</option>
                <option>Approved</option>
                <option>Rejected</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded shadow overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left px-4 py-3">Name</th>
                  <th className="text-left px-4 py-3">Email</th>
                  <th className="text-left px-4 py-3">Amount</th>
                  <th className="text-left px-4 py-3">Tenure</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-left px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {loans.map((loan) => (
                  <tr key={loan.id} className="border-t hover:bg-slate-50 cursor-pointer" onClick={() => openLoan(loan)}>
                    <td className="px-4 py-3">{loan.firstName} {loan.lastName}</td>
                    <td className="px-4 py-3">{loan.email}</td>
                    <td className="px-4 py-3">₹{loan.loanAmount}</td>
                    <td className="px-4 py-3">{loan.loanTenure} mo</td>
                    <td className="px-4 py-3 font-semibold">{loan.status}</td>
                    <td className="px-4 py-3 text-blue-700 underline">View</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Modal */}
          {selectedLoan && (
            <div className="fixed inset-0 bg-black/40 flex items-start justify-center pt-20 z-50">
              <div className="bg-white w-11/12 md:w-3/4 rounded-lg shadow-lg p-6 overflow-y-auto max-h-[85vh]">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-semibold">{selectedLoan.firstName} {selectedLoan.lastName}</h3>
                  <div className="text-sm text-gray-500">ID: {selectedLoan.id}</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <h4 className="font-semibold">Contact</h4>
                    <div className="text-sm">{selectedLoan.email}</div>
                    <div className="text-sm">{selectedLoan.phone}</div>
                    <div className="text-sm">{selectedLoan.address}, {selectedLoan.city}</div>
                  </div>

                  <div>
                    <h4 className="font-semibold">Employment</h4>
                    <div className="text-sm">{selectedLoan.employmentType} — {selectedLoan.employerName}</div>
                    <div className="text-sm">Monthly Income: ₹{selectedLoan.monthlyIncome}</div>
                  </div>

                  <div>
                    <h4 className="font-semibold">Loan Details</h4>
                    <div className="text-sm">Amount: ₹{selectedLoan.loanAmount}</div>
                    <div className="text-sm">Tenure: {selectedLoan.loanTenure} months</div>
                  </div>

                  <div>
                    <h4 className="font-semibold">IDs</h4>
                    <div className="text-sm">PAN: {selectedLoan.panNumber}</div>
                    <div className="text-sm">Aadhar: {selectedLoan.aadharNumber}</div>
                  </div>
                </div>

                {/* PDF preview + hash */}
                {pdfFile ? (
                  <div className="mt-4">
                    <h4 className="font-semibold">Income Certificate</h4>
                    <Document file={pdfFile}><Page pageNumber={1} width={600} /></Document>
                    <div className="text-xs text-gray-500 mt-2">SHA256: {pdfHash}</div>
                  </div>
                ) : (
                  <div className="mt-4 text-sm text-gray-500">No certificate available in this mock.</div>
                )}

                <div className="mt-4 flex items-center gap-3">
                  <input type="text" placeholder="Enter hash to verify" className="border p-2 rounded" value={verifyData.hash} onChange={(e) => setVerifyData((p) => ({ ...p, hash: e.target.value }))} />
                  <button onClick={verifyCertificateOnBlockchain} className="px-4 py-2 bg-blue-800 text-white rounded">Verify</button>
                  {verifying && (
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-40 bg-slate-200 rounded overflow-hidden"><div style={{ width: `${progress}%` }} className="h-full bg-blue-600"></div></div>
                      {verifyResult === true && <CheckCircle2 className="text-green-600" />}
                      {verifyResult === false && <XCircle className="text-red-600" />}
                    </div>
                  )}
                </div>

                <div className="mt-6 flex gap-3">
                  <button onClick={approveLoan} className="px-4 py-2 bg-green-600 text-white rounded" disabled={loading}>Approve</button>
                  <button onClick={rejectLoan} className="px-4 py-2 bg-red-600 text-white rounded" disabled={loading}>Reject</button>
                  <button onClick={() => setSelectedLoan(null)} className="px-4 py-2 bg-gray-200 rounded">Close</button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
