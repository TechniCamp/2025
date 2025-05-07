"use client";

import { useState, useEffect } from 'react';
import { 
  BookOpen, FileText, PlusCircle, Search, 
  User, Globe, Save, Share2, MessageSquare, 
  X, Menu, ChevronLeft, ChevronRight, 
  Bot, Edit, Trash2, Home
} from 'lucide-react';

export default function HomePage() {
  // Stan aplikacji
  const [activeSection, setActiveSection] = useState('myNotes'); // 'myNotes', 'publicNotes'
  const [isCreatingNote, setIsCreatingNote] = useState(false);
  const [showTopicSelection, setShowTopicSelection] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Przykładowe dane notatek
  const [notes, setNotes] = useState([
    {
      id: 1,
      title: 'Podstawy programowania w JavaScript',
      topic: 'programming',
      preview: 'JavaScript to język programowania wysokiego poziomu, często wykorzystywany do tworzenia interaktywnych stron internetowych...',
      isPublic: false,
      date: '2025-05-05'
    },
    {
      id: 2,
      title: 'Wzory matematyczne - trygonometria',
      topic: 'math',
      preview: 'Podstawowe wzory trygonometryczne: sin²α + cos²α = 1, sin(α+β) = sinα·cosβ + cosα·sinβ...',
      isPublic: true,
      date: '2025-05-01'
    },
    {
      id: 3,
      title: 'Angielski - czasy przeszłe',
      topic: 'english',
      preview: 'Past Simple vs Past Continuous vs Present Perfect - kiedy używać poszczególnych czasów...',
      isPublic: false,
      date: '2025-04-28'
    }
  ]);

  // Tematy notatek
  const topics = [
    { id: 'math', name: 'Matematyka', color: 'bg-blue-500' },
    { id: 'programming', name: 'Programowanie', color: 'bg-green-500' },
    { id: 'english', name: 'Angielski', color: 'bg-purple-500' },
    { id: 'physics', name: 'Fizyka', color: 'bg-red-500' },
    { id: 'chemistry', name: 'Chemia', color: 'bg-yellow-500' },
    { id: 'biology', name: 'Biologia', color: 'bg-emerald-500' },
    { id: 'history', name: 'Historia', color: 'bg-amber-500' },
    { id: 'geography', name: 'Geografia', color: 'bg-indigo-500' }
  ];

  // Filtrowanie notatek na podstawie aktywnej sekcji i wyszukiwania
  const filteredNotes = notes.filter(note => {
    const matchesSection = activeSection === 'myNotes' || (activeSection === 'publicNotes' && note.isPublic);
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          note.preview.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSection && matchesSearch;
  });

  // Funkcja tworząca nową notatkę
  const createNewNote = () => {
    const newNote = {
      id: notes.length + 1,
      title: noteTitle,
      topic: selectedTopic,
      preview: noteContent.substring(0, 100) + '...',
      isPublic: false,
      date: new Date().toISOString().split('T')[0]
    };
    
    setNotes([newNote, ...notes]);
    resetNoteCreation();
  };

  // Resetowanie stanu tworzenia notatki
  const resetNoteCreation = () => {
    setNoteTitle('');
    setNoteContent('');
    setSelectedTopic('');
    setIsCreatingNote(false);
    setShowTopicSelection(false);
    setAiPanelOpen(false);
  };

  // Rozpoczęcie tworzenia nowej notatki
  const startNewNote = () => {
    setShowTopicSelection(true);
  };

  // Wybór tematu i rozpoczęcie edycji notatki
  const selectTopicAndContinue = () => {
    if (selectedTopic) {
      setShowTopicSelection(false);
      setIsCreatingNote(true);
    }
  };

  // Przykładowa funkcja rozszerzania notatki z pomocą AI
  const expandNoteWithAI = () => {
    // Symulacja odpowiedzi AI
    const aiSuggestion = `
${noteContent.trim()}

**Dodatkowe informacje:**

${selectedTopic === 'math' ? 
  'W matematyce warto zwrócić uwagę na następujące aspekty: \n- Definicje i twierdzenia powinny być precyzyjne\n- Wzory powinny być zapisane w sposób jednoznaczny\n- Warto podać przykłady zastosowań' : 
  selectedTopic === 'programming' ? 
  'W programowaniu warto zwrócić uwagę na: \n- Czytelność kodu\n- Wydajność algorytmów\n- Dobre praktyki związane z wybranym językiem programowania\n- Przykłady implementacji' :
  'Rozwijając tę notatkę, warto uwzględnić:\n- Definicje kluczowych pojęć\n- Praktyczne przykłady\n- Powiązania z innymi obszarami tematycznymi\n- Źródła do pogłębienia wiedzy'}
`;
    
    setNoteContent(aiSuggestion);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-900 text-white">
      {/* Nawigacja */}
      <nav className="sticky top-0 z-50 backdrop-blur-lg bg-slate-900/80 py-4 border-b border-slate-800/70">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center">
            <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-blue-600">
              AI EduPlatform
            </div>
            <div className="hidden md:flex ml-10 space-x-6">
              <button 
                onClick={() => setActiveSection('myNotes')}
                className={`flex items-center ${activeSection === 'myNotes' ? 'text-white' : 'text-gray-400'} hover:text-white transition-colors`}
              >
                <User className="w-5 h-5 mr-2" />
                Moje Notatki
              </button>
              <button 
                onClick={() => setActiveSection('publicNotes')}
                className={`flex items-center ${activeSection === 'publicNotes' ? 'text-white' : 'text-gray-400'} hover:text-white transition-colors`}
              >
                <Globe className="w-5 h-5 mr-2" />
                Publiczne Notatki
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Szukaj notatek..."
                className="bg-slate-800 border border-slate-700 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 w-40 md:w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <button
              onClick={startNewNote}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 
                       text-white font-medium py-2 px-4 rounded-lg transition-all shadow-md 
                       hover:shadow-lg flex items-center"
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              <span className="hidden md:inline">Stwórz Notatkę</span>
              <span className="md:hidden">Nowa</span>
            </button>
            
            {/* Menu mobilne */}
            <div className="md:hidden">
              <button 
                onClick={() => setMenuOpen(!menuOpen)}
                className="text-gray-300 hover:text-white"
              >
                {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Menu mobilne rozwinięte */}
        {menuOpen && (
          <div className="md:hidden bg-slate-900 py-4 px-6 mt-4 rounded-lg shadow-lg">
            <div className="flex flex-col space-y-4">
              <button 
                onClick={() => {
                  setActiveSection('myNotes');
                  setMenuOpen(false);
                }}
                className="flex items-center text-gray-300 hover:text-white transition-colors"
              >
                <User className="w-5 h-5 mr-2" />
                Moje Notatki
              </button>
              <button 
                onClick={() => {
                  setActiveSection('publicNotes');
                  setMenuOpen(false);
                }}
                className="flex items-center text-gray-300 hover:text-white transition-colors"
              >
                <Globe className="w-5 h-5 mr-2" />
                Publiczne Notatki
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Główna zawartość */}
      <main className="container mx-auto px-6 py-8">
        {/* Modal wyboru tematu */}
        {showTopicSelection && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-slate-800 rounded-xl p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Wybierz temat notatki</h2>
                <button onClick={() => setShowTopicSelection(false)} className="text-gray-400 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <input
                type="text"
                placeholder="Tytuł notatki"
                className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-4 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
              />
              
              <div className="grid grid-cols-2 gap-3 mb-4">
                {topics.map((topic) => (
                  <button
                    key={topic.id}
                    onClick={() => setSelectedTopic(topic.id)}
                    className={`p-3 rounded-lg border text-left ${
                      selectedTopic === topic.id 
                        ? 'border-blue-500 bg-blue-500/20' 
                        : 'border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <div className={`w-3 h-3 rounded-full ${topic.color} mb-2`}></div>
                    <div className="font-medium">{topic.name}</div>
                  </button>
                ))}
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowTopicSelection(false)}
                  className="flex-1 py-2 px-4 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                >
                  Anuluj
                </button>
                <button
                  onClick={selectTopicAndContinue}
                  disabled={!selectedTopic || !noteTitle}
                  className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                    selectedTopic && noteTitle
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-blue-600/50 cursor-not-allowed'
                  }`}
                >
                  Stwórz
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edytor notatek */}
        {isCreatingNote ? (
          <div className="flex flex-col md:flex-row gap-6">
            <div className={`flex-1 transition-all ${aiPanelOpen ? 'md:w-2/3' : 'w-full'}`}>
              <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 mb-4">
                <div className="flex items-center justify-between p-4 border-b border-slate-700">
                  <div className="flex items-center">
                    <button 
                      onClick={resetNoteCreation}
                      className="mr-3 text-gray-400 hover:text-white"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <h2 className="text-xl font-semibold">{noteTitle}</h2>
                  </div>
                  <div>
                    {topics.find(t => t.id === selectedTopic) && (
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${topics.find(t => t.id === selectedTopic)?.color ?? 'bg-gray-500'}`}>
                        {topics.find(t => t.id === selectedTopic)?.name || 'Nieznany temat'}
                      </span>
                    )}
                  </div>
                </div>
                <textarea
                  className="w-full bg-slate-800 rounded-b-xl p-4 min-h-64 focus:outline-none"
                  placeholder="Zacznij pisać swoją notatkę..."
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                />
              </div>
              
              <div className="flex justify-between">
                <div className="flex space-x-2">
                  <button
                    onClick={() => setAiPanelOpen(!aiPanelOpen)}
                    className={`flex items-center py-2 px-4 rounded-lg ${
                      aiPanelOpen 
                        ? 'bg-blue-600 hover:bg-blue-700' 
                        : 'bg-slate-700 hover:bg-slate-600'
                    } transition-colors`}
                  >
                    <Bot className="w-5 h-5 mr-2" />
                    AI Asystent
                  </button>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={createNewNote}
                    className="flex items-center py-2 px-4 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                  >
                    <Share2 className="w-5 h-5 mr-2" />
                    Udostępnij
                  </button>
                  <button
                    onClick={createNewNote}
                    className="flex items-center py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                  >
                    <Save className="w-5 h-5 mr-2" />
                    Zapisz
                  </button>
                </div>
              </div>
            </div>
            
            {/* Panel AI */}
            {aiPanelOpen && (
              <div className="md:w-1/3 bg-slate-800 rounded-xl shadow-lg border border-slate-700 p-4 h-min">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold flex items-center">
                    <Bot className="w-5 h-5 mr-2 text-blue-500" />
                    Asystent AI
                  </h3>
                  <button 
                    onClick={() => setAiPanelOpen(false)}
                    className="text-gray-400 hover:text-white md:hidden"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <p className="text-sm text-gray-400 mb-4">
                  Użyj AI, aby rozszerzyć notatkę o ważne informacje związane z wybranym tematem.
                </p>
                
                <div className="space-y-2">
                  <button
                    onClick={expandNoteWithAI}
                    className="w-full py-2 px-3 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-600/50 rounded-lg text-left text-sm"
                  >
                    Rozszerz notatkę o ważne definicje
                  </button>
                  <button
                    onClick={expandNoteWithAI}
                    className="w-full py-2 px-3 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-600/50 rounded-lg text-left text-sm"
                  >
                    Dodaj praktyczne przykłady
                  </button>
                  <button
                    onClick={expandNoteWithAI}
                    className="w-full py-2 px-3 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-600/50 rounded-lg text-left text-sm"
                  >
                    Zaproponuj źródła do pogłębienia wiedzy
                  </button>
                </div>
                
                <div className="mt-4">
                  <textarea
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-sm h-24 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Napisz własne polecenie dla AI..."
                  ></textarea>
                  <button
                    className="mt-2 w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center justify-center"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Wyślij zapytanie
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Tytuł sekcji */}
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold flex items-center">
                {activeSection === 'myNotes' ? (
                  <>
                    <User className="w-6 h-6 mr-2" />
                    Moje Notatki
                  </>
                ) : (
                  <>
                    <Globe className="w-6 h-6 mr-2" />
                    Publiczne Notatki
                  </>
                )}
              </h1>
              <button
                onClick={startNewNote}
                className="bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded-lg transition-colors flex items-center"
              >
                <PlusCircle className="w-5 h-5 mr-2" />
                Nowa Notatka
              </button>
            </div>
            
            {/* Lista notatek */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredNotes.length > 0 ? (
                filteredNotes.map((note) => (
                  <div key={note.id} className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 hover:border-slate-600 transition-all hover:-translate-y-1 cursor-pointer">
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg">{note.title}</h3>
                        <div className="flex space-x-2">
                          <button className="text-gray-400 hover:text-white">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="text-gray-400 hover:text-red-500">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-400 text-sm mb-3 line-clamp-3">{note.preview}</p>
                      <div className="flex justify-between items-center text-xs">
                        <span className={`px-2 py-1 rounded-full ${topics.find(t => t.id === note.topic)?.color} bg-opacity-20`}>
                          {topics.find(t => t.id === note.topic)?.name}
                        </span>
                        <div className="flex items-center text-gray-500">
                          <FileText className="w-3 h-3 mr-1" />
                          {note.date}
                          {note.isPublic && <Globe className="ml-2 w-3 h-3" />}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-3 flex flex-col items-center justify-center py-12 text-gray-400">
                  <FileText className="w-16 h-16 mb-4 opacity-30" />
                  <p className="text-lg">Brak notatek do wyświetlenia</p>
                  <p className="text-sm mt-2">
                    {searchQuery ? 'Brak wyników dla podanego wyszukiwania.' : 'Stwórz swoją pierwszą notatkę!'}
                  </p>
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="mt-4 text-blue-500 hover:text-blue-400"
                    >
                      Wyczyść wyszukiwanie
                    </button>
                  )}
                </div>
              )}
            </div>
          </>
        )}
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