import type { AppId } from '../core/types';

export type FileValue = string | string[];

export type FileEntry = {
  name: string;
  type: string;
  description: string;
  fields: Record<string, FileValue>;
  tags?: string[];
};

export type FileBundle = {
  label: string;
  path: string;
  summary: string;
  entries: FileEntry[];
};

export const fileSystem: Record<Exclude<AppId, 'terminal' | 'games' | 'browser'>, FileBundle> = {
  about: {
    label: 'About_Me',
    path: '/home/fardin/Desktop/About_Me',
    summary:
      'CSE student focused on frontend engineering, cybersecurity labs, CTF practice, and building sharp browser experiences.',
    entries: [
      {
        name: 'about.txt',
        type: 'text/plain',
        description: 'Short personal profile used by GhostOS.',
        fields: {
          name: 'Fardin',
          role: 'CSE Student / Frontend Engineer',
          focus: ['React + TypeScript', 'security-minded UI', 'CTF tooling', 'portfolio systems'],
          location: 'Bangladesh',
        },
        tags: ['bio', 'profile'],
      },
      {
        name: 'operating-principles.json',
        type: 'application/json',
        description: 'How Fardin approaches projects.',
        fields: {
          build_style: 'ship working systems first, refine architecture second',
          strengths: ['fast prototyping', 'clean UI states', 'debugging', 'security curiosity'],
          current_goal: 'turn portfolio viewers into active desktop explorers',
        },
        tags: ['workflow', 'values'],
      },
    ],
  },
  projects: {
    label: 'Projects',
    path: '/home/fardin/Desktop/Projects',
    summary: 'Realistic project samples arranged like inspectable files.',
    entries: [
      {
        name: 'GhostOS.portfolio.json',
        type: 'project',
        description: 'Browser OS portfolio with boot flow, desktop apps, terminal commands, games, and assistant.',
        fields: {
          stack: ['React', 'TypeScript', 'Tailwind CSS', 'Zustand', 'Framer Motion', 'xterm.js'],
          role: 'system architecture, frontend implementation, interaction design',
          status: 'production-ready prototype',
          highlights: ['window manager', 'animated wallpaper', 'Pacman assistant', 'terminal command layer'],
        },
        tags: ['frontend', 'portfolio', 'os-simulation'],
      },
      {
        name: 'CTF-Writeup-Engine.json',
        type: 'project',
        description: 'A searchable writeup organizer for web, crypto, forensics, and reverse challenges.',
        fields: {
          stack: ['React', 'Markdown', 'IndexedDB'],
          role: 'frontend, data model, offline search',
          status: 'working demo',
          highlights: ['tag filters', 'difficulty lanes', 'copyable payload snippets'],
        },
        tags: ['security', 'ctf', 'tools'],
      },
      {
        name: 'CampusConnect.portal.json',
        type: 'project',
        description: 'Student dashboard concept for notices, events, course resources, and club activities.',
        fields: {
          stack: ['React', 'Firebase', 'Tailwind CSS'],
          role: 'UI engineering, component design, routing',
          status: 'prototype',
          highlights: ['dashboard widgets', 'notice board', 'event calendar'],
        },
        tags: ['student', 'dashboard', 'product'],
      },
      {
        name: 'SafePath-AI.hackathon.json',
        type: 'project',
        description: 'A hackathon safety assistant concept that maps risk signals and emergency contact flows.',
        fields: {
          stack: ['React', 'Map UI', 'mock AI responses'],
          role: 'frontend lead, pitch demo',
          status: 'hackathon build',
          highlights: ['route risk cards', 'incident reporting', 'quick contact panel'],
        },
        tags: ['hackathon', 'ai', 'maps'],
      },
    ],
  },
  skills: {
    label: 'Skills',
    path: '/home/fardin/Desktop/Skills',
    summary: 'Technical stack grouped by practical use.',
    entries: [
      {
        name: 'frontend.stack.json',
        type: 'skill-group',
        description: 'Core UI engineering skills.',
        fields: {
          languages: ['TypeScript', 'JavaScript', 'HTML', 'CSS'],
          frameworks: ['React', 'Vite', 'Tailwind CSS'],
          state: ['Zustand', 'React Context', 'URL state'],
          animation: ['Framer Motion', 'Canvas API'],
        },
        tags: ['frontend'],
      },
      {
        name: 'security.lab.json',
        type: 'skill-group',
        description: 'Security learning and practical lab experience.',
        fields: {
          areas: ['web security basics', 'CTF practice', 'Linux tooling', 'recon workflows'],
          tools: ['Kali Linux', 'Burp Suite basics', 'Nmap', 'Wireshark'],
          mindset: 'defensive-first learning with controlled lab environments',
        },
        tags: ['cybersecurity'],
      },
      {
        name: 'engineering.workflow.json',
        type: 'skill-group',
        description: 'How projects are kept usable and maintainable.',
        fields: {
          practices: ['component boundaries', 'state modeling', 'responsive UI', 'build verification'],
          strengths: ['debugging', 'interactive prototypes', 'clear data structures'],
        },
        tags: ['engineering'],
      },
    ],
  },
  hackathons: {
    label: 'Hackathons',
    path: '/home/fardin/Desktop/Hackathons',
    summary: 'Event history and shipped prototypes.',
    entries: [
      {
        name: 'BRACU-Hack-Fest-2025.json',
        type: 'hackathon',
        description: 'Built SafePath AI, a risk-aware route and emergency contact prototype.',
        fields: {
          role: 'frontend lead',
          team_size: '4',
          result: 'Top 10 finalist sample entry',
          shipped: ['interactive route dashboard', 'incident form', 'pitch deck demo'],
        },
        tags: ['ai', 'safety', 'frontend'],
      },
      {
        name: 'NASA-Space-Apps-Bangladesh-2024.json',
        type: 'hackathon',
        description: 'FloodWatch concept using public climate and satellite-inspired visual data.',
        fields: {
          role: 'UI engineer',
          team_size: '5',
          result: 'regional submission sample entry',
          shipped: ['risk cards', 'map mock', 'public awareness flow'],
        },
        tags: ['climate', 'data', 'maps'],
      },
      {
        name: 'CyberSprint-CTF-2024.json',
        type: 'competition',
        description: 'Team-based capture-the-flag practice event covering web, crypto, and forensics.',
        fields: {
          role: 'web challenge solver',
          result: 'practice scoreboard sample',
          learned: ['payload hygiene', 'writeup discipline', 'basic forensics workflow'],
        },
        tags: ['ctf', 'security'],
      },
    ],
  },
  experience: {
    label: 'Experience',
    path: '/home/fardin/Desktop/Experience',
    summary: 'Experience entries are sample-ready and easy to replace with real history.',
    entries: [
      {
        name: 'freelance-frontend.json',
        type: 'experience',
        description: 'Built responsive landing pages and dashboards for small teams and student projects.',
        fields: {
          role: 'Frontend Developer',
          period: '2024 - present',
          impact: ['React UI builds', 'component cleanup', 'deployment-ready Vite projects'],
        },
        tags: ['frontend', 'client-work'],
      },
      {
        name: 'security-lab-assistant.json',
        type: 'experience',
        description: 'Maintained personal security labs and documented safe learning workflows.',
        fields: {
          role: 'Security Lab Learner',
          period: '2023 - present',
          impact: ['Linux practice', 'CTF notes', 'tool comparison writeups'],
        },
        tags: ['security', 'learning'],
      },
    ],
  },
  education: {
    label: 'Education',
    path: '/home/fardin/Desktop/Education',
    summary: 'Academic profile for a CSE-focused portfolio.',
    entries: [
      {
        name: 'cse-degree.json',
        type: 'education',
        description: 'Computer Science and Engineering academic path.',
        fields: {
          program: 'BSc in Computer Science and Engineering',
          status: 'student',
          coursework: ['data structures', 'algorithms', 'database systems', 'computer networks', 'software engineering'],
        },
        tags: ['cse', 'university'],
      },
      {
        name: 'self-learning-roadmap.json',
        type: 'education',
        description: 'Parallel skill roadmap outside class.',
        fields: {
          topics: ['React architecture', 'TypeScript', 'Linux fundamentals', 'web security', 'UI animation'],
          routine: 'build small projects, write notes, ship demos',
        },
        tags: ['roadmap'],
      },
    ],
  },
  certificates: {
    label: 'Certificates',
    path: '/home/fardin/Desktop/Certificates',
    summary: 'Certificate-style entries for the portfolio.',
    entries: [
      {
        name: 'responsive-web-design.cert',
        type: 'certificate',
        description: 'Responsive layout, accessibility basics, and CSS fundamentals.',
        fields: {
          issuer: 'Sample Learning Platform',
          year: '2024',
          skills: ['semantic HTML', 'CSS layout', 'responsive UI'],
        },
        tags: ['frontend'],
      },
      {
        name: 'linux-fundamentals.cert',
        type: 'certificate',
        description: 'Linux shell, file permissions, and basic networking tools.',
        fields: {
          issuer: 'Sample Security Lab',
          year: '2024',
          skills: ['shell navigation', 'permissions', 'network basics'],
        },
        tags: ['linux', 'security'],
      },
      {
        name: 'javascript-algorithms.cert',
        type: 'certificate',
        description: 'Problem solving and common programming patterns in JavaScript.',
        fields: {
          issuer: 'Sample Course',
          year: '2023',
          skills: ['arrays', 'strings', 'recursion', 'complexity basics'],
        },
        tags: ['javascript'],
      },
    ],
  },
  blogs: {
    label: 'Blogs',
    path: '/home/fardin/Desktop/Blogs',
    summary: 'Draft blog ideas and portfolio-friendly writing samples.',
    entries: [
      {
        name: 'building-a-browser-os.md',
        type: 'blog-draft',
        description: 'Notes on designing GhostOS as a desktop instead of a normal site.',
        fields: {
          status: 'draft',
          themes: ['state modeling', 'window manager', 'interactive portfolio UX'],
        },
        tags: ['react', 'architecture'],
      },
      {
        name: 'ctf-notes-for-beginners.md',
        type: 'blog-draft',
        description: 'A beginner-friendly guide to keeping clean CTF notes and writeups.',
        fields: {
          status: 'outline',
          themes: ['web challenges', 'payload logging', 'ethical boundaries'],
        },
        tags: ['ctf', 'security'],
      },
      {
        name: 'why-typescript-helps-ui-state.md',
        type: 'blog-draft',
        description: 'Practical examples of making UI state harder to break.',
        fields: {
          status: 'draft',
          themes: ['types', 'state machines', 'component contracts'],
        },
        tags: ['typescript', 'frontend'],
      },
    ],
  },
  contact: {
    label: 'Contact',
    path: '/home/fardin/Desktop/Contact',
    summary: 'Contact routes for portfolio visitors.',
    entries: [
      {
        name: 'contact-card.json',
        type: 'contact',
        description: 'Primary contact information.',
        fields: {
          email: 'fardin@example.com',
          github: 'github.com/fardin',
          linkedin: 'linkedin.com/in/fardin',
          availability: 'open to internships, frontend projects, and hackathon teams',
        },
        tags: ['contact'],
      },
      {
        name: 'message-template.txt',
        type: 'text/plain',
        description: 'Suggested message format for viewers.',
        fields: {
          subject: 'Portfolio opportunity',
          include: ['project context', 'timeline', 'preferred contact channel'],
        },
        tags: ['template'],
      },
    ],
  },
  resume: {
    label: 'Resume',
    path: '/home/fardin/Desktop/Resume',
    summary: 'Resume data rendered as structured portfolio files.',
    entries: [
      {
        name: 'resume-summary.json',
        type: 'resume',
        description: 'Profile summary for recruiters and collaborators.',
        fields: {
          name: 'Fardin',
          headline: 'CSE student building React systems, security tools, and interactive portfolios',
          location: 'Bangladesh',
          interests: ['frontend engineering', 'cybersecurity', 'developer tools', 'hackathons'],
        },
        tags: ['resume', 'profile'],
      },
      {
        name: 'resume-project-highlights.json',
        type: 'resume',
        description: 'Selected projects suitable for resume bullets.',
        fields: {
          ghostos: 'built a browser OS portfolio with boot, login, desktop windows, terminal, games, and assistant',
          ctf_engine: 'designed an offline-first CTF writeup organizer with searchable challenge notes',
          campusconnect: 'created a student dashboard concept for events, notices, and course materials',
        },
        tags: ['resume', 'projects'],
      },
      {
        name: 'resume-skills.json',
        type: 'resume',
        description: 'Compact skill list.',
        fields: {
          frontend: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
          tools: ['Git', 'Vite', 'Linux', 'xterm.js'],
          security: ['web security basics', 'CTF practice', 'networking fundamentals'],
        },
        tags: ['resume', 'skills'],
      },
      {
        name: 'resume-education.json',
        type: 'resume',
        description: 'Education section.',
        fields: {
          degree: 'BSc in Computer Science and Engineering',
          status: 'student',
          coursework: ['data structures', 'database systems', 'networks', 'software engineering'],
        },
        tags: ['resume', 'education'],
      },
    ],
  },
  fileExplorer: {
    label: 'Files',
    path: '/home/fardin/Desktop',
    summary: 'System files and documents.',
    entries: [],
  },
  gallery: {
    label: 'Gallery',
    path: '/home/fardin/Pictures',
    summary: 'Photos and screenshots.',
    entries: [],
  },
  trash: {
    label: 'Trash',
    path: '/home/fardin/.Trash',
    summary: 'Deleted files.',
    entries: [],
  },
};
