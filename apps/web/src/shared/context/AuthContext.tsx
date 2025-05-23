import { createContext } from 'react';

export const AuthContext = createContext({
  isAuthenticated: false,
  user: null,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  console.log('Hello from AuthContext Provider');
  
  return (
    <AuthContext.Provider value={{ isAuthenticated: false, user: null }}>
      {children}
    </AuthContext.Provider>
  );
}; 