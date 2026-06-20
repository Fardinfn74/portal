import { useState } from 'react';
import { fileSystem } from '../files/fileData';
import { appRegistry } from '../apps/appRegistry';
import { Folder, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePacStore } from '../store/usePacStore';

type FolderAppId = keyof typeof fileSystem;

type FileExplorerWindowProps = {
  appId: FolderAppId;
};

// FieldValue removed because FolderViewer is now completely blank

type FolderViewerProps = {
  folderId: FolderAppId;
  canGoBack: boolean;
  onBack: () => void;
  onNavigate?: (id: FolderAppId) => void;
};

function FolderViewer({ folderId, canGoBack, onBack, onNavigate }: FolderViewerProps) {
  const openApp = usePacStore((s) => s.openApp);
  const setActiveImage = usePacStore((s) => s.setActiveImage);

  const handleImageClick = (src: string, alt: string) => {
    setActiveImage({ src, alt });
    openApp('imageViewer');
  };

  return (
    <div className="h-full w-full bg-transparent relative flex items-center justify-center">
      {canGoBack && (
        <button 
          onClick={onBack}
          className="absolute top-4 left-4 p-2 rounded-full text-white/30 hover:text-white/80 transition-colors z-10"
          title="Back"
        >
          <ArrowLeft size={24} />
        </button>
      )}

      {folderId === 'welcome' && (
        <div
          className="max-w-2xl w-full h-full overflow-y-auto pac-scrollbar pt-12 pb-8 px-8"
          style={{ fontFamily: '"Times New Roman", Times, serif' }}
        >
          <div className="text-white text-[1.1rem] leading-relaxed space-y-6 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] tracking-wide">
            <p className="text-2xl">👋 Welcome Visitor,</p>

            <p>I'm Fardin FN — an AI Engineer, IT student, open-source enthusiast, builder, and lifelong learner.</p>

            <p>This isn't just a portfolio; it's my digital workspace. Every window, project, and command tells a story of curiosity, problem-solving, and countless hours spent building intelligent systems.</p>

            <p>Feel free to explore the desktop, open folders, launch applications, or chat with Pacman, my built-in AI assistant, for a guided tour.</p>

            <p>Whether you're a recruiter, developer, collaborator, or simply curious, I hope you enjoy exploring my world as much as I enjoyed building it.</p>

            <p>Welcome to pacOS. Enjoy your stay.</p>
          </div>
        </div>
      )}
      {folderId === 'about' && (
        <div 
          className="max-w-2xl w-full h-full overflow-y-auto pac-scrollbar pt-12 pb-8 px-4"
          style={{ fontFamily: '"Times New Roman", Times, serif' }}
        >
          <div className="flex flex-col items-center mb-8">
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative"
            >
              <div className="absolute inset-0 rounded-full bg-white/20 blur-xl animate-pulse" />
              <img
                src="/fardin_pfp.jpg"
                alt="Profile"
                className="w-80 h-80 rounded-full object-cover border-2 border-white/50 shadow-[0_0_30px_rgba(255,255,255,0.4)] relative z-10"
              />
            </motion.div>
          </div>

          <div className="text-white text-[1.1rem] leading-relaxed space-y-5 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] tracking-wide">
            <p>Hi! I'm Fardin FN, an IT student passionate about building intelligent software that combines AI, modern web technologies, and exceptional user experiences.</p>
            <p>I enjoy developing full-stack applications, experimenting with AI agents, contributing to open-source projects, and participating in hackathons where creativity meets problem solving.</p>
            <p>Outside programming, I enjoy gardening, traveling, learning new technologies, exploring Linux ecosystems, and continuously improving my skills.</p>
            <p>Currently I'm focusing on:</p>
            <ul className="list-none space-y-2 ml-4">
              <li>• Artificial Intelligence</li>
              <li>• Full Stack Development</li>
              <li>• Linux & Open Source</li>
              <li>• Cloud Technologies</li>
              <li>• Competitive Hackathons</li>
              <li>• UI/UX Design</li>
              <li>• Software Engineering</li>
            </ul>
            <p>My long-term goal is to build products that solve real-world problems and make technology more accessible to everyone.</p>
          </div>
        </div>
      )}
      {folderId === 'hackathons' && (
        <div className="h-full w-full overflow-y-auto pac-scrollbar p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {fileSystem.hackathons.entries.map((entry, i) => (
              <motion.div
                key={entry.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all space-y-3"
              >
                <h3 className="text-xl font-bold text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">{entry.name.replace('.json', '')}</h3>
                <p className="text-white/70 text-sm">{entry.description}</p>
                <div className="space-y-1">
                  {Object.entries(entry.fields).map(([key, value]) => (
                    <p key={key} className="text-xs text-white/50">
                      <span className="uppercase tracking-widest mr-2">{key}:</span>
                      <span className="text-white/80">{Array.isArray(value) ? value.join(', ') : value}</span>
                    </p>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  {entry.tags?.map(tag => (
                    <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/60 uppercase tracking-tighter">
                      #{tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
      {folderId === 'blogs' && (
        <div className="h-full w-full overflow-y-auto pac-scrollbar p-8">
          <div className="max-w-2xl mx-auto space-y-8">
            {fileSystem.blogs.entries.map((entry, i) => (
              <motion.div
                key={entry.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="space-y-4"
                style={{ fontFamily: '"Times New Roman", Times, serif' }}
              >
                <h2 className="text-3xl font-bold text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">{entry.fields.intro as string}</h2>
                <div className="grid grid-cols-2 gap-4">
                  {(entry.fields.topics as string[]).map(topic => (
                    <div key={topic} className="p-3 rounded-lg bg-white/5 border border-white/10 text-white/80">
                      • {topic}
                    </div>
                  ))}
                </div>
                <p className="text-xl italic text-white/60 pt-4 border-t border-white/10">
                  {entry.fields.note as string}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      )}
      {folderId === 'gallery' && (
        <div className="h-full w-full overflow-y-auto pac-scrollbar p-8">
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-x-4 gap-y-8">
            <button
              onClick={() => onNavigate?.('gallery_basement')}
              className="group flex flex-col items-center justify-start gap-2 rounded-[6px] border border-transparent p-2 text-center transition hover:border-white/15 hover:bg-white/8"
            >
              <span className="pac-folder-icon scale-110" style={{ backgroundColor: '#ffffff' }} />
              <span className="max-w-full break-words text-[11px] font-medium leading-tight text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                basement
              </span>
            </button>
            <button
              onClick={() => onNavigate?.('gallery_hackathons')}
              className="group flex flex-col items-center justify-start gap-2 rounded-[6px] border border-transparent p-2 text-center transition hover:border-white/15 hover:bg-white/8"
            >
              <span className="pac-folder-icon scale-110" style={{ backgroundColor: '#ffffff' }} />
              <span className="max-w-full break-words text-[11px] font-medium leading-tight text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                hackathons
              </span>
            </button>
          </div>
        </div>
      )}
      {(folderId === 'gallery_basement' || folderId === 'gallery_hackathons') && (
        <div className="h-full w-full overflow-y-auto pac-scrollbar p-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {fileSystem[folderId].entries.map((entry, i) => (
              <motion.div
                key={entry.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="aspect-square rounded-lg overflow-hidden border border-white/10 hover:border-white/30 transition-all cursor-pointer group bg-white/5"
                onClick={() => handleImageClick(entry.fields.url as string, entry.name)}
              >
                <img
                  src={entry.fields.url as string}
                  alt={entry.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </motion.div>
            ))}
          </div>
        </div>
      )}
      {folderId === 'certificates' && (
        <div className="h-full w-full overflow-y-auto pac-scrollbar p-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {fileSystem.certificates.entries.map((entry, i) => (
              <motion.div
                key={entry.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="aspect-video rounded-lg overflow-hidden border border-white/10 shadow-[0_0_10px_rgba(255,255,255,0.1)] hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all group cursor-pointer bg-white/5"
                onClick={() => handleImageClick(entry.fields.url as string, entry.name)}
              >
                <img
                  src={entry.fields.url as string}
                  alt={entry.name}
                  className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                />
              </motion.div>
            ))}
          </div>
        </div>
      )}
      {folderId === 'experience' && (
        <div
          className="max-w-2xl w-full h-full overflow-y-auto pac-scrollbar pt-12 pb-8 px-4"
          style={{ fontFamily: '"Times New Roman", Times, serif' }}
        >
          <div className="text-white text-[1.1rem] leading-relaxed space-y-5 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] tracking-wide">
            <p>Currently building personal projects, contributing to open-source software, and continuously learning modern technologies.</p>
            <p className="font-bold text-xl mt-6">Areas of Experience</p>
            <ul className="list-none space-y-3 ml-4">
              <li>💻 Full Stack Development</li>
              <li>🤖 AI Integrations</li>
              <li>🌐 Web Development</li>
              <li>🧩 Open Source Contributions</li>
              <li>🚀 Rapid Product Prototyping</li>
              <li>👥 Team Collaboration</li>
              <li>🎤 Technical Presentations</li>
            </ul>
          </div>
        </div>
      )}
      {folderId === 'education' && (
        <div
          className="max-w-2xl w-full h-full overflow-y-auto pac-scrollbar pt-12 pb-8 px-4"
          style={{ fontFamily: '"Times New Roman", Times, serif' }}
        >
          <div className="text-white text-[1.1rem] leading-relaxed space-y-5 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] tracking-wide">
            <div className="space-y-1">
              <p className="text-2xl font-bold">Bachelor's Degree</p>
              <p className="text-xl">Information Technology (IT)</p>
            </div>
            <p className="font-bold text-xl mt-6">Focused Areas</p>
            <ul className="list-none space-y-3 ml-4">
              <li>💻 Software Engineering</li>
              <li>🌐 Web Development</li>
              <li>🤖 AI & Machine Learning</li>
              <li>📊 Database Systems</li>
              <li>☁️ Cloud Computing</li>
              <li>🧠 Problem Solving</li>
            </ul>
          </div>
        </div>
      )}
      {folderId === 'contact' && (
        <div
          className="max-w-2xl w-full h-full overflow-y-auto pac-scrollbar pt-12 pb-8 px-4"
          style={{ fontFamily: '"Times New Roman", Times, serif' }}
        >
          <div className="text-white text-[1.1rem] leading-relaxed space-y-6 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] tracking-wide">
            <p className="text-2xl font-bold">Let's build something amazing together!</p>

            <div className="flex flex-wrap gap-4 mt-6">
              <a
                href="mailto:fardin29bd@gmail.com"
                className="px-6 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all flex items-center gap-2 group"
              >
                <span>📧</span>
                <span className="font-bold">Email</span>
              </a>
              <a
                href="https://github.com/Fardinfn74"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all flex items-center gap-2 group"
              >
                <span>🐙</span>
                <span className="font-bold">GitHub</span>
              </a>
              <a
                href="https://www.linkedin.com/in/fardin-fn-684556211"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all flex items-center gap-2 group"
              >
                <span>💼</span>
                <span className="font-bold">LinkedIn</span>
              </a>
              <a
                href="https://www.instagram.com/its_fardinn_?igsh=NDYzaXN3M3VteGJ4"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all flex items-center gap-2 group"
              >
                <span>📸</span>
                <span className="font-bold">Instagram</span>
              </a>
              <a
                href="https://discord.gg/GF9W7TFt"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all flex items-center gap-2 group"
              >
                <span>🌐</span>
                <span className="font-bold">Discord</span>
              </a>
            </div>

            <p className="mt-8">
              Whether you have a project idea, collaboration opportunity, internship, hackathon invitation, or just want to connect, feel free to reach out.
            </p>
            <p>
              I'll get back to you as soon as possible.
            </p>
          </div>
        </div>
      )}
      {folderId === 'projects' && (
        <div
          className="max-w-2xl w-full h-full overflow-y-auto pac-scrollbar pt-12 pb-8 px-4"
          style={{ fontFamily: '"Times New Roman", Times, serif' }}
        >
          <div className="text-white text-[1.1rem] leading-relaxed space-y-8 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] tracking-wide">
            <section className="space-y-4">
              <h1 className="text-4xl font-bold">🌙 Luna AI</h1>
              <h3 className="text-xl font-semibold italic text-white/80">Your Intelligent Personal AI Assistant</h3>
              <p><strong>Status:</strong> 🚀 Active Development</p>
              <p>Luna AI is a next-generation personal AI assistant designed to help users with everyday tasks, learning, programming, productivity, and intelligent conversations. Built with modern AI technologies, Luna provides a natural and personalized experience while acting as a reliable digital companion.</p>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Highlights</h3>
                <ul className="list-none space-y-1 ml-4">
                  <li>🤖 Natural, human-like conversations</li>
                  <li>💻 Programming & debugging assistance</li>
                  <li>📚 Learning and educational support</li>
                  <li>📝 Writing, summarization & research</li>
                  <li>🌐 Web-assisted responses</li>
                  <li>⚡ Fast and responsive interface</li>
                  <li>🎯 Personalized user experience</li>
                  <li>🔒 Privacy-focused design</li>
                </ul>
              </div>
              <p><strong>Tech Stack</strong></p>
              <p className="text-white/70">React • Next.js • TypeScript • AI APIs • Tailwind CSS • Node.js</p>
            </section>

            <hr className="border-white/10" />

            <section className="space-y-4">
              <h1 className="text-4xl font-bold">💻 Luna Studio</h1>
              <h3 className="text-xl font-semibold italic text-white/80">Autonomous AI Code Editor</h3>
              <p><strong>Status:</strong> 🚀 Active Development</p>
              <p>Luna Studio is an AI-powered agentic code editor built to redefine the software development experience. Inspired by tools like Codex and Cursor, Luna Studio goes beyond code completion by understanding entire projects, planning implementations, editing multiple files, debugging issues, and assisting developers throughout the complete development lifecycle.</p>
              <p>The vision is to create an intelligent development environment where AI acts as a true software engineering partner rather than just an autocomplete tool.</p>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Features</h3>
                <ul className="list-none space-y-1 ml-4">
                  <li>🧠 Autonomous AI coding agents</li>
                  <li>📂 Full project understanding</li>
                  <li>⚙️ Multi-file code editing</li>
                  <li>🐞 Intelligent debugging</li>
                  <li>✨ Code generation & refactoring</li>
                  <li>📦 Project scaffolding</li>
                  <li>🔍 Codebase search & analysis</li>
                  <li>🚀 AI-assisted development workflow</li>
                </ul>
              </div>
              <p><strong>Tech Stack</strong></p>
              <p className="text-white/70">Electron • React • TypeScript • Monaco Editor • AI APIs • Node.js</p>
            </section>

            <hr className="border-white/10" />

            <section className="space-y-4">
              <h1 className="text-4xl font-bold">🎓 Learnova AI</h1>
              <h3 className="text-xl font-semibold italic text-white/80">Personalized AI Learning Platform</h3>
              <p><strong>Status:</strong> 🚀 Active Development</p>
              <p>Learnova AI is an intelligent tutoring platform designed to make education more interactive, personalized, and accessible. It adapts to each learner's needs, providing explanations, quizzes, study plans, and AI-powered guidance across multiple subjects.</p>
              <p>The goal of Learnova is to create an AI mentor that helps students learn more effectively through personalized teaching rather than one-size-fits-all education.</p>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Features</h3>
                <ul className="list-none space-y-1 ml-4">
                  <li>📖 AI-powered tutoring</li>
                  <li>🧠 Personalized learning paths</li>
                  <li>📝 Quiz & assessment generation</li>
                  <li>📚 Subject explanations</li>
                  <li>💡 Step-by-step problem solving</li>
                  <li>📅 Smart study planner</li>
                  <li>📊 Learning progress tracking</li>
                  <li>🎯 Adaptive recommendations</li>
                </ul>
              </div>
              <p><strong>Tech Stack</strong></p>
              <p className="text-white/70">React • Next.js • AI APIs • TypeScript • Firebase • Tailwind CSS</p>
            </section>

            <hr className="border-white/10" />

            <section className="space-y-4">
              <h1 className="text-4xl font-bold">🕹️ pacOS</h1>
              <h3 className="text-xl font-semibold italic text-white/80">Linux-Inspired Interactive Developer Portfolio</h3>
              <p><strong>Status:</strong> 🚀 Active Development</p>
              <p>pacOS transforms a traditional portfolio into an immersive Linux desktop experience. Visitors enter through a cinematic boot sequence and login screen before exploring an interactive operating system featuring projects, skills, experience, and achievements.</p>
              <p>Integrated into pacOS is <strong>Pacman</strong>, an intelligent AI assistant that helps visitors navigate the system, answer questions about my work, and provide an engaging portfolio experience.</p>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Features</h3>
                <ul className="list-none space-y-1 ml-4">
                  <li>🖥️ Interactive Linux desktop</li>
                  <li>🤖 Pacman AI assistant</li>
                  <li>🔐 Cinematic login experience</li>
                  <li>📁 Functional desktop applications</li>
                  <li>💬 AI-powered portfolio navigation</li>
                  <li>✨ Smooth animations & modern UI</li>
                  <li>📱 Responsive experience</li>
                </ul>
              </div>
              <p><strong>Tech Stack</strong></p>
              <p className="text-white/70">Next.js • React • Tailwind CSS • TypeScript • Framer Motion • AI APIs</p>
            </section>

            <hr className="border-white/10" />

            <section className="space-y-4 pb-8">
              <h1 className="text-4xl font-bold">🔭 Upcoming Projects</h1>
              <p>I enjoy building ambitious software that combines Artificial Intelligence, modern web technologies, and intuitive user experiences.</p>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Planned Projects</h3>
                <ul className="list-none space-y-1 ml-4">
                  <li>🧩 Open-source AI tools</li>
                  <li>🐧 Linux productivity utilities</li>
                  <li>🔐 Cybersecurity learning platform</li>
                  <li>☁️ Cloud-native applications</li>
                  <li>📦 Developer productivity software</li>
                  <li>🤖 Autonomous AI agents</li>
                  <li>🌍 Intelligent web applications</li>
                  <li>💡 Experimental AI research projects</li>
                </ul>
              </div>
            </section>
          </div>
        </div>
      )}
      {folderId === 'skills' && (
        <div 
          className="max-w-2xl w-full h-full overflow-y-auto pac-scrollbar pt-12 pb-8 px-4"
          style={{ fontFamily: '"Times New Roman", Times, serif' }}
        >
          <div className="text-white text-[1.1rem] leading-relaxed drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] tracking-wide whitespace-pre-wrap">
            {`Programming Languages
🐍 Python
🌐 JavaScript
☕ Java
⚙️ C
💻 HTML5
🎨 CSS3

Frontend
⚛️ React
⚡ Next.js
🎨 Tailwind CSS
🧩 Bootstrap

Backend
🟢 Node.js
🚀 Express.js
🔥 Firebase

Database
🍃 MongoDB
🐬 MySQL

AI & ML
🤖 OpenAI API
🧠 AI Agents
💬 Prompt Engineering
🔍 RAG Concepts

Cloud & DevOps
☁️ GitHub
🐳 Docker (Learning)
☁️ Google Cloud (Learning)

Tools
🐧 Linux
📝 VS Code
🌿 Git
🐙 GitHub
🎨 Figma
📮 Postman`}
          </div>
        </div>
      )}
    </div>
  );
}


function RootExplorer({ onNavigate }: { onNavigate: (folderId: FolderAppId) => void }) {
  const folders: FolderAppId[] = [
    'about', 'education', 'skills', 'experience', 'projects',
    'certificates', 'resume', 'contact', 'hackathons', 'blogs'
  ];

  return (
    <div className="flex h-full flex-col bg-transparent text-slate-100">
      <div className="border-b border-white/10 p-4">
        <p className="font-mono text-xs uppercase text-white/50 tracking-widest">Root / File Explorer</p>
      </div>
      <div className="flex-1 overflow-y-auto p-6 pac-scrollbar">
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-x-4 gap-y-8">
          {folders.map((f) => {
            const b = fileSystem[f];
            const app = appRegistry[f];
            return (
              <button
                key={f}
                onClick={() => onNavigate(f)}
                className="group flex flex-col items-center justify-start gap-2 rounded-[6px] border border-transparent p-2 text-center transition hover:border-white/15 hover:bg-white/8"
                title={`Open ${b.label}`}
              >
                <span className="pac-folder-icon scale-110" style={{ backgroundColor: app?.accent || '#ffffff' }} />
                <span className="max-w-full break-words text-[11px] font-medium leading-tight text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                  {b.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function FileExplorerWindow({ appId }: FileExplorerWindowProps) {
  const [currentFolder, setCurrentFolder] = useState<FolderAppId>(appId);

  if (currentFolder === 'fileExplorer') {
    return <RootExplorer onNavigate={setCurrentFolder} />;
  }

  const handleBack = () => {
    if (currentFolder === 'gallery_basement' || currentFolder === 'gallery_hackathons') {
      setCurrentFolder('gallery');
    } else {
      setCurrentFolder('fileExplorer');
    }
  };

  const canGoBack = appId === 'fileExplorer' || currentFolder === 'gallery_basement' || currentFolder === 'gallery_hackathons';

  return (
    <FolderViewer 
      folderId={currentFolder} 
      canGoBack={canGoBack}
      onBack={handleBack}
      onNavigate={setCurrentFolder}
    />
  );
}
