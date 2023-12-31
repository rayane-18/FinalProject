import { Frontpage } from "./pages/Frontpage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NoPage from "./pages/NoPage";
import MyGames from "./pages/MyGames";
import Browse from "./pages/Browse";
import GameDetails from "./pages/GameDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
export const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route index element={<Login />} />
          <Route path="/home" element={<Frontpage />} />
          <Route path="/Mygames/:page" element={<MyGames />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Browse/:page" element={<Browse />} />
          <Route path="/Games/:id" element={<GameDetails />} />
          <Route path="*" element={<NoPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};
export default App;
