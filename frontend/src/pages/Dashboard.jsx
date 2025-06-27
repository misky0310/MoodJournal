import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseclient";
import JournalForm from "../components/JournalForm";
import PastEntries from "../components/PastEntries";
import Visualisation from "../components/Visualisation";
import Insights from "../components/Insights";
import ProfileSettings from "../components/ProfileSettings";
import { AnimatePresence, motion } from "framer-motion";
import {
  PanelLeft,
  PanelRightClose,
  LogOut,
  LineChart,
  NotebookPen,
  FolderOpen,
  Search,
  User,
} from "lucide-react";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [section, setSection] = useState("journal");
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const chartRef = useRef(null); // 👈 For chart export

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) navigate("/login");
      else setUser(user);
    });
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const navItems = [
    { key: "journal", icon: <NotebookPen size={18} />, label: "Journal Entry" },
    { key: "visualisation", icon: <LineChart size={18} />, label: "Visualisation" },
    { key: "insights", icon: <Search size={18} />, label: "Insights" },
    { key: "past", icon: <FolderOpen size={18} />, label: "Past Entries" },
    { key: "profile", icon: <User size={18} />, label: "Profile" },
  ];

  const sidebarWidth = collapsed ? 80 : 240;

  return (
    <div className="h-screen w-screen overflow-hidden bg-background text-white flex">
      {/* Sidebar */}
      <motion.aside
        animate={{ width: sidebarWidth }}
        transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
        className="bg-white/5 backdrop-blur-sm border-r border-accent/20 shadow-lg p-4 pt-4 fixed top-0 left-0 h-screen z-20 text-white"
      >
        {/* Branding */}
        <div className="flex items-center justify-between mb-6 px-2">
          {!collapsed && (
            <h1 className="text-xl font-bold tracking-wide">Mood Journal</h1>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-accent hover:text-white transition"
            title="Toggle Sidebar"
          >
            {collapsed ? <PanelLeft size={22} /> : <PanelRightClose size={22} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col space-y-3 mt-2">
          {navItems.map((item) => (
            <div key={item.key} className="relative group">
              <button
                onClick={() => setSection(item.key)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg w-full transition-all ${
                  section === item.key
                    ? "bg-accent text-primary font-semibold"
                    : "hover:bg-white/10"
                }`}
                aria-label={item.label}
              >
                <span>{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
              </button>
              {collapsed && (
                <span className="absolute left-12 top-1/2 transform -translate-y-1/2 scale-95 bg-gray-800 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                  {item.label}
                </span>
              )}
            </div>
          ))}

          <div className="mt-6">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-all w-full"
              aria-label="Logout"
            >
              <LogOut size={18} />
              {!collapsed && <span>Logout</span>}
            </button>
          </div>
        </nav>
      </motion.aside>

      {/* Main Content */}
      <main
        style={{ marginLeft: `${sidebarWidth}px` }}
        className="flex-1 overflow-y-auto p-8 transition-all duration-300"
      >
        <AnimatePresence mode="wait">
          {section === "journal" && (
            <motion.div
              key="journal"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="bg-white/5 p-6 rounded-lg shadow border border-white/10"
            >
              <JournalForm user={user} />
            </motion.div>
          )}

          {section === "visualisation" && (
            <motion.div
              key="visualisation"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="bg-white/5 p-6 rounded-lg shadow border border-white/10"
            >
              <h2 className="text-2xl font-semibold mb-4 text-accent">
                Mood Visualisation
              </h2>
              <Visualisation user={user} chartRef={chartRef} />
            </motion.div>
          )}

          {section === "insights" && (
            <motion.div
              key="insights"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="bg-white/5 p-6 rounded-lg shadow border border-white/10"
            >
              <Insights user={user} />
            </motion.div>
          )}

          {section === "past" && (
            <motion.div
              key="past"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="bg-white/5 p-6 rounded-lg shadow border border-white/10"
            >
              <PastEntries user={user} />
            </motion.div>
          )}

          {section === "profile" && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="bg-white/5 p-6 rounded-lg shadow border border-white/10"
            >
              <ProfileSettings user={user} chartRef={chartRef} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Dashboard;
