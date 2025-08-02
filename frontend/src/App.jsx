
import React from 'react'
import { 
  BrowserRouter as Router,
  Routes,
  Route,
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

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
           <Route path="/login" element={<Login/>} />
           <Route path="/SignUp" element={<SignUp/>} />

           {/* Admin Routes */}
           <Route element={<PrivateRoute allowedRoles={['admin']} />}>
             <Route path="/admin/dashboard" element={<Dashboard />} />
             <Route path="/admin/create-task" element={<CreateTask />} />
             <Route path="/admin/manage-users" element={<ManageUsers />} />
             <Route path="/admin/tasks" element={<ManageTasks />} />
             {/* <Route path="/admin/my-tasks" element={<MyTasks />} /> */}
           </Route>


           {/* User Routes */}
           <Route element={<PrivateRoute allowedRoles={['user']} />}>
             <Route path="/user/dashboard" element={<UserDashboard />} />
             {/* <Route path="/user/create-task" element={<CreateTask />} />
             <Route path="/user/manage-users" element={<ManageUsers />} />
             <Route path="/user/tasks" element={<ManageTasks />} /> */}
             <Route path="/user/tasks-details" element={<ViewTaskDetails />} />
             <Route path="/user/my-tasks" element={<MyTasks />} />
           </Route>
        </Routes>
      </Router>
    </div>
  )
}

export default App

