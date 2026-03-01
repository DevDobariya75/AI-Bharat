import { Download, MapPin } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

function getRiskLevel(prediction) {
  const rawRisk =
    prediction?.risk_classification ||
    prediction?.riskLevel ||
    prediction?.risk ||
    prediction?.risk_level ||
    prediction?.level ||
    '';

  const normalizedRisk = String(rawRisk).toLowerCase();
  if (normalizedRisk.includes('high')) {
    return 'High';
  }
  if (normalizedRisk.includes('medium') || normalizedRisk.includes('moderate')) {
    return 'Medium';
  }
  if (normalizedRisk.includes('low')) {
    return 'Low';
  }

  const numericScore = Number(
    prediction?.probability_score || prediction?.probability || prediction?.confidence || prediction?.score || 0
  );

  if (!Number.isNaN(numericScore)) {
    if (numericScore >= 0.8) {
      return 'High';
    }
    if (numericScore >= 0.6) {
      return 'Medium';
    }
  }

  return 'Low';
}

function Result() {
  const navigate = useNavigate();
  const location = useLocation();
  const { prediction: contextPrediction, text } = useAppContext();

  const prediction = location.state?.prediction || contextPrediction;

  const predictionLabel =
    prediction?.result ||
    prediction?.prediction ||
    prediction?.label ||
    prediction?.diagnosis ||
    prediction?.result ||
    'Pending Review';

  const probabilityScore =
    prediction?.probability_score ||
    prediction?.probability ||
    prediction?.confidence ||
    prediction?.score ||
    'N/A';

  const riskLevel = getRiskLevel(prediction);
  const riskClassification = prediction?.risk_classification || riskLevel;
  const riskPercent = riskLevel === 'High' ? 92 : riskLevel === 'Medium' ? 62 : 30;

  const riskColor =
    riskLevel === 'High'
      ? 'bg-rose-500'
      : riskLevel === 'Medium'
        ? 'bg-amber-500'
        : 'bg-emerald-500';

  const handleDownloadReport = () => {
    const content = {
      app: 'SwasthyaSetu AI',
      timestamp: new Date().toISOString(),
      prediction
    };

    const blob = new Blob([JSON.stringify(content, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'swasthyasetu-alzheimer-report.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleFindPhc = () => {
    window.open('https://www.google.com/maps/search/nearest+public+health+center', '_blank', 'noopener,noreferrer');
  };

  if (!prediction) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6">
        <section className="mx-auto max-w-4xl rounded-2xl bg-white p-6 shadow-sm ring-1 ring-blue-100">
          <h1 className="text-3xl font-bold text-blue-800">{text.resultTitle}</h1>
          <p className="mt-4 text-xl text-slate-700">{text.noData}</p>
          <button
            onClick={() => navigate('/assessment')}
            className="mt-6 rounded-xl bg-blue-700 px-4 py-3 text-lg font-semibold text-white"
          >
            {text.giveTestAgain}
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6">
      <section className="mx-auto max-w-4xl rounded-2xl bg-white p-6 shadow-sm ring-1 ring-blue-100">
        <h1 className="text-3xl font-bold text-blue-800">{text.resultTitle}</h1>
        <p className="mt-1 text-lg text-slate-600">{text.reportSubtitle}</p>

        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-lg font-semibold text-slate-800">{text.riskLevel}</p>
            <p className="text-lg font-bold text-slate-900">{riskLevel}</p>
          </div>
          <div className="mt-3 h-4 w-full rounded-full bg-slate-100">
            <div className={`h-4 rounded-full ${riskColor}`} style={{ width: `${riskPercent}%` }} />
          </div>
          <div className="mt-2 flex justify-between text-sm font-semibold text-slate-600">
            <span>{text.low}</span>
            <span>{text.medium}</span>
            <span>{text.high}</span>
          </div>
        </div>

        <div className="mt-6 space-y-4 rounded-xl bg-blue-50 p-5">
          <p className="text-lg text-slate-700">
            <span className="font-semibold text-blue-800">{text.predictionLabel}: </span>
            {String(predictionLabel)}
          </p>
          <p className="text-lg text-slate-700">
            <span className="font-semibold text-blue-800">{text.probabilityScore}: </span>
            {String(probabilityScore)}
          </p>
          <p className="text-lg text-slate-700">
            <span className="font-semibold text-blue-800">{text.riskClassification}: </span>
            {String(riskClassification)}
          </p>
          {prediction?.cognitive_score !== undefined || prediction?.cognitiveScore !== undefined ? (
            <p className="text-lg text-slate-700">
              <span className="font-semibold text-blue-800">{text.cognitiveScoreResult}: </span>
              {prediction.cognitive_score ?? prediction.cognitiveScore} / 4
            </p>
          ) : null}
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button
            onClick={handleDownloadReport}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-3 text-lg font-semibold text-white"
          >
            <Download className="h-5 w-5" />
            {text.downloadReport}
          </button>

          <button
            onClick={handleFindPhc}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-lg font-semibold text-white"
          >
            <MapPin className="h-5 w-5" />
            {text.findPhc}
          </button>
        </div>

        <button
          onClick={() => navigate('/assessment')}
          className="mt-4 w-full rounded-xl border border-blue-200 bg-white px-4 py-3 text-lg font-semibold text-blue-700 sm:w-auto"
        >
          {text.giveTestAgain}
        </button>
      </section>
    </main>
  );
}

export default Result;