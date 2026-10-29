export interface User {
  id: number;
  name: string;
  email: string;
  role: string; // 'ROLE_USER' or 'ROLE_ADMIN'
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresInSeconds: number;
  user: User;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}
