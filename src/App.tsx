// src/App.tsx
import { BrowserRouter, Routes, Route, Link } from "react-router";
import GrapesEditor from "./components/GrapesEditor";
import TestPreview from "./components/PreviewPage.tsx";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <nav className="bg-gray-800 text-white p-4">
          <ul className="flex space-x-4">
            <li>
              <Link to="/" className="hover:underline">
                Редактор
              </Link>
            </li>
            <li>
              <Link to="/preview" className="hover:underline">
                Превью
              </Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<GrapesEditor />} />
          <Route path="/preview" element={<TestPreview />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
