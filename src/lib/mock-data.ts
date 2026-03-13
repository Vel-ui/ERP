// Mock data for Phase 1 - can be replaced with API/localStorage later

export const ACCOUNT_TYPES = [
  { value: "Asset", label: "Asset" },
  { value: "Liability", label: "Liability" },
  { value: "Equity", label: "Equity" },
  { value: "Income", label: "Income" },
  { value: "Expense", label: "Expense" },
] as const;

export const ACCOUNT_SUBTYPES: Record<string, { value: string; label: string }[]> = {
  Asset: [
    { value: "Bank", label: "Bank" },
    { value: "Accounts Receivable", label: "Accounts Receivable" },
    { value: "Fixed Assets", label: "Fixed Assets" },
    { value: "Prepaid Expense", label: "Prepaid Expense" },
    { value: "Other Assets", label: "Other Assets" },
  ],
  Liability: [
    { value: "Accounts Payable", label: "Accounts Payable" },
    { value: "Credit Card", label: "Credit Card" },
    { value: "Accrued Expense", label: "Accrued Expense" },
    { value: "Other Current Liability", label: "Other Current Liability" },
  ],
  Equity: [
    { value: "Equity", label: "Equity" },
    { value: "Retained Earnings", label: "Retained Earnings" },
  ],
  Income: [{ value: "Revenue", label: "Revenue" }],
  Expense: [
    { value: "Operating Expense", label: "Operating Expense" },
    { value: "COGS", label: "COGS" },
    { value: "Non Operating Income/Expense", label: "Non Operating Income/Expense" },
  ],
};

export const MOCK_ACCOUNTS = [
  { id: "1", number: "1000", name: "Cash", type: "Asset", subtype: "Bank", active: true },
  { id: "2", number: "1200", name: "Accounts Receivable", type: "Asset", subtype: "Accounts Receivable", active: true },
  { id: "3", number: "2000", name: "Accounts Payable", type: "Liability", subtype: "Accounts Payable", active: true },
  { id: "4", number: "4000", name: "Revenue", type: "Income", subtype: "Revenue", active: true },
  { id: "5", number: "5000", name: "Operating Expenses", type: "Expense", subtype: "Operating Expense", active: true },
];

export const MOCK_FIELDS = [
  { id: "1", name: "Department", type: "Dropdown", mandatory: true, displayAs: "Standalone", values: ["Engineering", "Sales", "Marketing", "Operations"] },
  { id: "2", name: "Project", type: "Dropdown", mandatory: false, displayAs: "Free tagging", values: ["Project A", "Project B", "Project C"] },
  { id: "3", name: "Cost Center", type: "Text", mandatory: false, displayAs: "Standalone", values: [] },
];

export const MOCK_MEMBERS = [
  { id: "1", name: "Jane Smith", email: "jane@example.com", role: "Admin" },
  { id: "2", name: "John Doe", email: "john@example.com", role: "Accountant" },
  { id: "3", name: "Alice Wilson", email: "alice@example.com", role: "Accountant" },
];

// ============================================================
// Accounts Receivable Mock Data
// ============================================================

export interface ARCustomer {
  id: string;
  companyName: string;
  invoicingName: string;
  email: string;
  ccEmail: string;
  address: string;
  shippingAddress: string;
  paymentTerms: string;
  balance: number;
  status: "Active" | "Inactive";
  notes: string;
  autoReminders: boolean;
  onlinePayments: boolean;
  taxRate: number;
  department: string;
  customerSegment: string;
}

export interface ARProduct {
  id: string;
  name: string;
  type: "Revenue" | "Non-Revenue";
  revenueType: "Fixed" | "Usage";
  pricing: "Recurring" | "One-time";
  countToMrrArr: boolean;
  status: "Active" | "Inactive";
  revenueAccount: string;
  discountAccount: string;
  revenuePattern: string;
  usageTierType?: "Standard" | "Graduated" | "Volume";
}

export interface ARContractProduct {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
}

export interface ARContract {
  id: string;
  contractNumber: string;
  customerId: string;
  customerName: string;
  type: "New Sales" | "Existing" | "Expansion" | "Reactivation" | "Contraction";
  startDate: string;
  endDate: string;
  duration: string;
  arr: number;
  status: "Active" | "Pending Review" | "Expired" | "Cancelled";
  autoRenew: boolean;
  products: ARContractProduct[];
  billingFrequency: string;
  paymentTerms: string;
  poNumber: string;
}

export interface ARInvoiceLineItem {
  id: string;
  productId: string;
  productName: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface ARInvoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  date: string;
  dueDate: string;
  amount: number;
  status: "Unbilled" | "Unpaid" | "Paid" | "Overdue";
  lineItems: ARInvoiceLineItem[];
  paymentTerms: string;
  poNumber: string;
  memo: string;
}

