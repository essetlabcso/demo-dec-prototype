export interface CatalogCourse {
  id: string;
  status: 'Available' | 'Coming Soon';
  access: 'Public' | 'Members only';
  title: string;
  description: string;
  category: string;
  audience: string;
  level: string;
  duration: string;
  lessons: string;
  certificate: boolean;
  cta: string;
  thumbnail: string;
  featured?: boolean;
}

export const catalogCourses: CatalogCourse[] = [
  {
    id: 'hrba-practice',
    status: 'Available',
    access: 'Public',
    title: 'HRBA in Practice for Local & Grassroots CSOs',
    description: 'A practical guide for Ethiopian CSOs to apply HRBA principles in design, delivery, MEAL, and accountability.',
    category: 'Governance and Rights',
    audience: 'CSO staff',
    level: 'Applied',
    duration: '5 hours',
    lessons: '4 lessons',
    certificate: true,
    cta: 'Learn More',
    thumbnail: '/images/courses/1.thumbnail_HRBA.png',
    featured: true
  },
  {
    id: 'financial-management',
    status: 'Available',
    access: 'Members only',
    title: 'Financial Management for Local and Grassroots CSOs',
    description: 'Build practical systems for budgeting, internal controls, expenditure tracking, and donor-ready financial reporting.',
    category: 'Capacity Building',
    audience: 'CSO staff',
    level: 'Applied',
    duration: '3 hours',
    lessons: '3 lessons',
    certificate: true,
    cta: 'Learn More',
    thumbnail: '/images/courses/2. financial.png'
  },
  {
    id: 'meal-locally-led',
    status: 'Available',
    access: 'Public',
    title: 'Locally Led Monitoring, Evaluation, Accountability, and Learning (MEAL)',
    description: 'Strengthen evidence-based planning, data use, accountability commitments, and learning loops across programs.',
    category: 'Capacity Building',
    audience: 'CSO staff',
    level: 'Applied',
    duration: '3 hours',
    lessons: '3 lessons',
    certificate: true,
    cta: 'Learn More',
    thumbnail: '/images/courses/3.meal.png'
  },
  {
    id: 'safeguarding',
    status: 'Available',
    access: 'Public',
    title: 'Safeguarding for Local and Grassroots CSOs',
    description: 'Apply safeguarding principles, risk identification, reporting pathways, and survivor-centered response standards.',
    category: 'Capacity Building',
    audience: 'CSO staff',
    level: 'Applied',
    duration: '3 hours',
    lessons: '3 lessons',
    certificate: true,
    cta: 'Learn More',
    thumbnail: '/images/courses/4.safeguarding_thumbnail.png'
  },
  {
    id: 'governance',
    status: 'Available',
    access: 'Members only',
    title: 'Governance for Local and Grassroots CSOs',
    description: 'Strengthen boards, decision rights, accountability structures, and governance practices for sustainable institutions.',
    category: 'Capacity Building',
    audience: 'CSO staff',
    level: 'Applied',
    duration: '2.5 hours',
    lessons: '3 lessons',
    certificate: true,
    cta: 'Learn More',
    thumbnail: '/images/courses/5.governance_thumbnail.png'
  },
  {
    id: 'proposal-development',
    status: 'Available',
    access: 'Public',
    title: 'Proposal Development and Project Co-Creation',
    description: 'Design stronger proposals and co-create context-fit projects with communities, partners, and funding priorities in view.',
    category: 'Capacity Building',
    audience: 'CSO staff',
    level: 'Applied',
    duration: '4 hours',
    lessons: '3 lessons',
    certificate: true,
    cta: 'Learn More',
    thumbnail: '/images/courses/6.proposal_thumbnail.png'
  },
  {
    id: 'resource-mobilization',
    status: 'Available',
    access: 'Public',
    title: 'Resource Mobilization and Sustainability for Local and Grassroots CSOs',
    description: 'Develop practical strategies for diversified funding, stakeholder confidence, and long-term organizational resilience.',
    category: 'Capacity Building',
    audience: 'CSO staff',
    level: 'Applied',
    duration: '4.5 hours',
    lessons: '3 lessons',
    certificate: true,
    cta: 'Learn More',
    thumbnail: '/images/courses/7.Resource Mobilization.png'
  },
  {
    id: 'project-management',
    status: 'Available',
    access: 'Public',
    title: 'Project Management for Local and Grassroots CSOs',
    description: 'Build practical skills to plan, coordinate, implement, and track projects effectively in real CSO contexts.',
    category: 'Capacity Building',
    audience: 'CSO staff',
    level: 'Applied',
    duration: '3.5 hours',
    lessons: '3 lessons',
    certificate: true,
    cta: 'Learn More',
    thumbnail: '/images/courses/8.Project Management.png'
  },
  {
    id: 'alternative-funding',
    status: 'Available',
    access: 'Public',
    title: 'Alternative Funding Models for Local and Grassroots CSOs',
    description: 'Explore practical options for social enterprise, local giving, earned income, partnerships, and financial resilience.',
    category: 'Sustainability and Innovation',
    audience: 'CSO staff',
    level: 'Applied',
    duration: '4 hours',
    lessons: '4 lessons',
    certificate: true,
    cta: 'Learn More',
    thumbnail: '/images/courses/9.Alternative Funding.png'
  },
  {
    id: 'advocacy-policy',
    status: 'Available',
    access: 'Public',
    title: 'Advocacy and Policy Engagement for Local and Grassroots CSOs',
    description: 'Strengthen practical advocacy skills for influencing policy, engaging decision-makers, and advancing community priorities ethically and effectively.',
    category: 'Governance and Rights',
    audience: 'CSO staff',
    level: 'Applied',
    duration: '3.5 hours',
    lessons: '3 lessons',
    certificate: true,
    cta: 'Learn More',
    thumbnail: '/images/courses/10.Advocacy and .png'
  }
];
