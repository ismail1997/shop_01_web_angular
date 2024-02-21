import { Brand } from "./brand.model";
import { Category } from "./category.model";

export interface Product{
    id: number,
    name: string,
    alias: string,
    shortDescription: string,
    fullDescription: string,
    enabled: boolean,
    inStock: boolean,
    cost: number,
    price: number,
    discountPercent: number,
    length: number,
    width: number,
    height: number,
    weight: number,
    mainImage: string,
    createdTime:Date,
    updatedTime:Date,
    category:Category,
    brand:Brand

}