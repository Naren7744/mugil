import React, { useState, useEffect } from "react";
import { FiArrowLeft, FiDollarSign, FiSmartphone, FiCreditCard, FiFileText, FiCheckCircle, FiSearch, FiArrowRight, FiShield, FiLock } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "../../components/dashboard/PageHeader";
import api from "../../services/api";
import {
successAlert,
errorAlert,
warningAlert,
loadingAlert,
confirmDelete,
} from "../../utils/alerts";

function CollectPaymentPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  // State Management (Unchanged Logic)
  const [selectedMember, setSelectedMember] = useState(null);
  const [allMembers, setAllMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [paymentForm, setPaymentForm] = useState({
    amount: "",
    paymentMethod: "Cash",
    note: "",
  });

  useEffect(() => {
    if (id) {
      fetchSpecificMember(id);
    } else {
      fetchAllMembersForSearch();
    }
  }, [id]);

  const fetchSpecificMember = async (memberId) => {
    try {
      setLoading(true);
     const res = await api.get(`/members/${memberId}`);
      setSelectedMember(res.data.data);
    } catch (error) {
      console.error(error);
errorAlert(
  "Member Not Found",
  "Unable to find the selected member."
);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllMembersForSearch = async () => {
    try {
      setLoading(true);
       const res = await api.get("/members");
      setAllMembers(res.data.data || []);
    } catch (error) {
      console.error("Error fetching members:", error);
    } finally {
      setLoading(false);
    }
  };

  const savePayment = async () => {
    if (!selectedMember) return;
if (!paymentForm.amount || Number(paymentForm.amount) <= 0) {
warningAlert(
  "Invalid Amount",
  "Please enter a valid payment amount."
);
  return;
}

if (Number(paymentForm.amount) > currentBalance) {
warningAlert(
  "Amount Exceeded",
  "Payment cannot exceed the pending balance."
);
  return;
}

    setIsSubmitting(true);
    try {
      await api.put(
  `/members/collect-payment/${selectedMember._id || id}`,
        {
          amount: Number(paymentForm.amount),
          paymentMethod: paymentForm.paymentMethod,
          note: paymentForm.note,
          collectedBy: "Admin",
        }
      );

successAlert(
  "Payment Successful",
  "Payment collected successfully."
);



const res = await api.get(`/members/${selectedMember._id}`);
setSelectedMember(res.data.data);





setPaymentForm({
  amount: "",
  paymentMethod: "Cash",
  note: "",
});
    } catch (error) {
      console.error(error);
errorAlert(
  "Payment Failed",
  "Failed to collect payment."
);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredMembers = allMembers.filter(m => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      (m.fullName && m.fullName.toLowerCase().includes(q)) ||
      (m.memberId && m.memberId.toLowerCase().includes(q)) ||
      (m.mobile && m.mobile.includes(q))
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f4f6f8]">
        <div className="w-10 h-10 border-4 border-[#0a2540] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Real-time Balance Projection
  const currentBalance = Number(selectedMember?.balanceAmount || 0);
  const enteredAmount = Number(paymentForm.amount || 0);
  const projectedBalance = Math.max(0, currentBalance - enteredAmount);
  const updateAmount = (value) => {
  const nextAmount = Math.min(
    currentBalance,
    Number(paymentForm.amount || 0) + value
  );

  setPaymentForm({
    ...paymentForm,
    amount: nextAmount,
  });
};

const paymentMethods = [
  {
    key: "Cash",
    label: "Cash",
    icon: FiDollarSign,
  },
  {
    key: "UPI",
    label: "UPI",
    icon: FiSmartphone,
  },
  {
    key: "Card",
    label: "Card",
    icon: FiCreditCard,
  },

];

  return (
    <div className="w-full min-h-screen bg-[#f4f6f8] flex flex-col font-sans select-none overflow-x-hidden">
      
{/* ================= STANDARD PAGE HEADER ================= */}
      <div className="max-w-[1200px] mx-auto w-full px-0 sm:px-4 lg:px-6 mt-6">
        <PageHeader
          title="Collect Payment"
          description="Process secure transactions and manage member ledgers globally."
          rightContent={
            <div className="flex flex-wrap items-center gap-3 mt-4 sm:mt-0">
              <div className="hidden sm:flex items-center gap-2 text-[#0a2540] bg-slate-100 border border-slate-200 px-4 py-2.5 rounded-lg">
                <FiLock size={14} className="stroke-[3]" />
                <span className="text-[10px] font-black uppercase tracking-widest">Secure Gateway</span>
              </div>

              {/* Back Button matching your global style */}
              <button
                type="button"
                onClick={() => navigate("/admin/fees")}
                className="
                  cursor-pointer
                  min-w-[120px]
                  px-6
                  py-2.5
                  rounded-lg
                  text-xs
                  font-black
                  uppercase
                  tracking-wider
                  border
                  border-slate-200
                  bg-white
                  text-slate-600
                  shadow-sm
                  hover:bg-slate-50
                  active:scale-95
                  transition-all
                  duration-200
                  flex
                  items-center
                  justify-center
                  gap-2
                "
              >
                <FiArrowLeft size={14} />
                Back
              </button>
            </div>
          }
        />
      </div>

      <div className="flex-1 w-full flex items-center justify-center p-0 sm:p-2 lg:p-4">

        {/* ================= SEARCH INTERFACE ================= */}
        {!selectedMember ? (
          <div className="w-full max-w-3xl bg-white rounded-2xl shadow-[0_20px_50px_-10px_rgba(0,0,0,0.08)] border border-slate-100 overflow-hidden animate-slide-up">
            <div className="p-8 text-center bg-[#0a2540] text-white">
              <h2 className="text-2xl font-black tracking-tight mb-2">Search Customer</h2>
              <p className="text-sm font-semibold text-slate-400">Select a member to proceed to checkout.</p>
            </div>

            <div className="p-6">
              <div className="relative mb-6">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  placeholder="Enter Name, ID, or Phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-4 text-lg font-bold text-slate-800 focus:outline-none focus:border-[#635bff] focus:ring-2 focus:ring-[#635bff]/20 transition-all"
                  autoFocus
                />
              </div>

         <div className="max-h-[350px] overflow-y-auto custom-sidebar-scroll space-y-2">
  {filteredMembers.length > 0 ? (
    filteredMembers.map((m) => {
      const isPaid = Number(m.balanceAmount) === 0;

      return (
        <div
          key={m._id || m.memberId}
          onClick={() => {
            if (!isPaid) {
              setSelectedMember(m);
            }
          }}
          className={`group flex items-center justify-between p-4 border rounded-2xl transition-all ${
            isPaid
              ? "bg-slate-100 border-slate-200 opacity-60 cursor-not-allowed"
              : "bg-white border-slate-100 hover:border-[#635bff] hover:shadow-md cursor-pointer"
          }`}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#f4f6f8] text-[#0a2540] flex items-center justify-center font-black text-lg group-hover:bg-[#635bff] group-hover:text-white transition-colors">
              {m.fullName?.charAt(0) || "M"}
            </div>

            <div>
              <h3 className="text-base font-black text-slate-900">
                {m.fullName}
              </h3>

              <div className="text-xs font-semibold text-slate-500 font-mono mt-0.5">
                {m.memberId} • {m.mobile}
              </div>
            </div>
          </div>

          <div className="text-right">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">
              Due
            </p>

            <p
              className={`text-sm font-black font-mono ${
                Number(m.balanceAmount) > 0
                  ? "text-rose-500"
                  : "text-emerald-500"
              }`}
            >
              ₹{m.balanceAmount || 0}
            </p>

            <p
              className={`text-[10px] font-bold mt-1 ${
                isPaid
                  ? "text-emerald-600"
                  : "text-amber-600"
              }`}
            >
              {m.paymentStatus}
            </p>
          </div>
        </div>
      );
    })
  ) : (
    <div className="text-center py-10">
      <p className="text-slate-400 font-bold">
        No customers found.
      </p>
    </div>
  )}
</div>
            </div>
          </div>
        ) : (

        /* ================= PREMIUM CHECKOUT PAGE ================= */
          <div className="w-full max-w-[1400px] bg-white rounded-[15px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] flex flex-col md:flex-row overflow-hidden animate-slide-up border border-slate-100">
            
            {/* LEFT SIDE: INVOICE / CART SUMMARY (Stripe Dark Blue Style) */}
            <div className="w-full md:w-[40%] bg-[#0a2540] p-6 sm:p-8 text-white flex flex-col justify-between relative overflow-hidden">
              {/* Background Accent */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#635bff]/20 rounded-full blur-[80px] pointer-events-none translate-x-1/2 -translate-y-1/2"></div>
              
              <div className="relative z-10">
                {!id && (
                  <button 
                    onClick={() => setSelectedMember(null)}
                    className="mb-8 text-[#00d4ff] hover:text-white text-[11px] font-black uppercase tracking-widest flex items-center gap-2 transition-colors"
                  >
                    <FiArrowLeft size={14} /> Edit Customer
                  </button>
                )}

                <div className="mb-10">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Billed To</p>
                  <h2 className="text-3xl font-black tracking-tight text-white mb-2">{selectedMember.fullName}</h2>
                  <p className="text-sm font-mono text-slate-300 bg-white/10 inline-block px-3 py-1 rounded-lg border border-white/10">
                    {selectedMember.memberId}
                  </p>
                  <p className="text-sm font-semibold text-slate-400 mt-3">{selectedMember.mobile}</p>
                </div>

                <div className="space-y-6">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-white/10 pb-3">Invoice Summary</h3>
                  
                  <div className="flex justify-between items-center text-sm font-semibold text-slate-300">
                    <span>Total Plan Fee</span>
                    <span className="font-mono text-white">₹{selectedMember.totalAmount || 0}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-semibold text-slate-300">
  <span>Current Balance</span>

  <span className="font-mono text-rose-400">
    ₹{currentBalance}
  </span>
</div>

                  
                  <div className="flex justify-between items-center text-sm font-semibold text-slate-300">
                    <span>Amount Paid</span>
                    <span className="font-mono text-emerald-400">₹{selectedMember.amountPaid || 0}</span>
                  </div>
                </div>
              </div>

              {/* Total Balance Highlight */}
              <div className="relative z-10 mt-12 pt-6 border-t border-white/10">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Total Balance Due</p>
                <div className="text-4xl font-black font-mono tracking-tighter text-white">
                  ₹{currentBalance}
                </div>
              </div>
            </div>

            {/* RIGHT SIDE: PAYMENT PROCESSING (Clean White Form) */}
            <div className="w-full md:w-[60%] p-8 sm:p-10 bg-white">
              
              <div className="mb-8 flex items-center gap-2 text-slate-400">
                <FiShield size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">SSL Encrypted Checkout</span>
              </div>

              {/* Enter Amount */}
              <div className="mb-8">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-800 block mb-3">Amount to Pay</label>
                <div className="relative flex items-center bg-white border border-slate-200 rounded-[16px] focus-within:border-[#635bff] focus-within:ring-4 focus-within:ring-[#635bff]/10 transition-all overflow-hidden p-1 shadow-sm">
                  <div className="pl-4 pr-2 text-2xl text-slate-400 font-bold">₹</div>
              <input
  type="number"
  min={1}
  max={currentBalance}
  placeholder="0.00"
  value={paymentForm.amount}
  onChange={(e) => {
    let value = Number(e.target.value || 0);

    if (value > currentBalance) {
      value = currentBalance;
    }

    setPaymentForm({
      ...paymentForm,
      amount: value === 0 ? "" : value,
    });
  }}
  className="w-full bg-transparent border-none py-3 text-3xl font-black text-[#0a2540] font-mono placeholder-slate-200 focus:outline-none focus:ring-0"
  autoFocus
/>
                  <button 
                      disabled={currentBalance === 0}
  onClick={() =>
    setPaymentForm({
      ...paymentForm,
      amount: currentBalance,
    })
  }
                    className=" disabled:opacity-50 disabled:cursor-not-allowed absolute right-3 px-3 py-1.5 bg-[#f4f6f8] hover:bg-slate-200 text-[#0a2540] text-[10px] font-black uppercase tracking-widest rounded-lg transition-colors"
                  >
                    Pay Full
                  </button>
                </div>
                {/* Fast Chips */}
           <div className="flex gap-2 mt-3 pl-1">

  <span
onClick={() => updateAmount(500)}
    className="cursor-pointer text-[11px] font-bold text-[#635bff] bg-[#635bff]/10 px-3 py-1 rounded-md hover:bg-[#635bff]/20 transition-all"
  >
    + ₹500
  </span>

  <span
onClick={() => updateAmount(1000)}
    className="cursor-pointer text-[11px] font-bold text-[#635bff] bg-[#635bff]/10 px-3 py-1 rounded-md hover:bg-[#635bff]/20 transition-all"
  >
    + ₹1000
  </span>

  <span
onClick={() => updateAmount(2000)}
    className="cursor-pointer text-[11px] font-bold text-[#635bff] bg-[#635bff]/10 px-3 py-1 rounded-md hover:bg-[#635bff]/20 transition-all"
  >
    + ₹2000
  </span>

</div>
              </div>

              {/* Segmented Payment Method Control (iOS / Premium App style) */}
              <div className="mb-8">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-800 block mb-3">Pay With</label>
                <div className="flex p-1 bg-slate-100 rounded-[16px]">
                  {paymentMethods.map(({ key, icon: Icon, label }) => {
                    const isActive = paymentForm.paymentMethod === key;
                    return (
                      <div
                        key={key}
                        onClick={() => setPaymentForm({ ...paymentForm, paymentMethod: key })}
                        className={`flex-1 flex flex-col items-center justify-center gap-1.5 py-3 rounded-[12px] cursor-pointer transition-all duration-200 ${
                          isActive ? "bg-white shadow-sm border border-slate-200/50" : "text-slate-500 hover:text-slate-700"
                        }`}
                      >
                        <Icon size={20} className={isActive ? "text-[#635bff]" : "text-slate-400"} />
                        <span className={`text-[10px] font-black uppercase tracking-widest ${isActive ? "text-[#0a2540]" : ""}`}>
                          {label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Notes */}
              <div className="mb-10">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-800 block mb-3">Remarks (Optional)</label>
                <textarea
                  rows="2"
                  placeholder="Reference ID or any notes..."
                  value={paymentForm.note}
                  onChange={(e) => setPaymentForm({ ...paymentForm, note: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-[16px] px-4 py-3 text-sm font-semibold text-slate-700 placeholder-slate-400 focus:outline-none focus:border-[#635bff] focus:bg-white transition-all resize-none"
                />
              </div>

              {/* Final Submit Button */}
              <div>
                <button
                  onClick={savePayment}
                  disabled={
  isSubmitting ||
  !paymentForm.amount ||
  Number(paymentForm.amount) <= 0 ||
  Number(paymentForm.amount) > currentBalance
}
                  className="w-full py-5 rounded-[16px] bg-[#0a2540] hover:bg-black text-white font-black text-base transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between px-6 shadow-lg shadow-[#0a2540]/20"
                >
                  <span className="flex items-center gap-3">
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <FiCheckCircle size={22} className="text-[#00d4ff]" />
                    )}
                    Pay Now
                  </span>
                  <span className="font-mono text-lg tracking-tight">
                    ₹{paymentForm.amount ? paymentForm.amount : "0.00"}
                  </span>
                </button>

                {/* Projection info */}
                <div className="text-center mt-4">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Balance after payment: <span className={`font-mono ${projectedBalance === 0 ? "text-emerald-500" : "text-slate-800"}`}>₹{projectedBalance}</span>
                  </p>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CollectPaymentPage;