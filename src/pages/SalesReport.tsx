
import { useState, useEffect } from 'react';
import TransactionHistory from '@/components/TransactionHistory';
import { Transaction } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import ReportSummary from '@/components/report/ReportSummary';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Link } from 'react-router-dom';
import { ExternalLink, Plus, FileText, Users } from 'lucide-react';

const SalesReport = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  const fetchSalesTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .in('type', ['income', 'sale'])
        .order('created_at', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      setTransactions(data as Transaction[]);
    } catch (error) {
      console.error('Failed to fetch sales transactions:', error);
      toast({
        title: "Error",
        description: "Failed to load sales data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchSalesTransactions();
  }, [toast]);
  
  // Calculate total sales
  const totalSales = transactions.reduce(
    (sum, transaction) => sum + transaction.amount, 
    0
  );

  return (
    <div className="flex-1 min-h-screen">
      <main className="container mx-auto max-w-6xl px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Sales Report</h1>
          <p className="mt-2 text-muted-foreground">
            View and analyze your sales data
          </p>
          
          {/* Quick Navigation */}
          <div className="flex justify-center gap-4 mt-4">
            <Button asChild variant="outline">
              <Link to="/invoice">
                <Plus className="h-4 w-4 mr-2" />
                Create Invoice
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/transactions">
                <Plus className="h-4 w-4 mr-2" />
                Add Transaction
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/sales/statements">
                <Users className="h-4 w-4 mr-2" />
                Customer Statements
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/reports/purchases">
                <ExternalLink className="h-4 w-4 mr-2" />
                Purchase Report
              </Link>
            </Button>
          </div>
        </div>
        
        {loading ? (
          <div className="glass-panel p-6 text-center">
            <p>Loading sales data...</p>
          </div>
        ) : transactions.length > 0 ? (
          <div className="space-y-8">
            {/* Report Summary Sidebar */}
            <ReportSummary
              transactions={transactions}
              title="Sales"
            />
            
            <div className="glass-panel p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Sales Summary</h2>
                <Button asChild variant="outline" size="sm">
                  <Link to="/sales/statements">
                    <FileText className="h-4 w-4 mr-2" />
                    View Customer Statements
                  </Link>
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Metric</TableHead>
                    <TableHead className="text-right">Value</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Total Sales</TableCell>
                    <TableCell className="text-right font-medium">₹{totalSales.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="link" size="sm">
                        <Link to="/sales/statements">View Customers</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Number of Transactions</TableCell>
                    <TableCell className="text-right font-medium">{transactions.length}</TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="link" size="sm">
                        <Link to="/transactions">Add More</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Average Sale</TableCell>
                    <TableCell className="text-right font-medium">
                      ₹{(totalSales / (transactions.length || 1)).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="link" size="sm">
                        <Link to="/invoice">Create Invoice</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            
            <TransactionHistory 
              transactions={transactions} 
              title="Sales Transactions" 
              filterTypes={['income', 'sale']}
              fetchTransactions={false}
              onTransactionUpdated={fetchSalesTransactions}
            />
          </div>
        ) : (
          <div className="glass-panel p-6 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-4">No Sales Data</h2>
            <p className="text-muted-foreground mb-6">You haven't recorded any sales transactions yet.</p>
            <div className="flex justify-center gap-4">
              <Button asChild>
                <Link to="/invoice">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Invoice
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/transactions">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Sales Transaction
                </Link>
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default SalesReport;
