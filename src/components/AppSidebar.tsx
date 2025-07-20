import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { 
  Home,
  Users,
  Receipt,
  FileText,
  ShoppingCart,
  BarChart3,
  Settings,
  CreditCard,
  DollarSign,
  TrendingUp
} from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"

const items = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Customers", url: "/customers", icon: Users },
  { title: "Transactions", url: "/transactions", icon: CreditCard },
  { title: "Invoices", url: "/invoice", icon: Receipt },
  { title: "Purchase Orders", url: "/purchase-orders", icon: ShoppingCart },
  { title: "Statements", url: "/statements", icon: FileText },
  { title: "Reports", url: "/reports", icon: BarChart3, items: [
    { title: "Sales Report", url: "/reports/sales" },
    { title: "Purchase Report", url: "/reports/purchases" },
    { title: "Expense Report", url: "/reports/expenses" },
  ]},
  { title: "Financials", url: "/financials", icon: DollarSign, items: [
    { title: "P&L Account", url: "/financials/pl-account" },
    { title: "Balance Sheet", url: "/financials/balance-sheet" },
    { title: "Financial Analysis", url: "/financials/analysis" },
  ]},
  { title: "Profile", url: "/profile", icon: TrendingUp },
  { title: "Settings", url: "/settings", icon: Settings },
]

export default function AppSidebar() {
  const { state } = useSidebar()
  const collapsed = state === "collapsed"
  const location = useLocation()
  const currentPath = location.pathname

  const isActive = (path: string) => currentPath === path || currentPath.startsWith(path + "/")
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-accent text-accent-foreground font-medium" : "hover:bg-accent/50"

  return (
    <Sidebar className={collapsed ? "w-14" : "w-60"}>
      <SidebarTrigger className="m-2 self-end" />
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>AccountAI</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavCls}>
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                  {item.items && !collapsed && (
                    <SidebarMenu className="ml-4">
                      {item.items.map((subItem) => (
                        <SidebarMenuItem key={subItem.title}>
                          <SidebarMenuButton asChild size="sm">
                            <NavLink to={subItem.url} className={getNavCls}>
                              <span>{subItem.title}</span>
                            </NavLink>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}