import { CreateEmployeeDTO, supplierType } from "@/types";
import {
  deleteRequest,
  getRequest,
  patchRequest,
  postRequest,
  putRequest,
} from "./requests";

export const getAllSuppliers = async () => {
  const result = await getRequest(`suppliers`);
  return result;
};

export const getSupplierById = async (id: string) => {
  const result = await getRequest(`suppliers/${id}`);
  return result;
};

export const deleteSupplierById = async (id: string) => {
  const result = await deleteRequest(`suppliers/delete/${id}`);
  return result;
};

export const updateSupplier = async (id: string, supp: supplierType) => {
  const result = await patchRequest(`suppliers/${id}`, supp);
  return result;
};
export const createSupplier = async (supp: supplierType) => {
  const result = await postRequest(`suppliers`, supp);
  return result;
};
