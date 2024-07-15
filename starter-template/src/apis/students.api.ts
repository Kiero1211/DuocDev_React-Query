import http from "services/axios";
import { Student, StudentList } from "types/students.type";

export const getStudent = (page: number | string = 1, limit: number | string = 10) => {
    return http.get<StudentList>("students", {
        params: {
            _page: page,
            _limit: limit
        }
    });
};

export const addStudent = (student: Omit<Student, "id">) => http.post("/students", student);
