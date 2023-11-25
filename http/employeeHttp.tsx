import { CreateEmployeeDTO } from "@/types";
import { deleteRequest, getRequest, patchRequest } from "./requests";

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
  const result = await patchRequest(`employees/${id}`, newEmp);
  return result;
};
