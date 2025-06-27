import { useState, useRef } from "react";
import { supabase } from "../supabaseclient";
import { toast,ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ProfileSettings = ({ user, chartRef }) => {
  const [passwords, setPasswords] = useState({
    new: "",
    confirm: "",
  });
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const navigate = useNavigate();

  const handlePasswordChange = async () => {
    if (passwords.new !== passwords.confirm) {
      return toast.error("Passwords do not match.");
    }
    const { error } = await supabase.auth.updateUser({
      password: passwords.new,
    });
    if (error) toast.error(error.message);
    else toast.success("Password updated successfully!");
    setPasswords({ new: "", confirm: "" });
  };

  const handleExportData = async (format) => {
    const { data, error } = await supabase
      .from("journal_entries")
      .select("*")
      .eq("user_id", user.id);

    if (error) return toast.error("Failed to fetch entries.");
    if (!data || data.length === 0) return toast("No journal data to export.");

    const blob =
      format === "json"
        ? new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
        : new Blob([convertToCSV(data)], { type: "text/csv" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `journal_export.${format}`;
    link.click();
  };

  const convertToCSV = (data) => {
    const keys = Object.keys(data[0] || {});
    const csv = [
      keys.join(","),
      ...data.map((row) => keys.map((k) => JSON.stringify(row[k])).join(",")),
    ];
    return csv.join("\n");
  };


  return (
    <div className="bg-white/5 p-6 rounded-lg shadow border border-white/10 space-y-6">
      <h2 className="text-2xl font-semibold text-accent mb-4">Your Profile</h2>

      {/* Email */}
      <div>
        <p>
          <strong>Email:</strong> {user?.email}
        </p>
      </div>

      {/* Change Password */}
      <div>
        <h3 className="text-lg font-semibold mt-6 mb-2 text-white">🔒 Change Password</h3>
        <div className="flex flex-col gap-2">
          <input
            type="password"
            placeholder="New Password"
            value={passwords.new}
            onChange={(e) => setPasswords((p) => ({ ...p, new: e.target.value }))}
            className="bg-background border border-border text-white px-4 py-2 rounded"
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={passwords.confirm}
            onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))}
            className="bg-background border border-border text-white px-4 py-2 rounded"
          />
          <button
            onClick={handlePasswordChange}
            className="bg-primary text-background px-4 py-2 rounded font-semibold w-fit my-3"
          >
            Update Password
          </button>
        </div>
      </div>

      {/* Export Journal Data */}
      <div>
        <h3 className="text-lg font-semibold mt-6 mb-2 text-white">📄 Export Journal Data</h3>
        <div className="flex gap-4">
          <button
            onClick={() => handleExportData("json")}
            className="bg-background border border-border text-white px-4 py-2 rounded hover:bg-primary/20"
          >
            Download JSON
          </button>
          <button
            onClick={() => handleExportData("csv")}
            className="bg-background border border-border text-white px-4 py-2 rounded hover:bg-primary/20"
          >
            Download CSV
          </button>
        </div>
      </div>      
      <ToastContainer/>
    </div>
  );
};

export default ProfileSettings;
