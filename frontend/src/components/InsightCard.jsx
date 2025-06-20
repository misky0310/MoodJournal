const InsightCard = ({ entry }) => {
  const formattedDate = new Date(entry.created_at).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 w-[100vw] max-w-3xl shadow-md hover:shadow-lg mx-auto">
      {/* Timestamp */}
      <p className="text-sm text-gray-500 mb-3">{formattedDate}</p>

      <div className="space-y-5 text-sm">
        {/* Affirmation */}
        <div>
          <h4 className="text-green-700 font-semibold">Affirmation</h4>
          <p className="italic text-gray-800">"{entry.affirmation}"</p>
        </div>

        {/* Suggestion */}
        <div>
          <h4 className="text-yellow-600 font-semibold">Suggestion</h4>
          <p className="text-gray-700">{entry.suggestion}</p>
        </div>

        {/* Summary */}
        <div>
          <h4 className="text-blue-600 font-semibold">Summary</h4>
          <p className="text-gray-700">{entry.summary}</p>
        </div>
      </div>
    </div>
  );
};

export default InsightCard;
