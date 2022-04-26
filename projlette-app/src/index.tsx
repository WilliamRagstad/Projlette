import * as React from "react";
import * as ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import Home from "./pages/Home";
import GenerateChallenge from "./components/challenge/GenerateChallenge";
import AllChallenges from "./components/challenge/AllChallenges";
import SubmitChallenge from "./components/challenge/SubmitChallenge";
import NoPage from "./pages/NoPage";
import About from "./pages/About";
import Problem from "./pages/Problem";
import Login from "./pages/Login";

// TODO: Set this to true when deploying to production
export const PRODUCTION_MODE = false;

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}>
          <Route index element={<GenerateChallenge />} />
          <Route path="all" element={<AllChallenges />} />
          <Route path="submit" element={<SubmitChallenge />} />
        </Route>
		<Route path="about" element={<About />}/>
		<Route path="problem/:id" element={<Problem />}/>
		<Route path="login" element={<Login />}/>
        <Route path="*" element={<NoPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(null);
