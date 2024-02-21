import { Product } from "./product.model";

export interface ProductPage{
    currentPage :number,
    totalPages :number,
    pageSize: number,
    productDTOS: Product[],
}