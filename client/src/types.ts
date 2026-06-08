export interface RegistrationNewUser{

        message: string;
        token: string;
        user: {
            id: string,
            name: string,
        };

}

export interface IUserEntity {
    id: string;
    user_name: string;
    password_hash: string;
}