import { useState } from 'react';
import { Plus, ArrowUp, ArrowDown, X } from 'lucide-react';

interface Handler {
  id: string;
  employeeId: string;
  name: string;
  status: 'active' | 'inactive';
  order: number;
}

export function HandlerManagement() {
  const [handlers, setHandlers] = useState<Handler[]>([
    { id: '1', employeeId: 'E001', name: '張小明', status: 'active', order: 1 },
    { id: '2', employeeId: 'E002', name: '李美華', status: 'active', order: 2 },
    { id: '3', employeeId: 'E003', name: '王大偉', status: 'active', order: 3 },
    { id: '4', employeeId: 'E004', name: '陳雅婷', status: 'active', order: 4 },
    { id: '5', employeeId: 'E005', name: '林志強', status: 'inactive', order: 5 },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newEmployeeId, setNewEmployeeId] = useState('');
  const [newEmployeeName, setNewEmployeeName] = useState('');

  const activeHandlers = handlers.filter(h => h.status === 'active');
  const inactiveHandlers = handlers.filter(h => h.status === 'inactive');

  const toggleStatus = (id: string) => {
    const activeCount = handlers.filter(h => h.status === 'active').length;
    const handler = handlers.find(h => h.id === id);

    // 如果是最後一個啟用的經辦，禁止停用
    if (handler?.status === 'active' && activeCount === 1) {
      alert('至少需要一位啟用的經辦人員，無法停用！');
      return;
    }

    setHandlers(handlers.map(h => {
      if (h.id === id) {
        return { ...h, status: h.status === 'active' ? 'inactive' : 'active' };
      }
      return h;
    }));
  };

  const moveUp = (id: string) => {
    const index = handlers.findIndex(h => h.id === id);
    if (index > 0) {
      const newHandlers = [...handlers];
      [newHandlers[index - 1], newHandlers[index]] = [newHandlers[index], newHandlers[index - 1]];
      // 更新 order
      newHandlers.forEach((h, i) => {
        h.order = i + 1;
      });
      setHandlers(newHandlers);
    }
  };

  const moveDown = (id: string) => {
    const index = handlers.findIndex(h => h.id === id);
    if (index < handlers.length - 1) {
      const newHandlers = [...handlers];
      [newHandlers[index], newHandlers[index + 1]] = [newHandlers[index + 1], newHandlers[index]];
      // 更新 order
      newHandlers.forEach((h, i) => {
        h.order = i + 1;
      });
      setHandlers(newHandlers);
    }
  };

  const handleAddHandler = () => {
    if (!newEmployeeId.trim()) {
      alert('請輸入員編');
      return;
    }

    // 檢查是否重複
    if (handlers.some(h => h.employeeId === newEmployeeId)) {
      alert('此員編已存在，無法重複新增');
      return;
    }

    const newHandler: Handler = {
      id: Date.now().toString(),
      employeeId: newEmployeeId,
      name: newEmployeeName || '未設定',
      status: 'active',
      order: handlers.length + 1,
    };

    setHandlers([...handlers, newHandler]);
    setNewEmployeeId('');
    setNewEmployeeName('');
    setShowAddModal(false);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl mb-2">經辦管理</h2>
        <p className="text-muted-foreground">
          管理自動派案的經辦名單，系統會依照順序進行輪流派案（Round-robin）
        </p>
      </div>

      {/* 統計資訊 */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-card rounded-lg border border-border p-4">
          <p className="text-sm text-muted-foreground mb-1">總經辦人數</p>
          <p className="text-2xl">{handlers.length}</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <p className="text-sm text-muted-foreground mb-1">啟用中</p>
          <p className="text-2xl text-green-600">{activeHandlers.length}</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <p className="text-sm text-muted-foreground mb-1">已停用</p>
          <p className="text-2xl text-gray-600">{inactiveHandlers.length}</p>
        </div>
      </div>

      {/* 新增按鈕 */}
      <div className="mb-4">
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
        >
          <Plus className="w-5 h-5" />
          新增經辦
        </button>
      </div>

      {/* 經辦清單 */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="px-4 py-3 text-left text-sm w-20">順序</th>
              <th className="px-4 py-3 text-left text-sm">員編</th>
              <th className="px-4 py-3 text-left text-sm">姓名</th>
              <th className="px-4 py-3 text-center text-sm">狀態</th>
              <th className="px-4 py-3 text-center text-sm">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {handlers.map((handler, index) => (
              <tr key={handler.id} className={`hover:bg-accent/50 ${handler.status === 'inactive' ? 'opacity-50' : ''}`}>
                <td className="px-4 py-3 text-sm text-center">{handler.order}</td>
                <td className="px-4 py-3 text-sm">{handler.employeeId}</td>
                <td className="px-4 py-3 text-sm">{handler.name}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`px-3 py-1 rounded-full text-xs ${
                    handler.status === 'active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {handler.status === 'active' ? '啟用' : '停用'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => moveUp(handler.id)}
                      disabled={index === 0}
                      className="p-1 hover:bg-accent rounded disabled:opacity-30 disabled:cursor-not-allowed"
                      title="向上移動"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => moveDown(handler.id)}
                      disabled={index === handlers.length - 1}
                      className="p-1 hover:bg-accent rounded disabled:opacity-30 disabled:cursor-not-allowed"
                      title="向下移動"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => toggleStatus(handler.id)}
                      className={`px-3 py-1 rounded text-sm ${
                        handler.status === 'active'
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {handler.status === 'active' ? '停用' : '啟用'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 說明 */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="mb-2">系統說明</h4>
        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li>系統會依照順序進行輪流派案（Round-robin）</li>
          <li>只有「啟用」狀態的經辦會被自動派案</li>
          <li>當經辦離職或休假時，可將其停用，避免被派案</li>
          <li>至少需要保持一位經辦為啟用狀態</li>
          <li>可調整經辦順序來改變派案優先順序</li>
        </ul>
      </div>

      {/* 新增經辦彈窗 */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3>新增經辦</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 hover:bg-accent rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-2">
                  員編 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newEmployeeId}
                  onChange={(e) => setNewEmployeeId(e.target.value)}
                  placeholder="例如：E006"
                  className="w-full px-4 py-2 border border-border rounded-lg bg-input-background"
                />
              </div>

              <div>
                <label className="block text-sm mb-2">姓名（選填）</label>
                <input
                  type="text"
                  value={newEmployeeName}
                  onChange={(e) => setNewEmployeeName(e.target.value)}
                  placeholder="例如：王小明"
                  className="w-full px-4 py-2 border border-border rounded-lg bg-input-background"
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border border-border rounded-lg hover:bg-accent"
              >
                取消
              </button>
              <button
                onClick={handleAddHandler}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
              >
                確認新增
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
