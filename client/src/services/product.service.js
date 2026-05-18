import api from './api';

export const productService = {
  getProducts: (params) => api.get('/products', { params }),
  getFeaturedProducts: () => api.get('/products/featured'),
  getProductBySlug: (slug) => api.get(`/products/${slug}`),
  getProductAvailability: (id) => api.get(`/products/${id}/availability`),
};
