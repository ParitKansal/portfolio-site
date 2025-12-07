import { Mail, Phone, ArrowDown, Sparkles, Brain, Eye, MessageSquare, Network, Cpu, Database } from "lucide-react";
import { SiGithub, SiLinkedin, SiPython, SiPytorch, SiTensorflow } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

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
        <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-primary/3 rounded-full blur-2xl" />
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-primary/10 rounded-full opacity-30" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] border border-border/20 rounded-full opacity-20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] border border-border/10 rounded-full opacity-10" />
        
        <svg className="absolute inset-0 w-full h-full opacity-[0.02]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="1"/>
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
              className="p-3 rounded-xl bg-card/80 border border-border/50 backdrop-blur-sm shadow-lg"
            >
              <Icon className="h-6 w-6 text-primary/70" />
            </motion.div>
          </motion.div>
        ))}

        <motion.div
          className="absolute hidden lg:block left-[5%] top-[30%] w-48"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <div className="p-3 rounded-lg bg-card/90 border border-border/50 backdrop-blur-sm font-mono text-xs">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-red-400" />
              <div className="w-2 h-2 rounded-full bg-yellow-400" />
              <div className="w-2 h-2 rounded-full bg-green-400" />
            </div>
            <div className="text-muted-foreground">
              <span className="text-primary">model</span>.predict()
            </div>
            <div className="text-green-500 dark:text-green-400">
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
          <div className="p-3 rounded-lg bg-card/90 border border-border/50 backdrop-blur-sm font-mono text-xs">
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
          className="flex items-center justify-center gap-4 mb-8"
        >
          {techStack.map(({ Icon, label }, index) => (
            <div
              key={label}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border/50"
            >
              <Icon className="h-4 w-4" />
              <span className="text-sm text-muted-foreground">{label}</span>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
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
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex items-center justify-center gap-3 mb-16"
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
