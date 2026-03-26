import { MapPin } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

function PHCFinder() {
  const { text } = useAppContext();

  const handleOpenMap = () => {
    window.open('https://www.google.com/maps/search/nearest+public+health+center', '_blank', 'noopener,noreferrer');
  };

  return (
    <main className="px-4 py-6 sm:px-6">
      <section className="mx-auto max-w-4xl rounded-2xl bg-white p-6 shadow-sm ring-1 ring-blue-100">
        <h1 className="text-2xl font-bold text-blue-800 sm:text-3xl">{text.phcTitle}</h1>
        <p className="mt-3 text-base text-slate-700 sm:text-xl">{text.phcDescription}</p>

        <button
          onClick={handleOpenMap}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-base font-semibold text-white sm:w-auto sm:text-lg"
        >
          <MapPin className="h-5 w-5" />
          {text.openMap}
        </button>
      </section>
    </main>
  );
}

export default PHCFinder;