import { useState } from "react";
import Auth from "../src/component/Auth";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <>
      {!isAuthenticated ? (
        <Auth onLogin={() => setIsAuthenticated(true)} />
      ) : (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <h1 className="text-3xl font-bold text-gray-800">
            ✅ Добро пожаловать в админ-панель!
          </h1>
        </div>
      )}
    </>
  );
}

export default App;
