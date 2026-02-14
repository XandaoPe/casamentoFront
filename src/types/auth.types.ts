// src/types/auth.types.ts
export interface LoginCredentials {
    username: string;
    password: string;
}

export interface LoginResponse {
    access_token: string;
    expires_in: string;
    user: {
        username: string;
    };
}

export interface AuthContextData {
    user: { username: string } | null;
    loading: boolean;
    signIn: (username: string, password: string) => Promise<boolean>;
    signOut: () => void;
}

export interface JwtPayload {
    sub: string;
    username: string;
    iat?: number;
    exp?: number;
}