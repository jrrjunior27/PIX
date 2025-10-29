import React, { useState, useMemo } from 'react';
import { QRCodeSVG as QRCode } from 'qrcode.react';
import { PixSettings } from '../types';
import { generateBRCode } from '../services/pixService';
import { SettingsIcon, CopyIcon, HistoryIcon } from './icons';

interface MainScreenProps {
  settings: PixSettings;
  onNavigateToSettings: () => void;
  onNavigateToHistory: () => void;
  onSaveTransaction: (transaction: { amount: string, brCode: string }) => void;
}

const MainScreen: React.FC<MainScreenProps> = ({ settings, onNavigateToSettings, onNavigateToHistory, onSaveTransaction }) => {
  const [amount, setAmount] = useState('');
  const [brCode, setBrCode] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  const isSettingsValid = useMemo(() => {
    return settings.pixKey && settings.recipientName && settings.city;
  }, [settings]);

  const handleGenerate = () => {
    const numericAmount = parseFloat(amount.replace(',', '.')).toFixed(2);
    if (!isSettingsValid || isNaN(parseFloat(numericAmount)) || parseFloat(numericAmount) <= 0) {
      return;
    }
    const generatedCode = generateBRCode(settings, numericAmount);
    setBrCode(generatedCode);
    onSaveTransaction({ amount: numericAmount, brCode: generatedCode });
  };
  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    value = value.replace(/\D/g, ''); // Remove all non-digits
    value = (parseInt(value, 10) / 100).toFixed(2);
    if(value === "NaN") value = "";
    else value = value.replace('.', ',');

    setAmount(value);
    setBrCode(null);
  };
  
  const handleCopyToClipboard = () => {
    if (brCode) {
      navigator.clipboard.writeText(brCode).then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      });
    }
  };

  return (
    <div className="p-4 flex flex-col h-full min-h-screen">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-brand-green-light">Gerador PIX</h1>
        <div className="flex items-center space-x-2">
            <button onClick={onNavigateToHistory} className="p-2 rounded-full hover:bg-brand-dark-700 transition-colors">
              <HistoryIcon />
            </button>
            <button onClick={onNavigateToSettings} className="p-2 rounded-full hover:bg-brand-dark-700 transition-colors">
              <SettingsIcon />
            </button>
        </div>
      </header>

      <main className="flex-grow flex flex-col justify-center">
        {!isSettingsValid ? (
          <div className="text-center p-6 bg-brand-dark-700 rounded-lg">
            <p className="text-gray-300 mb-4">Bem-vindo! Por favor, configure sua chave PIX para começar.</p>
            <button
              onClick={onNavigateToSettings}
              className="w-full bg-brand-green hover:bg-brand-green-dark text-white font-bold py-3 px-4 rounded-lg transition-colors"
            >
              Ir para Configurações
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-2">Valor da cobrança (R$)</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">R$</span>
                <input
                  type="text"
                  id="amount"
                  value={amount}
                  onChange={handleAmountChange}
                  placeholder="0,00"
                  className="w-full bg-brand-dark-700 border border-brand-dark-600 text-gray-100 text-2xl pl-10 pr-4 py-3 rounded-lg focus:ring-2 focus:ring-brand-green-light focus:border-brand-green-light outline-none transition"
                />
              </div>
            </div>
            
            {brCode ? (
              <div className="bg-brand-dark-700 p-6 rounded-lg flex flex-col items-center animate-fade-in">
                <div className="bg-white p-4 rounded-lg">
                  <QRCode value={brCode} size={256} level="H" />
                </div>
                <p className="mt-4 text-center text-gray-300 font-semibold">{settings.recipientName}</p>
                <p className="text-sm text-gray-400">Valor: R$ {parseFloat(amount.replace(',', '.')).toFixed(2).replace('.', ',')}</p>
                
                <div className="mt-6 w-full">
                  <label className="block text-xs font-medium text-gray-400 mb-1">PIX Copia e Cola</label>
                  <div className="relative">
                    <textarea
                      readOnly
                      value={brCode}
                      className="w-full bg-brand-dark-900 border border-brand-dark-600 text-gray-300 text-xs p-2 rounded-lg resize-none pr-10"
                      rows={4}
                    />
                    <button onClick={handleCopyToClipboard} className="absolute top-2 right-2 p-1 rounded-md hover:bg-brand-dark-600">
                       <CopyIcon />
                    </button>
                  </div>
                  {copySuccess && <p className="text-sm text-brand-green-light mt-2 text-center">Copiado para a área de transferência!</p>}
                </div>
              </div>
            ) : (
                 <div className="h-[430px] flex items-center justify-center">
                    <p className="text-gray-500">Insira um valor e clique em gerar.</p>
                </div>
            )}
          </div>
        )}
      </main>
      
       {isSettingsValid && (
         <footer className="mt-auto pt-4">
            <button
              onClick={handleGenerate}
              disabled={!amount || parseFloat(amount.replace(',', '.')) <= 0}
              className="w-full bg-brand-green hover:bg-brand-green-dark text-white font-bold py-4 px-4 rounded-lg transition-colors disabled:bg-brand-dark-600 disabled:cursor-not-allowed text-lg"
            >
              {brCode ? 'Gerar Novo QR Code' : 'Gerar QR Code'}
            </button>
         </footer>
       )}
    </div>
  );
};

export default MainScreen;
