import { Home, FileText, Package, File, Users, ChevronLeft, ChevronRight } from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  userRole: 'manager' | 'handler' | 'rule_admin' | 'permission_admin';
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({ currentPage, onNavigate, userRole, collapsed, onToggleCollapse }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, roles: ['manager', 'handler'] },
    { id: 'cases', label: '案件清單', icon: FileText, roles: ['manager', 'handler'] },
    { id: 'products', label: '產品管理', icon: Package, roles: ['manager', 'rule_admin'] },
    { id: 'documents', label: '文件管理', icon: File, roles: ['manager', 'rule_admin'] },
    { id: 'handlers', label: '經辦管理', icon: Users, roles: ['manager'] },
  ];

  const visibleItems = menuItems.filter(item => item.roles.includes(userRole));

  return (
    <div className={`bg-sidebar border-r border-sidebar-border h-screen flex flex-col transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}>
      <div className="p-6 border-b border-sidebar-border flex items-center justify-between">
        {!collapsed && <h1 className="text-xl text-sidebar-foreground">文件管理後台</h1>}
        <button 
          onClick={onToggleCollapse}
          className="p-1 hover:bg-sidebar-accent rounded transition-colors"
          title={collapsed ? '展開側邊欄' : '收合側邊欄'}
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5 text-sidebar-foreground" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-sidebar-foreground" />
          )}
        </button>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent'
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      {!collapsed && (
        <div className="p-4 border-t border-sidebar-border">
          <div className="text-sm text-muted-foreground">
            <p>身份：{userRole === 'manager' ? '主管' : userRole === 'handler' ? '經辦' : userRole === 'rule_admin' ? '規則管理者' : '權限管理員'}</p>
          </div>
        </div>
      )}
    </div>
  );
}