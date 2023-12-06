import { useState, useEffect } from "react";
import "./App.css";
import Dashboard from "./pages/Dashboard";
import LandingPage from "./pages/LandingPage";

function App() {
  const storedLoggedIn = sessionStorage.getItem("loggedIn") === "true";
  const storedUsername = sessionStorage.getItem("username") || "";

  const [loggedIn, setLoggedIn] = useState(storedLoggedIn);
  const [username, setUsername] = useState(storedUsername);

  const handleLoginIn = (username: string) => {
    const newLoggedIn = !loggedIn;
    setLoggedIn(newLoggedIn);
    setUsername(username);
    sessionStorage.setItem("loggedIn", String(newLoggedIn));
    sessionStorage.setItem("username", username);
  };

  useEffect(() => {
    if (loggedIn) {
      sessionStorage.setItem("loggedIn", "true");
      sessionStorage.setItem("username", username);
    }
  }, [loggedIn, username]);

  const handleLogout = () => {
    sessionStorage.removeItem("loggedIn");
    sessionStorage.removeItem("username");
    setLoggedIn(false);
    setUsername("");
  };

  return (
    <div className="overflow-hidden">
      {loggedIn ? (
        <Dashboard onLogout={handleLogout} username={username} />
      ) : (
        <LandingPage onLogin={handleLoginIn}/>
      )}
    </div>
  );
}

export default App;
