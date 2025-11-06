// src/components/CertificatePreview.jsx
import React from "react";

export default function CertificatePreview({ data }) {
  // fallback data
  const d = {
    name: "नाम",
    fatherName: "पिता/पति",
    address: "पत्ता",
    district: "जिल्हा",
    income: "₹ 0",
    year: "2023-2024",
    certId: "CERT-0001",
    ...data,
  };

  return (
    <div
      className="bg-white p-8 text-slate-900"
      style={{
        border: "10px solid #e6e6e6",
      }}
    >
      {/* Outer border area */}
      <div style={{ border: "4px solid #dcdcdc", padding: 20 }}>
        {/* Header row: emblem, title, barcode */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <img
              src="/Seal_of_Maharashtra.svg"
              alt="emblem"
              className="h-14 w-14 object-contain"
            />
            <div>
              <div className="text-sm">Government of Maharashtra</div>
              <div className="text-xl font-bold">तहसीलदार कार्यालय</div>
            </div>
          </div>

          <div className="text-right">
            <div style={{ fontSize: 12, color: "#444" }}>Certificate No.</div>
            <div style={{ fontSize: 12, letterSpacing: 2 }}>{d.certId}</div>
            <div className="mt-2" style={{ background: "#f3f3f3", padding: 6 }}>
              {/* barcode placeholder */}
              <div style={{ height: 35, width: 100, background: "#fff", display: "inline-block" }}>
                <img
                    src="/barcode.png"
                    alt="barcode"
                    style={{
                    width: "100%",         // fill container width
                    height: "100%",        // fill container height
                    objectFit: "contain",  // keep aspect ratio
                    borderRadius: "4px",   // optional rounded corners
                    boxShadow: "0 1px 3px rgba(0,0,0,0.2)" // subtle depth
                    }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold">उत्पन्न प्रमाणपत्र / INCOME CERTIFICATE</h2>
          <div className="text-sm text-slate-600 mt-1">For the financial year {d.year}</div>
        </div>

        {/* Body content */}
        <div className="mb-6">
          <p className="text-sm leading-relaxed">
            प्रमाणित करण्यात येते की {d.name}, {d.fatherName} यांचे पुढील तपशील या कार्यालयात नोंदणीकृत आहेत.
          </p>

          {/* Table-like info */}
          <div className="mt-4 border rounded">
            <div className="flex border-b">
              <div className="w-1/3 p-3 font-medium bg-[#fafafa]">नाव / Name</div>
              <div className="flex-1 p-3">{d.name}</div>
            </div>

            <div className="flex border-b">
              <div className="w-1/3 p-3 font-medium bg-[#fafafa]">पिता / Spouse</div>
              <div className="flex-1 p-3">{d.fatherName}</div>
            </div>

            <div className="flex border-b">
              <div className="w-1/3 p-3 font-medium bg-[#fafafa]">पत्ता / Address</div>
              <div className="flex-1 p-3">{d.address}</div>
            </div>

            <div className="flex border-b">
              <div className="w-1/3 p-3 font-medium bg-[#fafafa]">जिल्हा / District</div>
              <div className="flex-1 p-3">{d.district}</div>
            </div>

            <div className="flex">
              <div className="w-1/3 p-3 font-medium bg-[#fafafa]">वार्षिक उत्पन्न / Income</div>
              <div className="flex-1 p-3">{d.income}</div>
            </div>
          </div>
        </div>

        {/* Footer signature */}
        <div className="flex items-end justify-between mt-8">
          <div>
            <div className="text-xs text-slate-500">Issued by</div>
            <div className="mt-2">
              <div className="font-semibold">Office of the Tehsildar</div>
              <div className="text-xs text-slate-500">Authorized Signatory</div>
            </div>
          </div>

          <div className="text-right">
            <div className="mb-2 text-xs text-slate-500">{new Date().toLocaleDateString()}</div>
            <div style={{ borderTop: "1px solid #333", paddingTop: 6 }}>
              <div className="text-sm">Sign & Seal</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
