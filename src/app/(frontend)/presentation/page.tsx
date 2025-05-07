"use client";

import { useState } from 'react';
import { 
  Presentation, ChevronLeft, Menu, X, User, 
  Search, Plus, Trash2, Save, ArrowRight, 
  FileText, Image, Layout, ThumbsUp, Grid, 
  PanelLeft, PanelRight, Layers, RotateCw,
  Palette, Sliders, Check, Eye, Copy,
  ArrowDown, Upload, Download, Coffee, Brain
} from 'lucide-react';

export default function PresentationsPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('editor'); // 'editor', 'themes', 'preview'
  const [showSidebar, setShowSidebar] = useState(true);
  const [slideIndex, setSlideIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [title, setTitle] = useState('Moja prezentacja');
  const [sourceNote, setSourceNote] = useState<{ id: number; title: string; date: string } | null>(null);
  const [showAIPanel, setShowAIPanel] = useState(true);
  
  // Przykładowe slajdy
  const [slides, setSlides] = useState([
    {
      id: 1,
      title: 'Sztuczna inteligencja',
      content: 'Wprowadzenie do zagadnień AI i Machine Learning',
      layout: 'title',
      background: 'gradient1'
    },
    {
      id: 2,
      title: 'Co to jest AI?',
      content: 'Sztuczna inteligencja (AI) to dziedzina informatyki zajmująca się tworzeniem systemów zdolnych do wykonywania zadań, które tradycyjnie wymagały ludzkiej inteligencji.',
      layout: 'text',
      background: 'gradient1'
    },
    {
      id: 3,
      title: 'Główne dziedziny AI',
      content: '• Machine Learning\n• Deep Learning\n• Natural Language Processing\n• Computer Vision\n• Robotyka',
      layout: 'bullets',
      background: 'gradient1'
    }
  ]);
  
  // Przykładowa lista notatek do wyboru jako źródło
  const notesList = [
    { id: 1, title: 'Podstawy sztucznej inteligencji', date: '2025-05-01' },
    { id: 2, title: 'Wprowadzenie do Python', date: '2025-04-28' },
    { id: 3, title: 'Historia starożytnej Grecji', date: '2025-04-15' }
  ];
  
  // Tematy prezentacji
  const themes = [
    { id: 'gradient1', name: 'Niebieski gradient', primary: 'from-blue-500 to-indigo-600' },
    { id: 'gradient2', name: 'Zielony gradient', primary: 'from-green-500 to-emerald-600' },
    { id: 'gradient3', name: 'Fioletowy gradient', primary: 'from-purple-500 to-violet-600' },
    { id: 'dark', name: 'Ciemny', primary: 'bg-gray-900' },
    { id: 'light', name: 'Jasny', primary: 'bg-gray-100' }
  ];
  
  // Układy slajdów
  const layouts = [
    { id: 'title', name: 'Tytułowy', icon: <Layout /> },
    { id: 'text', name: 'Tekst', icon: <FileText /> },
    { id: 'bullets', name: 'Punktory', icon: <ThumbsUp /> },
    { id: 'two-col', name: 'Dwie kolumny', icon: <Grid /> },
    { id: 'image-text', name: 'Obraz i tekst', icon: <Image /> }
  ];
  
  // Dodawanie nowego slajdu
  const addSlide = () => {
    const newSlide = {
      id: slides.length + 1,
      title: 'Nowy slajd',
      content: 'Dodaj treść tutaj',
      layout: 'text',
      background: slides[0].background // Zachowaj tło z pierwszego slajdu
    };
    setSlides([...slides, newSlide]);
    setSlideIndex(slides.length);
  };
  
  // Symulacja generowania prezentacji z notatki
  const generateFromNote = () => {
    if (!sourceNote) return;
    
    setIsGenerating(true);
    
    // Symulacja opóźnienia
    setTimeout(() => {
      if (sourceNote.id === 1) { // AI
        setTitle('Sztuczna inteligencja w praktyce');
        setSlides([
          {
            id: 1,
            title: 'Sztuczna inteligencja',
            content: 'Praktyczne zastosowania w życiu codziennym',
            layout: 'title',
            background: 'gradient1'
          },
          {
            id: 2,
            title: 'Co to jest AI?',
            content: 'Sztuczna inteligencja (AI) to dziedzina informatyki zajmująca się tworzeniem systemów zdolnych do wykonywania zadań, które tradycyjnie wymagały ludzkiej inteligencji.',
            layout: 'text',
            background: 'gradient1'
          },
          {
            id: 3,
            title: 'Zastosowania AI',
            content: '• Asystenci głosowi\n• Rozpoznawanie obrazów\n• Rekomendacje treści\n• Autonomiczne pojazdy\n• Medycyna i diagnostyka',
            layout: 'bullets',
            background: 'gradient1'
          },
          {
            id: 4,
            title: 'Machine Learning',
            content: 'Proces, w którym systemy AI uczą się na podstawie danych bez jawnego programowania.',
            layout: 'text',
            background: 'gradient1'
          },
          {
            id: 5,
            title: 'Przyszłość AI',
            content: '• Coraz bardziej zaawansowane chatboty\n• Personalizacja na niespotykanym poziomie\n• Automatyzacja złożonych zadań\n• Nowe zastosowania w medycynie\n• Etyczne wyzwania do rozwiązania',
            layout: 'bullets',
            background: 'gradient1'
          }
        ]);
      } else if (sourceNote.id === 3) { // Historia
        setTitle('Historia starożytnej Grecji');
        setSlides([
          {
            id: 1,
            title: 'Historia starożytnej Grecji',
            content: 'Kluczowe okresy i osiągnięcia',
            layout: 'title',
            background: 'gradient3'
          },
          {
            id: 2,
            title: 'Okresy historyczne',
            content: '• Okres archaiczny (800-480 p.n.e.)\n• Okres klasyczny (480-323 p.n.e.)\n• Okres hellenistyczny (323-31 p.n.e.)',
            layout: 'bullets',
            background: 'gradient3'
          },
          {
            id: 3,
            title: 'Osiągnięcia kulturowe',
            content: 'Starożytna Grecja położyła fundamenty pod zachodnią filozofię, literaturę, matematykę, historię, teatr i demokrację.',
            layout: 'text',
            background: 'gradient3'
          },
          {
            id: 4,
            title: 'Znane postacie',
            content: '• Sokrates, Platon, Arystoteles (filozofia)\n• Homer (literatura)\n• Pitagoras (matematyka)\n• Herodot (historia)\n• Ajschylos, Sofokles, Eurypides (teatr)',
            layout: 'bullets',
            background: 'gradient3'
          },
          {
            id: 5,
            title: 'Dziedzictwo',
            content: 'Wpływ greckiej kultury i myśli jest widoczny w całej zachodniej cywilizacji do dnia dzisiejszego.',
            layout: 'text',
            background: 'gradient3'
          }
        ]);
      }
      
      setSlideIndex(0);
      setIsGenerating(false);
    }, 2000);
  };
  
  // Renderowanie aktualnego slajdu w edytorze
  const renderCurrentSlide = () => {
    const slide = slides[slideIndex];
    if (!slide) return null;
    
    return (
      <div className="bg-white rounded-lg shadow-md p-8 min-h-96 flex flex-col">
        <input
          type="text"
          className="text-3xl font-bold mb-6 bg-transparent border-b border-gray-200 pb-2 focus:outline-none focus:border-blue-500"
          value={slide.title}
          onChange={(e) => {
            const updatedSlides = [...slides];
            updatedSlides[slideIndex].title = e.target.value;
            setSlides(updatedSlides);
          }}
        />
        
        {slide.layout === 'bullets' ? (
          <textarea
            className="flex-grow text-lg bg-transparent focus:outline-none resize-none"
            value={slide.content}
            onChange={(e) => {
              const updatedSlides = [...slides];
              updatedSlides[slideIndex].content = e.target.value;
              setSlides(updatedSlides);
            }}
            placeholder="• Punkt 1&#10;• Punkt 2&#10;• Punkt 3"
          />
        ) : (
          <textarea
            className="flex-grow text-lg bg-transparent focus:outline-none resize-none"
            value={slide.content}
            onChange={(e) => {
              const updatedSlides = [...slides];
              updatedSlides[slideIndex].content = e.target.value;
              setSlides(updatedSlides);
            }}
            placeholder="Dodaj treść slajdu tutaj..."
          />
        )}
      </div>
    );
  };
  
  // Renderowanie miniaturki slajdu
  const renderSlideThumb = (slide: { id: number; title: string; content: string; layout: string; background: string }, index: number) => {
    const isActive = index === slideIndex;
    
    return (
      <div 
        key={slide.id}
        className={`p-2 border rounded-md mb-2 cursor-pointer transition-all ${
          isActive ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-400'
        }`}
        onClick={() => setSlideIndex(index)}
      >
        <div className="bg-white p-2 rounded shadow-sm">
          <div className="text-xs font-bold truncate">{slide.title}</div>
          <div className="text-xs text-gray-500 truncate mt-1">
            {slide.content.substring(0, 30)}
            {slide.content.length > 30 && '...'}
          </div>
        </div>
      </div>
    );
  };
  
  // Renderowanie podglądu prezentacji
  const renderPreview = () => {
    const slide = slides[slideIndex];
    if (!slide) return null;
    
    // Określ klasę tła na podstawie wybranego motywu
    const getBackgroundClass = () => {
      const theme = themes.find(t => t.id === slide.background);
      if (!theme) return 'bg-gradient-to-br from-blue-500 to-indigo-600';
      
      if (theme.id.startsWith('gradient')) {
        return `bg-gradient-to-br ${theme.primary}`;
      }
      return theme.primary;
    };
    
    // Renderuj treść w zależności od układu
    const renderContent = () => {
      switch (slide.layout) {
        case 'title':
          return (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <h1 className="text-4xl font-bold mb-6">{slide.title}</h1>
              <p className="text-xl">{slide.content}</p>
            </div>
          );
        case 'bullets':
          return (
            <div className="h-full flex flex-col">
              <h2 className="text-3xl font-bold mb-8">{slide.title}</h2>
              <ul className="text-xl space-y-4">
                {slide.content.split('\n').map((item, idx) => (
                  <li key={idx} className="flex items-start">
                    {item.startsWith('•') ? (
                      <span>{item}</span>
                    ) : (
                      <>
                        <span className="mr-2">•</span>
                        <span>{item}</span>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          );
        case 'two-col':
          const parts = slide.content.split('||');
          return (
            <div className="h-full flex flex-col">
              <h2 className="text-3xl font-bold mb-8">{slide.title}</h2>
              <div className="grid grid-cols-2 gap-6 flex-grow">
                <div className="text-xl">{parts[0] || 'Lewa kolumna'}</div>
                <div className="text-xl">{parts[1] || 'Prawa kolumna'}</div>
              </div>
            </div>
          );
        default: // text
          return (
            <div className="h-full flex flex-col">
              <h2 className="text-3xl font-bold mb-8">{slide.title}</h2>
              <p className="text-xl">{slide.content}</p>
            </div>
          );
      }
    };
    
    return (
      <div className={`w-full h-full rounded-lg p-12 shadow-lg ${getBackgroundClass()} text-white`}>
        {renderContent()}
      </div>
    );
  };
  
  // Renderowanie interfejsu w zależności od aktywnej zakładki
  const renderTabContent = () => {
    switch (activeTab) {
      case 'themes':
        return (
          <div className="p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center">
              <Palette className="w-5 h-5 mr-2" />
              Wybierz motyw prezentacji
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {themes.map(theme => {
                // Sprawdź, czy ten motyw jest aktywny dla pierwszego slajdu
                const isActive = slides[0]?.background === theme.id;
                
                return (
                  <div 
                    key={theme.id}
                    className={`p-4 rounded-lg cursor-pointer transition-all ${
                      theme.id === 'light' ? 'bg-gray-100 text-gray-900' : 'text-white'
                    } ${
                      theme.id === 'dark' ? 'bg-gray-900' : ''
                    } ${
                      theme.id.startsWith('gradient') ? `bg-gradient-to-r ${theme.primary}` : ''
                    } ${
                      isActive ? 'ring-4 ring-blue-400' : 'hover:ring-2 hover:ring-blue-300'
                    }`}
                    onClick={() => {
                      // Zaktualizuj tło dla wszystkich slajdów
                      const updatedSlides = slides.map(slide => ({
                        ...slide,
                        background: theme.id
                      }));
                      setSlides(updatedSlides);
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{theme.name}</span>
                      {isActive && <Check className="w-5 h-5" />}
                    </div>
                  </div>
                );
              })}
            </div>
            
            <h2 className="text-xl font-bold mt-8 mb-6 flex items-center">
              <Layout className="w-5 h-5 mr-2" />
              Układy slajdów
            </h2>
            
            <div className="space-y-4">
              {layouts.map(layout => (
                <div 
                  key={layout.id}
                  className={`flex items-center p-4 rounded-lg border transition-all cursor-pointer ${
                    slides[slideIndex]?.layout === layout.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                  onClick={() => {
                    const updatedSlides = [...slides];
                    updatedSlides[slideIndex].layout = layout.id;
                    setSlides(updatedSlides);
                  }}
                >
                  <div className="p-2 bg-gray-100 rounded-lg mr-3">
                    {layout.icon}
                  </div>
                  <span className="font-medium">{layout.name}</span>
                  {slides[slideIndex]?.layout === layout.id && (
                    <Check className="w-5 h-5 ml-auto text-blue-500" />
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      case 'preview':
        return (
          <div className="p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold flex items-center">
                <Eye className="w-5 h-5 mr-2" />
                Podgląd prezentacji
              </h2>
              
              <div className="flex space-x-3">
                <button className="bg-slate-200 hover:bg-slate-300 rounded-lg py-2 px-4 text-sm font-medium transition-colors flex items-center">
                  <Download className="w-4 h-4 mr-2" />
                  Eksportuj PDF
                </button>
                <button className="bg-slate-200 hover:bg-slate-300 rounded-lg py-2 px-4 text-sm font-medium transition-colors flex items-center">
                  <Copy className="w-4 h-4 mr-2" />
                  Udostępnij
                </button>
              </div>
            </div>
            
            <div className="flex-grow relative overflow-hidden rounded-xl bg-slate-100">
              {renderPreview()}
            </div>
            
            <div className="flex justify-between items-center mt-4">
              <button 
                className="bg-slate-200 hover:bg-slate-300 rounded-lg p-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={slideIndex === 0}
                onClick={() => setSlideIndex(prev => Math.max(0, prev - 1))}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <div className="text-sm">
                Slajd {slideIndex + 1} z {slides.length}
              </div>
              
              <button 
                className="bg-slate-200 hover:bg-slate-300 rounded-lg p-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={slideIndex === slides.length - 1}
                onClick={() => setSlideIndex(prev => Math.min(slides.length - 1, prev + 1))}
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        );
      default: // editor
        return (
          <div className="flex-grow flex">
            {/* Edytor slajdów */}
            <div className="flex-grow p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <input
                    type="text"
                    className="text-2xl font-bold bg-transparent focus:outline-none focus:border-b focus:border-blue-500"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Tytuł prezentacji"
                  />
                  <p className="text-gray-500 text-sm mt-1">
                    {slides.length} slajdów • Edytowano przed chwilą
                  </p>
                </div>
                
                <div className="flex space-x-3">
                  <button className="bg-slate-200 hover:bg-slate-300 rounded-lg py-2 px-4 text-sm font-medium transition-colors flex items-center">
                    <Save className="w-4 h-4 mr-2" />
                    Zapisz
                  </button>
                  <button 
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 px-4 text-sm font-medium transition-colors flex items-center"
                    onClick={() => setActiveTab('preview')}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Podgląd
                  </button>
                </div>
              </div>
              
              {/* Aktualny slajd */}
              {renderCurrentSlide()}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-900 text-slate-900">
      {/* Nawigacja */}
      <nav className="sticky top-0 z-50 backdrop-blur-lg bg-slate-900/80 py-4 border-b border-slate-800/70">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center">
            <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-blue-600">
              AI EduPlatform
            </div>
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
          
          <div className="hidden md:flex items-center space-x-3">
            <button className="text-gray-300 hover:text-white transition-colors">Dashboard</button>
            <button className="text-gray-300 hover:text-white transition-colors">Notatki</button>
            <button className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600">
              <User className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
        
        {/* Menu mobilne rozwinięte */}
        {menuOpen && (
          <div className="md:hidden bg-slate-900 py-4 px-6 mt-4 rounded-lg shadow-lg">
            <div className="flex flex-col space-y-4">
              <button className="text-gray-300 hover:text-white transition-colors">Dashboard</button>
              <button className="text-gray-300 hover:text-white transition-colors">Notatki</button>
            </div>
          </div>
        )}
      </nav>

      {/* Główna zawartość */}
      <main className="bg-white min-h-screen">
        {/* Pasek narzędzi */}
        <div className="bg-slate-100 border-b border-slate-200 py-2 px-6">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center">
              <button 
                onClick={() => window.history.back()}
                className="mr-4 p-2 rounded-lg hover:bg-slate-200 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h1 className="text-lg font-bold flex items-center">
                <Presentation className="w-5 h-5 mr-2 text-amber-500" />
                Tworzenie Prezentacji
              </h1>
            </div>
            
            <div className="flex space-x-1">
              <button 
                className={`p-2 rounded-lg transition-colors ${
                  activeTab === 'editor' 
                    ? 'bg-slate-200 text-slate-900' 
                    : 'hover:bg-slate-200/70 text-slate-600'
                }`}
                onClick={() => setActiveTab('editor')}
              >
                <FileText className="w-5 h-5" />
              </button>
              <button 
                className={`p-2 rounded-lg transition-colors ${
                  activeTab === 'themes' 
                    ? 'bg-slate-200 text-slate-900' 
                    : 'hover:bg-slate-200/70 text-slate-600'
                }`}
                onClick={() => setActiveTab('themes')}
              >
                <Palette className="w-5 h-5" />
              </button>
              <button 
                className={`p-2 rounded-lg transition-colors ${
                  activeTab === 'preview' 
                    ? 'bg-slate-200 text-slate-900' 
                    : 'hover:bg-slate-200/70 text-slate-600'
                }`}
                onClick={() => setActiveTab('preview')}
              >
                <Eye className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex h-[calc(100vh-4rem-2.5rem)]">
          {/* Boczny panel ze slajdami */}
          {showSidebar && activeTab !== 'preview' && (
            <div className="w-64 border-r border-slate-200 p-4 overflow-y-auto flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">Slajdy</h3>
                <button 
                  onClick={addSlide}
                  className="p-1 rounded hover:bg-slate-200 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-2 mb-4">
                {slides.map((slide, index) => renderSlideThumb(slide, index))}
              </div>
              
              {slideIndex !== null && (
                <button
                  onClick={() => {
                    const updatedSlides = slides.filter((_, idx) => idx !== slideIndex);
                    setSlides(updatedSlides);
                    if (slideIndex >= updatedSlides.length) {
                      setSlideIndex(Math.max(0, updatedSlides.length - 1));
                    }
                  }}
                  disabled={slides.length <= 1}
                  className="mt-auto text-sm flex items-center justify-center py-2 px-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Usuń slajd
                </button>
              )}
            </div>
          )}
          
          {/* Przycisk wyłączania panelu bocznego */}
          {activeTab !== 'preview' && (
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="bg-slate-100 border-r border-slate-200 hover:bg-slate-200 transition-colors p-1"
            >
              {showSidebar ? <PanelLeft className="w-4 h-4" /> : <PanelRight className="w-4 h-4" />}
            </button>
          )}
          
          {/* Główny obszar edycji */}
          <div className="flex-grow overflow-auto flex flex-col">
            {renderTabContent()}
          </div>
          
          {/* Panel AI (tylko w trybie edycji) */}
          {activeTab === 'editor' && (
            <div className="w-72 border-l border-slate-200 p-4 overflow-y-auto">
              <div 
                className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6"
              >
                <div className="flex items-center justify-between cursor-pointer" onClick={() => setShowAIPanel(!showAIPanel)}>
                  <div className="flex items-center">
                    <Brain className="w-5 h-5 text-blue-600 mr-2" />
                    <h3 className="font-medium text-blue-900">Asystent AI</h3>
                  </div>
                  <ArrowDown className={`w-4 h-4 text-blue-600 transition-transform ${showAIPanel ? 'rotate-180' : ''}`} />
                </div>
                
                {showAIPanel && (
                  <div className="mt-4">
                    <p className="text-sm text-blue-700 mb-4">
                      Wygeneruj prezentację z wybranej notatki lub pozwól AI ulepszyć aktualny slajd.
                    </p>
                    
                    <h4 className="text-sm font-medium mb-2">Wybierz notatkę źródłową:</h4>
                    <div className="space-y-2 mb-4">
                      {notesList.map(note => (
                        <div 
                          key={note.id}
                          className={`p-2 border rounded cursor-pointer transition-all ${
                            sourceNote?.id === note.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setSourceNote(note)}
                        >
                          <div className="text-sm font-medium">{note.title}</div>
                          <div className="text-xs text-gray-500 mt-1">{note.date}</div>
                        </div>
                      ))}
                    </div>
                    
                    <button
                      onClick={generateFromNote}
                      disabled={!sourceNote || isGenerating}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isGenerating ? (
                        <>
                          <RotateCw className="w-4 h-4 mr-2 animate-spin" />
                          Generowanie...
                        </>
                      ) : (
                        <>
                          <Coffee className="w-4 h-4 mr-2" />
                          Wygeneruj prezentację
                        </>
                      )}
                    </button>
                    
                    <div className="mt-4 pt-4 border-t border-blue-100">
                      <h4 className="text-sm font-medium mb-2">Ulepsz aktualny slajd:</h4>
                      <button
                        className="w-full bg-blue-100 hover:bg-blue-200 text-blue-800 py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                      >
                        <Layers className="w-4 h-4 mr-2" />
                        Sugeruj treść
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <h3 className="font-medium mb-3 flex items-center">
                  <Upload className="w-5 h-5 mr-2 text-slate-600" />
                  Dodaj zasoby
                </h3>
                <p className="text-sm text-slate-600 mb-3">
                  Przeciągnij i upuść pliki lub kliknij, aby dodać obrazy i inne zasoby do prezentacji.
                </p>
                <button className="w-full border border-dashed border-slate-300 rounded-lg p-8 flex flex-col items-center justify-center hover:bg-slate-100 transition-colors">
                  <Image className="w-8 h-8 text-slate-400 mb-2" />
                  <span className="text-sm text-slate-500">Dodaj obrazy</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}