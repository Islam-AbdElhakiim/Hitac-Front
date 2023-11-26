import {
  CreateEmployeeDTO,
  productInitalType,
  productType,
  segmentType,
  supplierType,
} from "@/types";
import {
  deleteRequest,
  getRequest,
  patchRequest,
  postRequest,
  putRequest,
} from "./requests";

export const getAllProducts = async () => {
  const result = await getRequest(`products`);
  return result;
};

export const getProductsById = async (id: string) => {
  const result = await getRequest(`products/${id}`);
  return result;
};

export const deleteProductsById = async (id: string) => {
  const result = await deleteRequest(`products/delete/${id}`);
  return result;
};

export const updateProducts = async (id: string, supp: productInitalType) => {
  const result = await patchRequest(`products/${id}`, supp);
  return result;
};
export const createProducts = async (supp: productInitalType) => {
  const result = await postRequest(`products`, supp);
  return result;
};
