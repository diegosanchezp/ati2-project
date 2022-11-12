export interface UserSerializer {
    id?: number;
    last_login?: string | null;
    is_superuser?: boolean;
    username: string;
    first_name?: string;
    last_name?: string;
    is_staff?: boolean;
    is_active?: boolean;
    date_joined?: string;
    email: string;
    user_type: "NATURAL" | "ENTERPRISE";
    language?: "ES" | "EN";
    keep_informed?: boolean;
    groups?: number | string[];
    user_permissions?: number | string[];
}

export interface LoginRequestBody {
    email: string;
    password: string;
}

export interface ChangeLanguageBody {
    language: "es" | "en";
}

