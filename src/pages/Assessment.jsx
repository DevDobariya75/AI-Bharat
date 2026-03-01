import { useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Mic } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getPrediction } from '../services/api';
import { useAppContext } from '../context/AppContext';

const FEATURE_SCHEMA = [
  { key: 'Age', type: 'number', placeholder: 'e.g. 72' },
  {
    key: 'Gender',
    type: 'select',
    options: [
      { label: 'Male', value: 0 },
      { label: 'Female', value: 1 },
      { label: 'Other', value: 2 }
    ]
  },
  {
    key: 'Ethnicity',
    type: 'select',
    options: [
      { label: 'Group 0', value: 0 },
      { label: 'Group 1', value: 1 },
      { label: 'Group 2', value: 2 }
    ]
  },
  {
    key: 'EducationLevel',
    type: 'select',
    options: [
      { label: 'Low', value: 0 },
      { label: 'Medium', value: 1 },
      { label: 'High', value: 2 }
    ]
  },
  { key: 'BMI', type: 'number', placeholder: 'e.g. 24.1' },
  {
    key: 'Smoking',
    type: 'select',
    options: [
      { label: 'No', value: 0 },
      { label: 'Yes', value: 1 }
    ]
  },
  {
    key: 'AlcoholConsumption',
    type: 'select',
    options: [
      { label: 'Low', value: 0 },
      { label: 'Moderate', value: 1 },
      { label: 'High', value: 2 }
    ]
  },
  {
    key: 'PhysicalActivity',
    type: 'select',
    options: [
      { label: 'Low', value: 0 },
      { label: 'Moderate', value: 1 },
      { label: 'High', value: 2 }
    ]
  },
  {
    key: 'DietQuality',
    type: 'select',
    options: [
      { label: 'Poor', value: 0 },
      { label: 'Average', value: 1 },
      { label: 'Good', value: 2 }
    ]
  },
  {
    key: 'SleepQuality',
    type: 'select',
    options: [
      { label: 'Poor', value: 0 },
      { label: 'Average', value: 1 },
      { label: 'Good', value: 2 }
    ]
  },
  {
    key: 'FamilyHistoryAlzheimers',
    type: 'select',
    options: [
      { label: 'No', value: 0 },
      { label: 'Yes', value: 1 }
    ]
  },
  {
    key: 'CardiovascularDisease',
    type: 'select',
    options: [
      { label: 'No', value: 0 },
      { label: 'Yes', value: 1 }
    ]
  },
  {
    key: 'Diabetes',
    type: 'select',
    options: [
      { label: 'No', value: 0 },
      { label: 'Yes', value: 1 }
    ]
  },
  {
    key: 'Depression',
    type: 'select',
    options: [
      { label: 'No', value: 0 },
      { label: 'Yes', value: 1 }
    ]
  },
  {
    key: 'HeadInjury',
    type: 'select',
    options: [
      { label: 'No', value: 0 },
      { label: 'Yes', value: 1 }
    ]
  },
  {
    key: 'Hypertension',
    type: 'select',
    options: [
      { label: 'No', value: 0 },
      { label: 'Yes', value: 1 }
    ]
  },
  { key: 'SystolicBP', type: 'number', placeholder: 'e.g. 128' },
  { key: 'DiastolicBP', type: 'number', placeholder: 'e.g. 82' },
  { key: 'CholesterolTotal', type: 'number', placeholder: 'e.g. 190' },
  { key: 'CholesterolLDL', type: 'number', placeholder: 'e.g. 110' },
  { key: 'CholesterolHDL', type: 'number', placeholder: 'e.g. 55' },
  { key: 'CholesterolTriglycerides', type: 'number', placeholder: 'e.g. 160' },
  { key: 'MMSE', type: 'number', placeholder: '0-30' },
  {
    key: 'FunctionalAssessment',
    type: 'select',
    options: [
      { label: 'Low', value: 0 },
      { label: 'Moderate', value: 1 },
      { label: 'High', value: 2 }
    ]
  },
  {
    key: 'MemoryComplaints',
    type: 'select',
    options: [
      { label: 'No', value: 0 },
      { label: 'Yes', value: 1 }
    ]
  },
  {
    key: 'BehavioralProblems',
    type: 'select',
    options: [
      { label: 'No', value: 0 },
      { label: 'Yes', value: 1 }
    ]
  },
  {
    key: 'ADL',
    type: 'select',
    options: [
      { label: 'Low', value: 0 },
      { label: 'Moderate', value: 1 },
      { label: 'High', value: 2 }
    ]
  },
  {
    key: 'Confusion',
    type: 'select',
    options: [
      { label: 'No', value: 0 },
      { label: 'Yes', value: 1 }
    ]
  },
  {
    key: 'Disorientation',
    type: 'select',
    options: [
      { label: 'No', value: 0 },
      { label: 'Yes', value: 1 }
    ]
  },
  {
    key: 'PersonalityChanges',
    type: 'select',
    options: [
      { label: 'No', value: 0 },
      { label: 'Yes', value: 1 }
    ]
  },
  {
    key: 'DifficultyCompletingTasks',
    type: 'select',
    options: [
      { label: 'No', value: 0 },
      { label: 'Yes', value: 1 }
    ]
  },
  {
    key: 'Forgetfulness',
    type: 'select',
    options: [
      { label: 'No', value: 0 },
      { label: 'Yes', value: 1 }
    ]
  },
  {
    key: 'DoctorInCharge_XXXconfid',
    type: 'select',
    options: [
      { label: 'Low', value: 0 },
      { label: 'Moderate', value: 1 },
      { label: 'High', value: 2 }
    ]
  }
];

