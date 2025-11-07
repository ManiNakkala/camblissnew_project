import React, { useState } from 'react';
import { Radio, Filter, Globe2 } from 'lucide-react';
import LiveNewsFeed from '../components/LiveNewsFeed';
import { useLanguage } from '../context/LanguageContext';

const LiveNewsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('general');
  const { currentLanguage } = useLanguage();

  const categories = [
    { id: 'general', name: 'General', icon: Globe2 },
    { id: 'business', name: 'Business', icon: '💼' },
    { id: 'entertainment', name: 'Entertainment', icon: '🎬' },
    { id: 'health', name: 'Health', icon: '🏥' },
    { id: 'science', name: 'Science', icon: '🔬' },
    { id: 'sports', name: 'Sports', icon: '⚽' },
    { id: 'technology', name: 'Technology', icon: '💻' },
    { id: 'nation', name: 'Nation', icon: '🇮🇳' },
    { id: 'world', name: 'World', icon: '🌍' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <div className="inline-flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 mb-4">
              <Radio className="w-5 h-5 mr-2 animate-pulse" />
              <span className="font-semibold text-sm">LIVE NEWS UPDATES</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Real-Time News Feed
            </h1>
            <p className="text-xl text-red-100 max-w-2xl mx-auto">
              Stay updated with the latest news from India and around the world. Auto-refreshes every 2 minutes.
            </p>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Filter by Category</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`p-3 rounded-lg text-center transition-all ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg scale-105'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                <div className="text-2xl mb-1">
                  {typeof category.icon === 'string' ? category.icon : <category.icon className="w-6 h-6 mx-auto" />}
                </div>
                <div className="text-xs font-semibold">{category.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Live News Feed */}
        <LiveNewsFeed
          key={`${selectedCategory}-${currentLanguage}`}
          category={selectedCategory}
          maxArticles={20}
          autoRefresh={true}
          refreshInterval={120000}
        />

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <Radio className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Auto-Refresh</h3>
            <p className="text-gray-600 text-sm">
              News updates automatically every 2 minutes to keep you informed with the latest headlines
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <Globe2 className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Multiple Languages</h3>
            <p className="text-gray-600 text-sm">
              Get news in your preferred language including English, Hindi, and 8 other Indian languages
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="bg-orange-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <Filter className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Category Filters</h3>
            <p className="text-gray-600 text-sm">
              Filter news by 9 different categories including business, sports, technology, and more
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveNewsPage;
