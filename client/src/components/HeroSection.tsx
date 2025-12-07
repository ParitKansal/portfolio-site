import { Mail, Phone, ArrowDown, Sparkles } from "lucide-react";
import { SiGithub, SiLinkedin } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const stats = [
  { value: "100K+", label: "Documents Processed Monthly" },
  { value: "97%+", label: "Model Accuracy" },
  { value: "8M+", label: "Sessions Analyzed" },
];

export function HeroSection() {
  const scrollToWork = () => {
    const element = document.querySelector("#experience");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-16 px-4 sm:px-6 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-border/30 rounded-full opacity-20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-border/20 rounded-full opacity-10" />
        
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative max-w-5xl mx-auto text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
            <Sparkles className="h-4 w-4" />
            Machine Learning Scientist
          </span>
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6"
        >
          <span className="bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text">
            Parit Kansal
          </span>
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
          className="flex flex-wrap items-center justify-center gap-4 mb-10"
        >
          <a href="mailto:paritkansal121@gmail.com" data-testid="link-email">
            <Button variant="outline" className="gap-2">
              <Mail className="h-4 w-4" />
              paritkansal121@gmail.com
            </Button>
          </a>
          <a href="tel:+916398950353" data-testid="link-phone">
            <Button variant="outline" className="gap-2">
              <Phone className="h-4 w-4" />
              +91 639-895-0353
            </Button>
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex items-center justify-center gap-3 mb-12"
        >
          <a href="https://github.com/ParitKansal" target="_blank" rel="noopener noreferrer" data-testid="link-github">
            <Button variant="secondary" size="icon">
              <SiGithub className="h-5 w-5" />
            </Button>
          </a>
          <a href="https://linkedin.com/in/paritkansal" target="_blank" rel="noopener noreferrer" data-testid="link-linkedin">
            <Button variant="secondary" size="icon">
              <SiLinkedin className="h-5 w-5" />
            </Button>
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16 max-w-3xl mx-auto"
        >
          {stats.map((stat, index) => (
            <div
              key={index}
              className="p-4 rounded-lg bg-card/50 border border-border/50 backdrop-blur-sm"
              data-testid={`stat-${index}`}
            >
              <div className="text-2xl md:text-3xl font-bold text-primary mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <Button
            variant="ghost"
            size="lg"
            onClick={scrollToWork}
            className="animate-bounce"
            data-testid="button-scroll-to-work"
          >
            <ArrowDown className="h-5 w-5" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
