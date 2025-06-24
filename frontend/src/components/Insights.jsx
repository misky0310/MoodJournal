import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import InsightCard from "./InsightCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Insights = ({ user }) => {
  const [entries, setEntries] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right

  useEffect(() => {
    const fetchInsights = async () => {
      const { data, error } = await supabase
        .from("journal_entries")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

      if (!error) {
        const valid = data.filter(
          (e) => e.affirmation || e.summary || e.suggestion
        );
        setEntries(valid);
        if (valid.length) {
          const latest = valid[valid.length - 1];
          setSelectedDate(latest.created_at.split("T")[0]); // default date
        }
      }
    };

    fetchInsights();
  }, [user]);

  useEffect(() => {
    if (!selectedDate) return;

    const byDate = entries.filter((e) =>
      e.created_at.startsWith(selectedDate)
    );
    setFiltered(byDate);
    setCurrentIndex(0); // reset index on date change
  }, [selectedDate, entries]);

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) =>
      prev === 0 ? filtered.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) =>
      prev === filtered.length - 1 ? 0 : prev + 1
    );
  };

  const currentEntry = filtered[currentIndex];

  const variants = {
    enter: (dir) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir) => ({
      x: dir > 0 ? -300 : 300,
      opacity: 0,
    }),
  };

  return (
    <div className="space-y-6">
      {/* Header and Date Selector */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
      <h2 className="text-2xl font-bold text-accent">🧠 AI-Powered Insights</h2>
        <input
          type="date"
          className="bg-white/10 text-white border border-white/20 px-3 py-1 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-accent"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      {/* Carousel */}
      {filtered.length === 0 ? (
        <p className="text-gray-500 text-center mt-6">No insights found for this date.</p>
      ) : (
        <div className="relative flex items-center justify-center min-h-[360px]">
          {/* Left Button */}
          <button
            onClick={handlePrev}
            className="absolute hover:cursor-pointer left-0 p-2 bg-white/10 text-white border border-white/20 rounded-full shadow hover:bg-white/20 transition disabled:opacity-30"
            disabled={filtered.length <= 1}
          >
            <ChevronLeft />
          </button>

          {/* Animated Card */}
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={currentEntry.id}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4 }}
              className="absolute"
            >
              <InsightCard entry={currentEntry} />
            </motion.div>
          </AnimatePresence>

          {/* Right Button */}
          <button
            onClick={handleNext}
            className="absolute hover:cursor-pointer right-0 p-2 bg-white/10 text-white border border-white/20 rounded-full shadow hover:bg-white/20 transition disabled:opacity-30"
            disabled={filtered.length <= 1}
          >
            <ChevronRight />
          </button>
        </div>
      )}
    </div>
  );
};

export default Insights;
