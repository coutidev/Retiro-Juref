// Fix: Added reference to node types to support `process.env` for API key access, as required by guidelines.
/// <reference types="node" />

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NewSubmission } from '../types';
import { GoogleGenAI } from '@google/genai';

interface RegistrationFormProps {
  onSubmit: (submission: NewSubmission) => void;
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
      // Fix: Switched from import.meta.env.VITE_API_KEY to process.env.API_KEY to align with guidelines and fix the TypeScript error.
      if (formData.allergies.trim() === '' || !process.env.API_KEY) {
        if (!process.env.API_KEY) {
          console.warn("API_KEY não está definida. A funcionalidade de IA está desabilitada.");
        }
        if (!isCancelled) {
          setFormData(prev => ({ ...prev, itemsToBring: '' }));
          setIsGenerating(false);
        }
        return;
      }

      setIsGenerating(true);
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        const prompt = `Baseado nas seguintes alergias e condições de saúde de uma pessoa que irá para um retiro de 3 dias em um local rural, sugira itens essenciais que ela não pode esquecer de levar (ex: medicamentos específicos, alimentos alternativos, etc.). Alergias/Condições: "${formData.allergies}". Responda com uma lista curta e objetiva, separada por vírgulas. Se as informações não exigirem itens especiais, retorne uma string vazia.`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });
        
        if (!isCancelled) {
          const suggestedItems = response.text.trim();
          setFormData(prev => ({ ...prev, itemsToBring: suggestedItems }));
        }
      } catch (e) {
        console.error("Error generating suggestions:", e);
        if (!isCancelled) {
          setFormData(prev => ({...prev, itemsToBring: 'Não foi possível gerar sugestões.'}));
        }
      } finally {
        if (!isCancelled) {
          setIsGenerating(false);
        }
      }
    };

    const handler = setTimeout(() => {
      generateItemsToBring();
    }, 1000);

    return () => {
      isCancelled = true;
      clearTimeout(handler);
    };
  }, [formData.allergies]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'phone') {
        setFormData(prev => ({ ...prev, [name]: formatPhoneNumber(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!formData.fullName || !formData.dateOfBirth || !formData.email || !formData.cpf || !formData.phone) {
      setError("Por favor, preencha todos os campos obrigatórios.");
      setIsSubmitting(false);
      return;
    }
    
    onSubmit(formData);
    navigate('/success');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-300">Nome Completo</label>
        <input type="text" name="fullName" id="fullName" value={formData.fullName} onChange={handleChange} required className="mt-1 block w-full bg-gray-900/50 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-gray-200 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-300">Data de Nascimento</label>
          <input type="date" name="dateOfBirth" id="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required max={today} className="mt-1 block w-full bg-gray-900/50 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-gray-200 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm" style={{ colorScheme: 'dark' }}/>
        </div>
        <div>
          <label htmlFor="cpf" className="block text-sm font-medium text-gray-300">CPF</label>
          <input type="text" name="cpf" id="cpf" value={formData.cpf} onChange={handleChange} required placeholder="000.000.000-00" className="mt-1 block w-full bg-gray-900/50 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-gray-200 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm" />
        </div>
      </div>
      
       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-300">Telefone / WhatsApp</label>
            <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleChange} required placeholder="(00) 00000-0000" maxLength={15} className="mt-1 block w-full bg-gray-900/50 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-gray-200 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm" />
        </div>
        <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">E-mail</label>
            <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full bg-gray-900/50 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-gray-200 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm" />
        </div>
      </div>

      <div>
        <label htmlFor="allergies" className="block text-sm font-medium text-gray-300">Possui alguma alergia ou condição de saúde?</label>
        <textarea name="allergies" id="allergies" rows={3} value={formData.allergies} onChange={handleChange} placeholder="Ex: alergia a amendoim, intolerância à lactose, diabetes..." className="mt-1 block w-full bg-gray-900/50 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-gray-200 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm" />
        <p className="mt-1 text-xs text-gray-500">Se não houver, deixe em branco.</p>
      </div>
      
      {(isGenerating || formData.itemsToBring) && (
        <div className="p-4 rounded-md bg-gray-900/70 border border-gray-700">
          <h4 className="text-sm font-medium text-gray-400">Sugestão de itens a levar (gerado por IA):</h4>
          {isGenerating ? (
            <p className="text-sm text-amber-400 animate-pulse mt-1">Analisando suas informações...</p>
          ) : (
            <p className="text-sm text-gray-300 mt-1">{formData.itemsToBring}</p>
          )}
        </div>
      )}

      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input id="hasInterest" name="hasInterest" type="checkbox" checked={formData.hasInterest} onChange={handleChange} className="focus:ring-amber-500 h-4 w-4 text-amber-600 border-gray-600 rounded bg-gray-800" />
        </div>
        <div className="ml-3 text-sm">
          <label htmlFor="hasInterest" className="font-medium text-gray-300">Tenho interesse em participar do retiro</label>
          <p className="text-gray-500">Marcando esta opção você será avisado sobre datas e valores.</p>
        </div>
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div>
        <button type="submit" disabled={isSubmitting || isGenerating} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-semibold text-black bg-amber-500 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-amber-400 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out">
          {isSubmitting ? 'Enviando...' : (isGenerating ? 'Aguarde a IA...' : 'Registrar Interesse')}
        </button>
      </div>
    </form>
  );
};

export default RegistrationForm;