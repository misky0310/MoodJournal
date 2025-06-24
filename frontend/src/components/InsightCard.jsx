const InsightCard = ({ entry }) => {
  const formattedDate = new Date(entry.created_at).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="bg-white/10 border border-white/20 rounded-xl p-6 w-[100vw] max-w-3xl shadow-lg hover:shadow-xl transition mx-auto text-white">
      {/* Timestamp */}
      <p className="text-sm text-white/60 mb-4">{formattedDate}</p>

      <div className="space-y-5 text-sm">
        {/* Affirmation */}
        <div>
          <h4 className="text-green-400 font-semibold">🌟 Affirmation</h4>
          <p className="italic text-white/90">"{entry.affirmation}"</p>
        </div>

        {/* Suggestion */}
        <div>
          <h4 className="text-yellow-400 font-semibold">💡 Suggestion</h4>
          <p className="text-white/90">{entry.suggestion}</p>
        </div>

        {/* Summary */}
        <div>
          <h4 className="text-blue-400 font-semibold">📌 Summary</h4>
          <p className="text-white/90">{entry.summary}</p>
        </div>
      </div>
    </div>
  );
};

export default InsightCard;
