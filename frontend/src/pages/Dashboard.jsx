import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import JournalForm from "../components/JournalForm";
import PastEntries from "../components/PastEntries";
import { AnimatePresence, motion } from "framer-motion";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [section, setSection] = useState("journal");
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

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
    { key: "journal", icon: "📝", label: "Journal Entry" },
    { key: "visualisation", icon: "📊", label: "Visualisation" },
    { key: "past", icon: "📂", label: "Past Entries" },
    { key: "profile", icon: "👤", label: "Profile" },
  ];

  const sidebarWidth = collapsed ? 80 : 240;

  return (
    <div className="h-screen w-screen overflow-hidden bg-gray-50 flex">
      {/* Sidebar - Fixed */}
      <motion.aside
        animate={{ width: sidebarWidth }}
        transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
        className="bg-white shadow-lg p-4 pt-6 overflow-hidden border-r border-gray-200 h-screen fixed left-0 top-0 z-20"
      >
        {/* Toggle Button */}
        <div className="flex justify-end mb-6">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-gray-500 hover:text-gray-700 text-lg font-bold"
            title="Toggle Sidebar"
          >
            {collapsed ? "➡️" : "⬅️"}
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex flex-col space-y-3 text-gray-700">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setSection(item.key)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                section === item.key
                  ? "bg-blue-100 text-blue-700 font-semibold"
                  : "hover:bg-gray-100"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </button>
          ))}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-100 rounded-lg mt-4"
          >
            <span className="text-xl">🚪</span>
            {!collapsed && <span>Logout</span>}
          </button>
        </nav>
      </motion.aside>

      {/* Main Content - Shifts based on sidebar */}
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
              className="bg-white p-6 rounded-lg shadow"
            >
              <h2 className="text-2xl font-semibold mb-4">
                Write Your Journal
              </h2>
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
              className="bg-white p-6 rounded-lg shadow"
            >
              <h2 className="text-2xl font-semibold mb-4">
                Mood Visualisation
              </h2>
              <p className="text-gray-600">
                Coming soon: sentiment graphs and mood charts.
              </p>
            </motion.div>
          )}

          {section === "past" && (
            <motion.div
              key="past"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="bg-white p-6 rounded-lg shadow"
            >
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">
                Past Journal Entries
              </h2>
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
              className="bg-white p-6 rounded-lg shadow"
            >
              <h2 className="text-2xl font-semibold mb-4">Your Profile</h2>
              <p>
                <strong>Email:</strong> {user?.email}
              </p>
              <p className="text-gray-600 mt-2">More settings coming soon.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Dashboard;
