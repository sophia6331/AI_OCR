import { useState } from 'react';
import { Plus, Edit, ChevronDown, ChevronRight } from 'lucide-react';

interface DocumentType {
  id: string;
  name: string;
  code: string;
  versionDate: string;
  isActive: boolean;
  normalizedFields: {
    level1: string;
    level2?: string;
    level3?: string;
  }[];
  validationRules: {
    id: string;
    name: string;
    isEnabled: boolean;
    isRequired: boolean;
  }[];
}

export function DocumentManagement() {
  const [documents, setDocuments] = useState<DocumentType[]>([
    {
      id: '1',
      name: '身分證',
      code: 'ID',
      versionDate: '2023-10-01',
      isActive: true,
      normalizedFields: [
        { level1: '姓名' },
        { level1: '身分證號' },
        { level1: '出生日期' },
        { level1: '地址' },
      ],
      validationRules: [
        { id: 'r1', name: '身分證格式驗證', isEnabled: true, isRequired: true },
        { id: 'r2', name: '身分證清晰度檢查', isEnabled: true, isRequired: true },
        { id: 'r3', name: '身分證有效期限檢查', isEnabled: true, isRequired: false },
      ],
    },
    {
      id: '2',
      name: '財力證明 - 存摺',
      code: 'FIN_BANK',
      versionDate: '2023-10-01',
      isActive: true,
      normalizedFields: [
        { level1: '帳號' },
        { level1: '戶名' },
        { level1: '銀行名稱' },
        { level1: '交易明細', level2: '交易日期' },
        { level1: '交易明細', level2: '摘要/備註' },
        { level1: '交易明細', level2: '收入' },
        { level1: '交易明細', level2: '支出' },
        { level1: '交易明細', level2: '餘額' },
      ],
      validationRules: [
        { id: 'r4', name: '存摺戶名與申請人相符', isEnabled: true, isRequired: true },
        { id: 'r5', name: '存摺近三個月交易記錄', isEnabled: true, isRequired: true },
        { id: 'r6', name: '存摺影像清晰度', isEnabled: true, isRequired: false },
        { id: 'r7', name: '存摺餘額門檻檢查', isEnabled: true, isRequired: false },
      ],
    },
    {
      id: '3',
      name: '財力證明 - 所得清單',
      code: 'FIN_INCOME',
      versionDate: '2023-10-01',
      isActive: true,
      normalizedFields: [
        { level1: '姓名' },
        { level1: '身分證號' },
        { level1: '年度' },
        { level1: '所得總額' },
        { level1: '所得來源', level2: '單位名稱' },
        { level1: '所得來源', level2: '所得金額' },
      ],
      validationRules: [
        { id: 'r8', name: '所得清單姓名與申請人相符', isEnabled: true, isRequired: true },
        { id: 'r9', name: '所得金額符合門檻', isEnabled: true, isRequired: true },
        { id: 'r10', name: '所得年度為近期年度', isEnabled: true, isRequired: true },
        { id: 'r11', name: '所得清單影像清晰度', isEnabled: true, isRequired: false },
      ],
    },
    {
      id: '4',
      name: '在職證明',
      code: 'EMP',
      versionDate: '2023-10-01',
      isActive: true,
      normalizedFields: [
        { level1: '姓名' },
        { level1: '公司名稱' },
        { level1: '職稱' },
        { level1: '到職日期' },
        { level1: '證明日期' },
      ],
      validationRules: [
        { id: 'r12', name: '在職證明姓名與申請人相符', isEnabled: true, isRequired: true },
        { id: 'r13', name: '在職年資符合要求', isEnabled: true, isRequired: false },
        { id: 'r14', name: '證明日期為近期', isEnabled: true, isRequired: true },
      ],
    },
  ]);

  const [expandedDoc, setExpandedDoc] = useState<string | null>(null);

  const toggleExpand = (docId: string) => {
    setExpandedDoc(expandedDoc === docId ? null : docId);
  };

  const toggleRuleEnabled = (docId: string, ruleId: string) => {
    setDocuments(documents.map(doc => {
      if (doc.id === docId) {
        return {
          ...doc,
          validationRules: doc.validationRules.map(rule => {
            if (rule.id === ruleId) {
              return { ...rule, isEnabled: !rule.isEnabled };
            }
            return rule;
          }),
        };
      }
      return doc;
    }));
  };

  const toggleRuleRequired = (docId: string, ruleId: string) => {
    setDocuments(documents.map(doc => {
      if (doc.id === docId) {
        return {
          ...doc,
          validationRules: doc.validationRules.map(rule => {
            if (rule.id === ruleId) {
              return { ...rule, isRequired: !rule.isRequired };
            }
            return rule;
          }),
        };
      }
      return doc;
    }));
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl">文件管理</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
          <Plus className="w-5 h-5" />
          新增文件類型
        </button>
      </div>

      <div className="space-y-4">
        {documents.map((doc) => (
          <div key={doc.id} className="bg-card rounded-lg border border-border overflow-hidden">
            {/* 文件標題 */}
            <div className="p-4 flex items-center justify-between hover:bg-accent/50 cursor-pointer">
              <div className="flex items-center gap-4 flex-1" onClick={() => toggleExpand(doc.id)}>
                <button className="p-1">
                  {expandedDoc === doc.id ? (
                    <ChevronDown className="w-5 h-5" />
                  ) : (
                    <ChevronRight className="w-5 h-5" />
                  )}
                </button>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg">{doc.name}</h3>
                    <span className="text-sm text-muted-foreground">({doc.code})</span>
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      doc.isActive
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {doc.isActive ? '有效' : '無效'}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">版本日期：{doc.versionDate}</p>
                </div>
              </div>
              <button className="p-2 hover:bg-accent rounded-lg">
                <Edit className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* 展開內容 */}
            {expandedDoc === doc.id && (
              <div className="border-t border-border p-6 bg-muted/30">
                {/* 正規化欄位 */}
                <div className="mb-6">
                  <h4 className="mb-3">正規化欄位</h4>
                  <div className="bg-card rounded-lg border border-border overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-muted">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm">第一層</th>
                          <th className="px-4 py-3 text-left text-sm">第二層</th>
                          <th className="px-4 py-3 text-left text-sm">第三層</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {doc.normalizedFields.map((field, index) => (
                          <tr key={index} className="hover:bg-accent/50">
                            <td className="px-4 py-3 text-sm">{field.level1}</td>
                            <td className="px-4 py-3 text-sm">{field.level2 || '-'}</td>
                            <td className="px-4 py-3 text-sm">{field.level3 || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 文件驗證規則 */}
                <div>
                  <h4 className="mb-3">文件驗證規則</h4>
                  <div className="bg-card rounded-lg border border-border overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-muted">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm">規則名稱</th>
                          <th className="px-4 py-3 text-center text-sm">開啟驗證</th>
                          <th className="px-4 py-3 text-center text-sm">必要欄位</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {doc.validationRules.map((rule) => (
                          <tr key={rule.id} className="hover:bg-accent/50">
                            <td className="px-4 py-3 text-sm">{rule.name}</td>
                            <td className="px-4 py-3 text-center">
                              <label className="inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={rule.isEnabled}
                                  onChange={() => toggleRuleEnabled(doc.id, rule.id)}
                                  className="sr-only peer"
                                />
                                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                              </label>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <label className="inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={rule.isRequired}
                                  onChange={() => toggleRuleRequired(doc.id, rule.id)}
                                  className="sr-only peer"
                                />
                                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                              </label>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>註1：</strong>當開啟驗證時，AI文件質檢會驗證該規則，反之則不驗證，會顯示驗證結果，但不會強制要求補件。
                    </p>
                    <p className="text-sm text-blue-800 mt-2">
                      <strong>註2：</strong>當開啟必要欄位時，AI文件質檢只要驗證規則不過就代表不合格，後續也可以自動要求補件。
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}