import { CreateEmployeeDTO, accountInitalType } from "@/types";
import {
  deleteRequest,
  getRequest,
  patchRequest,
  postRequest,
  putRequest,
} from "./requests";

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

export const updateAccount = async (id: string, acc: accountInitalType) => {
  const result = await patchRequest(`accounts/${id}`, acc);
  return result;
};
export const createAccount = async (acc: accountInitalType) => {
  const result = await postRequest(`accounts`, acc);
  return result;
};
