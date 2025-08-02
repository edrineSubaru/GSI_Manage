import { User } from "@shared/schema";

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

const AUTH_STORAGE_KEY = "gsi_auth";

export class AuthService {
  private static instance: AuthService;
  private authState: AuthState = {
    user: null,
    isAuthenticated: false,
    token: null,
  };

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  constructor() {
    this.loadAuthState();
  }

  private loadAuthState(): void {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        this.authState = {
          user: parsed.user,
          isAuthenticated: !!parsed.token,
          token: parsed.token,
        };
      }
    } catch (error) {
      console.error("Failed to load auth state:", error);
      this.clearAuthState();
    }
  }

  private saveAuthState(): void {
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(this.authState));
    } catch (error) {
      console.error("Failed to save auth state:", error);
    }
  }

  private clearAuthState(): void {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    this.authState = {
      user: null,
      isAuthenticated: false,
      token: null,
    };
  }

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Login failed");
    }

    const data: LoginResponse = await response.json();
    
    this.authState = {
      user: data.user,
      isAuthenticated: true,
      token: data.token,
    };
    
    this.saveAuthState();
    return data;
  }

  logout(): void {
    this.clearAuthState();
  }

  getAuthState(): AuthState {
    return { ...this.authState };
  }

  getToken(): string | null {
    return this.authState.token;
  }

  isAuthenticated(): boolean {
    return this.authState.isAuthenticated;
  }

  getUser(): User | null {
    return this.authState.user;
  }
}

export const authService = AuthService.getInstance();
