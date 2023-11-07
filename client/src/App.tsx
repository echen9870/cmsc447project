import { useState, useEffect } from "react";
import "./App.css";
import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/LoginPage";

function App() {
  const storedLoggedIn = localStorage.getItem("loggedIn") === "true";
  const storedUsername = localStorage.getItem("username") || "";

  const [loggedIn, setLoggedIn] = useState(storedLoggedIn);
  const [username, setUsername] = useState(storedUsername);

  const handleLoginIn = (username:string) => {
    const newLoggedIn = !loggedIn;
    setLoggedIn(newLoggedIn);
    setUsername(username);
    localStorage.setItem("loggedIn", String(newLoggedIn));
    localStorage.setItem("username", username);
  };

  useEffect(() => {
    if (loggedIn) {
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("username", username);
    }
  }, [loggedIn, username]);

  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("username");
    setLoggedIn(false);
    setUsername("");
  };

  return (
    <div className="overflow-hidden">
      {loggedIn ? (
        <Dashboard onLogout={handleLogout} username={username} />
      ) : (
        <LoginPage onLogin={handleLoginIn} />
      )}
    </div>
  );
}

export default App;
