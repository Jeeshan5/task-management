import React from 'react';
import AuthLayout from '../../components/layouts/AuthLayout';
import Input from '../../components/Inputs/Input';
import { useNavigate } from 'react-router-dom';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from '../../context/userContext';

const Login = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState(null);
  const { updateUser } = React.useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!password) {
      setError('Password cannot be empty.');
      return;
    }

    setError('');

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });

      const { token, role } = response?.data || {};

      console.log("✅ Login successful:", response?.data);

      if (token) {
        localStorage.setItem("token", token);
        updateUser(response.data);

        if (role === "admin") {
          navigate("/admin/dashboard");
        } else if (role === "member") {
          navigate("/user/dashboard");
        } else {
          console.warn("⚠️ Unknown role:", role);
          setError("Unauthorized role.");
        }
      } else {
        setError("No token received.");
      }
    } catch (error) {
      console.error("❌ Login error:", error.response?.data || error.message);
      setError(
        error.response?.data?.message || "Something went wrong. Please try again."
      );
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-md bg-white dark:bg-gray-900 px-4 sm:px-10 py-10 rounded-2xl shadow-2xl mx-auto animate-fade-in transition-all duration-300 ease-in-out mt-10 sm:mt-20">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-800 dark:text-white mb-3">
          Welcome Back!
        </h2>
        <p className="text-center text-sm sm:text-md text-gray-500 dark:text-gray-400 mb-8">
          Please enter your credentials to access your account.
        </p>

        <form onSubmit={handleLogin} className="space-y-6">
          <Input
            id="email"
            label="Email Address"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="you@example.com"
            required
            autoComplete="email"
          />

          <Input
            id="password"
            label="Password"
            type="password"
            value={password}
            onChange={setPassword}
            placeholder="••••••••"
            required
            autoComplete="current-password"
          />

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition transform hover:-translate-y-0.5 active:scale-95"
          >
            <span className="inline-flex items-center justify-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
              Log In
            </span>
          </button>

          <p className="text-sm text-center text-gray-600 dark:text-gray-400 mt-6">
            Don’t have an account?{' '}
            <a href="/signup" className="text-blue-600 hover:underline dark:text-blue-400">
              Sign up
            </a>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Login;
