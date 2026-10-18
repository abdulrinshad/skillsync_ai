import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { 
  Award, 
  Download, 
  Share2, 
  CheckCircle2, 
  Clock, 
  BrainCircuit, 
  TrendingUp, 
  ChevronRight, 
  Star, 
  ShieldCheck,
  FileText,
  Zap,
  Sparkles,
  PieChart as PieChartIcon
} from 'lucide-react';
import { BsLinkedin } from 'react-icons/bs';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip 
} from 'recharts';
import { GlassCard, Button, Badge } from '../../components/ui';

const skillData = [
  { name: 'AI/ML', value: 45, color: '#8b5cf6' },
  { name: 'Frontend', value: 25, color: '#06b6d4' },
  { name: 'UI/UX', value: 20, color: '#3b82f6' },
  { name: 'Backend', value: 10, color: '#6366f1' },
];

const handleDownloadPDF = (cert) => {
  const printWindow = window.open("", "_blank");
  const studentName = cert.studentId?.fullName || "Student";
  const courseName = cert.courseId?.title || "Course Mastery";
  const instructor = cert.courseId?.teacherId?.fullName || "Instructor";
  const date = new Date(cert.issuedAt).toLocaleDateString();
  const certId = cert.certificateId;
  const verificationUrl = `http://localhost:5173/verify-certificate/${certId}`;

  printWindow.document.write(`
    <html>
      <head>
        <title>Certificate of Completion</title>
        <style>
          body {
            font-family: 'Outfit', 'Inter', sans-serif;
            background: #020617;
            color: white;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            padding: 20px;
          }
          .certificate {
            border: 10px double #8b5cf6;
            background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
            padding: 50px;
            width: 800px;
            text-align: center;
            position: relative;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
            border-radius: 20px;
          }
          .title {
            font-size: 42px;
            font-weight: 900;
            color: #8b5cf6;
            text-transform: uppercase;
            letter-spacing: 2px;
          }
          .subtitle {
            font-size: 18px;
            color: #94a3b8;
            margin-top: 10px;
          }
          .student-name {
            font-size: 36px;
            font-weight: 800;
            color: white;
            margin: 30px 0;
            text-decoration: underline;
            text-decoration-color: #06b6d4;
          }
          .course-title {
            font-size: 24px;
            font-weight: 700;
            color: #06b6d4;
            margin: 20px 0;
          }
          .details {
            display: flex;
            justify-content: space-between;
            margin-top: 50px;
            font-size: 14px;
            color: #94a3b8;
          }
          .badge {
            font-size: 48px;
            color: #eab308;
            margin: 20px 0;
          }
          .footer-note {
            margin-top: 40px;
            font-size: 10px;
            color: #64748b;
          }
        </style>
      </head>
      <body>
        <div class="certificate">
          <div class="badge">🏆</div>
          <div class="title">Certificate of Completion</div>
          <div class="subtitle">This is proudly presented to</div>
          <div class="student-name">${studentName}</div>
          <div class="subtitle">for successfully completing the course</div>
          <div class="course-title">${courseName}</div>
          <div class="details">
            <div>
              <strong>Instructor:</strong> ${instructor}
            </div>
            <div>
              <strong>Date:</strong> ${date}
            </div>
            <div>
              <strong>ID:</strong> ${certId}
            </div>
          </div>
          <div class="footer-note">
            Verify authenticity at: ${verificationUrl}
          </div>
        </div>
        <script>
          window.onload = function() {
            window.print();
          }
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
};

const handleShareLinkedIn = (cert) => {
  const certId = cert.certificateId;
  const verificationUrl = `http://localhost:5173/verify-certificate/${certId}`;
  const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(verificationUrl)}`;
  window.open(shareUrl, "_blank");
};

const handleShareLink = (cert) => {
  const certId = cert.certificateId;
  const verificationUrl = `http://localhost:5173/verify-certificate/${certId}`;
  navigator.clipboard.writeText(verificationUrl);
  toast.success("Verification link copied to clipboard!");
};

