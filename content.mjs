import {projectCopy} from './project-copy.mjs';
import {portfolioProjects} from './portfolio-projects.mjs';
// Replace image: null with '/images/your-file.jpg'. Put files in public/images.
// Draft descriptions describe scope only; replace with your process and evidence.
export const profile = { name: 'Thant', location: 'Singapore', title: 'Architecture & interactive design', email: 'waithantthiri101@gmail.com', resume: '/resume.docx', interlude: ['I’m drawn to the space between what is', 'and what could be.'], intro: 'I study architecture and work across spatial design, digital products and interactive experiences. I’m interested in how people move, connect and find a sense of place in physical and virtual environments.' };
const originalProjects=[
  {
    "slug": "linked-hybrid",
    "title": "Linked Hybrid",
    "category": "Architecture",
    "disciplines": "Architecture / Computational design",
    "number": "01",
    "note": "Spatial systems",
    "image": "/images/linked-hybrid.jpg",
    "accent": "blue",
    "summary": "A study of connected buildings, shared living spaces and how people move between them.",
    "role": "Architecture student",
    "sections": [
      [
        "The architectural question",
        "I explored how separate buildings can connect as one place, using architectural design and digital models."
      ],
      [
        "Form, connection, movement",
        "Drawings and models will show how the design developed."
      ],
      [
        "Drawings & models",
        "Plans, sections and models will show the final design."
      ]
    ]
  },
  {
    "slug": "virtual-singapore",
    "title": "Somewhere",
    "category": "Interactive",
    "disciplines": "Product design / UX/UI / 3D",
    "number": "02",
    "note": "Virtual worlds, real connections",
    "image": null,
    "accent": "green",
    "summary": "A dating and social app where people explore a 3D Singapore and meet through games and shared activities.",
    "role": "Product & 3D designer",
    "sections": [
      [
        "Meeting through a shared activity",
        "The app gives people a 3D Singapore to explore together, with games and shared activities as ways to meet."
      ],
      [
        "Connecting the app and the 3D world",
        "I worked on the concept and app flow, including how the screens connect to the 3D world."
      ],
      [
        "Designing the places and characters",
        "My work also included the 3D environments and characters, with clothing and hairstyle options that people could customise."
      ]
    ]
  },
  {
    "slug": "easyconvo",
    "title": "EasyConvo",
    "category": "Product",
    "disciplines": "Product design / UX/UI / Learning",
    "number": "03",
    "note": "Small steps into language",
    "image": null,
    "accent": "orange",
    "summary": "A phonics app that helps young children learn to read, with tools for students and teachers.",
    "role": "Product designer",
    "sections": [
      [
        "Designing for students and teachers",
        "I worked on both sides of the app: the activities children use to learn phonics and the tools teachers use to support them."
      ],
      [
        "Learning from user testing",
        "I tested the app with users and used their feedback to adjust the learning activities and teacher dashboards."
      ],
      [
        "Working through the app flow",
        "I developed the app flows and built Figma prototypes, keeping young learners in mind as I worked through the screens."
      ]
    ]
  },
  {
    "slug": "personal-explorations",
    "title": "An open-ended study",
    "category": "Personal",
    "disciplines": "Personal project / Experiments",
    "number": "04",
    "note": "A space for curiosity",
    "image": null,
    "accent": "blue",
    "summary": "A space for personal projects and experiments.",
    "role": "Independent exploration",
    "sections": [
      [
        "A question of my own",
        "Personal-project placeholder. Replace this with the idea that started the work."
      ],
      [
        "Experiments & observations",
        "Add process images, sketches and observations."
      ],
      [
        "Where it led",
        "Describe what you learned and what you want to explore next."
      ]
    ]
  },
  {
    "slug": "architecture-archive",
    "title": "Spatial fragments",
    "category": "Architecture",
    "disciplines": "Architecture / Models / Drawing",
    "number": "05",
    "note": "Selected architectural work",
    "image": null,
    "accent": "neutral",
    "summary": "Drawings, models and experiments from my architecture studies.",
    "role": "Architecture student",
    "sections": [
      [
        "Thinking through making",
        "Architecture work, from early sketches to finished models and drawings."
      ],
      [
        "Selected studies",
        "Add each study’s title, course context and your individual contribution."
      ],
      [
        "An evolving archive",
        "This collection can grow as new work develops."
      ]
    ]
  }
];

// Keep earlier placeholder routes available without repeating them in the project gallery.
export const draftProjects=originalProjects.filter(project=>!['virtual-singapore','easyconvo'].includes(project.slug));
// Month-level dates from the supplied portfolio/resume; Previously confirmed by the user.
const projectDates={
 'easyconvo':'2026-09','virtual-singapore':'2026-08','stacked-streets':'2026-03',
 'previously':'2025-09','ribbon':'2025-06','a-bridge':'2025-05',
 'the-wandering-archive':'2025-02','flow':'2025-01','spatial':'2024-11',
 'ascent':'2025-03','venture':'2025-02','pause':'2025-09'
};
const orderedProjects=[...portfolioProjects,...originalProjects.filter(project=>['virtual-singapore','easyconvo'].includes(project.slug))]
 .map(project=>({...project,...(projectCopy[project.slug]?{summary:projectCopy[project.slug].summary,...(projectCopy[project.slug].presentationImage?{image:projectCopy[project.slug].presentationImage,presentationImage:projectCopy[project.slug].presentationImage}:{})}:{}),date:projectDates[project.slug]??project.date??null,...(project.slug==='previously'?{role:'Architectural internship',note:'Internship work, September 2025'}:{})}))
 .sort((a,b)=>(b.date||'').localeCompare(a.date||''));
// Curated exception to chronology: keep The Wandering Archive directly after Pause.
const archiveIndex=orderedProjects.findIndex(project=>project.slug==='the-wandering-archive');
if(archiveIndex!==-1&&orderedProjects.some(project=>project.slug==='pause')){
 const [archive]=orderedProjects.splice(archiveIndex,1);
 orderedProjects.splice(orderedProjects.findIndex(project=>project.slug==='pause')+1,0,archive);
}
export const projects=orderedProjects.map((project,index)=>({...project,number:String(index+1).padStart(2,'0')}));
