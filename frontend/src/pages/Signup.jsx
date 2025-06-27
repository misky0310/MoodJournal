import { useState } from "react";
import { supabase } from "../supabaseclient";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
    },
  }),
};

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      toast.error(error.message, {
        position: "top-right",
        autoClose: 5000,
      });
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-text px-4">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="bg-card text-text w-full max-w-md p-8 rounded-xl shadow-xl border border-border"
      >
        <motion.h2
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="text-3xl font-bold text-center mb-6 text-primary"
        >
          Create Your Account
        </motion.h2>

        {message && (
          <motion.div
            className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-400 text-red-300 text-sm font-medium text-center"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            custom={0.5}
          >
            {message}
          </motion.div>
        )}

        <form onSubmit={handleSignup} className="space-y-5">
          <motion.input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 bg-background text-text border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary/70"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            custom={1}
          />
          <motion.input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 bg-background text-text border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary/70"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            custom={2}
          />

          <motion.button
            type="submit"
            className="w-full py-3 bg-primary text-background font-bold rounded hover:bg-accent transition"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            custom={3}
          >
            Sign Up
          </motion.button>

          <motion.p
            className="text-sm text-center mt-4 text-muted"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            custom={4}
          >
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Login here
            </Link>
          </motion.p>
        </form>
      </motion.div>
      <ToastContainer/>
    </div>
  );
};

export default Signup;
