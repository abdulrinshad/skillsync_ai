import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ShieldCheck, Award, Calendar, User, BookOpen, AlertCircle, ArrowLeft } from 'lucide-react';
import { GlassCard, Badge, Button } from '../../components/ui';

const VerifyCertificate = () => {
  const { certId } = useParams();
  const [cert, setCert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const verify = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/api/certificates/verify/${certId}`);
        setCert(res.data.certificate);
      } catch (err) {
        console.error("Verification error:", err);
        setError(err.response?.data?.message || "Certificate verification failed. This ID is invalid or does not exist.");
      } finally {
        setLoading(false);
      }
    };
    verify();
  }, [certId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center text-white">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col justify-center items-center p-6 relative overflow-hidden font-sans">
      {/* Background Blurs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-600/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-xl w-full relative z-10 space-y-8">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-xs font-bold uppercase tracking-wider">
          <ArrowLeft size={14} /> Back to SkillSync Home
        </Link>

        {error ? (
          <GlassCard className="p-10 border-red-500/20 bg-red-950/5 text-center space-y-6 rounded-[2.5rem]">
            <div className="w-16 h-16 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <AlertCircle size={32} />
            </div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tight">Invalid Credential</h2>
            <p className="text-sm text-gray-400 leading-relaxed">{error}</p>
          </GlassCard>
        ) : (
          <GlassCard className="p-10 border-cyan-500/20 bg-gradient-to-b from-cyan-950/10 to-transparent space-y-8 rounded-[3rem] shadow-2xl relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/10 blur-3xl rounded-full" />
            
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-cyan-500/15 text-cyan-400 rounded-full flex items-center justify-center mx-auto border border-cyan-500/30 shadow-2xl animate-float">
                <ShieldCheck size={40} />
              </div>
              <div>
                <Badge color="cyan" className="uppercase font-black text-[9px] tracking-widest px-3 py-1">✓ Valid Credential</Badge>
                <h1 className="text-3xl font-black text-white mt-4 tracking-tight leading-none">Certificate Verified</h1>
              </div>
            </div>

            <div className="border-t border-b border-white/5 py-8 space-y-6">
              <div className="flex gap-4 items-start">
                <User className="text-purple-400 shrink-0 mt-0.5" size={18} />
                <div>
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Recipient</span>
                  <span className="text-base font-extrabold text-white">{cert.studentId?.fullName}</span>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <BookOpen className="text-purple-400 shrink-0 mt-0.5" size={18} />
                <div>
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Course Title</span>
                  <span className="text-base font-extrabold text-white">{cert.courseId?.title}</span>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <User className="text-purple-400 shrink-0 mt-0.5" size={18} />
                <div>
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Instructor</span>
                  <span className="text-base font-extrabold text-white">{cert.courseId?.teacherId?.fullName || "Instructor"}</span>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <Calendar className="text-purple-400 shrink-0 mt-0.5" size={18} />
                <div>
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Issued On</span>
                  <span className="text-base font-extrabold text-white">{new Date(cert.issuedAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <Award className="text-purple-400 shrink-0 mt-0.5" size={18} />
                <div>
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Certificate ID</span>
                  <span className="text-sm font-mono text-cyan-400 font-bold">{cert.certificateId}</span>
                </div>
              </div>
            </div>

            <div className="text-center text-[10px] font-bold text-gray-600 uppercase tracking-widest">
              SkillSync Credentials System • AI-Powered Learning LMS
            </div>
          </GlassCard>
        )}
      </div>
    </div>
  );
};

export default VerifyCertificate;
