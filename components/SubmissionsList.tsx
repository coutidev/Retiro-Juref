import React from 'react';
import { Submission } from '../types';

interface SubmissionsListProps {
  submissions: Submission[];
}

// --- Ícones para melhor visualização ---
const DownloadIcon: React.FC<{className: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13.25a.75.75 0 00-1.5 0v4.59L7.3 7.72a.75.75 0 00-1.1 1.02l3.25 4.5a.75.75 0 001.1 0l3.25-4.5a.75.75 0 10-1.1-1.02L10.75 9.34V4.75zM8.75 14a.75.75 0 000 1.5h2.5a.75.75 0 000-1.5h-2.5z" clipRule="evenodd" />
    </svg>
);
const EmailIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.625a2.25 2.25 0 0 1-2.36 0l-7.5-4.625A2.25 2.25 0 0 1 2.25 6.993V6.75" /></svg>
);
const PhoneIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" /></svg>
);
const BirthdayIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a2.25 2.25 0 0 1-2.25 2.25H5.25a2.25 2.25 0 0 1-2.25-2.25v-8.25M12 4.875A3.375 3.375 0 0 0 12 12m0 0a3.375 3.375 0 0 0 0 7.125m-3.375 0h6.75M12 21.75c.621 0 1.125-.504 1.125-1.125V18.375m-2.25 0v2.25c0 .621.504 1.125 1.125 1.125Z" /></svg>
);
const AllergyIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" /></svg>
);

// --- Componente para item de informação ---
const InfoItem: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
    <div className="flex items-center gap-3">
        <div className="flex-shrink-0 text-amber-400">{icon}</div>
        <div>
            <p className="text-xs text-gray-400">{label}</p>
            <p className="text-sm font-medium text-gray-200">{value}</p>
        </div>
    </div>
);


const SubmissionsList: React.FC<SubmissionsListProps> = ({ submissions }) => {
  const handleDownloadCSV = () => {
    if (submissions.length === 0) {
      alert('Não há inscrições para baixar.');
      return;
    }

    const headers = [ 'Nome Completo', 'Data de Nascimento', 'CPF', 'Telefone', 'E-mail', 'Alergias', 'Tem Interesse', 'Precisa Levar (Sugestão IA)' ];
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
              <div key={submission.id} className="bg-gray-900/70 p-5 rounded-lg border border-gray-700 shadow-md transition-all duration-300 hover:border-amber-400/50 hover:shadow-amber-500/10">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-gray-700 pb-4 mb-4">
                    <div>
                        <h3 className="text-xl font-bold text-amber-300">{submission.fullName}</h3>
                        <p className="text-sm text-gray-400 font-mono tracking-wider">{submission.cpf}</p>
                    </div>
                    <div className="mt-3 sm:mt-0">
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
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    <InfoItem icon={<EmailIcon className="w-5 h-5"/>} label="E-mail" value={submission.email} />
                    <InfoItem icon={<PhoneIcon className="w-5 h-5"/>} label="Telefone" value={submission.phone} />
                    <InfoItem icon={<BirthdayIcon className="w-5 h-5"/>} label="Data de Nascimento" value={submission.dateOfBirth} />
                </div>
                
                <div className="mt-5 pt-4 border-t border-gray-800">
                    <InfoItem icon={<AllergyIcon className="w-5 h-5"/>} label="Alergias Declaradas" value={submission.allergies || 'Nenhuma'} />
                </div>

                {submission.itemsToBring && (
                    <div className="mt-4 pt-4 border-t border-gray-800">
                        <p className="text-xs text-gray-400 mb-1">Sugestão de Itens (IA)</p>
                        <p className="text-sm font-medium text-amber-200 italic bg-amber-900/20 p-3 rounded-md">"{submission.itemsToBring}"</p>
                    </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SubmissionsList;