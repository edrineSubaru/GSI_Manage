import { useState, useEffect } from "react";
import { authService, type AuthState, type LoginCredentials } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>(authService.getAuthState());
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Listen for auth state changes (if needed in the future)
    const currentState = authService.getAuthState();
    setAuthState(currentState);
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const result = await authService.login(credentials);
      setAuthState(authService.getAuthState());
      toast({
        title: "Login successful",
        description: `Welcome back, ${result.user.firstName}!`,
      });
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login failed";
      toast({
        title: "Login failed",
        description: message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setAuthState(authService.getAuthState());
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  return {
    ...authState,
    login,
    logout,
    isLoading,
  };
}
