import { apiClient } from "./api";

export const createCourse = (data) =>
  apiClient("courses", {
    method: "POST",
    body: data,
  });

export const getMyCourses = () =>
  apiClient("courses/teacher/my-courses");

export const deleteCourseById = (id) =>
  apiClient(`courses/${id}`, {
    method: "DELETE",
  });

export const publishCourseById = (id) =>
  apiClient(`courses/${id}/publish`, {
    method: "PATCH",
  });