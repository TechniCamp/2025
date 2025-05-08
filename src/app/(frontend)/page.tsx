'use client'

import { useState } from 'react'
import {
  ChevronRight,
  BookOpen,
  Globe,
  Brain,
  BookMarked,
  FileText,
  Menu,
  X,
  Lightbulb,
  Sparkles,
  Target,
} from 'lucide-react'
import type { JSX } from 'react/jsx-runtime'
import Link from 'next/link'

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false)

  // Subject data
  const subjectsData = [
    {
      id: 'stem',
      title: 'STEM Subjects',
      description:
        'Generate comprehensive materials for science, technology, engineering, and mathematics.',
      color: 'from-blue-500 to-sky-400',
      hoverColor: 'from-blue-600 to-sky-500',
      textColor: 'text-blue-500',
      icon: <Brain className="w-6 h-6" />,
    },
    {
      id: 'humanities',
      title: 'Humanities',
      description:
        'Create review materials for literature, history, philosophy, and social sciences.',
      color: 'from-green-500 to-emerald-400',
      hoverColor: 'from-green-600 to-emerald-500',
      textColor: 'text-green-500',
      icon: <BookOpen className="w-6 h-6" />,
    },
    {
      id: 'languages',
      title: 'Languages',
      description:
        'Develop language learning resources from vocabulary to advanced conversation practice.',
      color: 'from-purple-500 to-violet-400',
      hoverColor: 'from-purple-600 to-violet-500',
      textColor: 'text-purple-500',
      icon: <Globe className="w-6 h-6" />,
    },
  ]

  // Tools data
  const toolsData = [
    {
      id: 'assessments',
      title: 'Assessments & Quizzes',
      description:
        'Generate customized tests, quizzes, and practice exams with answer keys and explanations.',
      color: 'from-amber-500 to-yellow-400',
      hoverColor: 'from-amber-600 to-yellow-500',
      textColor: 'text-amber-500',
      icon: <Target className="w-6 h-6" />,
    },
    {
      id: 'materials',
      title: 'Study Materials',
      description:
        'Create comprehensive study guides, flashcards, summaries, and visual aids for any subject.',
      color: 'from-red-500 to-rose-400',
      hoverColor: 'from-red-600 to-rose-500',
      textColor: 'text-red-500',
      icon: <FileText className="w-6 h-6" />,
    },
  ]

  // Features section
  const featuresData = [
    {
      id: 'customized',
      title: 'Customized Content',
      description:
        'Our AI tailors materials to specific learning objectives, difficulty levels, and educational standards.',
      icon: <Sparkles className="w-12 h-12 text-indigo-500" />,
    },
    {
      id: 'interactive',
      title: 'Interactive Resources',
      description:
        'Generate engaging, interactive learning materials that promote active learning and retention.',
      icon: <BookMarked className="w-12 h-12 text-emerald-500" />,
    },
    {
      id: 'comprehensive',
      title: 'Comprehensive Coverage',
      description:
        'From quick review sheets to in-depth study guides, create materials that cover exactly what you need.',
      icon: <Lightbulb className="w-12 h-12 text-blue-500" />,
    },
  ]

  // Helper function for subject cards
  interface Subject {
    id: string
    title: string
    description: string
    color: string
    hoverColor: string
    textColor: string
    icon: JSX.Element
  }

  const SubjectCard = ({ subject }: { subject: Subject }) => (
    <Link
      href="/app"
      className="group relative overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black opacity-95 group-hover:opacity-90 transition-opacity"></div>
      <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-gradient-to-br transition-opacity duration-300"></div>

      {/* Border gradient */}
      <div className="absolute inset-0 p-0.5 rounded-2xl bg-gradient-to-br opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div className="relative p-8 h-full flex flex-col">
        <div className="mb-6 flex items-center">
          <div
            className={`p-3 rounded-xl bg-gradient-to-br ${subject.color} shadow-lg transition-all duration-300 group-hover:scale-110`}
          >
            {subject.icon}
          </div>
          <div className="ml-4 h-px flex-1 bg-gradient-to-r from-gray-700 to-transparent"></div>
        </div>

        <h3 className={`text-2xl font-bold mb-3 ${subject.textColor} transition-colors`}>
          {subject.title}
        </h3>

        <p className="text-gray-400 mb-6 flex-grow">{subject.description}</p>

        <div className={`flex items-center mt-auto font-medium ${subject.textColor}`}>
          <span>Generate Materials</span>
          <ChevronRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-900 text-white overflow-hidden">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-lg bg-slate-900/80 py-4 border-b border-slate-800/70">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-blue-600">
            EduMaterial AI
          </div>

          <Link
            href="/auth/login"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 
                     text-white font-medium py-2 px-4 rounded-lg transition-all shadow-md 
                     hover:shadow-lg"
          >
            Log In
          </Link>
        </div>

        {/* Mobile menu expanded */}
        {menuOpen && (
          <div className="md:hidden bg-slate-900 py-4 px-6 mt-4 rounded-lg shadow-lg">
            <div className="flex flex-col space-y-4">
              <button className="text-gray-300 hover:text-white transition-colors">Subjects</button>
              <button className="text-gray-300 hover:text-white transition-colors">Tools</button>
              <button className="text-gray-300 hover:text-white transition-colors">Features</button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        {/* Animated dots background */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute w-2 h-2 bg-blue-500 rounded-full top-1/4 left-1/4 animate-pulse"
            style={{ animationDuration: '3s' }}
          ></div>
          <div
            className="absolute w-1 h-1 bg-purple-500 rounded-full top-1/3 left-2/3 animate-pulse"
            style={{ animationDuration: '4s' }}
          ></div>
          <div
            className="absolute w-2 h-2 bg-green-500 rounded-full top-1/2 left-1/3 animate-pulse"
            style={{ animationDuration: '5s' }}
          ></div>
          <div
            className="absolute w-1 h-1 bg-yellow-500 rounded-full top-2/3 left-3/4 animate-pulse"
            style={{ animationDuration: '4.5s' }}
          ></div>
        </div>

        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-sm font-medium px-4 py-1 rounded-full inline-flex items-center mb-8 mx-auto shadow-lg">
            <span className="animate-pulse mr-2 bg-white h-2 w-2 rounded-full"></span> Open Beta •
            Join Today
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-blue-200">
            Generate Learning Materials with{' '}
            <span className="relative inline-block">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-blue-600">
                AI
              </span>
              <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-sky-400 to-blue-600 rounded-full"></span>
            </span>
          </h1>

          <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Create customized study guides, practice tests, flashcards, and more for any subject
            with our advanced AI platform designed for educators and students.
          </p>

          <div className="flex flex-col md:flex-row justify-center items-center gap-4">
            <Link
              href="/app"
              className="inline-flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 
                       text-white font-semibold py-3 px-8 rounded-lg shadow-lg
                       transition-all transform hover:scale-105 w-full md:w-auto justify-center"
            >
              Start Creating <ChevronRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Subjects Section */}
      <section className="py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-800 opacity-50"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-block bg-blue-900/30 text-blue-400 px-4 py-1 rounded-full text-sm font-medium mb-4">
              Subjects
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What would you like to{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-blue-500">
                create today
              </span>
              ?
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Select a subject area to start generating customized learning materials powered by
              artificial intelligence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {subjectsData.map((subject) => (
              <SubjectCard key={subject.id} subject={subject} />
            ))}
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-800 to-slate-900 opacity-50"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-block bg-purple-900/30 text-purple-400 px-4 py-1 rounded-full text-sm font-medium mb-4">
              Tools
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Powerful{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-violet-500">
                creation tools
              </span>
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Use our specialized tools to generate exactly the type of educational materials you
              need.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {toolsData.map((tool) => (
              <Link
                href="/app"
                key={tool.id}
                className="group relative overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black opacity-95 group-hover:opacity-90 transition-opacity"></div>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-gradient-to-br transition-opacity duration-300"></div>

                {/* Border gradient */}
                <div className="absolute inset-0 p-0.5 rounded-2xl bg-gradient-to-br opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="relative p-8 h-full flex flex-col">
                  <div className="mb-6 flex items-center">
                    <div
                      className={`p-3 rounded-xl bg-gradient-to-br ${tool.color} shadow-lg transition-all duration-300 group-hover:scale-110`}
                    >
                      {tool.icon}
                    </div>
                    <div className="ml-4 h-px flex-1 bg-gradient-to-r from-gray-700 to-transparent"></div>
                  </div>

                  <h3 className={`text-2xl font-bold mb-3 ${tool.textColor} transition-colors`}>
                    {tool.title}
                  </h3>

                  <p className="text-gray-400 mb-6 flex-grow">{tool.description}</p>

                  <div className={`flex items-center mt-auto font-medium ${tool.textColor}`}>
                    <span>Access Tool</span>
                    <ChevronRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-800 opacity-50"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-block bg-indigo-900/30 text-indigo-400 px-4 py-1 rounded-full text-sm font-medium mb-4">
              Features
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-blue-500">
                choose us
              </span>{' '}
              for your materials?
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Our platform uses advanced AI technology to create high-quality, customized
              educational resources in minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {featuresData.map((feature) => (
              <div
                key={feature.id}
                className="bg-slate-800/50 backdrop-blur rounded-xl p-8 border border-slate-700/50 hover:border-slate-600/50 transition-all"
              >
                <div className="mb-6">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-sky-500">
                15k+
              </div>
              <p className="text-gray-300 mt-2 text-sm">Satisfied Users</p>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-500">
                1M+
              </div>
              <p className="text-gray-300 mt-2 text-sm">Materials Generated</p>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-violet-500">
                99%
              </div>
              <p className="text-gray-300 mt-2 text-sm">User Satisfaction</p>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-yellow-500">
                24/7
              </div>
              <p className="text-gray-300 mt-2 text-sm">AI Assistance</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call-to-action Section */}
      <section className="py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-800 to-slate-900 opacity-50"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 shadow-2xl border border-slate-700/50">
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Ready to transform your teaching and learning?
              </h2>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                Join us today and discover how AI can streamline your educational material creation.
                Generate your first resource completely free!
              </p>
              <Link
                href="/app"
                className="inline-flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 
                         text-white font-semibold py-3 px-6 rounded-lg shadow-lg
                         transition-all transform hover:scale-105"
              >
                Start Now <ChevronRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-800">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-blue-600">
                EduMaterial AI
              </div>
              <p className="text-gray-400 mt-4 text-sm">
                Revolutionizing education with AI-powered material generation. Create smarter, not
                harder.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Subjects</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <button className="hover:text-white transition-colors">STEM Subjects</button>
                </li>
                <li>
                  <button className="hover:text-white transition-colors">Humanities</button>
                </li>
                <li>
                  <button className="hover:text-white transition-colors">Languages</button>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Tools</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <button className="hover:text-white transition-colors">
                    Assessments & Quizzes
                  </button>
                </li>
                <li>
                  <button className="hover:text-white transition-colors">Study Materials</button>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <button className="hover:text-white transition-colors">About Us</button>
                </li>
                <li>
                  <button className="hover:text-white transition-colors">Help Center</button>
                </li>
                <li>
                  <button className="hover:text-white transition-colors">Privacy Policy</button>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-800 text-center text-gray-400 text-sm">
            <p>© {new Date().getFullYear()} EduMaterial AI. All rights reserved.</p>
            <p className="mt-1">Created with passion for education and technology.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
