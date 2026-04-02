import { useState } from "react";
import Auth from "../src/component/Auth";
import AdminPage from "../src/component/AdminPage";


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <>
      {!isAuthenticated ? (
        <Auth onLogin={() => setIsAuthenticated(true)} />
      ) : (
        <AdminPage />
      )}
    </>
  );
}

export default App;
