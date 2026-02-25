import { Category } from "./category";


export interface PageResponse<T> {
        data: T[];
        totalItems: number;
        currentPage: number;
        pageSize: number;
        hasPreviousPage: boolean;
        hasNextPage: boolean;
}
      
      export interface ProductDTO {
        productId: number;
        productName: string;
        price: number;
        description?: string;
        imageUrl?: string;
        colors: string[]; // כאן זה מגיע כמערך
        toptext: string;
        category: Category;
}
