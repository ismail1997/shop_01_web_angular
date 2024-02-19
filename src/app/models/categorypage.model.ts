import { Category } from "./category.model";

export interface CategoryPage{
    currentPage: number;
    totalPages: number;
    pageSize : number;
    categoryDTOS : Category[];
}