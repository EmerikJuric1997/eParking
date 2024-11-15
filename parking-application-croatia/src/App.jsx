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


function App() {
  return (
    <div>
      <BrowserRouter>
        <HeaderComponent />
        <Routes>
          <Route path='/' element={<HomePage />}></Route>
          <Route path='/register' element={<RegisterPage />}></Route>
          <Route path='/signin' element={<SignInPage />}></Route>
          <Route path='*' element={<NotFound />}></Route>
          <Route path='/user/:id' element={<UserPage />}></Route>
          <Route path='/parking/:id' element={<ParkingPage />}></Route>
          <Route path='/camera' element={<CameraPage />}></Route>
          <Route path='/admin' element={<AdminPage />}></Route>
        </Routes>
        <FooterComponent />
      </BrowserRouter>
    </div>
  )
}

export default App
