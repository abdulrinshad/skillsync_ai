import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Settings, Shield, Bell, CreditCard, Sparkles, CheckCircle, 
  Camera, Upload, Globe, Mail, Phone, MapPin, Briefcase, GraduationCap,
  Link as LinkIcon, Palette, Key, Smartphone, AlertCircle, DollarSign,
  Clock, LayoutTemplate, Star, Users, BookOpen, ChevronRight, Eye, Save
} from 'lucide-react';

// Mock UI components
const GlassCard = ({ children, className = '', ...props }) => (
  <div className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl ${className}`} {...props}>
    {children}
  </div>
);

const Button = ({ children, variant = 'primary', className = '', onClick, ...props }) => {
  const variants = {
    primary: 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-500 hover:to-blue-500',
    secondary: 'bg-white/10 text-white hover:bg-white/20',
    outline: 'border border-white/20 text-white hover:bg-white/10',
    gradient: 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white',
    danger: 'bg-red-500/20 text-red-500 hover:bg-red-500/30 border border-red-500/30'
  };
  return (
    <button onClick={onClick} className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const Badge = ({ children, color = 'blue', className = '' }) => {
  const colors = {
    blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    cyan: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    green: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    orange: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    red: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${colors[color]} flex items-center gap-1 w-fit ${className}`}>
      {children}
    </span>
  );
};

const Input = ({ label, icon: Icon, type = "text", placeholder, defaultValue, ...props }) => (
  <div className="space-y-1">
    <label className="text-xs font-medium text-gray-400">{label}</label>
    <div className="relative">
      {Icon && <Icon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />}
      <input 
        type={type} 
        placeholder={placeholder}
        defaultValue={defaultValue}
        className={`w-full bg-black/40 border border-white/10 rounded-xl py-2.5 text-sm outline-none focus:border-purple-500/50 transition-colors ${Icon ? 'pl-9 pr-4' : 'px-4'}`}
        {...props}
      />
    </div>
  </div>
);

