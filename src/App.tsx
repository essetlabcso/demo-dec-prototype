import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Menu,
  X,
  ArrowLeft,
  Award,
  FileText,
  Search,
  Download,
  ExternalLink,
  PlayCircle,
  Clock,
  BarChart3,
  Globe,
  User,
  Star,
  Info,
  XCircle,
  ChevronDown,
  LayoutDashboard,
  Settings,
  LogOut,
  Users,
  History,
  ShieldCheck,
  RotateCcw,
  Plus,
  LayoutGrid,
  FileEdit,
  Eye,
  CheckSquare,
  Send,
  Library,
  MoreVertical,
  Filter,
  ChevronLeft,
  Calendar,
  Tag,
  MessageSquare,
  FileCheck,
  AlertCircle,
  AlertTriangle,
  Trash2,
  Copy,
  Archive,
  ArrowRight,
  Target,
  Save,
  Undo,
  Briefcase,
  GripVertical,
  PlusCircle,
  Layout,
  Type,
  Image,
  Table,
  BarChart,
  List,
  Quote,
  Layers,
  Split,
  MoreHorizontal,
  PartyPopper
} from 'lucide-react';
import { cn } from './lib/utils';
import { courseData, Lesson, ContentBlock } from './data/courseData';
import * as Blocks from './components/CourseBlocks';

import { catalogCourses, CatalogCourse } from './data/catalogData';
import { staffUsers, auditLogs, StaffUser, AuditLog, CMSModule, CMSLesson, initialModules, ModuleStatus, CMSAsset, CMSAssessment, CMSQuestion, CMSFeedbackInstrument, FeedbackItemType, CMSFeedbackItem, CMSReviewComment, CMSQAResult } from './data/staffData';

type View = 'landing' | 'catalog' | 'preview' | 'welcome' | 'lesson' | 'test-intro' | 'test' | 'test-results' | 'feedback' | 'completion' | 'glossary' | 'resources' | 'staff-sign-in' | 'member-sign-in' | 'staff-workspace';

type UserRole = 'content_admin' | 'reviewer' | 'admin' | 'super_admin' | 'member' | 'guest';

interface UserProfile {
  email: string;
  role: UserRole;
  name: string;
}