const CertificateCard = ({ cert, delay }) => {
  const courseTitle = cert.courseId?.title || "Course Title";
  const courseCategory = cert.courseId?.category || "Technology";
  const instructor = cert.courseId?.teacherId?.fullName || "Instructor";
  const issuedDate = new Date(cert.issuedAt).toLocaleDateString();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      whileHover={{ y: -10 }}
      className="glass-card rounded-[2.5rem] overflow-hidden border-white/5 hover:border-purple-500/30 transition-all group relative"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="h-48 relative overflow-hidden bg-slate-950 flex items-center justify-center border-b border-white/5">
         <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-cyan-500/20 mix-blend-overlay group-hover:scale-110 transition-transform duration-700" />
         <Award size={80} className="text-purple-500/20 group-hover:text-purple-500/40 transition-colors" />
         <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 shadow-2xl opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100">
               <FileText size={24} />
            </div>
         </div>
      </div>
      
      <div className="p-8 space-y-6">
         <div className="flex justify-between items-start">
            <div>
               <Badge color="purple" className="mb-3 uppercase tracking-tighter">{courseCategory}</Badge>
               <h3 className="font-bold text-xl leading-tight group-hover:text-purple-400 transition-colors">{courseTitle}</h3>
            </div>
            <ShieldCheck size={28} className="text-cyan-400 opacity-50 group-hover:opacity-100 transition-opacity" />
         </div>
         
         <div className="space-y-2 text-xs font-medium text-gray-500 uppercase tracking-widest">
            <div className="flex items-center gap-2"><Clock size={12} /> Issued on {issuedDate}</div>
            <div className="flex items-center gap-2"><CheckCircle2 size={12} /> Instructor: {instructor}</div>
            <div className="flex items-center gap-2 opacity-40">ID: {cert.certificateId}</div>
         </div>

         <div className="flex gap-3 pt-4 border-t border-white/5">
            <Button 
              onClick={() => handleDownloadPDF(cert)} 
              variant="outline" 
              className="flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white hover:text-black transition-all"
            >
               <Download size={14} /> PDF
            </Button>
            <Button 
              onClick={() => handleShareLinkedIn(cert)} 
              variant="outline" 
              className="px-4 py-3 rounded-xl hover:bg-blue-600 hover:text-white transition-all"
            >
               <BsLinkedin size={14} />
            </Button>
            <Button 
              onClick={() => handleShareLink(cert)} 
              variant="outline" 
              className="px-4 py-3 rounded-xl hover:bg-purple-600 hover:text-white transition-all"
            >
               <Share2 size={14} />
            </Button>
         </div>
      </div>
    </motion.div>
  );
};

const SkillBadge = ({ icon: Icon, title, level }) => (
  <div className="glass-card p-6 rounded-[2rem] border-white/5 flex flex-col items-center text-center group cursor-pointer hover:bg-white/5 transition-all">
    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4 shadow-lg border border-white/5 group-hover:scale-110 group-hover:rotate-6 transition-transform relative">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity" />
      <Icon size={32} className="text-purple-400 group-hover:text-white transition-colors" />
    </div>
    <h4 className="font-bold text-[10px] uppercase tracking-widest mb-1">{title}</h4>
    <Badge color="cyan" className="text-[8px] px-2">{level}</Badge>
  </div>
);

