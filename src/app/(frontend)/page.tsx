"use client";

import { useState } from 'react';
import { ChevronRight, BookOpen, Code, Globe, Brain, BookMarked, FileText, Menu, X } from 'lucide-react';
import { JSX } from 'react/jsx-runtime';

export default function HomePagePreview() {
  const [menuOpen, setMenuOpen] = useState(false);

  // Dane przedmiotów
  const subjectsData = [
    {
      id: 'math',
      title: 'Matematyka',
      description: 'Odkrywaj świat liczb, funkcji i geometrii z pomocą AI.',
      color: 'from-blue-500 to-sky-400',
      hoverColor: 'from-blue-600 to-sky-500',
      textColor: 'text-blue-500',
      icon: <Brain className="w-6 h-6" />,
    },
    {
      id: 'programming',
      title: 'Programowanie',
      description: 'Naucz się kodować i twórz własne projekty z inteligentnym asystentem.',
      color: 'from-green-500 to-emerald-400',
      hoverColor: 'from-green-600 to-emerald-500',
      textColor: 'text-green-500',
      icon: <Code className="w-6 h-6" />,
    },
    {
      id: 'english',
      title: 'Angielski',
      description: 'Popraw swoje umiejętności językowe, od gramatyki po konwersacje.',
      color: 'from-purple-500 to-violet-400',
      hoverColor: 'from-purple-600 to-violet-500',
      textColor: 'text-purple-500',
      icon: <Globe className="w-6 h-6" />,
    },
  ];

  // Dane narzędzi
  const toolsData = [
    {
      id: 'quizzes',
      title: 'Quizy / Sprawdziany',
      description: 'Sprawdź swoją wiedzę i utrwalaj materiał poprzez interaktywne quizy.',
      color: 'from-amber-500 to-yellow-400',
      hoverColor: 'from-amber-600 to-yellow-500',
      textColor: 'text-amber-500',
      icon: <Brain className="w-6 h-6" />,
    },
    {
      id: 'materials',
      title: 'Materiały Edukacyjne',
      description: 'Dostęp do dodatkowych zasobów, notatek i artykułów wspierających naukę.',
      color: 'from-red-500 to-rose-400',
      hoverColor: 'from-red-600 to-rose-500',
      textColor: 'text-red-500',
      icon: <FileText className="w-6 h-6" />,
    },
  ];

  // Sekcja funkcji dodatkowych
  const featuresData = [
    {
      id: 'personalized',
      title: 'Spersonalizowana nauka',
      description: 'Nasz system AI dostosowuje materiały do Twojego stylu uczenia się i tempa.',
      icon: <BookOpen className="w-12 h-12 text-indigo-500" />,
    },
    {
      id: 'interactive',
      title: 'Interaktywne ćwiczenia',
      description: 'Ucz się przez praktykę dzięki dynamicznym zadaniom z natychmiastową informacją zwrotną.',
      icon: <BookMarked className="w-12 h-12 text-emerald-500" />,
    },
    {
      id: 'progress',
      title: 'Śledzenie postępów',
      description: 'Monitoruj swój rozwój i osiągnięcia dzięki szczegółowym statystykom.',
      icon: <Brain className="w-12 h-12 text-blue-500" />,
    },
  ];

  // Funkcja pomocnicza do tworzenia kart przedmiotów
  interface Subject {
    id: string;
    title: string;
    description: string;
    color: string;
    hoverColor: string;
    textColor: string;
    icon: JSX.Element;
  }

  const SubjectCard = ({ subject }: { subject: Subject }) => (
    <div className="group relative overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black opacity-95 group-hover:opacity-90 transition-opacity"></div>
      <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-gradient-to-br transition-opacity duration-300"></div>
      
      {/* Border gradient */}
      <div className="absolute inset-0 p-0.5 rounded-2xl bg-gradient-to-br opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="relative p-8 h-full flex flex-col">
        <div className="mb-6 flex items-center">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${subject.color} shadow-lg transition-all duration-300 group-hover:scale-110`}>
            {subject.icon}
          </div>
          <div className="ml-4 h-px flex-1 bg-gradient-to-r from-gray-700 to-transparent"></div>
        </div>
        
        <h3 className={`text-2xl font-bold mb-3 ${subject.textColor} transition-colors`}>
          {subject.title}
        </h3>
        
        <p className="text-gray-400 mb-6 flex-grow">
          {subject.description}
        </p>
        
        <div className={`flex items-center mt-auto font-medium ${subject.textColor}`}>
          <span>Rozpocznij naukę</span>
          <ChevronRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-900 text-white overflow-hidden">
      {/* Nawigacja */}
      <nav className="sticky top-0 z-50 backdrop-blur-lg bg-slate-900/80 py-4 border-b border-slate-800/70">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-blue-600">
            AI EduPlatform
          </div>
          
          {/* Menu na komputery */}
          <div className="hidden md:flex space-x-8">
            <button className="text-gray-300 hover:text-white transition-colors">Przedmioty</button>
            <button className="text-gray-300 hover:text-white transition-colors">Narzędzia</button>
            <button className="text-gray-300 hover:text-white transition-colors">Funkcje</button>
          </div>
          
          {/* Menu mobilne */}
          <div className="md:hidden">
            <button 
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-300 hover:text-white"
            >
              {menuOpen ? <X /> : <Menu />}
            </button>
          </div>
          
          <button
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 
                     text-white font-medium py-2 px-4 rounded-lg transition-all shadow-md 
                     hover:shadow-lg"
          >
            Zaloguj się
          </button>
        </div>
        
        {/* Menu mobilne rozwinięte */}
        {menuOpen && (
          <div className="md:hidden bg-slate-900 py-4 px-6 mt-4 rounded-lg shadow-lg">
            <div className="flex flex-col space-y-4">
              <button className="text-gray-300 hover:text-white transition-colors">Przedmioty</button>
              <button className="text-gray-300 hover:text-white transition-colors">Narzędzia</button>
              <button className="text-gray-300 hover:text-white transition-colors">Funkcje</button>
            </div>
          </div>
        )}
      </nav>

      {/* Sekcja Hero */}
      <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        {/* Animowane kropki w tle */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-2 h-2 bg-blue-500 rounded-full top-1/4 left-1/4 animate-pulse" style={{ animationDuration: '3s' }}></div>
          <div className="absolute w-1 h-1 bg-purple-500 rounded-full top-1/3 left-2/3 animate-pulse" style={{ animationDuration: '4s' }}></div>
          <div className="absolute w-2 h-2 bg-green-500 rounded-full top-1/2 left-1/3 animate-pulse" style={{ animationDuration: '5s' }}></div>
          <div className="absolute w-1 h-1 bg-yellow-500 rounded-full top-2/3 left-3/4 animate-pulse" style={{ animationDuration: '4.5s' }}></div>
        </div>
        
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-sm font-medium px-4 py-1 rounded-full inline-flex items-center mb-8 mx-auto shadow-lg">
            <span className="animate-pulse mr-2 bg-white h-2 w-2 rounded-full"></span> Otwarta beta • Dołącz już dziś
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-blue-200">
            Ucz się z <span className="relative inline-block">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-blue-600">AI</span>
              <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-sky-400 to-blue-600 rounded-full"></span>
            </span> bez ograniczeń
          </h1>
          
          <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Twoje centrum nauki z zaawansowaną sztuczną inteligencją, która pomoże Ci opanować matematykę, programowanie i języki obce.
          </p>
          
          <div className="flex flex-col md:flex-row justify-center items-center gap-4">
            <button
              className="inline-flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 
                       text-white font-semibold py-3 px-8 rounded-lg shadow-lg
                       transition-all transform hover:scale-105 w-full md:w-auto justify-center"
            >
              Rozpocznij naukę <ChevronRight className="ml-2 w-5 h-5" />
            </button>
            <button
              className="inline-flex items-center bg-slate-800 text-white font-semibold py-3 px-8 rounded-lg 
                       shadow-lg border border-slate-700 transition-all w-full md:w-auto justify-center"
            >
              Zobacz jak to działa
            </button>
          </div>
        </div>
      </section>

      {/* Sekcja "Nauka" */}
      <section className="py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-800 opacity-50"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-block bg-blue-900/30 text-blue-400 px-4 py-1 rounded-full text-sm font-medium mb-4">
              Przedmioty
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Co chcesz dzisiaj <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-blue-500">opanować</span>?
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Wybierz przedmiot i rozpocznij swoją przygodę z nauką wspomaganą sztuczną inteligencją.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {subjectsData.map((subject) => (
              <SubjectCard key={subject.id} subject={subject} />
            ))}
          </div>
        </div>
      </section>

      {/* Sekcja "Narzędzia" */}
      <section className="py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-800 to-slate-900 opacity-50"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-block bg-purple-900/30 text-purple-400 px-4 py-1 rounded-full text-sm font-medium mb-4">
              Narzędzia
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Sprawdź swoje <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-violet-500">umiejętności</span>
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Wykorzystaj nasze narzędzia do weryfikacji swojej wiedzy i dostępu do materiałów edukacyjnych.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {toolsData.map((tool) => (
              <div
                key={tool.id}
                className="group relative overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black opacity-95 group-hover:opacity-90 transition-opacity"></div>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-gradient-to-br transition-opacity duration-300"></div>
                
                {/* Border gradient */}
                <div className="absolute inset-0 p-0.5 rounded-2xl bg-gradient-to-br opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative p-8 h-full flex flex-col">
                  <div className="mb-6 flex items-center">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${tool.color} shadow-lg transition-all duration-300 group-hover:scale-110`}>
                      {tool.icon}
                    </div>
                    <div className="ml-4 h-px flex-1 bg-gradient-to-r from-gray-700 to-transparent"></div>
                  </div>
                  
                  <h3 className={`text-2xl font-bold mb-3 ${tool.textColor} transition-colors`}>
                    {tool.title}
                  </h3>
                  
                  <p className="text-gray-400 mb-6 flex-grow">
                    {tool.description}
                  </p>
                  
                  <div className={`flex items-center mt-auto font-medium ${tool.textColor}`}>
                    <span>Przejdź do narzędzia</span>
                    <ChevronRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sekcja "Funkcje" */}
      <section className="py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-800 opacity-50"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-block bg-indigo-900/30 text-indigo-400 px-4 py-1 rounded-full text-sm font-medium mb-4">
              Funkcje
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Dlaczego <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-blue-500">warto z nami</span> uczyć się?
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Nasza platforma wykorzystuje zaawansowane technologie AI, aby zapewnić najlepsze doświadczenie edukacyjne.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {featuresData.map((feature) => (
              <div key={feature.id} className="bg-slate-800/50 backdrop-blur rounded-xl p-8 border border-slate-700/50 hover:border-slate-600/50 transition-all">
                <div className="mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sekcja statystyk */}
      <section className="py-12 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-sky-500">10k+</div>
              <p className="text-gray-300 mt-2 text-sm">Zadowolonych uczniów</p>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-500">500+</div>
              <p className="text-gray-300 mt-2 text-sm">Lekcji i materiałów</p>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-violet-500">98%</div>
              <p className="text-gray-300 mt-2 text-sm">Satysfakcji użytkowników</p>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-yellow-500">24/7</div>
              <p className="text-gray-300 mt-2 text-sm">Wsparcie AI</p>
            </div>
          </div>
        </div>
      </section>

      {/* Sekcja call-to-action */}
      <section className="py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-800 to-slate-900 opacity-50"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 shadow-2xl border border-slate-700/50">
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Gotowy na nową jakość nauki?
              </h2>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                Dołącz do nas już dziś i odkryj, jak AI może przyspieszyć Twoją edukację. Pierwsza lekcja jest całkowicie za darmo!
              </p>
              <button
                className="inline-flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 
                         text-white font-semibold py-3 px-6 rounded-lg shadow-lg
                         transition-all transform hover:scale-105"
              >
                Rozpocznij bezpłatnie <ChevronRight className="ml-2 w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stopka */}
      <footer className="py-12 border-t border-slate-800">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-blue-600">
                AI EduPlatform
              </div>
              <p className="text-gray-400 mt-4 text-sm">
                Rewolucja w edukacji wspierana przez sztuczną inteligencję. Ucz się mądrzej, nie ciężej.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Przedmioty</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><button className="hover:text-white transition-colors">Matematyka</button></li>
                <li><button className="hover:text-white transition-colors">Programowanie</button></li>
                <li><button className="hover:text-white transition-colors">Angielski</button></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Narzędzia</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><button className="hover:text-white transition-colors">Quizy / Sprawdziany</button></li>
                <li><button className="hover:text-white transition-colors">Materiały Edukacyjne</button></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Kontakt</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><button className="hover:text-white transition-colors">O nas</button></li>
                <li><button className="hover:text-white transition-colors">Pomoc</button></li>
                <li><button className="hover:text-white transition-colors">Polityka prywatności</button></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-800 text-center text-gray-400 text-sm">
            <p>© {new Date().getFullYear()} AI EduPlatform. Wszelkie prawa zastrzeżone.</p>
            <p className="mt-1">Stworzone z pasją do nauki i technologii.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}