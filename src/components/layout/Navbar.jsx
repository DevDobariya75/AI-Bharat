import { Languages } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

function Navbar() {
  const { text, language, changeLanguage, languages } = useAppContext();

  const navClassName = ({ isActive }) =>
    `rounded-lg px-3 py-2 text-lg font-semibold transition ${
      isActive ? 'bg-blue-100 text-blue-800' : 'text-slate-700 hover:bg-slate-100'
    }`;

  return (
    <header className="sticky top-0 z-10 border-b border-blue-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="text-2xl font-bold text-blue-700">{text.appName}</div>

        <nav className="flex items-center gap-1 sm:gap-2">
          <NavLink to="/" className={navClassName}>
            {text.navHome}
          </NavLink>
          <NavLink to="/assessment" className={navClassName}>
            {text.navAssessment}
          </NavLink>
          <NavLink to="/phc-finder" className={navClassName}>
            {text.navPhcFinder}
          </NavLink>
        </nav>

        <div className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-base font-semibold text-blue-700 sm:text-lg">
          <Languages className="h-4 w-4 sm:h-5 sm:w-5" />
          <label htmlFor="language-select" className="sr-only">
            {text.languageLabel}
          </label>
          <span>{text.languageLabel}:</span>
          <select
            id="language-select"
            value={language}
            onChange={(event) => changeLanguage(event.target.value)}
            className="rounded-md border border-blue-200 bg-white px-2 py-1 text-sm font-semibold text-blue-700"
          >
            {languages.map((item) => (
              <option key={item.code} value={item.code}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </header>
  );
}

export default Navbar;