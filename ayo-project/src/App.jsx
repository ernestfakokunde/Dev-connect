 import React from 'react'
 import { ToastContainer } from "react-toastify"
 import Navbar from './components/Navbar'
 import { Route,Routes } from 'react-router-dom'
 import Home from './pages/Home'
 import Footer from './components/Footer'
 import  Community from './pages/Community';
 import Checkout from './pages/Checkout';
 import PaymentSummary from './pages/PaymentSummary'
 import Login from './pages/Login'
 import Register from './pages/Register'
 import Resources from './pages/Resources'
import TermsOfService from './pages/TermsOfService'
import PrivacyPolicy from './pages/PrivacyPolicy'
import Documentation from './pages/Documentation'
import CookiePolicy from './pages/CookiePolicy'
import Compliance from './pages/Compliance'
 import ProtectedRoute from './protectedRoutes/protectedRoutes'
 import ProfileSetup from './pages/profile/ProfileSetup'
 import PaymentCallback from './pages/PaymentCallback';
 import { useGlobalContext } from './context/context'
 import { Navigate } from 'react-router-dom'
 // Facebook-style pages
import Feed from './pages/Feed'
import Messages from './pages/Messages'
import Friends from './pages/Friends'
import Profile from './pages/Profile'
import UserProfile from './pages/UserProfile'
import ProfileSetupRoute from './protectedRoutes/ProfileSetupRoute'


 const App = () => {

  const {user} = useGlobalContext();
  

   return (
     <div>
        <Routes>
          {/* Facebook-style social media routes */}
          <Route path='/feed' element={
            <ProtectedRoute>
              <Feed/>
            </ProtectedRoute>
          }></Route>

             <Route path='/resources' element={
            <ProtectedRoute>
              <Resources/>
            </ProtectedRoute>
             }></Route>

          <Route path='/messages' element={
            <ProtectedRoute>
              <Messages/>
            </ProtectedRoute>
          }></Route>
          <Route path='/friends' element={
            <ProtectedRoute>
              <Friends/>
            </ProtectedRoute>
          }></Route>
          <Route path='/profile' element={
            <ProtectedRoute>
              <Profile/>
            </ProtectedRoute>
          }></Route>
          <Route path='/user/:id' element={
            <ProtectedRoute>
              <UserProfile/>
            </ProtectedRoute>
          }></Route>

          {/* Legacy routes (keeping for backward compatibility) */}
          <Route path='feeds' element={
            <ProtectedRoute>
              <Feed/>
            </ProtectedRoute>
          }></Route>
          <Route path='feeds/message' element={
            <ProtectedRoute>
              <Messages/>
            </ProtectedRoute>
          }></Route>

          {/* Other routes */}
          <Route path='/login' element={<Login/>}></Route>
          <Route path='/register' element={<Register/>}></Route>
          <Route path='/profilesetup' element={
            <ProfileSetupRoute>
              <ProfileSetup/>
            </ProfileSetupRoute>
          }></Route>

          <Route path='/' element={<Home/>}></Route>
          <Route path='/community' element={
            <ProtectedRoute>
              <Community/>
            </ProtectedRoute>
          }></Route>
          <Route path='/checkout' element={
            <ProtectedRoute>
              <Checkout/>
            </ProtectedRoute>
          }></Route>
          <Route path='/paymentsummary' element={
            <ProtectedRoute>
              <PaymentSummary/>
            </ProtectedRoute>
          }></Route>
          <Route path='/payment/callback' element={<PaymentCallback />} />

          {/* Legal & Docs pages (public) */}
          <Route path='/terms' element={<TermsOfService />} />
          <Route path='/privacy' element={<PrivacyPolicy />} />
          <Route path='/docs' element={<Documentation />} />
          <Route path='/cookies' element={<CookiePolicy />} />
          <Route path='/compliance' element={<Compliance />} />
        </Routes>
    
        {/*toast container */}
        <ToastContainer
          position='top-right'
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          pauseOnHover
          draggable
          theme='colored'
        ></ToastContainer>
     </div>
   )
 }
 
 export default App