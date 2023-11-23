import { CreateEmployeeDTO, segmentType, supplierType } from "@/types";
import {
  deleteRequest,
  getRequest,
  patchRequest,
  postRequest,
  putRequest,
} from "./requests";

export const getAllSegments = async () => {
  const result = await getRequest(`segments`);
  return result;
};

export const getSegmentsById = async (id: string) => {
  const result = await getRequest(`segments/${id}`);
  return result;
};

export const deleteSegmentsById = async (id: string) => {
  const result = await deleteRequest(`segments/delete/${id}`);
  return result;
};

export const updateSegments = async (id: string, supp: segmentType) => {
  const result = await patchRequest(`segments/${id}`, supp);
  return result;
};
export const createSegments = async (supp: segmentType) => {
  const result = await postRequest(`segments`, supp);
  return result;
};
