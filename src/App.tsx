import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "@/context/ThemeContext"
import { AuthProvider } from "@/context/AuthContext"
import { Toaster } from "@/components/ui/toaster"

// Pages
import Index from "@/pages/Index"
import Auth from "@/pages/Auth"
import Dashboard from "@/pages/Dashboard"
import Transactions from "@/pages/Transactions"
import Invoice from "@/pages/Invoice"
import Profile from "@/pages/Profile"
import Settings from "@/pages/Settings"
import Customers from "@/pages/Customers"
import Statements from "@/pages/Statements"
import PurchaseOrders from "@/pages/PurchaseOrders"
import SalesReport from "@/pages/SalesReport"
import PurchaseReport from "@/pages/PurchaseReport"
import ExpenseReport from "@/pages/ExpenseReport"
import PLAccount from "@/pages/PLAccount"
import BalanceSheet from "@/pages/BalanceSheet"
import FinancialAnalysis from "@/pages/FinancialAnalysis"
import NotFound from "@/pages/NotFound"

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-background">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/invoice" element={<Invoice />} />
              <Route path="/purchase-orders" element={<PurchaseOrders />} />
              <Route path="/statements" element={<Statements />} />
              <Route path="/reports/sales" element={<SalesReport />} />
              <Route path="/reports/purchases" element={<PurchaseReport />} />
              <Route path="/reports/expenses" element={<ExpenseReport />} />
              <Route path="/financials/pl-account" element={<PLAccount />} />
              <Route path="/financials/balance-sheet" element={<BalanceSheet />} />
              <Route path="/financials/analysis" element={<FinancialAnalysis />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App