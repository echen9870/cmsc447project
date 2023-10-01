import { useState } from "react";
import "./App.css";
import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/LoginPage";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLoginInOut = () => {
    setLoggedIn(!loggedIn);
  };

  return (
    <div>
      {loggedIn ? (
        <Dashboard onLogout={handleLoginInOut}/> // Render the Dashboard component if loggedIn is true
      ) : (
        <LoginPage onLogin={handleLoginInOut} /> // Render the LoginPage component if loggedIn is false
      )}
    </div>
  );
}

export default App;
