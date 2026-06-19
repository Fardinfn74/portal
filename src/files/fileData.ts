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

export const fileSystem: Record<
  Exclude<
    AppId,
    | 'terminal'
    | 'games'
    | 'browser'
    | 'imageViewer'
  >,
  FileBundle
> = {
  about: {
    label: 'About Me',
    path: '/home/fardin/Desktop/About Me',
    summary:
      'CSE student focused on frontend engineering, cybersecurity labs, CTF practice, and building sharp browser experiences.',
    entries: [
      {
        name: 'about.txt',
        type: 'text/plain',
        description: 'Short personal profile used by pacOS.',
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
        name: 'pacOS.portfolio.json',
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
  experience: {
    label: 'Experience',
    path: '/home/fardin/Desktop/Experience',
    summary: 'Summary of professional experience and focus areas.',
    entries: [
      {
        name: 'current-focus.json',
        type: 'experience',
        description: 'Current activities and areas of experience.',
        fields: {
          status: 'Currently building personal projects, contributing to open-source software, and continuously learning modern technologies.',
          areas: [
            'Full Stack Development',
            'AI Integrations',
            'Web Development',
            'Open Source Contributions',
            'Rapid Product Prototyping',
            'Team Collaboration',
            'Technical Presentations'
          ],
        },
        tags: ['experience', 'focus'],
      },
    ],
  },
  education: {
    label: 'Education',
    path: '/home/fardin/Desktop/Education',
    summary: 'Academic background and focused areas of study.',
    entries: [
      {
        name: 'degree.json',
        type: 'education',
        description: 'Bachelor\'s Degree information.',
        fields: {
          degree: 'Bachelor\'s Degree',
          major: 'Information Technology (IT)',
          focused_areas: [
            'Software Engineering',
            'Web Development',
            'AI & Machine Learning',
            'Database Systems',
            'Cloud Computing',
            'Problem Solving'
          ],
        },
        tags: ['education', 'degree'],
      },
    ],
  },
  certificates: {
    label: 'Certificates',
    path: '/home/fardin/Desktop/Certificates',
    summary: 'Professional certifications and achievements.',
    entries: [
      {
        name: 'certificate_01',
        type: 'image/jpeg',
        description: 'Professional Certification 01',
        fields: { url: '/certificates/certificate_01.jpeg' },
      },
      {
        name: 'certificate_02',
        type: 'image/png',
        description: 'Professional Certification 02',
        fields: { url: '/certificates/certificate_02.png' },
      },
      {
        name: 'certificate_03',
        type: 'image/png',
        description: 'Professional Certification 03',
        fields: { url: '/certificates/certificate_03.png' },
      },
      {
        name: 'certificate_04',
        type: 'image/png',
        description: 'Professional Certification 04',
        fields: { url: '/certificates/certificate_04.png' },
      },
      {
        name: 'certificate_05',
        type: 'image/png',
        description: 'Professional Certification 05',
        fields: { url: '/certificates/certificate_05.png' },
      },
      {
        name: 'certificate_06',
        type: 'image/png',
        description: 'Professional Certification 06',
        fields: { url: '/certificates/certificate_06.png' },
      },
      {
        name: 'certificate_07',
        type: 'image/png',
        description: 'Professional Certification 07',
        fields: { url: '/certificates/certificate_07.png' },
      },
      {
        name: 'certificate_08',
        type: 'image/png',
        description: 'Professional Certification 08',
        fields: { url: '/certificates/certificate_08.png' },
      },
    ],
  },
  contact: {
    label: 'Contact',
    path: '/home/fardin/Desktop/Contact',
    summary: 'Connect with me through various platforms.',
    entries: [
      {
        name: 'connect.json',
        type: 'contact',
        description: 'Ways to reach out.',
        fields: {
          message: 'Let\'s build something amazing together!',
          email: 'fardin29bd@gmail.com',
          github: 'https://github.com/Fardinfn74',
          linkedin: 'www.linkedin.com/in/fardin-fn-684556211',
          instagram: 'https://www.instagram.com/its_fardinn_?igsh=NDYzaXN3M3VteGJ4',
          discord: 'https://discord.gg/GF9W7TFt',
          footer: 'Whether you have a project idea, collaboration opportunity, internship, hackathon invitation, or just want to connect, feel free to reach out. I\'ll get back to you as soon as possible.'
        },
        tags: ['contact', 'social'],
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
          pacOS: 'built a browser OS portfolio with boot, login, desktop windows, terminal, games, and assistant',
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
  trash: {
    label: 'Trash',
    path: '/home/fardin/.Trash',
    summary: 'Deleted files.',
    entries: [],
  },
};
