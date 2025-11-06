import AnotherAdmin from "./BankAdmin";
import LoanPage from "./LoanApplicationForm";
import { useState } from "react";

// ---------- Top-level App combining both pages and simple navigation ----------
export default function FinCorpApp() {
  const [page, setPage] = useState("public"); // "public" | "admin"

  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-2 flex justify-end gap-3">
          <button onClick={() => setPage("public")} className={`px-3 py-1 rounded ${page === "public" ? "bg-blue-800 text-white" : "border"}`}>Public Site</button>
          <button onClick={() => setPage("admin")} className={`px-3 py-1 rounded ${page === "admin" ? "bg-blue-800 text-white" : "border"}`}>Admin Portal</button>
        </div>
      </div>

      {page === "public" ? <LoanPage onNavigateToAdmin={() => setPage("admin")} /> : <AnotherAdmin />}
    </div>
  );
}