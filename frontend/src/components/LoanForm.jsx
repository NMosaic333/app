import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { generateFileHash, storeCertificate } from "@/utils/blockchain";
import { api } from "@/utils/api";

export const LoanForm = ({ walletAddress, onCreated }) => {
  const [amount, setAmount] = useState(5000);
  const [term, setTerm] = useState(12);
  const [fileName, setFileName] = useState("");
  const [hash, setHash] = useState("");
  const [loading, setLoading] = useState(false);

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const h = await generateFileHash(file);
    setHash(h);
    toast.success("File hash generated", { description: h.slice(0, 16) + "..." });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!walletAddress) return toast.error("Connect wallet first");
    if (!hash) return toast.error("Upload income certificate to hash");
    try {
      setLoading(true);
      await storeCertificate(hash);
      toast.success("Certificate stored on-chain");
      const res = await api.post("/loans", {
        wallet_address: walletAddress,
        amount: Number(amount),
        term_months: Number(term),
        certificate_hash: hash,
      });
      onCreated?.(res.data);
      setFileName("");
      setHash("");
    } catch (e) {
      toast.error("Failed to submit application");
      // console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-slate-900" data-testid="loan-form-title">Create Loan Application</CardTitle>
      </CardHeader>
      <form onSubmit={onSubmit}>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="amount">Loan Amount</Label>
            <Input data-testid="loan-form-amount-input" id="amount" type="number" value={amount} onChange={(e)=>setAmount(e.target.value)} min={1} step={100} required />
          </div>
          <div>
            <Label htmlFor="term">Term (months)</Label>
            <Input data-testid="loan-form-term-input" id="term" type="number" value={term} onChange={(e)=>setTerm(e.target.value)} min={1} max={72} required />
          </div>
          <div>
            <Label htmlFor="file">Income Certificate</Label>
            <Input data-testid="loan-form-file-input" id="file" type="file" accept="*/*" onChange={onFile} />
            {fileName && (
              <p className="text-xs text-slate-500 mt-1" data-testid="loan-form-file-name">{fileName}</p>
            )}
            {hash && (
              <p className="text-xs text-emerald-600 mt-1" data-testid="loan-form-hash">Hash: {hash}</p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button data-testid="loan-form-submit-button" disabled={loading} type="submit" className="rounded-full">{loading? 'Submitting...' : 'Submit Application'}</Button>
        </CardFooter>
      </form>
    </Card>
  );
};
