export interface RegistrationNewUser{

        message: string;
        token: string;
        user: {
            id: string,
            name: string,
        };

}