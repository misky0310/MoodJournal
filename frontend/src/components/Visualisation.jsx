import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import ReactECharts from "echarts-for-react";

const COLORS = {
  positive: "#34D399",
  neutral: "#FBBF24",
  negative: "#F87171",
};


  const getFormattedDateTime = (isoString) => {
    const utcDate = new Date(isoString + 'Z'); // force UTC parsing
    const localIST =  utcDate.toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'medium',
      timeStyle: 'short',
    });
    return localIST;

  };

const aggregateBy = (entries, type) => {
  const grouped = {};

  for (const entry of entries) {
    const date = new Date(entry.created_at);
    let key;

    if (type === "daily") {
      key = date.toISOString().slice(0, 10);
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
      key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
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

  const getLineOption = () => ({
    tooltip: {
      trigger: "axis",
    },
    legend: {
      top: 0,
      textStyle: {
        color: "#ffffff",
      },
      inactiveColor: "#999999",
      data: ["positive", "neutral", "negative"],
    },
    grid: {
      top: 30,
      left: 40,
      right: 20,
      bottom: 80,
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: lineData.map((d) => (tab === "daily" ? d.date : d.period)),
      axisLabel: { color: "#aaa" },
      axisLine: { lineStyle: { color: "#888" } },
    },
    yAxis: {
      type: "value",
      min: 0,
      max: 1,
      axisLabel: { color: "#aaa" },
      axisLine: { lineStyle: { color: "#888" } },
    },
    dataZoom: [
      {
        type: "slider",
        start: 0,
        end: 100,
        bottom: 10,
      },
    ],
    series: [
      {
        name: "positive",
        type: "line",
        smooth: true,
        data: lineData.map((d) => d.positive),
        itemStyle: { color: COLORS.positive },
      },
      {
        name: "neutral",
        type: "line",
        smooth: true,
        data: lineData.map((d) => d.neutral),
        itemStyle: { color: COLORS.neutral },
      },
      {
        name: "negative",
        type: "line",
        smooth: true,
        data: lineData.map((d) => d.negative),
        itemStyle: { color: COLORS.negative },
      },
    ],
  });

  const getPieOption = () => ({
    tooltip: {
      trigger: "item",
      formatter: "{b}: {c} entries ({d}%)",
    },
    legend: {
      orient: "horizontal",
      bottom: 0,
      textStyle: {
        color: "#ffffff",
      },
    },
    series: [
      {
        name: "Mood",
        type: "pie",
        radius: ["40%","80%"],
        avoidLabelOverlap: false,
        label: {
          show: true,
          position: "outside",
          formatter: "{b}: {d}%",
          color: "#ddd",
        },
        labelLine: {
          show: true,
          lineStyle: {
            color: "#888",
          },
        },
        data: pieData.map((d) => ({
          value: d.value,
          name: d.name.charAt(0).toUpperCase() + d.name.slice(1),
          itemStyle: { color: COLORS[d.name] },
        })),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  });
  
  return (
    <div className="space-y-10">
      {/* Tabs */}
      <div className="flex gap-4 mb-4">
        {["daily", "weekly", "monthly"].map((option) => (
          <button
            key={option}
            onClick={() => setTab(option)}
            className={`px-4 py-2 rounded-md font-semibold transition ${
              tab === option
                ? "bg-primary text-background"
                : "bg-background border border-border text-text hover:bg-primary/20"
            }`}
          >
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </button>
        ))}
      </div>

      {/* Line Chart */}
      <div className="bg-background border border-border p-6 rounded-lg shadow">
        <h3 className="text-xl font-bold mb-4 text-primary flex items-center gap-2">
          Mood Trend ({tab.charAt(0).toUpperCase() + tab.slice(1)})
        </h3>

        {lineData.length === 0 ? (
          <p className="text-text/70">No data available.</p>
        ) : (
          <>
            <ReactECharts option={getLineOption()} style={{ height: 400 }} />
            <p className="text-sm text-gray-400 text-center mt-2">
              Drag the slider above to explore specific date ranges
            </p>
          </>
        )}
      </div>

      {/* Pie Chart */}
      <div className="bg-background border border-border p-6 rounded-lg shadow">
        <h3 className="text-xl font-bold mb-4 text-primary">Overall Mood Distribution</h3>

        {entries.length === 0 ? (
          <p className="text-text/70">No entries to display.</p>
        ) : (
          <ReactECharts option={getPieOption()} style={{ height: 400 }} />
        )}
      </div>
    </div>
  );
};

export default Visualisation;
