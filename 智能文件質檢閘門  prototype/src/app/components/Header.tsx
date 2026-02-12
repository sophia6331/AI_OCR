import { User } from 'lucide-react';

interface HeaderProps {
  title: string;
  userName: string;
  userRole: 'manager' | 'handler' | 'rule_admin' | 'permission_admin';
}

export function Header({ title, userName, userRole }: HeaderProps) {
  const roleLabel = {
    manager: '主管',
    handler: '經辦',
    rule_admin: '規則管理者',
    permission_admin: '權限管理員'
  }[userRole];

  return (
    <div className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
      <h2 className="text-2xl text-card-foreground">{title}</h2>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm text-card-foreground">{userName}</p>
          <p className="text-xs text-muted-foreground">{roleLabel}</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
          <User className="w-5 h-5 text-primary-foreground" />
        </div>
      </div>
    </div>
  );
}
