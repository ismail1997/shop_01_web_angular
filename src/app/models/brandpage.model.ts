import { Brand } from "./brand.model";

export interface BrandPage{
    currentPage: number,
    totalPages: number,
    pageSize: number,
    brandDTOS : Brand[]
}