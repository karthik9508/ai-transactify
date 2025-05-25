import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Monitor } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface ThemeToggleProps {
  variant?: "icon" | "switch" | "menuitem";
}

export function ThemeToggle({ variant = "icon" }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  if (variant === "switch") {
    return (
      <div className="flex items-center space-x-2">
        <Switch 
          id="theme-mode" 
          checked={theme === "dark"} 
          onCheckedChange={toggleTheme} 
        />
        <Label htmlFor="theme-mode" className="cursor-pointer">
          {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
        </Label>
      </div>
    );
  }
  
  if (variant === "menuitem") {
    return (
      <div className="flex items-center justify-between w-full px-2 py-1.5">
        <div className="flex items-center">
          {theme === 'dark' ? <Moon className="mr-2 h-4 w-4" /> : theme === 'light' ? <Sun className="mr-2 h-4 w-4" /> : <Monitor className="mr-2 h-4 w-4" />}
          <span>{theme === 'dark' ? 'Dark Mode' : theme === 'light' ? 'Light Mode' : 'System'}</span>
        </div>
        <Switch 
          checked={theme === "dark"} 
          onCheckedChange={toggleTheme} 
        />
      </div>
    );
  }

  // Default icon variant
  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'dark' ? <Sun className="h-4 w-4" /> : theme === 'light' ? <Moon className="h-4 w-4" /> : <Monitor className="h-4 w-4" />}
    </Button>
  );
}
