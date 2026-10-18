import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Users, UserMinus, ExternalLink, ArrowLeft, Star, BookOpen } from "lucide-react";
import { GlassCard, Button, Badge } from "../../components/ui";
import { toast } from "react-toastify";

const FollowingPage = () => {
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFollowing = async () => {
    try {
      const token = localStorage.getItem("token_student") || localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/instructors/following", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFollowing(res.data || []);
    } catch (err) {
      console.error("Failed to load following list:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFollowing();
  }, []);

  const handleUnfollow = async (teacherId) => {
    try {
      const token = localStorage.getItem("token_student") || localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/instructors/unfollow/${teacherId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Successfully unfollowed instructor");
      fetchFollowing();
    } catch (err) {
      toast.error("Failed to unfollow instructor.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#020617] text-white">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white p-4 md:p-8 font-sans relative overflow-hidden">
      {/* Background glow effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-600/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-semibold">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        <div>
          <Badge color="purple" className="mb-2">Subscriptions</Badge>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-none">Following Instructors</h1>
          <p className="text-gray-400 text-sm mt-2">Manage updates, discover course releases, and see bios of teachers you follow.</p>
        </div>

        {following.length === 0 ? (
          <div className="p-12 text-center bg-white/[0.01] border border-white/5 rounded-[2.5rem]">
            <Users size={32} className="text-gray-600 mx-auto mb-2" />
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">You are not following any instructors yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {following.map((follow) => {
              const teacher = follow.teacherId || { name: "Instructor", specialization: "Professional Educator", bio: "" };
              
              return (
                <GlassCard
                  key={follow._id}
                  className="p-6 border-white/5 rounded-[2rem] flex flex-col justify-between gap-4 bg-gradient-to-br from-white/[0.01] to-transparent hover:border-purple-500/20 transition-all group relative"
                >
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-purple-600/10 text-purple-400 flex items-center justify-center font-bold text-lg">
                        {teacher.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-white">{teacher.name}</h4>
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-0.5 block">{teacher.specialization}</span>
                      </div>
                    </div>

                    {teacher.bio && (
                      <p className="text-xs text-gray-400 font-semibold leading-relaxed line-clamp-3">{teacher.bio}</p>
                    )}
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-white/5">
                    <Link to={`/dashboard/instructor/${teacher._id}`} className="flex-1">
                      <Button
                        variant="gradient"
                        className="w-full py-2.5 rounded-xl text-[9px] font-black uppercase tracking-wider flex items-center justify-center gap-1 bg-purple-600 hover:bg-purple-550 text-white"
                      >
                        <ExternalLink size={10} /> View Profile
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      onClick={() => handleUnfollow(teacher._id)}
                      className="py-2.5 px-3.5 rounded-xl text-[9px] font-black uppercase tracking-wider border-white/10 hover:bg-red-500/10 text-gray-500 hover:text-red-400"
                      title="Unfollow"
                    >
                      <UserMinus size={10} />
                    </Button>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default FollowingPage;
