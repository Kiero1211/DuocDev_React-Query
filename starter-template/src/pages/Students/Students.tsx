import { Fragment, useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { getStudents, deleteStudent } from "apis/students.api";
import { StudentList } from "types/students.type";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { useQueryStrings } from "utils/utils";
import classNames from "classnames";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

const PAGE_LIMIT = 10;

export default function Students() {
    // useEffect(() => {
    //     setIsLoading(true);
    //     getStudents()
    //         .then((res) => {
    //             setStudentList(res.data);
    //         })
    //         .finally(() => setIsLoading(false));
    // }, []);

    const queryString: { page?: string } = useQueryStrings();
    const page = Number(queryString.page) || 1;

    const { data: studentList, isLoading } = useQuery({
        queryKey: ["student", page],
        queryFn: () => getStudents(page),
        placeholderData: keepPreviousData,
    });
    const totalStudentCount =
        Number(studentList?.headers["x-total-count"]) || 0;
    const totalPages = Math.ceil(totalStudentCount / PAGE_LIMIT);

    const deleteStudentMutation = useMutation({
        mutationFn: (id: string | number) => deleteStudent(id),
    })

    const handleDelete = async (id: string | number) => {
        try {
            await deleteStudentMutation.mutateAsync(id);
            toast.success("Deleted successfully");
        } catch (error) {
            console.log("[Error]", error);
            toast.error("Failed to delete student");
        }
    }

    return (
        <div>
            <h1 className="text-lg">Students</h1>
            <div className="mt-4">
                <Link
                    to="/students/add"
                    className=" rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white 
                    hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300"
                >
                    Add Student
                </Link>
            </div>

            {isLoading && (
                <Fragment>
                    <div role="status" className="mt-6 animate-pulse">
                        <div className="mb-4 h-4  rounded bg-gray-200 dark:bg-gray-700" />
                        <div className="mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700" />
                        <div className="mb-2.5 h-10 rounded bg-gray-200 dark:bg-gray-700" />
                        <div className="mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700" />
                        <div className="mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700" />
                        <div className="mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700" />
                        <div className="mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700" />
                        <div className="mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700" />
                        <div className="mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700" />
                        <div className="mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700" />
                        <div className="mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700" />
                        <div className="mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700" />
                        <div className="h-10  rounded bg-gray-200 dark:bg-gray-700" />
                        <span className="sr-only">Loading...</span>
                    </div>
                </Fragment>
            )}

            {!isLoading && (
                <Fragment>
                    <div className="relative mt-6 overflow-x-auto shadow-md sm:rounded-lg">
                        <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
                            <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="py-3 px-6">
                                        #
                                    </th>
                                    <th scope="col" className="py-3 px-6">
                                        Avatar
                                    </th>
                                    <th scope="col" className="py-3 px-6">
                                        Name
                                    </th>
                                    <th scope="col" className="py-3 px-6">
                                        Email
                                    </th>
                                    <th scope="col" className="py-3 px-6">
                                        <span className="sr-only">Action</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {studentList?.data.map((student, index) => (
                                    <tr
                                        key={index}
                                        className="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
                                    >
                                        <td className="py-4 px-6">
                                            {student.id}
                                        </td>
                                        <td className="py-4 px-6">
                                            <img
                                                src={student.avatar}
                                                alt={student.last_name}
                                                className="h-5 w-5"
                                            />
                                        </td>
                                        <th
                                            scope="row"
                                            className="whitespace-nowrap py-4 px-6 font-medium text-gray-900 dark:text-white"
                                        >
                                            {student.last_name}
                                        </th>
                                        <td className="py-4 px-6">
                                            {student.email}
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <Link
                                                to={`/students/${student.id}`}
                                                className="mr-5 font-medium text-blue-600 hover:underline dark:text-blue-500"
                                            >
                                                Edit
                                            </Link>
                                            <button 
                                                className="font-medium text-red-600 dark:text-red-500"
                                                onClick={() => handleDelete(student.id)}>
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-6 flex justify-center">
                        <nav aria-label="Page navigation example">
                            <ul className="inline-flex -space-x-px">
                                <li>
                                    {page === 1 ? (
                                        <span
                                            className="cursor-not-allowed rounded-l-lg border border-gray-300 bg-white 
                                            py-2 px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 
                                            dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 
                                            dark:hover:text-white"
                                        >
                                            Previous
                                        </span>
                                    ) : (
                                        <Link
                                            to={`/students?page=${page - 1}`}
                                            className="cursor-pointer rounded-l-lg border border-gray-300 bg-white 
                                            py-2 px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 
                                            dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 
                                            dark:hover:text-white"
                                        >
                                            Previous
                                        </Link>
                                    )}
                                </li>

                                {Array(totalPages)
                                    .fill(0)
                                    .map((_, index) => {
                                        const pageNumber = index + 1;
                                        const isActive = page === pageNumber;

                                        return (
                                            <li key={index}>
                                                <NavLink
                                                    className={classNames(
                                                        "border border-gray-300 py-2 px-3 leading-tight hover:bg-gray-100 hover:text-gray-700",
                                                        {
                                                            "bg-gray-100 text-gray-700":
                                                                isActive,
                                                            "bg-white text-gray-500":
                                                                !isActive,
                                                        },
                                                    )}
                                                    to={`/students?page=${pageNumber}`}
                                                >
                                                    {pageNumber}
                                                </NavLink>
                                            </li>
                                        );
                                    })}

                                <li>
                                    {page === totalPages ? (
                                        <span
                                            className="cursor-not-allowed rounded-r-lg border border-gray-300 bg-white py-2 px-3 leading-tight 
                                        text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 
                                        dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                                        >
                                            Next
                                        </span>
                                    ) : (
                                        <Link
                                            to={`/students?page=${page + 1}`}
                                            className="cursor-pointer rounded-r-lg border border-gray-300 bg-white py-2 px-3 leading-tight 
                                        text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 
                                        dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                                        >
                                            Next
                                        </Link>
                                    )}
                                </li>
                            </ul>
                        </nav>
                    </div>
                </Fragment>
            )}
        </div>
    );
}
