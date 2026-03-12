import API from './axios.js';

/**
 * Sends a medical complaint to the selected AI provider.
 * @param {string} complaint - The user's symptoms/complaint.
 * @param {string} provider - 'gemini', 'groq', or 'gbt'.
 */
export const getAIPrediction = async (complaint, provider = 'groq') => {
  try {
    let endpoint = '';
    let payload = {};

    // 1. Determine the endpoint and payload structure based on the provider
    switch (provider.toLowerCase()) {
      case 'gemini':
        endpoint = '/ai/gemini_predict';
        payload = { complaint }; // Matches your GEMINI controller
        break;
      case 'groq':
        endpoint = '/ai/groq_pedict'; // Matches your router typo 'groq_pedict'
        payload = { chiefComplaint: complaint }; // Matches your GROQ controller
        break;
      case 'gbt':
      case 'openai':
        endpoint = '/ai/gbt_predict';
        payload = { complaint }; // Matches your GBT controller
        break;
      default:
        throw new Error("Invalid AI provider selected");
    }

    // 2. Make the POST request
    const res = await API.post(endpoint, payload);
    
    // 3. Return the normalized data
    return res.data; 

  } catch (err) {
    console.error(`AI Service Error (${provider}):`, err.response?.data || err.message);
    throw err;
  }
};