import React from 'react';
import RegistrationForm from './RegistrationForm';
import { NewSubmission } from '../types';

interface RegistrationPageProps {
  onSubmit: (submission: NewSubmission) => void;
}

const RegistrationPage: React.FC<RegistrationPageProps> = ({ onSubmit }) => {
  return (
    <div className="w-full max-w-lg">
      <div className="bg-black/75 backdrop-blur-sm p-6 sm:p-8 rounded-xl shadow-2xl border border-amber-400/30">
        <h2 className="text-2xl font-semibold mb-2 text-gray-100">Inscrição para o Retiro</h2>
        <p className="text-gray-400 mb-6">Preencha seus dados abaixo para registrar seu interesse.</p>
        <RegistrationForm onSubmit={onSubmit} />
      </div>
    </div>
  );
};

export default RegistrationPage;