
import { useState, useEffect } from 'react';
import { Transaction, TransactionType } from '@/lib/types';
import TransactionCard from './TransactionCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, Plus, FileText, BarChart3 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';

interface TransactionHistoryProps {
  transactions: Transaction[];
  title?: string;
  filterTypes?: TransactionType[];
  fetchTransactions?: boolean;
  onTransactionUpdated?: () => void;
}

const TransactionHistory = ({ 
  transactions: initialTransactions, 
  title = "Transaction History",
  filterTypes,
  fetchTransactions = false,
  onTransactionUpdated
}: TransactionHistoryProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const fetchTransactionData = async () => {
    if (!fetchTransactions) {
      setTransactions(initialTransactions);
      return;
    }
    
    setLoading(true);
    try {
      let query = supabase.from('transactions').select('*');
      
      if (filterTypes && filterTypes.length > 0) {
        query = query.in('type', filterTypes);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      setTransactions(data as Transaction[]);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast({
        title: "Error",
        description: "Failed to fetch transactions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactionData();
  }, [fetchTransactions, filterTypes, initialTransactions]);
  
  // Handle transaction updates
  const handleTransactionUpdated = () => {
    fetchTransactionData();
    // Call the parent component's onTransactionUpdated function if it exists
    if (onTransactionUpdated) {
      onTransactionUpdated();
    }
  };
  
  // Filter by search term
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });
  
  return (
    <div className="glass-panel p-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          {filterTypes?.includes('sale' as TransactionType) && (
            <Button asChild variant="outline" size="sm">
              <Link to="/reports/sales">
                <BarChart3 className="h-4 w-4 mr-2" />
                Sales Report
              </Link>
            </Button>
          )}
        </div>
        
        <div className="flex w-full sm:w-auto items-center space-x-2">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search transactions"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-background/50 border-input"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button asChild size="sm">
            <Link to="/transactions">
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Link>
          </Button>
        </div>
      </div>
      
      {loading ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">Loading transactions...</p>
        </div>
      ) : filteredTransactions.length > 0 ? (
        <div className="space-y-3">
          {filteredTransactions.map((transaction) => (
            <TransactionCard 
              key={transaction.id} 
              transaction={transaction} 
              onTransactionUpdated={handleTransactionUpdated} 
              showInvoiceLink={transaction.type === 'sale' && transaction.invoice_id ? true : false}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No transactions found</h3>
          <p className="text-muted-foreground mb-4">
            {transactions.length === 0 
              ? "Start by adding your first transaction"
              : "No transactions match your search criteria"
            }
          </p>
          <Button asChild>
            <Link to="/transactions">
              <Plus className="h-4 w-4 mr-2" />
              Add Transaction
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;
