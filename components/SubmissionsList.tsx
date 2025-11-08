import React from 'react';
import { Submission } from '../types';

interface SubmissionsListProps {
  submissions: Submission[];
}

const DownloadIcon: React.FC<{className: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13.25a.75.75 0 00-1.5 0v4.59L7.3 7.72a.75.75 0 00-1.1 1.02l3.25 4.5a.75.75 0 001.1 0l3.25-4.5a.75.75 0 10-1.1-1.02L10.75 9.34V4.75zM8.75 14a.75.75 0 000 1.5h2.5a.75.75 0 000-1.5h-2.5z" clipRule="evenodd" />
    </svg>
);


const SubmissionsList: React.FC<SubmissionsListProps> = ({ submissions }) => {

  const handleDownloadCSV = () => {
    if (submissions.length === 0) {
      alert('Não há inscrições para baixar.');
      return;
    }

    const headers = [
      'Nome Completo', 'Data de Nascimento', 'CPF', 'Telefone', 'E-mail',
      'Alergias', 'Tem Interesse', 'Precisa Levar (Sugestão IA)'
    ];

    const formatCSVField = (field: any): string => {
      const str = String(field ?? '');
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const csvContent = [
      headers.join(','),
      ...submissions.map(s => [
        formatCSVField(s.fullName),
        formatCSVField(s.dateOfBirth),
        formatCSVField(s.cpf),
        formatCSVField(s.phone),
        formatCSVField(s.email),
        formatCSVField(s.allergies),
        formatCSVField(s.hasInterest ? 'Sim' : 'Não'),
        formatCSVField(s.itemsToBring)
      ].join(','))
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'juref_inscricoes.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-4xl">
      <div className="bg-black/75 backdrop-blur-sm p-6 sm:p-8 rounded-xl shadow-2xl border border-amber-400/30">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-amber-400">Inscrições Recebidas</h2>
            <button
                onClick={handleDownloadCSV}
                className="inline-flex items-center gap-2 px-4 py-2 border border-amber-500 text-sm font-medium rounded-md text-amber-400 hover:bg-amber-500 hover:text-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-amber-400 transition-colors disabled:opacity-50"
                disabled={submissions.length === 0}
            >
                <DownloadIcon className="h-5 w-5" />
                Baixar CSV
            </button>
        </div>
        {submissions.length === 0 ? (
          <p className="text-center text-gray-400 py-8">Nenhuma inscrição foi recebida ainda.</p>
        ) : (
          <div className="space-y-6">
            {submissions.map((submission) => (
              <div key={submission.id} className="bg-gray-900/70 p-5 rounded-lg border border-gray-700 shadow-md">
                <h3 className="text-xl font-bold text-gray-200">{submission.fullName}</h3>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-sm text-gray-300">
                  <p><strong className="font-medium text-gray-400">Data de Nasc.:</strong> {submission.dateOfBirth}</p>
                  <p><strong className="font-medium text-gray-400">CPF:</strong> {submission.cpf}</p>
                  <p><strong className="font-medium text-gray-400">Telefone:</strong> {submission.phone}</p>
                  <p><strong className="font-medium text-gray-400">E-mail:</strong> {submission.email}</p>
                  <p className="md:col-span-2"><strong className="font-medium text-gray-400">Alergias:</strong> {submission.allergies || 'Nenhuma'}</p>
                   {submission.itemsToBring && (
                    <p className="md:col-span-2"><strong className="font-medium text-gray-400">Sugestão (IA):</strong> {submission.itemsToBring}</p>
                  )}
                  <div className="md:col-span-2 mt-2">
                    {submission.hasInterest ? (
                       <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-900 text-green-300 border border-green-700">
                        ✔ Tem interesse no retiro
                       </span>
                    ) : (
                       <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-900 text-red-300 border border-red-700">
                        ✖ Não marcou interesse
                       </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SubmissionsList;