# AI EduPlatform
*An AI-powered educational platform for creating, managing, and transforming learning materials.*

---

## Table of Contents
1. [Project Overview](#project-overview)  
2. [Key Features](#key-features)  
3. [Getting Started](#getting-started)  
4. [Application Structure](#application-structure)  
5. [Technologies](#technologies)  
6. [Contributing](#contributing)  
7. [License](#license)  
8. [Support](#support)

---

## Project Overview
**AI EduPlatform** is a comprehensive learning tool that leverages artificial intelligence to help educators and students create, organize, and enhance their educational materials. The platform brings together note-taking, content generation, and multimedia processing to streamline every step of the learning journey.

---

## Key Features

### 📝 Smart Notes System
- Create, edit, and manage notes with rich formatting  
- Organize notes with tags and categories  
- Set visibility (private, public, or link-only)  
- AI-powered note generation and enhancement  

### 🎴 Flashcards
- Convert notes to interactive flashcards  
- Study with spaced-repetition scheduling  
- Customize categories and difficulty levels  

### 🎓 Educational Content Generation
- Transform notes into structured learning scenarios  
- Generate professional presentations from notes  
- Produce comprehensive study materials automatically  


### 🌐 Web Scraping
- Extract content from educational websites  
- Convert scraped content to formatted notes  
- Edit and customize imported material  

### 🎬 Video Transcription (coming in future)
- Convert video lectures to text  
- Support multiple video formats  
- Edit and save transcriptions as notes  

---

## Getting Started

### Prerequisites
- **Node.js** (v18 or later)  
- **MongoDB** *or* **Docker**  
- **PNPM** package manager  

### Installation
1. **Clone the repository**  
   ```bash
   git clone https://github.com/PAtreju/IdeaLab
   ```

2. **Set environment variables**  
   ```bash
   cp .env.example .env
   ```

3. **Install dependencies**  
   ```bash
   pnpm install
   ```

4. **Start the development server**  
   ```bash
   pnpm dev
   ```  
   Then open <http://localhost:3000> in your browser.

### Using Docker (Optional)
1. Ensure **Docker** and **Docker Compose** are installed.  
2. Run the containers:  
   ```bash
   docker compose up --build
   ```  
3. Visit <http://localhost:3000>.

---

## Application Structure
``` 
src/
├─ app/          # Front-end pages & layouts
├─ components/   # Reusable UI components
├─ hooks/        # Custom React hooks
├─ collections/  # Payload CMS collection definitions
└─ services/     # Service integrations (Ollama, etc.)
``` 

---

## Technologies
- **Frontend:** Next.js, React, Tailwind CSS  
- **Backend / CMS:** Payload CMS, Node.js  
- **Database:** MongoDB  
- **AI Integration:** Ollama (locally hosted models)  
- **Containerization:** Docker  
