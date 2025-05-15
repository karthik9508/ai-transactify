
import React, { useState } from 'react';
import { Transaction } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2, FileText } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { format, isValid, parseISO } from 'date-fns';

interface TransactionCardProps {
  transaction: Transaction;
  showActions?: boolean;
  onTransactionUpdated?: () => void;
  showInvoiceLink?: boolean;
}

const TransactionCard: React.FC<TransactionCardProps> = ({ 
  transaction, 
  showActions = true,
  onTransactionUpdated,
  showInvoiceLink = false
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Format the date string
  const formatDate = (dateString: string) => {
    try {
      // First try to parse as ISO
      const date = parseISO(dateString);
      if (isValid(date)) {
        return format(date, 'MMM d, yyyy');
      }
      
      // If not valid ISO, try other format
      const parts = dateString.split('-');
      if (parts.length === 3) {
        const year = parseInt(parts[0]);
        const month = parseInt(parts[1]) - 1; // months are 0-indexed in JS
        const day = parseInt(parts[2]);
        const dateObj = new Date(year, month, day);
        if (isValid(dateObj)) {
          return format(dateObj, 'MMM d, yyyy');
        }
      }
      
      // Default fallback
      return dateString;
    } catch (e) {
      return dateString; // Fallback to original string
    }
  };
  
  const displayDate = formatDate(transaction.date);
  
  // Define type-specific style classes
  const getTypeStyles = () => {
    switch(transaction.type) {
      case 'income':
        return 'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400';
      case 'expense':
        return 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400';
      case 'purchase':
        return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400';
      case 'sale':
        return 'text-purple-600 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-400';
      default:
        return 'text-gray-600 bg-gray-50 dark:bg-gray-800 dark:text-gray-400';
    }
  };
  
  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', transaction.id);
        
      if (error) {
        throw error;
      }
      
      toast.success('Transaction deleted successfully');
      if (onTransactionUpdated) {
        onTransactionUpdated();
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
      toast.error('Failed to delete transaction');
    } finally {
      setIsDeleting(false);
    }
  };
  
  const viewInvoice = () => {
    if (transaction.invoice_id) {
      // Navigate to the invoice page with the invoice ID
      window.location.href = `/invoice?edit=${transaction.invoice_id}`;
    }
  };
  
  return (
    <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: 
      transaction.type === 'income' ? 'rgb(34, 197, 94)' : 
      transaction.type === 'expense' ? 'rgb(239, 68, 68)' : 
      transaction.type === 'purchase' ? 'rgb(59, 130, 246)' : 
      'rgb(168, 85, 247)' // sale
    }}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="mb-1">
              <span className={`text-sm font-medium px-2 py-1 rounded-full ${getTypeStyles()}`}>
                {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
              </span>
              <span className="text-xs text-muted-foreground ml-2">
                {displayDate}
              </span>
              {showInvoiceLink && transaction.invoice_id && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-2 text-xs flex items-center gap-1"
                  onClick={viewInvoice}
                >
                  <FileText className="h-3.5 w-3.5" />
                  View Invoice
                </Button>
              )}
            </div>
            <p className="font-medium">{transaction.description}</p>
            <p className="text-sm text-muted-foreground">Category: {transaction.category}</p>
          </div>
          <div className="text-right">
            <p className={`font-semibold text-lg ${
              ['income', 'sale'].includes(transaction.type) 
                ? 'text-green-600 dark:text-green-400' 
                : 'text-red-600 dark:text-red-400'
            }`}>
              {['income', 'sale'].includes(transaction.type) ? '+' : '−'} ₹{transaction.amount.toLocaleString()}
            </p>
          </div>
        </div>
        
        {showActions && (
          <div className="flex justify-end mt-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Transaction</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this transaction? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleDelete} 
                    disabled={isDeleting} 
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionCard;
