import { User } from "./user.model";

export interface UserPage {
    currentPage : string;
    totalPages : number;
    pageSize : number;
    userDTOS :User[];
}