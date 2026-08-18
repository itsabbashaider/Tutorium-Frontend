import axiosInstance from "./axios.instance.service";

const unwrapResponse = (response) => {
  const body = response?.data;

  return body?.data ?? body;
};

const api = {
  async get(url, config = {}) {
    const response = await axiosInstance.get(
      url,
      config
    );

    return unwrapResponse(response);
  },

  async post(
    url,
    payload = {},
    config = {}
  ) {
    const response = await axiosInstance.post(
      url,
      payload,
      config
    );

    return unwrapResponse(response);
  },

  async put(
    url,
    payload = {},
    config = {}
  ) {
    const response = await axiosInstance.put(
      url,
      payload,
      config
    );

    return unwrapResponse(response);
  },

  async patch(
    url,
    payload = {},
    config = {}
  ) {
    const response = await axiosInstance.patch(
      url,
      payload,
      config
    );

    return unwrapResponse(response);
  },

  async delete(url, config = {}) {
    const response = await axiosInstance.delete(
      url,
      config
    );

    return unwrapResponse(response);
  },
};

export default api;