// src/app/transcription/page.tsx

"use client";

import { useState } from 'react';
import {
  Menu, X, User, Search, Link as LinkIcon, // Zmieniona nazwa importu, aby uniknąć konfliktu z next/link
  UploadCloud, Film, Settings, FileText, ArrowRight, Info, Clock, CheckCircle, AlertTriangle, Loader2
} from 'lucide-react';
import NextLink from 'next/link'; // Importujemy komponent Link z next/link pod inną nazwą

export default function TranscriptionPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [transcriptionStatus, setTranscriptionStatus] = useState<'idle' | 'processing' | 'completed' | 'error'>('idle');
  const [transcribedText, setTranscribedText] = useState('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setVideoFile(event.target.files[0]);
      setVideoUrl(''); // Reset URL if file is selected
      setTranscriptionStatus('idle');
      setTranscribedText('');
    }
  };

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVideoUrl(event.target.value);
    setVideoFile(null); // Reset file if URL is entered
    setTranscriptionStatus('idle');
    setTranscribedText('');
  };

  const handleSubmitTranscription = async () => {
    if (!videoFile && !videoUrl) {
      alert('Proszę wybrać plik wideo lub podać URL.');
      return;
    }
    setTranscriptionStatus('processing');
    setTranscribedText('');

    // Symulacja przetwarzania
    console.log('Rozpoczynanie transkrypcji dla:', videoFile ? videoFile.name : videoUrl);
    await new Promise(resolve => setTimeout(resolve, 3000)); // Symulacja opóźnienia API

    // Przykładowy wynik - w rzeczywistości pochodziłby z API
    if (Math.random() > 0.1) { // Symulacja sukcesu w 90% przypadków
        setTranscribedText(
`Witajcie na kolejnym wykładzie. Dzisiaj omówimy kluczowe aspekty rozwoju sztucznej inteligencji.
Sztuczna inteligencja, znana również jako AI, to dziedzina informatyki skupiająca się na tworzeniu systemów zdolnych do wykonywania zadań, które normalnie wymagają ludzkiej inteligencji.
Obejmuje to uczenie maszynowe, przetwarzanie języka naturalnego, widzenie komputerowe i wiele innych.
Rozwój AI przyspieszył w ostatnich latach dzięki dostępowi do dużych zbiorów danych i rosnącej mocy obliczeniowej.
Dziękuję za uwagę.`
        );
        setTranscriptionStatus('completed');
    } else {
        setTranscribedText('Wystąpił błąd podczas transkrypcji. Spróbuj ponownie.');
        setTranscriptionStatus('error');
    }
  };

  const getStatusIcon = () => {
    switch (transcriptionStatus) {
      case 'processing':
        return <Loader2 className="w-5 h-5 mr-2 animate-spin text-blue-400" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 mr-2 text-green-400" />;
      case 'error':
        return <AlertTriangle className="w-5 h-5 mr-2 text-red-400" />;
      default:
        return <Info className="w-5 h-5 mr-2 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-900 text-white">
      {/* Nawigacja (identyczna jak w Dashboard) */}
      <nav className="sticky top-0 z-50 backdrop-blur-lg bg-slate-900/80 py-4 border-b border-slate-800/70">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <NextLink href="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-blue-600">
            AI EduPlatform
          </NextLink>

          <div className="hidden md:flex space-x-8">
            <NextLink href="/" className="text-gray-300 hover:text-white transition-colors">Dashboard</NextLink>
            <NextLink href="/notes" className="text-gray-300 hover:text-white transition-colors">Notatki</NextLink>
            {/* Dodaj więcej linków w razie potrzeby */}
          </div>

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

        {menuOpen && (
          <div className="md:hidden bg-slate-900 py-4 px-6 mt-4 rounded-lg shadow-lg">
            <div className="flex flex-col space-y-4">
              <NextLink href="/" className="text-white hover:text-blue-400 transition-colors">Dashboard</NextLink>
              <NextLink href="/notes" className="text-gray-300 hover:text-white transition-colors">Notatki</NextLink>
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

      {/* Główna zawartość strony transkrypcji */}
      <main className="container mx-auto px-6 py-8">
        <div className="mb-10">
          <div className="flex items-center mb-2">
            <Film className="w-10 h-10 mr-3 text-red-500" />
            <h1 className="text-3xl font-bold">Transkrypcje Wideo</h1>
          </div>
          <p className="text-gray-400">Prześlij plik wideo lub podaj link URL, aby automatycznie wygenerować transkrypcję.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sekcja przesyłania i opcji */}
          <div className="lg:col-span-1 bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700/50">
            <h2 className="text-xl font-bold mb-6">Prześlij lub wklej link do wideo</h2>

            <div className="space-y-6">
              {/* Przesyłanie pliku */}
              <div>
                <label htmlFor="video-upload" className="block text-sm font-medium text-gray-300 mb-2">
                  Prześlij plik wideo:
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-700 border-dashed rounded-md hover:border-blue-500 transition-colors">
                  <div className="space-y-1 text-center">
                    <UploadCloud className="mx-auto h-12 w-12 text-gray-500" />
                    <div className="flex text-sm text-gray-400">
                      <label
                        htmlFor="video-upload-input"
                        className="relative cursor-pointer bg-slate-700 rounded-md font-medium text-blue-400 hover:text-blue-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-slate-900 focus-within:ring-blue-500 px-2 py-1"
                      >
                        <span>Wybierz plik</span>
                        <input id="video-upload-input" name="video-upload-input" type="file" className="sr-only" accept="video/*" onChange={handleFileChange} />
                      </label>
                      <p className="pl-1">lub przeciągnij i upuść</p>
                    </div>
                    <p className="text-xs text-gray-500">MP4, MOV, AVI, WMV do 500MB</p>
                  </div>
                </div>
                {videoFile && <p className="mt-2 text-sm text-green-400">Wybrano plik: {videoFile.name}</p>}
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-slate-700" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-slate-800 px-2 text-sm text-gray-400">LUB</span>
                </div>
              </div>

              {/* Wklejanie URL */}
              <div>
                <label htmlFor="video-url" className="block text-sm font-medium text-gray-300 mb-1">
                  Wklej URL wideo (np. YouTube, Vimeo):
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <LinkIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                    type="url"
                    name="video-url"
                    id="video-url"
                    className="bg-slate-700 border-slate-600 focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-3 py-2 sm:text-sm rounded-md"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={videoUrl}
                    onChange={handleUrlChange}
                    />
                </div>
              </div>
              
              {/* Opcje transkrypcji (przykładowe) */}
              <div className="pt-4 border-t border-slate-700">
                <h3 className="text-md font-semibold text-gray-200 mb-2 flex items-center">
                    <Settings className="w-5 h-5 mr-2 text-gray-400"/> Opcje transkrypcji
                </h3>
                <div className="space-y-2 text-sm">
                    <label className="flex items-center text-gray-300">
                        <input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-500 rounded bg-slate-700 focus:ring-blue-500 mr-2" defaultChecked />
                        Automatyczne wykrywanie języka
                    </label>
                    <label className="flex items-center text-gray-300">
                        <input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-500 rounded bg-slate-700 focus:ring-blue-500 mr-2" />
                        Identyfikacja mówców (jeśli możliwe)
                    </label>
                </div>
              </div>


              <button
                onClick={handleSubmitTranscription}
                disabled={transcriptionStatus === 'processing' || (!videoFile && !videoUrl)}
                className={`w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white 
                            ${(!videoFile && !videoUrl) || transcriptionStatus === 'processing'
                              ? 'bg-gray-500 cursor-not-allowed'
                              : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-blue-500'}
                            transition-all duration-150 ease-in-out`}
              >
                {transcriptionStatus === 'processing' ? (
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                    <FileText className="w-5 h-5 mr-2" />
                )}
                {transcriptionStatus === 'processing' ? 'Przetwarzanie...' : 'Rozpocznij transkrypcję'}
              </button>
            </div>
          </div>

          {/* Sekcja wyniku transkrypcji */}
          <div className="lg:col-span-2 bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700/50">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold flex items-center">
                    {getStatusIcon()}
                    Wynik transkrypcji
                </h2>
                {transcriptionStatus === 'completed' && (
                    <button className="text-sm text-blue-400 hover:text-blue-300 px-3 py-1 bg-slate-700 rounded-md hover:bg-slate-600 transition-colors">
                        Kopiuj tekst
                    </button>
                )}
            </div>
            
            {transcriptionStatus === 'idle' && !transcribedText && (
              <div className="text-center py-10 text-gray-500">
                <FileText size={48} className="mx-auto mb-4" />
                <p>Transkrypcja pojawi się tutaj po przetworzeniu wideo.</p>
                <p className="text-sm">Wybierz plik lub wklej URL, aby rozpocząć.</p>
              </div>
            )}

            {transcriptionStatus === 'processing' && (
              <div className="text-center py-10 text-blue-400">
                <Loader2 size={48} className="mx-auto mb-4 animate-spin" />
                <p>Trwa przetwarzanie wideo i generowanie transkrypcji...</p>
                <p className="text-sm text-gray-500">Może to zająć kilka chwil w zależności od długości wideo.</p>
              </div>
            )}

            {transcribedText && (
              <div className={`p-4 rounded-md text-sm leading-relaxed whitespace-pre-wrap 
                ${transcriptionStatus === 'error' ? 'bg-red-900/30 text-red-300 border border-red-700' : 'bg-slate-700/50 text-gray-200'}`}>
                {transcribedText}
              </div>
            )}

            {transcriptionStatus === 'completed' && (
                <div className="mt-6 pt-4 border-t border-slate-700">
                    <h3 className="text-md font-semibold text-gray-200 mb-2">Podsumowanie i Akcje</h3>
                    <div className="flex flex-wrap gap-3 text-sm">
                        <div className="flex items-center bg-slate-700 px-3 py-1 rounded-full">
                            <Clock size={14} className="mr-1.5 text-gray-400"/> Długość wideo: <span className="font-medium ml-1">00:02:35</span> (przykładowo)
                        </div>
                        <div className="flex items-center bg-slate-700 px-3 py-1 rounded-full">
                            <CheckCircle size={14} className="mr-1.5 text-green-400"/> Język: <span className="font-medium ml-1">Polski</span> (przykładowo)
                        </div>
                        <button className="flex items-center text-blue-400 hover:text-blue-300 bg-slate-700 px-3 py-1 rounded-md hover:bg-slate-600 transition-colors">
                            <FileText size={14} className="mr-1.5"/> Zapisz jako notatkę
                        </button>
                        <button className="flex items-center text-blue-400 hover:text-blue-300 bg-slate-700 px-3 py-1 rounded-md hover:bg-slate-600 transition-colors">
                            Eksportuj (.txt, .srt)
                        </button>
                    </div>
                </div>
            )}
          </div>
        </div>
      </main>

      {/* Stopka (identyczna jak w Dashboard) */}
      <footer className="py-6 border-t border-slate-800 mt-12">
        <div className="container mx-auto px-6 text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} AI EduPlatform. Wszelkie prawa zastrzeżone.</p>
        </div>
      </footer>
    </div>
  );
}