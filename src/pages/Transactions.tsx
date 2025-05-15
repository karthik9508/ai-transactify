
import { useState, useEffect } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '@/components/AppSidebar';
import TransactionInput from '@/components/TransactionInput';
import TransactionHistory from '@/components/TransactionHistory';
import { Transaction, AITransactionResponse, InvoiceData } from '@/lib/types';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  
  // Load transactions from database on component mount
  const fetchTransactions = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      setTransactions(data as Transaction[]);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
      toast({
        title: "Error",
        description: 'Failed to load transactions',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchTransactions();
  }, [user]);
  
  // Generate invoice for sales transaction
  const generateInvoiceForSale = async (transaction: Transaction) => {
    if (!user) return null;
    
    try {
      // First, get business profile information
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('business_name, business_address, contact_number, gstn_number')
        .eq('id', user.id)
        .single();
        
      if (profileError) {
        console.error('Error fetching business info:', profileError);
        throw profileError;
      }
      
      // Get the next invoice number
      const { data: counterData, error: counterError } = await supabase
        .from('invoice_counter')
        .select('counter')
        .single();

      let nextCounter = 1;
      if (counterError) {
        if (counterError.code === 'PGRST116') {
          // Table doesn't exist, create it
          await supabase.rpc('create_invoice_counter');
          
          // Insert initial counter
          await supabase
            .from('invoice_counter')
            .insert({ counter: 1 });
        } else {
          console.error('Error getting invoice counter:', counterError);
          throw counterError;
        }
      } else if (counterData) {
        nextCounter = counterData.counter;
        
        // Update the counter for the next invoice
        await supabase
          .from('invoice_counter')
          .update({ counter: nextCounter + 1 })
          .eq('id', 1);
      }

      // Format the invoice number with leading zeros
      const invoiceNumber = `INV-${String(nextCounter).padStart(3, '0')}`;
      
      // Current date in YYYY-MM-DD format
      const currentDate = new Date().toISOString().split('T')[0];
      
      // Due date (15 days from now)
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 15);
      const dueDateStr = dueDate.toISOString().split('T')[0];
      
      // Create invoice data
      const invoiceData: InvoiceData = {
        invoiceNumber: invoiceNumber,
        date: currentDate,
        dueDate: dueDateStr,
        billTo: {
          name: "Customer", // Default client name
          address: "Customer Address", // Default client address
        },
        items: [
          {
            description: transaction.description,
            quantity: 1,
            unitPrice: transaction.amount,
            amount: transaction.amount
          }
        ],
        subtotal: transaction.amount,
        taxRate: 18, // Default GST rate in India
        taxAmount: transaction.amount * 0.18,
        total: transaction.amount * 1.18,
        businessInfo: {
          business_name: profileData?.business_name || null,
          business_address: profileData?.business_address || null,
          contact_number: profileData?.contact_number || null,
          gstn_number: profileData?.gstn_number || null
        }
      };
      
      // Save the invoice to the database
      const { data: invoiceData, error: invoiceError } = await supabase
        .from('invoices')
        .insert({
          invoice_number: invoiceNumber,
          data: invoiceData,
          user_id: user.id
        })
        .select('id')
        .single();
        
      if (invoiceError) {
        console.error('Error saving invoice:', invoiceError);
        throw invoiceError;
      }
      
      return invoiceData.id;
    } catch (error) {
      console.error('Failed to generate invoice:', error);
      toast({
        title: "Warning",
        description: 'Failed to generate invoice for this sale',
        variant: "destructive",
      });
      return null;
    }
  };
  
  const handleTransactionCreated = async (aiResponse: AITransactionResponse) => {
    if (!user) {
      toast({
        title: "Error",
        description: 'You must be logged in to create transactions',
        variant: "destructive",
      });
      return;
    }
    
    try {
      let invoiceId: string | null = null;
      
      // If this is a sale transaction, generate an invoice automatically
      if (aiResponse.type === 'sale') {
        const tempTransaction = {
          id: crypto.randomUUID(),
          description: aiResponse.description,
          amount: aiResponse.amount,
          type: aiResponse.type,
          category: aiResponse.category,
          date: aiResponse.date,
          created_at: new Date().toISOString(),
          user_id: user.id
        };
        
        // Generate invoice for this sale
        invoiceId = await generateInvoiceForSale(tempTransaction);
        
        if (invoiceId) {
          toast({
            title: "Success",
            description: 'Invoice automatically generated for this sale',
          });
        }
      }
      
      // Insert the transaction into the database
      const { error } = await supabase
        .from('transactions')
        .insert([{
          description: aiResponse.description,
          amount: aiResponse.amount,
          type: aiResponse.type,
          category: aiResponse.category,
          date: aiResponse.date,
          user_id: user.id,
          invoice_id: invoiceId // Link to the generated invoice if available
        }]);
        
      if (error) {
        throw error;
      }
      
      // Refresh the transactions list
      fetchTransactions();
      toast({
        title: "Success",
        description: 'Transaction added successfully',
      });
    } catch (error) {
      console.error('Error adding transaction:', error);
      toast({
        title: "Error",
        description: 'Failed to add transaction',
        variant: "destructive",
      });
    }
  };
  
  return (
    <SidebarProvider>
      <div className="flex w-full min-h-screen">
        <AppSidebar />
        <div className="flex-1 min-h-screen">
          <main className="container mx-auto max-w-5xl px-4 py-10">
            <div className="text-center mb-12 animate-fade-in">
              <h1 className="text-3xl font-bold tracking-tight">New Transaction</h1>
              <p className="mt-2 text-muted-foreground">
                Describe your transaction in natural language and our AI will do the rest
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-8">
                <TransactionInput onTransactionCreated={handleTransactionCreated} />
                
                <div className="glass-panel p-6 animate-fade-in">
                  <h2 className="text-xl font-semibold mb-4">Example phrases</h2>
                  <div className="space-y-3">
                    {[
                      "Paid ₹3500 for dinner with client at Taj Hotel yesterday",
                      "Received ₹85000 payment from client ABC Corp for web design services",
                      "Purchased new office chair from Amazon for ₹12999",
                      "Spent ₹5000 on petrol for company vehicle on April 10th",
                      "Sold products to customer XYZ for ₹45000 last Monday"
                    ].map((example, index) => (
                      <div 
                        key={index} 
                        className="p-3 bg-muted/50 rounded-md text-sm cursor-pointer hover:bg-muted transition-colors"
                        onClick={() => {
                          navigator.clipboard.writeText(example);
                          toast({
                            title: "Success",
                            description: 'Example copied to clipboard',
                          });
                        }}
                      >
                        {example}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div>
                <TransactionHistory 
                  transactions={transactions} 
                  fetchTransactions={false}
                  onTransactionUpdated={fetchTransactions}
                />
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Transactions;
