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

      const response = await axios.post("http://127.0.0.1:8001/generate-insight",{
        text: content
      })

      const summary  = response.data.summary || "No insight generated";
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

      toast.success("Journal entry submitted successfully!");
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
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-60 flex items-center justify-center z-10">
          <ClipLoader color="#3B82F6" size={50} />
        </div>
      )}

      <textarea
        rows="8"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Let your thoughts flow here..."
        className="w-full border border-gray-300 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        disabled={loading}
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        Submit Journal
      </button>
    </form>
  );
};

export default JournalForm;
