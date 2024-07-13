export interface Student {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    gender: string;
    country: string;
    avatar: string;
    btc_address: string;
}

export type StudentList = Pick<Student, "id" | "email" | "last_name" | "avatar">[];