const Toggle = ({ enabled, onChange, label, description }) => (
  <div className="flex items-center justify-between">
    <div>
      <p className="text-sm font-medium text-white">{label}</p>
      {description && <p className="text-xs text-gray-400">{description}</p>}
    </div>
    <button 
      onClick={() => onChange(!enabled)}
      className={`w-11 h-6 rounded-full transition-colors relative ${enabled ? 'bg-purple-500' : 'bg-white/10'}`}
    >
      <motion.div 
        layout
        className="w-4 h-4 bg-white rounded-full absolute top-1 shadow-sm"
        initial={false}
        animate={{ left: enabled ? '1.5rem' : '0.25rem' }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </button>
  </div>
);

const TeacherProfileSettings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [notifications, setNotifications] = useState({
    email: true,
    enrollment: true,
    reviews: true,
    liveClass: true,
    earnings: false,
    marketing: false
  });
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  const tabs = [
    { id: 'profile', label: 'Profile details', icon: User },
    { id: 'professional', label: 'Professional info', icon: Briefcase },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'payment', label: 'Payment settings', icon: CreditCard },
    { id: 'preferences', label: 'Teaching preferences', icon: LayoutTemplate },
  ];

  return (
    <motion.div 
      className="space-y-8 pb-20 text-white min-h-screen relative"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
        <div className="absolute top-[10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/20 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[120px] rounded-full mix-blend-screen" />
      </div>

      {/* 1. Page Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            Profile Settings
          </h1>
          <p className="text-gray-400 mt-2 max-w-2xl">
            Manage your instructor identity, payout preferences, and AI-powered teaching parameters.
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Eye size={16} /> Preview Public Profile
          </Button>
          <Button variant="primary" className="flex items-center gap-2 shadow-lg shadow-purple-500/20">
            <Save size={16} /> Save Changes
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Sidebar Navigation */}
        <div className="xl:col-span-3 space-y-4">
          <GlassCard className="p-4">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${
                    activeTab === tab.id 
                      ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' 
                      : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
                  }`}
                >
                  <tab.icon size={18} />
                  {tab.label}
                </button>
              ))}
            </nav>
          </GlassCard>

          {/* 11. AI Instructor Insights (Sidebar Widget) */}
          <GlassCard className="p-5 border-cyan-500/30 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl transition-all group-hover:bg-cyan-500/20" />
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={16} className="text-cyan-400" />
              <h3 className="font-bold text-sm">AI Profile Insights</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-400">Profile Strength</span>
                  <span className="text-xs font-bold text-emerald-400">85%</span>
                </div>
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full w-[85%] bg-gradient-to-r from-emerald-500 to-cyan-400" />
                </div>
              </div>
              
              <div className="bg-black/40 border border-white/5 p-3 rounded-xl space-y-2">
                <p className="text-xs text-gray-300 leading-relaxed">
                  Adding an introductory video can increase your course enrollment conversion rate by up to 24%.
                </p>
                <button className="text-[10px] font-bold text-cyan-400 hover:underline">Add Video Intro</button>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Main Content Area */}
        <div className="xl:col-span-9 space-y-6">
          <AnimatePresence mode="wait">
            
            {activeTab === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* 2 & 6. Instructor Profile Card & Customization */}
                <GlassCard className="p-0 overflow-hidden relative">
                  {/* Cover Image */}
                  <div className="h-48 bg-gradient-to-r from-purple-600 to-cyan-600 relative group">
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                    <button className="absolute top-4 right-4 bg-black/40 backdrop-blur-md border border-white/20 text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera size={14} /> Update Cover
                    </button>
                  </div>
                  
                  <div className="px-6 pb-6 lg:px-10 lg:pb-10 relative">
                    {/* Avatar */}
                    <div className="relative -mt-16 mb-4 w-fit group">
                      <div className="w-32 h-32 rounded-2xl bg-black border-4 border-gray-900 overflow-hidden relative z-10">
                        <img src="https://i.pravatar.cc/300?u=a042581f4e29026704d" alt="Profile" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                          <Upload size={24} className="text-white" />
                        </div>
                      </div>
                      <div className="absolute -bottom-2 -right-2 z-20">
                        <Badge color="green" className="!px-1.5 !py-1.5 bg-gray-900">
                          <CheckCircle size={14} className="fill-emerald-500 text-gray-900" />
                        </Badge>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <h2 className="text-2xl font-bold">Dr. Sarah Chen</h2>
                        <p className="text-cyan-400 font-medium text-sm">Lead AI & Machine Learning Instructor</p>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <div className="flex items-center gap-1 text-lg font-bold"><Star size={16} className="fill-yellow-400 text-yellow-400" /> 4.9</div>
                          <p className="text-[10px] text-gray-400 uppercase tracking-wider">Rating</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center gap-1 text-lg font-bold"><Users size={16} className="text-blue-400" /> 24.5k</div>
                          <p className="text-[10px] text-gray-400 uppercase tracking-wider">Students</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center gap-1 text-lg font-bold"><BookOpen size={16} className="text-purple-400" /> 12</div>
                          <p className="text-[10px] text-gray-400 uppercase tracking-wider">Courses</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </GlassCard>

                {/* 3. Personal Information */}
                <GlassCard className="p-6">
                  <h3 className="text-lg font-bold mb-6">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input label="First Name" defaultValue="Sarah" />
                    <Input label="Last Name" defaultValue="Chen" />
                    <Input label="Email Address" icon={Mail} type="email" defaultValue="sarah.chen@example.com" />
                    <Input label="Phone Number" icon={Phone} defaultValue="+1 (555) 123-4567" />
                    <Input label="Country" icon={Globe} defaultValue="United States" />
                    <Input label="Time Zone" icon={Clock} defaultValue="Pacific Time (PT)" />
                    <div className="md:col-span-2">
                      <Input label="Professional Headline" defaultValue="Senior AI Researcher & Lead Educator" />
                    </div>
                  </div>
                </GlassCard>

                {/* 4. Instructor Bio Section */}
                <GlassCard className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold">Instructor Bio</h3>
                    <span className="text-xs text-gray-400">452 / 1000</span>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-black/40 border border-white/10 rounded-xl overflow-hidden focus-within:border-purple-500/50 transition-colors">
                      <div className="flex items-center gap-2 px-3 py-2 border-b border-white/10 bg-white/5">
                        <button className="p-1 hover:bg-white/10 rounded"><span className="font-bold">B</span></button>
                        <button className="p-1 hover:bg-white/10 rounded"><span className="italic">I</span></button>
                        <button className="p-1 hover:bg-white/10 rounded"><span className="underline">U</span></button>
                        <div className="w-px h-4 bg-white/10 mx-1" />
                        <button className="p-1 hover:bg-white/10 rounded"><LinkIcon size={14} /></button>
                      </div>
                      <textarea 
                        className="w-full h-40 bg-transparent p-4 text-sm outline-none resize-none text-gray-300"
                        defaultValue="I am an AI researcher and educator with over 10 years of experience in developing machine learning models and teaching complex technical concepts to global audiences. My passion lies in making deep learning accessible and actionable for aspiring engineers."
                      />
                    </div>
                    
                    <div>
                      <label className="text-xs font-medium text-gray-400 block mb-2">Skills & Expertise Tags</label>
                      <div className="flex flex-wrap gap-2">
                        {['Machine Learning', 'Python', 'Neural Networks', 'TensorFlow', 'Data Science'].map(skill => (
                          <span key={skill} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs flex items-center gap-2">
                            {skill} <button className="text-gray-500 hover:text-white">&times;</button>
                          </span>
                        ))}
                        <button className="px-3 py-1 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-lg text-xs flex items-center gap-1 hover:bg-purple-500/30 transition-colors">
                          + Add Skill
                        </button>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            )}

            {activeTab === 'professional' && (
              <motion.div
                key="professional"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* 5. Professional Details */}
                <GlassCard className="p-6">
                  <h3 className="text-lg font-bold mb-6">Experience & Education</h3>
                  
                  <div className="space-y-8">
                    <div>
                      <h4 className="text-sm font-bold text-gray-300 mb-4 flex items-center gap-2"><Briefcase size={16} /> Work Experience</h4>
                      <div className="space-y-4">
                        <div className="bg-black/40 border border-white/5 rounded-xl p-4 flex gap-4">
                          <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center shrink-0">
                            <Briefcase size={18} className="text-blue-400" />
                          </div>
                          <div className="flex-1">
                            <h5 className="font-bold">Senior AI Research Scientist</h5>
                            <p className="text-sm text-cyan-400">Google Brain</p>
                            <p className="text-xs text-gray-400 mt-1">2018 - Present • 8 yrs</p>
                          </div>
                          <button className="text-gray-500 hover:text-white"><Settings size={16} /></button>
                        </div>
                        <Button variant="outline" className="w-full py-3 text-xs border-dashed">
                          + Add Experience
                        </Button>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-gray-300 mb-4 flex items-center gap-2"><GraduationCap size={16} /> Education</h4>
                      <div className="bg-black/40 border border-white/5 rounded-xl p-4 flex gap-4">
                        <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center shrink-0">
                          <GraduationCap size={18} className="text-purple-400" />
                        </div>
                        <div className="flex-1">
                          <h5 className="font-bold">Ph.D. in Computer Science</h5>
                          <p className="text-sm text-purple-400">Stanford University</p>
                          <p className="text-xs text-gray-400 mt-1">2014 - 2018</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </GlassCard>

                <GlassCard className="p-6">
                  <h3 className="text-lg font-bold mb-6">Social & Links</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input label="LinkedIn Profile" icon={LinkIcon} defaultValue="linkedin.com/in/sarahchen" />
                    <Input label="Personal Website" icon={Globe} defaultValue="sarahchen.ai" />
                    <Input label="Twitter / X" icon={LinkIcon} defaultValue="@sarahchen_ai" />
                    <Input label="GitHub" icon={LinkIcon} defaultValue="github.com/schen" />
                  </div>
                </GlassCard>
              </motion.div>
            )}

            {activeTab === 'security' && (
              <motion.div
                key="security"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* 7. Account Security */}
                <GlassCard className="p-6">
                  <div className="flex items-center gap-3 mb-6 pb-6 border-b border-white/10">
                    <div className="p-3 bg-purple-500/20 text-purple-400 rounded-xl">
                      <Key size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">Password & Authentication</h3>
                      <p className="text-sm text-gray-400">Keep your instructor account secure</p>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input label="Current Password" type="password" placeholder="••••••••" />
                      <div className="hidden md:block" />
                      <Input label="New Password" type="password" placeholder="••••••••" />
                      <Input label="Confirm New Password" type="password" placeholder="••••••••" />
                    </div>
                    <Button variant="primary">Update Password</Button>
                  </div>
                </GlassCard>

                <GlassCard className="p-6">
                  <h3 className="text-lg font-bold mb-6">Security Settings</h3>
                  <div className="space-y-6">
                    <Toggle 
                      label="Two-Factor Authentication (2FA)" 
                      description="Add an extra layer of security requiring a code from your mobile device."
                      enabled={true} 
                      onChange={() => {}} 
                    />
                    <div className="h-px bg-white/10 w-full" />
                    <div>
                      <h4 className="text-sm font-bold mb-4">Connected Devices</h4>
                      <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Smartphone className="text-gray-400" size={20} />
                          <div>
                            <p className="text-sm font-bold">MacBook Pro (Mac OS)</p>
                            <p className="text-xs text-gray-400">San Francisco, CA • Active now</p>
                          </div>
                        </div>
                        <Badge color="green">Current</Badge>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            )}

            {activeTab === 'notifications' && (
              <motion.div
                key="notifications"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* 8. Notification Preferences */}
                <GlassCard className="p-6">
                  <h3 className="text-lg font-bold mb-6">Email Notifications</h3>
                  <div className="space-y-6">
                    <Toggle 
                      label="Student Enrollments" 
                      description="Get notified when a new student purchases your course."
                      enabled={notifications.enrollment} 
                      onChange={(val) => setNotifications({...notifications, enrollment: val})} 
                    />
                    <Toggle 
                      label="Course Reviews" 
                      description="Receive alerts for new ratings and reviews."
                      enabled={notifications.reviews} 
                      onChange={(val) => setNotifications({...notifications, reviews: val})} 
                    />
                    <Toggle 
                      label="Live Class Reminders" 
                      description="Get reminded 30 mins before your scheduled live sessions."
                      enabled={notifications.liveClass} 
                      onChange={(val) => setNotifications({...notifications, liveClass: val})} 
                    />
                    <Toggle 
                      label="Weekly Earnings Report" 
                      description="Receive a summary of your revenue and sales performance."
                      enabled={notifications.earnings} 
                      onChange={(val) => setNotifications({...notifications, earnings: val})} 
                    />
                    <Toggle 
                      label="SkillSync Marketing & Tips" 
                      description="Get platform updates and tips to grow your teaching business."
                      enabled={notifications.marketing} 
                      onChange={(val) => setNotifications({...notifications, marketing: val})} 
                    />
                  </div>
                </GlassCard>
              </motion.div>
            )}

            {activeTab === 'payment' && (
              <motion.div
                key="payment"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* 9. Payment & Payout Settings */}
                <GlassCard className="p-6 bg-gradient-to-br from-white/5 to-purple-500/5 border-purple-500/20">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-lg font-bold flex items-center gap-2">
                        <CreditCard className="text-purple-400" /> Payout Methods
                      </h3>
                      <p className="text-sm text-gray-400 mt-1">Manage how you receive your earnings</p>
                    </div>
                    <Badge color="green">Active Setup</Badge>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-black/40 border border-purple-500/30 rounded-xl p-4 flex items-center justify-between relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-2xl" />
                      <div className="flex items-center gap-4 relative z-10">
                        <div className="w-12 h-8 bg-white rounded border border-gray-200 flex items-center justify-center shrink-0">
                          {/* Stripe Logo placeholder */}
                          <span className="text-[#635BFF] font-bold text-xs italic tracking-tighter">stripe</span>
                        </div>
                        <div>
                          <p className="font-bold text-sm">Stripe Connect (Default)</p>
                          <p className="text-xs text-gray-400">Connected to •••• 4242</p>
                        </div>
                      </div>
                      <Button variant="secondary" className="text-xs py-1.5 px-3 z-10">Manage</Button>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-8 bg-[#00457C] rounded flex items-center justify-center shrink-0">
                          <span className="text-white font-bold text-[10px] italic">PayPal</span>
                        </div>
                        <div>
                          <p className="font-bold text-sm text-gray-300">PayPal</p>
                          <p className="text-xs text-gray-500">Not connected</p>
                        </div>
                      </div>
                      <Button variant="outline" className="text-xs py-1.5 px-3">Connect</Button>
                    </div>
                  </div>
                </GlassCard>
                
                <GlassCard className="p-6">
                  <h3 className="text-lg font-bold mb-4">Tax Information</h3>
                  <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 flex gap-3">
                    <AlertCircle className="text-orange-400 shrink-0" size={20} />
                    <div>
                      <h4 className="font-bold text-sm text-orange-400">W-9 Form Required</h4>
                      <p className="text-xs text-gray-300 mt-1">Please complete your tax documentation to prevent payout delays at the end of the year.</p>
                      <button className="text-xs font-bold text-orange-400 mt-2 hover:underline">Submit Tax Form</button>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            )}

            {activeTab === 'preferences' && (
              <motion.div
                key="preferences"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* 10. Teaching Preferences */}
                <GlassCard className="p-6">
                  <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/10">
                    <LayoutTemplate className="text-cyan-400" />
                    <h3 className="text-lg font-bold">Classroom Preferences</h3>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="text-sm font-medium text-gray-300 mb-3 block">Default Course Categories</label>
                      <div className="flex flex-wrap gap-2">
                        {['Technology', 'Programming', 'Business', 'Design', 'Marketing', 'AI'].map(cat => (
                          <button key={cat} className={`px-4 py-2 rounded-lg text-xs font-medium border transition-all ${['Technology', 'Programming', 'AI'].includes(cat) ? 'bg-cyan-500/20 border-cyan-500/30 text-cyan-400' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}>
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                       <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-400">Available Teaching Hours</label>
                        <select className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 px-4 text-sm outline-none focus:border-cyan-500/50">
                          <option>Part-time (10-20 hrs/week)</option>
                          <option>Full-time (40+ hrs/week)</option>
                          <option>Occasional</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-400">Preferred Live Class Duration</label>
                        <select className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 px-4 text-sm outline-none focus:border-cyan-500/50">
                          <option>60 Minutes</option>
                          <option>90 Minutes</option>
                          <option>2 Hours</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </GlassCard>

                <GlassCard className="p-6 border-purple-500/30 relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl" />
                   <h3 className="text-lg font-bold mb-4 flex items-center gap-2 relative z-10">
                    <Sparkles className="text-purple-400" /> AI Assistant Settings
                  </h3>
                  <div className="space-y-4 relative z-10">
                    <Toggle 
                      label="Auto-Grade Quizzes" 
                      description="Allow AI to automatically grade objective questions and provide feedback."
                      enabled={true} 
                      onChange={() => {}} 
                    />
                    <Toggle 
                      label="Smart Student Interventions" 
                      description="AI will notify you when a student is falling behind."
                      enabled={true} 
                      onChange={() => {}} 
                    />
                    <Toggle 
                      label="Auto-Generated Certificates" 
                      description="Automatically issue branded certificates upon course completion."
                      enabled={false} 
                      onChange={() => {}} 
                    />
                  </div>
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default TeacherProfileSettings;
