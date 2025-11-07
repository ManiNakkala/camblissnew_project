import React, { useState, useEffect } from 'react';
import { Clock, RefreshCw, AlertCircle, TrendingUp, ExternalLink } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface GNewsArticle {
  title: string;
  description: string;
  content: string;
  url: string;
  image: string;
  publishedAt: string;
  source: {
    name: string;
    url: string;
  };
}

interface LiveNewsFeedProps {
  category?: string;
  maxArticles?: number;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

const LiveNewsFeed: React.FC<LiveNewsFeedProps> = ({
  category = 'general',
  maxArticles = 10,
  autoRefresh = true,
  refreshInterval = 120000 // 2 minutes
}) => {
  const [articles, setArticles] = useState<GNewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { currentLanguage } = useLanguage();

  const fetchNews = async (showLoader = true) => {
    try {
      if (showLoader) {
        setIsLoading(true);
      } else {
        setIsRefreshing(true);
      }
      setError(null);

      const langMap: Record<string, string> = {
        'en': 'en',
        'hi': 'hi',
        'bn': 'bn',
        'ta': 'ta',
        'te': 'te',
        'gu': 'gu',
        'mr': 'mr',
        'kn': 'kn',
        'pa': 'pa',
        'or': 'or'
      };

      const apiLang = langMap[currentLanguage] || 'en';

      const response = await fetch(
        `http://localhost:5000/api/news?category=${category}&country=in&lang=${apiLang}&max=${maxArticles}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch news');
      }

      const data = await response.json();

      if (data.success && data.articles) {
        setArticles(data.articles);
        setLastUpdated(new Date());
      } else {
        throw new Error(data.error || 'Failed to load news');
      }
    } catch (err: any) {
      console.error('Error fetching news:', err);
      setError(err.message || 'Failed to load news. Please try again later.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNews(true);

    if (autoRefresh) {
      const interval = setInterval(() => {
        fetchNews(false);
      }, refreshInterval);

      return () => clearInterval(interval);
    }
  }, [category, currentLanguage, autoRefresh, refreshInterval]);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const handleManualRefresh = () => {
    fetchNews(false);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
            <TrendingUp className="w-6 h-6 text-red-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-gray-600 font-medium">Fetching latest news...</p>
          <p className="text-sm text-gray-500">Loading real-time updates from GNews</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="bg-red-100 rounded-full p-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Failed to Load News</h3>
          <p className="text-gray-600 text-center">{error}</p>
          <button
            onClick={handleManualRefresh}
            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-2 rounded-lg font-medium transition-all flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold">Live News Feed</h2>
              <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold">
                LIVE
              </div>
            </div>
            {lastUpdated && (
              <div className="flex items-center space-x-2 text-red-100 text-sm">
                <Clock className="w-4 h-4" />
                <span>
                  Last updated: {lastUpdated.toLocaleTimeString()}
                  {autoRefresh && ` • Auto-refresh every ${refreshInterval / 60000} min`}
                </span>
              </div>
            )}
          </div>
          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm p-3 rounded-lg transition-all disabled:opacity-50"
            title="Refresh news"
          >
            <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Articles */}
      <div className="divide-y divide-gray-200">
        {articles.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No articles available at the moment
          </div>
        ) : (
          articles.map((article, index) => (
            <article
              key={index}
              className="p-6 hover:bg-gray-50 transition-colors group"
            >
              <div className="flex space-x-4">
                {article.image && (
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-32 h-24 object-cover rounded-lg flex-shrink-0 group-hover:scale-105 transition-transform"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded">
                      {article.source.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatTimeAgo(article.publishedAt)}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
                    {article.title}
                  </h3>

                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {article.description}
                  </p>

                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 text-red-600 hover:text-red-700 font-medium text-sm transition-colors"
                  >
                    <span>Read full article</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </article>
          ))
        )}
      </div>

      {/* Footer */}
      {articles.length > 0 && (
        <div className="bg-gray-50 border-t border-gray-200 p-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Showing {articles.length} latest articles</span>
            </div>
            <span className="text-xs">Powered by GNews API</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveNewsFeed;
