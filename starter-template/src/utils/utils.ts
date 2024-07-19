import axios, { AxiosError } from "axios";
import { useSearchParams } from "react-router-dom";

export const useQueryStrings = () => {
    const [searchParams] = useSearchParams();
    return Object.fromEntries([...searchParams]);
}

export function isAxiosError<T>(error: unknown): error is AxiosError<T> {
    return axios.isAxiosError(error);
}