function Assessment() {
  const { language, text, setPrediction } = useAppContext();
  const navigate = useNavigate();
  const recognitionRef = useRef(null);

  const [answers, setAnswers] = useState({});
  const [otherData, setOtherData] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [isListeningOtherData, setIsListeningOtherData] = useState(false);

  const featureVector = useMemo(() => {
    return FEATURE_SCHEMA.map((item) => {
      const rawValue = answers[item.key];
      if (rawValue === '' || rawValue === undefined || rawValue === null) {
        return 0;
      }
      const numericValue = Number(rawValue);
      return Number.isNaN(numericValue) ? 0 : numericValue;
    });
  }, [answers]);

  const captureOtherDataByVoice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setMessage(text.voiceApiMissing);
      return;
    }

    if (isListeningOtherData && recognitionRef.current) {
      recognitionRef.current.stop();
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListeningOtherData(true);
      setMessage('');
    };

    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript?.trim() || '';
      setOtherData((prev) => (prev ? `${prev} ${transcript}`.trim() : transcript));
    };

    recognition.onerror = () => {
      setMessage(text.voiceApiMissing);
      setIsListeningOtherData(false);
    };

    recognition.onend = () => {
      setIsListeningOtherData(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const updateAnswer = (key, value) => {
    setAnswers((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSubmit = async () => {
    const payload = {
      features: [featureVector]
    };

    try {
      setIsSubmitting(true);
      setMessage('');

      const apiData = await getPrediction(payload);
      const enriched = {
        ...apiData,
        features: featureVector,
        other_data: otherData,
        probability_score: apiData?.probability ?? apiData?.probability_score ?? apiData?.confidence,
        risk_classification:
          apiData?.result?.toLowerCase().includes('detected')
            ? 'High'
            : apiData?.prediction === 1
              ? 'High'
              : 'Low'
      };

      setPrediction(enriched);
      navigate('/result', { state: { prediction: enriched } });
    } catch {
      setMessage(text.apiFailed);
      const fallback = {
        prediction: 0,
        probability_score: 0.5,
        result: 'Model response unavailable',
        risk_classification: 'Medium',
        features: featureVector,
        other_data: otherData
      };
      setPrediction(fallback);
      navigate('/result', { state: { prediction: fallback } });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="px-4 py-6 sm:px-6">
      <section className="mx-auto max-w-6xl rounded-2xl bg-white p-6 shadow-sm ring-1 ring-blue-100 sm:p-8">
        <header className="space-y-3">
          <h1 className="text-3xl font-bold text-blue-800">{text.assessmentTitle}</h1>
          <p className="text-xl text-slate-700">33 model features form (0/1/2 & numeric format)</p>
        </header>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURE_SCHEMA.map((field) => (
            <div key={field.key} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <label className="text-base font-semibold text-slate-800">{field.key}</label>

              {field.type === 'number' ? (
                <input
                  type="number"
                  value={answers[field.key] ?? ''}
                  placeholder={field.placeholder || '0'}
                  onChange={(event) => updateAnswer(field.key, event.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-lg"
                />
              ) : (
                <select
                  value={answers[field.key] ?? ''}
                  onChange={(event) => updateAnswer(field.key, event.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-lg"
                >
                  <option value="">Select</option>
                  {field.options.map((option) => (
                    <option key={`${field.key}-${option.value}`} value={option.value}>
                      {option.label} ({option.value})
                    </option>
                  ))}
                </select>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-lg font-semibold text-slate-800">{text.anyOtherData}</p>
              <p className="text-sm text-slate-600">{text.anyOtherDataHint}</p>
            </div>
            <button
              type="button"
              onClick={captureOtherDataByVoice}
              className={`inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold text-white ${
                isListeningOtherData ? 'bg-blue-500' : 'bg-blue-700'
              }`}
            >
              <Mic className="h-4 w-4" />
              {isListeningOtherData ? text.listening : text.tapToSpeak}
            </button>
          </div>

          <textarea
            rows={4}
            value={otherData}
            onChange={(event) => setOtherData(event.target.value)}
            className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-lg"
          />
        </div>

        <div className="mt-6 rounded-xl bg-blue-50 p-4">
          <p className="text-lg font-semibold text-blue-800">JSON Payload Preview</p>
          <pre className="mt-2 overflow-auto rounded-lg bg-white p-3 text-sm text-slate-700 ring-1 ring-blue-100">
{JSON.stringify({ features: [featureVector] }, null, 2)}
          </pre>
        </div>

        {message ? <p className="mt-4 text-lg font-semibold text-blue-700">{message}</p> : null}

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={() => navigate('/')}
            className="rounded-xl border border-blue-200 bg-white px-5 py-3 text-lg font-semibold text-blue-700"
          >
            {text.back}
          </button>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="rounded-xl bg-blue-700 px-5 py-3 text-lg font-semibold text-white disabled:opacity-50"
          >
            {isSubmitting ? text.submitting : text.submit}
          </button>
        </div>
      </section>
    </main>
  );
}

export default Assessment;
