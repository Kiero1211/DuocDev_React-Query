import { useSearchParams } from "react-router-dom";

export const useQueryStrings = () => {
    const [searchParams] = useSearchParams();
    return Object.fromEntries([...searchParams]);
}