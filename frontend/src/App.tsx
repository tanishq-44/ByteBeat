import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Blogs from './pages/Blogs';
import SingleBlog from './pages/SingleBlog';
import CreateBlog from './pages/CreateBlog';
import EditBlog from './pages/EditBlog';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import ScrollToTop from './components/ScrollToTop';

const appStyle: React.CSSProperties = {
  boxSizing: 'border-box',
  overflowX: 'hidden',
  width: '100%',
  maxWidth: '100%'
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen bg-white overflow-x-hidden" style={appStyle}>
          <Header />
          <main className="flex-grow pt-16 w-full overflow-x-hidden" style={appStyle}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/blogs" element={<Blogs />} />
              <Route path="/blogs/:id" element={<SingleBlog />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/create-blog" element={<CreateBlog />} />
              <Route path="/edit-blog/:id" element={<EditBlog />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
