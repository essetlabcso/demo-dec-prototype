import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft,
  Info,
  HelpCircle,
  MessageSquare,
  FileText
} from 'lucide-react';
import { cn } from '../lib/utils';

// --- Text Block ---
export const TextBlock = ({ heading, content }: any) => (
  <div className="mb-10 max-w-2xl">
    {heading && <h3 className="text-2xl font-bold text-ink mb-4 font-serif">{heading}</h3>}
    <p className="text-slate leading-relaxed text-lg">{content}</p>
  </div>
);

// --- Statement Block ---
export const StatementBlock = ({ content }: any) => (
  <div className="mb-10 p-8 bg-paper border-l-4 border-primary rounded-r-2xl shadow-sm">
    <p className="text-xl font-medium text-ink italic leading-snug">"{content}"</p>
  </div>
);

// --- Quote Block ---
export const QuoteBlock = ({ content, attribution }: any) => (
  <div className="mb-12 flex flex-col items-center text-center px-6 py-10 bg-paper/50 rounded-[40px]">
    <div className="text-6xl text-primary opacity-10 mb-2 font-serif">“</div>
    <p className="text-2xl font-serif text-ink italic mb-4 leading-relaxed max-w-xl">{content}</p>
    {attribution && (
      <div className="flex items-center gap-2">
        <div className="w-8 h-px bg-primary/30" />
        <p className="text-sm font-bold text-primary uppercase tracking-widest">{attribution}</p>
        <div className="w-8 h-px bg-primary/30" />
      </div>
    )}
  </div>
);

// --- List Block ---
export const ListBlock = ({ title, items }: any) => (
  <div className="mb-10">
    {title && <h4 className="text-lg font-bold text-ink mb-4 uppercase tracking-wider">{title}</h4>}
    <div className="grid gap-3">
      {items.map((item: string, i: number) => (
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }}
          key={i} 
          className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm"
        >
          <div className="mt-1 w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
            <div className="w-2 h-2 rounded-full bg-accent" />
          </div>
          <span className="text-slate text-base leading-relaxed">{item}</span>
        </motion.div>
      ))}
    </div>
  </div>
);

// --- Two Column Block ---
export const TwoColumnBlock = ({ leftHeading, leftItems, rightHeading, rightItems }: any) => (
  <div className="grid md:grid-cols-2 gap-8 mb-12">
    <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
        <HelpCircle className="w-6 h-6 text-primary" />
      </div>
      <h4 className="text-xl font-bold text-ink mb-4 font-serif">{leftHeading}</h4>
      <ul className="space-y-3">
        {leftItems.map((item: string, i: number) => (
          <li key={i} className="text-slate text-base flex items-start gap-3">
            <span className="text-primary mt-1">•</span> {item}
          </li>
        ))}
      </ul>
    </div>
    <div className="bg-primary/5 p-8 rounded-[32px] border border-primary/10 shadow-sm hover:shadow-md transition-shadow">
      <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center mb-6">
        <Info className="w-6 h-6 text-primary" />
      </div>
      <h4 className="text-xl font-bold text-primary mb-4 font-serif">{rightHeading}</h4>
      <ul className="space-y-3">
        {rightItems.map((item: string, i: number) => (
          <li key={i} className="text-primary/80 text-base flex items-start gap-3">
            <span className="text-accent mt-1">•</span> {item}
          </li>
        ))}
      </ul>
    </div>
  </div>
);

