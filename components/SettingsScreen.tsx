
import React, { useState } from 'react';
import { PixSettings } from '../types';
import { ArrowLeftIcon } from './icons';

interface SettingsScreenProps {
  currentSettings: PixSettings;
  onSave: (settings: PixSettings) => void;
  onBack: () => void;
}

const InputField: React.FC<{label: string; id: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder: string}> = ({ label, id, value, onChange, placeholder }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
        <input
            type="text"
            id={id}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full bg-brand-dark-700 border border-brand-dark-600 text-gray-100 px-4 py-3 rounded-lg focus:ring-2 focus:ring-brand-green-light focus:border-brand-green-light outline-none transition"
        />
    </div>
);

const SettingsScreen: React.FC<SettingsScreenProps> = ({ currentSettings, onSave, onBack }) => {
  const [settings, setSettings] = useState<PixSettings>(currentSettings);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setSettings(prev => ({ ...prev, [id]: value }));
  };

  const handleSave = () => {
    onSave(settings);
    setShowSuccess(true);
    setTimeout(() => {
        setShowSuccess(false);
    }, 2000);
  };
  
  const isFormValid = settings.pixKey && settings.recipientName && settings.city;

  return (
    <div className="p-4 flex flex-col h-full min-h-screen">
      <header className="flex items-center mb-6">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-brand-dark-700 transition-colors mr-2">
          <ArrowLeftIcon />
        </button>
        <h1 className="text-2xl font-bold text-brand-green-light">Configurações</h1>
      </header>

      <main className="flex-grow flex flex-col justify-center">
        <div className="space-y-6">
          <InputField 
            label="Chave PIX"
            id="pixKey"
            value={settings.pixKey}
            onChange={handleChange}
            placeholder="Email, CPF, CNPJ ou Telefone"
          />
          <InputField 
            label="Nome do Beneficiário"
            id="recipientName"
            value={settings.recipientName}
            onChange={handleChange}
            placeholder="Seu nome ou da sua empresa"
          />
          <InputField 
            label="Cidade do Beneficiário"
            id="city"
            value={settings.city}
            onChange={handleChange}
            placeholder="Ex: Sao Paulo"
          />
        </div>
      </main>

      <footer className="mt-auto pt-4">
        {showSuccess && <p className="text-sm text-brand-green-light mb-2 text-center">Configurações salvas com sucesso!</p>}
        <button
          onClick={handleSave}
          disabled={!isFormValid}
          className="w-full bg-brand-green hover:bg-brand-green-dark text-white font-bold py-4 px-4 rounded-lg transition-colors disabled:bg-brand-dark-600 disabled:cursor-not-allowed text-lg"
        >
          Salvar
        </button>
      </footer>
    </div>
  );
};

export default SettingsScreen;
