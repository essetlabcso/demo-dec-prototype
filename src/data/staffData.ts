import { ContentBlock } from './courseData';

export type ModuleStatus = 'draft' | 'review' | 'preview' | 'published' | 'retired';

export interface CompletionRules {
  requireAllLessons: boolean;
  requiredLessonIds: string[];
  requireFinalAssessment: boolean;
  minimumPassingScore: number;
  requireFeedback: boolean;
  requireAllMandatoryBlocks: boolean;
}

export interface CMSLesson {
  id: string;
  title: string;
  order: number;
  status: 'draft' | 'published' | 'review';
  purpose: string;
  blocks: ContentBlock[];
}

export interface CMSAsset {
  id: string;
  title: string;
  type: 'image' | 'video' | 'document' | 'audio';
  url: string;
  filesize?: string;
  dimensions?: string;
  duration?: string;
  uploadedAt: string;
  transcript?: string;
  caption?: string;
  tags: string[];
  linkedLessonIds: string[];
  isDownloadable: boolean;
}

export type QuestionType = 'single-select' | 'multi-select' | 'short-text';

export interface CMSQuestion {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[];
  correctAnswer?: number | number[];
  hint?: string;
  points: number;
}

export interface CMSAssessment {
  id: string;
  type: 'pre-test' | 'quiz' | 'post-test';
  title: string;
  passScore: number;
  questions: CMSQuestion[];
}

export type FeedbackItemType = 'likert' | 'multiple-choice' | 'open';

export interface CMSFeedbackItem {
  id: string;
  type: FeedbackItemType;
  text: string;
  options?: string[]; // For multiple choice
  required: boolean;
}

export interface CMSFeedbackInstrument {
  id: string;
  title: string;
  items: CMSFeedbackItem[];
}

export interface CMSReviewComment {
  id: string;
  author: string;
  text: string;
  timestamp: string;
  lessonId?: string;
  blockId?: string;
  resolved: boolean;
}

export interface CMSQAResult {
  id: string;
  title: string;
  category: 'metadata' | 'content' | 'assessment' | 'feedback' | 'accessibility';
  status: 'pass' | 'fail' | 'warning';
  message: string;
}

export interface CMSAnalytics {
  enrollments: number;
  completions: number;
  avgScore: number;
  rating: number;
  trendingData: number[];
}

export interface CMSLearnerFeedback {
  id: string;
  user: string;
  rating: number;
  comment: string;
  timestamp: string;
  status: 'new' | 'reviewed' | 'addressed';
}

export interface CMSModule {
  id: string;
  title: string;
  summary: string;
  courseCode: string;
  objectives: string[];
  tags: string[];
  audience: string;
  language: string;
  estimatedDuration: string;
  hasPreTest: boolean;
  hasPostTest: boolean;
  hasCertificate: boolean;
  hasFeedback: boolean;
  status: ModuleStatus;
  lastUpdated: string;
  owner: string;
  lessons: CMSLesson[];
  completionRules: CompletionRules;
  assets: CMSAsset[];
  assessments: CMSAssessment[];
  feedback: CMSFeedbackInstrument | null;
  reviewComments: CMSReviewComment[];
  qaResults: CMSQAResult[];
  analytics?: CMSAnalytics;
  learnerFeedback?: CMSLearnerFeedback[];
}

