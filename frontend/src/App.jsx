import React, { useContext } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import Dashboard from './pages/Admin/Dashboard';
import ManageUsers from './pages/Admin/ManageUsers';
import ManageTasks from './pages/Admin/ManageTasks';
import UserDashboard from './pages/User/UserDashboard';
import CreateTask from './pages/Admin/CreateTask';
import MyTasks from './pages/User/MyTasks';
import ViewTaskDetails from './pages/User/ViewTaskDetails';

import PrivateRoute from './routes/PrivateRoute';

import Login from './pages/Auth/Login';
import SignUp from './pages/Auth/SignUp';
import UserProvider, { UserContext } from './context/userContext';
import { Toaster } from 'react-hot-toast';

const App = () => {
  return (
    <UserProvider>
      <Router>
        <AppRoutes />
      </Router>

      <Toaster
        toastOptions={{
          className: 'bg-gray-800 text-white',
          style: {
            fontSize: '16px',
            padding: '16px',
          },
        }}
      />
    </UserProvider>
  );
};

export default App;

const AppRoutes = () => {
  const { user, loading } = useContext(UserContext);

  if (loading) {
    return <div className="text-center mt-20 text-gray-500">Loading...</div>;
  }

  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />

      {/* Root route with role-based redirect */}
      <Route path="/" element={<RoleRedirect user={user} />} />

      {/* Admin Routes */}
      <Route element={<PrivateRoute allowedRoles={['admin']} />}>
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/create-task" element={<CreateTask />} />
        <Route path="/admin/manage-users" element={<ManageUsers />} />
        <Route path="/admin/tasks" element={<ManageTasks />} />
      </Route>

      {/* User Routes */}
      <Route element={<PrivateRoute allowedRoles={['member']} />}>
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/user/tasks-details" element={<ViewTaskDetails />} />
        <Route path="/user/my-tasks" element={<MyTasks />} />
        <Route path="/user/tasks/:id" element={<ViewTaskDetails />} />



      </Route>

      {/* Catch-all route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

const RoleRedirect = ({ user }) => {
  if (!user) return <Navigate to="/login" />;
  if (user.role === 'admin') return <Navigate to="/admin/dashboard" />;
  return <Navigate to="/user/dashboard" />;
};
