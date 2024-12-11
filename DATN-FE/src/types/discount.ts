export interface Discount {
    id: number;
    discount_code: string;
    discount_value: number;
    max_price: number;
    name: string;
    start_day: string;
    end_day: string;
}