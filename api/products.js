import axios from 'axios';
import {API_URL} from '@env';

const api = axios.create({baseURL: API_URL});

// GET
export const fetchProducts = async filter => {
  const params = new URLSearchParams();

  if (filter?.id) params.append('id', filter.id);
  if (filter?.barcode) params.append('barcode', filter.barcode);
  if (filter?.searchTerm) params.append('searchTerm', filter.searchTerm);
  if (filter?.name) params.append('name', filter.name);
  if (filter?.fromPrice) params.append('fromPrice', parseInt(filter.fromPrice));
  if (filter?.toPrice) params.append('toPrice', parseInt(filter.toPrice));

  const response = await api.get(`/Products/search?${params.toString()}`);
  return response.data;
};

// GET
export const fetchProductById = async id => {
  const response = await api.get(`/Products/search?id=${id}`);
  return response?.data[0] || null;
};

// POST
export const createProduct = async product => {
  const response = await api.post('/Products', product);
  return response.data;
};

// PUT
export const updateProduct = async (id, product) => {
  const response = await api.put(`/Products/${id}`, product);
  return response.data;
};

// DELETE
export const deleteProduct = async id => {
  const response = await api.delete(`/Products/${id}`);
  return response.data;
};