export const initialModules: CMSModule[] = [
  {
    id: 'm1',
    title: 'Introduction to HRBA',
    summary: 'Foundational concepts of Human Rights-Based Approach.',
    courseCode: 'HRBA-101',
    objectives: ['Understand HRBA principles', 'Identify duty bearers'],
    tags: ['Human Rights', 'Foundations'],
    audience: 'All Staff',
    language: 'English',
    estimatedDuration: '45 mins',
    hasPreTest: true,
    hasPostTest: true,
    hasCertificate: true,
    hasFeedback: true,
    status: 'published',
    lastUpdated: '2026-03-20T10:00:00Z',
    owner: 'Admin User',
    lessons: [
      { 
        id: 'l1', 
        title: 'What are Human Rights?', 
        order: 1, 
        status: 'published',
        purpose: 'Define basic human rights concepts.',
        blocks: [
          { type: 'text', heading: 'Introduction', content: 'Human rights are the basic rights and freedoms that belong to every person in the world.' }
        ]
      },
      { 
        id: 'l2', 
        title: 'The 5 HRBA Principles', 
        order: 2, 
        status: 'published',
        purpose: 'Explain the core principles of HRBA.',
        blocks: [
          { type: 'statement', content: 'Participation, Accountability, Non-discrimination, Empowerment, and Legality.' }
        ]
      }
    ],
    completionRules: {
      requireAllLessons: true,
      requiredLessonIds: [],
      requireFinalAssessment: true,
      minimumPassingScore: 80,
      requireFeedback: true,
      requireAllMandatoryBlocks: true
    },
    assets: [
      {
        id: 'a1',
        title: 'HRBA Overview Graphic',
        type: 'image',
        url: 'https://picsum.photos/seed/dec-asset-1/800/600',
        filesize: '1.2 MB',
        dimensions: '1920x1080',
        uploadedAt: '2026-03-20T09:00:00Z',
        tags: ['Graphic', 'Overview'],
        linkedLessonIds: ['l1'],
        isDownloadable: true
      }
    ],
    assessments: [
      {
        id: 'as1',
        type: 'post-test',
        title: 'Final Knowledge Check',
        passScore: 80,
        questions: [
          {
            id: 'q1',
            type: 'single-select',
            question: 'What is the primary focus of HRBA?',
            options: ['Charity', 'Needs', 'Rights', 'Welfare'],
            correctAnswer: 2,
            points: 10
          }
        ]
      }
    ],
    feedback: null,
    reviewComments: [],
    qaResults: [],
    analytics: {
      enrollments: 450,
      completions: 380,
      avgScore: 88,
      rating: 4.8,
      trendingData: [45, 52, 48, 61, 55, 68, 72]
    },
    learnerFeedback: [
      { id: 'f1', user: 'Dawit T.', rating: 5, comment: 'Excellent overview of HRBA principles.', timestamp: '2026-03-25T10:00:00Z', status: 'reviewed' },
      { id: 'f2', user: 'Makeda G.', rating: 4, comment: 'Very clear, but could use more case studies.', timestamp: '2026-03-24T14:30:00Z', status: 'new' }
    ]
  },
  {
    id: 'm2',
    title: 'HRBA in Practice: Participation',
    summary: 'A deep dive into the participation pillar of HRBA within local CSO operations.',
    courseCode: 'CSO-HRBA-002',
    objectives: [
      'Define meaningful participation in a CSO context',
      'Identify barriers to inclusive participation',
      'Apply participatory tools in project design'
    ],
    tags: ['HRBA', 'Participation', 'CSO'],
    audience: 'Program Officers',
    language: 'English',
    estimatedDuration: '45 mins',
    hasPreTest: false,
    hasPostTest: true,
    hasCertificate: true,
    hasFeedback: true,
    status: 'review',
    lastUpdated: '2026-03-26T15:45:00Z',
    owner: 'Admin User',
    lessons: [
      { 
        id: 'l3', 
        title: 'Case Study: Participation', 
        order: 1, 
        status: 'review',
        purpose: 'Analyze a real-world example of participation.',
        blocks: [
          { type: 'image', src: 'https://images.unsplash.com/photo-1542601906960-daaeac71e9c9?q=80&w=2000&auto=format&fit=crop', alt: 'Community Meeting', caption: 'HRBA is built on inclusive participation.' },
          { type: 'text', heading: 'Why Participation Matters', content: 'Participation is not just about attending a meeting. It is about having the power to influence decisions that affect your life. In an Ethiopian CSO context, this means ensuring that marginalized groups—including women, youth, and persons with disabilities—are part of the conversation from day one.' },
          { type: 'video', title: 'Community Engagement Intro', url: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4', transcript: 'This video explains the fundamentals of community engagement in a rights-based framework...' },
          { type: 'accordion', title: 'Deep Dive: Inclusive Methods', items: [
            { title: 'Focus Groups', content: 'Small, targeted discussions that allow for deeper exploration of specific barriers.' },
            { title: 'Community Mapping', content: 'A visual way for community members to identify resources, risks, and excluded zones.' },
            { title: 'Public Scorecards', content: 'A tool for citizens to evaluate service quality and hold providers accountable.' }
          ]},
          { type: 'knowledge-check', question: 'What is the primary goal of "Meaningful Participation"?', options: ['Increasing meeting attendance', 'Ensuring rights-holders influence decisions', 'Hiring more consultants', 'Following donor rules'], correctAnswer: 1, hint: 'Review the distinction between tokenism and influence.' }
        ]
      }
    ],
    completionRules: {
      requireAllLessons: false,
      requiredLessonIds: ['l3'],
      requireFinalAssessment: true,
      minimumPassingScore: 70,
      requireFeedback: false,
      requireAllMandatoryBlocks: false
    },
    assets: [
      {
        id: 'a2',
        title: 'Case Study: Community Participation',
        type: 'video',
        url: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
        filesize: '14.5 MB',
        uploadedAt: '2026-03-25T14:00:00Z',
        tags: ['Video', 'Case Study'],
        linkedLessonIds: ['l3'],
        isDownloadable: false
      }
    ],
    assessments: [
      {
        id: 'as2',
        type: 'post-test',
        title: 'Mid-Module Check',
        passScore: 70,
        questions: [
          {
            id: 'q2',
            type: 'single-select',
            question: 'Which of the following is NOT a core HRBA principle?',
            options: ['Participation', 'Profitability', 'Accountability', 'Empowerment'],
            correctAnswer: 1,
            points: 10
          }
        ]
      }
    ],
    feedback: {
      id: 'f2',
      title: 'Workshop Feedback',
      items: [
        { id: 'fi2', type: 'multiple-choice', text: 'How would you rate the clarity of the case studies?', options: ['Excellent', 'Good', 'Fair', 'Poor'], required: true }
      ]
    },
    reviewComments: [
      { id: 'c1', author: 'Sarah Reviewer', text: 'The video transcript is a bit brief. Can we add more detail about the Ethiopian context?', timestamp: '2026-03-26T16:00:00Z', lessonId: 'l3', resolved: false },
      { id: 'c2', author: 'Sarah Reviewer', text: 'Consider adding a second case study specifically on youth engagement.', timestamp: '2026-03-26T16:05:00Z', resolved: false }
    ],
    qaResults: [
      { id: 'qa1', title: 'Metadata Coverage', category: 'metadata', status: 'pass', message: 'All mandatory fields are populated.' },
      { id: 'qa2', title: 'Assessment Configuration', category: 'assessment', status: 'pass', message: 'Post-test is correctly linked and has a passing score set.' },
      { id: 'qa3', title: 'Alt-Text Presence', category: 'accessibility', status: 'warning', message: 'One image block is missing descriptive alt-text.' }
    ],
    analytics: {
      enrollments: 120,
      completions: 85,
      avgScore: 72,
      rating: 4.2,
      trendingData: [12, 15, 18, 14, 22, 19, 25]
    },
    learnerFeedback: [
      { id: 'f3', user: 'Abeba K.', rating: 4, comment: 'The participation tools are very practical.', timestamp: '2026-03-26T11:00:00Z', status: 'new' }
    ]
  }
];

export interface StaffUser {
  id: string;
  name: string;
  email: string;
  role: 'content_admin' | 'reviewer' | 'admin' | 'super_admin';
  status: 'active' | 'inactive';
  lastLogin: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  target: string;
  timestamp: string;
  severity: 'info' | 'warning' | 'critical';
}

export const staffUsers: StaffUser[] = [
  {
    id: 'u1',
    name: 'Admin User',
    email: 'staff@dec.local',
    role: 'content_admin',
    status: 'active',
    lastLogin: '2026-03-26T10:00:00Z'
  },
  {
    id: 'u2',
    name: 'Sarah Reviewer',
    email: 'reviewer@dec.local',
    role: 'reviewer',
    status: 'active',
    lastLogin: '2026-03-25T14:30:00Z'
  }
];

export const auditLogs: AuditLog[] = [
  {
    id: 'log1',
    userId: 'u1',
    userName: 'Admin User',
    action: 'Created Module',
    target: 'Introduction to HRBA',
    timestamp: '2026-03-26T11:20:00Z',
    severity: 'info'
  },
  {
    id: 'log2',
    userId: 'u1',
    userName: 'Admin User',
    action: 'Published Lesson',
    target: 'Working Principles',
    timestamp: '2026-03-26T15:45:00Z',
    severity: 'info'
  },
  {
    id: 'log3',
    userId: 'u2',
    userName: 'Sarah Reviewer',
    action: 'Flagged Issue',
    target: 'Module 3 Assessment',
    timestamp: '2026-03-27T09:10:00Z',
    severity: 'warning'
  }
];
