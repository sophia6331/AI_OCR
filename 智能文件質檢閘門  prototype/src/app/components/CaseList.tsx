import { useState } from 'react';
import { Search, ArrowUpDown, RefreshCw } from 'lucide-react';

interface CaseListProps {
  userRole: 'manager' | 'handler';
  onViewCase: (caseId: string) => void;
  onReassign?: (caseId: string) => void;
}

interface CaseItem {
  caseId: string;
  name: string;
  idNumber: string;
  submitDate: string;
  updateDate: string;
  status: 0 | 1 | 2 | -1; // 0: 待審核, 1: 待補件, 2: 送件, -1: 退件
  caseType: 0 | 1; // 0: 新件, 1: 補件
  handler: {
    id: string;
    name: string;
  };
  aiQualityRate: number;
}

export function CaseList({ userRole, onViewCase, onReassign }: CaseListProps) {
  const [filters, setFilters] = useState({
    dateStart: '',
    dateEnd: '',
    statusPendingReview: true,
    statusPendingSupplement: false,
    statusApproved: false,
    statusRejected: false,
    typeNew: true,
    typeSupplement: true,
    caseId: '',
    keyword: '',
    handler: 'all',
  });

  const [sortBy, setSortBy] = useState<'submitDate' | 'updateDate'>('submitDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // 模擬案件數據
  const mockCases: CaseItem[] = [
    {
      caseId: 'CC2024010001',
      name: '王小明',
      idNumber: 'A123456789',
      submitDate: '2024-01-15 10:30',
      updateDate: '2024-01-15 14:20',
      status: 0,
      caseType: 0,
      handler: { id: 'E001', name: '張小明' },
      aiQualityRate: 95.5,
    },
    {
      caseId: 'CC2024010002',
      name: '李美華',
      idNumber: 'B234567890',
      submitDate: '2024-01-15 11:00',
      updateDate: '2024-01-16 09:15',
      status: 1,
      caseType: 0,
      handler: { id: 'E002', name: '李美華' },
      aiQualityRate: 88.3,
    },
    {
      caseId: 'CC2024010003',
      name: '陳大偉',
      idNumber: 'C345678901',
      submitDate: '2024-01-14 15:45',
      updateDate: '2024-01-15 16:30',
      status: 2,
      caseType: 0,
      handler: { id: 'E001', name: '張小明' },
      aiQualityRate: 92.7,
    },
    {
      caseId: 'CC2024010004',
      name: '林雅婷',
      idNumber: 'D456789012',
      submitDate: '2024-01-14 09:20',
      updateDate: '2024-01-14 17:50',
      status: -1,
      caseType: 0,
      handler: { id: 'E003', name: '王大偉' },
      aiQualityRate: 72.1,
    },
    {
      caseId: 'CC2024010005',
      name: '張志強',
      idNumber: 'E567890123',
      submitDate: '2024-01-16 08:30',
      updateDate: '2024-01-16 10:45',
      status: 0,
      caseType: 1,
      handler: { id: 'E004', name: '陳雅婷' },
      aiQualityRate: 91.2,
    },
  ];

  const getStatusLabel = (status: number) => {
    const labels = {
      0: { text: '待審核', color: 'bg-blue-100 text-blue-700' },
      1: { text: '待補件', color: 'bg-yellow-100 text-yellow-700' },
      2: { text: '送件', color: 'bg-green-100 text-green-700' },
      '-1': { text: '退件', color: 'bg-red-100 text-red-700' },
    };
    return labels[status.toString() as keyof typeof labels];
  };

  const getCaseTypeLabel = (type: number) => {
    return type === 0 ? '新件' : '補件';
  };

  const handleSort = (field: 'submitDate' | 'updateDate') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="p-6">
      {/* 過濾條件 */}
      <div className="bg-card rounded-lg border border-border p-6 mb-6">
        <h3 className="mb-4">過濾條件</h3>
        
        {/* 日期區間 */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm text-muted-foreground mb-2">進件起日</label>
            <input
              type="date"
              value={filters.dateStart}
              onChange={(e) => setFilters({ ...filters, dateStart: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg bg-input-background"
            />
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-2">進件迄日</label>
            <input
              type="date"
              value={filters.dateEnd}
              onChange={(e) => setFilters({ ...filters, dateEnd: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg bg-input-background"
            />
          </div>
        </div>

        {/* 案件狀態 */}
        <div className="mb-4">
          <label className="block text-sm text-muted-foreground mb-2">案件狀態</label>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilters({ ...filters, statusPendingReview: !filters.statusPendingReview })}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                filters.statusPendingReview
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-card border-border hover:bg-accent'
              }`}
            >
              待審核
            </button>
            <button
              onClick={() => setFilters({ ...filters, statusPendingSupplement: !filters.statusPendingSupplement })}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                filters.statusPendingSupplement
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-card border-border hover:bg-accent'
              }`}
            >
              待補件
            </button>
            <button
              onClick={() => setFilters({ ...filters, statusApproved: !filters.statusApproved })}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                filters.statusApproved
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-card border-border hover:bg-accent'
              }`}
            >
              送件
            </button>
            <button
              onClick={() => setFilters({ ...filters, statusRejected: !filters.statusRejected })}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                filters.statusRejected
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-card border-border hover:bg-accent'
              }`}
            >
              退件
            </button>
          </div>
        </div>

        {/* 案件類型 */}
        <div className="mb-4">
          <label className="block text-sm text-muted-foreground mb-2">案件類型</label>
          <div className="flex gap-2">
            <button
              onClick={() => setFilters({ ...filters, typeNew: !filters.typeNew })}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                filters.typeNew
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-card border-border hover:bg-accent'
              }`}
            >
              新件
            </button>
            <button
              onClick={() => setFilters({ ...filters, typeSupplement: !filters.typeSupplement })}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                filters.typeSupplement
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-card border-border hover:bg-accent'
              }`}
            >
              補件
            </button>
          </div>
        </div>

        {/* 案件代號與搜尋 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-muted-foreground mb-2">案件代號</label>
            <input
              type="text"
              placeholder="輸入案件代號"
              value={filters.caseId}
              onChange={(e) => setFilters({ ...filters, caseId: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg bg-input-background"
            />
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-2">關鍵字搜尋</label>
            <div className="relative">
              <input
                type="text"
                placeholder="姓名、身分證號"
                value={filters.keyword}
                onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
                className="w-full px-4 py-2 pl-10 border border-border rounded-lg bg-input-background"
              />
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>
        </div>

        {/* 經辦人員（僅主管可見） */}
        {userRole === 'manager' && (
          <div className="mt-4">
            <label className="block text-sm text-muted-foreground mb-2">經辦人員</label>
            <select
              value={filters.handler}
              onChange={(e) => setFilters({ ...filters, handler: e.target.value })}
              className="w-full max-w-xs px-4 py-2 border border-border rounded-lg bg-input-background"
            >
              <option value="all">全部</option>
              <option value="E001">張小明 (E001)</option>
              <option value="E002">李美華 (E002)</option>
              <option value="E003">王大偉 (E003)</option>
              <option value="E004">陳雅婷 (E004)</option>
            </select>
          </div>
        )}
      </div>

      {/* 案件清單 */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 text-left text-sm">案件代號</th>
                <th className="px-4 py-3 text-left text-sm">姓名</th>
                <th className="px-4 py-3 text-left text-sm">身分證</th>
                <th className="px-4 py-3 text-left text-sm">
                  <button
                    onClick={() => handleSort('submitDate')}
                    className="flex items-center gap-1 hover:text-primary"
                  >
                    進件時間
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-sm">
                  <button
                    onClick={() => handleSort('updateDate')}
                    className="flex items-center gap-1 hover:text-primary"
                  >
                    更新時間
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="px-4 py-3 text-center text-sm">案件狀態</th>
                <th className="px-4 py-3 text-center text-sm">案件類型</th>
                <th className="px-4 py-3 text-left text-sm">經辦人員</th>
                <th className="px-4 py-3 text-center text-sm">AI質檢率</th>
                <th className="px-4 py-3 text-center text-sm">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {mockCases.map((caseItem) => {
                const statusInfo = getStatusLabel(caseItem.status);
                return (
                  <tr key={caseItem.caseId} className="hover:bg-accent/50">
                    <td className="px-4 py-3 text-sm">{caseItem.caseId}</td>
                    <td className="px-4 py-3 text-sm">{caseItem.name}</td>
                    <td className="px-4 py-3 text-sm">{caseItem.idNumber}</td>
                    <td className="px-4 py-3 text-sm">{caseItem.submitDate}</td>
                    <td className="px-4 py-3 text-sm">{caseItem.updateDate}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs ${statusInfo.color}`}>
                        {statusInfo.text}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-sm">{getCaseTypeLabel(caseItem.caseType)}</td>
                    <td className="px-4 py-3 text-sm">
                      <div>
                        <p>{caseItem.handler.name}</p>
                        <p className="text-xs text-muted-foreground">{caseItem.handler.id}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center text-sm">
                      <span className={caseItem.aiQualityRate <= 60 ? 'text-red-600 font-bold' : 'text-green-600 font-bold'}>
                        {caseItem.aiQualityRate}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => onViewCase(caseItem.caseId)}
                          className="px-3 py-1 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90"
                        >
                          查看
                        </button>
                        {userRole === 'manager' && onReassign && (
                          <button
                            onClick={() => onReassign(caseItem.caseId)}
                            className="px-3 py-1 bg-secondary text-secondary-foreground rounded-lg text-sm hover:bg-secondary/80 flex items-center gap-1"
                          >
                            <RefreshCw className="w-3 h-3" />
                            轉派
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}