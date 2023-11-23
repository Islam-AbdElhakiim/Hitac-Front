import { CreateEmployeeDTO } from "@/types";
import { deleteRequest, getRequest, putRequest } from "./requests";

export const getAllEmployees = async () => {
  const result = await getRequest(`employees`);
  return result;
};

export const getUserById = async (id: string) => {
  const result = await getRequest(`employees/${id}`);
  return result;
};

export const deleteUserById = async (id: string) => {
  const result = await deleteRequest(`employees/delete/${id}`);
  return result;
};

export const updateEmp = async (id: string, newEmp: CreateEmployeeDTO) => {
  const result = await putRequest(`employees/${id}`, newEmp);
  return result;
};
