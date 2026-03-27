export interface CourseData {
  id: string;
  title: string;
  subtitle: string;
  shortDescription: string;
  description: string;
  duration: string;
  level: string;
  audience: string;
  language: string;
  includes: string[];
  tags: string[];
  lessons: Lesson[];
  finalTest: Question[];
  feedbackQuestions: FeedbackQuestion[];
  glossary: GlossaryTerm[];
  resources: Resource[];
  certificateText: {
    title: string;
    body: string;
    footer: string;
  };
}

export interface Lesson {
  id: string;
  title: string;
  purpose: string;
  objectives: string[];
  blocks: ContentBlock[];
}

export type ContentBlock =
  | { type: 'text'; heading?: string; content: string }
  | { type: 'statement'; content: string }
  | { type: 'quote'; content: string; attribution?: string }
  | { type: 'list'; title?: string; items: string[] }
  | { type: 'two-column'; leftHeading: string; leftItems: string[]; rightHeading: string; rightItems: string[] }
  | { type: 'table'; title?: string; headers: string[]; rows: string[][] }
  | { type: 'accordion'; title?: string; items: { title: string; content: string }[] }
  | { type: 'tabs'; title?: string; items: { title: string; content: string }[] }
  | { type: 'process'; title?: string; steps: { title: string; content: string }[] }
  | { type: 'flashcards'; items: { front: string; back: string }[] }
  | { type: 'sorting'; title: string; categories: string[]; cards: { text: string; category: string }[] }
  | { type: 'timeline'; title: string; items: string[] }
  | { type: 'chart'; title: string; chartType: 'bar' | 'ladder'; items: string[]; note?: string }
  | { type: 'knowledge-check'; question: string; options: string[]; correctAnswer: number; hint: string }
  | { type: 'reflection'; heading: string; content: string }
  | { type: 'image'; src: string; alt: string; caption?: string }
  | { type: 'video'; title?: string; url: string; transcript?: string }
  | { type: 'divider' }
  | { type: 'resource-callout'; title: string; description: string; link: string };

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface FeedbackQuestion {
  id: string;
  text: string;
  type: 'likert' | 'multiple-choice' | 'open';
  options?: string[];
}

export interface GlossaryTerm {
  term: string;
  definition: string;
}

export interface Resource {
  id: string;
  title: string;
  type: string;
  required: boolean;
}

