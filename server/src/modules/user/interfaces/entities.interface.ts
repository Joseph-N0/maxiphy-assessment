export interface IUser {
    id: number;
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    country: string;
    timestamp: Date;
    latest_update: Date;
}
