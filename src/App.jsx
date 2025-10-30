import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import Header from './layout/Header'
import Home from './pages/Home'
import Product from './pages/Product'
import About from './pages/About'
import Contact from './pages/Contact'
import Footer from './layout/Footer'
import "./icons.js";
import LogIn from './pages/LogIn.jsx'
import CreateAccount from './pages/CraeteAccount.jsx'
import Owner from './pages/Owner.jsx'


function App() {

  return (
    <BrowserRouter >
      <Header/>
      <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route path='/owner' element={<Owner/>}></Route>
        <Route path='/product' element={<Product/>}></Route>
        <Route path='/product/:category' element={<Product/>}></Route>
        <Route path='/logIn' element={<LogIn/>}></Route>
        <Route path='/logIn/createAccount' element={<CreateAccount/>}></Route>
        <Route path='/about' element={<About/>}></Route>
        <Route path='/contact' element={<Contact/>}></Route>
      </Routes>
      <Footer/>
    </BrowserRouter>
  )
}

export default App
