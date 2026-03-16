import apiClient from '@/src/lib/apiClient';

type AIProvider = 'gemini' | 'groq' | 'gbt' | 'openai';

interface AIPredictionResponse {
  diagnosis?: string;
  riskLevel?: string;
}

export async function getAIPrediction(
  complaint: string,
  provider: AIProvider = 'groq'
): Promise<AIPredictionResponse> {
  let endpoint = '';
  let payload: Record<string, string> = {};

  switch (provider.toLowerCase()) {
    case 'gemini':
      endpoint = '/ai/gemini_predict';
      payload = { complaint };
      break;
    case 'groq':
      // This endpoint name matches the backend route.
      endpoint = '/ai/groq_pedict';
      payload = { chiefComplaint: complaint };
      break;
    case 'gbt':
    case 'openai':
      endpoint = '/ai/gbt_predict';
      payload = { complaint };
      break;
    default:
      throw new Error('Invalid AI provider selected');
  }

  const { data } = await apiClient.post<AIPredictionResponse>(endpoint, payload);
  return data;
}
