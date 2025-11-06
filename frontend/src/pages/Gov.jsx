// src/pages/Admin.jsx
import React, { useState, useRef } from "react";
import CertificatePreview from "../components/CertificatePreview";
import * as blockchain from "@/utils/blockchain.js"; // import all functions
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function Admin() {
  const [form, setForm] = useState({
    name: "श्री. उदाहरण नाव",
    fatherName: "श्री. उदहारण पित्या",
    address: "गाव, पोस्ट, तालुका, जिल्हा",
    district: "Mumbai Suburban",
    income: "1,20,000",
    year: "2023-2024",
    certId: "CERT-0001",
  });

  const [account, setAccount] = useState(null); // wallet state
  const previewRef = useRef(null);
  const [certHash, setCertHash] = useState("");

  function onChange(e) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  async function generatePdf() {
    if (!previewRef.current) return;

    try {
      const canvas = await html2canvas(previewRef.current, {
        scale: 3,
        useCORS: true,
      });

      const imgData = canvas.toDataURL("image/png");
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      const pdf = new jsPDF({
        orientation: imgWidth > imgHeight ? "landscape" : "portrait",
        unit: "px",
        format: [imgWidth, imgHeight],
      });

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

      // Generate Blob from PDF
      const pdfBlob = pdf.output("blob");

      // Optionally, save it
      pdf.save(`${form.certId || "certificate"}.pdf`);

      return pdfBlob; // return blob for hashing
    } catch (err) {
      console.error("PDF generation failed", err);
      alert("Failed to generate PDF. See console.");
    }
  }

  async function handleConnectWallet() {
    try {
      const { address } = await blockchain.connectWallet();
      setAccount(address);
    } catch (err) {
      console.error("Wallet connection failed", err);
      alert(err.message || "Failed to connect wallet");
    }
  }

  async function handleStoreOnChain() {
    try {
      if (!account) {
        await handleConnectWallet(); // prompt wallet connection if not connected
      }
      const pdfBlob = await generatePdf();
      if (!pdfBlob) throw new Error("Generate PDF first");
      const blob = pdfBlob;
      const hash = await blockchain.generateFileHash(blob);
      setCertHash(hash);
      await blockchain.storeCertificate(hash);

      alert(`Certificate stored on-chain for ${account}`);
      console.log("Certificate hash stored:", hash);
    } catch (err) {
      console.error("Error storing certificate on chain:", err);
      alert(err.message || "Failed to store certificate on-chain");
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r p-6">
          <h2 className="text-lg font-semibold text-slate-800">Admin</h2>
          <p className="text-sm text-slate-500 mt-1">Certificate Issuance</p>
          <nav className="mt-6 space-y-2">
            <button className="w-full text-left px-3 py-2 rounded bg-slate-50 hover:bg-slate-100">
              Dashboard
            </button>
            <button className="w-full text-left px-3 py-2 rounded bg-slate-50 hover:bg-slate-100">
              Certificates
            </button>
            <button className="w-full text-left px-3 py-2 rounded bg-slate-50 hover:bg-slate-100">
              Users
            </button>
            <button className="w-full text-left px-3 py-2 rounded bg-slate-50 hover:bg-slate-100">
              Settings
            </button>
          </nav>
        </aside>

        {/* Main */}
        <main className="flex-1 p-8">
          <header className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold">Issue Income Certificate</h1>
              <p className="text-sm text-slate-500">Create, preview, download and store on-chain</p>
            </div>

            <div className="flex items-center gap-3">
              {account ? (
                <div className="text-sm px-3 py-2 bg-green-50 text-green-800 rounded">
                  Connected: {account.slice(0, 6)}...{account.slice(-4)}
                </div>
              ) : (
                <button
                  onClick={handleConnectWallet}
                  className="px-4 py-2 border rounded bg-indigo-600 text-white"
                >
                  Connect Wallet
                </button>
              )}
            </div>
          </header>

          <section className="mt-6 grid grid-cols-12 gap-6">
            {/* Form */}
            <div className="col-span-5 bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-medium text-lg mb-4">Certificate Details</h3>

              <div className="space-y-3">
                <label className="block">
                  <span className="text-sm text-slate-700">Name</span>
                  <input
                    name="name"
                    value={form.name}
                    onChange={onChange}
                    className="mt-1 block w-full border rounded px-3 py-2"
                  />
                </label>

                <label className="block">
                  <span className="text-sm text-slate-700">Father / Spouse</span>
                  <input
                    name="fatherName"
                    value={form.fatherName}
                    onChange={onChange}
                    className="mt-1 block w-full border rounded px-3 py-2"
                  />
                </label>

                <label className="block">
                  <span className="text-sm text-slate-700">Address</span>
                  <input
                    name="address"
                    value={form.address}
                    onChange={onChange}
                    className="mt-1 block w-full border rounded px-3 py-2"
                  />
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <label>
                    <span className="text-sm text-slate-700">District</span>
                    <input
                      name="district"
                      value={form.district}
                      onChange={onChange}
                      className="mt-1 block w-full border rounded px-3 py-2"
                    />
                  </label>

                  <label>
                    <span className="text-sm text-slate-700">Year</span>
                    <input
                      name="year"
                      value={form.year}
                      onChange={onChange}
                      className="mt-1 block w-full border rounded px-3 py-2"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <label>
                    <span className="text-sm text-slate-700">Income (₹)</span>
                    <input
                      name="income"
                      value={form.income}
                      onChange={onChange}
                      className="mt-1 block w-full border rounded px-3 py-2"
                    />
                  </label>

                  <label>
                    <span className="text-sm text-slate-700">Certificate ID</span>
                    <input
                      name="certId"
                      value={form.certId}
                      onChange={onChange}
                      className="mt-1 block w-full border rounded px-3 py-2"
                    />
                  </label>
                </div>

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={generatePdf}
                    className="px-4 py-2 bg-slate-800 text-white rounded"
                  >
                    Generate PDF
                  </button>

                  <button
                    onClick={handleStoreOnChain}
                    className="px-4 py-2 border rounded bg-yellow-600 text-white"
                  >
                    Store on Blockchain
                  </button>

                  <button
                    onClick={() => setForm({
                      name: "",
                      fatherName: "",
                      address: "",
                      district: "",
                      income: "",
                      year: "",
                      certId: "",
                    })}
                    className="px-4 py-2 border rounded"
                  >
                    Clear
                  </button>
                </div>

                <p className="text-xs text-slate-500 mt-2">
                  Tip: After generating PDF you can optionally hash the file and store the hash on-chain for verification.
                </p>
              </div>
            </div>

            {/* Preview */}
            <div className="col-span-7">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-medium text-lg mb-4">Certificate Preview</h3>

                <div
                  className="p-6 border rounded bg-[#f8f8f8] flex justify-center"
                  ref={previewRef}
                >
                  <div className="w-[900px]">
                    <CertificatePreview data={form} />
                  </div>
                </div>
              </div>
            </div>

            {certHash && (
              <section className="col-span-12 bg-green-50 p-4 rounded">
                <h3 className="font-medium text-lg mb-2">Certificate Stored On-Chain</h3>
                <p className="text-sm text-green-700">{certHash}</p>
              </section>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
