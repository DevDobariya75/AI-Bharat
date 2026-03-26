import { Languages, LogOut, Menu, User, X } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState, useMemo } from 'react';
import { getEmailFromToken } from '../../utils/tokenUtils';
import { useLoginModal } from '../../context/LoginModalContext';

function Navbar() {
  const { text, language, changeLanguage, languages } = useAppContext();
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { openLoginModal } = useLoginModal();

  const userEmail = useMemo(() => {
    if (user?.email) return user.email;
    const token = localStorage.getItem("token");
    if (token) return getEmailFromToken(token);
    return null;
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowProfile(false);
    setShowMobileMenu(false);
  };

  const navClassName = ({ isActive }) =>
    `rounded-lg px-3 py-2 text-sm font-bold transition text-slate-700 hover:text-blue-700 sm:px-4 sm:py-2.5 sm:text-base ${
      isActive ? 'bg-blue-50 text-blue-700' : ''
    }`;

  const closeMenus = () => {
    setShowMobileMenu(false);
    setShowProfile(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-blue-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="text-xl font-bold text-blue-700 sm:text-3xl">
            {text.appName}
          </div>

          <nav className="hidden items-center gap-2 md:flex">
            <NavLink to="/" className={navClassName} onClick={closeMenus}>
              {text.navHome}
            </NavLink>

            {isAuthenticated && (
              <>
                <NavLink to="/assessment" className={navClassName} onClick={closeMenus}>
                  {text.navAssessment}
                </NavLink>
                <NavLink to="/history" className={navClassName} onClick={closeMenus}>
                  {text.navHistory || 'History'}
                </NavLink>
                <NavLink to="/phc-finder" className={navClassName} onClick={closeMenus}>
                  {text.navPhcFinder}
                </NavLink>
              </>
            )}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-slate-50 px-2 py-1.5 text-sm font-semibold text-slate-700">
              <Languages className="h-4 w-4" />
              <select
                id="language-select"
                value={language}
                onChange={(event) => changeLanguage(event.target.value)}
                className="border-0 bg-transparent font-semibold text-slate-700 focus:outline-none cursor-pointer"
              >
                {languages.map((item) => (
                  <option key={item.code} value={item.code}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            {isAuthenticated && (
              <div className="relative">
                <button
                  onClick={() => setShowProfile(!showProfile)}
                  className="rounded-full bg-blue-100 p-2 text-blue-700 hover:bg-blue-200 transition"
                  title="Profile"
                >
                  <User className="h-5 w-5" />
                </button>

                {showProfile && (
                  <div className="absolute right-0 mt-2 w-56 rounded-lg bg-white ring-1 ring-slate-200 shadow-lg z-50">
                    <div className="border-b border-slate-200 px-4 py-3">
                      <p className="text-xs text-slate-500 font-semibold">Email</p>
                      <p className="text-sm text-slate-900 break-all font-semibold mt-1">{userEmail || "Loading..."}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-left text-sm font-semibold text-red-600 hover:bg-red-50 transition"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}

            {!isAuthenticated && (
              <button
                onClick={() => {
                  closeMenus();
                  openLoginModal();
                }}
                className="hidden rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 transition whitespace-nowrap sm:inline-flex"
              >
                Login
              </button>
            )}

            <button
              type="button"
              className="inline-flex rounded-lg p-2 text-slate-700 hover:bg-slate-100 md:hidden"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              aria-label={showMobileMenu ? 'Close menu' : 'Open menu'}
            >
              {showMobileMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {showMobileMenu && (
          <div className="border-t border-blue-100 bg-white px-4 py-3 md:hidden">
            <div className="mb-3 inline-flex w-full items-center gap-2 rounded-lg border border-slate-300 bg-slate-50 px-2 py-1.5 text-sm font-semibold text-slate-700 sm:hidden">
              <Languages className="h-4 w-4" />
              <select
                id="language-select-mobile"
                value={language}
                onChange={(event) => changeLanguage(event.target.value)}
                className="w-full border-0 bg-transparent font-semibold text-slate-700 focus:outline-none cursor-pointer"
              >
                {languages.map((item) => (
                  <option key={item.code} value={item.code}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <nav className="flex flex-col gap-1">
              <NavLink to="/" className={navClassName} onClick={closeMenus}>
                {text.navHome}
              </NavLink>

              {isAuthenticated && (
                <>
                  <NavLink to="/assessment" className={navClassName} onClick={closeMenus}>
                    {text.navAssessment}
                  </NavLink>
                  <NavLink to="/history" className={navClassName} onClick={closeMenus}>
                    {text.navHistory || 'History'}
                  </NavLink>
                  <NavLink to="/phc-finder" className={navClassName} onClick={closeMenus}>
                    {text.navPhcFinder}
                  </NavLink>
                </>
              )}

              {!isAuthenticated && (
                <button
                  onClick={() => {
                    closeMenus();
                    openLoginModal();
                  }}
                  className="mt-2 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 transition"
                >
                  Login
                </button>
              )}
            </nav>
          </div>
        )}
      </header>
    </>
  );
}

export default Navbar;