import { apiClient } from "./api";

export const getTeacherStudents = () =>
  apiClient("teacher/students");
