import { Mail, Phone, ArrowDown, Sparkles, Brain, Eye, MessageSquare, Network, Cpu, Database, FileText, BookOpen, ArrowRight } from "lucide-react";
import { SiGithub, SiLinkedin, SiPython, SiPytorch, SiTensorflow } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import type { Resume, BlogPost } from "@shared/schema";

const floatingIcons = [
  { Icon: Brain, delay: 0, x: "10%", y: "20%" },
  { Icon: Eye, delay: 0.2, x: "85%", y: "25%" },
  { Icon: Network, delay: 0.4, x: "15%", y: "70%" },
  { Icon: Cpu, delay: 0.6, x: "80%", y: "65%" },
  { Icon: Database, delay: 0.8, x: "25%", y: "45%" },
  { Icon: MessageSquare, delay: 1, x: "75%", y: "40%" },
];

const techStack = [
  { Icon: SiPython, label: "Python" },
  { Icon: SiPytorch, label: "PyTorch" },
  { Icon: SiTensorflow, label: "TensorFlow" },
];

export function HeroSection() {
  const { data: resume } = useQuery<Resume>({ queryKey: ["/api/resume"] });
  const { data: posts = [] } = useQuery<BlogPost[]>({ queryKey: ["/api/blog"] });

  // Pick the series with the most recent post as the featured one
  const seriesMap = new Map<string, BlogPost[]>();
  posts.filter(p => p.seriesName).forEach(p => {
    seriesMap.set(p.seriesName!, [...(seriesMap.get(p.seriesName!) || []), p]);
  });
  const featuredSeries = Array.from(seriesMap.entries())
    .sort((a, b) => Math.max(...b[1].map(p => new Date(p.date).getTime())) - Math.max(...a[1].map(p => new Date(p.date).getTime())))
  [0] ?? null;

  const scrollToWork = () => {
    const element = document.querySelector("#experience");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-24 pb-16 px-4 sm:px-6 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-primary/[0.03] rounded-full blur-2xl" />

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-primary/10 rounded-full opacity-30" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] border border-border/20 rounded-full opacity-20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] border border-border/10 rounded-full opacity-10" />

        <svg className="absolute inset-0 w-full h-full opacity-[0.02]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {floatingIcons.map(({ Icon, delay, x, y }, index) => (
          <motion.div
            key={index}
            className="absolute hidden md:block"
            style={{ left: x, top: y }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: delay + 0.5, duration: 0.5, type: "spring" }}
          >
            <motion.div
              animate={{
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{
                duration: 4 + index,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="p-3 rounded-xl bg-card/80 border border-card-border backdrop-blur-sm shadow-md"
            >
              <Icon className="h-6 w-6 text-primary/60" />
            </motion.div>
          </motion.div>
        ))}

        <motion.div
          className="absolute hidden lg:block left-[5%] top-[30%] w-48"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <div className="p-3 rounded-lg bg-card/90 border border-card-border backdrop-blur-sm font-mono text-xs shadow-md">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-red-400" />
              <div className="w-2 h-2 rounded-full bg-yellow-400" />
              <div className="w-2 h-2 rounded-full bg-green-400" />
            </div>
            <div className="text-muted-foreground">
              <span className="text-primary">model</span>.predict()
            </div>
            <div className="text-green-600 dark:text-green-400">
              {">"} accuracy: 0.97
            </div>
          </div>
        </motion.div>

        <motion.div
          className="absolute hidden lg:block right-[5%] top-[35%] w-52"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <div className="p-3 rounded-lg bg-card/90 border border-card-border backdrop-blur-sm font-mono text-xs shadow-md">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-red-400" />
              <div className="w-2 h-2 rounded-full bg-yellow-400" />
              <div className="w-2 h-2 rounded-full bg-green-400" />
            </div>
            <div className="text-muted-foreground">
              <span className="text-blue-500">import</span> torch
            </div>
            <div className="text-muted-foreground">
              <span className="text-blue-500">from</span> transformers
            </div>
          </div>
        </motion.div>
      </div>

      <div className="relative max-w-4xl mx-auto text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 text-primary text-sm font-medium border border-primary/20">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            Machine Learning Scientist
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent"
        >
          Parit Kansal
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed"
        >
          Building intelligent systems at scale. Specializing in{" "}
          <span className="text-foreground font-medium">Computer Vision</span>,{" "}
          <span className="text-foreground font-medium">NLP</span>, and{" "}
          <span className="text-foreground font-medium">Deep Learning</span>{" "}
          to solve real-world problems.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex items-center justify-center gap-3 mb-10"
        >
          {techStack.map(({ Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-card/70 border border-card-border shadow-sm"
            >
              <Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <span className="text-sm text-muted-foreground">{label}</span>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-3 mb-10"
        >
          {resume?.url && (
            <Button asChild size="lg" className="gap-2 w-56">
              <a href={resume.url} target="_blank" rel="noopener noreferrer">
                <FileText className="h-5 w-5" />
                Download Resume
              </a>
            </Button>
          )}
          <Button variant="outline" size="lg" className="gap-2 w-56" onClick={scrollToWork}>
            View Work
            <ArrowRight className="h-4 w-4" />
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2 mb-12"
        >
          <a
            href="mailto:paritkansal121@gmail.com"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            data-testid="link-email"
          >
            <Mail className="h-4 w-4" aria-hidden="true" />
            paritkansal121@gmail.com
          </a>
          <span className="hidden sm:inline text-border" aria-hidden="true">|</span>
          <a
            href="tel:+916398950353"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            data-testid="link-phone"
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            +91 639-895-0353
          </a>
          <span className="hidden sm:inline text-border" aria-hidden="true">|</span>
          <div className="flex items-center gap-1">
            <a
              href="https://github.com/ParitKansal"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub profile"
              className="inline-flex items-center justify-center h-9 w-9 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              data-testid="link-github"
            >
              <SiGithub className="h-5 w-5" />
            </a>
            <a
              href="https://linkedin.com/in/paritkansal"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn profile"
              className="inline-flex items-center justify-center h-9 w-9 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              data-testid="link-linkedin"
            >
              <SiLinkedin className="h-5 w-5" />
            </a>
          </div>
        </motion.div>

        {featuredSeries && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mb-12"
          >
            <button
              onClick={() => document.querySelector("#series")?.scrollIntoView({ behavior: "smooth" })}
              className="inline-flex items-center gap-3 px-5 py-3 rounded-xl border border-primary/20 bg-card/70 shadow-sm hover:border-primary/40 hover:shadow-md transition-all duration-200 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <BookOpen className="h-4 w-4 text-primary" aria-hidden="true" />
              </div>
              <div className="text-left">
                <p className="text-xs text-muted-foreground">Currently writing</p>
                <p className="text-sm font-semibold text-foreground">{featuredSeries[0]} <span className="text-muted-foreground font-normal">· {featuredSeries[1].length} parts</span></p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all ml-1" aria-hidden="true" />
            </button>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={scrollToWork}
            className="animate-bounce rounded-full"
            aria-label="Scroll to experience"
            data-testid="button-scroll-to-work"
          >
            <ArrowDown className="h-5 w-5" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
