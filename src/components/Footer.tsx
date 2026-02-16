import { Leaf, Github, ExternalLink } from "lucide-react";

const Footer = () => (
  <footer className="py-16 px-6 border-t border-border">
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Leaf className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-heading font-bold text-lg">GreenStream AI</p>
            <p className="text-xs text-muted-foreground">Real-Time AI for Sustainable Smart Cities</p>
          </div>
        </div>

        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <a href="#" className="hover:text-primary transition-colors flex items-center gap-1.5">
            <Github className="w-4 h-4" /> GitHub
          </a>
          <a href="#" className="hover:text-secondary transition-colors flex items-center gap-1.5">
            <ExternalLink className="w-4 h-4" /> Live Demo
          </a>
        </div>
      </div>


    </div>
  </footer>
);

export default Footer;
