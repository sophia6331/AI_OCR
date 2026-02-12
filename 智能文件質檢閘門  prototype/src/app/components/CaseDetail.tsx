import { useState } from 'react';
import { ArrowLeft, Clock, CheckCircle, XCircle, AlertTriangle, FileText, Image as ImageIcon, Edit } from 'lucide-react';

interface CaseDetailProps {
  caseId: string;
  onBack: () => void;
  userRole: 'manager' | 'handler';
}

interface DocumentData {
  type: string;
  images: {
    id: string;
    url: string;
    page: number;
  }[];
  ocrFields: {
    fieldName: string;
    ocrValue: string;
    manualValue?: string;
  }[];
  validationRules: {
    ruleName: string;
    isValid: boolean;
    confidence: number;
    isRequired: boolean;
  }[];
  needsSupplement: boolean;
  supplementNote: string;
  invalidImages: string[];
}

export function CaseDetail({ caseId, onBack, userRole }: CaseDetailProps) {
  const [activeTab, setActiveTab] = useState<'info' | 'documents' | 'history'>('info');
  const [showSupplementModal, setShowSupplementModal] = useState(false);
  const [showProcessModal, setShowProcessModal] = useState(false);
  const [showPDFPreview, setShowPDFPreview] = useState(false);
  const [processAction, setProcessAction] = useState<'submit' | 'supplement' | 'reject'>('submit');
  const [processNote, setProcessNote] = useState('');
  const [editingField, setEditingField] = useState<string | null>(null);
  const [manualValues, setManualValues] = useState<Record<string, string>>({});
  const [selectedDocIndex, setSelectedDocIndex] = useState(0);
  const [selectedImageId, setSelectedImageId] = useState<string>('img1');

  // 模擬案件基本資料
  const caseInfo = {
    caseId: 'CC2024010001',
    product: '信用卡',
    caseType: '新件',
    status: '待審核',
    personalInfo: {
      name: '王小明',
      idNumber: 'A123456789',
      birthday: '75/03/15',
      applyDate: '2024-01-15',
      income: '月薪 50,000',
      maritalStatus: '已婚',
      numberOfChildren: 2,
      spouseName: '李美華',
      spouseIdNumber: 'B234567890',
      education: '大學',
      fundingSource: '薪資',
      annualFamilyIncome: '1,200,000',
      email: 'wangxiaoming@example.com',
    },
    aiQualityRate: 95.5,
    manualQualityRate: null,
    processTime: {
      startTime: '2024-01-15 10:30',
      status: '進行中',
      duration: '3小時45分鐘',
    },
  };

  // 模擬文件數據
  const documentsData: DocumentData[] = [
    {
      type: '身分證',
      images: [
        { id: 'img1', url: '/placeholder-id.jpg', page: 1 },
      ],
      ocrFields: [
        { fieldName: '姓名', ocrValue: '王小明' },
        { fieldName: '身分證號', ocrValue: 'A123456789' },
        { fieldName: '出生日期', ocrValue: '75/03/15' },
      ],
      validationRules: [
        { ruleName: '身分證格式驗證', isValid: true, confidence: 98.5, isRequired: true },
        { ruleName: '身分證清晰度', isValid: true, confidence: 95.2, isRequired: true },
      ],
      needsSupplement: false,
      supplementNote: '',
      invalidImages: [],
    },
    {
      type: '財力證明 - 存摺',
      images: [
        { id: 'img2', url: '/placeholder-bank1.jpg', page: 1 },
        { id: 'img3', url: '/placeholder-bank2.jpg', page: 2 },
        { id: 'img4', url: '/placeholder-bank3.jpg', page: 3 },
      ],
      ocrFields: [
        { fieldName: '帳號', ocrValue: '123-456-7890123' },
        { fieldName: '戶名', ocrValue: '王小明' },
        { fieldName: '銀行名稱', ocrValue: '台灣銀行' },
        { fieldName: '交易日期', ocrValue: '2024/01/10' },
        { fieldName: '收入', ocrValue: '50,000' },
        { fieldName: '餘額', ocrValue: '125,000' },
      ],
      validationRules: [
        { ruleName: '存摺戶名與申請人相符', isValid: true, confidence: 99.1, isRequired: true },
        { ruleName: '存摺近三個月交易記錄', isValid: true, confidence: 92.3, isRequired: true },
        { ruleName: '存摺影像清晰度', isValid: false, confidence: 65.5, isRequired: false },
      ],
      needsSupplement: false,
      supplementNote: '',
      invalidImages: [],
    },
    {
      type: '財力證明 - 所得清單',
      images: [
        { id: 'img5', url: '/placeholder-income.jpg', page: 1 },
      ],
      ocrFields: [
        { fieldName: '姓名', ocrValue: '王小明' },
        { fieldName: '年度所得總額', ocrValue: '600,000' },
      ],
      validationRules: [
        { ruleName: '所得清單姓名與申請人相符', isValid: true, confidence: 99.5, isRequired: true },
        { ruleName: '所得金額符合門檻', isValid: true, confidence: 100, isRequired: true },
      ],
      needsSupplement: false,
      supplementNote: '',
      invalidImages: [],
    },
  ];

  const [documents, setDocuments] = useState(documentsData);

  // 模擬審核歷程
  const historyData = [
    {
      time: '2024-01-15 10:30',
      person: '系統',
      content: '案件進件',
      result: '待審核',
    },
    {
      time: '2024-01-15 10:31',
      person: '系統',
      content: '自動派案給經辦：張小明 (E001)',
      result: '待審核',
    },
  ];

  const aiPassedRules = documents.reduce((acc, doc) => {
    return acc + doc.validationRules.filter(r => r.isValid).length;
  }, 0);

  const aiTotalRules = documents.reduce((acc, doc) => {
    return acc + doc.validationRules.length;
  }, 0);

  const toggleInvalidImage = (docIndex: number, imageId: string) => {
    const newDocs = [...documents];
    const doc = newDocs[docIndex];
    if (doc.invalidImages.includes(imageId)) {
      doc.invalidImages = doc.invalidImages.filter(id => id !== imageId);
    } else {
      doc.invalidImages.push(imageId);
    }
    setDocuments(newDocs);
  };

  const toggleNeedsSupplement = (docIndex: number) => {
    const newDocs = [...documents];
    newDocs[docIndex].needsSupplement = !newDocs[docIndex].needsSupplement;
    if (!newDocs[docIndex].needsSupplement) {
      newDocs[docIndex].supplementNote = '';
    }
    setDocuments(newDocs);
  };

  const updateSupplementNote = (docIndex: number, note: string) => {
    const newDocs = [...documents];
    newDocs[docIndex].supplementNote = note;
    setDocuments(newDocs);
  };

  const handleProcess = () => {
    console.log('處理案件:', { action: processAction, note: processNote });
    setShowProcessModal(false);
    onBack();
  };

  const updateManualValue = (docIndex: number, fieldName: string, value: string) => {
    const key = `${docIndex}-${fieldName}`;
    setManualValues({ ...manualValues, [key]: value });
  };

  return (
    <div className="p-6">
      {/* 返回按鈕 */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-primary hover:text-primary/80 mb-4"
      >
        <ArrowLeft className="w-5 h-5" />
        返回案件清單
      </button>

      {/* 標題與處理狀態 */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h2 className="text-2xl mb-2">案件明細 - {caseId}</h2>
          <div className="flex gap-2">
            <span className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-700">
              {caseInfo.status}
            </span>
            <span className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-700">
              {caseInfo.caseType}
            </span>
          </div>
        </div>
        
        {/* 處理狀態與時間 */}
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">週期起算時間</p>
                <p className="text-sm">{caseInfo.processTime.startTime}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">處理狀態</p>
                <p className="text-sm text-primary font-semibold">{caseInfo.processTime.status} - {caseInfo.processTime.duration}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 標籤頁 */}
      <div className="mb-6 border-b border-border">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab('info')}
            className={`pb-3 px-2 border-b-2 transition-colors ${
              activeTab === 'info'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            案件資訊
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`pb-3 px-2 border-b-2 transition-colors ${
              activeTab === 'documents'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            文件審核
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`pb-3 px-2 border-b-2 transition-colors ${
              activeTab === 'history'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            審核歷程
          </button>
        </div>
      </div>

      {/* 案件資訊 */}
      {activeTab === 'info' && (
        <div className="space-y-6">
          {/* 基本資訊 */}
          <div className="bg-card rounded-lg border border-border p-6">
            <h3 className="mb-4">基本資訊</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">案件產品</p>
                <p>{caseInfo.product}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">案件類型</p>
                <p>{caseInfo.caseType}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">姓名</p>
                <p>{caseInfo.personalInfo.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">身分證號</p>
                <p>{caseInfo.personalInfo.idNumber}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">民國生日</p>
                <p>{caseInfo.personalInfo.birthday}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">申請日期</p>
                <p>{caseInfo.personalInfo.applyDate}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">收入狀況</p>
                <p>{caseInfo.personalInfo.income}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">婚姻狀態</p>
                <p>{caseInfo.personalInfo.maritalStatus}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">子女數量</p>
                <p>{caseInfo.personalInfo.numberOfChildren}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">配偶姓名</p>
                <p>{caseInfo.personalInfo.spouseName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">配偶身分證號</p>
                <p>{caseInfo.personalInfo.spouseIdNumber}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">學歷</p>
                <p>{caseInfo.personalInfo.education}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">資金來源</p>
                <p>{caseInfo.personalInfo.fundingSource}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">家庭年收入</p>
                <p>{caseInfo.personalInfo.annualFamilyIncome}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">電子郵件</p>
                <p>{caseInfo.personalInfo.email}</p>
              </div>
            </div>
          </div>

          {/* AI質檢結果 */}
          <div className="bg-card rounded-lg border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3>AI 質檢總結果</h3>
              <div className="text-2xl">
                <span className={aiPassedRules === aiTotalRules ? 'text-green-600' : 'text-orange-600'}>
                  {aiPassedRules}/{aiTotalRules}
                </span>
                <span className="text-sm text-muted-foreground ml-2">通過</span>
              </div>
            </div>
            <div className="space-y-2">
              {documents.map((doc, index) => {
                const passed = doc.validationRules.filter(r => r.isValid).length;
                const total = doc.validationRules.length;
                const requiredPassed = doc.validationRules.filter(r => r.isRequired && r.isValid).length;
                const requiredTotal = doc.validationRules.filter(r => r.isRequired).length;
                
                return (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      {requiredPassed === requiredTotal ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                      <span>{doc.type}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {passed}/{total} 規則通過
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 文件審核 - 全新佈局 */}
      {activeTab === 'documents' && (
        <div>
          {/* 文件縮圖列表 */}
          <div className="mb-6">
            <h4 className="text-sm mb-3">文件清單</h4>
            <div className="grid grid-cols-6 gap-3">
              {documents.map((doc, docIndex) => (
                <button
                  key={docIndex}
                  onClick={() => {
                    setSelectedDocIndex(docIndex);
                    setSelectedImageId(doc.images[0]?.id || '');
                  }}
                  className={`p-3 border-2 rounded-lg transition-all ${
                    selectedDocIndex === docIndex
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <FileText className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-xs text-center line-clamp-2">{doc.type}</p>
                </button>
              ))}
            </div>
          </div>

          {/* 主要文件檢視區 - 左右分欄 */}
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3>{documents[selectedDocIndex]?.type}</h3>
              <button
                onClick={() => toggleNeedsSupplement(selectedDocIndex)}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  documents[selectedDocIndex]?.needsSupplement
                    ? 'bg-yellow-100 text-yellow-700 border-yellow-300'
                    : 'bg-card border-border hover:bg-accent'
                }`}
              >
                {documents[selectedDocIndex]?.needsSupplement ? '已標記待補件' : '標記待補件'}
              </button>
            </div>

            {/* 補件說明 */}
            {documents[selectedDocIndex]?.needsSupplement && (
              <div className="p-4 bg-yellow-50 border-b border-yellow-200">
                <label className="block text-sm mb-2">補件說明</label>
                <textarea
                  value={documents[selectedDocIndex]?.supplementNote || ''}
                  onChange={(e) => updateSupplementNote(selectedDocIndex, e.target.value)}
                  placeholder="請輸入補件說明..."
                  className="w-full px-4 py-2 border border-border rounded-lg bg-white"
                  rows={2}
                />
              </div>
            )}

            <div className="grid grid-cols-2">
              {/* 左側 - 圖片顯示 */}
              <div className="p-6 border-r border-border">
                {/* 放大顯示的圖片 */}
                <div className="mb-4">
                  <div className={`border-2 rounded-lg overflow-hidden ${
                    documents[selectedDocIndex]?.invalidImages.includes(selectedImageId)
                      ? 'border-red-400'
                      : 'border-border'
                  }`}>
                    <div className="aspect-[3/4] bg-gray-100 flex items-center justify-center relative">
                      <ImageIcon className="w-24 h-24 text-gray-400" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg text-gray-500">
                          {documents[selectedDocIndex]?.images.find(img => img.id === selectedImageId)?.page || 1} 頁
                        </span>
                      </div>
                      {documents[selectedDocIndex]?.invalidImages.includes(selectedImageId) && (
                        <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
                          <span className="text-red-700 font-semibold">無效文件</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => toggleInvalidImage(selectedDocIndex, selectedImageId)}
                    className={`mt-2 w-full px-4 py-2 rounded-lg ${
                      documents[selectedDocIndex]?.invalidImages.includes(selectedImageId)
                        ? 'bg-red-100 text-red-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {documents[selectedDocIndex]?.invalidImages.includes(selectedImageId) ? '取消無效標記' : '標記為無效文件'}
                  </button>
                </div>

                {/* 縮圖列表 */}
                {(documents[selectedDocIndex]?.images.length || 0) > 1 && (
                  <div>
                    <h5 className="text-sm mb-2">所有頁面</h5>
                    <div className="grid grid-cols-3 gap-2">
                      {documents[selectedDocIndex]?.images.map((image) => (
                        <button
                          key={image.id}
                          onClick={() => setSelectedImageId(image.id)}
                          className={`border-2 rounded-lg overflow-hidden ${
                            selectedImageId === image.id
                              ? 'border-primary'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <div className="aspect-[3/4] bg-gray-100 flex items-center justify-center relative">
                            <ImageIcon className="w-8 h-8 text-gray-400" />
                            <div className="absolute bottom-1 right-1 bg-black/50 text-white text-xs px-1 rounded">
                              {image.page}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 右側 - OCR結果與驗證 */}
              <div className="p-6 overflow-y-auto max-h-[600px]">
                {/* OCR 辨識結果 */}
                <div className="mb-6">
                  <h4 className="mb-3">OCR 辨識結果</h4>
                  <div className="space-y-2">
                    {documents[selectedDocIndex]?.ocrFields.map((field, fieldIndex) => {
                      const key = `${selectedDocIndex}-${field.fieldName}`;
                      const manualValue = manualValues[key];
                      const isEditing = editingField === key;
                      
                      return (
                        <div key={fieldIndex} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                          <div className="w-28 text-sm text-muted-foreground flex-shrink-0">{field.fieldName}</div>
                          <div className="flex-1">
                            {isEditing ? (
                              <input
                                type="text"
                                defaultValue={manualValue || field.ocrValue}
                                onBlur={(e) => {
                                  updateManualValue(selectedDocIndex, field.fieldName, e.target.value);
                                  setEditingField(null);
                                }}
                                autoFocus
                                className="w-full px-3 py-1.5 border border-border rounded bg-white"
                              />
                            ) : (
                              <div className="flex items-center gap-2">
                                <span className="text-sm">{manualValue || field.ocrValue}</span>
                                {manualValue && (
                                  <span className="text-xs text-orange-600">(已修改)</span>
                                )}
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => setEditingField(key)}
                            className="p-1.5 hover:bg-accent rounded flex-shrink-0"
                          >
                            <Edit className="w-4 h-4 text-muted-foreground" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 規則驗證結果 */}
                <div>
                  <h4 className="mb-3">規則驗證結果</h4>
                  <div className="space-y-2">
                    {documents[selectedDocIndex]?.validationRules.map((rule, ruleIndex) => (
                      <div
                        key={ruleIndex}
                        className={`p-3 rounded-lg ${
                          rule.isValid ? 'bg-green-50' : 'bg-red-50'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {rule.isValid ? (
                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                          )}
                          <div className="flex-1">
                            <p className="text-sm font-medium">{rule.ruleName}</p>
                            <div className="flex items-center gap-3 mt-1">
                              {rule.isRequired && (
                                <span className="text-xs text-muted-foreground">必要規則</span>
                              )}
                              <span className="text-xs text-muted-foreground">
                                信心度: {rule.confidence}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 審核歷程 */}
      {activeTab === 'history' && (
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="mb-4">審核歷程</h3>
          <div className="space-y-4">
            {historyData.map((item, index) => (
              <div key={index} className="flex gap-4 pb-4 border-b border-border last:border-0">
                <div className="w-32 text-sm text-muted-foreground">{item.time}</div>
                <div className="flex-1">
                  <p className="text-sm mb-1">{item.person}</p>
                  <p className="text-sm text-muted-foreground mb-2">{item.content}</p>
                  <span className="px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                    {item.result}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 審核操作區（僅待審核狀態顯示） */}
      {caseInfo.status === '待審核' && (
        <div className="mt-6 bg-card rounded-lg border border-border p-6">
          <h3 className="mb-4">審核操作</h3>
          <div className="flex gap-4">
            <button
              onClick={() => setShowPDFPreview(true)}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              送件前預覽
            </button>
            <button
              onClick={() => {
                setProcessAction('supplement');
                setShowProcessModal(true);
              }}
              className="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
            >
              補件
            </button>
            <button
              onClick={() => {
                setProcessAction('reject');
                setShowProcessModal(true);
              }}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              退件
            </button>
          </div>
        </div>
      )}

      {/* PDF預覽彈窗 */}
      {showPDFPreview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-5xl h-[90vh] flex flex-col">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3>送件前預覽 - {caseId}</h3>
              <button
                onClick={() => setShowPDFPreview(false)}
                className="p-2 hover:bg-accent rounded-lg"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            
            {/* PDF內容區域 */}
            <div className="flex-1 overflow-auto p-6 bg-gray-50">
              <div className="bg-white shadow-lg max-w-3xl mx-auto p-8">
                <div className="text-center mb-6">
                  <h2 className="text-2xl mb-2">案件審核文件</h2>
                  <p className="text-sm text-muted-foreground">案件代號：{caseId}</p>
                </div>

                {/* 基本資訊 */}
                <div className="mb-6">
                  <h3 className="border-b-2 border-primary pb-2 mb-3">基本資訊</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div><span className="text-muted-foreground">姓名：</span>{caseInfo.personalInfo.name}</div>
                    <div><span className="text-muted-foreground">身分證號：</span>{caseInfo.personalInfo.idNumber}</div>
                    <div><span className="text-muted-foreground">民國生日：</span>{caseInfo.personalInfo.birthday}</div>
                    <div><span className="text-muted-foreground">婚姻狀態：</span>{caseInfo.personalInfo.maritalStatus}</div>
                    <div><span className="text-muted-foreground">教育程度：</span>{caseInfo.personalInfo.education}</div>
                    <div><span className="text-muted-foreground">產品：</span>{caseInfo.product}</div>
                  </div>
                </div>

                {/* 文件清單 */}
                <div className="mb-6">
                  <h3 className="border-b-2 border-primary pb-2 mb-3">提交文件</h3>
                  {documents.map((doc, index) => (
                    <div key={index} className="mb-4 text-sm">
                      <p className="font-semibold">{index + 1}. {doc.type}</p>
                      <p className="text-muted-foreground ml-4">頁數：{doc.images.length} 頁</p>
                    </div>
                  ))}
                </div>

                {/* AI質檢結果 */}
                <div className="mb-6">
                  <h3 className="border-b-2 border-primary pb-2 mb-3">AI質檢結果</h3>
                  <div className="text-sm">
                    <p className="mb-2">總通過率：{aiPassedRules}/{aiTotalRules}</p>
                    {documents.map((doc, index) => {
                      const passed = doc.validationRules.filter(r => r.isValid).length;
                      const total = doc.validationRules.length;
                      return (
                        <div key={index} className="ml-4 mb-2">
                          <p>{doc.type}：{passed}/{total} 規則通過</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 處理時間 */}
                <div className="text-sm text-muted-foreground text-right mt-8">
                  <p>審核日期：{caseInfo.processTime.startTime}</p>
                  <p>處理狀態：{caseInfo.processTime.status}</p>
                </div>
              </div>
            </div>

            {/* 底部操作按鈕 */}
            <div className="p-4 border-t border-border flex items-center justify-between">
              <p className="text-sm text-muted-foreground">請確認上述資訊無誤後再進行送件</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowPDFPreview(false)}
                  className="px-6 py-2 border border-border rounded-lg hover:bg-accent"
                >
                  取消
                </button>
                <button
                  onClick={() => {
                    setShowPDFPreview(false);
                    setProcessAction('submit');
                    setShowProcessModal(true);
                  }}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  確定送件
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 處理確認彈窗 */}
      {showProcessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h3 className="mb-4">
              確認{processAction === 'submit' ? '送件' : processAction === 'supplement' ? '補件' : '退件'}
            </h3>
            
            {processAction === 'supplement' && (
              <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="text-sm mb-2">待補件清單</h4>
                <ul className="space-y-2">
                  {documents.filter(doc => doc.needsSupplement).map((doc, index) => (
                    <li key={index} className="text-sm">
                      <p className="font-medium">{doc.type}</p>
                      <p className="text-muted-foreground">{doc.supplementNote}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm mb-2">處置說明</label>
              <textarea
                value={processNote}
                onChange={(e) => setProcessNote(e.target.value)}
                placeholder="請輸入處置說明..."
                className="w-full px-4 py-2 border border-border rounded-lg"
                rows={4}
              />
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowProcessModal(false)}
                className="px-4 py-2 border border-border rounded-lg hover:bg-accent"
              >
                取消
              </button>
              <button
                onClick={handleProcess}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
              >
                確認送出
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}