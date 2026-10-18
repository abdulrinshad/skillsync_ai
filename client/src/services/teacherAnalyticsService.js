import { apiClient } from "./api";

export const getTeacherAnalytics = () =>
  apiClient("teacher/analytics");