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
    groups?: number | string[];
    user_permissions?: number | string[];
}

export interface LoginRequestBody {
    email: string;
    password: string;
}

