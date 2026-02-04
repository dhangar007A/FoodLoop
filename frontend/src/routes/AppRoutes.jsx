import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import UserRegister from '../pages/auth/UserRegister';
import ChooseRegister from '../pages/auth/ChooseRegister';
import UserLogin from '../pages/auth/UserLogin';
import FoodPartnerRegister from '../pages/auth/FoodPartnerRegister';
import FoodPartnerLogin from '../pages/auth/FoodPartnerLogin';
import Home from '../pages/general/Home';
import Saved from '../pages/general/Saved';
import Search from '../pages/general/Search';
import Explore from '../pages/general/Explore';
import UserProfile from '../pages/general/UserProfile';
import Notifications from '../pages/general/Notifications';
import Following from '../pages/general/Following';
import BottomNav from '../components/BottomNav';
import CreateFood from '../pages/food-partner/CreateFood';
import Profile from '../pages/food-partner/Profile';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
                {/* Auth Routes */}
                <Route path="/register" element={<ChooseRegister />} />
                <Route path="/user/register" element={<UserRegister />} />
                <Route path="/user/login" element={<UserLogin />} />
                <Route path="/food-partner/register" element={<FoodPartnerRegister />} />
                <Route path="/food-partner/login" element={<FoodPartnerLogin />} />
                
                {/* Main App Routes */}
                <Route path="/" element={<><Home /><BottomNav /></>} />
                <Route path="/following" element={<><Following /><BottomNav /></>} />
                <Route path="/saved" element={<><Saved /><BottomNav /></>} />
                <Route path="/search" element={<><Search /><BottomNav /></>} />
                <Route path="/explore" element={<><Explore /><BottomNav /></>} />
                <Route path="/notifications" element={<><Notifications /><BottomNav /></>} />
                <Route path="/profile" element={<><UserProfile /><BottomNav /></>} />
                
                {/* Food Partner Routes */}
                <Route path="/create-food" element={<CreateFood />} />
                <Route path="/food-partner/:id" element={<><Profile /><BottomNav /></>} />
      </Routes>
    </Router>
  )
}

export default AppRoutes