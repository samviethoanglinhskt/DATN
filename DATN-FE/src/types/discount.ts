export interface Discount {
    id: number;
    discount_code: string;
    discount_value: number;
    name: string;
    start_day: string;
    end_day: string;
}