import { useState } from "react";
import "./App.css";
import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/LoginPage";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const handleLoginInOut = (username:string) => {
    setLoggedIn(!loggedIn);
    setUsername(username);

  };

  return (
    <div className = "overflow-hidden">
      {loggedIn ? (
        <Dashboard onLogout={handleLoginInOut} username = {username}/> // Render the Dashboard component if loggedIn is true
      ) : (
        <LoginPage onLogin={handleLoginInOut} /> // Render the LoginPage component if loggedIn is false
      )}
    </div>
  );
}

export default App;
