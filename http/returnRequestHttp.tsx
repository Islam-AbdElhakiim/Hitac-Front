import { returnRequestsType, stationType, supplyOrderType } from "@/types";
import {
  deleteRequest,
  getRequest,
  patchRequest,
  postRequest,
  putRequest,
} from "./requests";

export const getAllReturnRequests = async () => {
  const result = await getRequest(`return-requests`);
  return result;
};

export const getReturnRequestsById = async (id: string) => {
  const result = await getRequest(`return-requests/${id}`);
  return result;
};

export const deleteReturnRequestsById = async (id: string) => {
  const result = await deleteRequest(`return-requests/delete/${id}`);
  return result;
};

export const updateReturnRequests = async (
  id: string,
  supp: returnRequestsType
) => {
  const result = await patchRequest(`return-requests/${id}`, supp);
  return result;
};
export const createReturnRequests = async (supp: returnRequestsType) => {
  const result = await postRequest(`return-requests`, supp);
  return result;
};
