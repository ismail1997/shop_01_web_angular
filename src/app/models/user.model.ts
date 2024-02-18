import { Role } from "./role.model";

export interface User{
    id : number,
    email: string ,
    password: string,
    firstName: string,
    lastName: string,
    photos: string,
    address: string,
    postalCode: string,
    country: string,
    city: string,
    enabled: boolean,
    roles: Role[]
}
