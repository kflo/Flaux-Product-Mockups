
import React, { useState } from 'react';
import ImageEditor from './components/ImageEditor';
import ProductMockup from './components/ProductMockup';
import ImageGenerator from './components/ImageGenerator';

type Tab = 'mockup' | 'editor' | 'generator';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('mockup');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'mockup':
        return <ProductMockup />;
      case 'editor':
        return <ImageEditor />;
      case 'generator':
        return <ImageGenerator />;
      default:
        return null;
    }
  };

  const TabButton = ({ tab, label }: { tab: Tab; label: string }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
        activeTab === tab
          ? 'bg-indigo-600 text-white'
          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <div className="container mx-auto p-4 md:p-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-500 to-blue-500">
            Gemini Mockup & Image Studio
          </h1>
          <p className="mt-2 text-gray-400">
            Your AI-powered creative toolkit for images and mockups.
          </p>
        </header>

        <nav className="flex justify-center space-x-2 md:space-x-4 mb-8">
          <TabButton tab="mockup" label="Product Mockups" />
          <TabButton tab="editor" label="Image Editor" />
          <TabButton tab="generator" label="Image Generator" />
        </nav>

        <main>
          {renderTabContent()}
        </main>
      </div>
       <footer className="text-center p-4 mt-8 text-xs text-gray-500">
          <p>Powered by Google Gemini. UI/UX designed for an optimal creative experience.</p>
        </footer>
    </div>
  );
};

export default App;
