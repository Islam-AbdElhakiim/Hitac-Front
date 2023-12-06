import { inStockProductsInitalType, stationType, supplyOrderInitalType, supplyOrderType } from "@/types";
import {
  deleteRequest,
  getRequest,
  patchRequest,
  postRequest,
  putRequest,
} from "./requests";

export const getAllpatchs = async () => {
  const result = await getRequest(`patches`);
  return result;
};

export const getpatchById = async (id: string) => {
  const result = await getRequest(`patches/${id}`);
  return result;
};

export const deletepatchById = async (id: string) => {
  const result = await deleteRequest(`patches/delete/${id}`);
  return result;
};

export const updatepatch = async (
  id: string,
  supp: inStockProductsInitalType
) => {
  const result = await patchRequest(`patches/${id}`, supp);
  return result;
};
export const createpatch = async (supp: inStockProductsInitalType) => {
  const result = await postRequest(`patches`, supp);
  return result;
};
