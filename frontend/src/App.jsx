import React, { useState } from "react";
import LoginForm from "./components/LoginForm";
import ListBoard from "./pages/ListBoard";

function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50">
      {loggedInUser ? (
        <ListBoard user={loggedInUser} />
      ) : (
        <div className="fullscreen-center">
          <LoginForm onLogin={setLoggedInUser} />
        </div>
      )}
    </div>
  );
}

export default App;
