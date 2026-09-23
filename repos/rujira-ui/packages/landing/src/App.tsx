import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home, Ruji } from "./pages";
import { Header, Footer } from "./components";

function App() {
  return (
    <BrowserRouter>
      <div className="rujira">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/whatisrujira" element={<Home />} />
          <Route path="/whatisruji" element={<Ruji />} />
          <Route path="/roadmap" element={<Ruji />} />
          <Route path="/getinvolved" element={<Home />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
