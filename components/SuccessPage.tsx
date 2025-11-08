import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const CheckIcon: React.FC<{className: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
    </svg>
);


const SuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMounted, setIsMounted] = useState(false);
  
  const { email, itemsToBring: aiItems } = location.state || {};

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);
  
  const defaultItems = [
    'Bíblia',
    'Caderno e caneta',
    'Colchonete (lençol, fronha, cobertor)',
    'Toalha de banho',
    'Itens de higiene pessoal (shampoo, sabonete, escova de dentes, etc.)',
    'Roupas confortáveis para 3 dias',
    'Um agasalho para noites frias',
    'Repelente e protetor solar',
    'Garrafa de água',
  ];

  const finalItems = [...defaultItems];
  if (aiItems) {
      // Adiciona itens da IA no topo da lista se existirem
      const aiItemsList = aiItems.split(',').map((item: string) => item.trim()).filter(Boolean);
      finalItems.unshift(...aiItemsList);
  }


  return (
    <div className={`w-full max-w-2xl transition-opacity duration-700 ease-out ${isMounted ? 'opacity-100' : 'opacity-0'}`}>
      <div className="bg-black/75 backdrop-blur-sm p-6 sm:p-8 rounded-xl shadow-2xl border border-amber-400/30 text-center">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-900/50 border-2 border-green-500">
            <CheckIcon className="h-10 w-10 text-green-400" />
        </div>
        <h2 className="text-2xl font-semibold mt-4 text-gray-100">Inscrição Realizada com Sucesso!</h2>
        <p className="text-gray-400 mt-2">
            Agradecemos seu interesse. Uma confirmação será enviada para o e-mail:
            <br />
            <strong className="text-amber-300">{email || 'seu e-mail'}</strong>
        </p>
        <p className="text-gray-400 mt-2 mb-8">Abaixo está uma lista de itens essenciais para levar ao retiro.</p>


        <div className="text-left bg-gray-900/50 border border-gray-700 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-amber-400 mb-4">O que levar para o Retiro:</h3>
            <ul className="space-y-3 list-disc list-inside text-gray-300">
                {aiItems && <li className="font-bold text-amber-300">Sugestão da IA: {aiItems}</li>}
                {defaultItems.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>
        </div>
        
        <button
          onClick={() => navigate('/register')}
          className="mt-8 w-full sm:w-auto inline-flex justify-center py-3 px-6 border border-transparent rounded-md shadow-sm text-sm font-semibold text-black bg-amber-500 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-amber-400 transition duration-150 ease-in-out"
        >
          Fazer Nova Inscrição
        </button>
      </div>
    </div>
  );
};

export default SuccessPage;