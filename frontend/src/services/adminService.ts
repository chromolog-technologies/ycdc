import api from '../lib/api';

export const adminService = {
  login: async (credentials: any) => {
    const res = await api.post('/login', credentials);
    return res.data;
  },
  logout: async () => {
    const res = await api.post('/logout');
    return res.data;
  },
  getLeads: async () => {
    const res = await api.get('/admin/leads');
    return res.data;
  },
  getDoctors: async () => {
    const res = await api.get('/admin/doctors');
    return res.data;
  },
  getTestimonials: async () => {
    const res = await api.get('/admin/testimonials');
    return res.data;
  },
  getServices: async () => {
    const res = await api.get('/admin/services');
    return res.data;
  },
  getGallery: async () => {
    const res = await api.get('/admin/gallery');
    return res.data;
  },
  getBlogs: async () => {
    const res = await api.get('/admin/blogs');
    return res.data;
  },
  getCaseStudies: async () => {
    const res = await api.get('/admin/case-studies');
    return res.data;
  },
  getSeo: async () => {
    const res = await api.get('/admin/seo');
    return res.data;
  },

  // Generic submit helper to handle Laravel FormData POST override for PUT method
  submitDoctor: async (id: string | null, data: any) => {
    if (id) {
      if (data instanceof FormData) {
        return (await api.post(`/admin/doctors/${id}`, data)).data;
      }
      return (await api.put(`/admin/doctors/${id}`, data)).data;
    }
    return (await api.post('/admin/doctors', data)).data;
  },
  deleteDoctor: async (id: string | number) => {
    const res = await api.delete(`/admin/doctors/${id}`);
    return res.data;
  },

  submitTestimonial: async (id: string | null, data: any) => {
    if (id) {
      if (data instanceof FormData) {
        return (await api.post(`/admin/testimonials/${id}`, data)).data;
      }
      return (await api.put(`/admin/testimonials/${id}`, data)).data;
    }
    return (await api.post('/admin/testimonials', data)).data;
  },
  deleteTestimonial: async (id: string | number) => {
    const res = await api.delete(`/admin/testimonials/${id}`);
    return res.data;
  },

  submitService: async (id: string | null, data: any) => {
    if (id) {
      if (data instanceof FormData) {
        return (await api.post(`/admin/services/${id}`, data)).data;
      }
      return (await api.put(`/admin/services/${id}`, data)).data;
    }
    return (await api.post('/admin/services', data)).data;
  },
  deleteService: async (id: string | number) => {
    const res = await api.delete(`/admin/services/${id}`);
    return res.data;
  },

  submitGalleryItem: async (id: string | null, data: any) => {
    if (id) {
      if (data instanceof FormData) {
        return (await api.post(`/admin/gallery/${id}`, data)).data;
      }
      return (await api.put(`/admin/gallery/${id}`, data)).data;
    }
    return (await api.post('/admin/gallery', data)).data;
  },
  deleteGalleryItem: async (id: string | number) => {
    const res = await api.delete(`/admin/gallery/${id}`);
    return res.data;
  },

  submitBlog: async (id: string | null, data: any) => {
    if (id) {
      if (data instanceof FormData) {
        return (await api.post(`/admin/blogs/${id}`, data)).data;
      }
      return (await api.put(`/admin/blogs/${id}`, data)).data;
    }
    return (await api.post('/admin/blogs', data)).data;
  },
  deleteBlog: async (id: string | number) => {
    const res = await api.delete(`/admin/blogs/${id}`);
    return res.data;
  },

  submitCaseStudy: async (id: string | null, data: any) => {
    if (id) {
      if (data instanceof FormData) {
        return (await api.post(`/admin/case-studies/${id}`, data)).data;
      }
      return (await api.put(`/admin/case-studies/${id}`, data)).data;
    }
    return (await api.post('/admin/case-studies', data)).data;
  },
  deleteCaseStudy: async (id: string | number) => {
    const res = await api.delete(`/admin/case-studies/${id}`);
    return res.data;
  },

  updateSeo: async (id: string | number, data: any) => {
    const res = await api.put(`/admin/seo/${id}`, data);
    return res.data;
  },

  getUsers: async () => {
    const res = await api.get('/admin/users');
    return res.data;
  },
  deleteUser: async (id: string | number) => {
    const res = await api.delete(`/admin/users/${id}`);
    return res.data;
  },

  submitUser: async (id: string | null, data: any) => {
    if (id) {
      if (data instanceof FormData) {
        return (await api.post(`/admin/users/${id}`, data)).data;
      }
      return (await api.put(`/admin/users/${id}`, data)).data;
    }
    return (await api.post('/admin/users', data)).data;
  }
};
