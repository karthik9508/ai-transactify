import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, FileText, Download, Eye, Calendar, User, ExternalLink, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

interface CustomerStatement {
  id: string;
  customerName: string;
  customerEmail: string;
  totalSales: number;
  totalPayments: number;
  balanceAmount: number;
  invoiceCount: number;
  transactionCount: number;
  lastInvoiceDate: string;
  lastTransactionDate: string;
  status: 'paid' | 'pending' | 'overdue';
  invoices: any[];
  transactions: any[];
}

const Statements = () => {
  const [statements, setStatements] = useState<CustomerStatement[]>([]);
  const [filteredStatements, setFilteredStatements] = useState<CustomerStatement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { toast } = useToast();

  const fetchCustomerStatements = async () => {
    try {
      setLoading(true);
      
      // Fetch all invoices with their linked transactions
      const { data: invoices, error: invoicesError } = await supabase
        .from('invoices')
        .select('*')
        .order('created_at', { ascending: false });

      if (invoicesError) {
        throw invoicesError;
      }

      // Fetch all transactions
      const { data: transactions, error: transactionsError } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false });

      if (transactionsError) {
        throw transactionsError;
      }

      // Group by customer and calculate statements
      const customerMap = new Map<string, any>();
      
      // Process invoices first
      invoices?.forEach((invoice) => {
        const data = invoice.data as any;
        const customerKey = `${data.billTo.name}-${data.billTo.email || 'no-email'}`;
        
        if (!customerMap.has(customerKey)) {
          customerMap.set(customerKey, {
            id: `customer-${customerKey}`,
            customerName: data.billTo.name,
            customerEmail: data.billTo.email || 'N/A',
            totalSales: 0,
            totalPayments: 0,
            balanceAmount: 0,
            invoiceCount: 0,
            transactionCount: 0,
            lastInvoiceDate: invoice.created_at,
            lastTransactionDate: null,
            invoices: [],
            transactions: []
          });
        }

        const customer = customerMap.get(customerKey);
        customer.totalSales += data.total;
        customer.invoiceCount += 1;
        customer.invoices.push(invoice);
        
        if (new Date(invoice.created_at) > new Date(customer.lastInvoiceDate)) {
          customer.lastInvoiceDate = invoice.created_at;
        }
      });

      // Process transactions and link them to customers
      transactions?.forEach((transaction) => {
        // For sale transactions, try to match with existing customers
        if (transaction.type === 'sale' || transaction.type === 'income') {
          // If linked to an invoice, find the customer from that invoice
          if (transaction.invoice_id) {
            const linkedInvoice = invoices?.find(inv => inv.id === transaction.invoice_id);
            if (linkedInvoice) {
              const data = linkedInvoice.data as any;
              const customerKey = `${data.billTo.name}-${data.billTo.email || 'no-email'}`;
              
              if (customerMap.has(customerKey)) {
                const customer = customerMap.get(customerKey);
                customer.transactions.push(transaction);
                customer.transactionCount += 1;
                customer.totalPayments += transaction.amount;
                
                if (!customer.lastTransactionDate || new Date(transaction.created_at) > new Date(customer.lastTransactionDate)) {
                  customer.lastTransactionDate = transaction.created_at;
                }
              }
            }
          } else {
            // For transactions without invoice links, create customer based on description
            const customerName = transaction.description.includes('from') 
              ? transaction.description.split('from')[1]?.trim() || 'Unknown Customer'
              : 'Cash Sale';
            
            const customerKey = `${customerName}-no-email`;
            
            if (!customerMap.has(customerKey)) {
              customerMap.set(customerKey, {
                id: `customer-${customerKey}`,
                customerName: customerName,
                customerEmail: 'N/A',
                totalSales: 0,
                totalPayments: 0,
                balanceAmount: 0,
                invoiceCount: 0,
                transactionCount: 0,
                lastInvoiceDate: null,
                lastTransactionDate: transaction.created_at,
                invoices: [],
                transactions: []
              });
            }

            const customer = customerMap.get(customerKey);
            customer.transactions.push(transaction);
            customer.transactionCount += 1;
            customer.totalSales += transaction.amount;
            customer.totalPayments += transaction.amount; // Assume cash sales are paid immediately
            
            if (!customer.lastTransactionDate || new Date(transaction.created_at) > new Date(customer.lastTransactionDate)) {
              customer.lastTransactionDate = transaction.created_at;
            }
          }
        }
      });

      // Calculate balance and status for each customer
      const customerStatements = Array.from(customerMap.values()).map(customer => {
        customer.balanceAmount = customer.totalSales - customer.totalPayments;
        
        // Determine status
        if (customer.balanceAmount <= 0) {
          customer.status = 'paid';
        } else {
          const lastDate = customer.lastInvoiceDate || customer.lastTransactionDate;
          if (lastDate) {
            const daysDiff = (new Date().getTime() - new Date(lastDate).getTime()) / (1000 * 3600 * 24);
            customer.status = daysDiff > 30 ? 'overdue' : 'pending';
          } else {
            customer.status = 'pending';
          }
        }
        
        return customer;
      });

      setStatements(customerStatements);
      setFilteredStatements(customerStatements);
    } catch (error) {
      console.error('Failed to fetch customer statements:', error);
      toast({
        title: "Error",
        description: "Failed to load customer statements",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomerStatements();
  }, []);

  useEffect(() => {
    let filtered = statements;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(statement =>
        statement.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        statement.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(statement => statement.status === statusFilter);
    }

    setFilteredStatements(filtered);
  }, [searchTerm, statusFilter, statements]);

  const handleGenerateStatement = (customerId: string) => {
    const customer = statements.find(s => s.id === customerId);
    if (customer) {
      toast({
        title: "Statement Generated",
        description: `Statement for ${customer.customerName} has been generated successfully`,
      });
    }
  };

  const handleViewStatement = (customerId: string) => {
    const customer = statements.find(s => s.id === customerId);
    if (customer) {
      toast({
        title: "View Statement",
        description: `Opening statement for ${customer.customerName}`,
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge variant="default" className="bg-green-500">Paid</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'overdue':
        return <Badge variant="destructive">Overdue</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const totalBalance = statements.reduce((sum, statement) => sum + statement.balanceAmount, 0);
  const totalOutstanding = statements.filter(s => s.status !== 'paid').length;
  const totalSales = statements.reduce((sum, statement) => sum + statement.totalSales, 0);

  return (
    <div className="min-h-screen">
      <main className="container mx-auto max-w-6xl px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Customer Statements</h1>
          <p className="mt-2 text-muted-foreground">
            View customer account statements based on invoices and transactions
          </p>
          
          {/* Quick Actions */}
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
              <Link to="/reports/sales">
                <ExternalLink className="h-4 w-4 mr-2" />
                Sales Report
              </Link>
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <Card className="glass-panel">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statements.length}</div>
              <p className="text-xs text-muted-foreground">active customers</p>
            </CardContent>
          </Card>

          <Card className="glass-panel cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => window.location.href = '/reports/sales'}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{totalSales.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">total sales amount</p>
            </CardContent>
          </Card>

          <Card className="glass-panel">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Outstanding Amount</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{totalBalance.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">pending payments</p>
            </CardContent>
          </Card>

          <Card className="glass-panel">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Customers</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalOutstanding}</div>
              <p className="text-xs text-muted-foreground">with outstanding balance</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="statements" className="space-y-6">
          <TabsList>
            <TabsTrigger value="statements">Customer Statements</TabsTrigger>
            <TabsTrigger value="generate">Generate Statement</TabsTrigger>
          </TabsList>

          <TabsContent value="statements" className="space-y-6">
            {/* Filters */}
            <Card className="glass-panel">
              <CardHeader>
                <CardTitle>Filter Statements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Label htmlFor="search">Search Customer</Label>
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="search"
                        placeholder="Search by customer name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </div>
                  <div className="w-48">
                    <Label htmlFor="status">Status</Label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="overdue">Overdue</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Statements Table */}
            <Card className="glass-panel">
              <CardHeader>
                <CardTitle>Customer Statements</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Based on your invoices and sales transactions
                </p>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-10">
                    <p>Loading customer statements...</p>
                  </div>
                ) : filteredStatements.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Customer</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Invoices</TableHead>
                        <TableHead>Transactions</TableHead>
                        <TableHead>Total Sales</TableHead>
                        <TableHead>Payments</TableHead>
                        <TableHead>Balance</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStatements.map((statement) => (
                        <TableRow key={statement.id}>
                          <TableCell className="font-medium">{statement.customerName}</TableCell>
                          <TableCell>{statement.customerEmail}</TableCell>
                          <TableCell>
                            <Button variant="link" className="p-0 h-auto">
                              <Link to="/invoice" className="text-primary">
                                {statement.invoiceCount}
                              </Link>
                            </Button>
                          </TableCell>
                          <TableCell>
                            <Button variant="link" className="p-0 h-auto">
                              <Link to="/transactions" className="text-primary">
                                {statement.transactionCount}
                              </Link>
                            </Button>
                          </TableCell>
                          <TableCell>₹{statement.totalSales.toFixed(2)}</TableCell>
                          <TableCell>₹{statement.totalPayments.toFixed(2)}</TableCell>
                          <TableCell className={statement.balanceAmount > 0 ? "text-red-600 font-medium" : "text-green-600"}>
                            ₹{statement.balanceAmount.toFixed(2)}
                          </TableCell>
                          <TableCell>{getStatusBadge(statement.status)}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewStatement(statement.id)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleGenerateStatement(statement.id)}
                              >
                                <Download className="h-4 w-4 mr-1" />
                                Download
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-10">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Customer Statements Found</h3>
                    <p className="text-muted-foreground mb-4">
                      {statements.length === 0 
                        ? "Create some invoices or sales transactions to see customer statements here."
                        : "No customers match your current search criteria."
                      }
                    </p>
                    <div className="flex justify-center gap-4">
                      <Button asChild>
                        <Link to="/invoice">
                          <Plus className="h-4 w-4 mr-2" />
                          Create First Invoice
                        </Link>
                      </Button>
                      <Button variant="outline" asChild>
                        <Link to="/transactions">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Transaction
                        </Link>
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="generate" className="space-y-6">
            <Card className="glass-panel">
              <CardHeader>
                <CardTitle>Generate New Statement</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Generate a statement for a specific customer and date range
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="customer">Customer</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select customer" />
                      </SelectTrigger>
                      <SelectContent>
                        {statements.map((statement) => (
                          <SelectItem key={statement.id} value={statement.id}>
                            {statement.customerName} ({statement.customerEmail})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="period">Statement Period</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="last30">Last 30 days</SelectItem>
                        <SelectItem value="last60">Last 60 days</SelectItem>
                        <SelectItem value="last90">Last 90 days</SelectItem>
                        <SelectItem value="custom">Custom range</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button className="flex-1">
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Statement
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Statements;
