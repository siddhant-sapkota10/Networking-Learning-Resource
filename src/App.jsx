import { BrowserRouter, Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import DataTravel from "./pages/DataTravel"
import TCP from "./pages/TCP"
import Bandwidth from "./pages/Bandwidth"
import DNS from "./pages/DNS"
import HTTP from "./pages/HTTP"
import Security from "./pages/Security"
function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/data-travel" element={<DataTravel />} />
          <Route path="/tcp" element={<TCP />} />
          <Route path="/bitrate-bandwidth" element={<Bandwidth />} />
          <Route path="/dns" element={<DNS />} />
          <Route path="/http" element={<HTTP />} />
          <Route path="/internet-security" element={<Security />} />
        </Routes>

      </div>
    </BrowserRouter>
  )
}

export default App