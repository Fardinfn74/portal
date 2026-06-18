import { useState } from 'react';
import { fileSystem } from '../files/fileData';
import { Folder, ArrowLeft } from 'lucide-react';

type FolderAppId = keyof typeof fileSystem;

type FileExplorerWindowProps = {
  appId: FolderAppId;
};

// FieldValue removed because FolderViewer is now completely blank

type FolderViewerProps = {
  folderId: FolderAppId;
  canGoBack: boolean;
  onBack: () => void;
};

function FolderViewer({ folderId, canGoBack, onBack }: FolderViewerProps) {
  return (
    <div className="h-full w-full bg-transparent relative flex items-center justify-center p-8">
      {canGoBack && (
        <button 
          onClick={onBack}
          className="absolute top-4 left-4 p-2 rounded-full text-white/30 hover:text-white/80 transition-colors z-10"
          title="Back to Root"
        >
          <ArrowLeft size={24} />
        </button>
      )}

      {folderId === 'about' && (
        <div 
          className="max-w-2xl w-full h-full overflow-y-auto ghost-scrollbar pt-12 pb-8 px-4"
          style={{ fontFamily: '"Times New Roman", Times, serif' }}
        >
          <div className="text-white text-[1.1rem] leading-relaxed space-y-5 drop-shadow-[0_0_12px_rgba(255,255,255,0.8)] tracking-wide">
            <p>Hi! I'm Fardin FN, an IT student passionate about building intelligent software that combines AI, modern web technologies, and exceptional user experiences.</p>
            <p>I enjoy developing full-stack applications, experimenting with AI agents, contributing to open-source projects, and participating in national hackathons where creativity meets problem solving.</p>
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
      {folderId === 'skills' && (
        <div 
          className="max-w-2xl w-full h-full overflow-y-auto ghost-scrollbar pt-12 pb-8 px-4"
          style={{ fontFamily: '"Times New Roman", Times, serif' }}
        >
          <div className="text-white text-[1.1rem] leading-relaxed drop-shadow-[0_0_12px_rgba(255,255,255,0.8)] tracking-wide whitespace-pre-wrap">
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
      {folderId === 'hackathons' && (
        <div 
          className="max-w-2xl w-full h-full overflow-y-auto ghost-scrollbar pt-12 pb-8 px-4"
          style={{ fontFamily: '"Times New Roman", Times, serif' }}
        >
          <div className="text-white text-[1.1rem] leading-relaxed drop-shadow-[0_0_12px_rgba(255,255,255,0.8)] tracking-wide whitespace-pre-wrap">
            {`I actively participate in national hackathons where I collaborate with talented developers, solve real-world challenges, and rapidly build innovative products.

Highlights

🏆 National Hackathon Finalist
🤖 AI BuildFest Finalist
💡 Built AI-powered applications
👨💻 Worked in cross-functional teams
🎤 Delivered project pitches to industry judges
⏱️ Experienced multiple 12–24 hour hackathons

Hackathons have helped me improve problem-solving, teamwork, communication, and rapid product development skills.`}
          </div>
        </div>
      )}
    </div>
  );
}

function RootExplorer({ onNavigate }: { onNavigate: (folderId: FolderAppId) => void }) {
  const folders: FolderAppId[] = [
    'about', 'projects', 'skills', 'hackathons', 
    'experience', 'education', 'certificates', 'blogs', 
    'contact', 'resume'
  ];

  return (
    <div className="flex h-full flex-col bg-transparent text-slate-100">
      <div className="border-b border-white/10 p-4">
        <p className="font-mono text-xs uppercase text-white/50 tracking-widest">Root / File Explorer</p>
      </div>
      <div className="flex-1 overflow-y-auto p-6 ghost-scrollbar">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-6">
          {folders.map((f) => {
            const b = fileSystem[f];
            return (
              <button
                key={f}
                onClick={() => onNavigate(f)}
                className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-transparent p-4 transition-all hover:bg-white/5 hover:border-white/10 group"
              >
                <Folder
                  size={56}
                  strokeWidth={1}
                  className="text-blue-100/80 transition-transform duration-300 group-hover:scale-110 group-hover:text-blue-100"
                />
                <span className="font-mono text-xs tracking-wider text-white/70 group-hover:text-white">
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

  return (
    <FolderViewer 
      folderId={currentFolder} 
      canGoBack={appId === 'fileExplorer'} 
      onBack={() => setCurrentFolder('fileExplorer')} 
    />
  );
}
