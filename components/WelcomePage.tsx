import React from 'react';
import { useNavigate } from 'react-router-dom';

const WelcomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-3xl text-center">
      <div className="bg-black/75 backdrop-blur-sm p-8 sm:p-12 rounded-xl shadow-2xl border border-amber-400/30">
        <h1 className="font-poppins font-bold text-5xl sm:text-6xl text-amber-300 mb-6 tracking-wider leading-tight" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.8)' }}>
          Seja bem-vindo
          <br />
          <span className="text-3xl sm:text-4xl">ao</span>
          <br />
          Retiro RNF
        </h1>
        <p className="font-poppins font-semibold text-lg sm:text-xl text-gray-300 uppercase tracking-widest mb-12">
          RENASCENDO NA FÉ
        </p>
        <button
          onClick={() => navigate('/register')}
          className="font-poppins font-semibold text-lg bg-amber-500 text-black py-3 px-8 rounded-lg shadow-lg hover:bg-amber-600 transform hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-amber-400"
        >
          Vamos fazer a sua inscrição? Clique aqui
        </button>
      </div>
    </div>
  );
};

export default WelcomePage;