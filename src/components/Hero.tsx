
import { ArrowRight, CheckCircle, Users, TrendingUp, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-20 px-4">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/5 animate-float" style={{ animationDelay: '0s' }}></div>
        <div className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full bg-primary/5 animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 rounded-full bg-primary/5 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="max-w-7xl mx-auto text-center z-10">
        <div className="space-y-8 animate-fade-in">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <CheckCircle className="w-4 h-4 mr-2" />
            Trusted by 10,000+ businesses worldwide
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
            <span className="block mb-2">Stop Manual</span>
            <span className="block mb-2">Bookkeeping</span>
            <span className="text-primary relative">
              Start Smart Accounting
              <span className="absolute bottom-1 left-0 w-full h-2 bg-primary/20 rounded-full"></span>
            </span>
          </h1>
          
          <p className="text-muted-foreground text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed">
            AccountAI uses artificial intelligence to automatically categorize transactions, generate invoices, and provide financial insights. 
            <strong className="text-foreground"> Save 10+ hours per week</strong> on accounting tasks.
          </p>

          {/* Social Proof Stats */}
          <div className="flex flex-wrap justify-center gap-8 py-8">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="w-5 h-5 text-primary" />
              <span className="font-medium">10,000+ Users</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <TrendingUp className="w-5 h-5 text-primary" />
              <span className="font-medium">99.9% Accuracy</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-5 h-5 text-primary" />
              <span className="font-medium">30-Second Setup</span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button asChild size="lg" className="w-full sm:w-auto px-10 py-6 text-lg font-semibold">
              <Link to="/auth">Start Free Trial <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto px-10 py-6 text-lg">
              <Link to="/dashboard">Watch Live Demo</Link>
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mt-4">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
        
        <div className="mt-24 glass-panel p-8 mx-auto max-w-5xl animate-fade-in-up">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">See AccountAI in Action</h2>
            <p className="text-muted-foreground">Watch how AI transforms your accounting workflow</p>
          </div>
          
          <div className="aspect-video rounded-xl overflow-hidden border border-border/50 bg-gradient-to-br from-primary/5 to-primary/10">
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center space-y-6 max-w-2xl px-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4">
                  <ArrowRight className="w-8 h-8 text-primary" />
                </div>
                
                <div className="glass-panel p-6 text-left bg-background/80">
                  <div className="space-y-4">
                    <div>
                      <p className="font-semibold text-primary mb-2">👤 You type:</p>
                      <p className="text-lg">"Bought office supplies for ₹1,200 from Staples yesterday"</p>
                    </div>
                    
                    <div className="border-t border-border pt-4">
                      <p className="font-semibold text-primary mb-3">🤖 AI instantly creates:</p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Amount:</span>
                            <span className="font-medium">₹1,200.00</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Category:</span>
                            <span className="font-medium">Office Supplies</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Type:</span>
                            <span className="font-medium">Expense</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Date:</span>
                            <span className="font-medium">Auto-detected</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Automatically saved to your books</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
