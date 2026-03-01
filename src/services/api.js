import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000,
});

const alzheimerApi = axios.create({
  baseURL:
    (import.meta.env.DEV
      ? '/api/alzheimer-predictor'
      : '') ||
    import.meta.env.VITE_ALZHEIMER_PREDICTOR_URL ||
    'https://51v3g9h9g5.execute-api.ap-south-1.amazonaws.com/default/alzheimer-predictor',
  timeout: 20000
});

export async function uploadXray(file) {
  const formData = new FormData();
  formData.append('xray', file);

  const response = await api.post('/screening/xray', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

  return response.data;
}

export async function uploadAudioForTranscription(audioBlob) {
  const formData = new FormData();
  formData.append('audio', audioBlob, 'voice-input.webm');

  const response = await api.post('/voice/transcribe', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

  return response.data;
}

export async function runMemoryAssessment(payload) {
  const response = await api.post('/screening/memory', payload);
  return response.data;
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("idToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Suppress Cognito-related 400 errors in console
    if (error.config?.url?.includes('cognito-idp')) {
      console.debug('Cognito validation request failed (this is normal for expired tokens)');
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

export async function getPrediction(assessmentPayload) {
  if (assessmentPayload?.features) {
    const response = await alzheimerApi.post('', assessmentPayload);
    return response.data;
  }

  const response = await alzheimerApi.post('', {
    data: assessmentPayload,
    clinical: assessmentPayload?.clinical,
    cognitive_score: assessmentPayload?.cognitive_score,
    cognitive_answers: assessmentPayload?.cognitive_answers,
    genetic_risk: assessmentPayload?.genetic_risk,
    biomarkers: assessmentPayload?.biomarkers,
    mri_data: assessmentPayload?.mri_data,
    mri_file_name: assessmentPayload?.mri_file_name
  });
  return response.data;
}

export async function getPollyInstructionsAudio(payload) {
  if (!import.meta.env.VITE_POLLY_API_URL) {
    return null;
  }

  const response = await axios.post(import.meta.env.VITE_POLLY_API_URL, payload, {
    timeout: 15000
  });

  return response.data;
}

// ================================
// Assessment APIs (NEW)
// ================================

// Save assessment result to DynamoDB
export async function saveAssessment(payload) {
  const response = await api.post("/save-assessment", payload);
  return response.data;
}

// Fetch assessment history for a user
export async function getAssessments(userId) {
  const response = await api.get(`/assessments/${userId}`);
  return response.data;
}

export default api;