import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, TrendingUp, Users, Globe2, AlertCircle } from 'lucide-react';
import ArticleCard from '../components/ArticleCard';
import FeaturedArticle from '../components/FeaturedArticle';
import { useNews } from '../context/NewsContext';
import { useLanguage } from '../context/LanguageContext';

interface HomePageProps {
  onArticleClick: (article: any) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onArticleClick }) => {
  const { articles, isLoading, lastUpdated, getLocalizedArticles } = useNews();
  const { translations, currentLanguage, getCulturalContext } = useLanguage();
  
  // Get articles in current language
  const localizedArticles = getLocalizedArticles(currentLanguage);
  const displayArticles = localizedArticles.length > 0 ? localizedArticles : articles;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="bbc-text">{translations.loading}</p>
        </div>
      </div>
    );
  }

  const breakingNews = displayArticles.filter(article => 
    article.category === 'breaking' || 
    new Date(article.publishedAt).getTime() > Date.now() - 3600000
  ).slice(0, 5);

  const featuredArticles = displayArticles.slice(0, 3);
  const indiaNews = displayArticles.filter(article => article.category === 'india').slice(0, 6);
  const worldNews = displayArticles.filter(article => article.category === 'world').slice(0, 4);
  const businessNews = displayArticles.filter(article => article.category === 'business').slice(0, 4);
  const sportsNews = displayArticles.filter(article => article.category === 'sports').slice(0, 4);
  
  // Get cultural context for current language
  const culturalContext = getCulturalContext(currentLanguage);

  return (
    <div className={`max-w-7xl mx-auto px-4 py-6 space-y-8 min-h-screen bg-white script-${culturalContext.script.toLowerCase()}`} dir={culturalContext.direction}>
      {/* Breaking News Banner */}
      {breakingNews.length > 0 && (
        <div className="breaking-news-container mb-8 relative overflow-hidden">
          {/* Animated Background */}
          <div className="breaking-news-bg"></div>
          
          {/* Header Section */}
          <div className="breaking-news-header">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="breaking-badge">
                  <div className="breaking-pulse"></div>
                  <AlertCircle className="w-6 h-6" />
                  <span className="breaking-text">BREAKING NEWS</span>
                </div>
                <div className="live-indicator">
                  <div className="live-dot"></div>
                  <span>LIVE</span>
                </div>
              </div>
              <div className="breaking-time">
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>

          {/* Main Breaking Story */}
          {breakingNews[0] && (
            <div className="breaking-main-story">
              <button
                onClick={() => onArticleClick(breakingNews[0])}
                className="breaking-main-card group"
              >
                <div className="flex items-start space-x-6">
                  <img 
                    src={breakingNews[0].imageUrl} 
                    alt={breakingNews[0].title}
                    className="breaking-main-image"
                  />
                  <div className="flex-1">
                    <h2 className="breaking-main-title group-hover:text-red-100 transition-colors">
                      {breakingNews[0].title}
                    </h2>
                    <p className="breaking-main-summary">
                      {breakingNews[0].summary.substring(0, 150)}...
                    </p>
                    <div className="breaking-main-meta">
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        {new Date(breakingNews[0].publishedAt).toLocaleTimeString()}
                      </span>
                      <span className="breaking-source">{breakingNews[0].source}</span>
                    </div>
                  </div>
                </div>
              </button>
            </div>
          )}

          {/* Secondary Breaking Stories */}
          <div className="breaking-secondary-stories">
            <div className="breaking-stories-grid">
              {breakingNews.slice(1, 4).map((article, index) => (
                <button
                  key={article.id}
                  onClick={() => onArticleClick(article)}
                  className="breaking-secondary-card group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="breaking-card-content">
                    <div className="breaking-card-number">{index + 2}</div>
                    <div className="flex-1">
                      <h3 className="breaking-secondary-title group-hover:text-red-100 transition-colors">
                        {article.title}
                      </h3>
                      <div className="breaking-secondary-meta">
                        <span>{new Date(article.publishedAt).toLocaleTimeString()}</span>
                        <span className="breaking-dot">•</span>
                        <span>{article.source}</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Breaking News Ticker */}
          <div className="breaking-ticker">
            <div className="breaking-ticker-content">
              {breakingNews.slice(0, 5).map((article, index) => (
                <span key={article.id} className="breaking-ticker-item">
                  {article.title}
                  {index < 4 && <span className="breaking-ticker-separator">•</span>}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Live News Banner */}
      <section className="mb-8">
        <Link to="/live-news" className="block">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl shadow-2xl overflow-hidden hover:scale-105 transition-transform duration-300">
            <div className="p-8 relative">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="bg-white/20 backdrop-blur-sm p-3 rounded-lg">
                      <Radio className="w-8 h-8 animate-pulse" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold">Real-Time News Feed</h2>
                      <p className="text-green-100 text-sm">Powered by GNews API</p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                      <span className="text-xs font-bold">NEW</span>
                    </div>
                  </div>
                  <p className="text-lg text-green-100 mb-4">
                    Get the latest news from India and around the world with auto-refresh every 2 minutes
                  </p>
                  <div className="flex items-center space-x-6 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                      <span>Auto-Updates</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Globe2 className="w-4 h-4" />
                      <span>9 Categories</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>Real-Time</span>
                    </div>
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="text-6xl font-bold opacity-20">LIVE</div>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </section>

      {/* Featured Stories */}
      <section>
        <div className="bbc-section-header">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="bbc-section-title flex items-center">
              <Globe2 className="w-6 h-6 mr-3" />
              {translations.featuredStories}
            </h2>
          </div>
        </div>
        
        {featuredArticles.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2">
              <FeaturedArticle 
                article={featuredArticles[0]}
                onClick={() => onArticleClick(featuredArticles[0])}
                size="large"
              />
            </div>
            <div className="space-y-6">
              {featuredArticles.slice(1, 3).map(article => (
                <FeaturedArticle
                  key={article.id}
                  article={article}
                  onClick={() => onArticleClick(article)}
                  size="small"
                />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* News Sections Grid */}
      <div className="bbc-grid bbc-grid-main gap-8">
        {/* India News */}
        <section className="bbc-card overflow-hidden">
          <div className="border-b border-gray-200 p-6 bg-gray-50">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold bbc-heading">{translations.india}</h3>
              <Link 
                to="/category/india"
                className="bbc-button-primary px-4 py-2 text-white font-medium text-sm"
              >
                View All
              </Link>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {indiaNews.map(article => (
              <ArticleCard
                key={article.id}
                article={article}
                onClick={() => onArticleClick(article)}
                compact={true}
              />
            ))}
          </div>
        </section>

        {/* World News */}
        <section className="bbc-card overflow-hidden">
          <div className="border-b border-gray-200 p-6 bg-gray-50">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold bbc-heading">{translations.world}</h3>
              <Link 
                to="/category/world"
                className="bbc-button-primary px-4 py-2 text-white font-medium text-sm"
              >
                View All
              </Link>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {worldNews.map(article => (
              <ArticleCard
                key={article.id}
                article={article}
                onClick={() => onArticleClick(article)}
                compact={true}
              />
            ))}
          </div>
        </section>

        {/* Business News */}
        <section className="bbc-card overflow-hidden">
          <div className="border-b border-gray-200 p-6 bg-gray-50">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold bbc-heading">{translations.business}</h3>
              <Link 
                to="/category/business"
                className="bbc-button-primary px-4 py-2 text-white font-medium text-sm"
              >
                View All
              </Link>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {businessNews.map(article => (
              <ArticleCard
                key={article.id}
                article={article}
                onClick={() => onArticleClick(article)}
                compact={true}
              />
            ))}
          </div>
        </section>

        {/* Sports News */}
        <section className="bbc-card overflow-hidden">
          <div className="border-b border-gray-200 p-6 bg-gray-50">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold bbc-heading">{translations.sports}</h3>
              <Link 
                to="/category/sports"
                className="bbc-button-primary px-4 py-2 text-white font-medium text-sm"
              >
                View All
              </Link>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {sportsNews.map(article => (
              <ArticleCard
                key={article.id}
                article={article}
                onClick={() => onArticleClick(article)}
                compact={true}
              />
            ))}
          </div>
        </section>
      </div>

      {/* Stats Footer */}
      <div className="bbc-card p-8 grid grid-cols-2 md:grid-cols-4 gap-6 bg-gray-50">
        <div className="text-center">
          <div className="text-3xl font-bold bbc-heading bbc-accent">{displayArticles.length}</div>
          <div className="bbc-text text-sm">Total Articles</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold bbc-heading bbc-accent">8</div>
          <div className="bbc-text text-sm">Categories</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold bbc-heading bbc-accent">10</div>
          <div className="bbc-text text-sm">Languages</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold bbc-heading bbc-accent">
            <span className="bbc-live">LIVE</span>
          </div>
          <div className="bbc-text text-sm">Real-time Updates</div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;