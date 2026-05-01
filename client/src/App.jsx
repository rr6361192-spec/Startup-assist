import { Routes, Route } from "react-router-dom";
import { StartupProvider } from "./Vm";

import Nav from "./Nav";
import Dash from "./Dash";
import Valid from "./Valid";
import Vt from "./Vt";
import Slides from "./slides";
import Start from "./Start";
import Login from "./Login";
function App() {
  return (
    <StartupProvider>
      <Nav />

      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/Dash" element={<Dash />} />
        <Route path="/valid" element={<Valid />} />
     <Route path="/Vt" element={<Vt />} />
     <Route path="/Slides" element={<Slides />} />
     <Route path="/Login" element={<Login />} />
      </Routes>
    </StartupProvider>
  );
}

export default App;