export interface ARCreditMemo {
  id: string;
  cmNumber: string;
  customerId: string;
  customerName: string;
  invoiceId: string | null;
  invoiceNumber: string | null;
  date: string;
  amount: number;
  status: "Unpaid" | "Applied" | "Refunded";
  lineItems: { productName: string; description: string; amount: number }[];
}

export const AR_PAYMENT_TERMS = [
  { value: "Due on Receipt", label: "Due on Receipt" },
  { value: "Net 15", label: "Net 15" },
  { value: "Net 30", label: "Net 30" },
  { value: "Net 45", label: "Net 45" },
  { value: "Net 60", label: "Net 60" },
];

export const AR_CONTRACT_TYPES = [
  { value: "New Sales", label: "New Sales" },
  { value: "Existing", label: "Existing" },
  { value: "Expansion", label: "Expansion" },
  { value: "Reactivation", label: "Reactivation" },
  { value: "Contraction", label: "Contraction" },
];

export const AR_DURATIONS = [
  { value: "6mo", label: "6 Months" },
  { value: "1yr", label: "1 Year" },
  { value: "2yr", label: "2 Years" },
  { value: "3yr", label: "3 Years" },
  { value: "open", label: "Open-ended" },
  { value: "custom", label: "Custom" },
];

export const AR_BILLING_FREQUENCIES = [
  { value: "Monthly", label: "Monthly" },
  { value: "Quarterly", label: "Quarterly" },
  { value: "Semi-Annually", label: "Semi-Annually" },
  { value: "Annually", label: "Annually" },
];

export const MOCK_AR_CUSTOMERS: ARCustomer[] = [
  {
    id: "cust-1",
    companyName: "Acme Corporation",
    invoicingName: "Acme Corp",
    email: "billing@acme.com",
    ccEmail: "finance@acme.com",
    address: "123 Main St, San Francisco, CA 94105",
    shippingAddress: "123 Main St, San Francisco, CA 94105",
    paymentTerms: "Net 30",
    balance: 45000,
    status: "Active",
    notes: "Enterprise customer since 2022",
    autoReminders: true,
    onlinePayments: true,
    taxRate: 8.5,
    department: "Sales",
    customerSegment: "Enterprise",
  },
  {
    id: "cust-2",
    companyName: "TechStart Inc",
    invoicingName: "TechStart",
    email: "ap@techstart.io",
    ccEmail: "",
    address: "456 Innovation Blvd, Austin, TX 78701",
    shippingAddress: "456 Innovation Blvd, Austin, TX 78701",
    paymentTerms: "Net 15",
    balance: 12500,
    status: "Active",
    notes: "Fast-growing startup, monthly billing preferred",
    autoReminders: true,
    onlinePayments: true,
    taxRate: 6.25,
    department: "Sales",
    customerSegment: "Startup",
  },
  {
    id: "cust-3",
    companyName: "Global Dynamics Ltd",
    invoicingName: "Global Dynamics",
    email: "accounts@globaldyn.com",
    ccEmail: "cfo@globaldyn.com",
    address: "789 Corporate Dr, New York, NY 10001",
    shippingAddress: "100 Warehouse Ln, Newark, NJ 07102",
    paymentTerms: "Net 45",
    balance: 78200,
    status: "Active",
    notes: "Multi-year contract, quarterly invoicing",
    autoReminders: false,
    onlinePayments: false,
    taxRate: 8.875,
    department: "Sales",
    customerSegment: "Enterprise",
  },
  {
    id: "cust-4",
    companyName: "Pinnacle Solutions",
    invoicingName: "Pinnacle Solutions LLC",
    email: "invoices@pinnacle.co",
    ccEmail: "",
    address: "321 Summit Ave, Denver, CO 80202",
    shippingAddress: "321 Summit Ave, Denver, CO 80202",
    paymentTerms: "Net 30",
    balance: 0,
    status: "Active",
    notes: "Recently signed, onboarding in progress",
    autoReminders: true,
    onlinePayments: true,
    taxRate: 7.65,
    department: "Marketing",
    customerSegment: "Mid-Market",
  },
  {
    id: "cust-5",
    companyName: "Redwood Analytics",
    invoicingName: "Redwood Analytics Inc",
    email: "billing@redwood.ai",
    ccEmail: "ops@redwood.ai",
    address: "555 Data Way, Seattle, WA 98101",
    shippingAddress: "555 Data Way, Seattle, WA 98101",
    paymentTerms: "Net 60",
    balance: 23750,
    status: "Inactive",
    notes: "Contract ended Q4 2025, outstanding balance",
    autoReminders: true,
    onlinePayments: false,
    taxRate: 10.1,
    department: "Engineering",
    customerSegment: "Enterprise",
  },
];

