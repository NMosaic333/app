import React, { useState } from "react";
import { api } from "@/utils/api";

export default function LoanPage({onNavigateToAdmin}) {
  const [formData, setFormData] = useState({
    firstName: "Ramesh",
    lastName: "Sharma",
    dob: "1983-03-29",
    gender: "Male",
    email: "ramesh.sharma@gmail.com",
    phone: "+91 98765 43210",
    address: "123, MG Road, Mumbai",
    city: "Mumbai",
    state: "Maharashtra",
    pin: "400001",
    employmentType: "Salaried",
    employerName: "HDFC Pvt Ltd",
    monthlyIncome: "60000",
    loanAmount: "200000",
    loanTenure: "36",
    existingLoans: "None",
    panNumber: "ABCDE1234F",
    aadharNumber: "1234 5678 9012",
    incomeCertificate: null, // file input will be empty by default
    consent: false,
    });

    const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({ ...formData, [name]: files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    const requiredFields = [
        "firstName", "lastName", "dob", "gender", "email", "phone",
        "address", "city", "state", "pin", "employmentType",
        "loanAmount", "loanTenure", "panNumber", "aadharNumber",
        "incomeCertificate", "consent"
    ];

    for (const field of requiredFields) {
        if (
        formData[field] === null ||
        formData[field] === undefined ||
        formData[field] === "" ||
        (field === "consent" && !formData[field])
        ) {
        console.warn(`Please fill all required fields. Missing: ${field}`);
        return; // Stop submission if a required field is empty
        }
    }

    try {
        const formPayload = new FormData();

        // Append all form fields
        for (const key in formData) {
        if (formData[key] !== null && formData[key] !== undefined) {
            formPayload.append(key, formData[key]);
        }
        }

        const res = await api.post("/loans", formPayload, {
        headers: { "Content-Type": "multipart/form-data" },
        });

        console.log("Loan application submitted:", res.data);
        setSubmitted(true);
    } catch (error) {
        console.error("Error submitting form:", error);
    }
    };
  const [step, setStep] = useState(1);
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-800 text-white rounded flex items-center justify-center font-bold">FC</div>
            <div>
              <div className="text-lg font-semibold text-blue-900">FinCorp Bank</div>
              <div className="text-sm text-gray-500">Trusted financial services</div>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm text-blue-700">
            <a className="hover:underline">Home</a>
            <a className="hover:underline">Loans</a>
            <a className="hover:underline">Accounts</a>
            <a className="hover:underline">Investments</a>
            <a className="hover:underline">Support</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative h-[360px] md:h-[420px] bg-cover bg-center" style={{ backgroundImage: "url('/hero-bank.jpg')" }}>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 to-transparent"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 text-white flex flex-col md:flex-row items-start gap-8">
          <div className="md:w-1/2">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Loans that work for you</h1>
            <p className="mb-6 text-lg">Competitive rates, transparent terms, and fast approvals. Apply online and track your application in real time.</p>
            <div className="flex gap-4">
              <a href="#loanForm" className="bg-gold-500 inline-block px-6 py-3 rounded-lg font-semibold text-blue-900">Apply Now</a>
              <a className="border border-white px-6 py-3 rounded-lg">How it works</a>
            </div>
          </div>

          <div className="md:w-1/2 grid grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-md">
              <div className="text-sm text-gray-400">Disbursed</div>
              <div className="text-2xl font-bold text-blue-800">₹5,000 Cr+</div>
              <div className="text-xs text-gray-500">Since 2010</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-md">
              <div className="text-sm text-gray-400">Customers</div>
              <div className="text-2xl font-bold text-blue-800">1M+</div>
              <div className="text-xs text-gray-500">Active accounts</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-md">
              <div className="text-sm text-gray-400">Avg. approval</div>
              <div className="text-2xl font-bold text-blue-800">1-2 days</div>
              <div className="text-xs text-gray-500">Faster with digital docs</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-md">
              <div className="text-sm text-gray-400">Support</div>
              <div className="text-2xl font-bold text-blue-800">24/7</div>
              <div className="text-xs text-gray-500">Chat & phone</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main */}
      <main className="max-w-7xl mx-auto mt-12 px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Side info */}
          <aside className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Why FinCorp?</h3>
            <ul className="space-y-3 text-gray-700">
              <li>Transparent interest rates and clear terms</li>
              <li>Instant eligibility check</li>
              <li>Minimal paperwork — upload from phone</li>
              <li>Secure digital verification and blockchain-backed certificates</li>
            </ul>
            <div className="mt-6">
              <h4 className="font-semibold">Need help?</h4>
              <p className="text-sm text-gray-500">Call: +91 12345 67890</p>
              <p className="text-sm text-gray-500">Email: support@fincorp.com</p>
            </div>
          </aside>

          {/* Form */}
          <section id="loanForm" className="lg:col-span-2 bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Loan Application</h2>
              <div className="text-sm text-gray-500">Step {step} of 3</div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {step === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input placeholder="First Name" name="firstName" value={formData.firstName} onChange={handleChange} required className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-blue-500"/>
                  <input placeholder="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} required className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-blue-500"/>
                  <input type="date" name="dob" value={formData.dob} onChange={handleChange} required className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-blue-500"/>
                  <select name="gender" value={formData.gender} onChange={handleChange} required className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-blue-500">
                    <option value="">Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  <input type="tel" placeholder="Phone Number" name="phone" value={formData.phone} onChange={handleChange} required className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-blue-500"/>
                  <input type="email" placeholder="Email" name="email" value={formData.email} onChange={handleChange} required className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-blue-500"/>
                  <textarea placeholder="Address" name="address" value={formData.address} onChange={handleChange} rows={2} required className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-blue-500"/>
                </div>
              )}

              {step === 2 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input placeholder="City" name="city" value={formData.city} onChange={handleChange} required className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-blue-500"/>
                  <input placeholder="State" name="state" value={formData.state} onChange={handleChange} required className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-blue-500"/>
                  <input placeholder="PIN Code" name="pin" value={formData.pin} onChange={handleChange} required className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-blue-500"/>
                  <select name="employmentType" value={formData.employmentType} onChange={handleChange} required className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-blue-500">
                    <option value="">Employment Type</option>
                    <option value="Salaried">Salaried</option>
                    <option value="Self-Employed">Self-Employed</option>
                    <option value="Student">Student</option>
                    <option value="Other">Other</option>
                  </select>
                  <input placeholder="Employer / Company" name="employerName" value={formData.employerName} onChange={handleChange} className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-blue-500"/>
                  <input type="number" placeholder="Monthly Income (₹)" name="monthlyIncome" value={formData.monthlyIncome} onChange={handleChange} className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-blue-500"/>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="number" placeholder="Loan Amount (₹)" name="loanAmount" value={formData.loanAmount} onChange={handleChange} required className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-blue-500"/>
                    <input type="number" placeholder="Loan Tenure (Months)" name="loanTenure" value={formData.loanTenure} onChange={handleChange} required className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-blue-500"/>
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2 font-semibold">Upload Income Certificate</label>
                    <input type="file" name="incomeCertificate" accept=".pdf, .jpg, .jpeg, .png" onChange={handleFileChange} className="w-full" required />
                    <p className="text-sm text-gray-500 mt-1">Accepted formats: PDF, JPG, PNG</p>
                  </div>

                  <div className="flex items-center">
                    <input type="checkbox" name="consent" checked={formData.consent} onChange={handleChange} className="mr-2" required />
                    <span className="text-sm">I consent to processing my personal information and credit checks.</span>
                  </div>
                </div>
              )}

              <div className="flex justify-between gap-4">
                <div>
                  {step > 1 && (
                    <button type="button" onClick={() => setStep((s) => s - 1)} className="px-4 py-2 border rounded">Back</button>
                  )}
                </div>

                <div className="flex gap-3">
                  {step < 3 ? (
                    <button type="button" onClick={() => setStep((s) => s + 1)} className="px-6 py-2 bg-blue-800 text-white rounded">Next</button>
                  ) : (
                    <button type="submit" disabled={submitted} className="px-6 py-2 bg-blue-800 text-white rounded">{submitted ? "Submitted" : "Submit Application"}</button>
                  )}
                </div>
              </div>
            </form>
          </section>
        </div>

        {/* Extra info grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white p-4 rounded shadow">
            <h4 className="font-semibold">Documents Needed</h4>
            <ul className="text-sm text-gray-600 mt-2">
              <li>- PAN Card</li>
              <li>- Aadhar / Address proof</li>
              <li>- Latest 3 months salary slip or bank statement</li>
            </ul>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h4 className="font-semibold">Security</h4>
            <p className="text-sm text-gray-600 mt-2">Your documents are encrypted in transit and stored securely.</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h4 className="font-semibold">RBI Compliance</h4>
            <p className="text-sm text-gray-600 mt-2">All lending practices follow RBI guidelines.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white mt-12">
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-semibold mb-3">FinCorp Bank</h3>
            <p>Your trusted partner for personal and business loans.</p>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-1">
              <li>Home</li>
              <li>Loans</li>
              <li>About Us</li>
              <li>Contact</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Contact Us</h3>
            <p>Email: support@fincorp.com</p>
            <p>Phone: +91 12345 67890</p>
          </div>
        </div>
        <div className="bg-gray-800 text-center py-4 text-sm">© 2025 FinCorp Bank. All rights reserved.</div>
      </footer>
    </div>
  );
}