import apiClient from '@/src/lib/apiClient';

export const supportApi = {
  createTicket: (payload: { subject: string; message: string }) =>
    apiClient.post('/support', payload),
  getMyTickets: () => apiClient.get('/support/my'),
  getAllTickets: () => apiClient.get('/support'),
  respondToTicket: (ticketId: string, payload: { message: string }) =>
    apiClient.post(`/support/${encodeURIComponent(ticketId)}/respond`, payload),
};
