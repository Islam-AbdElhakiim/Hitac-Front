import { CreateEmployeeDTO } from "@/types";
import { deleteRequest, getRequest, patchRequest } from "./requests";

export const getAllContacts = async () => {
  const result = await getRequest(`contacts`);
  return result;
};

export const getContactById = async (id: string) => {
  const result = await getRequest(`contacts/${id}`);
  return result;
};

export const deleteContactById = async (id: string) => {
  const result = await deleteRequest(`contacts/delete/${id}`);
  return result;
};

export const updateContact = async (id: string, newEmp: CreateEmployeeDTO) => {
  const result = await patchRequest(`contacts/${id}`, newEmp);
  return result;
};
