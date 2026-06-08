export interface RegistrationNewUser{
    name: string;
    password: string;
    passwordRepeat: string;
}

export interface IUserEntity {
    id: string;
    user_name: string;
    password_hash: string;
}