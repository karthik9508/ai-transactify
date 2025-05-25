import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Button } from './ui/button';
import { Eye, Download, Printer, Pencil } from 'lucide-react';
import { toast } from 'sonner';
import { downloadInvoice, printInvoice } from '@/utils/pdf-utils';
import { StoredInvoice } from '@/lib/types';
import { format } from 'date-fns';
import InvoiceHistoryPreview from './InvoiceHistoryPreview';

const InvoiceHistory = () => {
  const [invoices, setInvoices] = useState<StoredInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState<StoredInvoice | null>(null);
  const { user } = useAuth();
  
  // Type guard function to check if the response data is StoredInvoice[]
  function isStoredInvoiceArray(data: any): data is StoredInvoice[] {
    return Array.isArray(data) && data.every(item => 
      typeof item === 'object' && 
      item !== null && 
      'invoice_number' in item && 
      'data' in item && 
      'created_at' in item && 
      'user_id' in item
    );
  }

  useEffect(() => {
    const fetchInvoices = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('invoices')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('Error fetching invoices:', error);
          return;
        }
        
        if (data && isStoredInvoiceArray(data)) {
          setInvoices(data);
        }
      } catch (error) {
        console.error('Error fetching invoices:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchInvoices();
  }, [user]);
  
  const handlePrintInvoice = async (invoice: StoredInvoice) => {
    try {
      // Set the selected invoice for preview
      setSelectedInvoice(invoice);
      // Wait for DOM to update
      await new Promise(resolve => setTimeout(resolve, 100));
      printInvoice();
      toast.success('Printing invoice...');
    } catch (error) {
      console.error('Error printing invoice:', error);
      toast.error('Failed to print invoice');
    } finally {
      setSelectedInvoice(null);
    }
  };
  
  const handleDownloadInvoice = async (invoice: StoredInvoice) => {
    try {
      toast.loading('Generating PDF...');
      // Set the selected invoice for preview
      setSelectedInvoice(invoice);
      // Wait for DOM to update
      await new Promise(resolve => setTimeout(resolve, 100));
      await downloadInvoice(invoice.invoice_number);
      toast.success('PDF downloaded successfully');
    } catch (error) {
      console.error('Error downloading invoice:', error);
      toast.error('Failed to download PDF');
    } finally {
      toast.dismiss();
      setSelectedInvoice(null);
    }
  };
  
  const handleViewInvoice = (invoice: StoredInvoice) => {
    setSelectedInvoice(invoice);
  };

  const handleEditInvoice = async (invoice: StoredInvoice) => {
    try {
      window.location.href = `/invoice?edit=${invoice.id}`;
    } catch (error) {
      console.error('Error preparing invoice for edit:', error);
      toast.error('Failed to prepare invoice for editing');
    }
  };

  const handleClosePreview = () => {
    setSelectedInvoice(null);
  };
  
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Invoice History</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-muted-foreground">Loading invoices...</p>
          ) : invoices.length > 0 ? (
            <div className="space-y-4">
              {invoices.map((invoice) => (
                <Card key={invoice.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                      <div>
                        <h3 className="text-lg font-semibold">Invoice #{invoice.invoice_number}</h3>
                        <p className="text-muted-foreground text-sm">
                          {format(new Date(invoice.created_at), 'PP')}
                        </p>
                        {invoice.data.billTo?.name && (
                          <p className="text-sm mt-1">Client: {invoice.data.billTo.name}</p>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex items-center gap-1"
                          onClick={() => handleViewInvoice(invoice)}
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>View</span>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex items-center gap-1"
                          onClick={() => handleEditInvoice(invoice)}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          <span>Edit</span>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex items-center gap-1"
                          onClick={() => handlePrintInvoice(invoice)}
                        >
                          <Printer className="h-3.5 w-3.5" />
                          <span>Print</span>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex items-center gap-1"
                          onClick={() => handleDownloadInvoice(invoice)}
                        >
                          <Download className="h-3.5 w-3.5" />
                          <span>Download</span>
                        </Button>
                      </div>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2 items-center">
                      <span className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-900/30 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:text-blue-300">
                        Amount: ₹{invoice.data.total.toFixed(2)}
                      </span>
                      <span className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-800 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:text-gray-300">
                        {invoice.data.items.length} items
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No invoices found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Invoice Preview Modal */}
      {selectedInvoice && (
        <InvoiceHistoryPreview
          invoice={selectedInvoice}
          onClose={handleClosePreview}
          onPrint={() => handlePrintInvoice(selectedInvoice)}
          onDownload={() => handleDownloadInvoice(selectedInvoice)}
        />
      )}

      {/* Hidden invoice content for PDF generation */}
      {selectedInvoice && (
        <div className="hidden">
          <div id="invoice-preview" className="invoice-container">
            <div className="invoice-header">
              <div className="invoice-company">
                <h1>{selectedInvoice.data.businessInfo?.business_name}</h1>
                {selectedInvoice.data.businessInfo?.gstn_number && <p className="gstn-number">GSTN: {selectedInvoice.data.businessInfo.gstn_number}</p>}
                <p>{selectedInvoice.data.businessInfo?.business_address}</p>
                <p>Contact: {selectedInvoice.data.businessInfo?.contact_number}</p>
              </div>
              <div className="invoice-details">
                <h2>INVOICE</h2>
                <p><strong>Invoice #:</strong> {selectedInvoice.data.invoiceNumber}</p>
                <p><strong>Date:</strong> {format(new Date(selectedInvoice.data.date), 'dd/MM/yyyy')}</p>
              </div>
            </div>

            <div className="invoice-recipient">
              <h3>Bill To:</h3>
              <p>{selectedInvoice.data.billTo.name}</p>
              {selectedInvoice.data.billTo.address && <p>{selectedInvoice.data.billTo.address}</p>}
            </div>
            
            <div className="invoice-items">
              <table>
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>Amount (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedInvoice.data.items.map((item, index) => (
                    <tr key={index}>
                      <td>{item.description}</td>
                      <td>{item.quantity}</td>
                      <td>{item.unitPrice}</td>
                      <td className="amount">₹{item.amount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={3}><strong>Subtotal</strong></td>
                    <td className="amount"><strong>₹{selectedInvoice.data.subtotal.toFixed(2)}</strong></td>
                  </tr>
                  <tr>
                    <td colSpan={3}><strong>Tax ({selectedInvoice.data.taxRate}%)</strong></td>
                    <td className="amount"><strong>₹{selectedInvoice.data.taxAmount.toFixed(2)}</strong></td>
                  </tr>
                  <tr>
                    <td colSpan={3}><strong>Total</strong></td>
                    <td className="amount"><strong>₹{selectedInvoice.data.total.toFixed(2)}</strong></td>
                  </tr>
                </tfoot>
              </table>
            </div>
            
            <div className="invoice-footer">
              <p>Thank you for your business!</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InvoiceHistory;