export default function App() {
  const [view, setView] = useState<View>('landing');
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [blockCompletion, setBlockCompletion] = useState<Record<string, Set<number>>>({});
  const [testScore, setTestScore] = useState<number | null>(null);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [welcomeVideoViewed, setWelcomeVideoViewed] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [glossarySearch, setGlossarySearch] = useState('');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('dec_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [currentLanguage, setCurrentLanguage] = useState('English');
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [certNumber, setCertNumber] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState<null | 'valid' | 'invalid'>(null);

  const [modules, setModules] = useState<CMSModule[]>(() => {
    const saved = localStorage.getItem('dec_modules');
    return saved ? JSON.parse(saved) : initialModules;
  });

  const [staffView, setStaffView] = useState<'dashboard' | 'modules' | 'create-module' | 'module-overview' | 'lesson-editor' | 'media-library' | 'assessment-builder' | 'feedback-builder' | 'users' | 'audit' | 'settings' | 'qa-checklist' | 'review-queue' | 'review-module' | 'publish-module' | 'analytics' | 'feedback-triage'>('dashboard');
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  useEffect(() => {
    localStorage.setItem('dec_modules', JSON.stringify(modules));
  }, [modules]);

  const currentLesson = courseData.lessons[currentLessonIndex];

  // --- Helpers ---
  const markBlockComplete = (lessonId: string, blockIndex: number) => {
    setBlockCompletion(prev => ({
      ...prev,
      [lessonId]: new Set(prev[lessonId] || []).add(blockIndex)
    }));
  };

  const isLessonComplete = (lessonId: string) => {
    const lesson = courseData.lessons.find(l => l.id === lessonId);
    if (!lesson) return false;
    const completed = blockCompletion[lessonId] || new Set();

    // A lesson is complete if:
    // 1. ALL blocks tagged explicitly as 'mandatory' are interacted with
    // 2. Traditionally interactive blocks (for prototype feel) are interacted with
    const requiredIndices = lesson.blocks
      .map((b, i) => {
        const isInteractiveType = ['accordion', 'tabs', 'process', 'flashcards', 'sorting', 'knowledge-check', 'reflection', 'timeline', 'chart'].includes(b.type);
        const isMandatory = (b as any).mandatory === true;
        return (isInteractiveType || isMandatory) ? i : -1;
      })
      .filter(i => i !== -1);

    return requiredIndices.every(i => completed.has(i));
  };

  const totalProgress = useMemo(() => {
    const lessonWeight = 80 / courseData.lessons.length;
    const lessonProgress = Array.from(completedLessons).length * lessonWeight;
    const testProgress = testScore !== null ? 10 : 0;
    const feedbackProgress = feedbackSubmitted ? 10 : 0;
    return Math.min(100, Math.round(lessonProgress + testProgress + feedbackProgress));
  }, [completedLessons, testScore, feedbackSubmitted]);

  // --- Views ---

  const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isSignInDropdownOpen, setIsSignInDropdownOpen] = useState(false);

    useEffect(() => {
      const handleScroll = () => setIsScrolled(window.scrollY > 20);
      window.addEventListener('scroll', handleScroll);

      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setIsSignInDropdownOpen(false);
      };
      window.addEventListener('keydown', handleEscape);

      return () => {
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('keydown', handleEscape);
      };
    }, []);

    const navLinks = [
      { name: 'Home', href: '#home', action: () => { setView('landing'); setTimeout(() => document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' }), 100); } },
      { name: 'About', href: '#about', action: () => { setView('landing'); setTimeout(() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }), 100); } },
      { name: 'Catalog', href: '#catalog', action: () => setView('catalog') },
      { name: 'Courses', href: '#courses', action: () => { setView('landing'); setTimeout(() => document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' }), 100); } },
    ];

    return (
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 md:px-12 py-4",
        isScrolled || view !== 'landing' ? "bg-white/95 backdrop-blur-xl shadow-lg py-3" : "bg-transparent"
      )}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div
            className="flex items-center cursor-pointer group"
            onClick={() => { setView('landing'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          >
            <img 
              src="/brand/dec/DEC-Logo.svg" 
              alt="Development Expertise Center" 
              className="h-12 w-auto object-contain transition-transform duration-500 group-hover:scale-105" 
            />
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-10">
            {navLinks.map(link => (
              <button
                key={link.name}
                onClick={link.action}
                className={cn(
                  "text-sm font-black uppercase tracking-widest transition-all hover:text-primary relative group",
                  isScrolled || view !== 'landing' ? "text-slate" : "text-white/80"
                )}
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
              </button>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-6">
            <div className="relative">
              <button
                onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border",
                  isScrolled || view !== 'landing' 
                    ? "text-slate border-slate/10 hover:bg-slate/5" 
                    : "text-white border-white/20 hover:bg-white/10"
                )}
              >
                <Globe className="w-4 h-4" />
                {currentLanguage}
              </button>
              <AnimatePresence>
                {isLanguageMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 z-[60]"
                  >
                    {['English', 'Amharic', 'Afar', 'Oromiffa'].map(lang => (
                      <button
                        key={lang}
                        onClick={() => { setCurrentLanguage(lang); setIsLanguageMenuOpen(false); }}
                        className="w-full text-left px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate hover:bg-primary/5 hover:text-primary transition-all"
                      >
                        {lang}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={() => setIsVerifyModalOpen(true)}
              className={cn(
                "text-[10px] font-black uppercase tracking-[0.2em] hover:text-primary transition-all",
                isScrolled || view !== 'landing' ? "text-slate" : "text-white/80"
              )}
            >
              Verify Certificate
            </button>

            <div className="w-px h-6 bg-gray-200/50 mx-2" />

            <div className="relative">
              <button
                onClick={() => setIsSignInDropdownOpen(!isSignInDropdownOpen)}
                className={cn(
                  "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest transition-all",
                  isScrolled || view !== 'landing' ? "text-slate hover:text-primary" : "text-white hover:text-white/100"
                )}
              >
                {currentUser ? (
                  <>
                    <User className="w-4 h-4" />
                    {currentUser.role === 'content_admin' ? 'Signed in as Staff' : 'Signed in as Member'}
                  </>
                ) : (
                  <>
                    Sign In
                    <ChevronDown className={cn("w-4 h-4 transition-transform", isSignInDropdownOpen && "rotate-180")} />
                  </>
                )}
              </button>

              <AnimatePresence>
                {isSignInDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden py-2"
                  >
                    {!currentUser ? (
                      <>
                        <button
                          onClick={() => { setView('staff-sign-in'); setIsSignInDropdownOpen(false); }}
                          className="w-full flex items-center gap-3 px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                        >
                          <ShieldCheck className="w-5 h-5 text-primary" />
                          <div className="flex flex-col">
                            <span className="text-sm font-black text-ink">Staff Sign In</span>
                            <span className="text-[10px] text-slate/60 uppercase tracking-widest">Workspace Access</span>
                          </div>
                        </button>
                        <button
                          onClick={() => { setView('member-sign-in'); setIsSignInDropdownOpen(false); }}
                          className="w-full flex items-center gap-3 px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                        >
                          <User className="w-5 h-5 text-accent" />
                          <div className="flex flex-col">
                            <span className="text-sm font-black text-ink">Member Sign In</span>
                            <span className="text-[10px] text-slate/60 uppercase tracking-widest">Learner Dashboard</span>
                          </div>
                        </button>
                        <div className="h-px bg-gray-100 mx-4 my-2" />
                        <button
                          onClick={() => { setView('landing'); setIsSignInDropdownOpen(false); }}
                          className="w-full flex items-center gap-3 px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                        >
                          <Globe className="w-5 h-5 text-slate" />
                          <div className="flex flex-col">
                            <span className="text-sm font-black text-ink">Public Access</span>
                            <span className="text-[10px] text-slate/60 uppercase tracking-widest">Browse Catalog</span>
                          </div>
                        </button>
                      </>
                    ) : (
                      <>
                        {currentUser.role !== 'member' && (
                          <button
                            onClick={() => { setView('staff-workspace'); setIsSignInDropdownOpen(false); }}
                            className="w-full flex items-center gap-3 px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                          >
                            <LayoutDashboard className="w-5 h-5 text-primary" />
                            <span className="text-sm font-black text-ink">Go to Workspace</span>
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setCurrentUser(null);
                            localStorage.removeItem('dec_user');
                            setView('landing');
                            setIsSignInDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-6 py-4 text-left hover:bg-gray-50 transition-colors text-red-600"
                        >
                          <LogOut className="w-5 h-5" />
                          <span className="text-sm font-black">Sign Out</span>
                        </button>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <button className="bg-primary hover:bg-primary/90 text-white px-8 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest shadow-lg shadow-primary/20 transition-all">
              Register
            </button>
          </div>

          {/* Mobile Toggle */}
          <button
            className="lg:hidden p-2 rounded-xl transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className={isScrolled || view !== 'landing' ? "text-ink" : "text-white"} /> : <Menu className={isScrolled || view !== 'landing' ? "text-ink" : "text-white"} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-full left-6 right-6 mt-4 bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 lg:hidden"
            >
              <div className="flex flex-col gap-6">
                {navLinks.map(link => (
                  <button
                    key={link.name}
                    onClick={() => { link.action(); setMobileMenuOpen(false); }}
                    className="text-left text-lg font-bold text-ink hover:text-primary transition-colors"
                  >
                    {link.name}
                  </button>
                ))}
                <hr className="border-gray-100" />
                <div className="flex flex-col gap-4">
                  {currentUser ? (
                    <button
                      onClick={() => {
                        setCurrentUser(null);
                        localStorage.removeItem('dec_user');
                        setView('landing');
                        setMobileMenuOpen(false);
                      }}
                      className="w-full py-4 rounded-2xl text-red-600 font-bold border border-red-100 bg-red-50"
                    >
                      Sign Out
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => { setView('staff-sign-in'); setMobileMenuOpen(false); }}
                        className="w-full py-4 rounded-2xl text-primary font-bold border border-primary/10 bg-primary/5"
                      >
                        Staff Sign In
                      </button>
                      <button
                        onClick={() => { setView('member-sign-in'); setMobileMenuOpen(false); }}
                        className="w-full py-4 rounded-2xl text-accent font-bold border border-accent/10 bg-accent/5"
                      >
                        Member Sign In
                      </button>
                    </>
                  )}
                  <button className="w-full py-4 rounded-2xl bg-primary text-white font-bold shadow-lg shadow-primary/20">Register</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    );
  };

  const LandingView = () => (
    <div className="bg-white">
      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero/hero_image1.png"
            alt="Hero Background"
            className="w-full h-full object-cover brightness-[0.5]"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/40 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 w-full">
          <div className="max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-3 px-4 py-2 bg-primary/20 backdrop-blur-md border border-primary/30 rounded-full text-primary text-xs font-black uppercase tracking-[0.4em] mb-8"
            >
              <Globe className="w-4 h-4" /> DEC Learning Platform
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-6xl md:text-8xl lg:text-9xl font-black text-white mb-6 leading-[0.9] font-serif tracking-tighter"
            >
              Learn, Adapt, Grow
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-white/80 mb-12 leading-relaxed font-medium max-w-2xl"
            >
              Practical digital learning for local and grassroots CSOs.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center gap-6"
            >
              <button
                onClick={() => setView('catalog')}
                className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white font-black py-6 px-12 rounded-[24px] shadow-2xl shadow-primary/30 transition-all text-lg uppercase tracking-[0.2em] flex items-center justify-center gap-3 group"
              >
                Explore Courses
                <ChevronRight className="w-6 h-6 transition-transform group-hover:translate-x-2" />
              </button>
              <button
                onClick={() => setView('preview')}
                className="w-full sm:w-auto bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-black py-6 px-12 rounded-[24px] border border-white/20 transition-all text-lg uppercase tracking-[0.2em]"
              >
                Start with HRBA
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-12 flex flex-wrap items-center gap-8 text-white/40 text-[10px] font-black uppercase tracking-[0.3em]"
            >
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-success" /> Mobile-friendly
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-success" /> Practical
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-success" /> Ethiopia-grounded
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-success" /> Certificate-ready
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Value Prop Section */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-24">
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-4 block">Our Approach</span>
            <h2 className="text-4xl md:text-6xl font-extrabold text-ink font-serif tracking-tighter uppercase">CORE FEATURES</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Practical and work-ready",
                text: "Learn through real examples, simple tools, and course flows designed for everyday CSO work.",
                icon: <BookOpen className="w-8 h-8 text-primary" />,
                color: "bg-primary/5"
              },
              {
                title: "Grounded in local realities",
                text: "Course experiences are shaped by Ethiopian civil society contexts, not generic global templates.",
                icon: <Globe className="w-8 h-8 text-accent" />,
                color: "bg-accent/5"
              },
              {
                title: "Designed for accessibility",
                text: "Mobile-friendly, easy to navigate, and built for low-bandwidth learning environments.",
                icon: <User className="w-8 h-8 text-success" />,
                color: "bg-success/5"
              },
              {
                title: "Focused on action",
                text: "Help staff and leaders strengthen design, accountability, learning, and implementation practice.",
                icon: <Award className="w-8 h-8 text-warning" />,
                color: "bg-warning/5"
              }
            ].map((card, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                className={cn("p-10 rounded-[40px] border border-gray-100 transition-all shadow-sm hover:shadow-xl", card.color)}
              >
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-8">
                  {card.icon}
                </div>
                <h3 className="text-xl font-bold text-ink mb-4 font-serif">{card.title}</h3>
                <p className="text-slate leading-relaxed text-sm font-medium opacity-70">{card.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 bg-paper">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-4 block">About the Platform</span>
              <h2 className="text-4xl md:text-6xl font-black text-ink font-serif tracking-tight mb-8">About</h2>
              <p className="text-xl text-slate leading-relaxed font-medium opacity-80 mb-12">
                This is a digital learning platform designed to support local and grassroots CSOs with practical, relevant, and engaging learning experiences. The platform is built to make quality capacity strengthening more accessible through structured courses, learner-friendly design, and context-aware content that connects directly to real organizational and program challenges.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  "Self-paced learning",
                  "Practical course journeys",
                  "Interactive lesson blocks",
                  "Certificate-ready flows",
                  "Mobile-friendly access",
                  "Context-specific content"
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-success/10 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-success" />
                    </div>
                    <span className="text-sm font-bold text-slate">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-[64px] overflow-hidden shadow-2xl">
                <img
                  src="/images/hero/hero_about2.png"
                  alt="About DEC"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-10 -left-10 bg-white p-10 rounded-[40px] shadow-2xl max-w-xs border border-gray-100 hidden md:block">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center">
                    <Star className="w-6 h-6 text-accent" />
                  </div>
                  <span className="font-black text-ink uppercase tracking-widest text-xs">Contextual</span>
                </div>
                <p className="text-sm text-slate font-medium leading-relaxed italic">
                  "Empowering local actors through accessible, high-quality digital learning."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Course Section */}
      <section id="courses" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-24">
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-4 block">Start Your Journey</span>
            <h2 className="text-4xl md:text-6xl font-black text-ink font-serif tracking-tight">Featured course</h2>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-paper rounded-[64px] overflow-hidden border border-gray-100 flex flex-col lg:flex-row shadow-2xl"
          >
            <div className="lg:w-1/2 h-96 lg:h-auto relative">
              <img
                src="/images/courses/1.thumbnail_HRBA.png"
                alt="HRBA Course"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-10 left-10 bg-white/90 backdrop-blur-md px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">
                Most Popular
              </div>
            </div>
            <div className="p-16 lg:w-1/2 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-[10px] font-black text-success uppercase tracking-[0.3em] bg-success/5 px-4 py-1.5 rounded-full">Human Rights</span>
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] bg-primary/5 px-4 py-1.5 rounded-full">Programming</span>
              </div>
              <h3 className="text-4xl md:text-5xl font-black text-ink mb-8 font-serif leading-tight">
                HRBA in Practice: Applying a Human Rights-Based Approach in Ethiopian CSO Programming
              </h3>
              <p className="text-xl text-slate mb-12 leading-relaxed font-medium opacity-70">
                Learn how to apply a Human Rights-Based Approach in practical CSO programming through interactive lessons, Ethiopia-based examples, and guided reflection.
              </p>

              <div className="flex flex-wrap gap-8 mb-12">
                <div className="flex items-center gap-3 text-sm font-bold text-slate">
                  <Clock className="w-5 h-5 text-primary" /> 4 Lessons
                </div>
                <div className="flex items-center gap-3 text-sm font-bold text-slate">
                  <PlayCircle className="w-5 h-5 text-primary" /> Interactive
                </div>
                <div className="flex items-center gap-3 text-sm font-bold text-slate">
                  <Award className="w-5 h-5 text-primary" /> Certificate
                </div>
              </div>

              <button
                onClick={() => setView('preview')}
                className="bg-primary hover:bg-primary/90 text-white font-black py-6 px-12 rounded-[24px] shadow-2xl shadow-primary/20 transition-all text-lg uppercase tracking-[0.2em] flex items-center justify-center gap-4 group w-full sm:w-auto"
              >
                Open HRBA Course
                <ChevronRight className="w-6 h-6 transition-transform group-hover:translate-x-2" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Catalog Preview Section */}
      <section id="catalog" className="py-32 bg-paper">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-24">
            <div className="max-w-2xl">
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-4 block">Course Library</span>
              <h2 className="text-4xl md:text-6xl font-black text-ink font-serif tracking-tight mb-8 text-left">Browse the catalog</h2>
              <p className="text-xl text-slate leading-relaxed font-medium opacity-80 text-left">
                Explore courses designed to strengthen practical capacities in governance, programming, accountability, and organizational development.
              </p>
            </div>
            <button
              onClick={() => setView('catalog')}
              className="text-primary font-black uppercase tracking-widest text-sm flex items-center gap-2 hover:gap-4 transition-all"
            >
              View Full Catalog <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {catalogCourses.slice(0, 3).map((course, i) => (
              <motion.div
                key={course.id}
                whileHover={{ y: -10 }}
                onClick={() => {
                  if (course.id === 'hrba-practice') {
                    setView('preview');
                  } else {
                    setView('catalog');
                  }
                }}
                className="bg-white rounded-[40px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all cursor-pointer group"
              >
                <div className="h-64 relative overflow-hidden">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => { (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${course.id}/800/600`; }}
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  {course.featured && (
                    <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-[8px] font-black uppercase tracking-widest shadow-lg">
                      Featured
                    </div>
                  )}
                </div>
                <div className="p-10">
                  <span className="text-[10px] font-black text-primary uppercase tracking-widest mb-4 block">{course.category}</span>
                  <h4 className="text-2xl font-bold text-ink mb-4 font-serif group-hover:text-primary transition-colors line-clamp-2 min-h-[4rem]">{course.title}</h4>
                  <p className="text-slate text-sm font-medium opacity-70 line-clamp-2 mb-8">{course.description}</p>
                  <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                    <span className="text-xs font-bold text-slate/60 uppercase tracking-widest">{course.lessons}</span>
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-32 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-24">
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-4 block">The Journey</span>
            <h2 className="text-4xl md:text-6xl font-black text-ink font-serif tracking-tight mb-8">What the learning experience includes</h2>
            <p className="text-xl text-slate leading-relaxed font-medium opacity-80 max-w-3xl mx-auto">
              Each course is designed to be clear, guided, and practical, helping learners move step by step from orientation to application.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Structured Journeys", text: "Guided step-by-step learning paths.", icon: <Menu className="w-6 h-6" /> },
              { title: "Interactive Blocks", text: "Engaging activities and reflections.", icon: <PlayCircle className="w-6 h-6" /> },
              { title: "Knowledge Checks", text: "Validate your learning as you go.", icon: <CheckCircle2 className="w-6 h-6" /> },
              { title: "Progress Tracking", text: "Always know where you are.", icon: <BarChart3 className="w-6 h-6" /> },
              { title: "Resource Library", text: "Access tools and glossary terms.", icon: <FileText className="w-6 h-6" /> },
              { title: "Official Certificate", text: "Earn recognition for your skills.", icon: <Award className="w-6 h-6" /> }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-6 p-8 bg-paper rounded-[32px] border border-gray-100">
                <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-primary shadow-sm">
                  {item.icon}
                </div>
                <div>
                  <h4 className="font-bold text-ink text-lg">{item.title}</h4>
                  <p className="text-slate text-sm font-medium opacity-60">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="bg-primary rounded-[64px] p-16 md:p-24 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />

            <div className="relative z-10">
              <h2 className="text-4xl md:text-7xl font-black text-white mb-8 font-serif tracking-tight">Ready to start your learning journey?</h2>
              <p className="text-xl md:text-2xl text-white/80 mb-16 max-w-3xl mx-auto font-medium">
                Explore practical courses designed to support stronger programming, accountability, and locally grounded organizational learning.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <button
                  onClick={() => setView('catalog')}
                  className="w-full sm:w-auto bg-white text-primary font-black py-6 px-12 rounded-[24px] shadow-2xl transition-all text-lg uppercase tracking-[0.2em]"
                >
                  Go to Catalog
                </button>
                <button
                  onClick={() => setView('preview')}
                  className="w-full sm:w-auto bg-primary-dark border border-white/20 text-white font-black py-6 px-12 rounded-[24px] hover:bg-white/10 transition-all text-lg uppercase tracking-[0.2em]"
                >
                  Open HRBA Course
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );

  const Footer = () => (
    <footer className="bg-ink pt-32 pb-12 text-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20 mb-32">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <div className="text-white font-black text-xs">DEC</div>
              </div>
              <span className="font-black text-2xl tracking-tighter font-serif">
                DEC <span className="text-primary">Learning</span>
              </span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed font-medium mb-8">
              A digital learning platform designed to support local and grassroots CSOs in Ethiopia with practical, relevant, and engaging learning experiences.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white/30 mb-8">Platform</h4>
            <ul className="space-y-4">
              <li><button onClick={() => { setView('landing'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-white/60 hover:text-primary transition-colors text-sm font-bold">Home</button></li>
              <li><button onClick={() => { setView('landing'); setTimeout(() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="text-white/60 hover:text-primary transition-colors text-sm font-bold">About</button></li>
              <li><button onClick={() => setView('catalog')} className="text-white/60 hover:text-primary transition-colors text-sm font-bold">Catalog</button></li>
              <li><button onClick={() => { setView('landing'); setTimeout(() => document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="text-white/60 hover:text-primary transition-colors text-sm font-bold">Courses</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white/30 mb-8">Account</h4>
            <ul className="space-y-4">
              <li><button className="text-white/60 hover:text-primary transition-colors text-sm font-bold">Sign In</button></li>
              <li><button className="text-white/60 hover:text-primary transition-colors text-sm font-bold">Sign Up</button></li>
              <li><button className="text-white/60 hover:text-primary transition-colors text-sm font-bold">Register</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white/30 mb-8">Connect</h4>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-primary transition-colors cursor-pointer">
                <Globe className="w-5 h-5" />
              </div>
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-primary transition-colors cursor-pointer">
                <Info className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-24 pb-12 border-t border-white/5 flex flex-col items-center">
          <div className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] mb-12">Our Partners</div>
          <div className="flex flex-wrap items-center justify-center gap-12 md:gap-20 opacity-60 hover:opacity-100 transition-opacity duration-700">
            <img src="/brand/partner-logos/cosap-logo.png" alt="COSAP" className="h-10 w-auto object-contain" />
            <img src="/brand/partner-logos/cps-logo.png" alt="CPS" className="h-10 w-auto object-contain" />
            <img src="/brand/partner-logos/eu-logo.png" alt="EU" className="h-10 w-auto object-contain" />
            <img src="/brand/partner-logos/pfe-logo.png" alt="PFE" className="h-10 w-auto object-contain" />
            <img src="/brand/partner-logos/whh-logo.png" alt="WHH" className="h-10 w-auto object-contain" />
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-white/30 text-xs font-bold uppercase tracking-widest">
            © 2026 Development Expertise Center (DEC). All Rights Reserved.
          </p>
          <div className="flex gap-8">
            <span className="text-white/30 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors cursor-pointer">Privacy Policy</span>
            <span className="text-white/30 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
  const CatalogView = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [accessFilter, setAccessFilter] = useState('All');

    const categories = ['All', ...new Set(catalogCourses.map(c => c.category))];
    const accessTypes = ['All', 'Public', 'Members only'];

    const filteredCourses = catalogCourses.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || course.category === categoryFilter;
      const matchesAccess = accessFilter === 'All' || course.access === accessFilter;
      return matchesSearch && matchesCategory && matchesAccess;
    });

    const featuredCourse = catalogCourses.find(c => c.featured);
    const regularCourses = filteredCourses.filter(c => !c.featured);

    return (
      <div className="min-h-screen bg-paper pt-32 pb-20 px-6 md:px-12 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-success/5 rounded-full blur-[100px]" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-20">
            <div className="max-w-3xl">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-4 mb-6"
              >
                <div className="w-12 h-1 bg-primary rounded-full" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Learning Portal</span>
              </motion.div>
              <h1 className="text-6xl md:text-8xl font-black text-ink font-serif leading-[0.9] tracking-tighter mb-8">
                Course <br />
                <span className="text-primary">Catalog</span>
              </h1>
              <p className="text-xl text-slate font-medium opacity-70 max-w-2xl leading-relaxed">
                Explore our comprehensive library of courses designed specifically for local and grassroots CSOs in Ethiopia.
              </p>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col gap-4 w-full lg:max-w-md">
              <div className="relative group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate/40 group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-gray-100 rounded-2xl py-5 pl-14 pr-6 text-sm font-bold shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
              <div className="flex gap-3">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="flex-1 bg-white border border-gray-100 rounded-xl py-3 px-4 text-xs font-black uppercase tracking-widest shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {categories.map(cat => <option key={cat} value={cat}>{cat === 'All' ? 'All Categories' : cat}</option>)}
                </select>
                <select
                  value={accessFilter}
                  onChange={(e) => setAccessFilter(e.target.value)}
                  className="flex-1 bg-white border border-gray-100 rounded-xl py-3 px-4 text-xs font-black uppercase tracking-widest shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {accessTypes.map(type => <option key={type} value={type}>{type === 'All' ? 'All Access' : type}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Featured Section */}
          {featuredCourse && searchQuery === '' && categoryFilter === 'All' && accessFilter === 'All' && (
            <div className="mb-20">
              <span className="text-[10px] font-black text-slate uppercase tracking-[0.4em] mb-8 block">Featured Course</span>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[48px] shadow-2xl overflow-hidden border border-gray-100 flex flex-col lg:flex-row group transition-all duration-700 hover:shadow-primary/5"
              >
                <div className="lg:w-[45%] h-96 lg:h-auto relative overflow-hidden">
                  <img
                    src={featuredCourse.thumbnail}
                    alt={featuredCourse.title}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    onError={(e) => { (e.target as HTMLImageElement).src = "/images/courses/1.thumbnail_HRBA.png"; }}
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute top-10 left-10 bg-white/90 backdrop-blur-md text-ink text-[10px] font-black px-6 py-3 rounded-full shadow-2xl uppercase tracking-[0.2em]">
                    DEC-HRBA-101
                  </div>
                </div>
                <div className="p-12 md:p-16 lg:w-[55%] flex flex-col">
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="text-[10px] font-black text-success uppercase tracking-[0.3em] bg-success/5 px-3 py-1 rounded-full">
                      {featuredCourse.category}
                    </span>
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] bg-primary/5 px-3 py-1 rounded-full">
                      {featuredCourse.access}
                    </span>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black text-ink mb-8 leading-tight font-serif group-hover:text-primary transition-colors">{featuredCourse.title}</h2>
                  <p className="text-slate text-xl mb-12 leading-relaxed opacity-70 font-medium">{featuredCourse.description}</p>

                  <div className="grid grid-cols-2 gap-8 mb-12">
                    <div className="flex items-center gap-4 text-sm font-bold text-slate">
                      <div className="w-14 h-14 rounded-[20px] bg-paper flex items-center justify-center shadow-sm border border-gray-50">
                        <Clock className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-widest opacity-40">Duration</span>
                        <span>{featuredCourse.duration}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm font-bold text-slate">
                      <div className="w-14 h-14 rounded-[20px] bg-paper flex items-center justify-center shadow-sm border border-gray-50">
                        <BarChart3 className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-widest opacity-40">Level</span>
                        <span>{featuredCourse.level}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto flex items-center justify-between pt-10 border-t border-gray-100">
                    <div className="flex items-center gap-3 text-success font-black text-[10px] uppercase tracking-[0.2em]">
                      <Award className="w-6 h-6" /> Certificate Included
                    </div>
                    <button
                      onClick={() => setView('preview')}
                      className="bg-primary hover:bg-primary/90 text-white font-black py-6 px-12 rounded-[24px] shadow-2xl shadow-primary/20 transition-all flex items-center gap-4 uppercase tracking-[0.2em] text-xs group/btn"
                    >
                      Explore Course
                      <ChevronRight className="w-5 h-5 transition-transform group-hover/btn:translate-x-2" />
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {/* Course Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {regularCourses.map((course, idx) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -10 }}
                className="bg-white rounded-[40px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all group flex flex-col"
              >
                <div className="h-64 relative overflow-hidden">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => { (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${course.id}/800/600`; }}
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute top-6 left-6 flex flex-col gap-2">
                    <span className={cn(
                      "text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full backdrop-blur-md shadow-lg",
                      course.status === 'Available' ? "bg-success/90 text-white" : "bg-warning/90 text-white"
                    )}>
                      {course.status}
                    </span>
                    <span className="text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full bg-white/90 text-ink backdrop-blur-md shadow-lg">
                      {course.access}
                    </span>
                  </div>
                </div>
                <div className="p-10 flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{course.category}</span>
                    <span className="text-[8px] font-black text-slate/20 uppercase tracking-[0.2em]">{course.lessons} Modules</span>
                  </div>
                  <h4 className="text-2xl font-black text-ink mb-4 font-serif group-hover:text-primary transition-colors line-clamp-2 min-h-[4rem] leading-tight">
                    {course.title}
                  </h4>
                  <p className="text-slate text-sm font-medium opacity-60 line-clamp-2 mb-8 leading-relaxed">
                    {course.description}
                  </p>

                  <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5 text-[10px] font-black text-slate/40 uppercase tracking-widest">
                        <Clock className="w-3.5 h-3.5 opacity-40" /> {course.duration}
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] font-black text-slate/40 uppercase tracking-widest">
                        <Users className="w-3.5 h-3.5 opacity-40" /> {course.audience}
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </div>

                  {course.certificate && (
                    <div className="flex items-center gap-2 text-[8px] font-black text-success uppercase tracking-widest mb-8">
                      <Award className="w-3 h-3" /> Certificate Included
                    </div>
                  )}

                  <button
                    onClick={() => {
                      if (course.id === 'hrba-practice') {
                        setView('preview');
                      }
                    }}
                    className={cn(
                      "w-full py-5 rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3",
                      course.id === 'hrba-practice'
                        ? "bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary/90"
                        : "bg-paper text-slate/40 border border-gray-100 cursor-not-allowed"
                    )}
                  >
                    {course.id === 'hrba-practice' ? 'Learn More' : 'Restricted Access'}
                    {course.id === 'hrba-practice' && <ChevronRight className="w-4 h-4" />}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredCourses.length === 0 && (
            <div className="text-center py-40">
              <div className="w-24 h-24 bg-paper rounded-full flex items-center justify-center mx-auto mb-8">
                <Search className="w-10 h-10 text-slate/20" />
              </div>
              <h3 className="text-2xl font-black text-ink font-serif mb-4">No courses found</h3>
              <p className="text-slate font-medium opacity-60">Try adjusting your filters or search query.</p>
              <button
                onClick={() => { setSearchQuery(''); setCategoryFilter('All'); setAccessFilter('All'); }}
                className="mt-8 text-primary font-black uppercase tracking-widest text-xs hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };


  const PreviewView = () => (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="relative h-[60vh] min-h-[500px] overflow-hidden">
        <img
          src="https://picsum.photos/seed/ethiopia-landscape/1920/1080"
          className="w-full h-full object-cover brightness-[0.4]"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <div className="max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 inline-flex items-center gap-3 px-6 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-white text-xs font-black uppercase tracking-[0.3em]"
            >
              <Star className="w-4 h-4 text-primary" /> Premium E-Learning
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-7xl font-black text-white mb-10 leading-[1.1] font-serif"
            >
              {courseData.title}
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-6"
            >
              <button
                onClick={() => setView('welcome')}
                className="bg-success hover:bg-success/90 text-white font-black py-6 px-16 rounded-[24px] shadow-2xl shadow-success/30 transition-all text-lg uppercase tracking-[0.2em]"
              >
                Start Learning
              </button>
              <div className="flex items-center gap-8 text-white/80 font-bold text-sm uppercase tracking-widest">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" /> {courseData.duration}
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" /> {courseData.lessons.length} Lessons
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        <button
          onClick={() => setView('catalog')}
          className="absolute top-8 left-8 p-4 bg-white/10 hover:bg-white/20 backdrop-blur-xl rounded-2xl text-white transition-all border border-white/10 group"
        >
          <ArrowLeft className="w-6 h-6 transition-transform group-hover:-translate-x-1" />
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-20 grid grid-cols-1 lg:grid-cols-3 gap-20">
        <div className="lg:col-span-2 space-y-20">
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Info className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-3xl font-bold text-ink font-serif">Course Overview</h2>
            </div>
            <p className="text-slate text-xl leading-relaxed font-medium opacity-80">{courseData.description}</p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-3xl font-bold text-ink font-serif">Course Includes</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {courseData.includes.map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-4 bg-paper rounded-2xl border border-gray-100">
                  <CheckCircle2 className="w-5 h-5 text-success" />
                  <span className="text-slate font-medium">{item}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-2xl bg-success/10 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-success" />
              </div>
              <h2 className="text-3xl font-bold text-ink font-serif">Learning Outcomes</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {courseData.lessons.flatMap(l => l.objectives).slice(0, 6).map((obj, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-start gap-4 p-8 bg-paper rounded-[32px] border border-gray-100 shadow-sm"
                >
                  <div className="w-8 h-8 rounded-full bg-success/10 text-success flex items-center justify-center shrink-0 mt-1">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span className="text-lg text-slate font-medium leading-relaxed">{obj}</span>
                </motion.div>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Menu className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-3xl font-bold text-ink font-serif">Curriculum Outline</h2>
            </div>
            <div className="space-y-4">
              {courseData.lessons.map((lesson, i) => (
                <div key={lesson.id} className="flex items-center gap-6 p-8 border border-gray-100 rounded-[32px] bg-white shadow-sm hover:shadow-md transition-all group">
                  <div className="w-14 h-14 rounded-2xl bg-gray-50 text-slate flex items-center justify-center font-black text-xl shrink-0 transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-ink text-xl font-serif mb-1">{lesson.title}</h4>
                    <p className="text-slate/60 text-sm font-medium line-clamp-1">{lesson.purpose}</p>
                  </div>
                  <ChevronRight className="w-6 h-6 text-gray-200 group-hover:text-primary transition-colors" />
                </div>
              ))}
              <div className="flex items-center gap-6 p-8 border border-dashed border-gray-200 rounded-[32px] bg-gray-50/50 opacity-60">
                <div className="w-14 h-14 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center shrink-0">
                  <Award className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-400 text-xl font-serif">Final Assessment & Certification</h4>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <div className="p-10 bg-paper rounded-[40px] border border-gray-100 sticky top-12 shadow-inner">
            <h3 className="text-xs font-black text-slate uppercase tracking-[0.3em] mb-8">Course Details</h3>
            <ul className="space-y-6">
              <li className="flex items-center gap-4 text-slate font-bold">
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-widest opacity-50">Duration</span>
                  <span>{courseData.duration}</span>
                </div>
              </li>
              <li className="flex items-center gap-4 text-slate font-bold">
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-widest opacity-50">Lessons</span>
                  <span>{courseData.lessons.length} Modules</span>
                </div>
              </li>
              <li className="flex items-center gap-4 text-slate font-bold">
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                  <BarChart3 className="w-6 h-6 text-primary" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-widest opacity-50">Skill Level</span>
                  <span>{courseData.level}</span>
                </div>
              </li>
              <li className="flex items-center gap-4 text-slate font-bold">
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-widest opacity-50">Audience</span>
                  <span className="text-xs">{courseData.audience}</span>
                </div>
              </li>
              <li className="flex items-center gap-4 text-slate font-bold">
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                  <Globe className="w-6 h-6 text-primary" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-widest opacity-50">Language</span>
                  <span>{courseData.language}</span>
                </div>
              </li>
            </ul>
            <div className="mt-10 pt-10 border-t border-gray-100">
              <p className="text-sm text-slate/60 italic leading-relaxed mb-8">
                Complete all modules and the final assessment to earn your official DEC-HRBA certificate.
              </p>
              <button
                onClick={() => setView('welcome')}
                className="w-full bg-primary text-white font-black py-6 rounded-[24px] shadow-2xl shadow-primary/20 hover:bg-primary/90 transition-all uppercase tracking-widest text-xs"
              >
                Enroll in Course
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const WelcomeView = () => (
    <div className="min-h-screen bg-paper flex flex-col">
      <div className="max-w-5xl mx-auto px-10 py-24 flex-1">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => setWelcomeVideoViewed(true)}
          className="mb-20 rounded-[56px] overflow-hidden shadow-2xl aspect-video bg-ink relative group cursor-pointer"
        >
          <img
            src="https://picsum.photos/seed/intro/1280/720"
            className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className={cn(
                "w-32 h-32 rounded-full backdrop-blur-2xl flex items-center justify-center border shadow-2xl transition-all duration-500",
                welcomeVideoViewed ? "bg-success/20 border-success/30" : "bg-white/10 border-white/30"
              )}
            >
              {welcomeVideoViewed ? (
                <CheckCircle2 className="w-16 h-16 text-success" />
              ) : (
                <PlayCircle className="w-16 h-16 text-white" />
              )}
            </motion.div>
          </div>
          <div className="absolute bottom-12 left-12 right-12">
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-4 block">Orientation Module</span>
            <p className="text-white font-black text-5xl font-serif leading-tight">Welcome to <br />HRBA in Practice</p>
          </div>
          {welcomeVideoViewed && (
            <div className="absolute top-12 right-12 bg-success text-white px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl">
              Video Viewed
            </div>
          )}
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-1 bg-primary rounded-full" />
            <h2 className="text-4xl font-black text-ink font-serif">Your Learning Journey</h2>
          </div>
          <p className="text-2xl text-slate mb-16 leading-relaxed opacity-80 font-medium">
            This course is practical, Ethiopia-focused, and designed for real CSO programming decisions. You'll move from theory to direct application.
          </p>

          <div className="bg-white p-12 rounded-[48px] border border-gray-100 mb-20 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px]" />
            <h4 className="font-black text-primary mb-12 uppercase tracking-[0.3em] text-xs">Course Roadmap:</h4>
            <div className="space-y-8">
              {[
                'Master the core concepts of HRBA',
                'Explore the 5 working principles in depth',
                'Apply HRBA across the full project cycle',
                'Work through a realistic Ethiopian scenario',
                'Validate your knowledge in the final test'
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-8 group">
                  <div className="w-12 h-12 rounded-[18px] bg-paper text-primary flex items-center justify-center text-lg font-black shadow-sm group-hover:bg-primary group-hover:text-white group-hover:scale-110 transition-all duration-300">
                    {i + 1}
                  </div>
                  <span className="text-xl text-slate font-bold group-hover:text-ink transition-colors">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center gap-8">
            {!welcomeVideoViewed && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 text-amber-600 bg-amber-50 px-8 py-4 rounded-full text-sm font-bold border border-amber-100 shadow-sm"
              >
                <Info className="w-5 h-5" /> Please watch the orientation video to begin.
              </motion.div>
            )}
            <button
              onClick={() => setView('lesson')}
              disabled={!welcomeVideoViewed}
              className={cn(
                "w-full py-8 rounded-[32px] shadow-2xl transition-all text-xl uppercase tracking-[0.3em] font-black",
                welcomeVideoViewed ? "bg-primary text-white shadow-primary/20 hover:bg-primary/90" : "bg-gray-100 text-gray-400 cursor-not-allowed"
              )}
            >
              Begin First Lesson
            </button>
            <div className="flex items-center gap-3 text-slate/40">
              <Info className="w-4 h-4" />
              <p className="text-xs font-bold uppercase tracking-widest">
                Progress is saved automatically
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const LessonView = () => {
    const lesson = courseData.lessons[currentLessonIndex];
    const isComplete = isLessonComplete(lesson.id);
    const completed = blockCompletion[lesson.id] || new Set();

    const interactiveBlocks = lesson.blocks
      .map((b, i) => ({
        index: i,
        type: b.type,
        title: (b as any).title || (b as any).heading || (b as any).question || `Activity ${i + 1}`,
        isDone: completed.has(i)
      }))
      .filter(b => ['accordion', 'tabs', 'process', 'flashcards', 'sorting', 'knowledge-check', 'reflection', 'timeline', 'chart'].includes(b.type));

    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100 px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button onClick={() => setIsMenuOpen(true)} className="p-3 hover:bg-gray-50 rounded-2xl lg:hidden transition-colors">
              <Menu className="w-6 h-6 text-slate" />
            </button>
            <div className="hidden md:block">
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-1 block">HRBA in Practice</span>
              <h1 className="text-sm font-bold text-ink font-serif">Lesson {currentLessonIndex + 1}: {lesson.title}</h1>
            </div>
          </div>
          <div className="flex items-center gap-8">
            <div className="hidden md:flex items-center gap-4">
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-black text-slate/40 uppercase tracking-widest">Course Progress</span>
                <span className="text-xs font-black text-ink">{totalProgress}%</span>
              </div>
              <div className="w-32 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${totalProgress}%` }}
                  className="h-full bg-success transition-all duration-1000"
                />
              </div>
            </div>
            <button
              onClick={() => setView('preview')}
              className="text-[10px] font-black text-slate uppercase tracking-widest hover:text-primary transition-colors border border-gray-100 px-4 py-2 rounded-full"
            >
              Exit Course
            </button>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar Desktop */}
          <aside className="hidden lg:block w-96 border-r border-gray-100 overflow-y-auto p-10 bg-paper">
            <div className="mb-10">
              <span className="text-[10px] font-black text-slate/40 uppercase tracking-[0.3em] mb-4 block">Curriculum</span>
              <div className="space-y-3">
                {courseData.lessons.map((l, i) => {
                  const isLocked = i > 0 && !completedLessons.has(courseData.lessons[i - 1].id);
                  const isActive = i === currentLessonIndex;
                  const isDone = completedLessons.has(l.id);

                  return (
                    <button
                      key={l.id}
                      disabled={isLocked}
                      onClick={() => { setCurrentLessonIndex(i); setIsMenuOpen(false); const mainContent = document.querySelector('main'); if (mainContent) mainContent.scrollTop = 0; }}
                      className={cn(
                        "w-full flex items-center gap-4 p-5 rounded-[24px] text-left transition-all group relative",
                        isActive ? "bg-white shadow-xl shadow-primary/5 border border-primary/10" : "hover:bg-white/50",
                        isLocked ? "opacity-30 cursor-not-allowed" : "cursor-pointer"
                      )}
                    >
                      {isActive && <motion.div layoutId="active-pill" className="absolute left-0 w-1 h-6 bg-primary rounded-r-full" />}
                      <div className={cn(
                        "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all font-black text-[10px]",
                        isDone ? "bg-success text-white" : isActive ? "bg-primary text-white" : "bg-white border border-gray-100 text-slate"
                      )}>
                        {isDone ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                      </div>
                      <div className="flex flex-col">
                        <span className={cn(
                          "text-sm font-bold transition-colors",
                          isActive ? "text-ink" : "text-slate group-hover:text-primary"
                        )}>
                          {l.title}
                        </span>
                        {isLocked && <span className="text-[10px] uppercase tracking-widest opacity-50 mt-1">Locked</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-8 border-t border-gray-100 space-y-3">
              <span className="text-[10px] font-black text-slate/40 uppercase tracking-[0.3em] mb-4 block">Resources</span>
              <button
                disabled={!completedLessons.has(courseData.lessons[courseData.lessons.length - 1].id)}
                onClick={() => setView('test-intro')}
                className="w-full flex items-center gap-4 p-5 rounded-[24px] text-left hover:bg-white/50 disabled:opacity-30 transition-all group"
              >
                <div className="w-8 h-8 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-slate group-hover:text-primary transition-colors">
                  <Award className="w-4 h-4" />
                </div>
                <span className="text-sm font-bold text-slate group-hover:text-primary transition-colors">Final Assessment</span>
              </button>
              <button onClick={() => setView('resources')} className="w-full flex items-center gap-4 p-5 rounded-[24px] text-left hover:bg-white/50 transition-all group">
                <div className="w-8 h-8 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-slate group-hover:text-primary transition-colors">
                  <FileText className="w-4 h-4" />
                </div>
                <span className="text-sm font-bold text-slate group-hover:text-primary transition-colors">Resource Library</span>
              </button>
              <button onClick={() => setView('glossary')} className="w-full flex items-center gap-4 p-5 rounded-[24px] text-left hover:bg-white/50 transition-all group">
                <div className="w-8 h-8 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-slate group-hover:text-primary transition-colors">
                  <Search className="w-4 h-4" />
                </div>
                <span className="text-sm font-bold text-slate group-hover:text-primary transition-colors">Glossary</span>
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto bg-white scroll-smooth">
            <div className="max-w-4xl mx-auto px-8 py-20">
              <motion.div
                key={currentLessonIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-16"
              >
                <span className="text-xs font-black text-primary uppercase tracking-[0.3em] mb-4 block">Module {currentLessonIndex + 1}</span>
                <h2 className="text-4xl md:text-5xl font-black text-ink mb-10 font-serif leading-tight">{lesson.title}</h2>

                <div className="p-10 bg-paper rounded-[40px] border border-gray-100 mb-16 shadow-inner">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <Star className="w-6 h-6 text-primary" />
                    </div>
                    <h4 className="text-xs font-black text-slate uppercase tracking-[0.2em]">Learning Objectives</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {lesson.objectives.map((obj, i) => (
                      <div key={i} className="flex items-start gap-4">
                        <div className="mt-2 w-2 h-2 rounded-full bg-success shrink-0" />
                        <p className="text-lg text-slate font-medium leading-relaxed">{obj}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              <div className="space-y-16">
                {lesson.blocks.map((block, i) => {
                  const props: any = { ...block, onComplete: () => markBlockComplete(lesson.id, i) };
                  const isInteractive = ['accordion', 'tabs', 'process', 'flashcards', 'sorting', 'knowledge-check', 'reflection', 'timeline', 'chart'].includes(block.type);
                  const isDone = completed.has(i);

                  return (
                    <motion.div
                      key={`${currentLessonIndex}-${i}`}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ delay: i * 0.1 }}
                      className="relative"
                    >
                      {isInteractive && isDone && (
                        <div className="absolute -top-4 -right-4 z-10 bg-success text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-2 animate-in fade-in zoom-in duration-500">
                          <CheckCircle2 className="w-3 h-3" /> Activity Completed
                        </div>
                      )}
                      {(() => {
                        switch (block.type) {
                          case 'text': return <Blocks.TextBlock heading={props.heading} content={props.content} />;
                          case 'statement': return <Blocks.StatementBlock content={props.content} />;
                          case 'quote': return <Blocks.QuoteBlock content={props.content} attribution={props.attribution} />;
                          case 'list': return <Blocks.ListBlock title={props.title} items={props.items} />;
                          case 'two-column': return <Blocks.TwoColumnBlock {...props} />;
                          case 'table': return <Blocks.TableBlock {...props} />;
                          case 'accordion': return <Blocks.AccordionBlock {...props} />;
                          case 'tabs': return <Blocks.TabsBlock {...props} />;
                          case 'process': return <Blocks.ProcessBlock {...props} />;
                          case 'flashcards': return <Blocks.FlashcardsBlock {...props} />;
                          case 'sorting': return <Blocks.SortingBlock {...props} />;
                          case 'timeline': return <Blocks.TimelineBlock {...props} />;
                          case 'chart': return <Blocks.ChartBlock {...props} />;
                          case 'knowledge-check': return <Blocks.KnowledgeCheckBlock {...props} />;
                          case 'reflection': return <Blocks.ReflectionBlock {...props} />;
                          case 'image': return <Blocks.ImageBlock {...props} />;
                          default: return null;
                        }
                      })()}
                    </motion.div>
                  );
                })}
              </div>

              <div className="mt-32 pt-16 border-t border-gray-100 flex flex-col items-center gap-10">
                {!isComplete && (
                  <div className="w-full max-w-2xl bg-amber-50 border border-amber-100 rounded-[40px] p-10 shadow-sm">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center">
                        <Info className="w-6 h-6" />
                      </div>
                      <h4 className="text-lg font-black text-amber-900 uppercase tracking-widest">Remaining Tasks:</h4>
                    </div>
                    <div className="grid gap-4">
                      {interactiveBlocks.map((b) => (
                        <div key={b.index} className="flex items-center gap-4 p-4 bg-white/50 rounded-2xl border border-amber-200/50">
                          <div className={cn(
                            "w-6 h-6 rounded-full flex items-center justify-center transition-all",
                            b.isDone ? "bg-success text-white" : "bg-amber-100 text-amber-400"
                          )}>
                            {b.isDone ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-2 h-2 rounded-full bg-amber-200" />}
                          </div>
                          <span className={cn(
                            "text-sm font-bold transition-colors",
                            b.isDone ? "text-slate/40 line-through" : "text-amber-900"
                          )}>
                            {b.title}
                          </span>
                        </div>
                      ))}
                    </div>
                    <p className="mt-8 text-center text-amber-600 text-sm font-bold italic">
                      Please complete all interactive activities above to unlock the next module.
                    </p>
                  </div>
                )}
                <button
                  disabled={!isComplete}
                  onClick={() => {
                    setCompletedLessons(new Set(completedLessons).add(lesson.id));
                    if (currentLessonIndex < courseData.lessons.length - 1) {
                      setCurrentLessonIndex(currentLessonIndex + 1);
                      const mainContent = document.querySelector('main');
                      if (mainContent) mainContent.scrollTop = 0;
                    } else {
                      setView('test-intro');
                    }
                  }}
                  className={cn(
                    "w-full max-w-md py-6 rounded-[24px] font-black text-lg shadow-2xl transition-all flex items-center justify-center gap-4 uppercase tracking-[0.2em]",
                    isComplete ? "bg-primary text-white hover:bg-primary/90 shadow-primary/20" : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  )}
                >
                  {currentLessonIndex < courseData.lessons.length - 1 ? `Next: Lesson ${currentLessonIndex + 2}` : "Proceed to Final Test"}
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </div>
          </main>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-ink/60 backdrop-blur-md lg:hidden"
            >
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                className="w-4/5 max-w-sm h-full bg-white p-10 shadow-2xl overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-12">
                  <h3 className="text-2xl font-bold text-ink font-serif">Course Menu</h3>
                  <button onClick={() => setIsMenuOpen(false)} className="p-3 hover:bg-gray-50 rounded-2xl transition-colors">
                    <X className="w-6 h-6 text-slate" />
                  </button>
                </div>
                <nav className="space-y-4">
                  {courseData.lessons.map((l, i) => {
                    const isLocked = i > 0 && !completedLessons.has(courseData.lessons[i - 1].id);
                    const isActive = i === currentLessonIndex;
                    const isDone = completedLessons.has(l.id);

                    return (
                      <button
                        key={l.id}
                        disabled={isLocked}
                        onClick={() => { setCurrentLessonIndex(i); setIsMenuOpen(false); }}
                        className={cn(
                          "w-full flex items-center gap-4 p-5 rounded-[24px] text-left transition-all",
                          isActive ? "bg-paper border border-primary/10" : "text-slate",
                          isLocked ? "opacity-30" : ""
                        )}
                      >
                        <div className={cn(
                          "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-black text-[10px]",
                          isDone ? "bg-success text-white" : isActive ? "bg-primary text-white" : "bg-gray-100 text-slate"
                        )}>
                          {isDone ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                        </div>
                        <span className="text-sm font-bold">{l.title}</span>
                      </button>
                    );
                  })}
                </nav>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const TestIntroView = () => (
    <div className="min-h-screen bg-paper flex items-center justify-center p-8 md:p-20 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-bl-[400px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-tr-[300px] -z-10" />

      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="max-w-3xl w-full bg-white rounded-[60px] shadow-2xl p-12 md:p-24 text-center border border-gray-100 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-4 bg-primary" />

        <motion.div
          initial={{ rotate: -10, scale: 0.8 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ type: "spring", damping: 12, delay: 0.2 }}
          className="w-32 h-32 bg-primary text-white rounded-[40px] flex items-center justify-center mx-auto mb-12 shadow-2xl shadow-primary/30"
        >
          <Award className="w-16 h-16" />
        </motion.div>

        <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-6 block">Final Milestone</span>
        <h2 className="text-5xl md:text-7xl font-black text-ink mb-8 font-serif leading-tight tracking-tight">Final Assessment</h2>

        <p className="text-xl md:text-2xl text-slate mb-16 leading-relaxed opacity-70 max-w-2xl mx-auto italic font-serif">
          "You have completed all modules. This test evaluates your understanding of HRBA in practice.
          A score of <span className="font-black text-ink not-italic">60% or higher</span> is required to earn your certificate."
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 text-left">
          <div className="p-10 bg-paper rounded-[40px] border border-gray-100 shadow-inner group hover:bg-white hover:shadow-xl transition-all duration-500">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
              <FileText className="w-5 h-5" />
            </div>
            <p className="text-[10px] font-black text-slate/40 uppercase mb-2 tracking-widest">Total Questions</p>
            <p className="text-3xl font-black text-ink">{courseData.finalTest.length} Case Studies</p>
          </div>
          <div className="p-10 bg-paper rounded-[40px] border border-gray-100 shadow-inner group hover:bg-white hover:shadow-xl transition-all duration-500">
            <div className="w-10 h-10 rounded-2xl bg-success/10 flex items-center justify-center mb-6 text-success group-hover:bg-success group-hover:text-white transition-colors">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <p className="text-[10px] font-black text-slate/40 uppercase mb-2 tracking-widest">Target Score</p>
            <p className="text-3xl font-black text-ink">60% Accuracy</p>
          </div>
        </div>

        <div className="flex flex-col gap-8">
          <button
            onClick={() => setView('test')}
            className="w-full bg-primary text-white font-black py-8 rounded-[32px] shadow-2xl shadow-primary/20 hover:bg-primary/90 transition-all text-xl uppercase tracking-[0.3em] flex items-center justify-center gap-4 group"
          >
            Start Final Test
            <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
          </button>
          <button
            onClick={() => setView('lesson')}
            className="text-xs font-black text-slate/40 hover:text-primary transition-colors uppercase tracking-[0.4em] flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" /> Review Modules First
          </button>
        </div>
      </motion.div>
    </div>
  );

  const TestView = () => {
    const [qIndex, setQIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, number>>({});

    const handleAnswer = (val: number) => {
      setAnswers({ ...answers, [courseData.finalTest[qIndex].id]: val });
    };

    const next = () => {
      if (qIndex < courseData.finalTest.length - 1) {
        setQIndex(qIndex + 1);
        window.scrollTo(0, 0);
      } else {
        let correct = 0;
        courseData.finalTest.forEach(q => {
          if (answers[q.id] === q.correctAnswer) correct++;
        });
        const score = Math.round((correct / courseData.finalTest.length) * 100);
        setTestScore(score);
        setView('test-results');
      }
    };

    const q = courseData.finalTest[qIndex];

    return (
      <div className="min-h-screen bg-white flex flex-col">
        <header className="px-10 py-8 border-b border-gray-100 flex items-center justify-between bg-white/80 backdrop-blur-xl sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center">
              <Award className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="font-black text-ink font-serif uppercase tracking-[0.3em] text-[10px]">Final Assessment</h2>
              <p className="text-xs font-bold text-slate/40 mt-1">HRBA Certification</p>
            </div>
          </div>
          <div className="flex items-center gap-8">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-[10px] font-black text-slate/40 uppercase tracking-widest">Progress</span>
              <span className="text-xs font-black text-ink mt-1">{Math.round(((qIndex + 1) / courseData.finalTest.length) * 100)}% Complete</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-black text-slate/40 uppercase tracking-widest">Question {qIndex + 1} of {courseData.finalTest.length}</span>
              <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden mt-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${((qIndex + 1) / courseData.finalTest.length) * 100}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="h-full bg-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.3)]"
                />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center p-8 md:p-20">
          <div className="max-w-4xl w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={qIndex}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="space-y-16"
              >
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.3em]">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    Question 0{qIndex + 1}
                  </div>
                  <h3 className="text-4xl md:text-6xl font-black text-ink leading-[1.1] font-serif tracking-tight">{q.question}</h3>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {q.options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleAnswer(i)}
                      className={cn(
                        "w-full p-8 md:p-10 rounded-[40px] border-2 text-left transition-all flex items-center justify-between group relative overflow-hidden",
                        answers[q.id] === i
                          ? "border-primary bg-primary/5 shadow-2xl shadow-primary/10 scale-[1.02] z-10"
                          : "border-gray-100 hover:border-primary/30 hover:bg-paper/50"
                      )}
                    >
                      <div className="flex items-center gap-8 z-10">
                        <div className={cn(
                          "w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg transition-all",
                          answers[q.id] === i ? "bg-primary text-white" : "bg-paper text-slate group-hover:bg-white"
                        )}>
                          {String.fromCharCode(65 + i)}
                        </div>
                        <span className={cn(
                          "text-xl md:text-2xl font-bold transition-colors leading-relaxed",
                          answers[q.id] === i ? "text-ink" : "text-slate group-hover:text-ink"
                        )}>
                          {opt}
                        </span>
                      </div>
                      <div className={cn(
                        "w-10 h-10 rounded-2xl border-2 flex items-center justify-center transition-all z-10",
                        answers[q.id] === i ? "border-primary bg-primary shadow-lg shadow-primary/30" : "border-gray-100 bg-white opacity-0 group-hover:opacity-100"
                      )}>
                        <CheckCircle2 className={cn("w-6 h-6 transition-colors", answers[q.id] === i ? "text-white" : "text-primary")} />
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="mt-20 flex flex-col md:flex-row justify-between items-center gap-8 border-t border-gray-100 pt-12">
              <div className="flex items-center gap-4 text-slate/40">
                <Info className="w-5 h-5" />
                <p className="text-xs font-bold uppercase tracking-widest">
                  Select the most appropriate rights-based answer.
                </p>
              </div>
              <button
                disabled={answers[q.id] === undefined}
                onClick={next}
                className="w-full md:w-auto bg-primary text-white font-black py-6 px-16 rounded-[28px] shadow-2xl shadow-primary/20 hover:bg-primary/90 transition-all disabled:opacity-30 disabled:shadow-none uppercase tracking-[0.2em] text-lg flex items-center justify-center gap-4"
              >
                {qIndex === courseData.finalTest.length - 1 ? "Submit Assessment" : "Next Question"}
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  };

  const TestResultsView = () => {
    const passed = testScore !== null && testScore >= 60;
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center p-8">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          className="max-w-2xl w-full bg-white rounded-[60px] shadow-2xl p-12 md:p-20 text-center border border-gray-100 relative overflow-hidden"
        >
          <div className={cn(
            "absolute top-0 left-0 w-full h-3",
            passed ? "bg-success" : "bg-error"
          )} />

          <div className="absolute top-0 right-0 w-64 h-64 bg-paper rounded-bl-[200px] -z-10" />

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 12, delay: 0.2 }}
            className={cn(
              "w-32 h-32 rounded-[40px] flex items-center justify-center mx-auto mb-12 shadow-2xl",
              passed ? "bg-success text-white shadow-success/30" : "bg-error text-white shadow-error/30"
            )}
          >
            {passed ? <Award className="w-16 h-16" /> : <XCircle className="w-16 h-16" />}
          </motion.div>

          <h2 className="text-5xl md:text-6xl font-black text-ink mb-6 font-serif tracking-tight leading-tight">
            {passed ? 'Assessment Passed!' : 'Assessment Not Passed'}
          </h2>
          <p className="text-xl md:text-2xl text-slate mb-16 leading-relaxed opacity-80 max-w-lg mx-auto">
            {passed
              ? 'Excellent work! You have demonstrated a strong understanding of HRBA principles and their application.'
              : 'You did not reach the passing score this time. We recommend reviewing the modules before retrying.'}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="bg-paper rounded-[48px] p-12 border border-gray-100 shadow-inner relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/50 rounded-bl-full -z-10" />
              <p className="text-[10px] font-black text-slate/40 uppercase mb-4 tracking-[0.3em]">Your Final Score</p>
              <div className="flex items-baseline justify-center gap-2">
                <p className={cn("text-8xl font-black font-serif transition-transform group-hover:scale-110 duration-500", passed ? "text-success" : "text-error")}>{testScore}</p>
                <span className="text-2xl font-black text-slate/20">%</span>
              </div>
            </div>

            <div className="bg-paper rounded-[48px] p-12 border border-gray-100 shadow-inner flex flex-col justify-center">
              <p className="text-[10px] font-black text-slate/40 uppercase mb-6 tracking-[0.3em]">Result Summary</p>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-slate">Target Score</span>
                  <span className="text-sm font-black text-ink">60%</span>
                </div>
                <div className="h-2 bg-white rounded-full overflow-hidden">
                  <div className="h-full bg-success w-[60%]" />
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-sm font-bold text-slate">Status</span>
                  <span className={cn("px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest", passed ? "bg-success/10 text-success" : "bg-error/10 text-error")}>
                    {passed ? 'Certified' : 'Incomplete'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            {passed ? (
              <button
                onClick={() => setView('feedback')}
                className="flex-1 bg-success text-white font-black py-7 rounded-[28px] shadow-2xl shadow-success/20 hover:bg-success/90 transition-all text-xl uppercase tracking-[0.2em] flex items-center justify-center gap-4"
              >
                Continue to Feedback
                <ChevronRight className="w-6 h-6" />
              </button>
            ) : (
              <button
                onClick={() => setView('test')}
                className="flex-1 bg-primary text-white font-black py-7 rounded-[28px] shadow-2xl shadow-primary/20 hover:bg-primary/90 transition-all text-xl uppercase tracking-[0.2em] flex items-center justify-center gap-4"
              >
                Retry Assessment
                <RotateCcw className="w-6 h-6" />
              </button>
            )}
            <button
              onClick={() => setView('lesson')}
              className="px-10 py-7 text-xs font-black text-slate/40 hover:text-primary transition-colors uppercase tracking-widest"
            >
              Review Modules
            </button>
          </div>
        </motion.div>
      </div>
    );
  };

  const FeedbackView = () => {
    const [responses, setResponses] = useState<Record<string, any>>({});

    const handleSubmit = () => {
      setFeedbackSubmitted(true);
      setView('completion');
    };

    const isFormValid = courseData.feedbackQuestions.every(q => {
      if (q.type === 'open') return true; // Optional
      return responses[q.id] !== undefined;
    });

    return (
      <div className="min-h-screen bg-white flex flex-col">
        <header className="px-10 py-16 md:py-24 border-b border-gray-100 text-center bg-paper relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-bl-[300px] -z-10" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-tr-[200px] -z-10" />

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-6 block">Final Step</span>
            <h2 className="text-5xl md:text-7xl font-black text-ink font-serif leading-tight tracking-tight">Course Feedback</h2>
            <p className="text-xl md:text-2xl text-slate mt-8 max-w-2xl mx-auto opacity-70 leading-relaxed italic">
              Your insights help us refine the HRBA learning experience for Ethiopian CSOs. Thank you for your time.
            </p>
          </motion.div>
        </header>

        <main className="flex-1 max-w-4xl mx-auto px-8 py-24 w-full">
          <div className="space-y-32">
            {courseData.feedbackQuestions.map((q, idx) => (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className="space-y-12 relative"
              >
                <div className="absolute -left-12 top-0 text-6xl font-black text-paper select-none -z-10">
                  0{idx + 1}
                </div>
                <h4 className="text-3xl md:text-4xl font-black text-ink leading-tight font-serif tracking-tight">{q.text}</h4>

                {q.type === 'likert' && (
                  <div className="flex flex-wrap justify-between gap-4">
                    {[1, 2, 3, 4, 5].map((val) => (
                      <button
                        key={val}
                        onClick={() => setResponses({ ...responses, [q.id]: val })}
                        className={cn(
                          "flex-1 min-w-[60px] py-8 rounded-[32px] border-2 font-black transition-all text-2xl relative group overflow-hidden",
                          responses[q.id] === val
                            ? "bg-primary text-white border-primary shadow-2xl shadow-primary/20 scale-110 z-10"
                            : "bg-white text-slate/30 border-gray-100 hover:border-primary/30 hover:text-primary"
                        )}
                      >
                        <span className="relative z-10">{val}</span>
                        {responses[q.id] === val && (
                          <motion.div
                            layoutId={`likert-bg-${q.id}`}
                            className="absolute inset-0 bg-primary -z-0"
                          />
                        )}
                      </button>
                    ))}
                    <div className="w-full flex justify-between px-2 mt-4 text-[10px] font-black text-slate/40 uppercase tracking-widest">
                      <span>Strongly Disagree</span>
                      <span>Strongly Agree</span>
                    </div>
                  </div>
                )}

                {q.type === 'multiple-choice' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {q.options?.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setResponses({ ...responses, [q.id]: opt })}
                        className={cn(
                          "p-8 rounded-[32px] border-2 text-left font-bold transition-all text-xl flex items-center justify-between group",
                          responses[q.id] === opt
                            ? "bg-primary/5 border-primary text-ink shadow-2xl shadow-primary/5 scale-[1.02] z-10"
                            : "bg-white border-gray-100 hover:border-primary/20 text-slate"
                        )}
                      >
                        <span className="flex-1 leading-relaxed">{opt}</span>
                        <div className={cn(
                          "w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all shrink-0 ml-4",
                          responses[q.id] === opt ? "bg-primary border-primary shadow-lg shadow-primary/20" : "bg-paper border-gray-100"
                        )}>
                          {responses[q.id] === opt && <CheckCircle2 className="w-5 h-5 text-white" />}
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {q.type === 'open' && (
                  <div className="relative group">
                    <textarea
                      onChange={(e) => setResponses({ ...responses, [q.id]: e.target.value })}
                      className="w-full p-10 h-64 rounded-[48px] border-2 border-gray-100 focus:ring-8 focus:ring-primary/5 focus:border-primary outline-none text-xl text-ink transition-all bg-paper/20 font-serif leading-relaxed"
                      placeholder="Share your detailed thoughts here..."
                    />
                    <div className="absolute bottom-8 right-10 text-[10px] font-black text-slate/20 uppercase tracking-widest">
                      Optional Reflection
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          <div className="mt-48 pt-20 border-t border-gray-100 flex flex-col items-center gap-8">
            <div className="text-center space-y-2">
              <p className="text-xs font-black text-slate/40 uppercase tracking-widest">Ready to finish?</p>
              <p className="text-sm text-slate italic opacity-60">Your certificate will be generated upon submission.</p>
            </div>
            <button
              onClick={handleSubmit}
              disabled={!isFormValid}
              className="w-full max-w-md bg-primary text-white font-black py-7 rounded-[28px] shadow-2xl shadow-primary/20 hover:bg-primary/90 transition-all text-xl uppercase tracking-[0.2em] flex items-center justify-center gap-4 disabled:opacity-30 disabled:shadow-none"
            >
              Submit & Complete
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </main>
      </div>
    );
  };
  const CompletionView = () => (
    <div className="min-h-screen bg-paper flex flex-col items-center justify-center p-8 md:p-20">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="max-w-5xl w-full bg-white rounded-[60px] shadow-2xl p-12 md:p-24 text-center border border-gray-100 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-4 bg-success" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-success/5 rounded-bl-[300px] -z-10" />

        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", damping: 12, delay: 0.3 }}
          className="w-40 h-40 bg-success text-white rounded-[48px] flex items-center justify-center mx-auto mb-12 shadow-2xl shadow-success/30"
        >
          <Award className="w-20 h-20" />
        </motion.div>

        <h2 className="text-6xl md:text-8xl font-black text-ink mb-8 font-serif tracking-tight leading-tight">{courseData.certificateText.title}</h2>
        <p className="text-2xl md:text-3xl text-slate mb-20 opacity-70 max-w-3xl mx-auto leading-relaxed italic">"{courseData.certificateText.body}"</p>

        <div className="bg-paper rounded-[60px] p-12 md:p-20 border border-gray-100 mb-20 text-left flex flex-col lg:flex-row items-center gap-20 shadow-inner relative group">
          <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-10 transition-opacity">
            <Award className="w-64 h-64" />
          </div>

          <div className="w-full lg:w-80 h-[420px] bg-white shadow-2xl border border-gray-100 rounded-3xl flex items-center justify-center p-10 relative group cursor-pointer overflow-hidden transition-transform hover:scale-105 duration-500">
            <div className="absolute inset-6 border-4 border-primary/5 rounded-2xl" />
            <div className="text-center z-10">
              <div className="w-20 h-20 bg-primary/5 text-primary rounded-3xl flex items-center justify-center mx-auto mb-8">
                <Award className="w-10 h-10" />
              </div>
              <p className="text-[10px] font-black text-slate/40 uppercase tracking-[0.4em] mb-4">Certificate of Mastery</p>
              <p className="text-lg font-black text-ink leading-tight mb-8 font-serif">{courseData.title}</p>
              <div className="w-32 h-0.5 bg-gray-100 mx-auto mb-6" />
              <p className="text-[10px] text-slate/40 font-bold uppercase tracking-[0.3em]">Certified Practitioner</p>
            </div>
            <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors rounded-3xl flex items-center justify-center opacity-0 group-hover:opacity-100">
              <Search className="w-10 h-10 text-primary" />
            </div>
          </div>

          <div className="flex-1 space-y-12 w-full">
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-slate/40 uppercase tracking-[0.4em]">Credential Details</h4>
              <p className="text-3xl md:text-4xl font-black text-ink font-serif leading-tight">{courseData.certificateText.title} in HRBA</p>
              <p className="text-lg text-slate font-medium opacity-60">{courseData.title}</p>
            </div>

            <div className="grid grid-cols-2 gap-12">
              <div className="space-y-3">
                <h4 className="text-[10px] font-black text-slate/40 uppercase tracking-[0.4em]">Issue Date</h4>
                <p className="text-xl font-black text-ink">{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
              <div className="space-y-3">
                <h4 className="text-[10px] font-black text-slate/40 uppercase tracking-[0.4em]">Authorized By</h4>
                <p className="text-xl font-black text-ink leading-tight">{courseData.certificateText.footer}</p>
              </div>
            </div>

            <div className="pt-8">
              <button className="w-full md:w-auto flex items-center justify-center gap-4 bg-success text-white font-black py-6 px-12 rounded-[28px] shadow-2xl shadow-success/20 hover:bg-success/90 transition-all uppercase tracking-[0.2em] text-lg group">
                <Download className="w-6 h-6 group-hover:translate-y-1 transition-transform" />
                Download Certificate
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button onClick={() => setView('lesson')} className="p-8 bg-paper rounded-[32px] font-black text-slate hover:bg-white hover:shadow-xl hover:shadow-primary/5 transition-all text-xs uppercase tracking-[0.3em] border border-gray-100">
            Review Modules
          </button>
          <button onClick={() => setView('catalog')} className="p-8 bg-paper rounded-[32px] font-black text-slate hover:bg-white hover:shadow-xl hover:shadow-primary/5 transition-all text-xs uppercase tracking-[0.3em] border border-gray-100">
            Return to Catalog
          </button>
          <button onClick={() => setView('resources')} className="p-8 bg-paper rounded-[32px] font-black text-slate hover:bg-white hover:shadow-xl hover:shadow-primary/5 transition-all text-xs uppercase tracking-[0.3em] border border-gray-100">
            Resource Library
          </button>
        </div>
      </motion.div>
    </div>
  );

  const GlossaryView = () => (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="px-10 py-12 border-b border-gray-100 flex flex-col md:flex-row items-center justify-between bg-paper gap-8">
        <div className="flex items-center gap-6">
          <button onClick={() => setView('lesson')} className="p-4 hover:bg-white rounded-2xl transition-all shadow-sm border border-gray-100">
            <ArrowLeft className="w-6 h-6 text-slate" />
          </button>
          <div>
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-2 block">Reference</span>
            <h2 className="text-4xl font-black text-ink font-serif">Glossary</h2>
          </div>
        </div>
        <div className="relative w-full max-w-md">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate/40" />
          <input
            type="text"
            placeholder="Search HRBA terms..."
            value={glossarySearch}
            onChange={(e) => setGlossarySearch(e.target.value)}
            className="w-full pl-16 pr-8 py-5 bg-white rounded-[24px] border-none focus:ring-4 focus:ring-primary/10 outline-none text-lg shadow-sm"
          />
        </div>
      </header>
      <main className="flex-1 max-w-6xl mx-auto px-10 py-20 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courseData.glossary
            .filter(t => t.term.toLowerCase().includes(glossarySearch.toLowerCase()))
            .map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.02 }}
                className="p-8 bg-paper rounded-[32px] border border-gray-100 hover:shadow-xl hover:shadow-primary/5 transition-all group"
              >
                <h4 className="text-xl font-black text-primary mb-4 font-serif group-hover:scale-105 transition-transform origin-left">{item.term}</h4>
                <p className="text-lg text-slate leading-relaxed opacity-80">{item.definition}</p>
              </motion.div>
            ))}
        </div>
      </main>
    </div>
  );

  const ResourcesView = () => (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="px-10 py-12 border-b border-gray-100 flex items-center justify-between bg-paper">
        <div className="flex items-center gap-6">
          <button onClick={() => setView('lesson')} className="p-4 hover:bg-white rounded-2xl transition-all shadow-sm border border-gray-100">
            <ArrowLeft className="w-6 h-6 text-slate" />
          </button>
          <div>
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-2 block">Library</span>
            <h2 className="text-4xl font-black text-ink font-serif">Resources</h2>
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-4xl mx-auto px-10 py-20 w-full">
        <div className="space-y-6">
          {courseData.resources.map((res, i) => (
            <motion.div
              key={res.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center justify-between p-8 bg-white border border-gray-100 rounded-[32px] shadow-sm hover:shadow-2xl hover:shadow-primary/5 transition-all group"
            >
              <div className="flex items-center gap-8">
                <div className="w-16 h-16 bg-primary/5 text-primary rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FileText className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-ink font-serif">{res.title}</h4>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-[10px] font-black text-slate/40 uppercase tracking-widest">{res.type}</span>
                    <div className="w-1 h-1 rounded-full bg-gray-200" />
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest">Download Ready</span>
                  </div>
                </div>
              </div>
              <button className="w-14 h-14 bg-paper text-slate/40 rounded-2xl flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm">
                <Download className="w-6 h-6" />
              </button>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );

  const StaffSignInView = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSignIn = (e: React.FormEvent) => {
      e.preventDefault();
      if (email === 'staff@dec.local' && password === 'admin123') {
        const user: UserProfile = { email, name: 'Admin User', role: 'content_admin' };
        setCurrentUser(user);
        localStorage.setItem('dec_user', JSON.stringify(user));
        setView('staff-workspace');
      } else {
        setError('Invalid credentials. Please try again.');
      }
    };

    return (
      <div className="min-h-screen bg-paper flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white rounded-[40px] shadow-2xl p-12 border border-gray-100"
        >
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-xl shadow-primary/20 mb-6">
              <ShieldCheck className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-black text-ink font-serif">Staff Sign In</h2>
            <p className="text-slate/60 text-sm mt-2">DEC Staff / Course Creator Workspace</p>
          </div>

          <form onSubmit={handleSignIn} className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-slate uppercase tracking-widest mb-2 ml-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="staff@dec.local"
                className="w-full px-6 py-4 bg-paper rounded-2xl border border-gray-100 focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none text-sm font-bold"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate uppercase tracking-widest mb-2 ml-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-6 py-4 bg-paper rounded-2xl border border-gray-100 focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none text-sm font-bold"
                required
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold border border-red-100"
              >
                <XCircle className="w-4 h-4 shrink-0" />
                {error}
              </motion.div>
            )}

            <div className="flex items-center justify-between px-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
                <span className="text-xs font-bold text-slate group-hover:text-ink transition-colors">Remember me</span>
              </label>
              <button type="button" className="text-xs font-bold text-primary hover:underline">Forgot password?</button>
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-white font-black py-5 rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all text-sm uppercase tracking-widest mt-4"
            >
              Sign In to Workspace
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-gray-100">
            <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100 flex items-start gap-3">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="flex flex-col">
                <p className="text-[10px] font-black text-amber-900 uppercase tracking-widest mb-1">Staff Access Only</p>
                <p className="text-[10px] text-amber-700 leading-relaxed font-medium">Use simulated credentials: <br /><span className="font-bold">staff@dec.local / admin123</span></p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  };

  const MemberSignInView = () => {
    const [email, setEmail] = useState('');

    const handleSignIn = (e: React.FormEvent) => {
      e.preventDefault();
      const user: UserProfile = { email, name: 'Learner User', role: 'member' };
      setCurrentUser(user);
      localStorage.setItem('dec_user', JSON.stringify(user));
      setView('landing');
    };

    return (
      <div className="min-h-screen bg-paper flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white rounded-[40px] shadow-2xl p-12 border border-gray-100"
        >
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center shadow-xl shadow-accent/20 mb-6">
              <User className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-black text-ink font-serif">Member Sign In</h2>
            <p className="text-slate/60 text-sm mt-2">Access your learning dashboard</p>
          </div>

          <form onSubmit={handleSignIn} className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-slate uppercase tracking-widest mb-2 ml-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="learner@example.com"
                className="w-full px-6 py-4 bg-paper rounded-2xl border border-gray-100 focus:border-accent focus:ring-4 focus:ring-accent/5 transition-all outline-none text-sm font-bold"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate uppercase tracking-widest mb-2 ml-1">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-6 py-4 bg-paper rounded-2xl border border-gray-100 focus:border-accent focus:ring-4 focus:ring-accent/5 transition-all outline-none text-sm font-bold"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-accent text-white font-black py-5 rounded-2xl shadow-xl shadow-accent/20 hover:bg-accent/90 transition-all text-sm uppercase tracking-widest mt-4"
            >
              Sign In
            </button>
          </form>

          <button
            onClick={() => setView('landing')}
            className="w-full mt-6 text-xs font-black text-slate/40 hover:text-ink transition-colors uppercase tracking-widest"
          >
            Back to Home
          </button>
        </motion.div>
      </div>
    );
  };

  const StaffWorkspaceView = () => {
    // Protection
    if (!currentUser || currentUser.role === 'member') {
      setView('staff-sign-in');
      return null;
    }

    const sidebarLinks = [
      { name: 'Dashboard', icon: LayoutDashboard, id: 'dashboard' },
      { name: 'Modules', icon: BookOpen, id: 'modules' },
      { name: 'Analytics', icon: BarChart3, id: 'analytics' },
      { name: 'Feedback Triage', icon: MessageSquare, id: 'feedback-triage' },
      { name: 'Review Queue', icon: Clock, id: 'review-queue' },
      { name: 'Media Library', icon: Library, id: 'media-library' },
      { name: 'Assessments', icon: CheckSquare, id: 'assessment-builder' },
      { name: 'Feedback', icon: MessageSquare, id: 'feedback-builder' },
      { name: 'Users', icon: Users, id: 'users' },
      { name: 'Audit Logs', icon: History, id: 'audit' },
      { name: 'Settings', icon: Settings, id: 'settings' },
    ];

    const StaffLessonEditorView = () => {
      const module = modules.find(m => m.id === selectedModuleId);
      const lesson = module?.lessons.find(l => l.id === selectedLessonId);

      if (!module || !lesson) return (
        <div className="p-20 text-center">
          <p className="text-slate">Lesson not found.</p>
          <button onClick={() => setStaffView('module-overview')} className="mt-4 text-primary font-black uppercase tracking-widest">Back to Module</button>
        </div>
      );

      const [blocks, setBlocks] = useState<ContentBlock[]>(lesson.blocks || []);
      const [lessonTitle, setLessonTitle] = useState(lesson.title);
      const [selectedBlockIndex, setSelectedBlockIndex] = useState<number | null>(null);
      const [isSaving, setIsSaving] = useState(false);
      const [isDirty, setIsDirty] = useState(false);
      const [showAddMenu, setShowAddMenu] = useState(false);
      const [previewMode, setPreviewMode] = useState(false);

      const handleSave = async () => {
        setIsSaving(true);
        await new Promise(r => setTimeout(r, 1000));

        const updatedModules = modules.map(m => {
          if (m.id === selectedModuleId) {
            return {
              ...m,
              lastUpdated: new Date().toISOString(),
              lessons: m.lessons.map(l =>
                l.id === selectedLessonId ? { ...l, title: lessonTitle, blocks } : l
              )
            };
          }
          return m;
        });

        setModules(updatedModules);
        setIsSaving(false);
        setIsDirty(false);
        setToast({ message: 'Lesson saved successfully!', type: 'success' });
      };

      const addBlock = (type: ContentBlock['type']) => {
        let newBlock: ContentBlock;

        switch (type) {
          case 'text': newBlock = { type: 'text', content: 'New text block content...' }; break;
          case 'statement': newBlock = { type: 'statement', content: 'Important statement here.' }; break;
          case 'quote': newBlock = { type: 'quote', content: 'Quote text...', attribution: 'Author' }; break;
          case 'list': newBlock = { type: 'list', items: ['Item 1', 'Item 2'] }; break;
          case 'image': newBlock = { type: 'image', src: 'https://picsum.photos/seed/dec/1200/600', alt: 'Image description' }; break;
          case 'table': newBlock = { type: 'table', headers: ['Header 1', 'Header 2'], rows: [['Cell 1', 'Cell 2']] }; break;
          case 'accordion': newBlock = { type: 'accordion', items: [{ title: 'Item 1', content: 'Content 1' }] }; break;
          case 'tabs': newBlock = { type: 'tabs', items: [{ title: 'Tab 1', content: 'Content 1' }] }; break;
          case 'process': newBlock = { type: 'process', steps: [{ title: 'Step 1', content: 'Content 1' }] }; break;
          case 'flashcards': newBlock = { type: 'flashcards', items: [{ front: 'Front', back: 'Back' }] }; break;
          case 'sorting': newBlock = { type: 'sorting', title: 'Sort these items', categories: ['Cat A', 'Cat B'], cards: [{ text: 'Card 1', category: 'Cat A' }] }; break;
          case 'timeline': newBlock = { type: 'timeline', title: 'Timeline', items: ['Event 1', 'Event 2'] }; break;
          case 'chart': newBlock = { type: 'chart', title: 'Chart', chartType: 'bar', items: ['Value 1', 'Value 2'] }; break;
          case 'knowledge-check': newBlock = { type: 'knowledge-check', question: 'Question?', options: ['Opt 1', 'Opt 2'], correctAnswer: 0, hint: 'Think about...' }; break;
          case 'reflection': newBlock = { type: 'reflection', heading: 'Reflect', content: 'Think about...' }; break;
          case 'divider': newBlock = { type: 'divider' } as any; break;
          case 'resource-callout': newBlock = { type: 'resource-callout', title: 'Resource Title', description: 'Description...', link: '#' } as any; break;
          default: newBlock = { type: 'text', content: '' };
        }

        const newBlocks = [...blocks, newBlock];
        setBlocks(newBlocks);
        setSelectedBlockIndex(newBlocks.length - 1);
        setIsDirty(true);
        setShowAddMenu(false);
      };

      const deleteBlock = (index: number) => {
        const newBlocks = blocks.filter((_, i) => i !== index);
        setBlocks(newBlocks);
        if (selectedBlockIndex === index) setSelectedBlockIndex(null);
        setIsDirty(true);
      };

      const duplicateBlock = (index: number) => {
        const blockToDuplicate = blocks[index];
        const newBlocks = [...blocks];
        newBlocks.splice(index + 1, 0, { ...blockToDuplicate });
        setBlocks(newBlocks);
        setIsDirty(true);
      };

      const moveBlock = (index: number, direction: 'up' | 'down') => {
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === blocks.length - 1) return;

        const newBlocks = [...blocks];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];
        setBlocks(newBlocks);
        if (selectedBlockIndex === index) setSelectedBlockIndex(targetIndex);
        else if (selectedBlockIndex === targetIndex) setSelectedBlockIndex(index);
        setIsDirty(true);
      };

      const updateBlock = (index: number, data: any) => {
        const newBlocks = [...blocks];
        newBlocks[index] = { ...newBlocks[index], ...data };
        setBlocks(newBlocks);
        setIsDirty(true);
      };

      const blockTypes = [
        { id: 'text', icon: Type, label: 'Text' },
        { id: 'statement', icon: Info, label: 'Statement' },
        { id: 'quote', icon: Quote, label: 'Quote' },
        { id: 'list', icon: List, label: 'List' },
        { id: 'image', icon: Image, label: 'Image' },
        { id: 'table', icon: Table, label: 'Table' },
        { id: 'chart', icon: BarChart, label: 'Chart' },
        { id: 'accordion', icon: Layers, label: 'Accordion' },
        { id: 'tabs', icon: Layout, label: 'Tabs' },
        { id: 'process', icon: RotateCcw, label: 'Process' },
        { id: 'flashcards', icon: Copy, label: 'Flashcards' },
        { id: 'timeline', icon: History, label: 'Timeline' },
        { id: 'sorting', icon: Split, label: 'Sorting' },
        { id: 'knowledge-check', icon: CheckSquare, label: 'Knowledge Check' },
        { id: 'reflection', icon: MessageSquare, label: 'Reflection' },
        { id: 'divider', icon: MoreHorizontal, label: 'Divider' },
        { id: 'resource-callout', icon: ExternalLink, label: 'Resource Callout' },
      ];

      return (
        <div className="flex flex-col h-[calc(100vh-160px)]">
          {/* Editor Header */}
          <div className="flex items-center justify-between mb-8 bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  if (isDirty) {
                    if (window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
                      setStaffView('module-overview');
                    }
                  } else {
                    setStaffView('module-overview');
                  }
                }}
                className="p-2 hover:bg-gray-50 rounded-xl transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div>
                <input
                  type="text"
                  value={lessonTitle}
                  onChange={(e) => { setLessonTitle(e.target.value); setIsDirty(true); }}
                  className="text-xl font-black text-ink font-serif bg-transparent border-none focus:ring-0 p-0 w-[400px]"
                  placeholder="Lesson Title"
                />
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-black text-slate/40 uppercase tracking-widest">{module.title}</span>
                  {isDirty && <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest flex items-center gap-1">
                    <div className="w-1 h-1 rounded-full bg-amber-500" />
                    Unsaved Changes
                  </span>}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setPreviewMode(!previewMode)}
                className={cn(
                  "px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2",
                  previewMode ? "bg-ink text-white" : "bg-gray-100 text-slate hover:bg-gray-200"
                )}
              >
                <Eye className="w-4 h-4" />
                {previewMode ? 'Exit Preview' : 'Preview'}
              </button>
              <button
                onClick={handleSave}
                disabled={!isDirty || isSaving}
                className={cn(
                  "px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg shadow-primary/20",
                  isDirty ? "bg-primary text-white hover:bg-primary/90" : "bg-gray-100 text-slate/40 cursor-not-allowed"
                )}
              >
                {isSaving ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {isSaving ? 'Saving...' : 'Save Lesson'}
              </button>
            </div>
          </div>

          <div className="flex gap-8 flex-1 min-h-0">
            {/* Main Canvas */}
            <div className="flex-1 overflow-y-auto pr-4 scrollbar-hide">
              <div className="space-y-6 pb-32">
                {blocks.map((block, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedBlockIndex(index)}
                    className={cn(
                      "relative group bg-white rounded-[32px] border transition-all cursor-pointer",
                      selectedBlockIndex === index ? "border-primary ring-4 ring-primary/5 shadow-xl" : "border-gray-100 hover:border-primary/30 shadow-sm"
                    )}
                  >
                    {/* Block Controls */}
                    <div className={cn(
                      "absolute -left-12 top-1/2 -translate-y-1/2 flex flex-col gap-1 transition-all",
                      selectedBlockIndex === index ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    )}>
                      <button onClick={(e) => { e.stopPropagation(); moveBlock(index, 'up'); }} className="p-2 bg-white border border-gray-100 rounded-lg shadow-sm hover:text-primary transition-all"><ChevronLeft className="w-4 h-4 rotate-90" /></button>
                      <div className="p-2 bg-white border border-gray-100 rounded-lg shadow-sm cursor-grab active:cursor-grabbing"><GripVertical className="w-4 h-4 text-slate/20" /></div>
                      <button onClick={(e) => { e.stopPropagation(); moveBlock(index, 'down'); }} className="p-2 bg-white border border-gray-100 rounded-lg shadow-sm hover:text-primary transition-all"><ChevronLeft className="w-4 h-4 -rotate-90" /></button>
                    </div>

                    <div className={cn(
                      "absolute -right-12 top-1/2 -translate-y-1/2 flex flex-col gap-1 transition-all",
                      selectedBlockIndex === index ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    )}>
                      <button onClick={(e) => { e.stopPropagation(); duplicateBlock(index); }} className="p-2 bg-white border border-gray-100 rounded-lg shadow-sm hover:text-blue-600 transition-all"><Copy className="w-4 h-4" /></button>
                      <button onClick={(e) => { e.stopPropagation(); deleteBlock(index); }} className="p-2 bg-white border border-red-100 rounded-lg shadow-sm text-red-400 hover:text-red-600 transition-all"><Trash2 className="w-4 h-4" /></button>
                    </div>

                    {/* Block Content Rendering */}
                    <div className="p-8">
                      <div className="flex items-center gap-3 mb-4 opacity-40">
                        {React.createElement(blockTypes.find(t => t.id === block.type)?.icon || Type, { className: "w-4 h-4" })}
                        <span className="text-[10px] font-black uppercase tracking-widest">{block.type}</span>
                      </div>

                      {previewMode ? (
                        <div className="pointer-events-none">
                          <Blocks.BlockRenderer block={block} />
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {block.type === 'text' && (
                            <>
                              {block.heading && <h3 className="text-xl font-black text-ink font-serif">{block.heading}</h3>}
                              <p className="text-slate leading-relaxed">{block.content}</p>
                            </>
                          )}
                          {block.type === 'statement' && (
                            <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-r-2xl">
                              <p className="text-lg font-bold text-primary italic">{block.content}</p>
                            </div>
                          )}
                          {block.type === 'quote' && (
                            <div className="border-l-4 border-gray-200 pl-6 py-2">
                              <p className="text-xl font-serif italic text-ink mb-2">"{block.content}"</p>
                              {block.attribution && <p className="text-sm font-black text-slate uppercase tracking-widest">— {block.attribution}</p>}
                            </div>
                          )}
                          {block.type === 'image' && (
                            <div className="space-y-4">
                              <img src={block.src} alt={block.alt} className="w-full h-48 object-cover rounded-2xl" />
                              {block.caption && <p className="text-xs text-slate italic text-center">{block.caption}</p>}
                            </div>
                          )}
                          {/* Add more simplified editor previews for other types */}
                          {block.type === 'divider' && (
                            <div className="py-8 flex items-center justify-center">
                              <div className="w-full h-px bg-gray-100" />
                            </div>
                          )}
                          {block.type === 'resource-callout' && (
                            <div className="p-6 bg-primary/5 rounded-2xl border border-primary/10 flex items-center gap-4">
                              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border border-gray-100 shadow-sm">
                                <ExternalLink className="w-6 h-6 text-primary" />
                              </div>
                              <div>
                                <h4 className="font-black text-ink text-sm">{(block as any).title}</h4>
                                <p className="text-xs text-slate mt-1">{(block as any).description}</p>
                              </div>
                            </div>
                          )}
                          {!['text', 'statement', 'quote', 'image', 'divider', 'resource-callout'].includes(block.type) && (
                            <div className="p-10 border-2 border-dashed border-gray-100 rounded-2xl text-center">
                              <p className="text-xs font-black text-slate/40 uppercase tracking-widest">Interactive {block.type} block</p>
                              <p className="text-[10px] text-slate/30 mt-1">Select to configure in the sidebar</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Add Block Button */}
                <div className="relative">
                  <button
                    onClick={() => setShowAddMenu(!showAddMenu)}
                    className="w-full py-12 border-2 border-dashed border-gray-200 rounded-[32px] flex flex-col items-center justify-center gap-3 text-slate/40 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all group"
                  >
                    <PlusCircle className="w-10 h-10 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-black uppercase tracking-widest">Add Content Block</span>
                  </button>

                  <AnimatePresence>
                    {showAddMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute bottom-full left-0 right-0 mb-4 bg-white rounded-[40px] shadow-2xl border border-gray-100 p-8 z-50 grid grid-cols-5 gap-4"
                      >
                        {blockTypes.map(type => (
                          <button
                            key={type.id}
                            onClick={() => addBlock(type.id as any)}
                            className="flex flex-col items-center gap-3 p-4 rounded-2xl hover:bg-primary/5 hover:text-primary transition-all group"
                          >
                            <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center group-hover:bg-primary/10 transition-all">
                              <type.icon className="w-6 h-6" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-center">{type.label}</span>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Block Settings Sidebar */}
            <div className="w-80 bg-white rounded-[32px] border border-gray-100 shadow-sm flex flex-col overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-black text-ink uppercase tracking-widest text-xs">Block Settings</h3>
                <Settings className="w-4 h-4 text-slate/20" />
              </div>

              <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                {selectedBlockIndex !== null ? (
                  <div className="h-full flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                      <h4 className="text-xl font-black text-ink font-serif">Block Settings</h4>
                      <button onClick={() => setSelectedBlockIndex(null)} className="p-2 hover:bg-paper rounded-xl transition-all"><XCircle className="w-5 h-5 text-slate/40" /></button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-primary/5 rounded-2xl border border-primary/10 mb-8">
                      <div>
                        <p className="text-xs font-bold text-ink mt-1 capitalize">{blocks[selectedBlockIndex].type}</p>
                      </div>
                    </div>

                    {/* Dynamic Form Fields based on block type */}
                    <div className="space-y-4">
                      {blocks[selectedBlockIndex].type === 'text' && (
                        <>
                          <div>
                            <label className="block text-[10px] font-black text-slate uppercase tracking-widest mb-2">Heading (Optional)</label>
                            <input
                              type="text"
                              value={(blocks[selectedBlockIndex] as any).heading || ''}
                              onChange={(e) => updateBlock(selectedBlockIndex, { heading: e.target.value })}
                              className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-black text-slate uppercase tracking-widest mb-2">Content</label>
                            <textarea
                              value={(blocks[selectedBlockIndex] as any).content}
                              onChange={(e) => updateBlock(selectedBlockIndex, { content: e.target.value })}
                              rows={8}
                              className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                            />
                          </div>
                        </>
                      )}

                      {blocks[selectedBlockIndex].type === 'statement' && (
                        <div>
                          <label className="block text-[10px] font-black text-slate uppercase tracking-widest mb-2">Statement</label>
                          <textarea
                            value={(blocks[selectedBlockIndex] as any).content}
                            onChange={(e) => updateBlock(selectedBlockIndex, { content: e.target.value })}
                            rows={4}
                            className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                          />
                        </div>
                      )}

                      {blocks[selectedBlockIndex].type === 'quote' && (
                        <>
                          <div>
                            <label className="block text-[10px] font-black text-slate uppercase tracking-widest mb-2">Quote</label>
                            <textarea
                              value={(blocks[selectedBlockIndex] as any).content}
                              onChange={(e) => updateBlock(selectedBlockIndex, { content: e.target.value })}
                              rows={4}
                              className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-black text-slate uppercase tracking-widest mb-2">Attribution</label>
                            <input
                              type="text"
                              value={(blocks[selectedBlockIndex] as any).attribution || ''}
                              onChange={(e) => updateBlock(selectedBlockIndex, { attribution: e.target.value })}
                              className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                            />
                          </div>
                        </>
                      )}

                      {blocks[selectedBlockIndex].type === 'image' && (
                        <>
                          <div>
                            <label className="block text-[10px] font-black text-slate uppercase tracking-widest mb-2">Image URL</label>
                            <input
                              type="text"
                              value={(blocks[selectedBlockIndex] as any).src}
                              onChange={(e) => updateBlock(selectedBlockIndex, { src: e.target.value })}
                              className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-black text-slate uppercase tracking-widest mb-2">Alt Text</label>
                            <input
                              type="text"
                              value={(blocks[selectedBlockIndex] as any).alt}
                              onChange={(e) => updateBlock(selectedBlockIndex, { alt: e.target.value })}
                              className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-black text-slate uppercase tracking-widest mb-2">Caption (Optional)</label>
                            <input
                              type="text"
                              value={(blocks[selectedBlockIndex] as any).caption || ''}
                              onChange={(e) => updateBlock(selectedBlockIndex, { caption: e.target.value })}
                              className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                            />
                          </div>
                        </>
                      )}

                      {blocks[selectedBlockIndex].type === 'resource-callout' && (
                        <>
                          <div>
                            <label className="block text-[10px] font-black text-slate uppercase tracking-widest mb-2">Title</label>
                            <input
                              type="text"
                              value={(blocks[selectedBlockIndex] as any).title}
                              onChange={(e) => updateBlock(selectedBlockIndex, { title: e.target.value })}
                              className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-black text-slate uppercase tracking-widest mb-2">Description</label>
                            <textarea
                              value={(blocks[selectedBlockIndex] as any).description}
                              onChange={(e) => updateBlock(selectedBlockIndex, { description: e.target.value })}
                              rows={3}
                              className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-black text-slate uppercase tracking-widest mb-2">Link</label>
                            <input
                              type="text"
                              value={(blocks[selectedBlockIndex] as any).link}
                              onChange={(e) => updateBlock(selectedBlockIndex, { link: e.target.value })}
                              className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                            />
                          </div>
                        </>
                      )}

                      {blocks[selectedBlockIndex].type === 'list' && (
                        <div>
                          <label className="block text-[10px] font-black text-slate uppercase tracking-widest mb-2">List Items (One per line)</label>
                          <textarea
                            value={(blocks[selectedBlockIndex] as any).items.join('\n')}
                            onChange={(e) => updateBlock(selectedBlockIndex, { items: e.target.value.split('\n') })}
                            rows={6}
                            className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                          />
                        </div>
                      )}

                      {blocks[selectedBlockIndex].type === 'knowledge-check' && (
                        <>
                          <div>
                            <label className="block text-[10px] font-black text-slate uppercase tracking-widest mb-2">Question</label>
                            <input
                              type="text"
                              value={(blocks[selectedBlockIndex] as any).question}
                              onChange={(e) => updateBlock(selectedBlockIndex, { question: e.target.value })}
                              className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-black text-slate uppercase tracking-widest mb-2">Options (One per line)</label>
                            <textarea
                              value={(blocks[selectedBlockIndex] as any).options.join('\n')}
                              onChange={(e) => updateBlock(selectedBlockIndex, { options: e.target.value.split('\n') })}
                              rows={4}
                              className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-black text-slate uppercase tracking-widest mb-2">Correct Answer Index (0-based)</label>
                            <input
                              type="number"
                              value={(blocks[selectedBlockIndex] as any).correctAnswer}
                              onChange={(e) => updateBlock(selectedBlockIndex, { correctAnswer: parseInt(e.target.value) })}
                              className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                            />
                          </div>
                        </>
                      )}

                      {/* Add more settings fields for other types as needed */}
                      {['accordion', 'tabs', 'process'].includes(blocks[selectedBlockIndex].type) && (
                        <>
                          <div>
                            <label className="block text-[10px] font-black text-slate uppercase tracking-widest mb-2">Block Title</label>
                            <input
                              type="text"
                              value={(blocks[selectedBlockIndex] as any).title}
                              onChange={(e) => updateBlock(selectedBlockIndex, { title: e.target.value })}
                              className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-black text-slate uppercase tracking-widest mb-2">
                              {blocks[selectedBlockIndex].type === 'process' ? 'Steps' : 'Items'} (JSON Format)
                            </label>
                            <textarea
                              value={JSON.stringify((blocks[selectedBlockIndex] as any).items || (blocks[selectedBlockIndex] as any).steps, null, 2)}
                              onChange={(e) => {
                                try {
                                  const parsed = JSON.parse(e.target.value);
                                  const key = blocks[selectedBlockIndex].type === 'process' ? 'steps' : 'items';
                                  updateBlock(selectedBlockIndex, { [key]: parsed });
                                } catch (err) {}
                              }}
                              rows={8}
                              className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-xs font-mono"
                            />
                            <p className="text-[9px] text-slate/40 mt-1 italic">{'Example: [{"title": "Stage 1", "content": "Description"}]'}</p>
                          </div>
                        </>
                      )}

                      {blocks[selectedBlockIndex].type === 'flashcards' && (
                        <div>
                          <label className="block text-[10px] font-black text-slate uppercase tracking-widest mb-2">Cards (JSON Format)</label>
                          <textarea
                            value={JSON.stringify((blocks[selectedBlockIndex] as any).items, null, 2)}
                            onChange={(e) => {
                              try {
                                const parsed = JSON.parse(e.target.value);
                                updateBlock(selectedBlockIndex, { items: parsed });
                              } catch (err) {}
                            }}
                            rows={8}
                            className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-xs font-mono"
                          />
                          <p className="text-[9px] text-slate/40 mt-1 italic">{'Example: [{"front": "Term", "back": "Definition"}]'}</p>
                        </div>
                      )}

                      {blocks[selectedBlockIndex].type === 'sorting' && (
                        <>
                          <div>
                            <label className="block text-[10px] font-black text-slate uppercase tracking-widest mb-2">Categories (Comma separated)</label>
                            <input
                              type="text"
                              value={(blocks[selectedBlockIndex] as any).categories.join(', ')}
                              onChange={(e) => updateBlock(selectedBlockIndex, { categories: e.target.value.split(',').map(s => s.trim()) })}
                              className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-black text-slate uppercase tracking-widest mb-2">Cards (JSON Format)</label>
                            <textarea
                              value={JSON.stringify((blocks[selectedBlockIndex] as any).cards, null, 2)}
                              onChange={(e) => {
                                try {
                                  const parsed = JSON.parse(e.target.value);
                                  updateBlock(selectedBlockIndex, { cards: parsed });
                                } catch (err) {}
                              }}
                              rows={8}
                              className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-xs font-mono"
                            />
                            <p className="text-[9px] text-slate/40 mt-1 italic">{'Example: [{"text": "Action", "category": "CategoryA"}]'}</p>
                          </div>
                        </>
                      )}

                      {blocks[selectedBlockIndex].type === 'timeline' && (
                        <div>
                          <label className="block text-[10px] font-black text-slate uppercase tracking-widest mb-2">Timeline Stages (One per line)</label>
                          <textarea
                            value={(blocks[selectedBlockIndex] as any).items.join('\n')}
                            onChange={(e) => updateBlock(selectedBlockIndex, { items: e.target.value.split('\n') })}
                            rows={8}
                            className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                          />
                        </div>
                      )}

                      {!['text', 'statement', 'quote', 'image', 'resource-callout', 'list', 'knowledge-check', 'accordion', 'tabs', 'process', 'flashcards', 'sorting', 'timeline'].includes(blocks[selectedBlockIndex].type) && (
                        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                          <p className="text-[10px] text-amber-600 font-bold leading-relaxed">
                            Advanced settings for {blocks[selectedBlockIndex].type} blocks are coming soon. For now, you can reorder, duplicate or delete this block.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-20">
                    <Layout className="w-12 h-12 mb-4" />
                    <p className="text-xs font-black uppercase tracking-widest">Select a block to edit</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    };

    const StaffMediaLibraryView = () => {
      const module = modules.find(m => m.id === selectedModuleId);
      const [searchTerm, setSearchTerm] = useState('');
      const [filterType, setFilterType] = useState<string>('all');
      const [isUploading, setIsUploading] = useState(false);
      const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);

      const assets = module ? module.assets : modules.flatMap(m => m.assets);
      const filteredAssets = assets.filter(a =>
        (a.title.toLowerCase().includes(searchTerm.toLowerCase()) || a.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))) &&
        (filterType === 'all' || a.type === filterType)
      );

      const handleSimulateUpload = async () => {
        if (!module) {
          setToast({ message: 'Please select a module first to upload assets.', type: 'error' });
          return;
        }
        setIsUploading(true);
        await new Promise(r => setTimeout(r, 1500));

        const newAsset: CMSAsset = {
          id: 'a' + Math.random().toString(36).substr(2, 9),
          title: 'New Uploaded Asset ' + (module.assets.length + 1),
          type: 'image',
          url: 'https://picsum.photos/seed/' + Math.random() + '/800/600',
          filesize: '2.4 MB',
          uploadedAt: new Date().toISOString(),
          tags: ['Upload'],
          linkedLessonIds: [],
          isDownloadable: true
        };

        const updatedModules = modules.map(m =>
          m.id === module.id ? { ...m, assets: [newAsset, ...m.assets] } : m
        );
        setModules(updatedModules);
        setIsUploading(false);
        setToast({ message: 'Asset uploaded successfully (simulated)!', type: 'success' });
      };

      const deleteAsset = (assetId: string) => {
        if (!module) return;
        const updatedModules = modules.map(m =>
          m.id === module.id ? { ...m, assets: m.assets.filter(a => a.id !== assetId) } : m
        );
        setModules(updatedModules);
        setToast({ message: 'Asset removed.', type: 'success' });
      };

      const selectedAsset = assets.find(a => a.id === selectedAssetId);

      return (
        <div className="flex h-[calc(100vh-140px)] gap-8">
          <div className="flex-1 flex flex-col min-w-0">
            {/* Header & Controls */}
            <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm mb-8 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-black text-ink font-serif mb-2">Media & Resources</h2>
                  <p className="text-slate italic">
                    {module ? `Managing assets for: ${module.title}` : 'Global Asset Library'}
                  </p>
                </div>
                <button
                  onClick={handleSimulateUpload}
                  disabled={isUploading}
                  className="bg-primary text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-3 disabled:opacity-50"
                >
                  {isUploading ? <RotateCcw className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                  Simulate Upload
                </button>
              </div>

              <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-50">
                <div className="relative flex-1 min-w-[300px]">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate/40" />
                  <input
                    type="text"
                    placeholder="Search assets by title or tag..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-6 py-4 rounded-2xl border border-gray-100 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  />
                </div>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-6 py-4 rounded-2xl border border-gray-100 bg-white font-black text-[10px] uppercase tracking-widest text-slate outline-none"
                >
                  <option value="all">All Types</option>
                  <option value="image">Images</option>
                  <option value="video">Videos</option>
                  <option value="document">Documents</option>
                  <option value="audio">Audio</option>
                </select>
              </div>
            </div>

            {/* Assets Grid */}
            <div className="flex-1 overflow-y-auto pr-4 -mr-4 custom-scrollbar">
              {filteredAssets.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredAssets.map(asset => (
                    <motion.div
                      key={asset.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={() => setSelectedAssetId(asset.id)}
                      className={cn(
                        "group bg-white rounded-[32px] border border-gray-100 overflow-hidden cursor-pointer transition-all hover:shadow-xl hover:-translate-y-1 relative",
                        selectedAssetId === asset.id ? "ring-2 ring-primary shadow-xl" : "shadow-sm"
                      )}
                    >
                      <div className="aspect-video bg-gray-50 flex items-center justify-center relative overflow-hidden">
                        {asset.type === 'image' ? (
                          <img src={asset.url} alt={asset.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        ) : (
                          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                            {asset.type === 'video' ? <PlayCircle className="w-8 h-8 text-primary" /> : <FileText className="w-8 h-8 text-primary" />}
                          </div>
                        )}
                        <div className="absolute top-4 left-4 flex gap-2">
                          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-[8px] font-black uppercase tracking-widest text-primary shadow-sm">
                            {asset.type}
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <h4 className="font-black text-ink font-serif truncate mb-1">{asset.title}</h4>
                        <div className="flex items-center justify-between text-[10px] text-slate/60 font-medium">
                          <span>{asset.filesize}</span>
                          <span>{new Date(asset.uploadedAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <button
                        onClick={(e) => { e.stopPropagation(); deleteAsset(asset.id); }}
                        className="absolute top-4 right-4 p-2 bg-red-50 text-red-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-20 bg-white rounded-[40px] border border-gray-100 shadow-sm opacity-60">
                  <Library className="w-16 h-16 text-slate/20 mb-6" />
                  <h3 className="text-xl font-black text-ink font-serif mb-2">No assets found</h3>
                  <p className="text-slate">Upload your first asset to begin.</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel: Metadata & Settings */}
          <div className="w-[380px] flex flex-col h-full bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
            {selectedAsset ? (
              <div className="flex flex-col h-full">
                <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                  <h3 className="text-xl font-black text-ink font-serif">Asset Details</h3>
                  <button onClick={() => setSelectedAssetId(null)} className="p-2 hover:bg-gray-100 rounded-xl transition-all">
                    <X className="w-5 h-5 text-slate" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                  {/* Preview Small */}
                  <div className="aspect-video bg-gray-50 rounded-[24px] overflow-hidden border border-gray-100">
                    {selectedAsset.type === 'image' ? (
                      <img src={selectedAsset.url} alt={selectedAsset.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FileText className="w-12 h-12 text-slate/20" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="text-[10px] font-black text-slate uppercase tracking-widest ml-1">Asset Title</label>
                      <input
                        type="text"
                        value={selectedAsset.title}
                        onChange={(e) => {
                          if (!module) return;
                          const updated = { ...selectedAsset, title: e.target.value };
                          setModules(modules.map(m => m.id === module.id ? { ...m, assets: m.assets.map(a => a.id === selectedAsset.id ? updated : a) } : m));
                        }}
                        className="w-full mt-2 px-4 py-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-[10px] uppercase tracking-widest font-black text-slate">
                      <div className="p-4 bg-gray-50 rounded-2xl">
                        <span className="block opacity-40 mb-1">Type</span>
                        {selectedAsset.type}
                      </div>
                      <div className="p-4 bg-gray-50 rounded-2xl">
                        <span className="block opacity-40 mb-1">Size</span>
                        {selectedAsset.filesize}
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-black text-slate uppercase tracking-widest ml-1">Transcript / Caption</label>
                      <textarea
                        rows={4}
                        placeholder="Add transcripts for accessibility..."
                        className="w-full mt-2 px-4 py-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all"
                      />
                    </div>

                    <div className="p-6 bg-blue-50/50 rounded-[24px] border border-blue-100/50 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Downloadable</span>
                        <button className="w-10 h-6 bg-blue-500 rounded-full relative shadow-inner">
                          <div className={cn("absolute top-1 w-4 h-4 bg-white rounded-full transition-all", selectedAsset.isDownloadable ? "right-1" : "left-1")} />
                        </button>
                      </div>
                      <p className="text-[9px] text-blue-600/60 font-medium italic leading-relaxed">
                        If enabled, students can see a download link for this asset in the resources panel.
                      </p>
                    </div>

                    <div>
                      <label className="text-[10px] font-black text-slate uppercase tracking-widest ml-1">Linked Lessons</label>
                      <div className="mt-3 space-y-2">
                        {module?.lessons.map(lesson => (
                          <div key={lesson.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                            <div className="w-4 h-4 rounded border-2 border-gray-200" />
                            <span className="text-xs font-bold text-ink truncate font-serif">{lesson.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-8 border-t border-gray-50 bg-gray-50/30">
                  <button onClick={() => setSelectedAssetId(null)} className="w-full bg-ink text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-ink/10">
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-12 opacity-30">
                <Library className="w-12 h-12 mb-4" />
                <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed">
                  Select an asset to view<br />details and metadata
                </p>
              </div>
            )}
          </div>
        </div>
      );
    };

    const StaffAssessmentBuilderView = () => {
      const module = modules.find(m => m.id === selectedModuleId);
      if (!module) return (
        <div className="p-20 text-center">
          <p className="text-slate">Please select a module first.</p>
        </div>
      );

      const [selectedAssessmentId, setSelectedAssessmentId] = useState<string | null>(null);

      const handleAddAssessment = (type: 'pre-test' | 'quiz' | 'post-test') => {
        const newAs: CMSAssessment = {
          id: 'as' + Math.random().toString(36).substr(2, 9),
          type,
          title: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
          passScore: 80,
          questions: []
        };
        const updated = { ...module, assessments: [...module.assessments, newAs] };
        setModules(modules.map(m => m.id === module.id ? updated : m));
        setSelectedAssessmentId(newAs.id);
      };

      const deleteAssessment = (id: string) => {
        const updated = { ...module, assessments: module.assessments.filter(a => a.id !== id) };
        setModules(modules.map(m => m.id === module.id ? updated : m));
        setToast({ message: 'Assessment deleted.', type: 'success' });
      };

      const selectedAssessment = module.assessments.find(a => a.id === selectedAssessmentId);

      const addQuestion = () => {
        if (!selectedAssessment) return;
        const newQ: CMSQuestion = {
          id: 'q' + Math.random().toString(36).substr(2, 9),
          type: 'single-select',
          question: 'New Question',
          options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
          correctAnswer: 0,
          points: 10
        };
        const updatedAs = { ...selectedAssessment, questions: [...selectedAssessment.questions, newQ] };
        const updatedModule = { ...module, assessments: module.assessments.map(a => a.id === selectedAssessmentId ? updatedAs : a) };
        setModules(modules.map(m => m.id === module.id ? updatedModule : m));
      };

      return (
        <div className="max-w-6xl mx-auto space-y-12">
          {!selectedAssessmentId ? (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-4xl font-black text-ink font-serif mb-2">Assessments</h2>
                  <p className="text-slate italic">Define benchmarks for {module.title}</p>
                </div>
                <div className="flex gap-4">
                  <button onClick={() => handleAddAssessment('pre-test')} className="px-6 py-4 bg-white border border-gray-100 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate hover:border-primary hover:text-primary shadow-sm transition-all">Add Pre-test</button>
                  <button onClick={() => handleAddAssessment('quiz')} className="px-6 py-4 bg-white border border-gray-100 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate hover:border-primary hover:text-primary shadow-sm transition-all">Add Quiz</button>
                  <button onClick={() => handleAddAssessment('post-test')} className="px-8 py-4 bg-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all">Add Post-test</button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {module.assessments.length > 0 ? module.assessments.map(as => (
                  <div key={as.id} className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-xl transition-all group relative">
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center mb-6",
                      as.type === 'pre-test' ? "bg-blue-50 text-blue-500" : as.type === 'quiz' ? "bg-emerald-50 text-emerald-500" : "bg-purple-50 text-purple-500"
                    )}>
                      <CheckSquare className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-black text-ink font-serif mb-2">{as.title}</h3>
                    <p className="text-slate text-sm mb-8">{as.questions.length} Questions • {as.passScore}% Pass Score</p>
                    <button
                      onClick={() => setSelectedAssessmentId(as.id)}
                      className="w-full py-4 bg-gray-50 text-slate font-black text-[10px] uppercase tracking-widest rounded-2xl group-hover:bg-primary group-hover:text-white transition-all shadow-sm"
                    >
                      Edit Assessment
                    </button>
                    <button
                      onClick={() => deleteAssessment(as.id)}
                      className="absolute top-6 right-6 p-2 text-slate/20 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                )) : (
                  <div className="col-span-full py-32 text-center bg-gray-50/50 rounded-[40px] border-2 border-dashed border-gray-100">
                    <CheckSquare className="w-16 h-16 text-slate/10 mx-auto mb-6" />
                    <p className="text-slate font-black text-sm uppercase tracking-widest">No assessments created yet</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="space-y-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <button onClick={() => setSelectedAssessmentId(null)} className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:bg-gray-50 transition-all">
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <h2 className="text-3xl font-black text-ink font-serif">{selectedAssessment?.title}</h2>
                </div>
                <button onClick={() => setSelectedAssessmentId(null)} className="bg-primary text-white px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20">Save & Close</button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-6">
                  {selectedAssessment?.questions.map((q, idx) => (
                    <div key={q.id} className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm space-y-6 relative group">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-slate/40 uppercase tracking-widest">Question {idx + 1}</span>
                        <div className="flex gap-2">
                          <span className="px-3 py-1 bg-gray-50 rounded-lg text-[8px] font-black uppercase tracking-widest text-slate">{q.type}</span>
                          <button className="p-2 text-slate/40 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                      <input
                        type="text"
                        value={q.question}
                        onChange={(e) => {
                          const updatedQ = { ...q, question: e.target.value };
                          const updatedAs = { ...selectedAssessment, questions: selectedAssessment.questions.map(qu => qu.id === q.id ? updatedQ : qu) };
                          setModules(modules.map(m => m.id === module.id ? { ...m, assessments: m.assessments.map(a => a.id === selectedAssessmentId ? updatedAs : a) } : m));
                        }}
                        placeholder="Type your question here..."
                        className="w-full text-xl font-black text-ink font-serif border-b border-gray-100 focus:border-primary outline-none pb-4 transition-all"
                      />
                      {q.type !== 'short-text' && (
                        <div className="space-y-3">
                          {q.options?.map((opt, oIdx) => (
                            <div key={oIdx} className="flex items-center gap-4 group/opt">
                              <button
                                onClick={() => {
                                  const updatedAs = { ...selectedAssessment, questions: selectedAssessment.questions.map(qu => qu.id === q.id ? { ...qu, correctAnswer: oIdx } : qu) };
                                  setModules(modules.map(m => m.id === module.id ? { ...m, assessments: m.assessments.map(a => a.id === selectedAssessmentId ? updatedAs : a) } : m));
                                }}
                                className={cn(
                                  "w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] font-black transition-all",
                                  q.correctAnswer === oIdx ? "bg-primary border-primary text-white" : "border-gray-200 text-slate/20 hover:border-primary/40"
                                )}
                              >
                                {String.fromCharCode(65 + oIdx)}
                              </button>
                              <input
                                type="text"
                                value={opt}
                                onChange={(e) => {
                                  const newOpts = [...(q.options || [])];
                                  newOpts[oIdx] = e.target.value;
                                  const updatedAs = { ...selectedAssessment, questions: selectedAssessment.questions.map(qu => qu.id === q.id ? { ...qu, options: newOpts } : qu) };
                                  setModules(modules.map(m => m.id === module.id ? { ...m, assessments: m.assessments.map(a => a.id === selectedAssessmentId ? updatedAs : a) } : m));
                                }}
                                className="flex-1 text-sm text-slate border-none focus:ring-0 p-0"
                              />
                              <button
                                onClick={() => {
                                  const newOpts = (q.options || []).filter((_, i) => i !== oIdx);
                                  const updatedAs = { ...selectedAssessment, questions: selectedAssessment.questions.map(qu => qu.id === q.id ? { ...qu, options: newOpts } : qu) };
                                  setModules(modules.map(m => m.id === module.id ? { ...m, assessments: m.assessments.map(a => a.id === selectedAssessmentId ? updatedAs : a) } : m));
                                }}
                                className="opacity-0 group-hover/opt:opacity-100 text-slate/20 hover:text-red-500 transition-all"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                          <button
                            onClick={() => {
                              const newOpts = [...(q.options || []), `Option ${(q.options?.length || 0) + 1}`];
                              const updatedAs = { ...selectedAssessment, questions: selectedAssessment.questions.map(qu => qu.id === q.id ? { ...qu, options: newOpts } : qu) };
                              setModules(modules.map(m => m.id === module.id ? { ...m, assessments: m.assessments.map(a => a.id === selectedAssessmentId ? updatedAs : a) } : m));
                            }}
                            className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-2 mt-4 hover:opacity-70"
                          >
                            <Plus className="w-3 h-3" /> Add Option
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={addQuestion}
                    className="w-full py-10 bg-gray-50/50 border-2 border-dashed border-gray-100 rounded-[40px] text-slate/40 flex flex-col items-center justify-center hover:bg-gray-50 hover:border-primary/20 hover:text-primary transition-all group"
                  >
                    <PlusCircle className="w-10 h-10 mb-4 opacity-50 group-hover:scale-110 transition-transform" />
                    <span className="font-black text-[10px] uppercase tracking-widest">Add New Question</span>
                  </button>
                </div>

                <div className="space-y-8">
                  <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm space-y-6 sticky top-8">
                    <h4 className="text-xl font-black text-ink font-serif">Assessment Settings</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate uppercase tracking-widest ml-1">Title</label>
                        <input
                          type="text"
                          value={selectedAssessment?.title}
                          onChange={(e) => {
                            const updatedAs = { ...selectedAssessment, title: e.target.value };
                            setModules(modules.map(m => m.id === module.id ? { ...m, assessments: m.assessments.map(a => a.id === selectedAssessmentId ? updatedAs : a) } : m));
                          }}
                          className="w-full px-4 py-3 rounded-xl border border-gray-100 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate uppercase tracking-widest ml-1">Passing Score (%)</label>
                        <input
                          type="number"
                          value={selectedAssessment?.passScore}
                          onChange={(e) => {
                            const updatedAs = { ...selectedAssessment, passScore: parseInt(e.target.value) || 0 };
                            setModules(modules.map(m => m.id === module.id ? { ...m, assessments: m.assessments.map(a => a.id === selectedAssessmentId ? updatedAs : a) } : m));
                          }}
                          className="w-full px-4 py-3 rounded-xl border border-gray-100 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                        />
                      </div>
                    </div>
                    <div className="pt-6 border-t border-gray-50">
                      <p className="text-[10px] text-slate/40 leading-relaxed italic">
                        Questions will be randomized for learners. Ensure each question has a clear correct answer.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    };

    const StaffFeedbackBuilderView = () => {
      const module = modules.find(m => m.id === selectedModuleId);
      if (!module) return (
        <div className="p-20 text-center">
          <p className="text-slate">Please select a module first.</p>
        </div>
      );

      const [instrument, setInstrument] = useState<CMSFeedbackInstrument>(module.feedback || {
        id: 'f' + Math.random().toString(36).substr(2, 9),
        title: 'Module Feedback',
        items: []
      });

      const handleAddItem = (type: FeedbackItemType) => {
        const newItem: CMSFeedbackItem = {
          id: 'fi' + Math.random().toString(36).substr(2, 9),
          type,
          text: '',
          required: true,
          options: type === 'multiple-choice' ? ['Excellent', 'Good', 'Average', 'Poor'] : undefined
        };
        setInstrument({ ...instrument, items: [...instrument.items, newItem] });
      };

      const handleSave = () => {
        setModules(modules.map(m => m.id === module.id ? { ...m, feedback: instrument } : m));
        setToast({ message: 'Feedback instrument saved.', type: 'success' });
      };

      return (
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-4xl font-black text-ink font-serif mb-2">Feedback Builder</h2>
              <p className="text-slate italic">Craft the post-course reflection for {module.title}</p>
            </div>
            <button
              onClick={handleSave}
              className="bg-primary text-white px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-3"
            >
              <Save className="w-5 h-5" />
              Save Instrument
            </button>
          </div>

          <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm space-y-12">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate uppercase tracking-widest ml-1">Instrument Title</label>
              <input
                type="text"
                value={instrument.title}
                onChange={(e) => setInstrument({ ...instrument, title: e.target.value })}
                className="w-full text-3xl font-black text-ink font-serif border-b-2 border-gray-50 focus:border-primary outline-none pb-4 transition-all bg-transparent"
              />
            </div>

            <div className="space-y-8">
              {instrument.items.length > 0 ? instrument.items.map((item, idx) => (
                <div key={item.id} className="p-10 bg-gray-50/30 rounded-[32px] border border-gray-100 space-y-6 relative group transition-all hover:bg-white hover:shadow-xl hover:border-transparent">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate/40 uppercase tracking-widest font-sans">Item {idx + 1}</span>
                    <div className="flex items-center gap-4">
                      <span className="px-3 py-1 bg-white rounded-lg text-[8px] font-black uppercase tracking-widest text-primary shadow-sm">{item.type}</span>
                      <button
                        onClick={() => setInstrument({ ...instrument, items: instrument.items.filter(i => i.id !== item.id) })}
                        className="p-2 text-slate/20 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <input
                    type="text"
                    value={item.text}
                    onChange={(e) => {
                      const updated = instrument.items.map(i => i.id === item.id ? { ...i, text: e.target.value } : i);
                      setInstrument({ ...instrument, items: updated });
                    }}
                    placeholder="Ask your question here..."
                    className="w-full bg-transparent text-xl font-black text-ink font-serif outline-none border-none p-0 focus:ring-0"
                  />

                  {item.type === 'multiple-choice' && (
                    <div className="grid grid-cols-2 gap-4">
                      {item.options?.map((opt, oIdx) => (
                        <div key={oIdx} className="bg-white/50 p-4 rounded-xl border border-gray-100 text-sm text-slate flex justify-between items-center group/opt">
                          <input
                            type="text"
                            value={opt}
                            onChange={(e) => {
                              const newOpts = [...(item.options || [])];
                              newOpts[oIdx] = e.target.value;
                              const updated = instrument.items.map(i => i.id === item.id ? { ...i, options: newOpts } : i);
                              setInstrument({ ...instrument, items: updated });
                            }}
                            className="bg-transparent border-none focus:ring-0 p-0 text-sm text-slate w-full"
                          />
                          <button
                            onClick={() => {
                              const newOpts = (item.options || []).filter((_, i) => i !== oIdx);
                              const updated = instrument.items.map(i => i.id === item.id ? { ...i, options: newOpts } : i);
                              setInstrument({ ...instrument, items: updated });
                            }}
                            className="opacity-0 group-hover/opt:opacity-100 text-slate/20 hover:text-red-500 transition-all"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => {
                          const newOpts = [...(item.options || []), `Option ${(item.options?.length || 0) + 1}`];
                          const updated = instrument.items.map(i => i.id === item.id ? { ...i, options: newOpts } : i);
                          setInstrument({ ...instrument, items: updated });
                        }}
                        className="p-4 border-2 border-dashed border-gray-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate/40 hover:border-primary/20 hover:text-primary transition-all"
                      >
                        Add Option
                      </button>
                    </div>
                  )}

                  <div className="flex items-center gap-8 pt-4 border-t border-gray-100/50">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => {
                          const updated = instrument.items.map(i => i.id === item.id ? { ...i, required: !i.required } : i);
                          setInstrument({ ...instrument, items: updated });
                        }}
                        className={cn(
                          "w-12 h-7 rounded-full relative transition-all shadow-inner",
                          item.required ? "bg-primary" : "bg-gray-200"
                        )}
                      >
                        <motion.div
                          layout
                          className={cn("absolute top-1 w-5 h-5 bg-white rounded-full shadow-md", item.required ? "right-1" : "left-1")}
                        />
                      </button>
                      <span className="text-[10px] font-black text-ink uppercase tracking-widest">Required Question</span>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="py-24 text-center border-2 border-dashed border-gray-50 rounded-[40px]">
                  <MessageSquare className="w-16 h-16 text-slate/10 mx-auto mb-6" />
                  <p className="text-slate font-black text-xs uppercase tracking-widest">Add your first feedback item to begin</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 border-t border-gray-100">
              <button onClick={() => handleAddItem('likert')} className="flex flex-col items-center gap-4 p-8 bg-gray-50/50 hover:bg-white hover:shadow-2xl hover:-translate-y-1 rounded-[32px] border border-transparent hover:border-gray-100 transition-all group">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <BarChart className="w-6 h-6 text-primary" />
                </div>
                <span className="font-black text-[10px] uppercase tracking-widest text-slate">Likert Scale</span>
              </button>
              <button onClick={() => handleAddItem('multiple-choice')} className="flex flex-col items-center gap-4 p-8 bg-gray-50/50 hover:bg-white hover:shadow-2xl hover:-translate-y-1 rounded-[32px] border border-transparent hover:border-gray-100 transition-all group">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <List className="w-6 h-6 text-emerald-500" />
                </div>
                <span className="font-black text-[10px] uppercase tracking-widest text-slate">Multiple Choice</span>
              </button>
              <button onClick={() => handleAddItem('open')} className="flex flex-col items-center gap-4 p-8 bg-gray-50/50 hover:bg-white hover:shadow-2xl hover:-translate-y-1 rounded-[32px] border border-transparent hover:border-gray-100 transition-all group">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Type className="w-6 h-6 text-blue-500" />
                </div>
                <span className="font-black text-[10px] uppercase tracking-widest text-slate">Open Ended</span>
              </button>
            </div>
          </div>
        </div>
      );
    };

    const StaffQAChecklistView = () => {
      const module = modules.find(m => m.id === selectedModuleId);
      if (!module) return <div className="p-20 text-center text-slate">No module selected.</div>;

      const [isValidating, setIsValidating] = useState(false);

      const runValidation = () => {
        setIsValidating(true);
        setTimeout(() => setIsValidating(false), 1500);
      };

      const allPassed = module.qaResults.every(r => r.status === 'pass' || r.status === 'warning');

      return (
        <div className="space-y-8 max-w-4xl mx-auto">
          <div className="flex items-center justify-between bg-white px-8 py-6 rounded-[32px] border border-gray-100 shadow-sm">
            <div className="space-y-1">
              <h1 className="text-3xl font-black text-ink font-serif tracking-tight">QA Checklist</h1>
              <p className="text-slate font-medium">Automatic validation for <span className="text-primary font-black uppercase text-[10px] tracking-widest">{module.title}</span></p>
            </div>
            <button
              onClick={runValidation}
              disabled={isValidating}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                isValidating ? "bg-gray-100 text-slate" : "bg-primary text-white shadow-xl shadow-primary/20 hover:-translate-y-0.5"
              )}
            >
              <RotateCcw className={cn("w-4 h-4", isValidating && "animate-spin")} />
              {isValidating ? 'Validating...' : 'Rerun Validation'}
            </button>
          </div>

          <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="grid divide-y divide-gray-50">
              {module.qaResults.map((result) => (
                <div key={result.id} className="p-8 flex items-start gap-6 group hover:bg-gray-50/50 transition-colors">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm",
                    result.status === 'pass' ? "bg-success/10 text-success" :
                      result.status === 'warning' ? "bg-amber-50 text-amber-600" : "bg-red-50 text-red-600"
                  )}>
                    {result.status === 'pass' ? <CheckCircle2 className="w-6 h-6" /> :
                      result.status === 'warning' ? <AlertTriangle className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-black text-ink font-serif">{result.title}</h3>
                      <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 bg-gray-100 text-slate rounded-lg">{result.category}</span>
                    </div>
                    <p className="text-slate text-sm font-medium">{result.message}</p>
                  </div>
                  <div className="flex items-center gap-2 pr-4 self-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 hover:bg-white rounded-lg text-primary text-[10px] font-black uppercase tracking-widest">Fix Issue</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 bg-gray-900 px-8 py-6 rounded-[32px] text-white shadow-2xl">
            <div className="mr-8 flex items-center gap-3">
              <div className={cn("w-2 h-2 rounded-full", allPassed ? "bg-success animate-pulse" : "bg-red-500")} />
              <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Status: {allPassed ? 'Ready for Review' : 'Issues Blockers Found'}</p>
            </div>
            <button
              onClick={() => {
                const updated = modules.map(m => m.id === module.id ? { ...m, status: 'review' as const } : m);
                setModules(updated);
                localStorage.setItem('dec_modules', JSON.stringify(updated));
                setStaffView('review-queue');
                setToast({ message: 'Module submitted for review successfully!', type: 'success' });
              }}
              className="bg-primary px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all"
            >
              Submit for Review
            </button>
          </div>
        </div>
      );
    };

    const StaffReviewQueueView = () => {
      const reviewModules = modules.filter(m => m.status === 'review');

      return (
        <div className="space-y-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-black text-ink font-serif tracking-tight">Review Queue</h1>
            <p className="text-slate font-medium text-lg">Modules pending quality assurance and approval.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviewModules.length > 0 ? reviewModules.map(m => (
              <button
                key={m.id}
                onClick={() => {
                  setSelectedModuleId(m.id);
                  setStaffView('review-module');
                }}
                className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-2xl hover:border-primary/20 transition-all text-left group relative ornament-bg"
              >
                <div className="flex items-start justify-between mb-8">
                  <div className="flex items-center gap-2 px-3 py-1 bg-purple-50 text-purple-600 rounded-lg text-[8px] font-black uppercase tracking-widest border border-purple-100">
                    <Clock className="w-3 h-3" /> Pending Review
                  </div>
                  <div className="w-10 h-10 bg-gray-50 group-hover:bg-primary/5 rounded-2xl flex items-center justify-center transition-colors">
                    <ChevronRight className="w-5 h-5 text-slate group-hover:text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-black text-ink font-serif mb-3 leading-tight group-hover:text-primary transition-colors">{m.title}</h3>
                <p className="text-slate text-xs mb-8 line-clamp-2 opacity-60 font-medium leading-relaxed">{m.summary}</p>

                <div className="pt-8 border-t border-gray-50 flex items-center justify-between">
                  <div className="flex -space-x-1.5">
                    {[1, 2].map(i => (
                      <div key={i} className="w-6 h-6 rounded-full bg-white p-0.5 border border-gray-100 ring-2 ring-transparent group-hover:ring-primary/10 transition-all">
                        <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center text-[6px] font-black text-slate uppercase">U{i}</div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-1.5 text-slate/40">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span className="text-[9px] font-black uppercase tracking-widest">{m.reviewComments.length} Comments</span>
                  </div>
                </div>
              </button>
            )) : (
              <div className="col-span-full py-32 text-center bg-white rounded-[40px] border-2 border-dashed border-gray-100">
                <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate/20">
                  <ShieldCheck className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-black text-ink font-serif mb-2">Queue is Clear</h3>
                <p className="text-slate text-sm font-medium">No modules are currently pending review.</p>
              </div>
            )}
          </div>
        </div>
      );
    };

    const StaffAnalyticsView = () => {
      const publishedModules = modules.filter(m => m.status === 'published' && m.analytics);
      const totalEnrollments = publishedModules.reduce((acc, m) => acc + (m.analytics?.enrollments || 0), 0);
      const avgCompletion = publishedModules.length > 0
        ? Math.round(publishedModules.reduce((acc, m) => acc + (m.analytics?.completions || 0), 0) / totalEnrollments * 100)
        : 0;
      const platformRating = publishedModules.length > 0
        ? (publishedModules.reduce((acc, m) => acc + (m.analytics?.rating || 0), 0) / publishedModules.length).toFixed(1)
        : '0.0';

      return (
        <div className="space-y-12">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-black text-ink font-serif tracking-tight">Platform Analytics</h1>
            <p className="text-slate font-medium text-lg">Measure engagement and performance across all published content.</p>
          </div>

          {/* Aggregate Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { label: 'Total Learners', value: totalEnrollments.toLocaleString(), icon: Users, color: 'text-primary' },
              { label: 'Avg Completion', value: `${avgCompletion}%`, icon: CheckCircle2, color: 'text-success' },
              { label: 'Platform Rating', value: platformRating, icon: Star, color: 'text-amber-500' },
            ].map((stat, i) => (
              <div key={i} className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center">
                  <stat.icon className={cn("w-6 h-6", stat.color)} />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-slate tracking-widest block">{stat.label}</span>
                  <span className="text-3xl font-black text-ink">{stat.value}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Module Performance Table */}
          <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-xl font-black text-ink font-serif">Module Performance</h3>
              <button className="text-xs font-black text-primary uppercase tracking-widest flex items-center gap-2">
                <Download className="w-4 h-4" /> Export CSV
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-8 py-4 text-[10px] font-black uppercase text-slate tracking-widest">Module</th>
                    <th className="px-8 py-4 text-[10px] font-black uppercase text-slate tracking-widest text-center">Enrollments</th>
                    <th className="px-8 py-4 text-[10px] font-black uppercase text-slate tracking-widest text-center">Completions</th>
                    <th className="px-8 py-4 text-[10px] font-black uppercase text-slate tracking-widest text-center">Avg Score</th>
                    <th className="px-8 py-4 text-[10px] font-black uppercase text-slate tracking-widest text-center">Rating</th>
                    <th className="px-8 py-4 text-[10px] font-black uppercase text-slate tracking-widest text-right">Trend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {publishedModules.map(m => (
                    <tr key={m.id} className="hover:bg-gray-50/50 transition-colors group cursor-pointer" onClick={() => { setSelectedModuleId(m.id); setStaffView('module-overview'); }}>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-primary/5 text-primary rounded-xl flex items-center justify-center font-black text-[10px]">
                            {m.courseCode.split('-')[1] || '??'}
                          </div>
                          <span className="font-serif font-black text-ink group-hover:text-primary transition-colors">{m.title}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center font-bold text-slate">{m.analytics?.enrollments}</td>
                      <td className="px-8 py-6 text-center font-bold text-slate">
                        {m.analytics?.completions}
                        <span className="text-[10px] opacity-40 ml-2">({Math.round((m.analytics?.completions || 0) / (m.analytics?.enrollments || 1) * 100)}%)</span>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <span className={cn(
                          "px-3 py-1 rounded-full text-[10px] font-black",
                          (m.analytics?.avgScore || 0) > 85 ? "bg-success/10 text-success" : "bg-amber-100 text-amber-600"
                        )}>
                          {m.analytics?.avgScore}%
                        </span>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                          <span className="font-black text-ink">{m.analytics?.rating}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-end justify-end gap-1 h-8">
                          {m.analytics?.trendingData.map((val, i) => (
                            <div
                              key={i}
                              className="w-1.5 bg-primary/20 rounded-full group-hover:bg-primary transition-all"
                              style={{ height: `${(val / Math.max(...m.analytics!.trendingData)) * 100}%` }}
                            />
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    };

    const StaffFeedbackTriageView = () => {
      const allFeedback = modules.flatMap(m => (m.learnerFeedback || []).map(f => ({ ...f, moduleTitle: m.title, moduleId: m.id })))
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      return (
        <div className="space-y-12">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-black text-ink font-serif tracking-tight">Feedback Triage</h1>
            <p className="text-slate font-medium text-lg">Monitor learner satisfaction and address critical common concerns.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1 space-y-6">
              <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm space-y-6">
                <h3 className="text-sm font-black text-ink uppercase tracking-widest">Filters</h3>
                <div className="space-y-4">
                  {['All Ratings', '5 Stars', '4 Stars', '3 Stars & Below'].map((f, i) => (
                    <label key={i} className="flex items-center gap-3 cursor-pointer group">
                      <div className="w-5 h-5 rounded-lg border-2 border-gray-100 group-hover:border-primary transition-all flex items-center justify-center">
                        {i === 0 && <div className="w-2.5 h-2.5 bg-primary rounded-sm" />}
                      </div>
                      <span className="text-xs font-bold text-slate group-hover:text-ink">{f}</span>
                    </label>
                  ))}
                </div>
                <div className="pt-6 border-t border-gray-50">
                  <h3 className="text-sm font-black text-ink uppercase tracking-widest mb-4">Status</h3>
                  <div className="space-y-4">
                    {['New', 'Reviewed', 'Addressed'].map((s, i) => (
                      <label key={i} className="flex items-center gap-3 cursor-pointer group">
                        <div className="w-5 h-5 rounded-lg border-2 border-gray-100 group-hover:border-primary transition-all" />
                        <span className="text-xs font-bold text-slate group-hover:text-ink">{s}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-3 space-y-6">
              {allFeedback.map((f) => (
                <div key={f.id} className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-xl transition-all relative group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center font-black text-primary border border-gray-100">{f.user[0]}</div>
                      <div>
                        <h4 className="text-sm font-black text-ink">{f.user}</h4>
                        <span className="text-[10px] text-slate/40 uppercase tracking-widest font-black">{new Date(f.timestamp).toLocaleDateString()} • {f.moduleTitle}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-amber-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={cn("w-3 h-3", i < f.rating ? "fill-amber-500" : "text-gray-200")} />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-slate leading-relaxed font-medium pl-14">{f.comment}</p>

                  <div className="absolute top-8 right-8 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => {
                        const updated = modules.map(m => m.id === f.moduleId ? {
                          ...m,
                          learnerFeedback: m.learnerFeedback?.map(fb => fb.id === f.id ? { ...fb, status: 'reviewed' as const } : fb)
                        } : m);
                        setModules(updated);
                        localStorage.setItem('dec_modules', JSON.stringify(updated));
                        setToast({ message: 'Feedback marked as reviewed.', type: 'success' });
                      }}
                      className="p-2 bg-gray-50 text-slate hover:text-success rounded-xl hover:bg-success/5 transition-all" title="Mark as Reviewed"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                    </button>
                    <button className="p-2 bg-gray-50 text-slate hover:text-primary rounded-xl hover:bg-primary/5 transition-all" title="Reply to User">
                      <MessageSquare className="w-5 h-5" />
                    </button>
                  </div>

                  {f.status !== 'new' && (
                    <div className="absolute -top-2 -right-2 px-3 py-1 bg-gray-100 text-slate text-[8px] font-black uppercase tracking-[0.2em] rounded-lg border border-white shadow-sm">
                      {f.status}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    };

    const StaffReviewView = () => {
      const module = modules.find(m => m.id === selectedModuleId);
      if (!module) return <div className="p-20 text-center text-slate">No module selected.</div>;

      const [newComment, setNewComment] = useState('');

      const handleAddComment = () => {
        if (!newComment.trim()) return;
        const comment: CMSReviewComment = {
          id: 'c' + (module.reviewComments.length + 1),
          author: currentUser?.name || 'Reviewer',
          text: newComment,
          timestamp: new Date().toISOString(),
          resolved: false
        };
        const updated = modules.map(m => m.id === module.id ? { ...m, reviewComments: [...m.reviewComments, comment] } : m);
        setModules(updated);
        localStorage.setItem('dec_modules', JSON.stringify(updated));
        setNewComment('');
        setToast({ message: 'Comment added.', type: 'success' });
      };

      return (
        <div className="space-y-8 max-w-5xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <button onClick={() => setStaffView('review-queue')} className="p-3 hover:bg-white rounded-xl bg-white border border-gray-100 shadow-sm transition-all">
                <ArrowLeft className="w-5 h-5 text-slate" />
              </button>
              <div>
                <h1 className="text-3xl font-black text-ink font-serif tracking-tight">Reviewing: {module.title}</h1>
                <p className="text-slate font-medium">Provide feedback and manage approval state.</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  const updated = modules.map(m => m.id === module.id ? { ...m, status: 'draft' as const } : m);
                  setModules(updated);
                  localStorage.setItem('dec_modules', JSON.stringify(updated));
                  setStaffView('review-queue');
                  setToast({ message: 'Changes requested. Module returned to draft.', type: 'success' });
                }}
                className="px-6 py-3 bg-white text-red-600 border border-red-100 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-50 transition-all"
              >
                Request Changes
              </button>
              <button
                onClick={() => {
                  const updated = modules.map(m => m.id === module.id ? { ...m, status: 'published' as const } : m);
                  setModules(updated);
                  localStorage.setItem('dec_modules', JSON.stringify(updated));
                  setStaffView('publish-module'); // Show celebration
                }}
                className="px-8 py-3 bg-success text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-success/20 hover:scale-105 transition-all"
              >
                Approve & Publish
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-8 space-y-8">
                <h3 className="text-xl font-black text-ink font-serif flex items-center gap-3">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  Review Comments
                </h3>

                <div className="space-y-6">
                  {module.reviewComments.length > 0 ? module.reviewComments.map(comment => (
                    <div key={comment.id} className="flex gap-4 p-6 bg-gray-50 rounded-3xl border border-gray-100 relative group">
                      <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center border border-gray-100 font-black text-xs text-primary shadow-sm">
                        {comment.author[0]}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-black text-ink text-xs">{comment.author}</span>
                          <span className="text-[10px] text-slate/40">{new Date(comment.timestamp).toLocaleDateString()}</span>
                        </div>
                        <p className="text-sm text-slate leading-relaxed">{comment.text}</p>
                      </div>
                      <button className="absolute top-4 right-4 p-2 bg-white rounded-lg shadow-sm border border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
                        <CheckSquare className="w-4 h-4 text-slate hover:text-success" />
                      </button>
                    </div>
                  )) : (
                    <div className="py-12 text-center text-slate/40 italic">No comments yet.</div>
                  )}
                </div>

                <div className="pt-8 border-t border-gray-50">
                  <div className="relative">
                    <textarea
                      value={newComment}
                      onChange={e => setNewComment(e.target.value)}
                      placeholder="Add a feedback comment..."
                      className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 focus:ring-4 focus:ring-primary/5 outline-none font-medium text-sm h-32 resize-none"
                    />
                    <button
                      onClick={handleAddComment}
                      className="absolute bottom-4 right-4 bg-primary text-white p-2 rounded-xl shadow-lg hover:scale-110 transition-all"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-8">
                <h3 className="text-xl font-black text-ink font-serif mb-6">Module Summary</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Lessons', value: module.lessons.length, icon: BookOpen },
                    { label: 'Assessments', value: module.assessments.length, icon: FileCheck },
                    { label: 'Media Assets', value: module.assets.length, icon: Image },
                  ].map(stat => (
                    <div key={stat.label} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                      <div className="flex items-center gap-3">
                        <stat.icon className="w-4 h-4 text-slate" />
                        <span className="text-[10px] font-black uppercase text-slate tracking-widest">{stat.label}</span>
                      </div>
                      <span className="text-sm font-black text-ink">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setStaffView('preview-player')}
                className="w-full p-8 bg-gray-900 rounded-[40px] text-white flex flex-col items-center gap-4 hover:scale-[1.02] transition-all group"
              >
                <div className="w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center group-hover:bg-primary transition-colors">
                  <Eye className="w-8 h-8" />
                </div>
                <div className="text-center">
                  <span className="block text-[10px] font-black uppercase tracking-widest opacity-60">Visual Check</span>
                  <span className="text-lg font-serif">Open Preview Player</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      );
    };

    const StaffPublishView = () => {
      const module = modules.find(m => m.id === selectedModuleId);
      if (!module) return <div className="p-20 text-center text-slate">No module selected.</div>;

      return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center space-y-12 max-w-2xl mx-auto">
          <div className="relative">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 12 }}
              className="w-32 h-32 bg-success rounded-[40px] flex items-center justify-center shadow-2xl shadow-success/30 relative z-10"
            >
              <ShieldCheck className="w-16 h-16 text-white" />
            </motion.div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 w-32 h-32 border-2 border-dashed border-success/30 rounded-[40px]"
            />
          </div>

          <div className="space-y-4">
            <h1 className="text-5xl font-black text-ink font-serif tracking-tight">Module Published!</h1>
            <p className="text-slate text-xl font-medium">
              <span className="text-primary font-black uppercase text-xs tracking-widest">{module.title}</span> is now live in the learner catalog.
            </p>
          </div>

          <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm w-full grid grid-cols-2 gap-8">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase text-slate tracking-widest block">Publication Date</span>
              <span className="text-lg font-black text-ink">{new Date().toLocaleDateString()}</span>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase text-slate tracking-widest block">Artifact ID</span>
              <span className="text-lg font-black text-ink uppercase tracking-tighter">{module.courseCode}-v1</span>
            </div>
          </div>

          <button
            onClick={() => {
              setStaffView('modules');
              setSelectedModuleId(null);
            }}
            className="bg-primary text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest shadow-2xl shadow-primary/20 hover:-translate-y-1 transition-all"
          >
            Return to Module List
          </button>
        </div>
      );
    };

    const StaffPreviewPlayerView = () => {
      const module = modules.find(m => m.id === selectedModuleId);
      if (!module) return (
        <div className="p-20 text-center">
          <p className="text-slate">Please select a module first.</p>
          <button onClick={() => setStaffView('modules')} className="mt-4 text-primary font-bold">Back to Modules</button>
        </div>
      );

      const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
      const [currentLessonIdx, setCurrentLessonIdx] = useState(0);
      const [previewStage, setPreviewStage] = useState<'content' | 'assessment' | 'feedback' | 'completed'>('content');
      const [selectedAssessmentId, setSelectedAssessmentId] = useState<string | null>(null);
      const [assessmentAnswers, setAssessmentAnswers] = useState<Record<string, any>>({});
      const [feedbackAnswers, setFeedbackAnswers] = useState<Record<string, any>>({});

      const currentLesson = module.lessons[currentLessonIdx];

      return (
        <div className="h-[calc(100vh-140px)] flex flex-col">
          {/* Preview Header / Toolbar */}
          <div className="bg-white px-8 py-4 rounded-[32px] border border-gray-100 shadow-sm mb-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="px-3 py-1 bg-amber-100 text-amber-700 rounded-lg text-[8px] font-black uppercase tracking-widest flex items-center gap-2">
                <Eye className="w-3 h-3" /> Preview mode
              </div>
              <h2 className="text-sm font-black text-ink font-serif truncate max-w-[300px]">{module.title}</h2>
            </div>

            <div className="flex items-center bg-gray-50 p-1 rounded-2xl">
              <button
                onClick={() => setPreviewMode('desktop')}
                className={cn(
                  "flex items-center gap-2 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                  previewMode === 'desktop' ? "bg-white text-primary shadow-sm" : "text-slate/40 hover:text-slate"
                )}
              >
                <Layout className="w-4 h-4" /> Desktop
              </button>
              <button
                onClick={() => setPreviewMode('mobile')}
                className={cn(
                  "flex items-center gap-2 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                  previewMode === 'mobile' ? "bg-white text-primary shadow-sm" : "text-slate/40 hover:text-slate"
                )}
              >
                <Image className="w-4 h-4" /> Mobile
              </button>
            </div>

            <button
              onClick={() => setStaffView('module-overview')}
              className="p-3 hover:bg-gray-100 rounded-xl transition-all"
            >
              <X className="w-5 h-5 text-slate" />
            </button>
          </div>

          {/* Main Preview Area */}
          <div className="flex-1 flex gap-8 min-h-0">
            {/* Sidebar (Only Desktop) */}
            {previewMode === 'desktop' && (
              <div className="w-80 flex flex-col bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-gray-50 bg-gray-50/30">
                  <p className="text-[10px] font-black text-slate uppercase tracking-widest mb-1 opacity-40">Module Progress</p>
                  <div className="h-2 bg-white rounded-full overflow-hidden border border-gray-100">
                    <div
                      className="h-full bg-primary transition-all duration-1000"
                      style={{ width: `${((currentLessonIdx + 1) / (module.lessons.length || 1)) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                  {module.lessons.map((lesson, idx) => (
                    <button
                      key={lesson.id}
                      onClick={() => {
                        setCurrentLessonIdx(idx);
                        setPreviewStage('content');
                      }}
                      className={cn(
                        "w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all mb-2 relative group",
                        currentLessonIdx === idx && previewStage === 'content' ? "bg-primary/5 border border-primary/10" : "hover:bg-gray-50"
                      )}
                    >
                      <div className={cn(
                        "w-8 h-8 rounded-xl flex items-center justify-center font-black text-[10px] transition-all",
                        currentLessonIdx === idx && previewStage === 'content' ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-gray-50 text-slate"
                      )}>
                        {idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={cn("text-xs font-black truncate font-serif", currentLessonIdx === idx && previewStage === 'content' ? "text-ink" : "text-slate")}>{lesson.title}</p>
                        <p className="text-[9px] font-bold text-slate/40 uppercase tracking-widest mt-0.5">{lesson.status}</p>
                      </div>
                      {currentLessonIdx > idx && (
                        <CheckCircle2 className="w-4 h-4 text-success" />
                      )}
                    </button>
                  ))}

                  {/* Assessment Entry in Sidebar */}
                  {module.assessments.filter(a => a.type === 'post-test').map(as => (
                    <button
                      key={as.id}
                      onClick={() => {
                        setSelectedAssessmentId(as.id);
                        setPreviewStage('assessment');
                      }}
                      className={cn(
                        "w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all mt-4 border-t border-gray-100 pt-6",
                        selectedAssessmentId === as.id && previewStage === 'assessment' ? "bg-purple-50" : "hover:bg-gray-50"
                      )}
                    >
                      <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
                        <Award className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-black font-serif text-ink">Final Assessment</p>
                        <p className="text-[9px] font-bold text-slate/40 uppercase tracking-widest mt-0.5">Benchmarking</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Content Display Panel */}
            <div className={cn(
              "flex-1 overflow-hidden transition-all duration-500",
              previewMode === 'mobile' ? "flex justify-center bg-gray-900 rounded-[40px] p-6" : ""
            )}>
              <div className={cn(
                "bg-white overflow-y-auto custom-scrollbar relative",
                previewMode === 'mobile' ? "w-[375px] h-full rounded-[30px] shadow-2xl" : "h-full rounded-[40px] border border-gray-100 shadow-sm"
              )}>
                {previewMode === 'mobile' && (
                  <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-md px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <span className="text-[10px] font-black text-ink uppercase tracking-widest">9:41</span>
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full border border-ink/20" />
                      <div className="w-3 h-3 rounded-full border border-ink/20" />
                    </div>
                  </div>
                )}

                <div className={cn("p-12", previewMode === 'mobile' ? "p-6" : "")}>
                  {previewStage === 'content' && (
                    <motion.div
                      key={currentLesson?.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-12"
                    >
                      <div className="space-y-4">
                        <span className="text-[10px] font-black text-primary uppercase tracking-widest">Lesson {currentLessonIdx + 1}</span>
                        <h1 className="text-4xl font-black text-ink font-serif leading-tight">{currentLesson?.title || 'No Lesson Data'}</h1>
                        <p className="text-slate text-lg italic leading-relaxed border-l-2 border-gray-100 pl-6 py-2">{currentLesson?.purpose}</p>
                      </div>

                      <div className="space-y-16">
                        {currentLesson?.blocks.map((block, bIdx) => (
                          <div key={bIdx} className="relative group/block">
                            <Blocks.BlockRenderer block={block} />
                          </div>
                        ))}
                      </div>

                      <div className="pt-20 border-t border-gray-100 flex items-center justify-between">
                        <button
                          disabled={currentLessonIdx === 0}
                          onClick={() => setCurrentLessonIdx(prev => prev - 1)}
                          className="flex items-center gap-3 text-slate font-black text-[10px] uppercase tracking-widest disabled:opacity-20 hover:text-primary transition-all"
                        >
                          <ChevronLeft className="w-5 h-5" /> Previous Lesson
                        </button>

                        {currentLessonIdx < module.lessons.length - 1 ? (
                          <button
                            onClick={() => setCurrentLessonIdx(prev => prev + 1)}
                            className="bg-primary text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 flex items-center gap-3 hover:translate-x-1 transition-all"
                          >
                            Next Lesson <ArrowRight className="w-5 h-5" />
                          </button>
                        ) : module.assessments.some(a => a.type === 'post-test') ? (
                          <button
                            onClick={() => {
                              setSelectedAssessmentId(module.assessments.find(a => a.type === 'post-test')?.id || null);
                              setPreviewStage('assessment');
                            }}
                            className="bg-purple-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-purple-600/20 flex items-center gap-3 hover:scale-105 transition-all"
                          >
                            Begin Final Assessment <Award className="w-5 h-5" />
                          </button>
                        ) : (
                          <button
                            onClick={() => setPreviewStage('feedback')}
                            className="bg-success text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-success/20 flex items-center gap-3 hover:scale-105 transition-all"
                          >
                            Complete Module <CheckCircle2 className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {previewStage === 'assessment' && selectedAssessmentId && (
                    <div className="max-w-3xl mx-auto py-12 space-y-12">
                      <div className="text-center space-y-4 mb-20">
                        <div className="w-20 h-20 bg-purple-50 text-purple-600 rounded-[32px] flex items-center justify-center mx-auto shadow-xl shadow-purple-600/10">
                          <Award className="w-10 h-10" />
                        </div>
                        <h2 className="text-4xl font-black text-ink font-serif">{module.assessments.find(a => a.id === selectedAssessmentId)?.title}</h2>
                        <p className="text-slate font-medium">Please answer all questions to complete the module.</p>
                      </div>

                      {module.assessments.find(a => a.id === selectedAssessmentId)?.questions.map((q, qIdx) => (
                        <div key={q.id} className="space-y-8 p-10 bg-gray-50/50 rounded-[40px] border border-gray-100">
                          <div className="flex justify-between items-start gap-4">
                            <p className="text-2xl font-black text-ink font-serif leading-tight">{qIdx + 1}. {q.question}</p>
                            <span className="text-[8px] font-black uppercase tracking-widest px-2 py-1 bg-white border border-gray-200 rounded-lg text-slate/40">{q.type}</span>
                          </div>

                          {q.type === 'short-text' ? (
                            <input
                              type="text"
                              placeholder="Type your answer..."
                              value={assessmentAnswers[q.id] || ''}
                              onChange={(e) => setAssessmentAnswers({ ...assessmentAnswers, [q.id]: e.target.value })}
                              className="w-full p-6 bg-white border border-gray-100 rounded-3xl outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-bold"
                            />
                          ) : (
                            <div className="space-y-3">
                              {q.options?.map((opt, oIdx) => {
                                const isSelected = q.type === 'multi-select'
                                  ? (assessmentAnswers[q.id] || []).includes(oIdx)
                                  : assessmentAnswers[q.id] === oIdx;

                                return (
                                  <button
                                    key={oIdx}
                                    onClick={() => {
                                      if (q.type === 'multi-select') {
                                        const current = assessmentAnswers[q.id] || [];
                                        const next = current.includes(oIdx)
                                          ? current.filter((v: number) => v !== oIdx)
                                          : [...current, oIdx];
                                        setAssessmentAnswers({ ...assessmentAnswers, [q.id]: next });
                                      } else {
                                        setAssessmentAnswers({ ...assessmentAnswers, [q.id]: oIdx });
                                      }
                                    }}
                                    className={cn(
                                      "w-full p-6 border-2 rounded-3xl text-left transition-all flex items-center gap-4 group",
                                      isSelected ? "border-primary bg-primary/5" : "bg-white border-gray-100 hover:border-primary/30"
                                    )}
                                  >
                                    <div className={cn(
                                      "w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs transition-colors",
                                      isSelected ? "bg-primary text-white" : "bg-gray-50 text-slate group-hover:text-primary"
                                    )}>
                                      {q.type === 'multi-select' ? (isSelected ? <CheckSquare className="w-5 h-5" /> : <div className="w-4 h-4 rounded border-2 border-slate/20" />) : String.fromCharCode(65 + oIdx)}
                                    </div>
                                    <span className={cn("text-sm font-bold", isSelected ? "text-primary" : "text-ink")}>{opt}</span>
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      ))}

                      <button
                        onClick={() => {
                          setPreviewStage('feedback');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="w-full bg-ink text-white py-6 rounded-3xl font-black uppercase tracking-widest shadow-2xl shadow-ink/20 mt-12 hover:scale-[1.02] transition-all"
                      >
                        Submit Assessment
                      </button>
                    </div>
                  )}

                  {previewStage === 'feedback' && (
                    <div className="max-w-2xl mx-auto py-12 space-y-12 text-center">
                      <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-[32px] flex items-center justify-center mx-auto shadow-xl shadow-emerald-600/10 mb-8">
                        <MessageSquare className="w-10 h-10" />
                      </div>
                      <h2 className="text-4xl font-black text-ink font-serif">{module.feedback?.title || 'Module Feedback'}</h2>
                      <p className="text-slate text-lg">Your feedback helps us improve our e-learning platform.</p>

                      <div className="space-y-10 text-left mt-20">
                        {module.feedback?.items.map((item, iIdx) => (
                          <div key={item.id} className="space-y-6">
                            <p className="text-xl font-black text-ink font-serif">{iIdx + 1}. {item.text}</p>
                            {item.type === 'likert' && (
                              <div className="flex justify-between gap-2">
                                {[1, 2, 3, 4, 5].map(n => (
                                  <button
                                    key={n}
                                    onClick={() => setFeedbackAnswers({ ...feedbackAnswers, [item.id]: n })}
                                    className={cn(
                                      "w-12 h-12 rounded-xl border transition-all font-black",
                                      feedbackAnswers[item.id] === n ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" : "bg-gray-50 border-gray-100 text-slate hover:bg-paper"
                                    )}
                                  >
                                    {n}
                                  </button>
                                ))}
                              </div>
                            )}
                            {item.type === 'multiple-choice' && (
                              <div className="space-y-2">
                                {item.options?.map((opt, oIdx) => (
                                  <button
                                    key={oIdx}
                                    onClick={() => setFeedbackAnswers({ ...feedbackAnswers, [item.id]: opt })}
                                    className={cn(
                                      "w-full p-4 border rounded-2xl text-left transition-all text-sm font-bold flex items-center gap-3",
                                      feedbackAnswers[item.id] === opt ? "bg-primary/5 border-primary text-primary" : "bg-white border-gray-100 text-slate hover:border-primary/20"
                                    )}
                                  >
                                    <div className={cn(
                                      "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                                      feedbackAnswers[item.id] === opt ? "bg-primary text-white" : "bg-gray-50 text-slate"
                                    )}>
                                      {String.fromCharCode(65 + oIdx)}
                                    </div>
                                    {opt}
                                  </button>
                                ))}
                              </div>
                            )}
                            {item.type === 'open' && (
                              <textarea
                                className="w-full p-6 bg-gray-50 border border-gray-100 rounded-3xl outline-none focus:ring-4 focus:ring-primary/5 focus:bg-white focus:border-primary transition-all h-32 resize-none font-medium"
                                placeholder="Type your response..."
                                value={feedbackAnswers[item.id] || ''}
                                onChange={(e) => setFeedbackAnswers({ ...feedbackAnswers, [item.id]: e.target.value })}
                              ></textarea>
                            )}
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={() => setPreviewStage('completed')}
                        className="w-full bg-primary text-white py-6 rounded-3xl font-black uppercase tracking-widest shadow-2xl shadow-primary/20 mt-12 hover:scale-[1.02] transition-all"
                      >
                        Complete Preview
                      </button>
                    </div>
                  )}

                  {previewStage === 'completed' && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="max-w-2xl mx-auto py-20 text-center space-y-8"
                    >
                      <div className="w-32 h-32 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto mb-10 border-4 border-white shadow-2xl shadow-success/10">
                        <CheckCircle2 className="w-16 h-16" />
                      </div>
                      <h2 className="text-5xl font-black text-ink font-serif">You're All Set!</h2>
                      <p className="text-slate text-xl leading-relaxed">The mock learner experience is complete. All lessons viewed, assessment submitted, and feedback collected.</p>
                      <div className="pt-10 flex flex-col gap-4">
                        <button
                          onClick={() => setStaffView('module-overview')}
                          className="bg-ink text-white py-6 rounded-3xl font-black uppercase tracking-widest shadow-2xl shadow-ink/20 hover:scale-[1.02] transition-all"
                        >
                          Return to Module Overview
                        </button>
                        <button
                          onClick={() => {
                            setCurrentLessonIdx(0);
                            setPreviewStage('content');
                            setAssessmentAnswers({});
                            setFeedbackAnswers({});
                          }}
                          className="py-6 text-primary font-black uppercase tracking-widest hover:underline"
                        >
                          Restart Preview
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    };

    const StaffDashboardView = () => {
      const actionCards = [
        { title: 'Create Module', desc: 'Build a new learning experience', icon: Plus, color: 'bg-primary', action: () => setStaffView('create-module') },
        { title: 'Open Drafts', desc: 'Continue working on saved content', icon: FileEdit, color: 'bg-amber-500', action: () => setStaffView('modules') },
        { title: 'Media Library', desc: 'Manage images and video', icon: Library, color: 'bg-emerald-50 text-emerald-500', action: () => setStaffView('media-library') },
        {
          title: 'Preview', desc: 'View content as a learner', icon: Eye, color: 'bg-blue-500', action: () => {
            if (selectedModuleId) setStaffView('preview-player');
            else setStaffView('modules');
          }
        },
        { title: 'QA / Review', desc: 'Approve pending content', icon: CheckSquare, color: 'bg-purple-500', action: () => setStaffView('review-queue') },
        { title: 'Publish Queue', desc: 'Manage scheduled releases', icon: Send, color: 'bg-success', action: () => setStaffView('modules') },
      ];

      const recentlyEdited = [...modules]
        .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
        .slice(0, 3);

      return (
        <div className="space-y-12">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black text-ink font-serif mb-2">Welcome back, {currentUser.name.split(' ')[0]}</h1>
              <p className="text-slate text-lg">Manage your courses and content from one central workspace.</p>
            </div>
            <button
              onClick={() => setStaffView('create-module')}
              className="bg-primary text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-3"
            >
              <Plus className="w-5 h-5" />
              Create Module
            </button>
          </div>

          {/* Action Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {actionCards.map((card, i) => (
              <button
                key={i}
                onClick={card.action}
                className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all text-left group relative overflow-hidden"
              >
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-white shadow-lg", card.color)}>
                  <card.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-black text-ink mb-2 font-serif">{card.title}</h3>
                <p className="text-slate/60 text-sm leading-relaxed">{card.desc}</p>
                <div className="absolute bottom-0 right-0 p-8 opacity-0 group-hover:opacity-10 transition-opacity">
                  <card.icon className="w-24 h-24" />
                </div>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
              {/* Recently Edited Modules */}
              <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-10 py-8 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="text-xl font-black text-ink font-serif">Recently Edited Modules</h3>
                  <button
                    onClick={() => setStaffView('modules')}
                    className="text-xs font-black text-primary uppercase tracking-widest hover:underline"
                  >
                    View All
                  </button>
                </div>
                <div className="divide-y divide-gray-100">
                  {recentlyEdited.map((m) => (
                    <div key={m.id} className="px-10 py-6 flex items-center justify-between hover:bg-gray-50 transition-colors group">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary/5 text-primary rounded-xl flex items-center justify-center font-black text-[10px]">
                          {m.courseCode.split('-')[1] || '??'}
                        </div>
                        <div>
                          <p className="text-sm font-black text-ink font-serif group-hover:text-primary transition-colors">{m.title}</p>
                          <p className="text-[10px] font-bold text-slate/40 uppercase tracking-widest mt-1">{m.courseCode} • {m.status}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedModuleId(m.id);
                          setStaffView('module-overview');
                        }}
                        className="p-2 hover:bg-primary/5 text-slate hover:text-primary rounded-lg transition-all"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { title: 'Active Modules', value: modules.filter(m => m.status === 'published').length, icon: BookOpen, color: 'text-primary', bg: 'bg-primary/5' },
                  { title: 'Pending Reviews', value: modules.filter(m => m.status === 'review').length, icon: History, color: 'text-amber-600', bg: 'bg-amber-50' },
                  { title: 'Total Learners', value: modules.reduce((acc, m) => acc + (m.analytics?.enrollments || 0), 0).toLocaleString(), icon: Users, color: 'text-success', bg: 'bg-success/5' },
                ].map((stat, i) => (
                  <div key={i} className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
                    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform", stat.bg, stat.color)}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                    <p className="text-[10px] font-black text-slate/40 uppercase tracking-widest mb-1">{stat.title}</p>
                    <p className="text-3xl font-black text-ink">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-12">
              {/* Recent Activity */}
              <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden h-full">
                <div className="px-10 py-8 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="text-xl font-black text-ink font-serif">Audit Logs</h3>
                </div>
                <div className="divide-y divide-gray-100">
                  {auditLogs.slice(0, 5).map((log) => (
                    <div key={log.id} className="px-10 py-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-1",
                          log.severity === 'info' ? "bg-blue-50 text-blue-600" : "bg-amber-50 text-amber-600"
                        )}>
                          <History className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-ink leading-relaxed">
                            <span className="text-primary">{log.userName}</span> {log.action} <span className="text-slate/60">on</span> {log.target}
                          </p>
                          <p className="text-[9px] text-slate/40 font-black uppercase tracking-widest mt-1">
                            {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-6 bg-gray-50 border-t border-gray-100 text-center">
                  <button
                    onClick={() => setStaffView('audit')}
                    className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline"
                  >
                    View All Logs
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    };

    const StaffModulesListView = () => {
      const [search, setSearch] = useState('');
      const [statusFilter, setStatusFilter] = useState<ModuleStatus | 'all'>('all');
      const [languageFilter, setLanguageFilter] = useState<string>('all');

      const filteredModules = modules.filter(m => {
        const matchesSearch = m.title.toLowerCase().includes(search.toLowerCase()) || m.courseCode.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === 'all' || m.status === statusFilter;
        const matchesLanguage = languageFilter === 'all' || m.language === languageFilter;
        return matchesSearch && matchesStatus && matchesLanguage;
      });

      const statusColors: Record<ModuleStatus, string> = {
        draft: 'bg-gray-100 text-gray-600 border-gray-200',
        review: 'bg-amber-50 text-amber-600 border-amber-100',
        preview: 'bg-blue-50 text-blue-600 border-blue-100',
        published: 'bg-success/10 text-success border-success/20',
        retired: 'bg-red-50 text-red-600 border-red-100'
      };

      const handleEditModule = (id: string) => {
        setSelectedModuleId(id);
        setStaffView('module-overview');
      };

      return (
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black text-ink font-serif mb-2">Modules Library</h1>
              <p className="text-slate text-lg">Manage and organize all learning content.</p>
            </div>
            <button
              onClick={() => setStaffView('create-module')}
              className="bg-primary text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-3"
            >
              <Plus className="w-5 h-5" />
              Create Module
            </button>
          </div>

          {/* Filters Bar */}
          <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-6">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate/40" />
              <input
                type="text"
                placeholder="Search by title or code..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-16 pr-6 py-4 bg-paper rounded-2xl border-none focus:ring-4 focus:ring-primary/5 outline-none text-sm font-bold"
              />
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="flex items-center gap-2 bg-paper px-4 py-2 rounded-2xl border border-gray-100">
                <Filter className="w-4 h-4 text-slate/40" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="bg-transparent border-none text-xs font-black uppercase tracking-widest outline-none cursor-pointer"
                >
                  <option value="all">All Statuses</option>
                  <option value="draft">Draft</option>
                  <option value="review">Review</option>
                  <option value="preview">Preview</option>
                  <option value="published">Published</option>
                  <option value="retired">Retired</option>
                </select>
              </div>
              <div className="flex items-center gap-2 bg-paper px-4 py-2 rounded-2xl border border-gray-100">
                <Globe className="w-4 h-4 text-slate/40" />
                <select
                  value={languageFilter}
                  onChange={(e) => setLanguageFilter(e.target.value)}
                  className="bg-transparent border-none text-xs font-black uppercase tracking-widest outline-none cursor-pointer"
                >
                  <option value="all">All Languages</option>
                  <option value="English">English</option>
                  <option value="French">French</option>
                  <option value="Spanish">Spanish</option>
                  <option value="Arabic">Arabic</option>
                </select>
              </div>
            </div>
          </div>

          {/* Modules Table */}
          <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-10 py-6 text-[10px] font-black text-slate/40 uppercase tracking-[0.2em]">Module Details</th>
                    <th className="px-10 py-6 text-[10px] font-black text-slate/40 uppercase tracking-[0.2em]">Status</th>
                    <th className="px-10 py-6 text-[10px] font-black text-slate/40 uppercase tracking-[0.2em]">Audience</th>
                    <th className="px-10 py-6 text-[10px] font-black text-slate/40 uppercase tracking-[0.2em]">Last Updated</th>
                    <th className="px-10 py-6 text-[10px] font-black text-slate/40 uppercase tracking-[0.2em]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredModules.length > 0 ? filteredModules.map((m) => (
                    <tr key={m.id} className="hover:bg-gray-50/50 transition-colors group cursor-pointer" onClick={() => handleEditModule(m.id)}>
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-primary/5 text-primary rounded-xl flex items-center justify-center font-black text-xs">
                            {m.courseCode.split('-')[1] || '??'}
                          </div>
                          <div>
                            <p className="text-lg font-black text-ink font-serif group-hover:text-primary transition-colors">{m.title}</p>
                            <p className="text-xs font-bold text-slate/40 uppercase tracking-widest mt-1">{m.courseCode} • {m.language}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <div className={cn("inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border", statusColors[m.status])}>
                          {m.status}
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <span className="text-sm font-bold text-slate">{m.audience}</span>
                      </td>
                      <td className="px-10 py-8">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-ink">{new Date(m.lastUpdated).toLocaleDateString()}</span>
                          <span className="text-[10px] font-black text-slate/40 uppercase tracking-widest mt-1">by {m.owner}</span>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => handleEditModule(m.id)}
                            className="p-3 hover:bg-primary/5 text-slate hover:text-primary rounded-xl transition-all"
                            title="Edit"
                          >
                            <FileEdit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedModuleId(m.id);
                              setStaffView('preview-player');
                            }}
                            className="p-3 hover:bg-blue-50 text-slate hover:text-blue-600 rounded-xl transition-all"
                            title="Preview"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <button className="p-3 hover:bg-gray-100 text-slate hover:text-ink rounded-xl transition-all">
                            <MoreVertical className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={5} className="px-10 py-32 text-center">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                          <Search className="w-10 h-10 text-slate/20" />
                        </div>
                        <h4 className="text-xl font-black text-ink font-serif mb-2">No modules found</h4>
                        <p className="text-slate">Try adjusting your search or filters.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    };

    const [isModuleFormDirty, setIsModuleFormDirty] = useState(false);
    const [pendingStaffView, setPendingStaffView] = useState<typeof staffView | null>(null);

    const handleSidebarClick = (viewId: typeof staffView) => {
      if (staffView === 'create-module' && isModuleFormDirty) {
        setPendingStaffView(viewId);
      } else {
        setStaffView(viewId);
      }
    };

    const StaffModuleOverviewView = () => {
      const module = modules.find(m => m.id === selectedModuleId);
      if (!module) return null;

      const [formData, setFormData] = useState({ ...module });
      const [isSaving, setIsSaving] = useState(false);
      const [activeTab, setActiveTab] = useState<'overview' | 'lessons' | 'rules' | 'settings'>('overview');

      const handleSave = async () => {
        setIsSaving(true);
        await new Promise(r => setTimeout(r, 800));
        const updatedModules = modules.map(m =>
          m.id === module.id ? { ...formData, lastUpdated: new Date().toISOString() } : m
        );
        setModules(updatedModules);
        setIsSaving(false);
        setToast({ message: 'Module updated successfully!', type: 'success' });
      };

      const handleAddLesson = () => {
        const newLesson: CMSLesson = {
          id: 'l' + Math.random().toString(36).substr(2, 9),
          title: 'New Lesson',
          order: formData.lessons.length + 1,
          status: 'draft',
          purpose: 'New lesson purpose...',
          blocks: []
        };
        setFormData({ ...formData, lessons: [...formData.lessons, newLesson] });
      };

      const handleDeleteModule = () => {
        if (window.confirm('Are you sure you want to delete this module? This action cannot be undone.')) {
          setModules(modules.filter(m => m.id !== module.id));
          setStaffView('modules');
          setToast({ message: 'Module deleted successfully', type: 'success' });
        }
      };

      const handleCreateNewVersion = () => {
        const newModule: CMSModule = {
          ...module,
          id: 'm' + Math.random().toString(36).substr(2, 9),
          title: `${module.title} (v2)`,
          status: 'draft',
          lastUpdated: new Date().toISOString(),
          analytics: undefined,
          learnerFeedback: [],
          reviewComments: [],
          qaResults: []
        };
        const updatedModules = [...modules, newModule];
        setModules(updatedModules);
        localStorage.setItem('dec_modules', JSON.stringify(updatedModules));
        setSelectedModuleId(newModule.id);
        setToast({ message: 'New draft version created!', type: 'success' });
      };

      const statusColors: Record<ModuleStatus, string> = {
        draft: 'bg-gray-100 text-gray-600 border-gray-200',
        review: 'bg-amber-50 text-amber-600 border-amber-100',
        preview: 'bg-blue-50 text-blue-600 border-blue-100',
        published: 'bg-success/10 text-success border-success/20',
        retired: 'bg-red-50 text-red-600 border-red-100'
      };

      return (
        <div className="space-y-10">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <button
                onClick={() => setStaffView('modules')}
                className="p-4 hover:bg-white rounded-2xl transition-all shadow-sm border border-gray-100 bg-white"
              >
                <ChevronLeft className="w-6 h-6 text-slate" />
              </button>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-4xl font-black text-ink font-serif">{formData.title}</h1>
                  <div className={cn("px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border", statusColors[formData.status])}>
                    {formData.status}
                  </div>
                </div>
                <p className="text-slate text-lg">{formData.courseCode} • Last updated {new Date(formData.lastUpdated).toLocaleDateString()} by {formData.owner}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {formData.status === 'published' && (
                <button
                  onClick={handleCreateNewVersion}
                  className="bg-paper text-ink border border-gray-200 px-6 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-gray-50 transition-all flex items-center gap-3"
                >
                  <Copy className="w-5 h-5" />
                  New Version
                </button>
              )}
              <button
                onClick={() => setStaffView('preview-player')}
                className="bg-white text-primary border border-primary/20 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-primary/5 transition-all flex items-center gap-3"
              >
                <Eye className="w-5 h-5" />
                Preview
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-primary text-white px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-3 disabled:opacity-30"
              >
                {isSaving ? <RotateCcw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                Save Changes
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-8 border-b border-gray-200">
            {[
              { id: 'overview', label: 'Overview', icon: Info },
              { id: 'lessons', label: 'Lessons', icon: BookOpen },
              { id: 'rules', label: 'Completion Rules', icon: CheckSquare },
              { id: 'settings', label: 'Settings', icon: Settings },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "flex items-center gap-2 px-4 py-4 text-xs font-black uppercase tracking-widest border-b-2 transition-all",
                  activeTab === tab.id ? "border-primary text-primary" : "border-transparent text-slate/40 hover:text-ink"
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  {formData.status === 'published' && formData.analytics && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      {[
                        { label: 'Total Learners', value: modules.reduce((acc, m) => acc + (m.analytics?.enrollments || 0), 0).toLocaleString(), icon: Users, color: 'text-primary' },
                        { label: 'Completion Rate', value: `${Math.round((modules.reduce((acc, m) => acc + (m.analytics?.completions || 0), 0) / Math.max(1, modules.reduce((acc, m) => acc + (m.analytics?.enrollments || 0), 0))) * 100)}%`, icon: Target, color: 'text-success' },
                        { label: 'Avg Rating', value: (modules.reduce((acc, m) => acc + (m.analytics?.rating || 0), 0) / Math.max(1, modules.filter(m => m.analytics).length)).toFixed(1), icon: Star, color: 'text-amber-500' },
                      ].map((stat, i) => (
                        <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                          <div className={cn("w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center", stat.color)}>
                            <stat.icon className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-[8px] font-black uppercase text-slate tracking-widest leading-none mb-1">{stat.label}</p>
                            <p className="text-lg font-black text-ink leading-none">{stat.value}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate uppercase tracking-widest ml-1">Module Title</label>
                        <input
                          type="text"
                          value={formData.title}
                          onChange={e => setFormData({ ...formData, title: e.target.value })}
                          className="w-full px-6 py-4 bg-paper rounded-2xl border border-gray-100 focus:ring-4 focus:ring-primary/5 outline-none font-bold"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate uppercase tracking-widest ml-1">Course Code</label>
                        <input
                          type="text"
                          value={formData.courseCode}
                          onChange={e => setFormData({ ...formData, courseCode: e.target.value })}
                          className="w-full px-6 py-4 bg-paper rounded-2xl border border-gray-100 focus:ring-4 focus:ring-primary/5 outline-none font-bold"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate uppercase tracking-widest ml-1">Summary</label>
                      <textarea
                        value={formData.summary}
                        onChange={e => setFormData({ ...formData, summary: e.target.value })}
                        className="w-full px-6 py-4 bg-paper rounded-2xl border border-gray-100 focus:ring-4 focus:ring-primary/5 outline-none font-bold h-32 resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate uppercase tracking-widest ml-1">Audience</label>
                        <select
                          value={formData.audience}
                          onChange={e => setFormData({ ...formData, audience: e.target.value })}
                          className="w-full px-6 py-4 bg-paper rounded-2xl border border-gray-100 focus:ring-4 focus:ring-primary/5 outline-none font-bold"
                        >
                          <option>All Staff</option>
                          <option>Program Officers</option>
                          <option>Management</option>
                          <option>External Partners</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate uppercase tracking-widest ml-1">Language</label>
                        <select
                          value={formData.language}
                          onChange={e => setFormData({ ...formData, language: e.target.value })}
                          className="w-full px-6 py-4 bg-paper rounded-2xl border border-gray-100 focus:ring-4 focus:ring-primary/5 outline-none font-bold"
                        >
                          <option>English</option>
                          <option>French</option>
                          <option>Spanish</option>
                          <option>Arabic</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate uppercase tracking-widest ml-1">Est. Duration</label>
                        <input
                          type="text"
                          value={formData.estimatedDuration}
                          onChange={e => setFormData({ ...formData, estimatedDuration: e.target.value })}
                          className="w-full px-6 py-4 bg-paper rounded-2xl border border-gray-100 focus:ring-4 focus:ring-primary/5 outline-none font-bold"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm space-y-8">
                    <h3 className="text-xl font-black text-ink font-serif">Feature Toggles</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        { id: 'hasPreTest', label: 'Enable Pre-Test', icon: FileEdit },
                        { id: 'hasPostTest', label: 'Enable Post-Test', icon: FileCheck },
                        { id: 'hasCertificate', label: 'Issue Certificate', icon: Award },
                        { id: 'hasFeedback', label: 'Collect Feedback', icon: MessageSquare },
                      ].map((feature) => (
                        <label key={feature.id} className="flex items-center justify-between p-6 bg-paper rounded-2xl border border-gray-100 cursor-pointer hover:border-primary/30 transition-all group">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-gray-100 group-hover:text-primary transition-colors">
                              <feature.icon className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-black text-ink uppercase tracking-widest">{feature.label}</span>
                          </div>
                          <div className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={(formData as any)[feature.id]}
                              onChange={e => setFormData({ ...formData, [feature.id]: e.target.checked })}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'lessons' && (
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-black text-ink font-serif">Lesson Structure</h3>
                    <button
                      onClick={handleAddLesson}
                      className="bg-primary/10 text-primary px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-all flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Lesson
                    </button>
                  </div>
                  <div className="space-y-4">
                    {formData.lessons.length > 0 ? formData.lessons.sort((a, b) => a.order - b.order).map((lesson) => (
                      <div key={lesson.id} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
                        <div className="flex items-center gap-6">
                          <div className="w-10 h-10 bg-gray-50 text-slate/40 rounded-xl flex items-center justify-center font-black text-xs border border-gray-100">
                            {lesson.order}
                          </div>
                          <div>
                            <h4 className="font-black text-ink font-serif">{lesson.title}</h4>
                            <div className="flex items-center gap-3 mt-1">
                              <span className={cn(
                                "text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border",
                                lesson.status === 'published' ? "bg-success/5 text-success border-success/10" : "bg-gray-50 text-slate/40 border-gray-100"
                              )}>
                                {lesson.status}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedLessonId(lesson.id);
                              setStaffView('lesson-editor');
                            }}
                            className="p-3 hover:bg-primary/5 text-slate hover:text-primary rounded-xl transition-all"
                            title="Edit Lesson"
                          >
                            <FileEdit className="w-5 h-5" />
                          </button>
                          <button className="p-3 hover:bg-blue-50 text-slate hover:text-blue-600 rounded-xl transition-all" title="Preview Lesson">
                            <Eye className="w-5 h-5" />
                          </button>
                          <button className="p-3 hover:bg-red-50 text-slate hover:text-red-600 rounded-xl transition-all" title="Delete Lesson">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    )) : (
                      <div className="p-20 text-center bg-white rounded-[40px] border border-gray-100 border-dashed">
                        <p className="text-slate">No lessons added to this module yet.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'rules' && (
                <div className="space-y-8">
                  <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm space-y-10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                        <CheckSquare className="w-5 h-5" />
                      </div>
                      <h3 className="text-2xl font-black text-ink font-serif">Completion Rules Builder</h3>
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-center justify-between p-6 bg-paper rounded-2xl border border-gray-100">
                        <div>
                          <p className="text-sm font-black text-ink uppercase tracking-widest">Require All Lessons</p>
                          <p className="text-xs text-slate mt-1">Learner must complete every lesson in the module.</p>
                        </div>
                        <div className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.completionRules.requireAllLessons}
                            onChange={e => setFormData({
                              ...formData,
                              completionRules: { ...formData.completionRules, requireAllLessons: e.target.checked }
                            })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-6 bg-paper rounded-2xl border border-gray-100">
                        <div>
                          <p className="text-sm font-black text-ink uppercase tracking-widest">Require Final Assessment</p>
                          <p className="text-xs text-slate mt-1">Learner must pass the post-test to complete.</p>
                        </div>
                        <div className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.completionRules.requireFinalAssessment}
                            onChange={e => setFormData({
                              ...formData,
                              completionRules: { ...formData.completionRules, requireFinalAssessment: e.target.checked }
                            })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </div>
                      </div>

                      {formData.completionRules.requireFinalAssessment && (
                        <div className="p-6 bg-paper rounded-2xl border border-gray-100 space-y-4">
                          <p className="text-sm font-black text-ink uppercase tracking-widest">Minimum Passing Score (%)</p>
                          <div className="flex items-center gap-4">
                            <input
                              type="range"
                              min="0"
                              max="100"
                              step="5"
                              value={formData.completionRules.minimumPassingScore}
                              onChange={e => setFormData({
                                ...formData,
                                completionRules: { ...formData.completionRules, minimumPassingScore: parseInt(e.target.value) }
                              })}
                              className="flex-1 accent-primary"
                            />
                            <span className="w-12 text-center font-black text-primary">{formData.completionRules.minimumPassingScore}%</span>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between p-6 bg-paper rounded-2xl border border-gray-100">
                        <div>
                          <p className="text-sm font-black text-ink uppercase tracking-widest">Require Feedback</p>
                          <p className="text-xs text-slate mt-1">Learner must submit feedback before completion.</p>
                        </div>
                        <div className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.completionRules.requireFeedback}
                            onChange={e => setFormData({
                              ...formData,
                              completionRules: { ...formData.completionRules, requireFeedback: e.target.checked }
                            })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-6 bg-paper rounded-2xl border border-gray-100">
                        <div>
                          <p className="text-sm font-black text-ink uppercase tracking-widest">Mandatory Blocks</p>
                          <p className="text-xs text-slate mt-1">Require all blocks marked as mandatory to be viewed.</p>
                        </div>
                        <div className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.completionRules.requireAllMandatoryBlocks}
                            onChange={e => setFormData({
                              ...formData,
                              completionRules: { ...formData.completionRules, requireAllMandatoryBlocks: e.target.checked }
                            })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="space-y-8">
                  <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm space-y-8">
                    <h3 className="text-2xl font-black text-ink font-serif">Module Status & Visibility</h3>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate uppercase tracking-widest ml-1">Current Status</label>
                        <select
                          value={formData.status}
                          onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                          className="w-full px-6 py-4 bg-paper rounded-2xl border border-gray-100 focus:ring-4 focus:ring-primary/5 outline-none font-bold"
                        >
                          <option value="draft">Draft</option>
                          <option value="review">Review</option>
                          <option value="preview">Preview</option>
                          <option value="published">Published</option>
                          <option value="retired">Retired</option>
                        </select>
                      </div>
                      <div className="p-6 bg-red-50 rounded-2xl border border-red-100">
                        <h4 className="text-sm font-black text-red-600 uppercase tracking-widest mb-2">Danger Zone</h4>
                        <p className="text-xs text-red-600/60 mb-4">Deleting a module is permanent and cannot be undone.</p>
                        <button
                          onClick={handleDeleteModule}
                          className="bg-red-600 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-red-700 transition-all"
                        >
                          Delete Module
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-8">
              {/* Quick Links Area */}
              <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm space-y-6">
                <h3 className="text-lg font-black text-ink font-serif">Quick Actions</h3>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { label: 'Lessons', icon: BookOpen, color: 'text-primary' },
                    { label: 'Media & Resources', icon: Library, color: 'text-slate', id: 'media-library' },
                    { label: 'Assessments', icon: FileCheck, color: 'text-amber-600', id: 'assessment-builder' },
                    { label: 'Feedback', icon: MessageSquare, color: 'text-purple-600', id: 'feedback-builder' },
                    { label: 'Preview', icon: Eye, color: 'text-blue-600', id: 'preview-player' },
                    { label: 'QA / Review', icon: CheckSquare, color: 'text-indigo-600', id: 'qa-checklist' },
                    { label: 'Publish', icon: Send, color: 'text-success', id: 'publish-module' },
                    { label: 'Analytics', icon: BarChart3, color: 'text-orange-600', id: 'audit' },
                  ].map((link, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        if (link.id) setStaffView(link.id as any);
                        else if (link.label === 'Lessons') setActiveTab('lessons');
                      }}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-white hover:shadow-md border border-transparent hover:border-gray-100 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <link.icon className={cn("w-4 h-4", link.color)} />
                        <span className="text-xs font-bold text-ink">{link.label}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate/20 group-hover:text-primary transition-colors" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Module Health/Stats */}
              <div className="bg-ink p-8 rounded-[40px] text-white space-y-6">
                <h3 className="text-lg font-black font-serif">Module Health</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                      <span className="text-white/40">Completion Rules</span>
                      <span className="text-success">Valid</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-success w-full" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                      <span className="text-white/40">Content Readiness</span>
                      <span className="text-amber-500">65%</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 w-[65%]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    };

    const StaffCreateModuleView = () => {
      const [formData, setFormData] = useState({
        title: '',
        summary: '',
        courseCode: '',
        objectives: '',
        tags: '',
        audience: 'All Staff',
        language: 'English',
        estimatedDuration: '45 mins',
        hasPreTest: true,
        hasPostTest: true,
        hasCertificate: true,
        hasFeedback: true,
      });

      const [isSaving, setIsSaving] = useState(false);
      const [showExitConfirm, setShowExitConfirm] = useState(false);

      useEffect(() => {
        const dirty = formData.title !== '' || formData.courseCode !== '' || formData.summary !== '';
        setIsModuleFormDirty(dirty);
      }, [formData]);

      useEffect(() => {
        if (pendingStaffView) {
          setShowExitConfirm(true);
        }
      }, [pendingStaffView]);

      const handleCancel = () => {
        if (isModuleFormDirty) {
          setShowExitConfirm(true);
        } else {
          setStaffView('dashboard');
        }
      };

      const handleConfirmExit = () => {
        setIsModuleFormDirty(false);
        if (pendingStaffView) {
          setStaffView(pendingStaffView);
          setPendingStaffView(null);
        } else {
          setStaffView('dashboard');
        }
        setShowExitConfirm(false);
      };

      const handleStay = () => {
        setShowExitConfirm(false);
        setPendingStaffView(null);
      };

      const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title || !formData.courseCode) return;

        setIsSaving(true);

        // Simulate API delay
        await new Promise(r => setTimeout(r, 1000));

        const newModule: CMSModule = {
          id: 'm' + (modules.length + 1),
          title: formData.title,
          summary: formData.summary,
          courseCode: formData.courseCode,
          objectives: formData.objectives.split('\n').filter(o => o.trim()),
          tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
          audience: formData.audience,
          language: formData.language,
          estimatedDuration: formData.estimatedDuration,
          hasPreTest: formData.hasPreTest,
          hasPostTest: formData.hasPostTest,
          hasCertificate: formData.hasCertificate,
          hasFeedback: formData.hasFeedback,
          status: 'draft',
          lastUpdated: new Date().toISOString(),
          owner: currentUser?.name || 'Admin User',
          lessons: [],
          completionRules: {
            requireAllLessons: true,
            requiredLessonIds: [],
            requireFinalAssessment: true,
            minimumPassingScore: 80,
            requireFeedback: true,
            requireAllMandatoryBlocks: true
          },
          assets: [],
          assessments: [],
          feedback: null,
          reviewComments: [],
          qaResults: []
        };

        setModules([newModule, ...modules]);
        setIsSaving(false);
        setToast({ message: 'Draft module created successfully!', type: 'success' });
        setStaffView('modules');
      };

      return (
        <div className="max-w-4xl mx-auto space-y-12 relative">
          {/* Exit Confirmation Modal */}
          <AnimatePresence>
            {showExitConfirm && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowExitConfirm(false)}
                  className="absolute inset-0 bg-ink/60 backdrop-blur-sm"
                />
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-white rounded-[40px] p-10 max-w-md w-full relative z-10 shadow-2xl"
                >
                  <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mb-6">
                    <AlertTriangle className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-black text-ink font-serif mb-4">Unsaved Changes</h3>
                  <p className="text-slate mb-8 leading-relaxed">You have unsaved changes in this module draft. Are you sure you want to exit? Your progress will be lost.</p>
                  <div className="flex gap-4">
                    <button
                      onClick={handleStay}
                      className="flex-1 px-6 py-4 rounded-2xl font-black text-sm uppercase tracking-widest text-slate hover:bg-gray-100 transition-all"
                    >
                      Stay
                    </button>
                    <button
                      onClick={handleConfirmExit}
                      className="flex-1 bg-red-600 text-white px-6 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-red-600/20 hover:bg-red-700 transition-all"
                    >
                      Exit Anyway
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <button
                onClick={handleCancel}
                className="p-4 hover:bg-white rounded-2xl transition-all shadow-sm border border-gray-100 bg-white"
              >
                <ChevronLeft className="w-6 h-6 text-slate" />
              </button>
              <div>
                <h1 className="text-4xl font-black text-ink font-serif mb-2">Create New Module</h1>
                <p className="text-slate text-lg">Define the core structure and metadata.</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleCancel}
                className="px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest text-slate hover:bg-gray-100 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!formData.title || !formData.courseCode || isSaving}
                className="bg-primary text-white px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-3 disabled:opacity-30"
              >
                {isSaving ? <RotateCcw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                Save Draft
              </button>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-8">
            {/* Basic Info */}
            <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm space-y-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                  <Info className="w-4 h-4" />
                </div>
                <h3 className="text-xl font-black text-ink font-serif">Basic Information</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate uppercase tracking-widest ml-1">Module Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Introduction to HRBA"
                    className="w-full px-6 py-4 bg-paper rounded-2xl border border-gray-100 focus:ring-4 focus:ring-primary/5 outline-none font-bold"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate uppercase tracking-widest ml-1">Course Code</label>
                  <input
                    type="text"
                    value={formData.courseCode}
                    onChange={e => setFormData({ ...formData, courseCode: e.target.value })}
                    placeholder="e.g. HRBA-101"
                    className="w-full px-6 py-4 bg-paper rounded-2xl border border-gray-100 focus:ring-4 focus:ring-primary/5 outline-none font-bold"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate uppercase tracking-widest ml-1">Summary</label>
                <textarea
                  value={formData.summary}
                  onChange={e => setFormData({ ...formData, summary: e.target.value })}
                  placeholder="Provide a brief overview of the module..."
                  className="w-full px-6 py-4 bg-paper rounded-2xl border border-gray-100 focus:ring-4 focus:ring-primary/5 outline-none font-bold h-32 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate uppercase tracking-widest ml-1">Audience</label>
                  <select
                    value={formData.audience}
                    onChange={e => setFormData({ ...formData, audience: e.target.value })}
                    className="w-full px-6 py-4 bg-paper rounded-2xl border border-gray-100 focus:ring-4 focus:ring-primary/5 outline-none font-bold"
                  >
                    <option>All Staff</option>
                    <option>Program Officers</option>
                    <option>Management</option>
                    <option>External Partners</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate uppercase tracking-widest ml-1">Language</label>
                  <select
                    value={formData.language}
                    onChange={e => setFormData({ ...formData, language: e.target.value })}
                    className="w-full px-6 py-4 bg-paper rounded-2xl border border-gray-100 focus:ring-4 focus:ring-primary/5 outline-none font-bold"
                  >
                    <option>English</option>
                    <option>French</option>
                    <option>Spanish</option>
                    <option>Arabic</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate uppercase tracking-widest ml-1">Est. Duration</label>
                  <input
                    type="text"
                    value={formData.estimatedDuration}
                    onChange={e => setFormData({ ...formData, estimatedDuration: e.target.value })}
                    placeholder="e.g. 45 mins"
                    className="w-full px-6 py-4 bg-paper rounded-2xl border border-gray-100 focus:ring-4 focus:ring-primary/5 outline-none font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Objectives & Tags */}
            <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm space-y-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                  <Tag className="w-4 h-4" />
                </div>
                <h3 className="text-xl font-black text-ink font-serif">Objectives & Taxonomy</h3>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate uppercase tracking-widest ml-1">Learning Objectives (One per line)</label>
                <textarea
                  value={formData.objectives}
                  onChange={e => setFormData({ ...formData, objectives: e.target.value })}
                  placeholder="Understand the core principles..."
                  className="w-full px-6 py-4 bg-paper rounded-2xl border border-gray-100 focus:ring-4 focus:ring-primary/5 outline-none font-bold h-40 resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate uppercase tracking-widest ml-1">Tags (Comma separated)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={e => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="Human Rights, HRBA, Foundations..."
                  className="w-full px-6 py-4 bg-paper rounded-2xl border border-gray-100 focus:ring-4 focus:ring-primary/5 outline-none font-bold"
                />
              </div>
            </div>

            {/* Features & Toggles */}
            <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm space-y-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                  <Settings className="w-4 h-4" />
                </div>
                <h3 className="text-xl font-black text-ink font-serif">Module Features</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { id: 'hasPreTest', label: 'Enable Pre-Test', icon: FileEdit },
                  { id: 'hasPostTest', label: 'Enable Post-Test', icon: FileCheck },
                  { id: 'hasCertificate', label: 'Issue Certificate', icon: Award },
                  { id: 'hasFeedback', label: 'Collect Feedback', icon: MessageSquare },
                ].map((feature) => (
                  <label key={feature.id} className="flex items-center justify-between p-6 bg-paper rounded-2xl border border-gray-100 cursor-pointer hover:border-primary/30 transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-gray-100 group-hover:text-primary transition-colors">
                        <feature.icon className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-black text-ink uppercase tracking-widest">{feature.label}</span>
                    </div>
                    <div className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={(formData as any)[feature.id]}
                        onChange={e => setFormData({ ...formData, [feature.id]: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </form>
        </div>
      );
    };

    return (
      <div className="min-h-screen bg-[#F9FAFB] flex flex-col">
        {/* Staff Top Bar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-50">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-ink uppercase tracking-tighter">DEC Staff</span>
              <div className="h-4 w-px bg-gray-200 mx-2" />
              <div className="flex items-center gap-2 bg-primary/5 px-3 py-1 rounded-full border border-primary/10">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] font-black text-primary uppercase tracking-widest">Production Environment</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 bg-gray-50 px-4 py-1.5 rounded-2xl border border-gray-100">
              <div className="w-6 h-6 bg-white rounded-lg flex items-center justify-center border border-gray-100">
                <User className="w-3.5 h-3.5 text-slate" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-ink leading-none">{currentUser.name}</span>
                <span className="text-[8px] font-black text-primary uppercase tracking-widest mt-0.5">{currentUser.role.replace('_', ' ')}</span>
              </div>
            </div>
            <button
              onClick={() => { setCurrentUser(null); localStorage.removeItem('dec_user'); setView('landing'); }}
              className="p-2 hover:bg-red-50 text-slate hover:text-red-600 rounded-xl transition-all"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        <div className="flex flex-1">
          {/* Staff Sidebar */}
          <aside className="w-64 bg-white border-r border-gray-200 flex flex-col p-6 sticky top-16 h-[calc(100vh-64px)]">
            <nav className="space-y-2 flex-1">
              {sidebarLinks.map(link => (
                <button
                  key={link.id}
                  onClick={() => handleSidebarClick(link.id as any)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all",
                    staffView === link.id ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-slate hover:bg-gray-50 hover:text-ink"
                  )}
                >
                  <link.icon className="w-5 h-5" />
                  {link.name}
                </button>
              ))}
            </nav>

            <div className="pt-6 border-t border-gray-100">
              <button
                onClick={() => setView('landing')}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate hover:bg-gray-50 hover:text-ink transition-all"
              >
                <Globe className="w-5 h-5" />
                Learner View
              </button>
            </div>
          </aside>

          {/* Staff Content */}
          <main className="flex-1 p-10 relative">
            {/* Toast Notification */}
            <AnimatePresence>
              {toast && (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 50 }}
                  className={cn(
                    "fixed bottom-10 right-10 z-[100] px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 font-bold text-sm",
                    toast.type === 'success' ? "bg-success text-white" : "bg-red-600 text-white"
                  )}
                >
                  {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                  {toast.message}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="max-w-6xl mx-auto">
              {/* Breadcrumbs */}
              <div className="flex items-center gap-2 mb-8">
                <button
                  onClick={() => setStaffView('dashboard')}
                  className="text-[10px] font-black text-slate/40 uppercase tracking-widest hover:text-primary transition-colors"
                >
                  Workspace
                </button>
                <ChevronRight className="w-3 h-3 text-slate/20" />
                {staffView === 'dashboard' ? (
                  <span className="text-[10px] font-black text-primary uppercase tracking-widest">Dashboard</span>
                ) : (
                  <>
                    <button
                      onClick={() => setStaffView('modules')}
                      className={cn(
                        "text-[10px] font-black uppercase tracking-widest transition-colors",
                        staffView === 'modules' ? "text-primary" : "text-slate/40 hover:text-primary"
                      )}
                    >
                      Modules
                    </button>
                    {staffView === 'create-module' && (
                      <>
                        <ChevronRight className="w-3 h-3 text-slate/20" />
                        <span className="text-[10px] font-black text-primary uppercase tracking-widest">Create Module</span>
                      </>
                    )}
                    {staffView === 'module-overview' && (
                      <>
                        <ChevronRight className="w-3 h-3 text-slate/20" />
                        <span className="text-[10px] font-black text-primary uppercase tracking-widest truncate max-w-[200px]">
                          {modules.find(m => m.id === selectedModuleId)?.title || 'Module Overview'}
                        </span>
                      </>
                    )}
                    {staffView === 'lesson-editor' && (
                      <>
                        <ChevronRight className="w-3 h-3 text-slate/20" />
                        <button
                          onClick={() => setStaffView('module-overview')}
                          className="text-[10px] font-black text-slate/40 uppercase tracking-widest hover:text-primary transition-colors truncate max-w-[150px]"
                        >
                          {modules.find(m => m.id === selectedModuleId)?.title || 'Module'}
                        </button>
                        <ChevronRight className="w-3 h-3 text-slate/20" />
                        <span className="text-[10px] font-black text-primary uppercase tracking-widest truncate max-w-[150px]">
                          {modules.find(m => m.id === selectedModuleId)?.lessons.find(l => l.id === selectedLessonId)?.title || 'Lesson Editor'}
                        </span>
                      </>
                    )}
                    {(staffView === 'users' || staffView === 'audit' || staffView === 'settings') && (
                      <>
                        <ChevronRight className="w-3 h-3 text-slate/20" />
                        <span className="text-[10px] font-black text-primary uppercase tracking-widest capitalize">{staffView}</span>
                      </>
                    )}
                    {(staffView === 'media-library' || staffView === 'assessment-builder' || staffView === 'feedback-builder' || staffView === 'preview-player' || staffView === 'qa-checklist' || staffView === 'review-queue' || staffView === 'review-module' || staffView === 'publish-module' || staffView === 'analytics' || staffView === 'feedback-triage') && (
                      <>
                        <ChevronRight className="w-3 h-3 text-slate/20" />
                        <span className="text-[10px] font-black text-primary uppercase tracking-widest">
                          {staffView === 'media-library' ? 'Media & Resources' :
                            staffView === 'assessment-builder' ? 'Assessments' :
                              staffView === 'preview-player' ? 'Learner Preview' :
                                staffView === 'qa-checklist' ? 'QA Checklist' :
                                  staffView === 'review-queue' ? 'Review Queue' :
                                    staffView === 'review-module' ? 'Reviewing' :
                                      staffView === 'publish-module' ? 'Publish Confirmation' :
                                        staffView === 'analytics' ? 'Analytics' :
                                          staffView === 'feedback-triage' ? 'Feedback Triage' :
                                            'Feedback Builder'}
                        </span>
                      </>
                    )}
                  </>
                )}
              </div>

              {staffView === 'dashboard' && <StaffDashboardView />}
              {staffView === 'modules' && <StaffModulesListView />}
              {staffView === 'create-module' && <StaffCreateModuleView />}
              {staffView === 'module-overview' && <StaffModuleOverviewView />}
              {staffView === 'lesson-editor' && <StaffLessonEditorView />}
              {staffView === 'media-library' && <StaffMediaLibraryView />}
              {staffView === 'assessment-builder' && <StaffAssessmentBuilderView />}
              {staffView === 'feedback-builder' && <StaffFeedbackBuilderView />}
              {staffView === 'preview-player' && <StaffPreviewPlayerView />}
              {staffView === 'qa-checklist' && <StaffQAChecklistView />}
              {staffView === 'review-queue' && <StaffReviewQueueView />}
              {staffView === 'review-module' && <StaffReviewView />}
              {staffView === 'publish-module' && <StaffPublishView />}
              {staffView === 'analytics' && <StaffAnalyticsView />}
              {staffView === 'feedback-triage' && <StaffFeedbackTriageView />}

              {(staffView === 'users' || staffView === 'audit' || staffView === 'settings') && (
                <div className="p-20 text-center bg-white rounded-[40px] border border-gray-100 shadow-sm">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Briefcase className="w-10 h-10 text-slate/20" />
                  </div>
                  <h3 className="text-2xl font-black text-ink font-serif mb-2">Workspace Section Under Construction</h3>
                  <p className="text-slate">This feature is coming in a future phase.</p>
                  <button
                    onClick={() => setStaffView('dashboard')}
                    className="mt-8 text-sm font-black text-primary uppercase tracking-widest hover:underline"
                  >
                    Back to Dashboard
                  </button>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    );
  };

  return (
    <div className="font-sans text-[#111827] antialiased">
      {(view === 'landing' || view === 'catalog' || view === 'preview' || view === 'glossary' || view === 'resources') && <Navbar />}
      <AnimatePresence mode="wait">
        {view === 'landing' && <LandingView key="landing" />}
        {view === 'catalog' && <CatalogView key="catalog" />}
        {view === 'preview' && <PreviewView key="preview" />}
        {view === 'welcome' && <WelcomeView key="welcome" />}
        {view === 'lesson' && <LessonView key="lesson" />}
        {view === 'test-intro' && <TestIntroView key="test-intro" />}
        {view === 'test' && <TestView key="test" />}
        {view === 'test-results' && <TestResultsView key="test-results" />}
        {view === 'feedback' && <FeedbackView key="feedback" />}
        {view === 'completion' && <CompletionView key="completion" />}
        {view === 'glossary' && <GlossaryView key="glossary" />}
        {view === 'resources' && <ResourcesView key="resources" />}
        {view === 'staff-sign-in' && <StaffSignInView key="staff-sign-in" />}
        {view === 'member-sign-in' && <MemberSignInView key="member-sign-in" />}
        {view === 'staff-workspace' && <StaffWorkspaceView key="staff-workspace" />}
      </AnimatePresence>

      {/* Certificate Verification Modal */}
      <AnimatePresence>
        {isVerifyModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-ink/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-xl rounded-[48px] overflow-hidden shadow-2xl relative"
            >
              <button 
                onClick={() => { setIsVerifyModalOpen(false); setVerifyResult(null); setCertNumber(''); }}
                className="absolute top-8 right-8 w-12 h-12 rounded-full bg-paper flex items-center justify-center text-slate hover:text-primary transition-all"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="p-16">
                <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mb-8">
                  <Award className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-4xl font-black text-ink mb-4 font-serif">Verify Certificate</h2>
                <p className="text-slate mb-12 opacity-70">Enter the unique verification number found on your DEC certificate to confirm its authenticity.</p>
                
                <div className="space-y-6">
                  <div>
                    <input
                      type="text"
                      placeholder="e.g. DEC-123456-ABC"
                      className="w-full bg-paper border-none rounded-2xl py-6 px-8 text-xl font-bold placeholder:text-slate/20 focus:ring-4 focus:ring-primary/10 transition-all"
                      value={certNumber}
                      onChange={(e) => setCertNumber(e.target.value)}
                    />
                  </div>
                  
                  <button
                    onClick={() => {
                      setIsVerifying(true);
                      setTimeout(() => {
                        setIsVerifying(false);
                        setVerifyResult(certNumber.length > 5 ? 'valid' : 'invalid');
                      }, 1500);
                    }}
                    disabled={!certNumber || isVerifying}
                    className="w-full bg-primary hover:bg-primary/90 text-white font-black py-6 rounded-2xl transition-all shadow-xl shadow-primary/20 disabled:opacity-50"
                  >
                    {isVerifying ? 'Verifying...' : 'Verify Authenticity'}
                  </button>
                  
                  {verifyResult && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className={cn(
                        "p-8 rounded-3xl flex items-center gap-6",
                        verifyResult === 'valid' ? "bg-success/5 text-success border border-success/10" : "bg-error/5 text-error border border-error/10"
                      )}
                    >
                      <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", verifyResult === 'valid' ? "bg-success/10" : "bg-error/10")}>
                        {verifyResult === 'valid' ? <CheckCircle2 className="w-6 h-6" /> : <Info className="w-6 h-6" />}
                      </div>
                      <div>
                        <div className="font-black uppercase tracking-widest text-[10px] mb-1">
                          {verifyResult === 'valid' ? 'Verification Success' : 'Invalid Certificate'}
                        </div>
                        <div className="text-sm font-medium opacity-80">
                          {verifyResult === 'valid' 
                            ? 'This certificate is authentic and registered in our system.' 
                            : 'We could not find a certificate matching this number.'}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
