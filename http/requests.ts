import axios from './axiosInstance';

export const getRequest = async (url: string, params?: { [key: string]: any; }, contentType?: string,) => {
  const response = await axios({
    method: 'get',
    url: url,
    headers: {
      'Content-Type': contentType || 'application/json',
    },
    params,

  });
  return response.data;
};

export const postRequest = async (
  url: string,
  body?: {
    [key: string]: any;
  },
  contentType?: string,
) => {
  const response = await axios({
    method: 'post',
    url: url,
    data: body,
    headers: {
      'Content-Type': contentType || 'application/json',
    },
  });
  return response.data;
};

export const putRequest = async (
  url: string,
  body?: {
    [key: string]: any;
  },
  contentType?: string,
) => {
  const response = await axios({
    method: 'put',
    url: url,
    data: body,
    headers: {
      'Content-Type': contentType || 'application/json',
    },
  });
  return response.data;
};
export const patchRequest = async (
  url: string,
  body?: {
    [key: string]: any;
  },
  contentType?: string,
) => {
  const response = await axios({
    method: 'patch',
    url: url,
    data: body,
    headers: {
      'Content-Type': contentType || 'application/json',
    },
  });
  return response.data;
};

export const deleteRequest = async (
  url: string,
  body?: {
    [key: string]: any;
  },
  contentType?: string,
) => {
  const response = await axios({
    method: 'delete',
    url: url,
    data: body,
    headers: {
      'Content-Type': contentType || 'application/json',
    },
  });
  return response.data;
};

export const login = async (
  url: string,
  body?: {
    [key: string]: any;
  },
  contentType?: string,
) => {
  const response = await axios({
    method: 'post',
    url: url,
    data: body,
    headers: {
      'Content-Type': contentType || 'application/json',
    },
    withCredentials: true,

  });
  return response;
};