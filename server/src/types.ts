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

export interface MoveTaskSocketData {
    roomName: any;
    fromColumn: any; 
    toColumn: any;
    fromIndex: any;
    toIndex: any;
}