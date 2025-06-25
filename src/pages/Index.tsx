import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Hero from '@/components/Hero';
import { ChevronDown, Star, ArrowRight, CheckCircle, Zap, Shield, BarChart, FileText, Users, Clock } from 'lucide-react';

const Index = () => {
  return (
    <div className="flex-1 min-h-screen overflow-x-hidden">
      <Hero />

      {/* Benefits Section */}
      <section className="py-24 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl font-bold tracking-tight mb-4">Why 10,000+ Businesses Choose AccountAI</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Join the accounting revolution and experience the future of financial management
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Save 10+ Hours Weekly",
                description: "Eliminate manual data entry with AI-powered transaction categorization. Focus on growing your business instead of bookkeeping.",
                icon: <Clock className="w-8 h-8 text-primary" />,
                metric: "90% time saved"
              },
              {
                title: "99.9% Accuracy Guaranteed",
                description: "Our advanced AI reduces human errors and ensures your financial records are always accurate and audit-ready.",
                icon: <Shield className="w-8 h-8 text-primary" />,
                metric: "Zero calculation errors"
              },
              {
                title: "Real-Time Financial Insights",
                description: "Get instant reports, cash flow analysis, and business intelligence to make informed financial decisions.",
                icon: <BarChart className="w-8 h-8 text-primary" />,
                metric: "Live dashboard updates"
              }
            ].map((item, index) => (
              <div 
                key={index} 
                className="glass-panel p-8 text-center animate-fade-in-up hover:scale-105 transition-all duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="inline-flex items-center justify-center p-4 rounded-full bg-primary/10 mb-6">
                  {item.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">{item.description}</p>
                <div className="inline-flex items-center gap-2 text-sm font-medium text-primary">
                  <CheckCircle className="w-4 h-4" />
                  {item.metric}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl font-bold tracking-tight mb-4">How AccountAI Works</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Three simple steps to transform your accounting workflow with artificial intelligence
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                step: "01",
                title: "Describe Your Transaction",
                description: "Simply tell AccountAI about your business transaction in plain English. No complex forms or coding required.",
                icon: "💬",
                example: "Purchased laptop for ₹45,000 from Dell"
              },
              {
                step: "02", 
                title: "AI Analyzes & Categorizes",
                description: "Our advanced AI instantly understands your transaction and extracts all relevant accounting information with 99.9% accuracy.",
                icon: "🧠",
                example: "Auto-categorized as 'Office Equipment' expense"
              },
              {
                step: "03",
                title: "Automatic Recording",
                description: "Transaction is automatically recorded in your books with proper categorization, ready for reports and tax filing.",
                icon: "📊",
                example: "Added to Balance Sheet & P&L statements"
              }
            ].map((item, index) => (
              <div 
                key={index} 
                className="text-center animate-fade-in-up relative"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                  {item.step}
                </div>
                <div className="glass-panel p-8 h-full">
                  <div className="inline-flex items-center justify-center p-4 rounded-full bg-primary/10 mb-6">
                    <span className="text-3xl">{item.icon}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">{item.description}</p>
                  <div className="bg-muted/50 rounded-lg p-4 text-sm">
                    <p className="font-medium text-primary mb-1">Example:</p>
                    <p className="text-muted-foreground italic">"{item.example}"</p>
                  </div>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-6 transform -translate-y-1/2">
                    <ArrowRight className="w-6 h-6 text-primary/40" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight mb-4">Complete Accounting Solution</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Everything you need to manage your business finances in one intelligent platform
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "AI Transaction Processing", icon: <Zap className="w-6 h-6" />, desc: "Instant categorization" },
              { title: "Invoice Generation", icon: <FileText className="w-6 h-6" />, desc: "Professional invoices" },
              { title: "Financial Reports", icon: <BarChart className="w-6 h-6" />, desc: "Real-time insights" },
              { title: "Expense Tracking", icon: <Users className="w-6 h-6" />, desc: "Automated monitoring" },
              { title: "Tax Preparation", icon: <Shield className="w-6 h-6" />, desc: "Audit-ready books" },
              { title: "Multi-Currency", icon: <CheckCircle className="w-6 h-6" />, desc: "Global business support" },
              { title: "Bank Integration", icon: <Clock className="w-6 h-6" />, desc: "Seamless syncing" },
              { title: "Mobile Access", icon: <Star className="w-6 h-6" />, desc: "Anywhere, anytime" }
            ].map((feature, index) => (
              <div key={index} className="glass-panel p-6 text-center hover:scale-105 transition-transform">
                <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10 mb-4 text-primary">
                  {feature.icon}
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight">What Our Users Say</h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Join thousands of satisfied businesses using AccountAI
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "AccountAI has saved us countless hours of manual data entry. It's a game-changer!",
                author: "Sarah Johnson",
                role: "CFO, TechStart Inc"
              },
              {
                quote: "The AI's accuracy in categorizing transactions is impressive. Highly recommended!",
                author: "Michael Chen",
                role: "Founder, GrowthHub"
              },
              {
                quote: "Finally, an accounting solution that speaks human language!",
                author: "Emma Davis",
                role: "Small Business Owner"
              }
            ].map((testimonial, index) => (
              <div key={index} className="glass-panel p-6">
                <p className="text-muted-foreground mb-4">"{testimonial.quote}"</p>
                <div>
                  <p className="font-medium">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight">Why Choose AccountAI?</h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Compare our features with traditional accounting methods
            </p>
          </div>
          <div className="glass-panel p-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="font-bold">Features</div>
              <div className="font-bold">Traditional Accounting</div>
              <div className="font-bold">AccountAI</div>
              <div className="border-t pt-4">Time per transaction</div>
              <div className="border-t pt-4">5-10 minutes</div>
              <div className="border-t pt-4 text-primary">30 seconds</div>
              <div className="border-t pt-4">Accuracy</div>
              <div className="border-t pt-4">Human error prone</div>
              <div className="border-t pt-4 text-primary">99.9% accurate</div>
              <div className="border-t pt-4">Learning curve</div>
              <div className="border-t pt-4">Months of training</div>
              <div className="border-t pt-4 text-primary">Minutes to learn</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight">Frequently Asked Questions</h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Everything you need to know about AccountAI
            </p>
          </div>
          <div className="space-y-4">
            {[
              {
                question: "How secure is my financial data?",
                answer: "We use bank-level encryption and follow strict security protocols to protect your data."
              },
              {
                question: "Can I integrate with my existing accounting software?",
                answer: "Yes, AccountAI integrates seamlessly with popular accounting platforms."
              },
              {
                question: "What if the AI makes a mistake?",
                answer: "Our system allows for easy review and correction of any categorization."
              }
            ].map((faq, index) => (
              <div key={index} className="glass-panel p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">{faq.question}</h3>
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="mt-2 text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="glass-panel p-12 text-center animate-fade-in bg-gradient-to-br from-primary/5 to-primary/10">
            <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Accounting?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Join 10,000+ businesses using AccountAI to save time, reduce errors, and gain financial insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <Button asChild size="lg" className="px-10 py-6 text-lg font-semibold">
                <Link to="/auth">Start Free Trial</Link>
              </Button>
              <Button variant="outline" size="lg" className="px-10 py-6 text-lg">
                <Link to="/dashboard">Schedule Demo</Link>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              ✓ 14-day free trial ✓ No credit card required ✓ Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl font-bold tracking-tight">Get in Touch</h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Have questions about AccountAI? Our team is here to help you succeed.
            </p>
          </div>
          <div className="glass-panel p-8 animate-fade-in">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <div className="mb-6">
                  <h3 className="text-xl font-medium mb-2">Sales & Support</h3>
                  <a href="mailto:sales@accountai.com" className="text-primary hover:underline">
                    sales@accountai.com
                  </a>
                </div>
                <div className="mb-6">
                  <h3 className="text-xl font-medium mb-2">Phone Support</h3>
                  <a href="tel:+918695018620" className="text-primary hover:underline">
                    +91 86950 18620
                  </a>
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">Business Hours</h3>
                  <p className="text-muted-foreground">Monday - Saturday</p>
                  <p className="text-muted-foreground">9:00 AM - 8:00 PM IST</p>
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <h3 className="text-xl font-medium mb-4">Why Choose AccountAI?</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>30-second setup process</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>99.9% accuracy guarantee</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>24/7 customer support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>No long-term contracts</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <footer className="py-12 px-4 bg-background border-t">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <span className="text-xl font-bold">AccountAI</span>
              <span className="text-muted-foreground text-sm">&copy; {new Date().getFullYear()}</span>
            </div>
            <div className="flex space-x-6">
              <a href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</a>
              <a href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">Terms of Service</a>
              <a href="/about" className="text-muted-foreground hover:text-foreground transition-colors">About Us</a>
              <a href="/blog" className="text-muted-foreground hover:text-foreground transition-colors">Blog</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
