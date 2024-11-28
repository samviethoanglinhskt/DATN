export type User = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any;
    id: number;
    name: string;
    tb_role_id: number;
    phone: string;
    address: string;
    address_detail: string;
    email: string;
    password: string;
    email_verified_at: string;
    created_at: string;
    updated_at: string;
}

export interface Address {
    id: number;
    address: string;
    address_detail: string;
    is_default: boolean;
    user_id: number;
    created_at: string;
    updated_at: string;
}
