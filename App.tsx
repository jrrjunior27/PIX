import React, { useState, useEffect, useCallback } from 'react';
import MainScreen from './components/MainScreen';
import SettingsScreen from './components/SettingsScreen';
import HistoryScreen from './components/HistoryScreen';
import { PixSettings, PixTransaction } from './types';

type Page = 'main' | 'settings' | 'history';

const App: React.FC = () => {
  const [page, setPage] = useState<Page>('main');
  const [settings, setSettings] = useState<PixSettings>({
    pixKey: '',
    recipientName: '',
    city: '',
  });
  const [transactions, setTransactions] = useState<PixTransaction[]>([]);

  useEffect(() => {
    const storedSettings = localStorage.getItem('pixSettings');
    if (storedSettings) {
      setSettings(JSON.parse(storedSettings));
    }
    const storedTransactions = localStorage.getItem('pixTransactions');
    if (storedTransactions) {
      setTransactions(JSON.parse(storedTransactions));
    }
  }, []);

  const handleSaveSettings = useCallback((newSettings: PixSettings) => {
    setSettings(newSettings);
    localStorage.setItem('pixSettings', JSON.stringify(newSettings));
    setPage('main');
  }, []);

  const handleSaveTransaction = useCallback((transactionData: { amount: string; brCode: string }) => {
    setTransactions(prev => {
      const newTransaction: PixTransaction = {
        ...transactionData,
        id: Date.now().toString(),
        date: new Date().toISOString(),
      };
      const updatedTransactions = [newTransaction, ...prev];
      localStorage.setItem('pixTransactions', JSON.stringify(updatedTransactions));
      return updatedTransactions;
    });
  }, []);


  const renderPage = () => {
    switch (page) {
      case 'settings':
        return (
          <SettingsScreen
            currentSettings={settings}
            onSave={handleSaveSettings}
            onBack={() => setPage('main')}
          />
        );
      case 'history':
        return (
            <HistoryScreen
                transactions={transactions}
                onBack={() => setPage('main')}
            />
        );
      case 'main':
      default:
        return (
          <MainScreen
            settings={settings}
            onNavigateToSettings={() => setPage('settings')}
            onNavigateToHistory={() => setPage('history')}
            onSaveTransaction={handleSaveTransaction}
          />
        );
    }
  }

  return (
    <div className="min-h-screen bg-brand-dark-900 text-gray-100 font-sans">
      <div className="max-w-md mx-auto bg-brand-dark-800 shadow-lg min-h-screen">
        {renderPage()}
      </div>
    </div>
  );
};

export default App;
