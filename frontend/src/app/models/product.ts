export interface CartItem {
        id: number;
        name: string;
        price: number;
        imageUrl: string;
        // השדות החדשים שהוספנו:
        category?: string;
        color?: string;       // סימן השאלה אומר שזה אופציונלי (כי בהתחלה אין צבע)
        customText?: string;
        quantity?: number;    // רלוונטי בעיקר לסל
        popularColor?: string; // נתוני ברירת המחדל מהקטלוג
        topText?: string;
}

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
