import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HeaderComponent from './components/Header/HeaderComponent';
import HomePage from './pages/Main/Home/HomePage';
import NotFound from './pages/Main/NotFound/NotFound';
import RegisterPage from './pages/Authorization/Register/RegisterPage';
import SignInPage from './pages/Authorization/SignIn/SignInPage';
import UserPage from './pages/User/UserPage';
import ParkingPage from './pages/Main/Parking/ParkingPage';
import CameraPage from './pages/Camera/CameraPage';
import AdminPage from './pages/Admin/AdminPage';
import FooterComponent from './components/Footer/FooterComponent';
import PrivateRoute from './services/PrivateRoute';
import { AnimatePresence } from 'framer-motion';


function App() {
  return (
    <div>
      <AnimatePresence mode='wait'>
        <BrowserRouter>
          <HeaderComponent />
          <Routes>
            <Route path='/' element={<HomePage />}></Route>
            <Route path='/register' element={<RegisterPage />}></Route>
            <Route path='/signin' element={<SignInPage />}></Route>
            <Route path='*' element={<NotFound />}></Route>
            <Route
              path="/user/:id"
              element={
                <PrivateRoute>
                  <UserPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/parking/:id"
              element={
                <PrivateRoute>
                  <ParkingPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/camera"
              element={
                <PrivateRoute>
                  <CameraPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <PrivateRoute>
                  <AdminPage />
                </PrivateRoute>
              }
            />
          </Routes>
          <FooterComponent />
        </BrowserRouter>
      </AnimatePresence>
    </div>
  )
}

export default App