// --- Table Block ---
export const TableBlock = ({ title, headers, rows }: any) => (
  <div className="mb-12">
    {title && <h4 className="text-lg font-bold text-ink mb-4 uppercase tracking-widest">{title}</h4>}
    <div className="overflow-hidden rounded-[32px] border border-gray-100 shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-paper">
            {headers.map((h: string, i: number) => (
              <th key={i} className="p-5 text-xs font-bold text-primary uppercase tracking-widest border-b border-gray-100">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50 bg-white">
          {rows.map((row: string[], i: number) => (
            <tr key={i} className="hover:bg-paper/30 transition-colors">
              {row.map((cell: string, j: number) => (
                <td key={j} className="p-5 text-slate text-sm leading-relaxed">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// --- Accordion Block ---
export const AccordionBlock = ({ title, items, onComplete }: any) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [viewed, setViewed] = useState<Set<number>>(new Set());

  const handleToggle = (i: number) => {
    const newIndex = openIndex === i ? null : i;
    setOpenIndex(newIndex);
    if (newIndex !== null) {
      const nextViewed = new Set(viewed).add(i);
      setViewed(nextViewed);
      if (nextViewed.size === items.length && onComplete) {
        onComplete();
      }
    }
  };

  return (
    <div className="mb-12">
      {title && <h4 className="text-xl font-bold text-ink mb-8 font-serif text-center">{title}</h4>}
      <div className="space-y-4">
        {items.map((item: any, i: number) => (
          <div 
            key={i} 
            className={cn(
              "rounded-[32px] border transition-all duration-500 overflow-hidden",
              openIndex === i ? "border-primary bg-white shadow-xl shadow-primary/5" : "border-gray-100 bg-paper/30 hover:bg-white hover:border-primary/20"
            )}
          >
            <button
              onClick={() => handleToggle(i)}
              className="w-full p-6 md:p-8 flex items-center justify-between text-left group"
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-500",
                  openIndex === i ? "bg-primary text-white" : viewed.has(i) ? "bg-success/10 text-success" : "bg-white text-slate"
                )}>
                  {viewed.has(i) && openIndex !== i ? <CheckCircle2 className="w-5 h-5" /> : <span className="text-xs font-black">0{i + 1}</span>}
                </div>
                <span className={cn(
                  "text-lg font-bold transition-colors",
                  openIndex === i ? "text-ink" : "text-slate group-hover:text-ink"
                )}>{item.title}</span>
              </div>
              <div className={cn(
                "w-8 h-8 rounded-full bg-paper flex items-center justify-center transition-transform duration-500",
                openIndex === i && "rotate-180 bg-primary/10 text-primary"
              )}>
                <ChevronDown className="w-5 h-5" />
              </div>
            </button>
            <AnimatePresence>
              {openIndex === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                  <div className="px-8 pb-8 pt-0 text-slate text-lg leading-relaxed border-t border-gray-50 mt-2 pt-6">
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
      <div className="mt-6 flex justify-center gap-2">
        {items.map((_: any, i: number) => (
          <div key={i} className={cn(
            "h-1.5 rounded-full transition-all duration-500",
            openIndex === i ? "w-8 bg-primary" : viewed.has(i) ? "w-4 bg-success" : "w-4 bg-gray-100"
          )} />
        ))}
      </div>
    </div>
  );
};

// --- Tabs Block ---
export const TabsBlock = ({ title, items, onComplete }: any) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [viewed, setViewed] = useState<Set<number>>(new Set([0]));

  const handleTabClick = (i: number) => {
    setActiveIndex(i);
    const nextViewed = new Set(viewed).add(i);
    setViewed(nextViewed);
    if (nextViewed.size === items.length && onComplete) {
      onComplete();
    }
  };

  return (
    <div className="mb-12">
      {title && <h4 className="text-xl font-bold text-ink mb-8 font-serif text-center">{title}</h4>}
      <div className="bg-white rounded-[40px] border border-gray-100 shadow-xl shadow-primary/5 overflow-hidden">
        <div className="flex overflow-x-auto bg-paper/30 p-3 gap-2 border-b border-gray-50 scrollbar-hide">
          {items.map((item: any, i: number) => (
            <button
              key={i}
              onClick={() => handleTabClick(i)}
              className={cn(
                "px-8 py-4 rounded-3xl text-base font-bold transition-all whitespace-nowrap flex items-center gap-3 group",
                activeIndex === i 
                  ? "bg-primary text-white shadow-lg shadow-primary/20" 
                  : "text-slate hover:bg-white hover:text-primary"
              )}
            >
              <div className={cn(
                "w-6 h-6 rounded-lg flex items-center justify-center transition-all",
                activeIndex === i ? "bg-white/20" : viewed.has(i) ? "bg-success/10 text-success" : "bg-gray-100"
              )}>
                {viewed.has(i) ? <CheckCircle2 className="w-4 h-4" /> : <span className="text-[10px]">0{i + 1}</span>}
              </div>
              {item.title}
            </button>
          ))}
        </div>
        <div className="p-8 md:p-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="text-slate leading-relaxed text-lg"
            >
              {items[activeIndex].content}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      <div className="mt-6 flex justify-center gap-2">
        {items.map((_: any, i: number) => (
          <div key={i} className={cn(
            "h-1.5 rounded-full transition-all duration-500",
            activeIndex === i ? "w-8 bg-primary" : viewed.has(i) ? "w-4 bg-success" : "w-4 bg-gray-100"
          )} />
        ))}
      </div>
    </div>
  );
};

// --- Process Block ---
export const ProcessBlock = ({ title, steps, onComplete }: any) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [viewedSteps, setViewedSteps] = useState<Set<number>>(new Set([0]));

  const next = () => {
    if (currentStep < steps.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      const nextViewed = new Set(viewedSteps).add(nextStep);
      setViewedSteps(nextViewed);
      if (nextViewed.size === steps.length && onComplete) {
        onComplete();
      }
    }
  };

  const prev = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="mb-12">
      {title && <h4 className="text-xl font-bold text-ink mb-10 font-serif text-center">{title}</h4>}
      
      <div className="flex justify-between items-center mb-12 px-4 max-w-lg mx-auto relative">
        <div className="absolute top-1/2 left-4 right-4 h-1 bg-gray-100 -translate-y-1/2 rounded-full" />
        <div 
          className="absolute top-1/2 left-4 h-1 bg-primary -translate-y-1/2 rounded-full transition-all duration-700 ease-out"
          style={{ width: `calc(${(currentStep / (steps.length - 1)) * 100}% - 32px)` }}
        />
        
        {steps.map((_: any, i: number) => (
          <button 
            key={i} 
            onClick={() => {
              if (viewedSteps.has(i) || i === currentStep + 1) {
                setCurrentStep(i);
                const nextViewed = new Set(viewedSteps).add(i);
                setViewedSteps(nextViewed);
                if (nextViewed.size === steps.length && onComplete) onComplete();
              }
            }}
            className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center font-bold transition-all duration-500 z-10 relative",
              i === currentStep ? "bg-primary text-white shadow-xl shadow-primary/30 scale-110" : viewedSteps.has(i) ? "bg-success text-white" : "bg-white border-2 border-gray-100 text-gray-400"
            )}
          >
            {viewedSteps.has(i) && i !== currentStep ? <CheckCircle2 className="w-6 h-6" /> : i + 1}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-[48px] border border-gray-100 shadow-2xl shadow-primary/5 overflow-hidden min-h-[360px] flex flex-col">
        <div className="p-10 md:p-14 flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <div className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest mb-6">
                Step 0{currentStep + 1}
              </div>
              <h5 className="text-3xl font-bold text-ink mb-6 font-serif leading-tight">{steps[currentStep].title}</h5>
              <p className="text-slate leading-relaxed text-xl">{steps[currentStep].content}</p>
            </motion.div>
          </AnimatePresence>
        </div>
        
        <div className="p-8 bg-paper/30 border-t border-gray-50 flex justify-between items-center">
          <button
            onClick={prev}
            disabled={currentStep === 0}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl hover:bg-white disabled:opacity-0 transition-all text-primary font-bold"
          >
            <ChevronLeft className="w-6 h-6" />
            <span>Previous</span>
          </button>
          
          <div className="flex gap-1.5">
            {steps.map((_: any, i: number) => (
              <div key={i} className={cn(
                "w-2 h-2 rounded-full transition-all duration-500",
                i === currentStep ? "w-6 bg-primary" : viewedSteps.has(i) ? "bg-success" : "bg-gray-200"
              )} />
            ))}
          </div>

          <button
            onClick={next}
            disabled={currentStep === steps.length - 1}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl hover:bg-white disabled:opacity-0 transition-all text-primary font-bold"
          >
            <span>Next Step</span>
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Flashcards ---
export const FlashcardsBlock = ({ items, onComplete }: any) => {
  const [flipped, setFlipped] = useState<Set<number>>(new Set());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    const nextFlipped = new Set(flipped).add(currentIndex);
    setFlipped(nextFlipped);
    if (nextFlipped.size === items.length && onComplete) {
      onComplete();
    }
  };

  const next = () => {
    if (currentIndex < items.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const prev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  return (
    <div className="mb-12 flex flex-col items-center">
      <div className="mb-8 text-center">
        <span className="text-[10px] font-black text-slate uppercase tracking-[0.3em]">Flashcard {currentIndex + 1} of {items.length}</span>
        <div className="flex gap-1 mt-3 justify-center">
          {items.map((_: any, i: number) => (
            <div key={i} className={cn(
              "h-1 rounded-full transition-all duration-500",
              i === currentIndex ? "w-8 bg-primary" : flipped.has(i) ? "w-4 bg-success" : "w-4 bg-gray-100"
            )} />
          ))}
        </div>
      </div>

      <div 
        className="relative w-full max-w-md h-80 cursor-pointer perspective-1000 group"
        onClick={handleFlip}
      >
        <motion.div
          className="w-full h-full relative transition-all duration-700 preserve-3d"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
        >
          {/* Front */}
          <div className="absolute inset-0 backface-hidden bg-white border border-gray-100 rounded-[40px] flex flex-col items-center justify-center p-10 text-center shadow-xl group-hover:shadow-2xl transition-shadow overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-[80px] -z-10" />
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
              <RotateCcw className="w-6 h-6 text-primary animate-pulse" />
            </div>
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4">The Concept</span>
            <h4 className="text-3xl font-bold text-ink font-serif leading-tight">{items[currentIndex].front}</h4>
            <div className="mt-10 text-gray-400 flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
              Tap to reveal definition
            </div>
          </div>
          {/* Back */}
          <div 
            className="absolute inset-0 backface-hidden bg-primary text-white rounded-[40px] flex flex-col items-center justify-center p-10 text-center shadow-xl overflow-hidden"
            style={{ transform: 'rotateY(180deg)' }}
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-bl-[80px] -z-10" />
            <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] mb-6">The Definition</span>
            <p className="text-xl leading-relaxed font-medium">{items[currentIndex].back}</p>
            <div className="mt-10 text-white/40 flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
              Tap to flip back
            </div>
          </div>
        </motion.div>
      </div>
      
      <div className="flex items-center gap-8 mt-10 p-2 bg-paper rounded-full border border-gray-100 shadow-sm">
        <button 
          onClick={(e) => { e.stopPropagation(); prev(); }} 
          disabled={currentIndex === 0} 
          className="p-3 rounded-full hover:bg-white disabled:opacity-0 transition-all text-primary"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="flex flex-col items-center gap-1">
          <span className="text-sm font-bold text-slate uppercase tracking-widest">{currentIndex + 1} / {items.length}</span>
          <div className="flex gap-1">
            {items.map((_: any, i: number) => (
              <div key={i} className={cn(
                "w-1.5 h-1.5 rounded-full transition-all",
                flipped.has(i) ? "bg-success" : "bg-gray-200"
              )} />
            ))}
          </div>
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); next(); }} 
          disabled={currentIndex === items.length - 1} 
          className="p-3 rounded-full hover:bg-white disabled:opacity-0 transition-all text-primary"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

// --- Sorting Activity ---
export const SortingBlock = ({ title, categories, cards, onComplete }: any) => {
  const [placedCards, setPlacedCards] = useState<Record<number, string>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handlePlace = (category: string) => {
    const isCorrect = cards[currentIndex].category === category;
    
    if (isCorrect) {
      setFeedback('correct');
      setTimeout(() => {
        setPlacedCards({ ...placedCards, [currentIndex]: category });
        setFeedback(null);
        if (currentIndex < cards.length - 1) {
          setCurrentIndex(currentIndex + 1);
        } else if (onComplete) {
          onComplete();
        }
      }, 600);
    } else {
      setFeedback('incorrect');
      setTimeout(() => setFeedback(null), 1000);
    }
  };

  const isFinished = Object.keys(placedCards).length === cards.length;

  return (
    <div className="mb-12 p-10 bg-paper rounded-[40px] border border-gray-100 shadow-inner">
      <h4 className="text-xl font-bold text-ink mb-8 text-center font-serif">{title}</h4>
      
      {!isFinished ? (
        <div className="flex flex-col items-center">
          <p className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-6">Click a category to sort the card</p>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 1.1, opacity: 0, y: -20 }}
              className={cn(
                "w-full max-w-md p-10 bg-white rounded-3xl shadow-xl border-2 text-center mb-10 transition-all duration-300",
                feedback === 'correct' && "border-success bg-success/5 scale-105",
                feedback === 'incorrect' && "border-error bg-error/5 shake",
                !feedback && "border-primary/20"
              )}
            >
              <p className="text-xl font-medium text-ink leading-relaxed font-serif">{cards[currentIndex].text}</p>
            </motion.div>
          </AnimatePresence>

          <div className="grid grid-cols-2 gap-4 w-full max-w-md">
            {categories.map((cat: string) => (
              <button
                key={cat}
                onClick={() => handlePlace(cat)}
                className="p-5 bg-white border border-gray-100 rounded-2xl text-sm font-bold text-slate hover:border-primary hover:text-primary hover:shadow-lg transition-all active:scale-95 uppercase tracking-widest"
              >
                {cat}
              </button>
            ))}
          </div>
          
          <div className="mt-8 flex gap-2">
            {cards.map((_: any, i: number) => (
              <div key={i} className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                i === currentIndex ? "w-8 bg-primary" : i < currentIndex ? "bg-success" : "bg-gray-200"
              )} />
            ))}
          </div>
        </div>
      ) : (
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center py-12"
        >
          <div className="inline-flex items-center justify-center w-24 h-24 bg-success/10 rounded-full mb-6">
            <CheckCircle2 className="w-12 h-12 text-success" />
          </div>
          <h5 className="text-3xl font-bold text-ink mb-3 font-serif">Excellent!</h5>
          <p className="text-slate text-lg">You've correctly categorized all HRBA actions.</p>
        </motion.div>
      )}
    </div>
  );
};

// --- Timeline Block ---
export const TimelineBlock = ({ title, items, onComplete }: any) => {
  const [viewed, setViewed] = useState<Set<number>>(new Set());

  const handleView = (i: number) => {
    const nextViewed = new Set(viewed).add(i);
    setViewed(nextViewed);
    if (nextViewed.size === items.length && onComplete) {
      onComplete();
    }
  };

  return (
    <div className="mb-12">
      <h4 className="text-xl font-bold text-ink mb-12 font-serif text-center">{title}</h4>
      <div className="relative pl-12 md:pl-16 space-y-12 before:absolute before:left-[1.125rem] md:before:left-[1.625rem] before:top-2 before:bottom-2 before:w-1.5 before:bg-paper before:rounded-full">
        {items.map((item: string, i: number) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            onViewportEnter={() => handleView(i)}
            className="relative group"
          >
            <div className={cn(
              "absolute -left-[2.375rem] md:-left-[2.875rem] top-1.5 w-10 h-10 md:w-12 md:h-12 rounded-full border-4 border-white shadow-xl transition-all duration-500 flex items-center justify-center z-10",
              viewed.has(i) ? "bg-accent scale-110 shadow-accent/20" : "bg-gray-100"
            )}>
              {viewed.has(i) ? <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-white" /> : <div className="w-2 h-2 rounded-full bg-gray-300" />}
            </div>
            <div className="bg-white p-8 md:p-10 rounded-[32px] md:rounded-[40px] border border-gray-100 shadow-sm group-hover:shadow-xl transition-all group-hover:-translate-y-1 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-[80px] -z-10" />
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-4 block">Stage 0{i + 1}</span>
              <p className="text-ink font-serif text-xl md:text-2xl leading-relaxed">{item}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// --- Chart Block ---
export const ChartBlock = ({ title, chartType, items, note, onComplete }: any) => {
  const [viewed, setViewed] = useState(false);

  const handleComplete = () => {
    if (!viewed) {
      setViewed(true);
      onComplete?.();
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <motion.div 
      className="mb-12 p-6 md:p-10 bg-white border border-gray-100 rounded-[32px] md:rounded-[40px] shadow-sm relative overflow-hidden" 
      onViewportEnter={handleComplete}
      viewport={{ once: true, amount: 0.2 }}
      initial="hidden"
      whileInView="visible"
      variants={containerVariants}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] -z-10" />
      <h4 className="text-xl font-bold text-ink mb-10 font-serif text-center">{title}</h4>
      
      {chartType === 'ladder' ? (
        <div className="relative max-w-lg mx-auto">
          {/* Vertical Ladder Line */}
          <div className="absolute left-4 md:left-6 top-0 bottom-0 w-1 bg-paper rounded-full -z-10" />
          
          <div className="space-y-4">
            {items.map((item: string, i: number) => (
              <motion.div 
                variants={itemVariants}
                key={i} 
                className="flex items-center gap-4 md:gap-6"
                style={{ paddingLeft: `calc(${i} * clamp(0.5rem, 3vw, 1.5rem))` }}
              >
                <div className={cn(
                  "flex-1 p-4 md:p-5 rounded-2xl border-2 font-bold text-sm md:text-base transition-all shadow-sm flex items-center min-h-[4.5rem]",
                  i === items.length - 1 ? "bg-primary/10 border-primary text-primary" : "bg-white border-gray-100 text-slate"
                )}>
                  <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-black mr-3 shrink-0">0{i + 1}</span>
                  <span className="flex-1 leading-tight">{item}</span>
                </div>
                {i === items.length - 1 && (
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-accent flex items-center justify-center shadow-lg shadow-accent/20 shrink-0">
                    <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-8 max-w-xl mx-auto">
          {items.map((item: string, i: number) => (
            <div key={i} className="space-y-3">
              <div className="flex justify-between text-xs font-black text-slate uppercase tracking-[0.2em]">
                <span>{item}</span>
                <span className="text-primary">{100 - (i * 15)}%</span>
              </div>
              <div className="h-4 bg-paper rounded-full overflow-hidden p-1 border border-gray-50">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: `${100 - (i * 15)}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-primary rounded-full shadow-inner"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {note && (
        <div className="mt-10 flex gap-4 p-6 bg-warning/5 rounded-3xl border border-warning/10">
          <div className="w-10 h-10 rounded-2xl bg-warning/20 flex items-center justify-center shrink-0">
            <Info className="w-6 h-6 text-warning" />
          </div>
          <p className="text-sm text-warning/80 italic leading-relaxed font-medium">{note}</p>
        </div>
      )}
    </motion.div>
  );
};

// --- Knowledge Check ---
export const KnowledgeCheckBlock = ({ question, options, correctAnswer, hint, onComplete }: any) => {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (selected !== null) {
      setSubmitted(true);
      if (onComplete) onComplete();
    }
  };

  return (
    <div className="mb-12 p-10 bg-white border border-gray-100 rounded-[40px] shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-5">
        <HelpCircle className="w-24 h-24" />
      </div>
      
      <div className="flex items-center gap-3 text-primary mb-6">
        <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
          <HelpCircle className="w-6 h-6" />
        </div>
        <span className="text-xs font-black uppercase tracking-[0.2em]">Knowledge Check</span>
      </div>
      
      <h4 className="text-2xl font-bold text-ink mb-8 font-serif leading-tight">{question}</h4>
      
      <div className="space-y-4 mb-10">
        {options.map((opt: string, i: number) => (
          <button
            key={i}
            disabled={submitted}
            onClick={() => setSelected(i)}
            className={cn(
              "w-full p-6 rounded-[24px] border-2 text-left transition-all flex items-center justify-between group",
              selected === i && !submitted && "border-primary bg-primary/5 shadow-md",
              submitted && i === correctAnswer && "border-success bg-success/5 shadow-md",
              submitted && selected === i && i !== correctAnswer && "border-error bg-error/5",
              selected !== i && !submitted && "border-gray-50 hover:border-primary/30 hover:bg-paper"
            )}
          >
            <span className={cn(
              "text-lg font-bold transition-colors",
              selected === i ? "text-ink" : "text-slate group-hover:text-ink"
            )}>{opt}</span>
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center transition-all",
              selected === i && !submitted && "bg-primary text-white",
              submitted && i === correctAnswer && "bg-success text-white",
              submitted && selected === i && i !== correctAnswer && "bg-error text-white",
              selected !== i && !submitted && "bg-gray-100 text-transparent"
            )}>
              {submitted && i === correctAnswer ? <CheckCircle2 className="w-5 h-5" /> : 
               submitted && selected === i ? <XCircle className="w-5 h-5" /> : 
               <div className="w-2 h-2 rounded-full bg-white" />}
            </div>
          </button>
        ))}
      </div>

      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={selected === null}
          className="w-full py-5 bg-primary text-white rounded-[24px] font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 disabled:opacity-30 disabled:shadow-none transition-all hover:-translate-y-1 active:scale-95"
        >
          Check Answer
        </button>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "p-8 rounded-[32px] border-2",
            selected === correctAnswer ? "bg-success/5 border-success/20 text-success" : "bg-error/5 border-error/20 text-error"
          )}
        >
          <div className="flex items-center gap-4 mb-3">
            <div className={cn(
              "w-10 h-10 rounded-2xl flex items-center justify-center",
              selected === correctAnswer ? "bg-success/20" : "bg-error/20"
            )}>
              {selected === correctAnswer ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
            </div>
            <h5 className="text-xl font-bold font-serif">{selected === correctAnswer ? 'Correct!' : 'Not quite.'}</h5>
          </div>
          <p className="text-lg leading-relaxed opacity-80">{hint}</p>
        </motion.div>
      )}
    </div>
  );
};

// --- Reflection Block ---
export const ReflectionBlock = ({ heading, content, onComplete }: any) => {
  const [value, setValue] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
    if (onComplete) onComplete();
  };

  return (
    <div className="mb-12 p-10 bg-paper rounded-[40px] border border-gray-100 shadow-inner relative overflow-hidden">
      <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-bl-[120px] -z-10" />
      
      <div className="flex items-center gap-3 text-primary mb-8">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
          <MessageSquare className="w-6 h-6" />
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Personal Reflection</span>
      </div>

      <h4 className="text-3xl font-bold text-ink mb-6 font-serif leading-tight">{heading}</h4>
      <p className="text-slate text-xl mb-10 italic leading-relaxed opacity-80">{content}</p>
      
      {!submitted ? (
        <div className="space-y-8">
          <div className="relative group">
            <textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Type your thoughts here..."
              className="w-full p-10 h-64 rounded-[40px] bg-white border border-gray-100 focus:ring-8 focus:ring-primary/5 focus:border-primary outline-none text-xl transition-all shadow-sm resize-none font-serif leading-relaxed"
            />
            <div className={cn(
              "absolute bottom-8 right-10 text-[10px] font-black uppercase tracking-widest transition-colors",
              value.length > 0 ? "text-primary" : "text-gray-300"
            )}>
              {value.length} characters
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <button
              onClick={handleSubmit}
              disabled={value.trim().length < 10}
              className="flex-1 py-6 bg-primary text-white rounded-[28px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary/20 disabled:opacity-30 disabled:shadow-none transition-all hover:-translate-y-1 active:scale-95"
            >
              Save Reflection
            </button>
            <button
              onClick={() => { setSubmitted(true); onComplete?.(); }}
              className="px-10 py-6 text-slate font-black uppercase tracking-widest text-[10px] hover:text-primary transition-all"
            >
              Skip for now
            </button>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-10 bg-white rounded-[40px] border border-primary/10 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-success/5 rounded-bl-[100px] -z-10" />
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-success/10 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-success" />
            </div>
            <h5 className="text-2xl font-bold text-ink font-serif">Reflection Saved</h5>
          </div>
          <div className="relative">
            <div className="absolute -left-4 top-0 bottom-0 w-1 bg-success/20 rounded-full" />
            <p className="text-slate text-xl leading-relaxed whitespace-pre-wrap italic pl-6">
              {value || 'No reflection entered.'}
            </p>
          </div>
          <button 
            onClick={() => setSubmitted(false)}
            className="mt-10 text-[10px] font-black text-primary uppercase tracking-[0.3em] hover:underline"
          >
            Edit Reflection
          </button>
        </motion.div>
      )}
    </div>
  );
};

// --- Image Block ---
export const ImageBlock = ({ src, alt, caption }: any) => (
  <div className="mb-12 group">
    <div className="overflow-hidden rounded-[40px] shadow-2xl border border-gray-100 bg-paper">
      <img 
        src={src} 
        alt={alt} 
        referrerPolicy="no-referrer"
        className="w-full h-auto object-cover transition-transform duration-1000 group-hover:scale-105" 
      />
    </div>
    {caption && (
      <div className="mt-6 flex items-center justify-center gap-3">
        <div className="w-8 h-px bg-gray-200" />
        <p className="text-sm text-slate italic font-medium">{caption}</p>
        <div className="w-8 h-px bg-gray-200" />
      </div>
    )}
  </div>
);

// --- Divider Block ---
export const DividerBlock = () => (
  <div className="py-12 flex items-center justify-center">
    <div className="w-24 h-1 bg-gray-100 rounded-full" />
  </div>
);

// --- Resource Callout Block ---
export const ResourceCalloutBlock = ({ title, description, link }: any) => (
  <div className="mb-10 p-8 bg-primary/5 rounded-[40px] border border-primary/10 flex flex-col md:flex-row items-center gap-8 group hover:bg-primary/10 transition-all">
    <div className="w-20 h-20 bg-white rounded-[24px] flex items-center justify-center border border-gray-100 shadow-sm group-hover:scale-110 transition-transform">
      <HelpCircle className="w-10 h-10 text-primary" />
    </div>
    <div className="flex-1 text-center md:text-left">
      <h4 className="text-xl font-black text-ink font-serif mb-2">{title}</h4>
      <p className="text-slate text-base leading-relaxed">{description}</p>
    </div>
    <a 
      href={link} 
      target="_blank" 
      rel="noopener noreferrer"
      className="px-8 py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
    >
      View Resource
    </a>
  </div>
);

// --- Video Block ---
export const VideoBlock = ({ title, url, transcript }: any) => {
  const [showTranscript, setShowTranscript] = useState(false);

  return (
    <div className="mb-12">
      {title && <h4 className="text-xl font-black text-ink mb-6 font-serif">{title}</h4>}
      <div className="aspect-video bg-ink rounded-[40px] overflow-hidden shadow-2xl relative group border-4 border-white">
        <video 
          src={url} 
          controls 
          className="w-full h-full object-cover"
        />
      </div>
      {transcript && (
        <div className="mt-6">
          <button 
            onClick={() => setShowTranscript(!showTranscript)}
            className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest hover:text-ink transition-colors"
          >
            <FileText className="w-4 h-4" />
            {showTranscript ? 'Hide Transcript' : 'View Transcript'}
          </button>
          <AnimatePresence>
            {showTranscript && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-4 p-8 bg-paper rounded-[32px] text-slate text-sm leading-relaxed border border-gray-100 italic"
              >
                {transcript}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

// --- Block Renderer ---
export const BlockRenderer = ({ block }: { block: any }) => {
  switch (block.type) {
    case 'text': return <TextBlock {...block} />;
    case 'statement': return <StatementBlock {...block} />;
    case 'quote': return <QuoteBlock {...block} />;
    case 'list': return <ListBlock {...block} />;
    case 'two-column': return <TwoColumnBlock {...block} />;
    case 'table': return <TableBlock {...block} />;
    case 'accordion': return <AccordionBlock {...block} />;
    case 'tabs': return <TabsBlock {...block} />;
    case 'process': return <ProcessBlock {...block} />;
    case 'flashcards': return <FlashcardsBlock {...block} />;
    case 'sorting': return <SortingBlock {...block} />;
    case 'timeline': return <TimelineBlock {...block} />;
    case 'chart': return <ChartBlock {...block} />;
    case 'knowledge-check': return <KnowledgeCheckBlock {...block} />;
    case 'reflection': return <ReflectionBlock {...block} />;
    case 'image': return <ImageBlock {...block} />;
    case 'video': return <VideoBlock {...block} />;
    case 'divider': return <DividerBlock />;
    case 'resource-callout': return <ResourceCalloutBlock {...block} />;
    default: return null;
  }
};
