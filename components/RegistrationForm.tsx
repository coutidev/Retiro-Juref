import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NewSubmission } from '../types';
import { GoogleGenAI } from '@google/genai';

interface RegistrationFormProps {
  onSubmit: (submission: NewSubmission) => Promise<void>;
}

// Helper function to format the phone number as the user types
const formatPhoneNumber = (value: string): string => {
  const digits = value.replace(/\D/g, '');
  const slicedDigits = digits.slice(0, 11);
  const len = slicedDigits.length;

  if (len === 0) return '';
  if (len <= 2) return `(${slicedDigits}`;
  if (len <= 6) return `(${slicedDigits.slice(0, 2)}) ${slicedDigits.slice(2)}`;
  
  // Landline format
  if (len <= 10) {
     return `(${slicedDigits.slice(0, 2)}) ${slicedDigits.slice(2, 6)}-${slicedDigits.slice(6)}`;
  }

  // Mobile format
  return `(${slicedDigits.slice(0, 2)}) ${slicedDigits.slice(2, 7)}-${slicedDigits.slice(7)}`;
};

// Helper function to format the CPF as the user types
const formatCpf = (value: string): string => {
  const digits = value.replace(/\D/g, '');
  const slicedDigits = digits.slice(0, 11);

  if (slicedDigits.length <= 3) {
    return slicedDigits;
  }
  if (slicedDigits.length <= 6) {
    return `${slicedDigits.slice(0, 3)}.${slicedDigits.slice(3)}`;
  }
  if (slicedDigits.length <= 9) {
    return `${slicedDigits.slice(0, 3)}.${slicedDigits.slice(3, 6)}.${slicedDigits.slice(6)}`;
  }
  return `${slicedDigits.slice(0, 3)}.${slicedDigits.slice(3, 6)}.${slicedDigits.slice(6, 9)}-${slicedDigits.slice(9)}`;
};


const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<NewSubmission>({
    fullName: '',
    dateOfBirth: '',
    cpf: '',
    phone: '',
    email: '',
    allergies: '',
    hasInterest: true,
    itemsToBring: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Get today's date in YYYY-MM-DD format to prevent future date selection
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    let isCancelled = false;
    
    const generateItemsToBring = async () => {
      if (formData.allergies.trim() === '') {
        if (!isCancelled) {
          setFormData(prev => ({ ...prev, itemsToBring: '' }));
        }
        return;
      }

      setIsGenerating(true);
      try {
        // Fix: Use process.env.API_KEY directly as per the coding guidelines.
        const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
        const prompt = `Uma pessoa com as seguintes alergias: "${formData.allergies}" vai para um retiro de 3 dias. Sugira 1 a 3 itens essenciais que ela deve levar, em uma frase curta. Exemplo: "antialérgico e pomada para picadas". Responda apenas com os itens.`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        if (!isCancelled) {
          const suggestion = response.text.trim();
          setFormData(prev => ({ ...prev, itemsToBring: suggestion }));
        }
      } catch (e) {
        console.error("Erro ao gerar sugestão:", e);
        if (!isCancelled) {
          setFormData(prev => ({ ...prev, itemsToBring: 'Não foi possível gerar sugestão.' }));
        }
      } finally {
        if (!isCancelled) {
          setIsGenerating(false);
        }
      }
    };
    
    const debounceTimer = setTimeout(() => {
        generateItemsToBring();
    }, 1000); // Debounce for 1 second after user stops typing

    return () => {
      isCancelled = true;
      clearTimeout(debounceTimer);
    };
  }, [formData.allergies]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    let processedValue = value;
    if (name === 'phone') {
        processedValue = formatPhoneNumber(value);
    } else if (name === 'cpf') {
        processedValue = formatCpf(value);
    }

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : processedValue,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
      navigate('/success', { state: { email: formData.email, itemsToBring: formData.itemsToBring } });
    } catch (err) {
      console.error("Submission failed", err);
      setError('Houve um erro ao enviar sua inscrição. Por favor, tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-1">
          Nome Completo
        </label>
        <input
          type="text"
          name="fullName"
          id="fullName"
          value={formData.fullName}
          onChange={handleChange}
          required
          className="block w-full bg-gray-900/50 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-gray-200 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm transition"
          placeholder="Seu nome completo"
        />
      </div>
      
      <div>
        <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-300 mb-1">
          Data de Nascimento
        </label>
        <input
          type="date"
          name="dateOfBirth"
          id="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={handleChange}
          required
          max={today}
          className="block w-full bg-gray-900/50 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-gray-200 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm transition"
        />
      </div>
      
      <div>
        <label htmlFor="cpf" className="block text-sm font-medium text-gray-300 mb-1">
          CPF
        </label>
        <input
          type="text"
          name="cpf"
          id="cpf"
          value={formData.cpf}
          onChange={handleChange}
          required
          maxLength={14}
          className="block w-full bg-gray-900/50 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-gray-200 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm transition"
          placeholder="000.000.000-00"
        />
      </div>
      
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">
          Telefone (com DDD)
        </label>
        <input
          type="tel"
          name="phone"
          id="phone"
          value={formData.phone}
          onChange={handleChange}
          required
          maxLength={15}
          className="block w-full bg-gray-900/50 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-gray-200 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm transition"
          placeholder="(00) 90000-0000"
        />
      </div>
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
          E-mail
        </label>
        <input
          type="email"
          name="email"
          id="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="block w-full bg-gray-900/50 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-gray-200 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm transition"
          placeholder="seu@email.com"
        />
      </div>
      
      <div>
        <label htmlFor="allergies" className="block text-sm font-medium text-gray-300 mb-1">
          Alergias (Alimentares ou outras)
        </label>
        <textarea
          name="allergies"
          id="allergies"
          rows={3}
          value={formData.allergies}
          onChange={handleChange}
          className="block w-full bg-gray-900/50 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-gray-200 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm transition"
          placeholder="Ex: Amendoim, lactose, poeira..."
        />
         <div className="text-xs text-gray-400 mt-2 h-4">
            {isGenerating ? (
                <span className="animate-pulse">Gerando sugestão de itens...</span>
            ) : (
                formData.itemsToBring && <p>Sugestão: {formData.itemsToBring}</p>
            )}
        </div>
      </div>
      
      <div className="flex items-start">
          <div className="flex items-center h-5">
              <input
                  id="hasInterest"
                  name="hasInterest"
                  type="checkbox"
                  checked={formData.hasInterest}
                  onChange={handleChange}
                  className="focus:ring-amber-500 h-4 w-4 text-amber-600 bg-gray-700 border-gray-600 rounded"
              />
          </div>
          <div className="ml-3 text-sm">
              <label htmlFor="hasInterest" className="font-medium text-gray-300">
                  Tenho interesse em participar do retiro
              </label>
              <p className="text-gray-500">Marcando esta opção, você será notificado sobre as datas.</p>
          </div>
      </div>
      
      {error && <p className="text-red-400 text-sm text-center">{error}</p>}

      <div>
        <button
          type="submit"
          disabled={isSubmitting || isGenerating}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-semibold text-black bg-amber-500 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-amber-400 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
        >
          {isSubmitting ? 'Enviando...' : 'Finalizar Inscrição'}
        </button>
      </div>
    </form>
  );
};

export default RegistrationForm;
