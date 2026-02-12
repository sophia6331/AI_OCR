import { useState } from 'react';
import { Calendar, Clock, CheckCircle, XCircle, FileWarning, AlertCircle } from 'lucide-react';

interface DashboardProps {
  userRole: 'manager' | 'handler';
}

interface StatsData {
  processedCount: number;
  avgProcessTime: string;
  overdueCount: number;
  overduePercentage: number;
  approvedCount: number;
  approvedPercentage: number;
  rejectedCount: number;
  rejectedPercentage: number;
  supplementCount: number;
  supplementPercentage: number;
  pendingCount: number;
}

interface HandlerStats extends StatsData {
  handlerName: string;
  handlerId: string;
}

export function Dashboard({ userRole }: DashboardProps) {
  const [dateRange, setDateRange] = useState(userRole === 'manager' ? '半年' : '一週');

  // 模擬數據
  const overallStats: StatsData = {
    processedCount: 1248,
    avgProcessTime: '2.5小時',
    overdueCount: 23,
    overduePercentage: 1.8,
    approvedCount: 856,
    approvedPercentage: 68.6,
    rejectedCount: 124,
    rejectedPercentage: 9.9,
    supplementCount: 268,
    supplementPercentage: 21.5,
    pendingCount: 45,
  };

  const handlerStatsList: HandlerStats[] = [
    {
      handlerName: '張小明',
      handlerId: 'E001',
      processedCount: 312,
      avgProcessTime: '2.3小時',
      overdueCount: 5,
      overduePercentage: 1.6,
      approvedCount: 215,
      approvedPercentage: 68.9,
      rejectedCount: 28,
      rejectedPercentage: 9.0,
      supplementCount: 69,
      supplementPercentage: 22.1,
      pendingCount: 12,
    },
    {
      handlerName: '李美華',
      handlerId: 'E002',
      processedCount: 298,
      avgProcessTime: '2.4小時',
      overdueCount: 6,
      overduePercentage: 2.0,
      approvedCount: 204,
      approvedPercentage: 68.5,
      rejectedCount: 31,
      rejectedPercentage: 10.4,
      supplementCount: 63,
      supplementPercentage: 21.1,
      pendingCount: 10,
    },
    {
      handlerName: '王大偉',
      handlerId: 'E003',
      processedCount: 325,
      avgProcessTime: '2.6小時',
      overdueCount: 7,
      overduePercentage: 2.2,
      approvedCount: 221,
      approvedPercentage: 68.0,
      rejectedCount: 35,
      rejectedPercentage: 10.8,
      supplementCount: 69,
      supplementPercentage: 21.2,
      pendingCount: 11,
    },
    {
      handlerName: '陳雅婷',
      handlerId: 'E004',
      processedCount: 313,
      avgProcessTime: '2.5小時',
      overdueCount: 5,
      overduePercentage: 1.6,
      approvedCount: 216,
      approvedPercentage: 69.0,
      rejectedCount: 30,
      rejectedPercentage: 9.6,
      supplementCount: 67,
      supplementPercentage: 21.4,
      pendingCount: 12,
    },
  ];

  const personalStats = handlerStatsList[0]; // 模擬當前登入經辦的數據

  return (
    <div className="p-6">
      {/* 過濾功能 */}
      <div className="mb-6 bg-card rounded-lg border border-border p-4">
        <div className="flex items-center gap-4">
          <label className="text-sm text-muted-foreground">時間區間：</label>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-border rounded-lg bg-input-background text-foreground"
          >
            <option value="一週">一週</option>
            <option value="一個月">一個月</option>
            <option value="三個月">三個月</option>
            <option value="半年">半年</option>
            <option value="一年">一年</option>
          </select>
        </div>
      </div>

      {/* 總覽統計卡片 */}
      <div className="mb-6">
        <h3 className="mb-4 text-lg">{userRole === 'manager' ? '整體總覽' : '個人總覽'}</h3>
        <div className="grid grid-cols-4 gap-4">
          <StatCard
            icon={<FileWarning className="w-6 h-6" />}
            label="處理件數"
            value={userRole === 'manager' ? overallStats.processedCount : personalStats.processedCount}
            bgColor="bg-blue-50"
            iconColor="text-blue-600"
          />
          <StatCard
            icon={<Clock className="w-6 h-6" />}
            label="平均處理時間"
            value={userRole === 'manager' ? overallStats.avgProcessTime : personalStats.avgProcessTime}
            bgColor="bg-purple-50"
            iconColor="text-purple-600"
          />
          <StatCard
            icon={<AlertCircle className="w-6 h-6" />}
            label="超過24小時案件"
            value={userRole === 'manager' ? overallStats.overdueCount : personalStats.overdueCount}
            subtitle={`${userRole === 'manager' ? overallStats.overduePercentage : personalStats.overduePercentage}%`}
            bgColor="bg-orange-50"
            iconColor="text-orange-600"
          />
          <StatCard
            icon={<Calendar className="w-6 h-6" />}
            label="待處理件數"
            value={userRole === 'manager' ? overallStats.pendingCount : personalStats.pendingCount}
            bgColor="bg-gray-50"
            iconColor="text-gray-600"
          />
        </div>

        <div className="grid grid-cols-3 gap-4 mt-4">
          <StatCard
            icon={<CheckCircle className="w-6 h-6" />}
            label="通過件數"
            value={userRole === 'manager' ? overallStats.approvedCount : personalStats.approvedCount}
            subtitle={`${userRole === 'manager' ? overallStats.approvedPercentage : personalStats.approvedPercentage}%`}
            bgColor="bg-green-50"
            iconColor="text-green-600"
          />
          <StatCard
            icon={<XCircle className="w-6 h-6" />}
            label="退件數"
            value={userRole === 'manager' ? overallStats.rejectedCount : personalStats.rejectedCount}
            subtitle={`${userRole === 'manager' ? overallStats.rejectedPercentage : personalStats.rejectedPercentage}%`}
            bgColor="bg-red-50"
            iconColor="text-red-600"
          />
          <StatCard
            icon={<FileWarning className="w-6 h-6" />}
            label="補件數"
            value={userRole === 'manager' ? overallStats.supplementCount : personalStats.supplementCount}
            subtitle={`${userRole === 'manager' ? overallStats.supplementPercentage : personalStats.supplementPercentage}%`}
            bgColor="bg-yellow-50"
            iconColor="text-yellow-600"
          />
        </div>
      </div>

      {/* 經辦清單（僅主管可見） */}
      {userRole === 'manager' && (
        <div>
          <h3 className="mb-4 text-lg">經辦人員統計</h3>
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm">經辦人員</th>
                    <th className="px-4 py-3 text-center text-sm">處理件數</th>
                    <th className="px-4 py-3 text-center text-sm">平均處理時間</th>
                    <th className="px-4 py-3 text-center text-sm">超過24小時</th>
                    <th className="px-4 py-3 text-center text-sm">通過</th>
                    <th className="px-4 py-3 text-center text-sm">退件</th>
                    <th className="px-4 py-3 text-center text-sm">補件</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {handlerStatsList.map((handler) => (
                    <tr key={handler.handlerId} className="hover:bg-accent/50">
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-sm">{handler.handlerName}</p>
                          <p className="text-xs text-muted-foreground">{handler.handlerId}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center text-sm">{handler.processedCount}</td>
                      <td className="px-4 py-3 text-center text-sm">{handler.avgProcessTime}</td>
                      <td className="px-4 py-3 text-center">
                        <div>
                          <p className="text-sm">{handler.overdueCount}</p>
                          <p className="text-xs text-muted-foreground">{handler.overduePercentage}%</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div>
                          <p className="text-sm text-green-600">{handler.approvedCount}</p>
                          <p className="text-xs text-muted-foreground">{handler.approvedPercentage}%</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div>
                          <p className="text-sm text-red-600">{handler.rejectedCount}</p>
                          <p className="text-xs text-muted-foreground">{handler.rejectedPercentage}%</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div>
                          <p className="text-sm text-yellow-600">{handler.supplementCount}</p>
                          <p className="text-xs text-muted-foreground">{handler.supplementPercentage}%</p>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subtitle?: string;
  bgColor: string;
  iconColor: string;
}

function StatCard({ icon, label, value, subtitle, bgColor, iconColor }: StatCardProps) {
  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-2">{label}</p>
          <p className="text-2xl mb-1">{value}</p>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        <div className={`${bgColor} ${iconColor} p-3 rounded-lg`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
