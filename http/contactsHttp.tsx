import { contactinterface } from "@/types";
import {
  deleteRequest,
  getRequest,
  patchRequest,
  postRequest,
} from "./requests";

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

export const updateContact = async (id: string, cont: contactinterface) => {
  const result = await patchRequest(`contacts/${id}`, cont);
  return result;
};

export const createContact = async (cont: contactinterface) => {
  const result = await postRequest(`contacts`, cont);
  return result;
};
