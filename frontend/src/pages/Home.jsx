import { useEffect, useState } from "react";
import { supabase } from "../supabaseclient";
import { Link } from "react-router-dom";
import JournalForm from "../components/JournalForm";
import { motion } from "framer-motion";

const features = [
  {
    emoji: "📝",
    title: "Daily Journaling",
    desc: "Express your thoughts and emotions daily in a private, distraction-free space.",
  },
  {
    emoji: "📊",
    title: "Mood Visuals",
    desc: "AI-powered charts and sentiment insights to track your well-being.",
  },
  {
    emoji: "🔒",
    title: "Private & Secure",
    desc: "Your journals are stored securely in Supabase. Only you can access them.",
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
    },
  }),
};

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
    <div className="min-h-screen bg-background text-text font-sans">
      <div className="max-w-5xl mx-auto px-4 py-16">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 text-primary">
            🌿 MindScope
          </h1>
          <p className="text-2xl max-w-2xl mx-auto text-text/90">
            Your private space to journal, reflect daily, understand your emotions, and gain AI-generated insights to
            support your mental well-being. Built with ❤️ & intelligent agents.
          </p>
        </motion.div>

        {!user ? (
          <>
            {/* Call-to-Actions */}
            <motion.div
              className="flex flex-col md:flex-row justify-center gap-6 mb-12"
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              custom={1}
            >
              <Link
                to="/signup"
                className="bg-primary text-background px-8 py-3 rounded-full text-lg font-bold shadow hover:scale-105 hover:bg-background hover:text-primary hover:border hover:border-primary transition-transform"
              >
                🚀 Get Started
              </Link>
              <Link
                to="/login"
                className="border border-primary text-primary px-8 py-3 rounded-full text-lg font-bold hover:bg-primary hover:text-background transition"
              >
                🔑 Already have an account?
              </Link>
            </motion.div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="bg-card backdrop-blur-md p-6 rounded-lg shadow-md border border-border hover:scale-[1.03] transition duration-300"
                  initial="hidden"
                  animate="visible"
                  variants={fadeInUp}
                  custom={index + 2}
                >
                  <h3 className="text-3xl mb-2">{feature.emoji}</h3>
                  <h4 className="text-xl font-semibold text-primary mb-1">
                    {feature.title}
                  </h4>
                  <p className="text-sm text-muted">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </>
        ) : (
          <>
            {/* Logged-in Section */}
            <motion.div
              className="mb-4 flex justify-between items-center"
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              custom={1}
            >
              <p className="text-md">
                Hello, <span className="font-bold">{user.email}</span>
              </p>
              <button
                onClick={handleLogout}
                className="text-red-400 underline text-sm hover:text-red-300 transition"
              >
                Logout
              </button>
            </motion.div>

            <motion.div
              className="mt-6 bg-card backdrop-blur-lg p-6 rounded-lg shadow-lg"
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              custom={2}
            >
              <h2 className="text-2xl font-semibold mb-2 text-primary">
                How are you feeling today?
              </h2>
              <JournalForm user={user} />
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
