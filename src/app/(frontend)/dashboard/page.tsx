"use client";

import { useState } from 'react';
import { 
  FileText, Globe, Search, Menu, X, User, 
  BookOpen, Code, Brain, Layout, 
  FileQuestion, Presentation, VideoIcon, Link, ArrowRight
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  
  // Funkcja do nawigacji
  const navigateTo = (path: string) => {
    // W rzeczywistej aplikacji będzie tu router.push(`/${path}`)
    console.log(`Navigating to: ${path}`);
  };
  
  // Dane dla kart funkcji
  const featuresData = [
    {
      id: 'notes',
      title: 'Notatki',
      description: 'Twórz, edytuj i zarządzaj notatkami z pomocą AI.',
      icon: <FileText className="w-8 h-8 text-blue-500" />,
      color: 'from-blue-500 to-sky-400',
      hoverColor: 'from-blue-600 to-sky-500',
      path: 'notes'
    },
    {
      id: 'scraping',
      title: 'Scrapowanie Stron',
      description: 'Automatycznie pobieraj i analizuj treści ze stron internetowych.',
      icon: <Link className="w-8 h-8 text-green-500" />,
      color: 'from-green-500 to-emerald-400',
      hoverColor: 'from-green-600 to-emerald-500',
      path: 'scraping'
    },
    {
      id: 'chat',
      title: 'Chat z Notatek',
      description: 'Zadawaj pytania i otrzymuj odpowiedzi na podstawie swoich notatek.',
      icon: <FileQuestion className="w-8 h-8 text-purple-500" />,
      color: 'from-purple-500 to-violet-400',
      hoverColor: 'from-purple-600 to-violet-500', 
      path: 'chat'
    },
    {
      id: 'presentations',
      title: 'Tworzenie Prezentacji',
      description: 'Generuj profesjonalne prezentacje na podstawie notatek i tematów.',
      icon: <Presentation className="w-8 h-8 text-amber-500" />,
      color: 'from-amber-500 to-yellow-400',
      hoverColor: 'from-amber-600 to-yellow-500',
      path: 'presentations'
    },
    {
      id: 'transcription',
      title: 'Transkrypcje Wideo',
      description: 'Automatycznie konwertuj filmy na tekst z możliwością edycji.',
      icon: <VideoIcon className="w-8 h-8 text-red-500" />,
      color: 'from-red-500 to-rose-400',
      hoverColor: 'from-red-600 to-rose-500',
      path: 'transcription'
    }
  ];
  
  // Ostatnio używane funkcje (przykładowe dane)
  const recentActivities = [
    { 
      id: 1, 
      type: 'note', 
      title: 'Podstawy programowania w JavaScript',
      date: '07-05-2025',
      icon: <FileText className="w-5 h-5 text-blue-500" /> 
    },
    { 
      id: 2, 
      type: 'presentation', 
      title: 'Prezentacja o odnawialnych źródłach energii',
      date: '06-05-2025',
      icon: <Presentation className="w-5 h-5 text-amber-500" /> 
    },
    { 
      id: 3, 
      type: 'transcription', 
      title: 'Wykład o sztucznej inteligencji',
      date: '05-05-2025',
      icon: <VideoIcon className="w-5 h-5 text-red-500" /> 
    }
  ];
  
  // Zalecane treści (przykładowe)
  const recommendedContent = [
    { 
      id: 1, 
      title: 'Zaawansowane techniki analizy danych',
      type: 'Publiczna notatka',
      author: 'Jan Kowalski',
      views: 1243,
      icon: <Globe className="w-5 h-5 text-blue-500" /> 
    },
    { 
      id: 2, 
      title: 'Wprowadzenie do uczenia maszynowego',
      type: 'Publiczna notatka',
      author: 'Anna Nowak',
      views: 892,
      icon: <Globe className="w-5 h-5 text-blue-500" /> 
    },
    { 
      id: 3, 
      title: 'Historia komputeryzacji - przegląd',
      type: 'Prezentacja',
      author: 'Piotr Wiśniewski',
      views: 567,
      icon: <Presentation className="w-5 h-5 text-amber-500" /> 
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-900 text-white">
      {/* Nawigacja */}
      <nav className="sticky top-0 z-50 backdrop-blur-lg bg-slate-900/80 py-4 border-b border-slate-800/70">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-blue-600">
            AI EduPlatform
          </div>
          
          {/* Menu na komputery */}
          <div className="hidden md:flex space-x-8">
            <button className="text-white hover:text-blue-400 transition-colors">Dashboard</button>
            <button onClick={() => navigateTo('notes')} className="text-gray-300 hover:text-white transition-colors">Notatki</button>
            <button onClick={() => navigateTo('profile')} className="text-gray-300 hover:text-white transition-colors">Profil</button>
          </div>
          
          {/* Menu mobilne */}
          <div className="md:hidden">
            <button 
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-300 hover:text-white"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="hidden md:block relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Szukaj..."
                className="bg-slate-800 border border-slate-700 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 w-40"
              />
            </div>
            <button className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600">
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Menu mobilne rozwinięte */}
        {menuOpen && (
          <div className="md:hidden bg-slate-900 py-4 px-6 mt-4 rounded-lg shadow-lg">
            <div className="flex flex-col space-y-4">
              <button className="text-white hover:text-blue-400 transition-colors">Dashboard</button>
              <button onClick={() => navigateTo('notes')} className="text-gray-300 hover:text-white transition-colors">Notatki</button>
              <button onClick={() => navigateTo('profile')} className="text-gray-300 hover:text-white transition-colors">Profil</button>
              
              <div className="relative mt-2">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Szukaj..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Główna zawartość */}
      <main className="container mx-auto px-6 py-8">
        {/* Powitanie */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2">Witaj, <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-sky-500">Użytkowniku</span>!</h1>
          <p className="text-gray-400">Co chcesz dzisiaj stworzyć? Wybierz jedną z naszych inteligentnych funkcji.</p>
        </div>

        {/* Główne karty funkcji */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
          {featuresData.map((feature) => (
            <div 
              key={feature.id}
              onClick={() => navigateTo(feature.path)}
              className="group relative overflow-hidden rounded-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer h-56 md:h-64"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black opacity-95 group-hover:opacity-90 transition-opacity"></div>
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 bg-gradient-to-br ${feature.color} transition-opacity duration-300`}></div>
              
              {/* Border gradient */}
              <div className={`absolute inset-0 p-0.5 rounded-xl bg-gradient-to-br ${feature.color} opacity-50 group-hover:opacity-100 transition-opacity duration-300`}></div>
              
              <div className="relative p-6 h-full flex flex-col">
                <div className="mb-4 bg-gray-800/50 p-3 rounded-lg w-max">
                  {feature.icon}
                </div>
                
                <h3 className="text-xl font-bold mb-2">
                  {feature.title}
                </h3>
                
                <p className="text-gray-400 text-sm mb-6 flex-grow">
                  {feature.description}
                </p>
                
                <div className="flex items-center mt-auto text-sm font-medium text-blue-400 group-hover:text-blue-300">
                  <span>Otwórz</span>
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Sekcja z dwiema kolumnami (Ostatnie aktywności + Rekomendowane treści) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Ostatnie aktywności */}
          <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700/50">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <Layout className="w-5 h-5 mr-2 text-blue-500" />
              Ostatnie aktywności
            </h2>
            
            <div className="space-y-3">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center p-3 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors cursor-pointer">
                  <div className="mr-3 p-2 bg-slate-700 rounded-lg">
                    {activity.icon}
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-medium text-sm">{activity.title}</h4>
                    <p className="text-xs text-gray-400">{activity.date}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </div>
              ))}
              
              <button className="w-full text-center py-2 text-sm text-blue-400 hover:text-blue-300">
                Zobacz wszystkie aktywności
              </button>
            </div>
          </div>
          
          {/* Zalecane treści */}
          <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700/50">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <Brain className="w-5 h-5 mr-2 text-purple-500" />
              Rekomendowane dla Ciebie
            </h2>
            
            <div className="space-y-3">
              {recommendedContent.map((content) => (
                <div key={content.id} className="flex items-center p-3 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors cursor-pointer">
                  <div className="mr-3 p-2 bg-slate-700 rounded-lg">
                    {content.icon}
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-medium text-sm">{content.title}</h4>
                    <div className="flex items-center text-xs text-gray-400 mt-1">
                      <span>{content.type} • {content.author}</span>
                      <span className="ml-auto">{content.views} wyświetleń</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </div>
              ))}
              
              <button className="w-full text-center py-2 text-sm text-blue-400 hover:text-blue-300">
                Zobacz więcej rekomendacji
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Stopka */}
      <footer className="py-6 border-t border-slate-800 mt-12">
        <div className="container mx-auto px-6 text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} AI EduPlatform. Wszelkie prawa zastrzeżone.</p>
        </div>
      </footer>
    </div>
  );
}