export const courseData: CourseData = {
  id: 'DEC-HRBA-101',
  title: 'HRBA in Practice: Applying a Human Rights-Based Approach in Ethiopian CSO Programming',
  subtitle: 'Applying a Human Rights-Based Approach in Ethiopian CSO Programming',
  shortDescription: 'A practical, context-sensitive course designed for Ethiopian CSOs to strengthen their ability to apply HRBA in projects, programs, and MEAL systems.',
  description: 'This course helps Ethiopian CSOs apply HRBA in real programming contexts. Learners explore rights-holders and duty-bearers, the 5 HRBA working principles, inclusive participation, non-discrimination, accountability, transparency, and practical use of HRBA across the project cycle.',
  duration: '2 hours 15 minutes',
  level: 'Beginner–Intermediate',
  audience: 'Ethiopian CSO Staff, Project Managers, and MEAL Officers',
  language: 'English',
  includes: [
    '4 Interactive Modules',
    '7 Interactive Learning Blocks',
    'Ethiopia-Specific Case Study',
    'Final Assessment',
    'Certificate of Completion',
    'Downloadable Resource Library'
  ],
  tags: ['HRBA', 'CSO', 'Ethiopia', 'Programming', 'MEAL'],
  lessons: [
    {
      id: 'lesson-1',
      title: 'From Needs to Rights: What HRBA Means for Ethiopian CSOs',
      purpose: 'Introduce HRBA in practical terms and help learners shift from seeing people as passive beneficiaries to seeing them as rights-holders and active participants.',
      objectives: [
        'Define HRBA in plain language.',
        'Explain the difference between a needs-based approach and a rights-based approach.',
        'Identify rights-holders, duty-bearers, and other actors.',
        'Describe why HRBA matters in Ethiopia today.'
      ],
      blocks: [
        {
          type: 'image',
          src: '/images/hero/hero_about2.png',
          alt: 'Ethiopian CSO staff working with community members',
          caption: 'HRBA is about changing relationships between rights-holders and duty-bearers.'
        },
        {
          type: 'text',
          heading: 'Why this lesson matters',
          content: 'Many CSOs in Ethiopia already work to solve urgent community problems: school dropout, GBV, exclusion of persons with disabilities, weak service delivery, displacement, and limited voice in local decision-making. HRBA helps us go further. It asks not only, "What do people need?" but also, "What rights are not being realized, who is being left behind, and who has the obligation to act?" This changes how we analyse problems, engage communities, design activities, and measure success. HRBA makes programming more relevant, more inclusive, and more sustainable.'
        },
        {
          type: 'statement',
          content: 'HRBA is not an extra layer of work. It is a better way of doing the work.'
        },
        {
          type: 'quote',
          content: 'Rights-holders are not just passive beneficiaries.',
          attribution: 'Adapted from the HRBA toolbox language on participation and rights-holders.'
        },
        {
          type: 'two-column',
          leftHeading: 'Needs-based programming often asks',
          leftItems: [
            'What is missing?',
            'What service should we deliver?',
            'How many people can we reach?',
            'What activity can we implement quickly?'
          ],
          rightHeading: 'HRBA programming also asks',
          rightItems: [
            'Which rights are affected?',
            'Who is most excluded and why?',
            'Who are the duty-bearers?',
            'What capacities must be strengthened?',
            'How will participation, accountability, and transparency be built in?'
          ]
        },
        {
          type: 'table',
          title: 'Key roles in HRBA',
          headers: ['Role', 'Who they are', 'What matters in programming'],
          rows: [
            ['Rights-holders', 'Individuals and groups whose rights are affected', 'They must participate, understand rights, and be able to claim them'],
            ['Duty-bearers', 'Primarily state institutions with obligations', 'They must respect, protect, and fulfil rights'],
            ['Other actors', 'CSOs, media, private sector, faith actors, academia, community leaders', 'They may support, influence, or obstruct change']
          ]
        },
        {
          type: 'accordion',
          title: 'HRBA in the Ethiopian CSO context',
          items: [
            {
              title: 'Why this matters now',
              content: 'Ethiopian CSOs often work in contexts shaped by conflict, displacement, unequal access to services, gender inequality, disability exclusion, and shrinking trust between citizens and institutions. A rights-based lens helps CSOs respond to these issues without reducing people to "beneficiaries only."'
            },
            {
              title: 'Why civil society matters',
              content: 'Ethiopia’s CSO proclamation explicitly links civil society to participation, transparency, and accountability in public affairs. That makes HRBA especially relevant for local CSOs.'
            },
            {
              title: 'Why HRBA strengthens project quality',
              content: 'Projects are stronger when they are built on analysis of exclusion, participation of affected people, and realistic engagement with institutions that hold responsibility.'
            }
          ]
        },
        {
          type: 'tabs',
          title: 'Roles and Responsibilities',
          items: [
            {
              title: 'Rights-holder',
              content: 'A person or group whose rights are affected. In HRBA, they are active participants, not passive recipients.'
            },
            {
              title: 'Duty-bearer',
              content: 'Usually a state institution with legal and policy obligations to respect, protect, and fulfil rights.'
            },
            {
              title: 'CSO role',
              content: 'A CSO may organize participation, strengthen awareness, facilitate dialogue, gather evidence, support accountability, and advocate for better implementation.'
            },
            {
              title: 'Common mistake',
              content: 'Treating the CSO as the only actor responsible for solving the problem, while ignoring the obligations of institutions.'
            }
          ]
        },
        {
          type: 'flashcards',
          items: [
            { front: 'Rights-holder', back: 'A person or group entitled to rights and able to claim them.' },
            { front: 'Duty-bearer', back: 'An institution, mainly the state, with obligations to respect, protect, and fulfil rights.' },
            { front: 'HRBA', back: 'A way of programming that puts rights, participation, equality, accountability, and transparency at the center.' },
            { front: '“Leave no one behind”', back: 'Focus first on people and groups who are most excluded or furthest behind.' }
          ]
        },
        {
          type: 'knowledge-check',
          question: 'Which statement best reflects HRBA?',
          options: [
            'Communities are beneficiaries, and NGOs are the main solution.',
            'Projects should focus only on service delivery.',
            'Rights-holders should participate, and duty-bearers should be strengthened to meet obligations.',
            'Human rights are mainly a legal issue, not a programming issue.'
          ],
          correctAnswer: 2,
          hint: 'Review the difference between rights-holders, duty-bearers, and other actors.'
        }
      ]
    },
    {
      id: 'lesson-2',
      title: 'The 5 Working Principles: How HRBA Changes Daily Practice',
      purpose: 'Help learners understand and apply the five working principles, which the toolbox says must guide programming, design, implementation, and results.',
      objectives: [
        'Name the 5 working principles.',
        'Explain each principle in plain, practical language.',
        'Identify what each principle looks like in CSO programming.',
        'Recognize weak and strong rights-based practice.'
      ],
      blocks: [
        {
          type: 'image',
          src: '/images/hero/hero_image1.png',
          alt: 'A group of diverse people participating in a meeting',
          caption: 'Participation is one of the 5 core HRBA principles.'
        },
        {
          type: 'text',
          heading: 'The 5 principles are the heart of HRBA',
          content: 'The HRBA toolbox identifies five working principles that should shape both how we work and what results we seek:\n\n1. Applying all human rights for all\n2. Meaningful and inclusive participation and access to decision-making\n3. Non-discrimination and equality\n4. Accountability and rule of law for all\n5. Transparency and access to information supported by disaggregated data'
        },
        {
          type: 'list',
          title: 'In plain language, the 5 principles mean:',
          items: [
            'Look at linked rights, not one issue in isolation.',
            'Include people meaningfully in decisions that affect them.',
            'Identify who is excluded and why.',
            'Strengthen ways for people to question, challenge, and seek remedy.',
            'Make information visible, accessible, and evidence-based.'
          ]
        },
        {
          type: 'process',
          title: 'How to use the 5 principles in any project idea',
          steps: [
            { title: 'Step 1: Identify the core problem', content: 'What human rights issue is at stake?' },
            { title: 'Step 2: Identify who is most affected', content: 'Who is excluded, overlooked, or furthest behind?' },
            { title: 'Step 3: Identify responsibilities', content: 'Which institution or actor has obligations or influence?' },
            { title: 'Step 4: Design participation', content: 'How will affected people shape decisions, not just attend meetings?' },
            { title: 'Step 5: Build accountability and evidence', content: 'What information, complaint channels, and indicators will show progress?' }
          ]
        },
        {
          type: 'accordion',
          title: 'One section per principle',
          items: [
            { title: '1. Applying all human rights for all', content: 'Do not isolate one need from related rights. For example, school dropout may connect with safety, disability inclusion, language, poverty, child protection, and participation. The toolbox stresses the interdependence of rights.' },
            { title: '2. Participation and access to decision-making', content: 'Communities should not just be informed; they should shape analysis and decisions. Participation must be meaningful, inclusive, and accessible.' },
            { title: '3. Non-discrimination and equality', content: 'Ask who is excluded by design, by practice, by language, by cost, by stigma, or by geography. HRBA requires attention to the root causes of inequality and discrimination.' },
            { title: '4. Accountability and rule of law for all', content: 'Build complaint, feedback, response, and redress mechanisms. HRBA expects institutions to be accountable, not only service-oriented.' },
            { title: '5. Transparency and access to information', content: 'Information must be accessible and usable. Data should be disaggregated at least by sex, age, and disability where relevant.' }
          ]
        },
        {
          type: 'tabs',
          title: 'Weak vs Strong Practice',
          items: [
            { title: 'Weak practice (Participation)', content: 'We held one consultation meeting.' },
            { title: 'Stronger practice (Participation)', content: 'We held separate, accessible consultations with women, youth, and persons with disabilities; shared draft decisions back; and showed what changed because of their input.' },
            { title: 'Weak practice (Targeting)', content: 'We targeted “vulnerable groups.”' },
            { title: 'Stronger practice (Targeting)', content: 'We identified specific excluded groups, documented the barriers they face, and adapted design, outreach, and indicators accordingly.' }
          ]
        },
        {
          type: 'statement',
          content: 'Participation is not attendance. Participation means influence.'
        },
        {
          type: 'sorting',
          title: 'Sort the action under the correct HRBA principle',
          categories: ['Participation', 'Equality', 'Accountability', 'Transparency'],
          cards: [
            { text: 'Publish service standards in local language', category: 'Transparency' },
            { text: 'Create community complaint desk', category: 'Accountability' },
            { text: 'Hold separate consultation with adolescent girls', category: 'Participation' },
            { text: 'Provide sign language interpretation', category: 'Equality' },
            { text: 'Disaggregate beneficiary data by sex, age, disability', category: 'Transparency' },
            { text: 'Review exclusion of remote kebeles', category: 'Equality' }
          ]
        },
        {
          type: 'knowledge-check',
          question: 'Which action best shows meaningful participation?',
          options: [
            'Informing the community after decisions are made',
            'Asking local officials only',
            'Involving affected groups early and showing how their views changed the design',
            'Hiring a consultant to write the proposal alone'
          ],
          correctAnswer: 2,
          hint: 'Meaningful participation requires that affected people influence decisions, not just attend events.'
        },
        {
          type: 'chart',
          title: 'From tokenism to stronger participation',
          chartType: 'ladder',
          items: ['Inform', 'Consult', 'Co-design', 'Shared influence'],
          note: 'For HRBA, move as far as possible from one-way information toward meaningful influence.'
        }
      ]
    },
    {
      id: 'lesson-3',
      title: 'Applying HRBA Across the Project Cycle',
      purpose: 'Teach learners how to apply HRBA in context analysis, stakeholder analysis, problem analysis, risk analysis, and indicators.',
      objectives: [
        'Use HRBA in context analysis.',
        'Distinguish rights-holders and duty-bearers in stakeholder mapping.',
        'Identify capacity gaps.',
        'Build better HRBA-sensitive indicators.',
        'Integrate gender, disability, and “do no harm” thinking.'
      ],
      blocks: [
        {
          type: 'image',
          src: '/images/hero/hero_about2.png',
          alt: 'A person analyzing data on a laptop',
          caption: 'HRBA starts with a deep analysis of the human rights situation.'
        },
        {
          type: 'text',
          heading: 'HRBA starts with analysis, not activities',
          content: 'A common project mistake is starting with activities before understanding the human rights situation. HRBA starts with analysis: what rights are at stake, who is left behind, why the problem persists, which institutions hold obligations, what capacities are missing, and what risks could make harm worse.'
        },
        {
          type: 'two-column',
          leftHeading: 'Ask in context analysis',
          leftItems: [
            'What are the main rights issues here?',
            'Who is excluded or discriminated against?',
            'What barriers do women, girls, children, persons with disabilities face?',
            'What legal, social, political, and cultural factors shape the issue?'
          ],
          rightHeading: 'Avoid',
          rightItems: [
            'Jumping straight to activities',
            'Treating all communities as one group',
            'Assuming the CSO is the only solution',
            'Collecting only aggregate data',
            'Ignoring conflict, power, and backlash risks'
          ]
        },
        {
          type: 'table',
          title: 'Stakeholder mapping with an HRBA lens',
          headers: ['Stakeholder', 'Role', 'Capacity gap', 'Influence', 'Engagement strategy'],
          rows: [
            ['Adolescent girls', 'Rights-holders', 'Limited voice, mobility, info', 'High', 'Safe consultations, peer groups'],
            ['Woreda education office', 'Duty-bearer', 'Weak budget follow-up, poor inclusion planning', 'High', 'Joint planning, evidence briefs'],
            ['School management committee', 'Mixed / local governance actor', 'Low accountability to parents', 'Medium', 'Public scorecards'],
            ['OPD / disability association', 'Representative actor', 'Underused in planning', 'Medium', 'Co-design accessibility actions'],
            ['CSO staff', 'Support actor', 'Limited HRBA analysis skills', 'High', 'Coaching and tools']
          ]
        },
        {
          type: 'process',
          title: '5-step HRBA analysis process',
          steps: [
            { title: 'Step 1: Context analysis', content: 'Review legal, policy, social, gender, disability, and conflict dimensions.' },
            { title: 'Step 2: Stakeholder analysis', content: 'Map rights-holders, duty-bearers, and key allies or blockers.' },
            { title: 'Step 3: Capacity assessment', content: 'Ask what prevents rights-holders from claiming rights and duty-bearers from meeting obligations.' },
            { title: 'Step 4: Decision-making and risk analysis', content: 'Consider backlash, exclusion, conflict sensitivity, and do-no-harm.' },
            { title: 'Step 5: Indicators and monitoring', content: 'Track not only outputs, but participation, inclusion, accountability, and access to information.' }
          ]
        },
        {
          type: 'tabs',
          title: 'Capacity Gaps and Responses',
          items: [
            { title: 'Gap: Rights-holders', content: 'Low awareness of rights, fear of speaking, no safe channels, limited representation.' },
            { title: 'Gap: Duty-bearers', content: 'Weak skills, low budget, poor coordination, lack of political will, inaccessible systems.' },
            { title: 'Program response', content: 'Awareness, organizing, facilitation, joint planning, system improvement, accountability tools, data use.' }
          ]
        },
        {
          type: 'statement',
          content: 'A good HRBA project does not only deliver services. It also changes relationships, voice, and accountability.'
        },
        {
          type: 'timeline',
          title: 'Where HRBA fits in the project cycle',
          items: [
            'Context analysis',
            'Stakeholder and capacity analysis',
            'Design and logframe',
            'Implementation with participation',
            'Monitoring with disaggregated data',
            'Reflection, accountability, adaptation',
            'Evaluation and learning'
          ]
        },
        {
          type: 'flashcards',
          items: [
            { front: 'Capacity gap', back: 'What prevents a stakeholder from fulfilling rights or obligations.' },
            { front: 'Disaggregated data', back: 'Data broken down by categories such as sex, age, disability, location.' },
            { front: 'Do no harm', back: 'Avoid causing or worsening exclusion, backlash, or rights violations.' },
            { front: 'Accountability mechanism', back: 'A channel through which people can ask questions, complain, seek remedy, or demand response.' }
          ]
        },
        {
          type: 'knowledge-check',
          question: 'Which indicator is most aligned with HRBA?',
          options: [
            'Number of workshops conducted',
            'Number of brochures printed',
            'Percentage of school improvement meetings that include women, youth, and persons with disabilities, with decisions publicly posted',
            'Number of staff recruited'
          ],
          correctAnswer: 2,
          hint: 'HRBA indicators should track participation, inclusion, and accountability, not just outputs.'
        },
        {
          type: 'chart',
          title: 'What to disaggregate when possible',
          chartType: 'bar',
          items: ['Sex', 'Age', 'Disability', 'Location', 'Displacement status', 'Other context-relevant categories'],
          note: 'This aligns with the toolbox’s emphasis on sex, age, disability, and other relevant categories.'
        }
      ]
    },
    {
      id: 'lesson-4',
      title: 'HRBA in Action: Ethiopia-Based Scenario and Application',
      purpose: 'Move from concept to application through one realistic Ethiopian CSO case.',
      objectives: [
        'Analyse a project scenario using HRBA.',
        'Identify weak and strong design choices.',
        'Suggest improvements related to participation, equality, accountability, and evidence.',
        'Draft practical actions for their own work.'
      ],
      blocks: [
        {
          type: 'image',
          src: '/images/courses/1.thumbnail_HRBA.png',
          alt: 'A primary school in rural Ethiopia',
          caption: 'Applying HRBA to improve girls\' education retention.'
        },
        {
          type: 'text',
          heading: 'Scenario',
          content: 'A local CSO is preparing a project to improve girls’ retention in upper primary school in a drought-affected woreda. Initial discussions show absenteeism linked to distance, household work, menstrual hygiene challenges, disability exclusion, safety concerns, and weak parent-school communication. The woreda education office wants quick results. The community elders want to be consulted, but adolescent girls have not yet been separately engaged.'
        },
        {
          type: 'text',
          heading: 'Meet the scenario',
          content: 'You are supporting a local CSO to design this project. The team has a draft plan: distribute school materials, train teachers, and hold awareness meetings. It sounds useful, but is it rights-based enough?'
        },
        {
          type: 'accordion',
          title: 'Unpack the scenario',
          items: [
            { title: 'What rights may be involved?', content: 'Right to education, equality and non-discrimination, participation, access to information, protection from violence, health and dignity.' },
            { title: 'Who are the rights-holders?', content: 'Adolescent girls, girls with disabilities, parents and caregivers, displaced girls, children in remote areas.' },
            { title: 'Who are the duty-bearers?', content: 'Woreda education office, school leadership, local administration, possibly sector offices responsible for water, protection, and health coordination.' },
            { title: 'What risks exist?', content: 'Token participation, elite capture, girls not speaking freely, inaccessible consultations, backlash against speaking out, weak data.' }
          ]
        },
        {
          type: 'process',
          title: 'Improve this project using HRBA',
          steps: [
            { title: 'Step 1: Start with separate consultations', content: 'Consult girls, girls with disabilities, caregivers, teachers, and local officials separately where needed.' },
            { title: 'Step 2: Identify barriers and discrimination', content: 'Document who is most excluded and why.' },
            { title: 'Step 3: Strengthen duty-bearers', content: 'Support school and woreda structures to respond, not only communities.' },
            { title: 'Step 4: Build accountability', content: 'Set up feedback channels, public action points, and response timelines.' },
            { title: 'Step 5: Monitor inclusively', content: 'Track attendance, participation, accessibility, and response to complaints using disaggregated data.' }
          ]
        },
        {
          type: 'sorting',
          title: 'Sort the design choice',
          categories: ['Strong HRBA', 'Weak HRBA'],
          cards: [
            { text: 'Consult only school principals', category: 'Weak HRBA' },
            { text: 'Hold separate focus groups with girls', category: 'Strong HRBA' },
            { text: 'Track attendance for all learners only', category: 'Weak HRBA' },
            { text: 'Disaggregate by sex, disability, and location', category: 'Strong HRBA' },
            { text: 'Share school action points publicly', category: 'Strong HRBA' },
            { text: 'Call all children “beneficiaries” with no role in decisions', category: 'Weak HRBA' }
          ]
        },
        {
          type: 'knowledge-check',
          question: 'Which improvement best strengthens accountability?',
          options: [
            'Printing more banners',
            'Creating a community feedback and response mechanism with named responsibilities',
            'Holding a launch event',
            'Hiring more temporary staff'
          ],
          correctAnswer: 1,
          hint: 'Accountability requires mechanisms through which institutions answer for actions and respond to claims.'
        },
        {
          type: 'tabs',
          title: 'Impact of HRBA',
          items: [
            { title: 'If you only do service delivery', content: 'You may help temporarily, but root causes may remain.' },
            { title: 'If you apply HRBA', content: 'You improve voice, institutional response, inclusion, and sustainability.' },
            { title: 'What good MEAL looks like', content: 'Use disaggregated attendance data, consultation records, complaint trends, accessibility observations, and action follow-up.' }
          ]
        },
        {
          type: 'statement',
          content: 'The strongest HRBA project is not the one with the most activities. It is the one with the clearest path from rights issues to inclusive change.'
        },
        {
          type: 'reflection',
          heading: 'Apply it to your own work',
          content: 'Think about one current project in your organization. Who are the main rights-holders? Which duty-bearers matter most? Who is least heard? What information is missing? What would you change first if you wanted the project to become more rights-based?'
        }
      ]
    }
  ],
  finalTest: [
    {
      id: 'q1',
      question: 'A CSO project consults local leaders but not adolescent girls directly. Which HRBA principle is most clearly weakened?',
      options: ['Applying all human rights for all', 'Meaningful and inclusive participation', 'Budget efficiency', 'Visibility'],
      correctAnswer: 1
    },
    {
      id: 'q2',
      question: 'Which action best reflects non-discrimination and equality?',
      options: ['Use one activity design for everyone', 'Focus only on easy-to-reach communities', 'Identify excluded groups and adapt design to their barriers', 'Avoid collecting subgroup data'],
      correctAnswer: 2
    },
    {
      id: 'q3',
      question: 'Which indicator is most HRBA-aligned?',
      options: ['Number of T-shirts distributed', 'Number of meetings held', 'Percentage of complaints responded to within 30 days, disaggregated by complainant group', 'Number of project vehicles used'],
      correctAnswer: 2
    },
    {
      id: 'q4',
      question: 'Which statement best reflects the role of a CSO in HRBA?',
      options: ['Replace the state permanently', 'Deliver services without questioning systems', 'Support rights-holders, strengthen accountability, and engage duty-bearers', 'Avoid policy issues'],
      correctAnswer: 2
    },
    {
      id: 'q5',
      question: 'Which project design choice is strongest from an HRBA perspective?',
      options: ['Start activities before analysis', 'Use only aggregate beneficiary numbers', 'Conduct context and stakeholder analysis, identify capacity gaps, and design participation and accountability mechanisms', 'Focus only on outputs'],
      correctAnswer: 2
    }
  ],
  feedbackQuestions: [
    { id: 'f1', text: 'The course helped me understand HRBA in practical terms.', type: 'likert' },
    { id: 'f2', text: 'The course was relevant to Ethiopian CSO work.', type: 'likert' },
    { id: 'f3', text: 'The examples and scenario felt realistic.', type: 'likert' },
    { id: 'f4', text: 'The interactive blocks helped me learn.', type: 'likert' },
    { id: 'f5', text: 'I now feel more confident applying HRBA to project design or MEAL.', type: 'likert' },
    { id: 'f6', text: 'Which part was most useful?', type: 'multiple-choice', options: ['HRBA basics', '5 principles', 'Project-cycle application', 'Ethiopia-based scenario', 'Assessments'] },
    { id: 'f7', text: 'What is one thing you will apply in your work after this course?', type: 'open' }
  ],
  glossary: [
    { term: 'HRBA', definition: 'A programming approach that places human rights principles at the center of analysis, design, implementation, and monitoring.' },
    { term: 'Rights-holder', definition: 'A person or group entitled to human rights.' },
    { term: 'Duty-bearer', definition: 'An institution, usually a state actor, responsible for respecting, protecting, and fulfilling rights.' },
    { term: 'Participation', definition: 'Meaningful involvement of people in decisions affecting them.' },
    { term: 'Non-discrimination', definition: 'Ensuring no one is excluded or treated unfairly.' },
    { term: 'Equality', definition: 'Fair access, treatment, opportunities, and outcomes.' },
    { term: 'Accountability', definition: 'Mechanisms through which institutions answer for actions and respond to claims or complaints.' },
    { term: 'Transparency', definition: 'Making information visible, accessible, and understandable.' },
    { term: 'Disaggregated data', definition: 'Data broken down by categories such as sex, age, disability, or location.' },
    { term: 'Capacity gap', definition: 'A weakness that limits a stakeholder’s ability to claim rights or fulfil obligations.' },
    { term: 'Inclusion', definition: 'Designing processes and services so diverse groups can participate effectively.' },
    { term: 'Do No Harm', definition: 'Avoiding actions that worsen risks, exclusion, or conflict.' },
    { term: 'Access to information', definition: 'The ability of people to obtain and use relevant information.' },
    { term: 'Redress', definition: 'A response or remedy when rights are violated or services fail.' },
    { term: 'Meaningful participation', definition: 'Participation that influences decisions, not just attendance.' }
  ],
  resources: [
    { id: 'R1', title: 'EU HRBA Toolbox', type: 'Reference PDF', required: true },
    { id: 'R2', title: 'HRBA concept quick guide', type: 'Downloadable PDF', required: false },
    { id: 'R3', title: '5 HRBA principles quick guide', type: 'Downloadable PDF', required: false },
    { id: 'R4', title: 'Rights-holder and duty-bearer mapping worksheet', type: 'Worksheet', required: false },
    { id: 'R5', title: 'HRBA project design checklist', type: 'Checklist', required: false },
    { id: 'R6', title: 'HRBA-sensitive indicator checklist', type: 'Checklist', required: false },
    { id: 'R7', title: 'Reflection worksheet: How rights-based is my current project?', type: 'Worksheet', required: false }
  ],
  certificateText: {
    title: 'Certificate of Achievement',
    body: 'This is to certify that you have successfully completed the course "HRBA in Practice: Applying a Human Rights-Based Approach in Ethiopian CSO Programming". You have demonstrated a solid understanding of HRBA principles and their application across the project cycle.',
    footer: 'Issued by the HRBA Learning Initiative for Ethiopian CSOs'
  }
};
