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
export const updateVaraint = async (
  id: string,
  supp: variantInitalType
) => {
  const result = await patchRequest(`equipments-variants/${id}`, supp);
  return result;
};
export const deleteVaraintById = async (id: string) => {
  const result = await deleteRequest(`equipments-variants/delete/${id}`);
  return result;
};



