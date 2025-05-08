'use client'

import { useState } from 'react'
import {
  Link,
  ChevronLeft,
  Search,
  FileText,
  ExternalLink,
  AlertTriangle,
  X,
  Globe,
  Clock,
  Menu,
  User,
  ArrowRight,
  Save,
  FileEdit,
} from 'lucide-react'

export default function ScrapingPage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [url, setUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [scrapingDone, setScrapingDone] = useState(false)
  const [scrapedContent, setScrapedContent] = useState('')
  const [activeTab, setActiveTab] = useState('original') // 'original', 'edited'
  const [editedContent, setEditedContent] = useState('')
  const [title, setTitle] = useState('')
  const [showPreview, setShowPreview] = useState(false)

  // Historia scrapowania (przykładowe dane)
  const scrapingHistory = [
    {
      id: 1,
      title: 'Wikipedia - Sztuczna inteligencja',
      url: 'https://pl.wikipedia.org/wiki/Sztuczna_inteligencja',
      date: '05-05-2025',
    },
    {
      id: 2,
      title: 'Dokumentacja React',
      url: 'https://react.dev/reference/react',
      date: '02-05-2025',
    },
    {
      id: 3,
      title: 'Artykuł naukowy o Deep Learning',
      url: 'https://arxiv.org/abs/1234.5678',
      date: '28-04-2025',
    },
  ]

  // Symulacja procesu scrapowania
  const handleScrape = () => {
    if (!url) return

    setIsLoading(true)

    // Symulujemy opóźnienie pobierania danych
    setTimeout(() => {
      // Przykładowy pobrany tekst
      const scrapedText = `# ${url.includes('wikipedia') ? 'Sztuczna inteligencja' : 'Zawartość strony internetowej'}

## Wprowadzenie

Jest to przykładowa zawartość scrapowana ze strony ${url}. W rzeczywistej aplikacji ten tekst byłby pobierany z podanego adresu URL poprzez API scraping'u.

## Główna zawartość

Sztuczna inteligencja (ang. artificial intelligence, AI) – dziedzina wiedzy obejmująca logikę rozmytą, obliczenia ewolucyjne, sieci neuronowe, sztuczne życie i robotykę. Pojęcie to zostało stworzone w połowie XX wieku przez Johna McCarthy'ego i oznacza umiejętność systemów do nabywania i wykorzystywania wiedzy, obserwacji otoczenia oraz interakcji z nim, w celu właściwego, racjonalnego reagowania.

## Podsekcja 1

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl nec ultricies lacinia, nisl nisl aliquet nisl, nec ultricies nisl nisl nec ultricies.

## Podsekcja 2

* Punkt pierwszy
* Punkt drugi
* Punkt trzeci

## Podsumowanie

To jest przykładowy tekst scrapowany ze strony. W rzeczywistej aplikacji byłaby to prawdziwa zawartość ze strony ${url}.`

      setScrapedContent(scrapedText)
      setEditedContent(scrapedText)
      setTitle(
        url.includes('wikipedia') ? 'Sztuczna inteligencja' : 'Zawartość strony internetowej',
      )
      setScrapingDone(true)
      setIsLoading(false)
    }, 2000)
  }

  // Zapisanie zescrapowanej treści jako notatka
  const saveAsNote = () => {
    alert('Notatka została zapisana!')
    // W rzeczywistej aplikacji: zapisanie do bazy danych
  }

  // Renderowanie podglądu markdown
  const renderMarkdown = (content: string) => {
    // Prosta implementacja renderowania markdownu (w rzeczywistej aplikacji użylibyśmy biblioteki)
    return (
      <div className="markdown-preview">
        {/* Przykładowe renderowanie nagłówków */}
        {content.split('\n').map((line, index) => {
          if (line.startsWith('# ')) {
            return (
              <h1 key={index} className="text-2xl font-bold mb-4">
                {line.substring(2)}
              </h1>
            )
          } else if (line.startsWith('## ')) {
            return (
              <h2 key={index} className="text-xl font-bold mt-6 mb-3">
                {line.substring(3)}
              </h2>
            )
          } else if (line.startsWith('* ')) {
            return (
              <li key={index} className="ml-6 mb-1">
                {line.substring(2)}
              </li>
            )
          } else if (line === '') {
            return <br key={index} />
          } else {
            return (
              <p key={index} className="mb-3">
                {line}
              </p>
            )
          }
        })}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-900 text-white">
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
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Menu mobilne rozwinięte */}
        {menuOpen && (
          <div className="md:hidden bg-slate-900 py-4 px-6 mt-4 rounded-lg shadow-lg">
            <div className="flex flex-col space-y-4">
              <button className="text-gray-300 hover:text-white transition-colors">
                Dashboard
              </button>
              <button className="text-gray-300 hover:text-white transition-colors">Notatki</button>
            </div>
          </div>
        )}
      </nav>

      {/* Główna zawartość */}
      <main className="container mx-auto px-6 py-8">
        {/* Nawigacja wstecz i tytuł sekcji */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => window.history.back()}
            className="mr-4 p-2 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold flex items-center">
            <Link className="w-6 h-6 mr-2 text-green-500" />
            Scrapowanie Stron
          </h1>
        </div>

        {/* Formularz URL */}
        <div className="bg-slate-800 rounded-xl p-6 mb-6 border border-slate-700">
          <h2 className="text-lg font-semibold mb-4">Podaj adres strony do scrapowania</h2>

          <div className="flex flex-col md:flex-row gap-3 mb-2">
            <div className="flex-grow relative">
              <Globe className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="url"
                placeholder="https://example.com"
                className="w-full bg-slate-700 border border-slate-600 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-green-500"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
            <button
              onClick={handleScrape}
              disabled={isLoading || !url}
              className={`px-6 py-3 rounded-lg font-medium flex items-center justify-center min-w-32 transition-colors ${
                isLoading || !url
                  ? 'bg-green-600/50 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Pobieram...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5 mr-2" />
                  Scrapuj
                </>
              )}
            </button>
          </div>

          <p className="text-sm text-gray-400 flex items-center">
            <AlertTriangle className="w-4 h-4 mr-1 text-yellow-500" />
            Upewnij się, że podany adres URL jest publicznie dostępny i posiadasz odpowiednie prawa.
          </p>
        </div>

        {scrapingDone ? (
          <>
            {/* Sekcja edycji scrapowanej treści */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <div className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700">
                  {/* Zakładki */}
                  <div className="flex border-b border-slate-700">
                    <button
                      className={`flex-1 py-3 px-4 font-medium text-sm ${
                        activeTab === 'original'
                          ? 'bg-slate-700 text-white'
                          : 'text-gray-400 hover:text-white'
                      }`}
                      onClick={() => setActiveTab('original')}
                    >
                      Oryginalna treść
                    </button>
                    <button
                      className={`flex-1 py-3 px-4 font-medium text-sm ${
                        activeTab === 'edited'
                          ? 'bg-slate-700 text-white'
                          : 'text-gray-400 hover:text-white'
                      }`}
                      onClick={() => setActiveTab('edited')}
                    >
                      Edytowana treść
                    </button>
                  </div>

                  {/* Zawartość zakładek */}
                  <div className="p-4">
                    {/* Pole tytułu */}
                    <input
                      type="text"
                      placeholder="Tytuł notatki"
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-4 mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      disabled={activeTab === 'original'}
                    />

                    {/* Treść */}
                    {activeTab === 'original' ? (
                      <div className="bg-slate-900 rounded-lg p-4 min-h-96 overflow-auto">
                        <pre className="text-gray-300 whitespace-pre-wrap font-mono text-sm">
                          {scrapedContent}
                        </pre>
                      </div>
                    ) : (
                      <>
                        <textarea
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-4 min-h-96 focus:outline-none focus:ring-2 focus:ring-green-500 font-mono text-sm"
                          value={editedContent}
                          onChange={(e) => setEditedContent(e.target.value)}
                        />
                        <div className="flex justify-between mt-4">
                          <button
                            onClick={() => setShowPreview(!showPreview)}
                            className="flex items-center text-sm text-gray-400 hover:text-white"
                          >
                            {showPreview ? 'Ukryj podgląd' : 'Pokaż podgląd'}
                            <ArrowRight
                              className={`ml-1 w-4 h-4 transition-transform ${showPreview ? 'rotate-90' : ''}`}
                            />
                          </button>
                          <div className="flex space-x-2">
                            <button
                              onClick={saveAsNote}
                              className="flex items-center bg-green-600 hover:bg-green-700 py-2 px-4 rounded-lg transition-colors text-sm"
                            >
                              <Save className="w-4 h-4 mr-2" />
                              Zapisz jako notatkę Zapisz jako notatkę
                            </button>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Podgląd markdown */}
                    {activeTab === 'edited' && showPreview && (
                      <div className="mt-4 bg-slate-700 rounded-lg p-6 border border-slate-600">
                        <h3 className="text-lg font-medium mb-3">Podgląd</h3>
                        <div className="prose prose-invert max-w-none">
                          {renderMarkdown(editedContent)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Panel boczny z historią i ustawieniami */}
              <div>
                <div className="bg-slate-800 rounded-xl p-5 border border-slate-700 mb-6">
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-green-500" />
                    Historia scrapowania
                  </h3>

                  <div className="space-y-3">
                    {scrapingHistory.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors cursor-pointer"
                      >
                        <h4 className="font-medium text-sm mb-1 truncate">{item.title}</h4>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-400 truncate max-w-32">{item.url}</span>
                          <span className="text-gray-400">{item.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
                  <h3 className="text-lg font-semibold mb-3">Ustawienia scrapowania</h3>

                  <div className="space-y-4">
                    <div>
                      <label className="flex items-center text-sm mb-2">
                        <input
                          type="checkbox"
                          className="rounded mr-2 bg-slate-700 border-slate-600"
                        />
                        Automatyczne usuwanie stylów
                      </label>
                    </div>

                    <div>
                      <label className="flex items-center text-sm mb-2">
                        <input
                          type="checkbox"
                          className="rounded mr-2 bg-slate-700 border-slate-600"
                        />
                        Zachowaj tylko tekst (bez obrazów)
                      </label>
                    </div>

                    <div>
                      <label className="flex items-center text-sm mb-2">
                        <input
                          type="checkbox"
                          className="rounded mr-2 bg-slate-700 border-slate-600"
                        />
                        Automatycznie konwertuj do Markdown
                      </label>
                    </div>

                    <div>
                      <p className="text-sm mb-2">Maksymalna liczba akapitów:</p>
                      <select className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-3">
                        <option>Bez limitu</option>
                        <option>10</option>
                        <option>20</option>
                        <option>50</option>
                        <option>100</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Sekcja informacyjna gdy nie ma jeszcze zescrapowanej treści */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 h-full flex flex-col justify-center items-center py-20">
                <div className="text-center mb-6">
                  <div className="bg-slate-700 p-4 rounded-full inline-block mb-4">
                    <Link className="w-10 h-10 text-green-500" />
                  </div>
                  <h2 className="text-xl font-bold mb-2">Rozpocznij scrapowanie strony</h2>
                  <p className="text-gray-400 mb-4 max-w-md mx-auto">
                    Podaj URL strony, którą chcesz zapisać jako notatkę. Narzędzie pobierze tekst i
                    sformatuje go do Markdown.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl">
                  <div className="bg-slate-700 p-4 rounded-lg text-center">
                    <Globe className="w-6 h-6 mx-auto mb-2 text-green-500" />
                    <h3 className="font-medium text-sm mb-1">Pobieraj treści ze stron</h3>
                    <p className="text-xs text-gray-400">Artykuły, blogi, dokumentacje</p>
                  </div>
                  <div className="bg-slate-700 p-4 rounded-lg text-center">
                    <FileText className="w-6 h-6 mx-auto mb-2 text-green-500" />
                    <h3 className="font-medium text-sm mb-1">Automatyczne formatowanie</h3>
                    <p className="text-xs text-gray-400">Konwersja do czytelnego Markdown</p>
                  </div>
                  <div className="bg-slate-700 p-4 rounded-lg text-center">
                    <FileEdit className="w-6 h-6 mx-auto mb-2 text-green-500" />
                    <h3 className="font-medium text-sm mb-1">Łatwa edycja</h3>
                    <p className="text-xs text-gray-400">Dostosuj treść do swoich potrzeb</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="bg-slate-800 rounded-xl p-5 border border-slate-700 mb-6">
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-green-500" />
                  Historia scrapowania
                </h3>

                <div className="space-y-3">
                  {scrapingHistory.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors cursor-pointer"
                    >
                      <h4 className="font-medium text-sm mb-1 truncate">{item.title}</h4>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-400 truncate max-w-32">{item.url}</span>
                        <span className="text-gray-400">{item.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <ExternalLink className="w-5 h-5 mr-2 text-green-500" />
                  Przykładowe źródła
                </h3>

                <div className="space-y-2 text-sm">
                  <p className="text-gray-400">Wypróbuj scrapowanie na tych stronach:</p>
                  <ul className="space-y-1 text-blue-400">
                    <li className="flex items-center">
                      <ArrowRight className="w-3 h-3 mr-2" />
                      <a href="#" className="hover:underline">
                        Wikipedia - artykuły naukowe
                      </a>
                    </li>
                    <li className="flex items-center">
                      <ArrowRight className="w-3 h-3 mr-2" />
                      <a href="#" className="hover:underline">
                        Medium - artykuły techniczne
                      </a>
                    </li>
                    <li className="flex items-center">
                      <ArrowRight className="w-3 h-3 mr-2" />
                      <a href="#" className="hover:underline">
                        Dokumentacje techniczne
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Stopka */}
      <footer className="py-6 border-t border-slate-800 mt-12">
        <div className="container mx-auto px-6 text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} AI EduPlatform. Wszelkie prawa zastrzeżone.</p>
        </div>
      </footer>
    </div>
  )
}
