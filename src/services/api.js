import axios from 'axios';

// Production-safe environment variables - always use absolute URLs
const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const predictorUrl = import.meta.env.VITE_ALZHEIMER_PREDICTOR_URL || 'https://51v3g9h9g5.execute-api.ap-south-1.amazonaws.com/prod/alzheimer-predictor';

function resolveApiBaseUrl() {
  if (import.meta.env.DEV) {
    return rawApiBaseUrl || '/api';
  }

  if (rawApiBaseUrl && /^https?:\/\//i.test(rawApiBaseUrl)) {
    return rawApiBaseUrl;
  }

  try {
    const predictor = new URL(predictorUrl);
    const stage = predictor.pathname.split('/').filter(Boolean)[0] || 'prod';
    return `${predictor.origin}/${stage}`;
  } catch {
    return rawApiBaseUrl || '/api';
  }
}

const API_BASE_URL = resolveApiBaseUrl();
const ALZHEIMER_PREDICTOR_URL = import.meta.env.DEV
  ? '/__proxy/alzheimer-predictor'
  : predictorUrl;

// Axios instance for general backend API calls
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

// Axios instance specifically for Alzheimer prediction Lambda
const alzheimerApi = axios.create({
  baseURL: ALZHEIMER_PREDICTOR_URL,
  timeout: 20000
});

// Authorization interceptor for main API
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("idToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Authorization interceptor for Alzheimer predictor API
alzheimerApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("idToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
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

export async function getPrediction(assessmentPayload) {
  // Send features array to Alzheimer predictor Lambda
  if (assessmentPayload?.features) {
    const response = await alzheimerApi.post('', assessmentPayload);
    return response.data;
  }

  // Fallback for other payload formats
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