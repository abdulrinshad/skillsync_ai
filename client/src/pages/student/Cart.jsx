import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, ShoppingCart, ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";
import { GlassCard, Button } from "../../components/ui";

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token_student") || localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load shopping cart.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleRemove = async (courseId) => {
    try {
      const token = localStorage.getItem("token_student") || localStorage.getItem("token");
      const res = await axios.delete(`http://localhost:5000/api/cart/remove/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(res.data.cart);
      window.dispatchEvent(new Event("cart-updated"));
    } catch (err) {
      console.error(err);
      alert("Failed to remove item.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center text-white">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const items = cart?.items || [];
  const subtotal = items.reduce((acc, item) => acc + (item.courseId?.price || 0), 0);
  const discount = subtotal * 0.1; // 10% simulated coupon discount
  const tax = subtotal * 0.18; // 18% GST/tax
  const total = subtotal - discount + tax;

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 relative overflow-hidden font-sans">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/10 blur-[130px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-600/10 blur-[130px] rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        <h1 className="text-3xl font-black flex items-center gap-3">
          <ShoppingCart className="text-purple-400" /> Shopping Cart
        </h1>

        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-16 text-center rounded-3xl border border-white/5 bg-slate-950/40 backdrop-blur-xl flex flex-col items-center justify-center space-y-6"
          >
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center text-gray-500">
              <ShoppingCart size={40} />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-white">Your learning cart is empty</h3>
              <p className="text-xs text-gray-500 mt-1">Explore our courses catalog and discover premium skills.</p>
            </div>
            <Link to="/dashboard/explore">
              <Button variant="gradient" className="px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center gap-2">
                <ArrowLeft size={14} /> Continue Shopping
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Cart Items List */}
            <div className="lg:col-span-8 space-y-4">
              <AnimatePresence>
                {items.map((item) => {
                  const course = item.courseId || {};
                  return (
                    <motion.div
                      key={item._id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="p-5 rounded-3xl border border-white/5 bg-white/[0.01] hover:border-white/10 transition-colors flex flex-col sm:flex-row items-center gap-6"
                    >
                      <div className="w-full sm:w-28 h-16 rounded-xl overflow-hidden border border-white/5 shrink-0">
                        <img
                          src={course.thumbnail || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=300"}
                          className="w-full h-full object-cover"
                          alt={course.title}
                        />
                      </div>
                      
                      <div className="flex-1 space-y-1 text-center sm:text-left w-full">
                        <span className="text-[9px] font-black uppercase text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                          {course.category}
                        </span>
                        <h3 className="font-extrabold text-sm text-white truncate">{course.title}</h3>
                        <p className="text-xs text-gray-500">{course.teacherId?.fullName}</p>
                      </div>

                      <div className="flex items-center gap-6 shrink-0">
                        <div className="text-right">
                          <div className="text-lg font-black text-cyan-400">₹{course.price}</div>
                        </div>
                        <button
                          onClick={() => handleRemove(course._id)}
                          className="w-9 h-9 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-all cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-4 w-full">
              <GlassCard className="p-6 border-white/10 space-y-6">
                <h3 className="font-bold text-lg text-white">Order Summary</h3>
                
                <div className="space-y-3 text-sm text-gray-400 border-b border-white/5 pb-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-white font-semibold">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-green-400">
                    <span>Discount (10%)</span>
                    <span>-₹{discount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (18% GST)</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-lg font-black text-white">
                  <span>Total</span>
                  <span className="text-2xl text-cyan-400">₹{total.toFixed(2)}</span>
                </div>

                <div className="space-y-3">
                  <Button
                    variant="primary"
                    onClick={() => navigate("/dashboard/checkout", { state: { items, total } })}
                    className="w-full py-4 bg-gradient-to-r from-purple-600 to-cyan-500 font-bold tracking-wider hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                  >
                    Proceed to Checkout <ArrowRight size={16} />
                  </Button>
                  
                  <Link to="/dashboard/explore" className="block text-center text-xs text-gray-500 hover:text-white transition-colors">
                    Continue Shopping
                  </Link>
                </div>

                <div className="flex items-center gap-2 justify-center text-[10px] text-gray-600 pt-2">
                  <ShieldCheck size={14} /> 100% Secure Checkout Guaranteed
                </div>
              </GlassCard>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
