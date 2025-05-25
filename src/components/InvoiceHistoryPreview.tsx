
import React from 'react';
import { StoredInvoice } from '@/lib/types';
import { format } from 'date-fns';
import '../styles/invoice.css';

interface InvoiceHistoryPreviewProps {
  invoice: StoredInvoice;
  onClose: () => void;
  onPrint: () => void;
  onDownload: () => void;
}

const InvoiceHistoryPreview = ({ invoice, onClose, onPrint, onDownload }: InvoiceHistoryPreviewProps) => {
  const invoiceData = invoice.data;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header with actions */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Invoice Preview</h2>
          <div className="flex gap-2">
            <button
              onClick={onPrint}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Print
            </button>
            <button
              onClick={onDownload}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Download PDF
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>

        {/* Invoice content */}
        <div className="overflow-auto max-h-[calc(90vh-80px)]">
          <div id="invoice-preview" className="invoice-container p-8">
            <div className="invoice-header">
              <div className="invoice-company">
                <h1>{invoiceData.businessInfo?.business_name || 'Your Business'}</h1>
                {invoiceData.businessInfo?.gstn_number && (
                  <p className="gstn-number">GSTN: {invoiceData.businessInfo.gstn_number}</p>
                )}
                <p>{invoiceData.businessInfo?.business_address || 'Business Address'}</p>
                <p>Contact: {invoiceData.businessInfo?.contact_number || 'Contact Number'}</p>
              </div>
              <div className="invoice-details">
                <h2>INVOICE</h2>
                <p><strong>Invoice #:</strong> {invoiceData.invoiceNumber}</p>
                <p><strong>Date:</strong> {format(new Date(invoiceData.date), 'dd/MM/yyyy')}</p>
                <p><strong>Due Date:</strong> {format(new Date(invoiceData.dueDate), 'dd/MM/yyyy')}</p>
              </div>
            </div>

            <div className="invoice-recipient">
              <h3>Bill To:</h3>
              <p>{invoiceData.billTo.name}</p>
              <p>{invoiceData.billTo.address}</p>
              {invoiceData.billTo.email && <p>{invoiceData.billTo.email}</p>}
            </div>
            
            <div className="invoice-items">
              <table>
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceData.items.map((item, index) => (
                    <tr key={index}>
                      <td>{item.description}</td>
                      <td>{item.quantity}</td>
                      <td>₹{item.unitPrice.toFixed(2)}</td>
                      <td className="amount">₹{item.amount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={3}><strong>Subtotal</strong></td>
                    <td className="amount"><strong>₹{invoiceData.subtotal.toFixed(2)}</strong></td>
                  </tr>
                  <tr>
                    <td colSpan={3}><strong>Tax ({invoiceData.taxRate}%)</strong></td>
                    <td className="amount"><strong>₹{invoiceData.taxAmount.toFixed(2)}</strong></td>
                  </tr>
                  <tr>
                    <td colSpan={3}><strong>Total</strong></td>
                    <td className="amount"><strong>₹{invoiceData.total.toFixed(2)}</strong></td>
                  </tr>
                </tfoot>
              </table>
            </div>
            
            <div className="invoice-footer">
              <p>Thank you for your business!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceHistoryPreview;
