import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Auth & Context
import { AuthProvider } from './context/AuthContext';

// Public Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import AdminLogin from './pages/auth/AdminLogin';
import Register from './pages/auth/Register';
import OTPVerification from './pages/auth/OTPVerification';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// Student Pages
import StudentDashboard from './pages/student/Dashboard';
import ExploreCourses from './pages/student/ExploreCourses';
import MyLearning from './pages/student/MyLearning';
import LiveClasses from './pages/student/LiveClasses';
import Leaderboard from './pages/student/Leaderboard';
import Certificates from './pages/student/Certificates';
import HelpCenter from './pages/student/HelpCenter';
import Settings from './pages/student/Settings';
import CourseDetails from './pages/student/CourseDetails';
import Cart from './pages/student/Cart';
import Checkout from './pages/student/Checkout';
import ModuleLearning from './pages/student/ModuleLearning';
import VerifyCertificate from './pages/student/VerifyCertificate';
import Roadmap from './pages/student/Roadmap';
import WeeklyGoalDashboard from './pages/student/WeeklyGoalDashboard';
import Favorites from './pages/student/Favorites';
import DownloadManager from './pages/student/DownloadManager';
import CompletionTimeline from './pages/student/CompletionTimeline';
import LearningCalendar from './pages/student/LearningCalendar';
import Achievements from './pages/student/Achievements';
import XPDashboard from './pages/student/XPDashboard';
import StreakDashboard from './pages/student/StreakDashboard';
import ReminderCenter from './pages/student/ReminderCenter';
import FollowingPage from './pages/student/FollowingPage';
import InstructorProfile from './pages/student/InstructorProfile';
import PracticeTests from './pages/student/PracticeTests';
import CodingPlayground from './pages/student/CodingPlayground';












import TeacherDashboard from './pages/teacher/TeacherDashboard';
import CreateCourse from './pages/teacher/CreateCourse';
import ManageCourses from './pages/teacher/ManageCourses';
import Analytics from './pages/teacher/Analytics';
import LiveClassManager from './pages/teacher/LiveClassManager';
import Earnings from './pages/teacher/Earnings';
import TeacherProfileSettings from './pages/teacher/TeacherProfileSettings';
import StudentsManagement from './pages/teacher/StudentsManagement';
import TeacherCourseWorkspace from './pages/teacher/TeacherCourseWorkspace';
import TeacherChangeHistory from './pages/teacher/TeacherChangeHistory';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ManageTeachers from './pages/admin/ManageTeachers';
import ManageCoursesAdmin from './pages/admin/ManageCourses';
import Reports from './pages/admin/Reports';
import PlatformAnalytics from './pages/admin/Analytics';
import AdminSettings from './pages/admin/Settings';
import ControlCenter from './pages/admin/ControlCenter';

// Layouts
import StudentLayout from './layouts/StudentLayout';
import TeacherLayout from './layouts/TeacherLayout';
import AdminLayout from './layouts/AdminLayout';

// Core UI Components
import PageTransition from './components/ui/PageTransition';

