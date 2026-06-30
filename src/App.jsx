import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <div className="bg-dark-bg text-white min-h-screen selection:bg-gold selection:text-black overflow-x-hidden antialiased">
      <Router>
        <AppRoutes />
      </Router>
    </div>
  );
}

export default App;
