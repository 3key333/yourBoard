export interface RegistrationNewUser{
    name: string;
    password: string;
    passwordRepeat: string;
}

export interface IUser {
    id: string;
    user_name: string;
    password_hash: string;
}