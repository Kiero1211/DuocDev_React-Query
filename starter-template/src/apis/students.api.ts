import http from "services/axios";
import { Student, StudentList } from "types/students.type";

export const getStudents = (page: number | string = 1, limit: number | string = 10) => {
    return http.get<StudentList>("/students", {
        params: {
            _page: page,
            _limit: limit
        }
    });
};

export const getStudent = (id: number | string) => http.get(`/students/${id}`)

export const addStudent = (student: Omit<Student, "id">) => http.post("/students", student);

export const updateStudent = (id: number | string, student: Student) => http.put<Student>(`/students/${id}`, student);

export const deleteStudent = (id: number | string) => http.delete(`/students/${id}`);
