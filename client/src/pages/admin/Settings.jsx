import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from 'framer-motion';
import { Layout, Save } from "lucide-react";

const GlassCard = ({ children, className = '', ...props }) => (
  <div className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl ${className}`} {...props}>
    {children}
  </div>
);

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const variants = {
    primary: 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500',
    secondary: 'bg-white/10 text-white hover:bg-white/20',
  };
  return (
    <button className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const Toggle = ({
  enabled,
  label,
  description,
  onClick,
}) => (
  <div
    onClick={onClick}
    className="flex items-center justify-between py-3 border-b border-white/5 last:border-0 cursor-pointer"
  >
    <div>
      <p className="text-sm font-medium text-white">
        {label}
      </p>

      {description && (
        <p className="text-[10px] text-gray-400">
          {description}
        </p>
      )}
    </div>

    <div
      className={`w-10 h-5 rounded-full relative transition-colors ${enabled
        ? "bg-indigo-500"
        : "bg-white/10"
        }`}
    >
      <div
        className={`w-3.5 h-3.5 bg-white rounded-full absolute top-0.5 transition-all ${enabled
          ? "left-[22px]"
          : "left-[2px]"
          }`}
      />
    </div>
  </div>
);

const InputGroup = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
}) => (
  <div className="space-y-1.5 mb-4">
    <label className="text-xs font-medium text-gray-400">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full bg-black/40 border border-white/10 rounded-xl py-2 px-4 text-sm outline-none focus:border-indigo-500/50 transition-colors"
    />
  </div>
);

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('platform');
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);


  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/admin/platform-settings",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSettings(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSaveSettings = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.patch(
        "http://localhost:5000/api/admin/platform-settings",
        settings,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Settings updated successfully");
    } catch (error) {
      console.error(error);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const tabs = [
    { id: 'platform', label: 'Platform Config', icon: Layout },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading Settings...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030014] text-white p-6 md:p-8 relative overflow-hidden">

      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full mix-blend-screen" />
      </div>

      <motion.div
        className="max-w-6xl mx-auto space-y-8 relative z-10"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">System Settings</h1>
            <p className="text-gray-400 mt-1">Configure platform rules, manage API keys, and tune AI subsystems.</p>
          </div>
          <Button
            variant="primary"
            className="flex items-center gap-2"
            onClick={handleSaveSettings}
          >
            <Save size={16} />
            Save Global Config
          </Button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">

          <div className="xl:col-span-1 space-y-2">
            <GlassCard className="p-3">
              <nav className="space-y-1">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm text-left ${activeTab === tab.id
                      ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
                      }`}
                  >
                    <tab.icon size={18} />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </GlassCard>
          </div>

          <div className="xl:col-span-3">
            <AnimatePresence mode="wait">
              {activeTab === 'platform' && (
                <motion.div key="platform" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <GlassCard className="p-6">
                    <h3 className="text-lg font-bold mb-6">General Platform Configuration</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <InputGroup
                        label="Platform Name"
                        value={settings?.platformName || ""}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            platformName: e.target.value,
                          })
                        }
                      />

                      <InputGroup
                        label="Support Email"
                        value={settings?.supportEmail || ""}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            supportEmail: e.target.value,
                          })
                        }
                      />

                      <InputGroup
                        label="Default Currency"
                        value={settings?.currency || ""}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            currency: e.target.value,
                          })
                        }
                      />

                      <InputGroup
                        label="Timezone"
                        value={settings?.timezone || ""}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            timezone: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="mt-6 pt-6 border-t border-white/10">
                      <h4 className="text-sm font-bold mb-4">
                        Features
                      </h4>

                      <Toggle
                        enabled={settings?.allowStudentRegistration}
                        label="Allow Student Registration"
                        description="Students can register on the platform."
                        onClick={() =>
                          setSettings({
                            ...settings,
                            allowStudentRegistration:
                              !settings.allowStudentRegistration,
                          })
                        }
                      />

                      <Toggle
                        enabled={settings?.allowTeacherRegistration}
                        label="Allow Teacher Registration"
                        description="Teachers can register on the platform."
                        onClick={() =>
                          setSettings({
                            ...settings,
                            allowTeacherRegistration:
                              !settings.allowTeacherRegistration,
                          })
                        }
                      />

                      <Toggle
                        enabled={settings?.maintenanceMode}
                        label="Maintenance Mode"
                        description="Disable platform access for non-admin users."
                        onClick={() =>
                          setSettings({
                            ...settings,
                            maintenanceMode:
                              !settings.maintenanceMode,
                          })
                        }
                      />
                    </div>
                  </GlassCard>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
export default AdminSettings;
