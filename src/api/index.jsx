import { httpClient } from "./http";

export const api = {
    $get: async (url, config) => (await httpClient.get(url, config)),
    $delete: async (url, config) => (await httpClient.delete(url, config)),
    $post: async (url, data, config) => (await httpClient.post(url, data, config)),
    $put: async (url, data, config) => (await httpClient.put(url, data, config)),
    $patch: async (url, data, config) => (await httpClient.patch(url, data, config)),
};