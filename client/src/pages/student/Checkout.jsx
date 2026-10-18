import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { CreditCard, CheckCircle2, XCircle, ArrowLeft, ShieldCheck } from "lucide-react";
import { GlassCard, Button } from "../../components/ui";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { items = [], total = 0 } = location.state || {};

  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handlePay = () => {
    if (items.length === 0) return;
    setPaymentModalOpen(true);
  };

  const processPayment = async (status) => {
    setProcessing(true);
    setError("");

    try {
      const token = localStorage.getItem("token_student") || localStorage.getItem("token");
      const courseIds = items.map(item => item.courseId?._id || item.courseId);

      if (status === "success") {
        const res = await axios.post(
          "http://localhost:5000/api/orders/create",
          {
            courses: courseIds,
            totalAmount: total,
            paymentStatus: "paid"
          },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        setPaymentSuccess(true);
        window.dispatchEvent(new Event("cart-updated"));
        setTimeout(() => {
          setPaymentModalOpen(false);
          navigate("/dashboard/learning");
        }, 1500);
      } else {
        // Simulating failed order
        await axios.post(
          "http://localhost:5000/api/orders/create",
          {
            courses: courseIds,
            totalAmount: total,
            paymentStatus: "failed"
          },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setError("Payment cancelled/failed. Order recorded as unpaid.");
        setTimeout(() => {
          setPaymentModalOpen(false);
        }, 1500);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to process transaction.");
      setTimeout(() => {
        setPaymentModalOpen(false);
      }, 1500);
    } finally {
      setProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center text-white p-6">
        <p className="text-gray-400 mb-4">No checkout items found.</p>
        <Link to="/dashboard/cart">
          <Button variant="outline">Back to Cart</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 md:p-12 relative overflow-hidden font-sans">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/10 blur-[130px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-600/10 blur-[130px] rounded-full" />
      </div>

      <div className="max-w-4xl mx-auto space-y-8 relative z-10">
        <Link to="/dashboard/cart" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft size={16} /> Back to Cart
        </Link>

        <h1 className="text-3xl font-black flex items-center gap-3">
          <CreditCard className="text-purple-400" /> Checkout
        </h1>

        <div className="grid md:grid-cols-12 gap-8 items-start">
          {/* Billing & Payment options */}
          <div className="md:col-span-8 space-y-6">
            <GlassCard className="p-6 border-white/5 space-y-4">
              <h3 className="font-bold text-lg">Payment Methods</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl border-2 border-purple-500/50 bg-purple-500/5 flex items-center justify-between cursor-pointer">
                  <div>
                    <h4 className="font-bold text-sm">Razorpay</h4>
                    <p className="text-[10px] text-gray-500">Cards, Netbanking, UPI</p>
                  </div>
                  <div className="w-4 h-4 rounded-full bg-purple-500 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-white/5 bg-white/[0.01] flex items-center justify-between opacity-50 cursor-not-allowed">
                  <div>
                    <h4 className="font-bold text-sm">Wallet (Future)</h4>
                    <p className="text-[10px] text-gray-500">Pay using account credits</p>
                  </div>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6 border-white/5 space-y-4">
              <h3 className="font-bold text-lg">Billing Review</h3>
              <div className="space-y-3">
                {items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                    <span className="truncate max-w-[250px]">{item.courseId?.title}</span>
                    <span className="font-bold text-cyan-400">₹{item.courseId?.price}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* Checkout sidebar */}
          <div className="md:col-span-4 w-full">
            <GlassCard className="p-6 border-white/10 space-y-6">
              <h3 className="font-bold text-lg">Order Amount</h3>
              <div className="flex justify-between items-center text-3xl font-black text-cyan-400">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>

              {error && <p className="text-red-400 text-sm font-semibold">{error}</p>}

              <Button
                variant="primary"
                onClick={handlePay}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-cyan-500 font-bold tracking-wider hover:opacity-90 transition-opacity"
              >
                Pay ₹{total.toFixed(2)}
              </Button>

              <div className="flex items-center gap-2 justify-center text-[10px] text-gray-600">
                <ShieldCheck size={14} /> Transactions are encrypted & secure
              </div>
            </GlassCard>
          </div>
        </div>
      </div>

      {/* Dummy Razorpay simulated payment modal */}
      <AnimatePresence>
        {paymentModalOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-6">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-white/10 rounded-3xl p-8 max-w-sm w-full text-center space-y-6 shadow-2xl relative overflow-hidden"
            >
              {/* Shimmer gradient line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-cyan-400 to-blue-600" />

              <div>
                <h3 className="font-black text-xl text-white">Simulated Razorpay</h3>
                <p className="text-xs text-gray-500 mt-1">Complete your purchase of ₹{total.toFixed(2)}</p>
              </div>

              {processing ? (
                <div className="py-6 flex flex-col items-center justify-center space-y-3">
                  <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs text-gray-400">Processing secure transaction...</p>
                </div>
              ) : paymentSuccess ? (
                <div className="py-6 flex flex-col items-center justify-center space-y-3">
                  <CheckCircle2 size={40} className="text-green-400 animate-pulse" />
                  <p className="text-xs text-green-400 font-bold">Payment Completed Successfully!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <button
                    onClick={() => processPayment("success")}
                    className="w-full py-3.5 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <CheckCircle2 size={16} /> Simulate Success
                  </button>
                  <button
                    onClick={() => processPayment("cancel")}
                    className="w-full py-3.5 bg-red-600/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 font-bold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <XCircle size={16} /> Cancel Payment
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Checkout;
