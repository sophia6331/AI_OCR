import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { CaseList } from './components/CaseList';
import { CaseDetail } from './components/CaseDetail';
import { ProductManagement } from './components/ProductManagement';
import { DocumentManagement } from './components/DocumentManagement';
import { HandlerManagement } from './components/HandlerManagement';

type Page = 'dashboard' | 'cases' | 'products' | 'documents' | 'handlers';
type UserRole = 'manager' | 'handler' | 'rule_admin' | 'permission_admin';

export default function App() {
  // 可以切換這個值來測試不同角色的介面
  const [userRole, setUserRole] = useState<UserRole>('manager');
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [showReassignModal, setShowReassignModal] = useState(false);
  const [reassignCaseId, setReassignCaseId] = useState<string | null>(null);
  const [selectedHandler, setSelectedHandler] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const userName = userRole === 'manager' ? '林主管' : userRole === 'handler' ? '張小明' : '管理員';

  const getPageTitle = () => {
    if (selectedCaseId) return '案件明細';
    
    switch (currentPage) {
      case 'dashboard':
        return 'Dashboard';
      case 'cases':
        return '案件清單';
      case 'products':
        return '產品管理';
      case 'documents':
        return '文件管理';
      case 'handlers':
        return '經辦管理';
      default:
        return '';
    }
  };

  const handleViewCase = (caseId: string) => {
    setSelectedCaseId(caseId);
  };

  const handleBackToCaseList = () => {
    setSelectedCaseId(null);
  };

  const handleReassign = (caseId: string) => {
    setReassignCaseId(caseId);
    setShowReassignModal(true);
  };

  const handleConfirmReassign = () => {
    if (!selectedHandler) {
      alert('請選擇經辦人員');
      return;
    }
    console.log(`轉派案件 ${reassignCaseId} 給 ${selectedHandler}`);
    setShowReassignModal(false);
    setReassignCaseId(null);
    setSelectedHandler('');
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
    setSelectedCaseId(null);
  };

  return (
    <div className="flex h-screen bg-background">
      {/* 側邊欄 */}
      <Sidebar 
        currentPage={currentPage} 
        onNavigate={handleNavigate} 
        userRole={userRole}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* 主內容區 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 頂部標題列 */}
        <Header title={getPageTitle()} userName={userName} userRole={userRole} />

        {/* 內容區域 */}
        <div className="flex-1 overflow-y-auto">
          {/* Dashboard */}
          {currentPage === 'dashboard' && !selectedCaseId && (
            <Dashboard userRole={userRole === 'manager' || userRole === 'handler' ? userRole : 'handler'} />
          )}

          {/* 案件清單 */}
          {currentPage === 'cases' && !selectedCaseId && (
            <CaseList
              userRole={userRole === 'manager' || userRole === 'handler' ? userRole : 'handler'}
              onViewCase={handleViewCase}
              onReassign={userRole === 'manager' ? handleReassign : undefined}
            />
          )}

          {/* 案件明細 */}
          {selectedCaseId && (
            <CaseDetail
              caseId={selectedCaseId}
              onBack={handleBackToCaseList}
              userRole={userRole === 'manager' || userRole === 'handler' ? userRole : 'handler'}
            />
          )}

          {/* 產品管理 */}
          {currentPage === 'products' && <ProductManagement />}

          {/* 文件管理 */}
          {currentPage === 'documents' && <DocumentManagement />}

          {/* 經辦管理 */}
          {currentPage === 'handlers' && <HandlerManagement />}
        </div>
      </div>

      {/* 轉派彈窗 */}
      {showReassignModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="mb-4">轉派案件</h3>
            <div className="mb-4">
              <p className="text-sm text-muted-foreground mb-2">案件代號：{reassignCaseId}</p>
              <label className="block text-sm mb-2">選擇經辦人員</label>
              <select
                value={selectedHandler}
                onChange={(e) => setSelectedHandler(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg bg-input-background"
              >
                <option value="">請選擇...</option>
                <option value="E001">張小明 (E001)</option>
                <option value="E002">李美華 (E002)</option>
                <option value="E003">王大偉 (E003)</option>
                <option value="E004">陳雅婷 (E004)</option>
              </select>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowReassignModal(false);
                  setReassignCaseId(null);
                  setSelectedHandler('');
                }}
                className="px-4 py-2 border border-border rounded-lg hover:bg-accent"
              >
                取消
              </button>
              <button
                onClick={handleConfirmReassign}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
              >
                確認轉派
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 角色切換器（僅用於演示） */}
      <div className="fixed bottom-4 right-4 bg-card border border-border rounded-lg p-4 shadow-lg">
        <p className="text-sm mb-2">演示角色切換</p>
        <select
          value={userRole}
          onChange={(e) => setUserRole(e.target.value as UserRole)}
          className="w-full px-3 py-2 border border-border rounded-lg bg-input-background text-sm"
        >
          <option value="manager">主管</option>
          <option value="handler">經辦</option>
          <option value="rule_admin">規則管理者</option>
          <option value="permission_admin">權限管理員</option>
        </select>
      </div>
    </div>
  );
}