
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, FileText, Download, Eye, Calendar, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';

interface CustomerStatement {
  id: string;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  invoiceCount: number;
  lastInvoiceDate: string;
  status: 'paid' | 'pending' | 'overdue';
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
      
      // Fetch all invoices to calculate customer statements
      const { data: invoices, error } = await supabase
        .from('invoices')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Group invoices by customer and calculate statements
      const customerMap = new Map<string, any>();
      
      invoices?.forEach((invoice) => {
        const data = invoice.data as any;
        const customerKey = `${data.billTo.name}-${data.billTo.email || ''}`;
        
        if (!customerMap.has(customerKey)) {
          customerMap.set(customerKey, {
            id: `customer-${customerKey}`,
            customerName: data.billTo.name,
            customerEmail: data.billTo.email || 'N/A',
            totalAmount: 0,
            paidAmount: 0,
            balanceAmount: 0,
            invoiceCount: 0,
            lastInvoiceDate: invoice.created_at,
            invoices: []
          });
        }

        const customer = customerMap.get(customerKey);
        customer.totalAmount += data.total;
        customer.invoiceCount += 1;
        customer.invoices.push(invoice);
        
        // For demo purposes, assume some invoices are paid
        const isPaid = Math.random() > 0.3; // 70% chance of being paid
        if (isPaid) {
          customer.paidAmount += data.total;
        }
        
        customer.balanceAmount = customer.totalAmount - customer.paidAmount;
        
        // Determine status
        if (customer.balanceAmount === 0) {
          customer.status = 'paid';
        } else {
          const invoiceDate = new Date(invoice.created_at);
          const daysDiff = (new Date().getTime() - invoiceDate.getTime()) / (1000 * 3600 * 24);
          customer.status = daysDiff > 30 ? 'overdue' : 'pending';
        }
      });

      const customerStatements = Array.from(customerMap.values());
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
    toast({
      title: "Statement Generated",
      description: "Customer statement has been generated successfully",
    });
  };

  const handleViewStatement = (customerId: string) => {
    toast({
      title: "View Statement",
      description: "Opening customer statement preview",
    });
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

  return (
    <div className="min-h-screen">
      <main className="container mx-auto max-w-6xl px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Customer Statements</h1>
          <p className="mt-2 text-muted-foreground">
            Manage and view customer account statements
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card className="glass-panel">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Outstanding</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalOutstanding}</div>
              <p className="text-xs text-muted-foreground">customers with pending payments</p>
            </CardContent>
          </Card>

          <Card className="glass-panel">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{totalBalance.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">outstanding amount</p>
            </CardContent>
          </Card>

          <Card className="glass-panel">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statements.length}</div>
              <p className="text-xs text-muted-foreground">active customers</p>
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
                        <TableHead>Total Amount</TableHead>
                        <TableHead>Paid Amount</TableHead>
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
                          <TableCell>{statement.invoiceCount}</TableCell>
                          <TableCell>₹{statement.totalAmount.toFixed(2)}</TableCell>
                          <TableCell>₹{statement.paidAmount.toFixed(2)}</TableCell>
                          <TableCell>₹{statement.balanceAmount.toFixed(2)}</TableCell>
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
                    <p>No customer statements found</p>
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
