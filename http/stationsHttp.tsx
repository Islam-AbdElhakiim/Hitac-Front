import { stationType } from "@/types";
import {
  deleteRequest,
  getRequest,
  patchRequest,
  postRequest,
  putRequest,
} from "./requests";

export const getAllStations = async () => {
  const result = await getRequest(`stations`);
  return result;
};

export const getStationById = async (id: string) => {
  const result = await getRequest(`stations/${id}`);
  return result;
};

export const deleteStationById = async (id: string) => {
  const result = await deleteRequest(`stations/delete/${id}`);
  return result;
};

export const updateStation = async (id: string, supp: stationType) => {
  const result = await patchRequest(`stations/${id}`, supp);
  return result;
};
export const createStation = async (supp: stationType) => {
  const result = await postRequest(`stations`, supp);
  return result;
};
