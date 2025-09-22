import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import './index.css'
import Header from './layout/Header'
import Home from './pages/Home'
import Product from './pages/Product'
import About from './pages/About'
import Contact from './pages/Contact'
import Footer from './layout/Footer'
import "./icons.js";


function App() {

  return (
    <BrowserRouter>
      <Header/>
      <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route path='/product' element={<Product/>}></Route>
        <Route path='/product/:category' element={<Product/>}></Route>
        {/* <Route path='/services' element={<Body/>}></Route> */}
        <Route path='/about' element={<About/>}></Route>
        <Route path='/contact' element={<Contact/>}></Route>
      </Routes>
      <Footer/>
    </BrowserRouter>
  )
}

export default App
