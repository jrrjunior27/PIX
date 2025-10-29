import React, { useState } from 'react';
import { PixTransaction } from '../types';
import { ArrowLeftIcon, CopyIcon } from './icons';
import { QRCodeSVG as QRCode } from 'qrcode.react';

interface HistoryItemProps {
  transaction: PixTransaction;
}

const HistoryItem: React.FC<HistoryItemProps> = ({ transaction }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);

    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(transaction.brCode).then(() => {
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        });
    };

    const formattedDate = new Date(transaction.date).toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

    const formattedAmount = `R$ ${parseFloat(transaction.amount).toFixed(2).replace('.', ',')}`;

    return (
        <li className="bg-brand-dark-700 rounded-lg mb-3 transition-all">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full text-left p-4 flex justify-between items-center">
                <div>
                    <p className="font-semibold text-gray-200">{formattedAmount}</p>
                    <p className="text-sm text-gray-400">{formattedDate}</p>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-gray-400 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            {isOpen && (
                <div className="p-4 border-t border-brand-dark-600 flex flex-col items-center animate-fade-in">
                    <div className="bg-white p-3 rounded-lg">
                        <QRCode value={transaction.brCode} size={192} level="H" />
                    </div>
                     <div className="mt-4 w-full">
                        <label className="block text-xs font-medium text-gray-400 mb-1">PIX Copia e Cola</label>
                        <div className="relative">
                            <textarea
                            readOnly
                            value={transaction.brCode}
                            className="w-full bg-brand-dark-900 border border-brand-dark-600 text-gray-300 text-xs p-2 rounded-lg resize-none pr-10"
                            rows={3}
                            />
                            <button onClick={handleCopyToClipboard} className="absolute top-2 right-2 p-1 rounded-md hover:bg-brand-dark-600">
                                <CopyIcon />
                            </button>
                        </div>
                        {copySuccess && <p className="text-sm text-brand-green-light mt-2 text-center">Copiado!</p>}
                    </div>
                </div>
            )}
        </li>
    );
};


interface HistoryScreenProps {
  transactions: PixTransaction[];
  onBack: () => void;
}

const HistoryScreen: React.FC<HistoryScreenProps> = ({ transactions, onBack }) => {
  return (
    <div className="p-4 flex flex-col h-full min-h-screen">
      <header className="flex items-center mb-6">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-brand-dark-700 transition-colors mr-2">
          <ArrowLeftIcon />
        </button>
        <h1 className="text-2xl font-bold text-brand-green-light">Histórico</h1>
      </header>
      
      <main className="flex-grow">
        {transactions.length > 0 ? (
          <ul>
            {transactions.map(tx => <HistoryItem key={tx.id} transaction={tx} />)}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="text-gray-500">Nenhum PIX gerado ainda.</p>
            <p className="text-gray-500 text-sm mt-1">Seu histórico aparecerá aqui.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default HistoryScreen;
