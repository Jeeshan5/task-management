import React, { useContext } from 'react';
import AuthLayout from '../../components/layouts/AuthLayout';
import Input from '../../components/Inputs/Input';
import ProfilePhotoSelector from '../../components/Inputs/ProfilePhotoSelector';
import { validateEmail } from '../../utils/helper';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from '../../context/userContext';
import uploadImage from '../../utils/uploadImages';

const SignUp = () => {
  const [fullname, setFullname] = React.useState('');
  const [profilePic, setProfilePic] = React.useState(null);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [adminInviteToken, setAdminInviteToken] = React.useState('');
  const [error, setError] = React.useState(null);

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    let profileImageUrl = '';

    if (!fullname || !email || !password) {
      setError('Please fill all required fields.');
      return;
    }

    if (!validateEmail(email)) {
      setError('Invalid email format.');
      return;
    }

    setError('');

    try {
      if (profilePic) {
        const imgUploadRes = await uploadImage(profilePic);
        profileImageUrl = imgUploadRes.imageUrl || '';
      }

      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name: fullname,
        email,
        password,
        profileImageUrl,
        adminInviteToken,
      });

      const { token, role } = response.data;

      if (token) {
        localStorage.setItem('token', token);
        updateUser(response.data);

        if (role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/user/dashboard');
        }
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('Something went wrong. Please try again.');
      }
    }
  };

  return (
    <AuthLayout>
      <div className="w-full px-4 sm:px-6 md:px-8 max-w-xl mx-auto mt-10 sm:mt-16">
        <div className="bg-white dark:bg-gray-900 p-6 sm:p-10 rounded-2xl shadow-2xl transition-all duration-300 ease-in-out">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-1 text-center">
            Create an Account
          </h2>
          <p className="text-sm sm:text-md text-gray-500 dark:text-gray-400 mb-6 text-center">
            Join us today by entering your details below.
          </p>

          <form onSubmit={handleSignUp} className="space-y-5">
            {/* Profile Photo Icon */}
            <div className="flex justify-center">
              <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />
            </div>

            {/* Grid for Full Name + Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                id="fullname"
                label="Full Name"
                type="text"
                value={fullname}
                onChange={setFullname}
                placeholder="John"
                required
              />
              <Input
                id="email"
                label="Email Address"
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="john@example.com"
                required
              />
            </div>

            {/* Grid for Password + Token */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                id="password"
                label="Password"
                type="password"
                value={password}
                onChange={setPassword}
                placeholder="Min 8 Characters"
                required
              />
              <Input
                id="adminInviteToken"
                label="Admin Invite Token"
                type="text"
                value={adminInviteToken}
                onChange={setAdminInviteToken}
                placeholder="6 Digit Code"
              />
            </div>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            {/* Sign Up Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition transform hover:-translate-y-0.5 active:scale-95"
            >
              SIGN UP
            </button>

            <p className="text-sm text-center text-gray-500 dark:text-gray-400 mt-3">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:underline dark:text-blue-400">
                Log In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </AuthLayout>
  );
};

export default SignUp;
