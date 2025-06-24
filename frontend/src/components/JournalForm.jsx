import { useState } from "react";
import { supabase } from "../supabaseClient";
import { toast } from "react-toastify";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";

const JournalForm = ({ user }) => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim()) {
      toast.error("Please write something before submitting.");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post("http://127.0.0.1:8000/analyze", {
        text: content,
      });

      const sentimentData = res.data;
      if (!sentimentData || !sentimentData.overall) {
        throw new Error("Invalid sentiment data received");
      }

      const sentimentLabel = sentimentData.overall.label;
      const sentimentScores = sentimentData.overall.average_scores;

      const response = await axios.post("http://127.0.0.1:8001/generate-insight", {
        text: content,
      });

      const summary = response.data.summary || "No insight generated";
      const suggestion = response.data.suggestion || "No suggestion provided";
      const affirmation = response.data.affirmation || "No affirmation provided";

      const { error } = await supabase.from("journal_entries").insert([
        {
          user_id: user.id,
          content,
          created_at: new Date().toISOString(),
          sentiment_label: sentimentLabel,
          sentiment_scores: sentimentScores,
          summary,
          suggestion,
          affirmation,
        },
      ]);

      if (error) throw error;

      toast.success("Journal submitted successfully!");
      setContent("");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while submitting.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 relative">
      {/* Loader Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
          <ClipLoader color="#8b5cf6" size={50} />
        </div>
      )}

      {/* Label */}
      <div>
        <label className="text-white font-semibold text-lg block mb-2">
          ✍️ Today's Reflection
        </label>
        <textarea
          rows="20"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Let your thoughts flow freely..."
          className="w-full bg-white/10 text-white border border-white/20 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-accent transition resize-none placeholder:text-white/60 disabled:opacity-50"
          disabled={loading}
        />
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading || content.trim().length === 0}
          className="bg-background text-primary border border-accent font-semibold px-6 py-2 rounded-lg hover:bg-accent hover:text-background transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          🚀 Submit Journal
        </button>
      </div>
    </form>
  );
};

export default JournalForm;
