import { useMatch, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { addStudent, updateStudent } from "apis/students.api";
import { Student } from "types/students.type";
import { useEffect, useMemo, useState } from "react";
import { isAxiosError } from "utils/utils";
import { getStudent } from "apis/students.api";
import { toast } from "react-toastify";

type FormStateType = Omit<Student, "id"> | Student;
const initialFormState: FormStateType = {
  first_name: "",
  last_name: "",
  email: "",
  gender: "Other",
  country: "",
  avatar: "",
  btc_address: "",
}

type FormError = {
  [key in keyof FormStateType] : string
} | null;


export default function AddStudent() {
  const [formState, setFormState] = useState<FormStateType>(initialFormState);
  const match = useMatch("/students/add");
  const isAddMode = Boolean(match);
  const {id} = useParams();

  const {data: studentData, isLoading} = useQuery({
    queryKey: ["students", id],
    queryFn: () => getStudent(id as string),
    enabled: id !== undefined,
  })

  
  useEffect(() => {
    if (studentData?.status === 200) {
      setFormState(studentData.data)
    }
  }, [studentData])
  

  const addStudentMutation = useMutation({
    mutationFn: (body: FormStateType ) => {
      return addStudent(body);
    }
  })
  
  const updateStudentMutation = useMutation({
    mutationFn: (_) => updateStudent(id as string, formState as Student)
  })

  const handleChange = (name: keyof FormStateType) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormState(prev => ({...prev, [name]: event.target.value}));
    console.log(formState);
    
    if (addStudentMutation.error || addStudentMutation.data) {
      addStudentMutation.reset();
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      if (isAddMode) {
        const formData = await addStudentMutation.mutateAsync(formState);
        console.log("[Added student]: ", formData);
        toast.success("Student added successfully")
      }
      const updatedData = await updateStudentMutation.mutateAsync();
      console.log("[Updated student]: ", updatedData);
      toast.success("Student updated successfully");
    } catch (error) {
      const errorToastMessage = isAddMode ? "Failed to add student" : "Failed to edit student";
      console.log("Error: ", error);
      toast.error(errorToastMessage);
    }
  }

  const errorForm: FormError = useMemo(() => {
    const error = isAddMode ? addStudentMutation.error : updateStudentMutation.error;

    if (isAxiosError<{error: FormError}>(error) && error.response?.status === 422) {
      return error.response.data.error;
    } 
    return null;
  }, [addStudentMutation.error, updateStudentMutation.error, isAddMode])

  return (
    <div>
      <h1 className='text-lg'>{isAddMode ? "Add" : "Edit"} Student</h1>
      <form className='mt-6' onSubmit={handleSubmit}>
        <div className='group relative z-0 mb-6 w-full'>
          <input
            type='text'
            name='floating_email'
            id='floating_email'
            className='peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 
            text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 
            dark:focus:border-blue-500'
            placeholder=' '
            value={formState.email}
            onChange={handleChange("email")}
            required
          />
          <label
            htmlFor='floating_email'
            className='absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 
            peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 
            peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500'
          >
            Email address
          </label>

          {errorForm && (
            <p className="mt-2 text-sm text-red-600">
              <span className="font-medium">[Error] </span> 
              {errorForm.email}
            </p>
          )}
        </div>

        <div className='group relative z-0 mb-6 w-full'>
          <div>
            <div>
              <div className='mb-4 flex items-center'>
                <input
                  id='gender-1'
                  type='radio'
                  name='gender'
                  className='h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 
                  dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600'
                  value="Male"
                  onChange={handleChange("gender")}
                  checked={formState.gender === "Male"}
                />
                <label htmlFor='gender-1' className='ml-2 text-sm font-medium text-gray-900 dark:text-gray-300'>
                  Male
                </label>
              </div>
              <div className='mb-4 flex items-center'>
                <input
                  id='gender-2'
                  type='radio'
                  name='gender'
                  className='h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 
                  dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600'
                  value="Female"
                  onChange={handleChange("gender")}
                  checked={formState.gender === "Female"}
                />
                <label htmlFor='gender-2' className='ml-2 text-sm font-medium text-gray-900 dark:text-gray-300'>
                  Female
                </label>
              </div>
              <div className='flex items-center'>
                <input
                  id='gender-3'
                  type='radio'
                  name='gender'
                  className='h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 
                  dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600'
                  value="Other"
                  onChange={handleChange("gender")}
                  checked={formState.gender === "Other"}
                />
                <label htmlFor='gender-3' className='ml-2 text-sm font-medium text-gray-900 dark:text-gray-300'>
                  Other
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className='group relative z-0 mb-6 w-full'>
          <input
            type='text'
            name='country'
            id='country'
            className='peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 
            px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 
            dark:focus:border-blue-500'
            placeholder=' '
            value={formState.country}
            onChange={handleChange("country")}
            required
          />
          <label
            htmlFor='country'
            className='absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 
            peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 
            peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500'
          >
            Country
          </label>
        </div>
        <div className='grid md:grid-cols-2 md:gap-6'>
          <div className='group relative z-0 mb-6 w-full'>
            <input
              type='tel'
              name='first_name'
              id='first_name'
              className='peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 
              text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 
              dark:focus:border-blue-500'
              placeholder=' '
              value={formState.first_name}
              onChange={handleChange("first_name")}
              required
            />
            <label
              htmlFor='first_name'
              className='absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 
              peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 
              peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500'
            >
              First Name
            </label>
          </div>
          <div className='group relative z-0 mb-6 w-full'>
            <input
              type='text'
              name='last_name'
              id='last_name'
              className='peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 
              text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 
              dark:focus:border-blue-500'
              placeholder=' '
              value={formState.last_name}
              onChange={handleChange("last_name")}
              required
            />
            <label
              htmlFor='last_name'
              className='absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 
              peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 
              peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500'
            >
              Last Name
            </label>
          </div>
        </div>
        <div className='grid md:grid-cols-2 md:gap-6'>
          <div className='group relative z-0 mb-6 w-full'>
            <input
              type='text'
              name='avatar'
              id='avatar'
              className='peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm 
              text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 
              dark:focus:border-blue-500'
              placeholder=' '
              value={formState.avatar}
              onChange={handleChange("avatar")}
              required
            />
            <label
              htmlFor='avatar'
              className='absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 
              peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 
              peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500'
            >
              Avatar Base64
            </label>
          </div>
          <div className='group relative z-0 mb-6 w-full'>
            <input
              type='text'
              name='btc_address'
              id='btc_address'
              className='peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 
              text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 
              dark:focus:border-blue-500'
              placeholder=' '
              value={formState.btc_address}
              onChange={handleChange("btc_address")}
              required
            />
            <label
              htmlFor='btc_address'
              className='absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 
              peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 
              peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500'
            >
              BTC Address
            </label>
          </div>
        </div>

        <button
          type='submit'
          className='w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 
          focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto'
        >
          {isAddMode ? "Add" : "Update"}
        </button>
      </form>
    </div>
  )
}
