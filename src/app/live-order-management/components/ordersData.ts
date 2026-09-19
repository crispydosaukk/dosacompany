export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  modifiers: string[];
}

export interface StatusHistoryEntry {
  id: string;
  status: string;
  timestamp: string;
  note?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  table: number;
  customer: string;
  email: string;
  phone: string;
  items: OrderItem[];
  subtotal: number;
  vat: number;
  total: number;
  status: string;
  paymentStatus: 'PAID' | 'PAYMENT_PENDING' | 'PAYMENT_FAILED' | 'REFUNDED';
  eposStatus: 'ACCEPTED' | 'PENDING' | 'FAILED' | 'SENDING' | 'NOT_SENT';
  kitchenStatus: 'PREPARING' | 'READY' | 'SENT' | 'PENDING' | 'COMPLETED';
  stripePaymentId: string;
  eposRetries: number;
  specialInstructions: string;
  time: string;
  date: string;
  statusHistory: StatusHistoryEntry[];
}

export const ALL_ORDERS: Order[] = [
  {
    id: 'order-dc-247',
    orderNumber: 'DC-20260919-000247',
    table: 1,
    customer: 'Priya Sharma',
    email: 'priya.sharma@gmail.com',
    phone: '+447712345001',
    items: [
      { id: 'oi-a1', name: 'Masala Dosa', quantity: 2, unitPrice: 875, modifiers: ['Both Chutneys', 'Extra Sambar'] },
      { id: 'oi-a2', name: 'Gobi 65', quantity: 1, unitPrice: 899, modifiers: [] },
      { id: 'oi-a3', name: 'Mango Lassi', quantity: 2, unitPrice: 450, modifiers: [] },
    ],
    subtotal: 2975,
    vat: 595,
    total: 3573,
    status: 'SENT_TO_KITCHEN',
    paymentStatus: 'PAID',
    eposStatus: 'ACCEPTED',
    kitchenStatus: 'PREPARING',
    stripePaymentId: 'pi_3Pxyz001',
    eposRetries: 0,
    specialInstructions: 'No onions please',
    time: '09:41',
    date: '19/09/2026',
    statusHistory: [
      { id: 'sh-a1', status: 'DRAFT', timestamp: '09:41:02' },
      { id: 'sh-a2', status: 'PAYMENT_PENDING', timestamp: '09:41:05' },
      { id: 'sh-a3', status: 'PAID', timestamp: '09:41:18', note: 'Stripe payment confirmed' },
      { id: 'sh-a4', status: 'SENT_TO_EPOS', timestamp: '09:41:19' },
      { id: 'sh-a5', status: 'EPOS_ACCEPTED', timestamp: '09:41:21', note: 'EPOS ref: EP-7823' },
      { id: 'sh-a6', status: 'SENT_TO_KITCHEN', timestamp: '09:41:22' },
    ],
  },
  {
    id: 'order-dc-246',
    orderNumber: 'DC-20260919-000246',
    table: 5,
    customer: 'Rajan Mehta',
    email: 'rajan.mehta@outlook.com',
    phone: '+447712345002',
    items: [
      { id: 'oi-b1', name: 'Bombay Thali', quantity: 2, unitPrice: 1350, modifiers: [] },
      { id: 'oi-b2', name: 'Paneer 65', quantity: 1, unitPrice: 899, modifiers: ['Dry'] },
      { id: 'oi-b3', name: 'Filter Coffee', quantity: 2, unitPrice: 350, modifiers: [] },
    ],
    subtotal: 4299,
    vat: 860,
    total: 5159,
    status: 'READY',
    paymentStatus: 'PAID',
    eposStatus: 'ACCEPTED',
    kitchenStatus: 'READY',
    stripePaymentId: 'pi_3Pxyz002',
    eposRetries: 0,
    specialInstructions: '',
    time: '09:38',
    date: '19/09/2026',
    statusHistory: [
      { id: 'sh-b1', status: 'DRAFT', timestamp: '09:38:00' },
      { id: 'sh-b2', status: 'PAID', timestamp: '09:38:14' },
      { id: 'sh-b3', status: 'EPOS_ACCEPTED', timestamp: '09:38:16' },
      { id: 'sh-b4', status: 'SENT_TO_KITCHEN', timestamp: '09:38:17' },
      { id: 'sh-b5', status: 'READY', timestamp: '09:52:00', note: 'Kitchen marked ready' },
    ],
  },
  {
    id: 'order-dc-245',
    orderNumber: 'DC-20260919-000245',
    table: 12,
    customer: 'Ananya Krishnan',
    email: 'ananya.k@yahoo.co.uk',
    phone: '+447712345003',
    items: [
      { id: 'oi-c1', name: 'Karaikudi Kaalan Kari Dosa', quantity: 1, unitPrice: 1050, modifiers: [] },
      { id: 'oi-c2', name: 'Madras Thali', quantity: 1, unitPrice: 1299, modifiers: [] },
    ],
    subtotal: 2083,
    vat: 416,
    total: 2499,
    status: 'EPOS_FAILED',
    paymentStatus: 'PAID',
    eposStatus: 'FAILED',
    kitchenStatus: 'PENDING',
    stripePaymentId: 'pi_3Pxyz003',
    eposRetries: 2,
    specialInstructions: '',
    time: '09:35',
    date: '19/09/2026',
    statusHistory: [
      { id: 'sh-c1', status: 'DRAFT', timestamp: '09:35:00' },
      { id: 'sh-c2', status: 'PAID', timestamp: '09:35:12' },
      { id: 'sh-c3', status: 'EPOS_FAILED', timestamp: '09:35:14', note: 'API timeout — attempt 1' },
      { id: 'sh-c4', status: 'EPOS_FAILED', timestamp: '09:35:44', note: 'API timeout — attempt 2' },
    ],
  },
  {
    id: 'order-dc-244',
    orderNumber: 'DC-20260919-000244',
    table: 7,
    customer: 'Suresh Patel',
    email: 'suresh.patel@gmail.com',
    phone: '+447712345004',
    items: [
      { id: 'oi-d1', name: 'Bahubali Paper Roast', quantity: 1, unitPrice: 3999, modifiers: [] },
    ],
    subtotal: 3458,
    vat: 692,
    total: 4150,
    status: 'SENT_TO_EPOS',
    paymentStatus: 'PAID',
    eposStatus: 'SENDING',
    kitchenStatus: 'PENDING',
    stripePaymentId: 'pi_3Pxyz004',
    eposRetries: 0,
    specialInstructions: 'Birthday celebration — please add a candle',
    time: '09:33',
    date: '19/09/2026',
    statusHistory: [
      { id: 'sh-d1', status: 'DRAFT', timestamp: '09:33:00' },
      { id: 'sh-d2', status: 'PAID', timestamp: '09:33:09' },
      { id: 'sh-d3', status: 'SENT_TO_EPOS', timestamp: '09:33:10' },
    ],
  },
  {
    id: 'order-dc-243',
    orderNumber: 'DC-20260919-000243',
    table: 19,
    customer: 'Kavitha Nair',
    email: 'kavitha.nair@hotmail.com',
    phone: '+447712345005',
    items: [
      { id: 'oi-e1', name: 'Ghee Masala Dosa', quantity: 2, unitPrice: 850, modifiers: [] },
      { id: 'oi-e2', name: 'Idly', quantity: 2, unitPrice: 460, modifiers: ['Extra Sambar'] },
      { id: 'oi-e3', name: 'Medhu Vada (2 Nos)', quantity: 1, unitPrice: 525, modifiers: [] },
      { id: 'oi-e4', name: 'Mango Lassi', quantity: 2, unitPrice: 450, modifiers: [] },
    ],
    subtotal: 5728,
    vat: 1146,
    total: 6875,
    status: 'PREPARING',
    paymentStatus: 'PAID',
    eposStatus: 'ACCEPTED',
    kitchenStatus: 'SENT',
    stripePaymentId: 'pi_3Pxyz005',
    eposRetries: 0,
    specialInstructions: '',
    time: '09:29',
    date: '19/09/2026',
    statusHistory: [
      { id: 'sh-e1', status: 'DRAFT', timestamp: '09:29:00' },
      { id: 'sh-e2', status: 'PAID', timestamp: '09:29:11' },
      { id: 'sh-e3', status: 'EPOS_ACCEPTED', timestamp: '09:29:13' },
      { id: 'sh-e4', status: 'SENT_TO_KITCHEN', timestamp: '09:29:14' },
    ],
  },
  {
    id: 'order-dc-242',
    orderNumber: 'DC-20260919-000242',
    table: 3,
    customer: 'Deepak Iyer',
    email: 'deepak.iyer@gmail.com',
    phone: '+447712345006',
    items: [
      { id: 'oi-f1', name: 'Poori Masala (3 Nos)', quantity: 2, unitPrice: 675, modifiers: [] },
      { id: 'oi-f2', name: 'Vegetable Hot & Sour', quantity: 1, unitPrice: 550, modifiers: [] },
    ],
    subtotal: 1583,
    vat: 317,
    total: 1900,
    status: 'COMPLETED',
    paymentStatus: 'PAID',
    eposStatus: 'ACCEPTED',
    kitchenStatus: 'COMPLETED',
    stripePaymentId: 'pi_3Pxyz006',
    eposRetries: 0,
    specialInstructions: '',
    time: '09:15',
    date: '19/09/2026',
    statusHistory: [
      { id: 'sh-f1', status: 'PAID', timestamp: '09:15:00' },
      { id: 'sh-f2', status: 'EPOS_ACCEPTED', timestamp: '09:15:02' },
      { id: 'sh-f3', status: 'SENT_TO_KITCHEN', timestamp: '09:15:03' },
      { id: 'sh-f4', status: 'COMPLETED', timestamp: '09:32:00' },
    ],
  },
  {
    id: 'order-dc-241',
    orderNumber: 'DC-20260919-000241',
    table: 8,
    customer: 'Meera Sundaram',
    email: 'meera.s@gmail.com',
    phone: '+447712345007',
    items: [
      { id: 'oi-g1', name: 'Pizza Uthappam', quantity: 1, unitPrice: 999, modifiers: [] },
      { id: 'oi-g2', name: 'Paneer 65', quantity: 2, unitPrice: 899, modifiers: ['Gravy'] },
    ],
    subtotal: 2314,
    vat: 463,
    total: 2777,
    status: 'PAYMENT_FAILED',
    paymentStatus: 'PAYMENT_FAILED',
    eposStatus: 'NOT_SENT',
    kitchenStatus: 'PENDING',
    stripePaymentId: '',
    eposRetries: 0,
    specialInstructions: '',
    time: '09:10',
    date: '19/09/2026',
    statusHistory: [
      { id: 'sh-g1', status: 'DRAFT', timestamp: '09:10:00' },
      { id: 'sh-g2', status: 'PAYMENT_PENDING', timestamp: '09:10:04' },
      { id: 'sh-g3', status: 'PAYMENT_FAILED', timestamp: '09:10:18', note: 'Card declined' },
    ],
  },
  {
    id: 'order-dc-240',
    orderNumber: 'DC-20260919-000240',
    table: 22,
    customer: 'Arun Venkatesh',
    email: 'arun.v@outlook.com',
    phone: '+447712345008',
    items: [
      { id: 'oi-h1', name: 'Madras Thali', quantity: 3, unitPrice: 1299, modifiers: [] },
      { id: 'oi-h2', name: 'Filter Coffee', quantity: 3, unitPrice: 350, modifiers: [] },
    ],
    subtotal: 4947,
    vat: 990,
    total: 5937,
    status: 'COMPLETED',
    paymentStatus: 'PAID',
    eposStatus: 'ACCEPTED',
    kitchenStatus: 'COMPLETED',
    stripePaymentId: 'pi_3Pxyz008',
    eposRetries: 0,
    specialInstructions: 'Celebrating anniversary',
    time: '08:55',
    date: '19/09/2026',
    statusHistory: [
      { id: 'sh-h1', status: 'PAID', timestamp: '08:55:00' },
      { id: 'sh-h2', status: 'EPOS_ACCEPTED', timestamp: '08:55:03' },
      { id: 'sh-h3', status: 'COMPLETED', timestamp: '09:22:00' },
    ],
  },
];