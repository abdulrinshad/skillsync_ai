import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { UserPlus, UserMinus, Award, BookOpen, Star, ArrowLeft, Users } from "lucide-react";
import { GlassCard, Button, Badge } from "../../components/ui";
import { toast } from "react-toastify";

const InstructorProfile = () => {
  const { teacherId } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token_student") || localStorage.getItem("token");
      const res = await axios.get(`http://localhost:5000/api/instructors/profile/${teacherId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(res.data);
    } catch (err) {
      console.error("Failed to load instructor profile details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [teacherId]);

  const handleFollowToggle = async () => {
    try {
      const token = localStorage.getItem("token_student") || localStorage.getItem("token");
      if (profile.isFollowing) {
        await axios.delete(`http://localhost:5000/api/instructors/unfollow/${teacherId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("Unfollowed instructor");
      } else {
        await axios.post(`http://localhost:5000/api/instructors/follow/${teacherId}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("Following instructor!");
      }
      fetchProfile();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update follow status.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#020617] text-white">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const { teacher, courses, totalStudents, followersCount, isFollowing } = profile || {
    teacher: { name: "Instructor", specialization: "Professional Educator", bio: "", experience: "", skills: [] },
    courses: [],
    totalStudents: 0,
    followersCount: 0,
    isFollowing: false
  };

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

        {/* Profile Card Header */}
        <GlassCard className="p-8 rounded-[3rem] border-white/5 bg-gradient-to-br from-purple-950/10 via-transparent to-[#020617]/50 relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
              <div className="w-20 h-20 rounded-full bg-purple-600/10 text-purple-400 flex items-center justify-center font-bold text-2xl border-2 border-purple-500/20">
                {teacher.name.charAt(0)}
              </div>
              <div className="space-y-1">
                <h2 className="text-2xl md:text-3xl font-black text-white flex items-center justify-center sm:justify-start gap-2">
                  {teacher.name}
                  <Badge color="green" className="text-[8px] font-black uppercase tracking-wider shrink-0 px-1 py-0.5">Verified</Badge>
                </h2>
                <p className="text-sm text-cyan-400 font-bold uppercase tracking-wider">{teacher.specialization}</p>
                
                {/* Stats row */}
                <div className="flex gap-4 pt-2 justify-center sm:justify-start text-xs text-gray-400 font-semibold">
                  <span className="flex items-center gap-1"><Users size={14} /> {followersCount} followers</span>
                  <span className="flex items-center gap-1"><BookOpen size={14} /> {courses.length} courses</span>
                </div>
              </div>
            </div>

            <Button
              onClick={handleFollowToggle}
              variant={isFollowing ? "outline" : "gradient"}
              className="py-3 px-6 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-1.5 shrink-0"
            >
              {isFollowing ? (
                <>
                  <UserMinus size={14} /> Unfollow
                </>
              ) : (
                <>
                  <UserPlus size={14} /> Follow
                </>
              )}
            </Button>
          </div>
        </GlassCard>

        {/* Bio information & Skills */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-lg font-black text-white border-b border-white/5 pb-2">Biography</h3>
            <p className="text-sm text-gray-400 leading-relaxed font-semibold">
              {teacher.bio || "No biography provided by the instructor."}
            </p>
            {teacher.experience && (
              <p className="text-xs text-gray-500 italic leading-relaxed">
                Experience: {teacher.experience}
              </p>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-black text-white border-b border-white/5 pb-2">Topic Skills</h3>
            <div className="flex flex-wrap gap-2">
              {teacher.skills?.length > 0 ? (
                teacher.skills.map((skill, idx) => (
                  <Badge key={idx} color="purple">
                    {skill}
                  </Badge>
                ))
              ) : (
                <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">No specific skills listed.</span>
              )}
            </div>
          </div>
        </div>

        {/* Published Courses Grid */}
        <div className="space-y-6">
          <h3 className="text-xl font-black text-white border-b border-white/5 pb-2">Courses Published</h3>
          
          {courses.length === 0 ? (
            <div className="p-8 text-center bg-white/[0.01] border border-white/5 rounded-2xl text-xs text-gray-500 font-bold uppercase tracking-wider">
              No courses published yet by this instructor.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {courses.map((course) => (
                <GlassCard key={course._id} className="p-5 border-white/10 flex flex-col justify-between space-y-4 hover:border-purple-500/20 transition-all relative overflow-hidden group">
                  <div className="rounded-xl overflow-hidden aspect-video bg-black/40">
                    <img
                      src={course.thumbnail || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800"}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      alt={course.title}
                    />
                  </div>

                  <div className="space-y-1">
                    <Badge color="purple">{course.category}</Badge>
                    <h4 className="font-extrabold text-sm text-white leading-tight truncate">{course.title}</h4>
                    <p className="text-[10px] text-gray-400 line-clamp-2">{course.description}</p>
                  </div>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                    <span className="text-xs font-black text-cyan-400">₹{course.price || "Free"}</span>
                    <Link to={`/courses/${course._id}`}>
                      <Button className="py-1 px-3 bg-purple-600 hover:bg-purple-700 text-white font-black text-[9px] rounded-lg uppercase tracking-wider">
                        Enroll
                      </Button>
                    </Link>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstructorProfile;