export const MOCK_AR_PRODUCTS: ARProduct[] = [
  {
    id: "prod-1",
    name: "Platform License",
    type: "Revenue",
    revenueType: "Fixed",
    pricing: "Recurring",
    countToMrrArr: true,
    status: "Active",
    revenueAccount: "4000 - Revenue",
    discountAccount: "4100 - Discounts",
    revenuePattern: "Even Period Prorated First & Last",
  },
  {
    id: "prod-2",
    name: "Implementation Services",
    type: "Revenue",
    revenueType: "Fixed",
    pricing: "One-time",
    countToMrrArr: false,
    status: "Active",
    revenueAccount: "4200 - Professional Services",
    discountAccount: "",
    revenuePattern: "Even Period Prorated First & Last",
  },
  {
    id: "prod-3",
    name: "API Usage",
    type: "Revenue",
    revenueType: "Usage",
    pricing: "Recurring",
    countToMrrArr: true,
    status: "Active",
    revenueAccount: "4000 - Revenue",
    discountAccount: "",
    revenuePattern: "Daily",
    usageTierType: "Graduated",
  },
  {
    id: "prod-4",
    name: "Support Add-on",
    type: "Revenue",
    revenueType: "Fixed",
    pricing: "Recurring",
    countToMrrArr: true,
    status: "Active",
    revenueAccount: "4300 - Support Revenue",
    discountAccount: "4100 - Discounts",
    revenuePattern: "Even Period Prorated First & Last",
  },
];

export const MOCK_AR_CONTRACTS: ARContract[] = [
  {
    id: "con-1",
    contractNumber: "CTR-001",
    customerId: "cust-1",
    customerName: "Acme Corporation",
    type: "New Sales",
    startDate: "2025-01-01",
    endDate: "2025-12-31",
    duration: "1 Year",
    arr: 120000,
    status: "Active",
    autoRenew: true,
    products: [
      { productId: "prod-1", productName: "Platform License", quantity: 1, unitPrice: 8000, discount: 0, total: 96000 },
      { productId: "prod-4", productName: "Support Add-on", quantity: 1, unitPrice: 2000, discount: 0, total: 24000 },
    ],
    billingFrequency: "Monthly",
    paymentTerms: "Net 30",
    poNumber: "PO-2025-001",
  },
  {
    id: "con-2",
    contractNumber: "CTR-002",
    customerId: "cust-2",
    customerName: "TechStart Inc",
    type: "New Sales",
    startDate: "2025-07-01",
    endDate: "2025-12-31",
    duration: "6 Months",
    arr: 36000,
    status: "Active",
    autoRenew: false,
    products: [
      { productId: "prod-1", productName: "Platform License", quantity: 1, unitPrice: 3000, discount: 0, total: 18000 },
    ],
    billingFrequency: "Monthly",
    paymentTerms: "Net 15",
    poNumber: "",
  },
  {
    id: "con-3",
    contractNumber: "CTR-003",
    customerId: "cust-3",
    customerName: "Global Dynamics Ltd",
    type: "Expansion",
    startDate: "2025-01-01",
    endDate: "2026-12-31",
    duration: "2 Years",
    arr: 240000,
    status: "Active",
    autoRenew: true,
    products: [
      { productId: "prod-1", productName: "Platform License", quantity: 3, unitPrice: 5000, discount: 10, total: 162000 },
      { productId: "prod-3", productName: "API Usage", quantity: 1, unitPrice: 2500, discount: 0, total: 30000 },
      { productId: "prod-4", productName: "Support Add-on", quantity: 3, unitPrice: 1500, discount: 5, total: 51300 },
    ],
    billingFrequency: "Quarterly",
    paymentTerms: "Net 45",
    poNumber: "PO-GD-2025-Q1",
  },
  {
    id: "con-4",
    contractNumber: "CTR-004",
    customerId: "cust-4",
    customerName: "Pinnacle Solutions",
    type: "New Sales",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    duration: "1 Year",
    arr: 60000,
    status: "Pending Review",
    autoRenew: true,
    products: [
      { productId: "prod-1", productName: "Platform License", quantity: 1, unitPrice: 5000, discount: 0, total: 60000 },
    ],
    billingFrequency: "Monthly",
    paymentTerms: "Net 30",
    poNumber: "PO-PIN-2026",
  },
];

