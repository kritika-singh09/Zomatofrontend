import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import OtpEnter from './pages/OtpEnter.jsx'
import { AppContextProvider } from './context/AppContext'
import ItemDetail from './pages/ItemDetail.jsx'
import Cart from './pages/Cart.jsx';
import CartButton from './components/CartButton.jsx';
import Home from './pages/Home.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AppContextProvider>
      <Routes>
        <Route path='/' element={<Home/>}/>
      <Route path="/login" element={<App />} />
        <Route path='/verification' element={<OtpEnter />} />
        <Route path='/item-detail' element={<ItemDetail/>}/>
        <Route path='/cart' element={<Cart/>}/>
      </Routes>
      </AppContextProvider>
  </BrowserRouter>,
)
