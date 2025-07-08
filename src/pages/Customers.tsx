import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Search, Plus, Eye, Edit, Trash2, Users, FileText, CreditCard, Phone, Mail, MapPin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Customer, CustomerFormData } from '@/types/customer';
import { Link } from 'react-router-dom';

const Customers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState<CustomerFormData>({
    customer_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    gstn: '',
    customer_type: 'individual',
    payment_terms: 30,
    credit_limit: 0,
    opening_balance: 0,
    notes: '',
  });
  const { toast } = useToast();

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCustomers(data as Customer[]);
      setFilteredCustomers(data as Customer[]);
    } catch (error) {
      console.error('Failed to fetch customers:', error);
      toast({
        title: "Error",
        description: "Failed to load customers",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    let filtered = customers;

    if (searchTerm) {
      filtered = filtered.filter(customer =>
        customer.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone?.includes(searchTerm)
      );
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(customer => customer.customer_type === typeFilter);
    }

    setFilteredCustomers(filtered);
  }, [searchTerm, typeFilter, customers]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingCustomer) {
        const { error } = await supabase
          .from('customers')
          .update(formData)
          .eq('id', editingCustomer.id);
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Customer updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('customers')
          .insert([{
            ...formData,
            user_id: (await supabase.auth.getUser()).data.user?.id
          }]);
        
        if (error) throw error;
        
        toast({
          title: "Success", 
          description: "Customer created successfully",
        });
      }
      
      setIsDialogOpen(false);
      setEditingCustomer(null);
      resetForm();
      fetchCustomers();
    } catch (error) {
      console.error('Error saving customer:', error);
      toast({
        title: "Error",
        description: "Failed to save customer",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormData({
      customer_name: customer.customer_name,
      email: customer.email || '',
      phone: customer.phone || '',
      address: customer.address || '',
      city: customer.city || '',
      state: customer.state || '',
      pincode: customer.pincode || '',
      gstn: customer.gstn || '',
      customer_type: customer.customer_type,
      payment_terms: customer.payment_terms,
      credit_limit: customer.credit_limit || 0,
      opening_balance: customer.opening_balance,
      notes: customer.notes || '',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (customerId: string) => {
    if (!confirm('Are you sure you want to delete this customer?')) return;
    
    try {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', customerId);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Customer deleted successfully",
      });
      
      fetchCustomers();
    } catch (error) {
      console.error('Error deleting customer:', error);
      toast({
        title: "Error",
        description: "Failed to delete customer",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      customer_name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      gstn: '',
      customer_type: 'individual',
      payment_terms: 30,
      credit_limit: 0,
      opening_balance: 0,
      notes: '',
    });
  };

  const activeCustomers = customers.filter(c => c.is_active);
  const totalCreditLimit = customers.reduce((sum, c) => sum + (c.credit_limit || 0), 0);
  const totalOutstandingBalance = customers.reduce((sum, c) => sum + c.opening_balance, 0);

  return (
    <div className="min-h-screen">
      <main className="container mx-auto max-w-6xl px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Customer Management</h1>
          <p className="mt-2 text-muted-foreground">
            Manage your customer database and track relationships
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <Card className="glass-panel">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{customers.length}</div>
              <p className="text-xs text-muted-foreground">{activeCustomers.length} active</p>
            </CardContent>
          </Card>

          <Card className="glass-panel">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Credit Limit</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{totalCreditLimit.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">total approved</p>
            </CardContent>
          </Card>

          <Card className="glass-panel">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{totalOutstandingBalance.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">opening balances</p>
            </CardContent>
          </Card>

          <Card className="glass-panel">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Business Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {customers.filter(c => c.customer_type === 'business').length}
              </div>
              <p className="text-xs text-muted-foreground">business accounts</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="customers" className="space-y-6">
          <TabsList>
            <TabsTrigger value="customers">All Customers</TabsTrigger>
            <TabsTrigger value="statements">Customer Statements</TabsTrigger>
          </TabsList>

          <TabsContent value="customers" className="space-y-6">
            {/* Filters and Actions */}
            <Card className="glass-panel">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Customer Database</CardTitle>
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={() => { resetForm(); setEditingCustomer(null); }}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Customer
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>
                          {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
                        </DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <Label htmlFor="customer_name">Customer Name *</Label>
                            <Input
                              id="customer_name"
                              value={formData.customer_name}
                              onChange={(e) => setFormData({...formData, customer_name: e.target.value})}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="customer_type">Type</Label>
                            <Select value={formData.customer_type} onValueChange={(value: 'individual' | 'business') => setFormData({...formData, customer_type: value})}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="individual">Individual</SelectItem>
                                <SelectItem value="business">Business</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              type="email"
                              value={formData.email}
                              onChange={(e) => setFormData({...formData, email: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                              id="phone"
                              value={formData.phone}
                              onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            />
                          </div>
                          <div className="md:col-span-2">
                            <Label htmlFor="address">Address</Label>
                            <Input
                              id="address"
                              value={formData.address}
                              onChange={(e) => setFormData({...formData, address: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label htmlFor="city">City</Label>
                            <Input
                              id="city"
                              value={formData.city}
                              onChange={(e) => setFormData({...formData, city: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label htmlFor="state">State</Label>
                            <Input
                              id="state"
                              value={formData.state}
                              onChange={(e) => setFormData({...formData, state: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label htmlFor="pincode">Pincode</Label>
                            <Input
                              id="pincode"
                              value={formData.pincode}
                              onChange={(e) => setFormData({...formData, pincode: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label htmlFor="gstn">GSTN</Label>
                            <Input
                              id="gstn"
                              value={formData.gstn}
                              onChange={(e) => setFormData({...formData, gstn: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label htmlFor="payment_terms">Payment Terms (Days)</Label>
                            <Input
                              id="payment_terms"
                              type="number"
                              value={formData.payment_terms}
                              onChange={(e) => setFormData({...formData, payment_terms: parseInt(e.target.value) || 30})}
                            />
                          </div>
                          <div>
                            <Label htmlFor="credit_limit">Credit Limit</Label>
                            <Input
                              id="credit_limit"
                              type="number"
                              step="0.01"
                              value={formData.credit_limit}
                              onChange={(e) => setFormData({...formData, credit_limit: parseFloat(e.target.value) || 0})}
                            />
                          </div>
                          <div>
                            <Label htmlFor="opening_balance">Opening Balance</Label>
                            <Input
                              id="opening_balance"
                              type="number"
                              step="0.01"
                              value={formData.opening_balance}
                              onChange={(e) => setFormData({...formData, opening_balance: parseFloat(e.target.value) || 0})}
                            />
                          </div>
                          <div className="md:col-span-2">
                            <Label htmlFor="notes">Notes</Label>
                            <Textarea
                              id="notes"
                              value={formData.notes}
                              onChange={(e) => setFormData({...formData, notes: e.target.value})}
                            />
                          </div>
                        </div>
                        <div className="flex gap-2 justify-end">
                          <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button type="submit">
                            {editingCustomer ? 'Update' : 'Create'} Customer
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 mb-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search customers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </div>
                  <div className="w-48">
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="individual">Individual</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {loading ? (
                  <div className="text-center py-10">
                    <p>Loading customers...</p>
                  </div>
                ) : filteredCustomers.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Customer</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Terms</TableHead>
                        <TableHead>Balance</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCustomers.map((customer) => (
                        <TableRow key={customer.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{customer.customer_name}</div>
                              {customer.gstn && (
                                <div className="text-sm text-muted-foreground">GSTN: {customer.gstn}</div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={customer.customer_type === 'business' ? 'default' : 'secondary'}>
                              {customer.customer_type}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              {customer.email && (
                                <div className="flex items-center text-sm">
                                  <Mail className="h-3 w-3 mr-1" />
                                  {customer.email}
                                </div>
                              )}
                              {customer.phone && (
                                <div className="flex items-center text-sm">
                                  <Phone className="h-3 w-3 mr-1" />
                                  {customer.phone}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {customer.city && customer.state && (
                              <div className="flex items-center text-sm">
                                <MapPin className="h-3 w-3 mr-1" />
                                {customer.city}, {customer.state}
                              </div>
                            )}
                          </TableCell>
                          <TableCell>{customer.payment_terms} days</TableCell>
                          <TableCell className={customer.opening_balance > 0 ? "text-red-600" : customer.opening_balance < 0 ? "text-green-600" : ""}>
                            ₹{customer.opening_balance.toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" asChild>
                                <Link to={`/statements?customer=${customer.id}`}>
                                  <Eye className="h-4 w-4" />
                                </Link>
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => handleEdit(customer)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => handleDelete(customer.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-10">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Customers Found</h3>
                    <p className="text-muted-foreground mb-4">
                      {customers.length === 0 
                        ? "Start building your customer database by adding your first customer."
                        : "No customers match your current search criteria."
                      }
                    </p>
                    <Button onClick={() => { resetForm(); setEditingCustomer(null); setIsDialogOpen(true); }}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Customer
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="statements">
            <Card className="glass-panel">
              <CardContent className="pt-6">
                <div className="text-center py-10">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Customer Statements</h3>
                  <p className="text-muted-foreground mb-4">
                    View detailed customer statements with invoices and transactions
                  </p>
                  <Button asChild>
                    <Link to="/statements">
                      <FileText className="h-4 w-4 mr-2" />
                      View Statements
                    </Link>
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

export default Customers;