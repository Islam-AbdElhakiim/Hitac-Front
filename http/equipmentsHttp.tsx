import { inStockProductsInitalType, stationType, supplyOrderInitalType, supplyOrderType, variantInitalType } from "@/types";
import {
  deleteRequest,
  getRequest,
  patchRequest,
  postRequest,
  putRequest,
} from "./requests";

export const getAllEquipments = async () => {
  const result = await getRequest(`equipments-types`);
  return result;
};

export const getEquipmentById = async (id: string) => {
  const result = await getRequest(`equipments-types/${id}`);
  return result;
};
export const getAllVariants = async () => {
  const result = await getRequest(`equipments-variants`);
  return result;
};

export const getVariantById = async (id: string) => {
  const result = await getRequest(`equipments-variants/${id}`);
  return result;
};
export const createVaraint = async (supp: variantInitalType) => {
  const result = await postRequest(`equipments-variants`, supp);
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

