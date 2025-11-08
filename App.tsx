import React from 'react';
import { HashRouter, Routes, Route, Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Submission, NewSubmission } from './types';
import RegistrationForm from './components/RegistrationForm';
import SuccessPage from './components/SuccessPage';
import WelcomePage from './components/WelcomePage';

const InstagramIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919C8.416 2.175 8.796 2.163 12 2.163zm0 1.802c-3.11 0-3.467.012-4.69.068-2.585.118-3.927 1.46-4.045 4.045-.056 1.222-.067 1.578-.067 4.69s.011 3.467.067 4.69c.118 2.585 1.46 3.927 4.045 4.045 1.223.056 1.58.068 4.69.068 3.11 0 3.467-.012 4.69-.068 2.585-.118 3.927-1.46 4.045-4.045.056-1.223.067-1.58.067-4.69s-.011-3.467-.067-4.69c-.118-2.585-1.46-3.927-4.045-4.045-1.223-.056-1.58-.068-4.69-.068zm0 3.425a6.61 6.61 0 100 13.22 6.61 6.61 0 000-13.22zm0 1.802a4.808 4.808 0 110 9.616 4.808 4.808 0 010-9.616zm6.406-3.425a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z"/>
    </svg>
);

const ArrowLeftIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
    </svg>
);


const Layout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const showBackButton = location.pathname !== '/';

  return (
    <div className="min-h-screen bg-transparent text-gray-200 font-sans flex flex-col">
      <header className="bg-black/50 backdrop-blur-sm border-b border-amber-400/20 shadow-lg sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 relative">
           {showBackButton && (
              <button
                onClick={() => navigate(-1)}
                aria-label="Voltar para a página anterior"
                className="absolute top-1/2 -translate-y-1/2 left-4 sm:left-6 lg:left-8 text-gray-400 hover:text-amber-400 transition-colors p-2 rounded-full hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-amber-500 z-20"
              >
                <ArrowLeftIcon className="h-6 w-6" />
              </button>
          )}
          <h1 className="text-3xl font-bold text-amber-400 tracking-tight">JUREF</h1>
          <p className="text-gray-400">Juventude Renascendo na Fé</p>
          <p className="text-sm text-gray-500 mt-1">Desde 1995</p>
        </div>
      </header>
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow flex items-center justify-center">
        <Outlet />
      </main>
      <footer className="text-center py-6 mt-8 text-gray-500 text-sm">
          <div className="flex justify-center items-center space-x-6 mb-4">
              <a href="https://www.instagram.com/grupo_juref" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-amber-400 transition-colors" aria-label="Instagram do JUREF">
                  <InstagramIcon className="h-6 w-6" />
              </a>
          </div>
        <p>&copy; {new Date().getFullYear()} Grupo JUREF. Todos os direitos reservados.</p>
        <p className="mt-2">Desenvolvido por: Nicolas Couti</p>
      </footer>
    </div>
  );
};

const App: React.FC = () => {
  const handleNewSubmission = async (newSubmission: NewSubmission): Promise<void> => {
    const submissionWithId: Submission = {
      ...newSubmission,
      id: new Date().toISOString() + Math.random().toString().slice(2, 8),
    };
    
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyltcF2Fyw9wCdHi5E4O5R5IALTE20-J_2N39lhN6M95YUNMFxm1-q8CGNLvhGg01nCNw/exec';

    try {
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify(submissionWithId),
            mode: 'cors',
            headers: {
                'Content-Type': 'text/plain;charset=utf-8',
            },
        });

        const data = await response.json();
        if (data.result === 'success') {
            console.log('Inscrição enviada para a planilha com sucesso!', data);
        } else {
            console.error('Erro ao enviar para a planilha:', data.error);
        }
    } catch (err) {
        console.error('Erro de rede ao contatar a planilha:', err);
    }
  };

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<WelcomePage />} />
          <Route path="register" element={
             <div className="w-full max-w-lg">
               <div className="bg-black/75 backdrop-blur-sm p-6 sm:p-8 rounded-xl shadow-2xl border border-amber-400/30">
                 <h2 className="text-2xl font-semibold mb-2 text-gray-100">Inscrição para o Retiro</h2>
                 <p className="text-gray-400 mb-6">Preencha seus dados abaixo para registrar seu interesse.</p>
                 <RegistrationForm onSubmit={handleNewSubmission} />
               </div>
             </div>
          } />
          <Route path="success" element={<SuccessPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default App;