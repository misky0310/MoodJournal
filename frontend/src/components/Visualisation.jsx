import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";



const COLORS = {
  positive: "#34D399",
  neutral: "#FBBF24",
  negative: "#F87171",
};

const getFormattedDateTime = (isoString) => {
  return new Date(isoString).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const aggregateBy = (entries, type) => {
  const grouped = {};

  for (const entry of entries) {
    const date = new Date(entry.created_at);
    let key;

    if (type === "daily") {
      key = date.toISOString().slice(0, 10); // YYYY-MM-DD
    } else if (type === "weekly") {
      const year = date.getFullYear();
      const week = Math.ceil(
        ((date - new Date(year, 0, 1)) / 86400000 +
          new Date(year, 0, 1).getDay() +
          1) /
          7
      );
      key = `${year}-W${week}`;
    } else if (type === "monthly") {
      key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}`;
    }

    if (!grouped[key]) {
      grouped[key] = { positive: 0, neutral: 0, negative: 0, count: 0 };
    }

    grouped[key].positive += entry.sentiment_scores.positive;
    grouped[key].neutral += entry.sentiment_scores.neutral;
    grouped[key].negative += entry.sentiment_scores.negative;
    grouped[key].count += 1;
  }

  return Object.entries(grouped).map(([key, value]) => ({
    period: key,
    positive: value.positive / value.count,
    neutral: value.neutral / value.count,
    negative: value.negative / value.count,
  }));
};

const Visualisation = ({ user }) => {
  const [entries, setEntries] = useState([]);
  const [tab, setTab] = useState("daily");

  useEffect(() => {
    const fetchSentimentData = async () => {
      const { data, error } = await supabase
        .from("journal_entries")
        .select("created_at, sentiment_scores, sentiment_label, affirmation, suggestion, summary")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

      if (!error) setEntries(data);
    };

    fetchSentimentData();
  }, [user]);

  const dailyData = entries.map((entry) => ({
    date: getFormattedDateTime(entry.created_at),
    positive: entry.sentiment_scores?.positive || 0,
    neutral: entry.sentiment_scores?.neutral || 0,
    negative: entry.sentiment_scores?.negative || 0,
  }));

  const moodCounts = entries.reduce(
    (acc, entry) => {
      acc[entry.sentiment_label] += 1;
      return acc;
    },
    { positive: 0, neutral: 0, negative: 0 }
  );

  const pieData = Object.entries(moodCounts).map(([label, value]) => ({
    name: label,
    value,
  }));

  const lineData =
    tab === "daily"
      ? dailyData
      : aggregateBy(entries, tab === "weekly" ? "weekly" : "monthly");

  return (
    <div className="space-y-10">
      {/* Tab Buttons */}
      <div className="flex gap-4 mb-4">
        {["daily", "weekly", "monthly"].map((option) => (
          <button
            key={option}
            onClick={() => setTab(option)}
            className={`px-4 py-2 rounded-md font-semibold transition ${
              tab === option
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </button>
        ))}
      </div>

      {/* Line Chart */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">
          Mood Trend ({tab.charAt(0).toUpperCase() + tab.slice(1)})
        </h3>
        {lineData.length === 0 ? (
          <p className="text-gray-500">No data available.</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={tab === "daily" ? "date" : "period"} />
              <YAxis domain={[0, 1]} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="positive"
                stroke={COLORS.positive}
              />
              <Line type="monotone" dataKey="neutral" stroke={COLORS.neutral} />
              <Line
                type="monotone"
                dataKey="negative"
                stroke={COLORS.negative}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Pie Chart */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">
          Overall Mood Distribution
        </h3>
        {entries.length === 0 ? (
          <p className="text-gray-500">No entries to display.</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {pieData.map((entry) => (
                  <Cell key={entry.name} fill={COLORS[entry.name]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default Visualisation;
