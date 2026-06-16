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

export interface AddNewTaskBody {
    room_name: string; 
    title: string; 
    column_name: string; 
    position: number;
}

export interface MoveTaskToUpdateBoard {
    room_name: string,
    title: string,
    fromColumn: 'plan'| 'process'| 'ready',
    toColumn: 'plan'| 'process'| 'ready',
    fromIndex: number,
    toIndex: number,
}

export interface ITaskEntity {
    id: string;
    room_name: string;
    title: string;
    column_name: 'plan'| 'process'| 'ready';
    position: number;
}