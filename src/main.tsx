import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router'
import './index.css'
import Home from './routes/Home'
import Categories from './routes/Categories'
import Transactions from './routes/Transactions'
import Record from './routes/Record'
import Stats from './routes/Stats'
import Tag from './routes/Tag'
import Budget from './routes/Budget'
import Plan from './routes/Plan'
import Remain from './routes/Remain'
import Settings from './routes/Settings'

function Index(){
  const navigate = useNavigate()
  useEffect(() => {
    navigate("/categories");
  },[])
  return <div></div>
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route index element={<Index />} />
        <Route element={<Home />}>
          <Route path='categories' element={<Categories />} />
          <Route path='transactions' element={<Transactions />}>
            <Route path='record' element={<Record />} />
            <Route path='stats' element={<Stats />} />
            <Route path='tag' element={<Tag />} />
          </Route>
          <Route path='budget' element={<Budget />}>
            <Route path='plan' element={<Plan />} />
            <Route path='remain' element={<Remain />} />
          </Route>
          <Route path='settings' element={<Settings />} />
        </Route>
        
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
