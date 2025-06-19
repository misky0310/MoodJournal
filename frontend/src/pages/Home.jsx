import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';
import JournalForm from '../components/JournalForm';

const Home = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 text-gray-800">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-6">
          🌿 Mood Journal App
        </h1>
        <p className="text-lg text-center mb-8">
          Write your thoughts, track your emotional well-being, and gain personalized insights. Built with AI + ❤️
        </p>

        {!user ? (
          <>
            <div className="text-center">
              <Link
                to="/signup"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
              >
                Get Started — Sign Up
              </Link>
            </div>

            <div className="text-center mt-10">
              <Link
                to="/login"
                className="bg-cyan-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-cyan-700 transition"
              >
                Already have an account? Login
              </Link>
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
                <h3 className="text-xl font-bold">📝 Daily Journaling</h3>
                <p className="mt-2 text-sm">Write your emotions freely each day in a distraction-free environment.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
                <h3 className="text-xl font-bold">📊 Sentiment Insights</h3>
                <p className="mt-2 text-sm">Visualize your mood trends and mental health progress over time.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
                <h3 className="text-xl font-bold">🔒 Private & Secure</h3>
                <p className="mt-2 text-sm">Your data is stored securely with Supabase. Only you can access your journals.</p>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="mb-4 flex justify-between items-center">
              <p className="text-md">Hello, <span className="font-bold">{user.email}</span></p>
              <button
                onClick={handleLogout}
                className="text-red-500 underline text-sm hover:text-red-700"
              >
                Logout
              </button>
            </div>

            <div className="mt-4 bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold mb-2">How are you feeling today?</h2>
              <JournalForm user={user} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
