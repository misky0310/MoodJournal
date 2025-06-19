import { useState } from "react";
import { supabase } from "../supabaseClient";
import { motion } from "framer-motion";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";

const JournalForm = ({ user }) => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast.warning("Please write something first.");
      return;
    }

    setLoading(true);
    const { error } = await supabase
      .from("journal_entries")
      .insert([
        { user_id: user.id, content},
      ]);

    if (error) {
      toast.error("Error submitting journal.");
    } else {
      toast.success("Journal saved successfully!");
      setContent("");
    }

    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative space-y-4"
    >
      {/* Spinner Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white/70 z-50 flex items-center justify-center">
          <ClipLoader size={60} color="#3b82f6" />
        </div>
      )}

      <div className="flex items-center gap-3 mb-2">
        <span className="text-3xl">🧘‍♀️</span>
        <h3 className="text-xl font-semibold text-gray-700 ">
          How are you feeling today?
        </h3>
      </div>

      <textarea
        className="w-full h-48 p-4 rounded-lg border border-gray-300  bg-white  text-gray-800  placeholder-gray-400  text-lg resize-none shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        placeholder="Let your thoughts flow here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={loading}
      />

      <motion.button
        onClick={handleSubmit}
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.03 }}
        className={`bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700  transition-all duration-200 ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={loading}
      >
        Save Entry
      </motion.button>
    </motion.div>
  );
};

export default JournalForm;
