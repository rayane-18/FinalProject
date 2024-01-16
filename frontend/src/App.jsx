import { BrowserRouter, Routes, Route } from "react-router-dom";
import NoPage from "./pages/NoPage";
import MyGames from "./pages/MyGames";
import Browse from "./pages/Browse";
import GameDetails from "./pages/GameDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Aeee from "./pages/a";
import Home from "./pages/Home";
export const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route index element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/test" element={<Aeee />}></Route>
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
