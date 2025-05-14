import { useContext } from "react";
// Import the AuthContext (not AuthProvider) from the correct path
import { AuthContext } from '../context/AuthProvider.jsx';

const useAuth = () => {
  return useContext(AuthContext);
};

export default useAuth;