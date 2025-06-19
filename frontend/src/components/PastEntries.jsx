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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <ClipLoader size={48} color="#3b82f6" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {entries.length === 0 ? (
        <p className="text-gray-500 ">No entries yet.</p>
      ) : (
        entries.map((entry) => {
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
              className="bg-white  border border-gray-200  rounded-lg p-5 shadow-sm"
            >
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm text-gray-500 ">
                  {formatDate(entry.created_at)}
                </p>
                {entry.content.length > CHARACTER_LIMIT && (
                  <button
                    onClick={() => toggleExpand(entry.id)}
                    className="text-gray-600  hover:text-blue-500 transition"
                    title={isExpanded ? "Collapse" : "Expand"}
                  >
                    {isExpanded ? (
                      <ChevronUp size={18} />
                    ) : (
                      <ChevronDown size={18} />
                    )}
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
                  className="text-gray-800  whitespace-pre-line"
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
