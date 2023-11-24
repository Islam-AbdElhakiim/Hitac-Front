import { stationType, supplyOrderType } from "@/types";
import {
  deleteRequest,
  getRequest,
  patchRequest,
  postRequest,
  putRequest,
} from "./requests";

export const getAllSupplyOrders = async () => {
  const result = await getRequest(`supply-orders`);
  return result;
};

export const getSupplyOrderById = async (id: string) => {
  const result = await getRequest(`supply-orders/${id}`);
  return result;
};

export const deleteSupplyOrderById = async (id: string) => {
  const result = await deleteRequest(`supply-orders/delete/${id}`);
  return result;
};

export const updateSupplyOrder = async (id: string, supp: supplyOrderType) => {
  const result = await patchRequest(`supply-orders/${id}`, supp);
  return result;
};
export const createSupplyOrder = async (supp: supplyOrderType) => {
  const result = await postRequest(`supply-orders`, supp);
  return result;
};
