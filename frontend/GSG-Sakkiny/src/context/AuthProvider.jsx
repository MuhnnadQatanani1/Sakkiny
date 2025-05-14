import { createContext, useLayoutEffect, useState } from "react";

// Export the context as a named export so it can be imported directly
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const localAuth = localStorage.getItem("userData");
  const [authenticated, setAuthenticated] = useState(
    localAuth ? JSON.parse(localAuth) : null
  );

  useLayoutEffect(() => {
    if (localAuth) {
      setAuthenticated(JSON.parse(localAuth));
    }
  }, [localAuth]);

  return (
    <AuthContext.Provider value={{ authenticated, setAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

// Keep the default export for backward compatibility
export default AuthContext;