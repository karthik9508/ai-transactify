
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import AppLayout from "@/components/AppLayout";

// Import pages
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Invoice from "./pages/Invoice";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import SalesReport from "./pages/SalesReport";
import PurchaseOrders from "./pages/PurchaseOrders";
import PurchaseReport from "./pages/PurchaseReport";
import ExpenseReport from "./pages/ExpenseReport";
import PLAccount from "./pages/PLAccount";
import BalanceSheet from "./pages/BalanceSheet";
import FinancialAnalysis from "./pages/FinancialAnalysis";
import Settings from "./pages/Settings";
import Statements from "./pages/Statements";
import Customers from "./pages/Customers";

// Create a single instance of QueryClient
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              
              {/* Protected routes with AppLayout */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <AppLayout>
                    <Dashboard />
                  </AppLayout>
                </ProtectedRoute>
              } />
              
              {/* Transactions routes */}
              <Route path="/transactions">
                <Route index element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Transactions />
                    </AppLayout>
                  </ProtectedRoute>
                } />
                <Route path=":transactionId" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Transactions />
                    </AppLayout>
                  </ProtectedRoute>
                } />
              </Route>
              
              {/* Invoice routes */}
              <Route path="/invoice">
                <Route index element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Invoice />
                    </AppLayout>
                  </ProtectedRoute>
                } />
                <Route path=":invoiceId" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Invoice />
                    </AppLayout>
                  </ProtectedRoute>
                } />
              </Route>
              
              {/* Customer and sales routes */}
              <Route path="/customers" element={
                <ProtectedRoute>
                  <AppLayout>
                    <Customers />
                  </AppLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/statements" element={
                <ProtectedRoute>
                  <AppLayout>
                    <Statements />
                  </AppLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/sales">
                <Route path="statements" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Statements />
                    </AppLayout>
                  </ProtectedRoute>
                } />
              </Route>
              
              {/* Reports routes */}
              <Route path="/reports">
                <Route path="sales" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <SalesReport />
                    </AppLayout>
                  </ProtectedRoute>
                } />
                <Route path="purchases" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <PurchaseReport />
                    </AppLayout>
                  </ProtectedRoute>
                } />
                <Route path="expenses" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <ExpenseReport />
                    </AppLayout>
                  </ProtectedRoute>
                } />
              </Route>
              
              {/* Financial analysis routes */}
              <Route path="/financials">
                <Route path="pl-account" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <PLAccount />
                    </AppLayout>
                  </ProtectedRoute>
                } />
                <Route path="balance-sheet" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <BalanceSheet />
                    </AppLayout>
                  </ProtectedRoute>
                } />
                <Route path="analysis" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <FinancialAnalysis />
                    </AppLayout>
                  </ProtectedRoute>
                } />
              </Route>
              
              {/* Purchase orders */}
              <Route path="/purchase-orders">
                <Route index element={
                  <ProtectedRoute>
                    <AppLayout>
                      <PurchaseOrders />
                    </AppLayout>
                  </ProtectedRoute>
                } />
                <Route path=":orderId" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <PurchaseOrders />
                    </AppLayout>
                  </ProtectedRoute>
                } />
              </Route>
              
              {/* User routes */}
              <Route path="/profile" element={
                <ProtectedRoute>
                  <AppLayout>
                    <Profile />
                  </AppLayout>
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <AppLayout>
                    <Settings />
                  </AppLayout>
                </ProtectedRoute>
              } />
              
              {/* Legacy route redirects */}
              <Route path="/sales-report" element={<Navigate to="/reports/sales" replace />} />
              <Route path="/purchase-report" element={<Navigate to="/reports/purchases" replace />} />
              <Route path="/expense-report" element={<Navigate to="/reports/expenses" replace />} />
              <Route path="/pl-account" element={<Navigate to="/financials/pl-account" replace />} />
              <Route path="/balance-sheet" element={<Navigate to="/financials/balance-sheet" replace />} />
              <Route path="/financial-analysis" element={<Navigate to="/financials/analysis" replace />} />
              
              {/* 404 route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