export const MOCK_AR_INVOICES: ARInvoice[] = [
  {
    id: "inv-1",
    invoiceNumber: "INV-001",
    customerId: "cust-1",
    customerName: "Acme Corporation",
    date: "2025-10-01",
    dueDate: "2025-10-31",
    amount: 10000,
    status: "Paid",
    lineItems: [
      { id: "li-1", productId: "prod-1", productName: "Platform License", description: "Oct 2025 - Platform License", quantity: 1, unitPrice: 8000, amount: 8000 },
      { id: "li-2", productId: "prod-4", productName: "Support Add-on", description: "Oct 2025 - Premium Support", quantity: 1, unitPrice: 2000, amount: 2000 },
    ],
    paymentTerms: "Net 30",
    poNumber: "PO-2025-001",
    memo: "",
  },
  {
    id: "inv-2",
    invoiceNumber: "INV-002",
    customerId: "cust-2",
    customerName: "TechStart Inc",
    date: "2025-11-01",
    dueDate: "2025-11-16",
    amount: 3000,
    status: "Unpaid",
    lineItems: [
      { id: "li-3", productId: "prod-1", productName: "Platform License", description: "Nov 2025 - Platform License", quantity: 1, unitPrice: 3000, amount: 3000 },
    ],
    paymentTerms: "Net 15",
    poNumber: "",
    memo: "Monthly subscription",
  },
  {
    id: "inv-3",
    invoiceNumber: "INV-003",
    customerId: "cust-3",
    customerName: "Global Dynamics Ltd",
    date: "2025-07-01",
    dueDate: "2025-08-15",
    amount: 60750,
    status: "Overdue",
    lineItems: [
      { id: "li-4", productId: "prod-1", productName: "Platform License", description: "Q3 2025 - Platform License (3 seats)", quantity: 3, unitPrice: 13500, amount: 40500 },
      { id: "li-5", productId: "prod-3", productName: "API Usage", description: "Q3 2025 - API Usage", quantity: 1, unitPrice: 7500, amount: 7500 },
      { id: "li-6", productId: "prod-4", productName: "Support Add-on", description: "Q3 2025 - Support (3 seats)", quantity: 3, unitPrice: 4250, amount: 12750 },
    ],
    paymentTerms: "Net 45",
    poNumber: "PO-GD-2025-Q3",
    memo: "Quarterly invoice",
  },
  {
    id: "inv-4",
    invoiceNumber: "INV-004",
    customerId: "cust-1",
    customerName: "Acme Corporation",
    date: "2025-12-01",
    dueDate: "2025-12-31",
    amount: 10000,
    status: "Unbilled",
    lineItems: [
      { id: "li-7", productId: "prod-1", productName: "Platform License", description: "Dec 2025 - Platform License", quantity: 1, unitPrice: 8000, amount: 8000 },
      { id: "li-8", productId: "prod-4", productName: "Support Add-on", description: "Dec 2025 - Premium Support", quantity: 1, unitPrice: 2000, amount: 2000 },
    ],
    paymentTerms: "Net 30",
    poNumber: "PO-2025-001",
    memo: "",
  },
  {
    id: "inv-5",
    invoiceNumber: "INV-005",
    customerId: "cust-4",
    customerName: "Pinnacle Solutions",
    date: "2025-11-15",
    dueDate: "2025-12-15",
    amount: 5000,
    status: "Unpaid",
    lineItems: [
      { id: "li-9", productId: "prod-1", productName: "Platform License", description: "Nov 2025 - Platform License", quantity: 1, unitPrice: 5000, amount: 5000 },
    ],
    paymentTerms: "Net 30",
    poNumber: "PO-PIN-2026",
    memo: "First invoice",
  },
];

export const MOCK_AR_CREDIT_MEMOS: ARCreditMemo[] = [
  {
    id: "cm-1",
    cmNumber: "CM-001",
    customerId: "cust-1",
    customerName: "Acme Corporation",
    invoiceId: "inv-1",
    invoiceNumber: "INV-001",
    date: "2025-10-15",
    amount: 2000,
    status: "Applied",
    lineItems: [{ productName: "Support Add-on", description: "Service credit - Oct outage", amount: 2000 }],
  },
  {
    id: "cm-2",
    cmNumber: "CM-002",
    customerId: "cust-2",
    customerName: "TechStart Inc",
    invoiceId: null,
    invoiceNumber: null,
    date: "2025-11-05",
    amount: 500,
    status: "Unpaid",
    lineItems: [{ productName: "Platform License", description: "Promotional discount", amount: 500 }],
  },
  {
    id: "cm-3",
    cmNumber: "CM-003",
    customerId: "cust-3",
    customerName: "Global Dynamics Ltd",
    invoiceId: "inv-3",
    invoiceNumber: "INV-003",
    date: "2025-09-01",
    amount: 3000,
    status: "Refunded",
    lineItems: [
      { productName: "API Usage", description: "Overcharge correction - Q3 API", amount: 2000 },
      { productName: "Support Add-on", description: "SLA credit", amount: 1000 },
    ],
  },
];
