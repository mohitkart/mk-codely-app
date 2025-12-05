export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  status: boolean;
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}
