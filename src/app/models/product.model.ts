
// export interface CartItem {
//         id: number;
//         name: string;
//         price: number;
//         imageUrl: string;
//         // השדות החדשים שהוספנו:
//         color?: string;       // סימן השאלה אומר שזה אופציונלי (כי בהתחלה אין צבע)
//         customText?: string;
//         quantity?: number;    // רלוונטי בעיקר לסל
//         popularColor?: string; // נתוני ברירת המחדל מהקטלוג
//         topText?: string;
//         category?: string;

import { Category } from "./category";

// }
// export interface ProductDTO {
//         productId: number;
//         productName: string;
//         price: number;
//         description?: string;
//         imageUrl?: string;
//         colors: string; // בשרת זה מוגדר כ-string, אם זה JSON תצטרכי לעשות לו Parse
//         toptext: string;
//         category: Category;
// }

// export interface Category{
//         categoryName: string;
// }

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