// Route Guards
import AdminRoute from './routes/AdminRoute';
import RoleBasedRoute from './routes/RoleBasedRoute';

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/admin/login" element={<PageTransition><AdminLogin /></PageTransition>} />
        <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
        <Route path="/otp-verification" element={<PageTransition><OTPVerification /></PageTransition>} />
        <Route path="/forgot-password" element={<PageTransition><ForgotPassword /></PageTransition>} />
        <Route path="/reset-password" element={<PageTransition><ResetPassword /></PageTransition>} />
        <Route path="/courses/:id" element={<PageTransition><CourseDetails /></PageTransition>} />
        <Route path="/courses/:courseId/modules/:moduleId" element={<PageTransition><ModuleLearning /></PageTransition>} />
        <Route path="/courses/:courseId/roadmap" element={<PageTransition><Roadmap /></PageTransition>} />
        <Route path="/verify-certificate/:certId" element={<PageTransition><VerifyCertificate /></PageTransition>} />

        {/* Student Dashboard Routes */}
        <Route path="/dashboard" element={<RoleBasedRoute allowedRoles={['student']}><StudentLayout /></RoleBasedRoute>}>
          <Route index element={<PageTransition><StudentDashboard /></PageTransition>} />
          <Route path="explore" element={<PageTransition><ExploreCourses /></PageTransition>} />
          <Route path="learning" element={<PageTransition><MyLearning /></PageTransition>} />
          <Route path="live" element={<PageTransition><LiveClasses /></PageTransition>} />
          <Route path="leaderboard" element={<PageTransition><Leaderboard /></PageTransition>} />
          <Route path="certificates" element={<PageTransition><Certificates /></PageTransition>} />
          <Route path="help" element={<PageTransition><HelpCenter /></PageTransition>} />
          <Route path="settings" element={<PageTransition><Settings /></PageTransition>} />
          <Route path="weekly-goals" element={<PageTransition><WeeklyGoalDashboard /></PageTransition>} />
          <Route path="favorites" element={<PageTransition><Favorites /></PageTransition>} />
          <Route path="downloads" element={<PageTransition><DownloadManager /></PageTransition>} />
          <Route path="timeline" element={<PageTransition><CompletionTimeline /></PageTransition>} />
          <Route path="calendar" element={<PageTransition><LearningCalendar /></PageTransition>} />
          <Route path="achievements" element={<PageTransition><Achievements /></PageTransition>} />
          <Route path="xp" element={<PageTransition><XPDashboard /></PageTransition>} />
          <Route path="streaks" element={<PageTransition><StreakDashboard /></PageTransition>} />
          <Route path="reminders" element={<PageTransition><ReminderCenter /></PageTransition>} />
          <Route path="following" element={<PageTransition><FollowingPage /></PageTransition>} />
          <Route path="instructor/:teacherId" element={<PageTransition><InstructorProfile /></PageTransition>} />
          <Route path="practice-tests" element={<PageTransition><PracticeTests /></PageTransition>} />
          <Route path="playground" element={<PageTransition><CodingPlayground /></PageTransition>} />
          <Route path="cart" element={<PageTransition><Cart /></PageTransition>} />










          <Route path="checkout" element={<PageTransition><Checkout /></PageTransition>} />
        </Route>

        {/* Teacher Portal Routes */}
        <Route path="/teacher" element={<RoleBasedRoute allowedRoles={['teacher']}><TeacherLayout /></RoleBasedRoute>}>
          <Route index element={<PageTransition><TeacherDashboard /></PageTransition>} />
          <Route path="create-course" element={<PageTransition><CreateCourse /></PageTransition>} />
          <Route path="courses" element={<PageTransition><ManageCourses /></PageTransition>} />
          <Route path="courses/:courseId" element={<PageTransition><TeacherCourseWorkspace /></PageTransition>} />
          <Route path="analytics" element={<PageTransition><Analytics /></PageTransition>} />
          <Route path="live" element={<PageTransition><LiveClassManager /></PageTransition>} />
          <Route path="students" element={<PageTransition><StudentsManagement /></PageTransition>} />
          <Route path="earnings" element={<PageTransition><Earnings /></PageTransition>} />
          <Route path="settings" element={<PageTransition><TeacherProfileSettings /></PageTransition>} />
          <Route path="history" element={<PageTransition><TeacherChangeHistory /></PageTransition>} />
        </Route>

        {/* Admin Portal Routes */}
        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index element={<PageTransition><AdminDashboard /></PageTransition>} />
          <Route path="dashboard" element={<PageTransition><AdminDashboard /></PageTransition>} />
          <Route path="users" element={<PageTransition><ManageUsers /></PageTransition>} />
          <Route path="teachers" element={<PageTransition><ManageTeachers /></PageTransition>} />
          <Route path="courses" element={<PageTransition><ManageCoursesAdmin /></PageTransition>} />
          <Route path="reports" element={<PageTransition><Reports /></PageTransition>} />
          <Route path="analytics" element={<PageTransition><PlatformAnalytics /></PageTransition>} />
          <Route path="settings" element={<PageTransition><AdminSettings /></PageTransition>} />
          <Route path="control" element={<PageTransition><ControlCenter /></PageTransition>} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AnimatedRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
