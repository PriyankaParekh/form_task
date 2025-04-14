import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThankYou } from "./components/thankyou";
import { Details } from "./components/details";
import { Home } from "./components/home";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route exact path="/" element={<Home />}></Route>
          <Route exact path="/thankyou" element={<ThankYou />}></Route>
          <Route exact path="/details" element={<Details />}></Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
