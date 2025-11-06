import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NewPage from "@/pages/Gov";
import { Toaster } from "@/components/ui/sonner";
import "@/App.css";
import FinCorpApp from "./pages/BankTopPage";

function App() {
  const [ready, setReady] = useState(false);
  useEffect(()=>{ setReady(true); },[]);
  if(!ready) return null;
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<NewPage />} />
          <Route path="/bank" element={<FinCorpApp />} />
        </Routes>
      </BrowserRouter>
      <Toaster richColors />
    </div>
  );
}

export default App;
