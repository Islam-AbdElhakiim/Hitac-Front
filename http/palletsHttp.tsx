import { inStockProductsInitalType, palletsInitalType, stationType, supplyOrderInitalType, supplyOrderType } from "@/types";
import {
  deleteRequest,
  getRequest,
  patchRequest,
  postRequest,
  putRequest,
} from "./requests";

export const getAllPalletss = async () => {
  const result = await getRequest(`pallets`);
  return result;
};

export const getPalletsById = async (id: string) => {
  const result = await getRequest(`pallets/${id}`);
  return result;
};

export const deletePalletsById = async (id: string) => {
  const result = await deleteRequest(`pallets/delete/${id}`);
  return result;
};

export const updatePallets = async (
  id: string,
  supp: palletsInitalType
) => {
  const result = await patchRequest(`pallets/${id}`, supp);
  return result;
};
export const fulfillPallets = async (
  id: string,
) => {
  const result = await patchRequest(`pallets/fulfill/${id}`);
  return result;
};
export const createPallets = async (supp: palletsInitalType) => {
  const result = await postRequest(`pallets`, supp);
  return result;
};
