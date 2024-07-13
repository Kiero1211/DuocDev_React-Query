import http from "services/axios";
import { StudentList } from "types/students.type";

export const getStudent = (page: number | string = 1, limit: number | string = 10) => {
    return http.get<StudentList>("students", {
        params: {
            _page: page,
            _limit: limit
        }
    });
};
