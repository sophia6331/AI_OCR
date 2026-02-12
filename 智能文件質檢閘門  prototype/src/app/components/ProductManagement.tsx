import { useState } from 'react';
import { Plus, Edit, Trash2, ChevronDown, ChevronRight, CheckCircle } from 'lucide-react';

interface Product {
  id: string;
  type: string;
  name: string;
  code: string;
  isActive: boolean;
  requiredDocs: string[];
  optionalDocs: string[];
  crossDocRules: {
    id: string;
    name: string;
    isEnabled: boolean;
    isRequired: boolean;
  }[];
}

export function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      type: '信用卡',
      name: '現金回饋卡',
      code: 'CC001',
      isActive: true,
      requiredDocs: ['身分證', '財力證明'],
      optionalDocs: ['在職證明'],
      crossDocRules: [
        { id: 'r1', name: '身分證與財力證明姓名一致性驗證', isEnabled: true, isRequired: true },
        { id: 'r2', name: '申請人年齡符合規範', isEnabled: true, isRequired: true },
        { id: 'r3', name: '收入門檻驗證', isEnabled: true, isRequired: false },
      ],
    },
    {
      id: '2',
      type: '信用貸款',
      name: '個人信貸',
      code: 'PL001',
      isActive: true,
      requiredDocs: ['身分證', '財力證明', '在職證明'],
      optionalDocs: ['不動產證明'],
      crossDocRules: [
        { id: 'r4', name: '身分證與財力證明姓名一致性驗證', isEnabled: true, isRequired: true },
        { id: 'r5', name: '申請人年齡符合規範', isEnabled: true, isRequired: true },
        { id: 'r6', name: '收入債務比驗證', isEnabled: true, isRequired: true },
        { id: 'r7', name: '在職年資驗證', isEnabled: true, isRequired: false },
      ],
    },
  ]);

  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);
  const [editingRule, setEditingRule] = useState<{ productId: string; ruleId: string } | null>(null);

  const toggleExpand = (productId: string) => {
    setExpandedProduct(expandedProduct === productId ? null : productId);
  };

  const toggleRuleEnabled = (productId: string, ruleId: string) => {
    setProducts(products.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          crossDocRules: product.crossDocRules.map(rule => {
            if (rule.id === ruleId) {
              return { ...rule, isEnabled: !rule.isEnabled };
            }
            return rule;
          }),
        };
      }
      return product;
    }));
  };

  const toggleRuleRequired = (productId: string, ruleId: string) => {
    setProducts(products.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          crossDocRules: product.crossDocRules.map(rule => {
            if (rule.id === ruleId) {
              return { ...rule, isRequired: !rule.isRequired };
            }
            return rule;
          }),
        };
      }
      return product;
    }));
  };

  const toggleProductActive = (productId: string) => {
    setProducts(products.map(product => {
      if (product.id === productId) {
        return { ...product, isActive: !product.isActive };
      }
      return product;
    }));
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl">產品管理</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
          <Plus className="w-5 h-5" />
          新增產品
        </button>
      </div>

      <div className="space-y-4">
        {products.map((product) => (
          <div key={product.id} className="bg-card rounded-lg border border-border overflow-hidden">
            {/* 產品標題 */}
            <div className="p-4 flex items-center justify-between hover:bg-accent/50 cursor-pointer">
              <div className="flex items-center gap-4 flex-1" onClick={() => toggleExpand(product.id)}>
                <button className="p-1">
                  {expandedProduct === product.id ? (
                    <ChevronDown className="w-5 h-5" />
                  ) : (
                    <ChevronRight className="w-5 h-5" />
                  )}
                </button>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg">{product.name}</h3>
                    <span className="text-sm text-muted-foreground">({product.code})</span>
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      product.isActive
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {product.isActive ? '啟用中' : '已停用'}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">產品類型：{product.type}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleProductActive(product.id);
                  }}
                  className={`px-4 py-2 rounded-lg border ${
                    product.isActive
                      ? 'border-red-300 text-red-700 hover:bg-red-50'
                      : 'border-green-300 text-green-700 hover:bg-green-50'
                  }`}
                >
                  {product.isActive ? '停用' : '啟用'}
                </button>
                <button className="p-2 hover:bg-accent rounded-lg">
                  <Edit className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* 展開內容 */}
            {expandedProduct === product.id && (
              <div className="border-t border-border p-6 bg-muted/30">
                {/* 對應文件 */}
                <div className="mb-6">
                  <h4 className="mb-3">對應文件</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">必要文件</p>
                      <div className="flex flex-wrap gap-2">
                        {product.requiredDocs.map((doc, index) => (
                          <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                            {doc}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">非必要文件</p>
                      <div className="flex flex-wrap gap-2">
                        {product.optionalDocs.map((doc, index) => (
                          <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                            {doc}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 跨文件驗證規則 */}
                <div>
                  <h4 className="mb-3">跨文件驗證規則</h4>
                  
                  {/* 統一控制開關 */}
                  <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">全部驗證規則</span>
                      <div className="flex items-center gap-4">
                        <label className="inline-flex items-center gap-2">
                          <span className="text-sm">開啟驗證</span>
                          <button
                            onClick={() => {
                              const allEnabled = product.crossDocRules.every(r => r.isEnabled);
                              setProducts(products.map(p => {
                                if (p.id === product.id) {
                                  return {
                                    ...p,
                                    crossDocRules: p.crossDocRules.map(rule => ({
                                      ...rule,
                                      isEnabled: !allEnabled
                                    }))
                                  };
                                }
                                return p;
                              }));
                            }}
                            className="relative w-11 h-6 bg-gray-200 rounded-full transition-colors hover:bg-gray-300"
                          >
                            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                              product.crossDocRules.every(r => r.isEnabled) ? 'translate-x-5 bg-primary' : ''
                            }`} />
                          </button>
                        </label>
                        
                        <label className="inline-flex items-center gap-2">
                          <span className="text-sm">設為必要</span>
                          <button
                            onClick={() => {
                              const allRequired = product.crossDocRules.every(r => r.isRequired);
                              setProducts(products.map(p => {
                                if (p.id === product.id) {
                                  return {
                                    ...p,
                                    crossDocRules: p.crossDocRules.map(rule => ({
                                      ...rule,
                                      isRequired: !allRequired
                                    }))
                                  };
                                }
                                return p;
                              }));
                            }}
                            className="relative w-11 h-6 bg-gray-200 rounded-full transition-colors hover:bg-gray-300"
                          >
                            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                              product.crossDocRules.every(r => r.isRequired) ? 'translate-x-5 bg-primary' : ''
                            }`} />
                          </button>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* 規則清單 */}
                  <div className="bg-card rounded-lg border border-border overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-muted">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm">規則名稱</th>
                          <th className="px-4 py-3 text-center text-sm">狀態</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {product.crossDocRules.map((rule) => (
                          <tr key={rule.id} className="hover:bg-accent/50">
                            <td className="px-4 py-3 text-sm">
                              <div>
                                <p>{rule.name}</p>
                                <div className="flex gap-3 mt-1">
                                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                                    rule.isEnabled 
                                      ? 'bg-green-100 text-green-700' 
                                      : 'bg-gray-100 text-gray-700'
                                  }`}>
                                    {rule.isEnabled ? '已開啟' : '未開啟'}
                                  </span>
                                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                                    rule.isRequired 
                                      ? 'bg-blue-100 text-blue-700' 
                                      : 'bg-gray-100 text-gray-700'
                                  }`}>
                                    {rule.isRequired ? '必要欄位' : '非必要'}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <CheckCircle className={`w-5 h-5 mx-auto ${
                                rule.isEnabled ? 'text-green-600' : 'text-gray-400'
                              }`} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>註1：</strong>當開啟驗證時，AI文件質檢會驗證該規則，反之則不驗證，會顯示驗證結果，不會要求補件。
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