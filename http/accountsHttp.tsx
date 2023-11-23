import { CreateEmployeeDTO } from "@/types";
import { deleteRequest, getRequest, postRequest, putRequest } from "./requests";

export const getAllAccounts = async () => {
  const result = await getRequest(`accounts`);
  return result;
};

export const getAccountById = async (id: string) => {
  const result = await getRequest(`accounts/${id}`);
  return result;
};

export const deleteAccountById = async (id: string) => {
  const result = await deleteRequest(`accounts/delete/${id}`);
  return result;
};

export const updateAccount = async (id: string, newEmp: CreateEmployeeDTO) => {
  const result = await putRequest(`accounts/${id}`, newEmp);
  return result;
};
export const createAccount = async (newEmp: any) => {
  const result = await postRequest(`accounts`, newEmp);
  return result;
};
