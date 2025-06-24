import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { ClipLoader } from "react-spinners";

const CHARACTER_LIMIT = 200;

const PastEntries = ({ user }) => {
  const [entries, setEntries] = useState([]);
  const [expandedIds, setExpandedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    const fetchEntries = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("journal_entries")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!error) setEntries(data);
      setLoading(false);
    };

    if (user?.id) fetchEntries();
  }, [user]);

  const toggleExpand = (id) => {
    setExpandedIds((prev) => {
      const copy = new Set(prev);
      copy.has(id) ? copy.delete(id) : copy.add(id);
      return copy;
    });
  };

  const formatDate = (iso) => {
    const date = new Date(iso);
    return date.toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const filteredEntries = selectedDate
    ? entries.filter((e) => e.created_at.startsWith(selectedDate))
    : entries;

  return (
    <div className="space-y-6 text-white">
      {/* Filter by Date */}
      <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
        <h2 className="text-2xl font-bold text-accent">📂 Past Journal Entries</h2>
        <input
          type="date"
          className="bg-white/10 text-white border border-white/20 px-3 py-1 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-accent"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      {/* Loading Spinner */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <ClipLoader size={48} color="#a78bfa" />
        </div>
      ) : filteredEntries.length === 0 ? (
        <p className="text-white/70">No journal entries found.</p>
      ) : (
        filteredEntries.map((entry) => {
          const isExpanded = expandedIds.has(entry.id);
          const truncated =
            entry.content.length > CHARACTER_LIMIT
              ? entry.content.slice(0, CHARACTER_LIMIT) + "..."
              : entry.content;

          return (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              layout
              className="bg-white/5 border border-white/10 rounded-lg p-5 shadow hover:shadow-lg transition"
            >
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm text-white/60">{formatDate(entry.created_at)}</p>
                {entry.content.length > CHARACTER_LIMIT && (
                  <button
                    onClick={() => toggleExpand(entry.id)}
                    className="text-white/60 hover:text-accent transition"
                    title={isExpanded ? "Collapse" : "Expand"}
                  >
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                )}
              </div>

              <AnimatePresence initial={false}>
                <motion.p
                  key={isExpanded ? "full" : "truncated"}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-white whitespace-pre-line text-sm"
                >
                  {isExpanded ? entry.content : truncated}
                </motion.p>
              </AnimatePresence>
            </motion.div>
          );
        })
      )}
    </div>
  );
};

export default PastEntries;
