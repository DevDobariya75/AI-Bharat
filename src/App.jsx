import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import AppLayout from './components/layout/AppLayout';
import Home from './pages/Home';
import Assessment from './pages/Assessment';
import Result from './pages/Result';
import PHCFinder from './pages/PHCFinder';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/assessment" element={<Assessment />} />
            <Route path="/screen" element={<Navigate to="/assessment" replace />} />
            <Route path="/result" element={<Result />} />
            <Route path="/phc-finder" element={<PHCFinder />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;