const Certificates = () => {
  const [certs, setCerts] = useState([]);
  const [completedEnrollments, setCompletedEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const fetchCertificatesAndEnrollments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token_student") || localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      // 1. Fetch certificates
      const certsRes = await axios.get("http://localhost:5000/api/certificates/my-certificates", { headers });
      const fetchedCerts = certsRes.data.certificates || [];
      setCerts(fetchedCerts);

      // 2. Fetch enrollments
      const enrollmentsRes = await axios.get("http://localhost:5000/api/enrollments/my-courses", { headers });
      const enrollments = enrollmentsRes.data || [];

      // Filter enrollments that are 100% completed but have no certificate generated yet
      const eligible = enrollments.filter(enrollment => {
        const isComplete = enrollment.progressDetails?.progressPercentage === 100 || enrollment.completed;
        const alreadyClaimed = fetchedCerts.some(c => c.courseId?._id === enrollment.courseId?._id);
        return isComplete && !alreadyClaimed;
      });

      setCompletedEnrollments(eligible);
    } catch (err) {
      console.error("Failed to load certificates dashboard:", err);
      toast.error("Failed to load achievements.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificatesAndEnrollments();
  }, []);

  const handleClaimCertificate = async (courseId) => {
    try {
      setClaiming(true);
      const token = localStorage.getItem("token_student") || localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      await axios.post(`http://localhost:5000/api/certificates/${courseId}`, {}, { headers });
      toast.success("Certificate claimed successfully! View it in your gallery.");
      await fetchCertificatesAndEnrollments();
    } catch (err) {
      console.error("Failed to claim certificate:", err);
      toast.error(err.response?.data?.message || "Failed to claim certificate.");
    } finally {
      setClaiming(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center text-white">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-12 pb-20"
    >
      {/* Hero Section */}
      <motion.section 
        variants={itemVariants}
        className="relative h-[300px] rounded-[3rem] overflow-hidden flex flex-col items-center justify-center text-center p-8 border border-white/10 group"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-[#020617] to-cyan-900/40 opacity-80" />
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-600/10 blur-[100px] rounded-full animate-pulse" />
        
        <div className="relative z-10 max-w-3xl">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-16 h-16 bg-white/5 rounded-[1.5rem] flex items-center justify-center text-purple-400 mb-8 mx-auto border border-white/10 shadow-2xl animate-float"
          >
            <Award size={32} />
          </motion.div>
          <motion.h1 
            className="text-5xl lg:text-6xl font-black mb-4 tracking-tight leading-none text-white"
          >
            Your Learning <span className="text-gradient">Achievements.</span>
          </motion.h1>
          <motion.p 
            className="text-gray-400 text-lg font-medium max-w-xl mx-auto leading-relaxed"
          >
            Visualize your career growth through AI-validated certifications and industry-recognized skill badges.
          </motion.p>
        </div>
      </motion.section>

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-12">
          {/* Claim Certificate Banner */}
          {completedEnrollments.length > 0 && (
            <motion.section variants={itemVariants} className="space-y-6">
              <h2 className="text-2xl font-black flex items-center gap-3 text-white">
                <div className="w-10 h-10 bg-yellow-500/20 rounded-xl flex items-center justify-center text-yellow-400">
                  <Star size={20} fill="currentColor" />
                </div>
                Ready to Claim
              </h2>
              <div className="space-y-4">
                {completedEnrollments.map((enrollment) => (
                  <GlassCard key={enrollment._id} className="p-6 border-yellow-500/20 bg-yellow-950/5 flex flex-col sm:flex-row justify-between items-center gap-4 rounded-3xl">
                    <div>
                      <h4 className="font-extrabold text-lg text-white">{enrollment.courseId?.title}</h4>
                      <p className="text-xs text-gray-400 mt-1">Instructor: {enrollment.courseId?.teacherId?.fullName}</p>
                    </div>
                    <Button 
                      disabled={claiming} 
                      onClick={() => handleClaimCertificate(enrollment.courseId?._id)} 
                      className="py-3 px-6 bg-yellow-600 hover:bg-yellow-500 text-slate-950 font-black text-xs rounded-xl uppercase tracking-wider"
                    >
                      Claim Certificate
                    </Button>
                  </GlassCard>
                ))}
              </div>
            </motion.section>
          )}

          {/* Certificate Showcase Grid */}
          <section>
             <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black flex items-center gap-3 text-white">
                   <div className="w-10 h-10 bg-purple-600/20 rounded-xl flex items-center justify-center text-purple-400">
                      <Zap size={20} fill="currentColor" />
                   </div>
                   Validated Certificates
                </h2>
             </div>
             {certs.length === 0 ? (
               <GlassCard className="p-10 text-center text-gray-500 rounded-3xl">
                 <Award size={48} className="mx-auto mb-4 text-gray-600" />
                 <p className="text-sm font-semibold">No certificates claimed yet.</p>
                 <p className="text-xs mt-1">Complete your course modules to 100% to unlock credentials!</p>
               </GlassCard>
             ) : (
               <div className="grid sm:grid-cols-2 gap-8">
                  {certs.map((cert, i) => (
                    <CertificateCard key={cert._id} cert={cert} delay={0.1 * i} />
                  ))}
               </div>
             )}
          </section>

          {/* Learning Journey Timeline */}
          <section className="glass-card rounded-[3rem] p-10 border-white/5 relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-10 text-white/5 group-hover:text-purple-500/10 transition-colors">
                <TrendingUp size={120} strokeWidth={1} />
             </div>
             <h2 className="text-2xl font-black mb-10 uppercase tracking-tight flex items-center gap-3 text-white">
                <Star className="text-yellow-500" size={24} /> Learning Milestone
             </h2>
             <div className="space-y-10 relative">
                <div className="absolute left-6 top-2 bottom-2 w-px bg-white/5" />
                {[
                  { title: 'Mastered 5 Neural Architectures', date: 'May 10', icon: BrainCircuit, xp: '+1,500 XP' },
                  { title: 'Completed Live UI Workshop', date: 'Apr 22', icon: Star, xp: '+800 XP' },
                  { title: 'AI Ethics Certification', date: 'Apr 05', icon: ShieldCheck, xp: '+1,200 XP' }
                ].map((milestone, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ x: 5 }}
                    className="flex gap-8 relative z-10 group/item cursor-pointer"
                  >
                     <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-gray-500 group-hover/item:bg-purple-600 group-hover/item:text-white group-hover/item:border-purple-600 transition-all">
                        <milestone.icon size={20} />
                     </div>
                     <div>
                        <div className="flex items-center gap-3">
                           <h4 className="font-bold text-sm group-hover/item:text-purple-400 transition-colors text-white">{milestone.title}</h4>
                           <span className="text-[8px] font-black text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded-full">{milestone.xp}</span>
                        </div>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">{milestone.date}</p>
                     </div>
                  </motion.div>
                ))}
             </div>
          </section>
        </div>

        {/* Right Sidebar Column */}
        <div className="space-y-12">
          {/* Achievement Analytics */}
          <section className="glass-card p-8 rounded-[2.5rem] border-white/5 relative overflow-hidden group">
             <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-cyan-500/5" />
             <div className="relative z-10 space-y-8">
                <div className="flex justify-between items-start">
                   <h3 className="font-black text-lg uppercase tracking-tight leading-none text-white">Skill<br/><span className="text-gray-500">Distribution</span></h3>
                   <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-purple-400 shadow-inner">
                      <PieChartIcon size={20} />
                   </div>
                </div>
                
                <div className="h-48 w-full">
                   <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                         <Pie
                           data={skillData}
                           innerRadius={60}
                           outerRadius={80}
                           paddingAngle={5}
                           dataKey="value"
                         >
                           {skillData.map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                           ))}
                         </Pie>
                         <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                              border: '1px solid rgba(255, 255, 255, 0.1)', 
                              borderRadius: '16px',
                              backdropFilter: 'blur(10px)',
                              fontSize: '10px'
                            }}
                         />
                      </PieChart>
                   </ResponsiveContainer>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                   <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                      <div className="text-xl font-black text-white">{certs.length}</div>
                      <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Certs Won</div>
                   </div>
                   <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                      <div className="text-xl font-black text-white">8.4</div>
                      <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">AI Score</div>
                   </div>
                </div>
             </div>
          </section>

          {/* Skill Badges */}
          <section className="space-y-4">
             <h3 className="text-lg font-black mb-6 px-2 flex items-center gap-3 text-white">
                <Sparkles size={20} className="text-purple-400" /> Digital Badges
             </h3>
             <div className="grid grid-cols-2 gap-4">
                <SkillBadge icon={BrainCircuit} title="AI Expert" level="Platinum" />
                <SkillBadge icon={ShieldCheck} title="Ethics Master" level="Gold" />
                <SkillBadge icon={TrendingUp} title="Growth Op" level="Silver" />
                <SkillBadge icon={CheckCircle2} title="Verified" level="Lvl 12" />
             </div>
          </section>

          {/* AI Career Insights Widget */}
          <GlassCard className="bg-gradient-to-br from-indigo-900/20 via-transparent to-cyan-900/10 border-purple-500/20 relative overflow-hidden group rounded-[2.5rem]">
             <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/10 blur-[50px] rounded-full group-hover:scale-150 transition-transform duration-1000" />
             <div className="relative z-10 text-center">
                <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center text-purple-400 mx-auto mb-6 shadow-lg border border-purple-500/20 animate-float">
                   <TrendingUp size={32} />
                </div>
                <h3 className="font-bold text-lg mb-2 text-white">Career Insights</h3>
                <p className="text-xs text-gray-500 font-medium leading-relaxed mb-8 text-left">
                   "Your skill distribution suggests you're ready for <span className="text-white font-black">Senior AI Engineer</span> roles. Unlock the 'Advanced LLMs' cert to qualify for top 1% positions."
                </p>
                <Button variant="outline" className="w-full py-4 rounded-xl text-[10px] font-black uppercase tracking-widest border-purple-500/30 text-purple-400 hover:bg-purple-600 hover:text-white transition-all flex items-center justify-center gap-2">
                   Explore Roadmaps <ChevronRight size={14} />
                </Button>
             </div>
          </GlassCard>
        </div>
      </div>
    </motion.div>
  );
};

export default Certificates;
