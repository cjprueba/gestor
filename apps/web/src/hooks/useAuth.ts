export const useAuth = () => {
  console.log('Hello from useAuth hook');
  
  return {
    isAuthenticated: false,
    user: null,
    login: () => console.log('Login function'),
    logout: () => console.log('Logout function'),
  };
}; 