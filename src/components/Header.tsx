import { BookOpen, Star, Moon } from "lucide-react";

const Header = () => {
  return (
    <header className="gradient-islamic islamic-pattern text-primary-foreground">
      <div className="container mx-auto py-6 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight">
                Monitoring Hafalan
              </h1>
              <p className="text-sm opacity-80">
                Sistem Tahsin & Tahfizh SD
              </p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 opacity-60">
            <Star className="w-4 h-4" />
            <Moon className="w-4 h-4" />
            <Star className="w-4 h-4" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
