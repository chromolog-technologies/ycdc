import api from '../lib/api';

export const leadService = {
  // Public submissions
  createLead: async (data: any) => {
    const res = await api.post('/leads', data);
    return res.data;
  },

  // Admin CRM operations (branch-scoped by the backend)
  deleteLeadAdmin: async (id: string | number) => {
    const res = await api.delete(`/admin/leads/${id}`);
    return res.data;
  },

  updateLeadStatusAdmin: async (id: string | number, status: string) => {
    const res = await api.put(`/admin/leads/${id}/status`, { status });
    return res.data;
  },

  updateLeadNotesAdmin: async (id: string | number, notes: string) => {
    const res = await api.put(`/admin/leads/${id}/notes`, { notes });
    return res.data;
  }
};
