
export interface CartItem {
        id: number;
        name: string;
        price: number;
        imageUrl: string;
        // השדות החדשים שהוספנו:
        color?: string;       // סימן השאלה אומר שזה אופציונלי (כי בהתחלה אין צבע)
        customText?: string;
        quantity?: number;    // רלוונטי בעיקר לסל
        popularColor?: string; // נתוני ברירת המחדל מהקטלוג
        topText?: string;
        category?: string;
}

export interface ProductDTO{
        ProductId:number;
        ProductName:string;
        price: number;
        imageUrl: string;
        Description: string;
        CategoryDTO:Category;

        colors: string[];      
        popularColor?: string; 
        topText?: string;
        customText?: string;
}

export interface Category{
        categoryName: string;
}
