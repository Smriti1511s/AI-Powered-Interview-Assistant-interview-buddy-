import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ConfigProvider } from 'antd';
import { store, persistor } from './app/store';
import { Navbar } from './components/UI/Navbar';
import { Tabs } from './components/UI/Tabs';
import { WelcomeBackModal } from './components/UI/WelcomeBackModal';
import './styles/globals.css';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#667eea',
              colorSuccess: '#52c41a',
              colorWarning: '#faad14',
              colorError: '#ff4d4f',
              borderRadius: 12,
              colorBgContainer: 'rgba(255, 255, 255, 0.9)',
              colorBorder: 'rgba(102, 126, 234, 0.2)',
            },
            components: {
              Card: {
                borderRadiusLG: 16,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              },
              Button: {
                borderRadius: 8,
                controlHeight: 40,
              },
              Table: {
                borderRadius: 12,
                headerBg: 'rgba(102, 126, 234, 0.05)',
              },
            },
          }}
        >
          <div className="app">
            <Navbar />
            <main className="main-content">
              <Tabs />
            </main>
            <WelcomeBackModal />
          </div>
        </ConfigProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
