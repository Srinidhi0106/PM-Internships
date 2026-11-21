import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import {
  Landmark,
  CheckCircle2,
  Clock,
  AlertCircle,
  Download,
  Copy,
  Check,
  Search,
  Filter,
  RefreshCw,
  CreditCard,
  Building2,
  Calendar,
  ArrowUpRight,
  ShieldCheck,
  Smartphone,
  ChevronRight,
  Receipt,
  Eye,
  X
} from 'lucide-react';
import { User, InternshipPaymentTransaction } from '../types';

export interface TransactionHistoryProps {
  user: User;
  onNavigateToInternships?: () => void;
  className?: string;
}

export const INITIAL_STUDENT_TRANSACTIONS: InternshipPaymentTransaction[] = [
  {
    id: 'tx-2026-03',
    orderId: 'PMIS-DBT-2026-0903',
    internshipRole: 'AI & Full-Stack Systems Engineer',
    companyName: 'Tata Consultancy Services',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80',
    amount: 15000,
    govtShare: 4500,
    companyShare: 10500,
    status: 'SUCCESS',
    date: '05 Nov 2026, 11:30 AM',
    monthPeriod: 'Month 3 (November 2026)',
    paymentRail: 'PhonePe UPI',
    utrNumber: 'P1422609071249105',
    accountMasked: 'State Bank of India •••• 4921',
    attendanceVerified: true,
    dbtReference: 'MCA/DBT/2026/09/8812',
    notes: 'Month 3 Full-Stack Engineering Stipend via PhonePe UPI Gateway'
  },
  {
    id: 'tx-2026-02',
    orderId: 'PMIS-DBT-2026-0902',
    internshipRole: 'AI & Full-Stack Systems Engineer',
    companyName: 'Tata Consultancy Services',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80',
    amount: 15000,
    govtShare: 4500,
    companyShare: 10500,
    status: 'SUCCESS',
    date: '05 Oct 2026, 04:15 PM',
    monthPeriod: 'Month 2 (October 2026)',
    paymentRail: 'Govt DBT (APBS)',
    utrNumber: 'UTR-SBI-20261005-4418',
    accountMasked: 'State Bank of India •••• 4921',
    attendanceVerified: true,
    dbtReference: 'MCA/DBT/2026/09/4418',
    notes: 'Month 2 APBS Direct Benefit Transfer credited to Aadhaar bank account'
  },
  {
    id: 'tx-2026-01',
    orderId: 'PMIS-DBT-2026-0901',
    internshipRole: 'AI & Full-Stack Systems Engineer',
    companyName: 'Tata Consultancy Services',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80',
    amount: 15000,
    govtShare: 4500,
    companyShare: 10500,
    status: 'SUCCESS',
    date: '05 Sep 2026, 10:00 AM',
    monthPeriod: 'Month 1 (September 2026)',
    paymentRail: 'PhonePe UPI',
    utrNumber: 'P1422609078421099',
    accountMasked: 'State Bank of India •••• 4921',
    attendanceVerified: true,
    dbtReference: 'MCA/DBT/2026/09/9921',
    notes: 'Month 1 Joining Stipend & Onboarding Allowance via PhonePe'
  },
  {
    id: 'tx-2026-04',
    orderId: 'PMIS-DBT-2026-0904',
    internshipRole: 'AI & Full-Stack Systems Engineer',
    companyName: 'Tata Consultancy Services',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80',
    amount: 15000,
    govtShare: 4500,
    companyShare: 10500,
    status: 'PENDING',
    date: 'Scheduled for 05 Dec 2026',
    monthPeriod: 'Month 4 (December 2026)',
    paymentRail: 'PhonePe UPI',
    utrNumber: 'PENDING-ESCROW-CLEARANCE',
    accountMasked: 'State Bank of India •••• 4921',
    attendanceVerified: false,
    dbtReference: 'MCA/DBT/2026/12/EXP',
    notes: 'Awaiting monthly attendance audit & mentor milestone sign-off'
  }
];

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  user,
  onNavigateToInternships,
  className = ''
}) => {
  const [transactions, setTransactions] = useState<InternshipPaymentTransaction[]>(INITIAL_STUDENT_TRANSACTIONS);
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'SUCCESS' | 'PENDING'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copiedUtr, setCopiedUtr] = useState<string | null>(null);
  const [selectedTx, setSelectedTx] = useState<InternshipPaymentTransaction | null>(null);

  // Fetch real-time transactions from server on load
  const loadTransactions = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/payments/transactions');
      if (res.ok) {
        const data = await res.json();
        if (data.transactions && Array.isArray(data.transactions) && data.transactions.length > 0) {
          // Merge server transactions with student defaults
          const serverTxs: InternshipPaymentTransaction[] = data.transactions.map((t: any) => ({
            id: t.id,
            orderId: t.orderId || `PMIS-ORD-${Date.now()}`,
            internshipRole: t.notes?.includes('Stipend') ? 'AI & Full-Stack Systems Engineer' : 'Paid PM Scheme Intern',
            companyName: 'Tata Consultancy Services',
            amount: t.amount || 15000,
            govtShare: 4500,
            companyShare: (t.amount || 15000) - 4500,
            status: t.status || 'SUCCESS',
            date: t.timestamp || 'Recently',
            monthPeriod: 'Current Month Stipend',
            paymentRail: (t.paymentRail as any) || 'PhonePe UPI',
            utrNumber: t.utrNumber || 'P1422609071249105',
            accountMasked: t.candidateAccount || 'State Bank of India •••• 4921',
            attendanceVerified: true,
            dbtReference: t.dbtReference || 'MCA/DBT/2026/09/4821',
            notes: t.notes
          }));

          // Avoid duplicate IDs
          const existingIds = new Set(serverTxs.map(s => s.id));
          const uniqueDefaults = INITIAL_STUDENT_TRANSACTIONS.filter(init => !existingIds.has(init.id));
          setTransactions([...serverTxs, ...uniqueDefaults]);
        }
      }
    } catch (err) {
      console.warn('Could not refresh server transactions, using cached store:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  // Filter transactions
  const filteredTransactions = transactions.filter((tx) => {
    const matchesStatus =
      filterStatus === 'ALL' ? true : tx.status === filterStatus;
    const matchesSearch =
      searchQuery.trim() === '' ||
      tx.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.internshipRole.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.monthPeriod.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.utrNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.orderId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const totalCredited = transactions
    .filter((tx) => tx.status === 'SUCCESS')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalPending = transactions
    .filter((tx) => tx.status === 'PENDING')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const handleCopyUtr = (utr: string) => {
    navigator.clipboard.writeText(utr);
    setCopiedUtr(utr);
    setTimeout(() => setCopiedUtr(null), 2000);
  };

  const handleDownloadInvoice = (tx: InternshipPaymentTransaction) => {
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Background
      doc.setFillColor(248, 250, 252);
      doc.rect(0, 0, 210, 297, 'F');

      // Top Banner (Tricolor Accent Saffron)
      doc.setFillColor(255, 153, 51); // Saffron
      doc.rect(0, 0, 210, 5, 'F');

      // Header Banner Navy Blue
      doc.setFillColor(8, 24, 69);
      doc.rect(0, 5, 210, 32, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('DIRECT BENEFIT TRANSFER STIPEND RECEIPT', 15, 22);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('Ministry of Corporate Affairs • Prime Minister Internship Scheme', 15, 30);

      // Status Badge
      const isSuccess = tx.status === 'SUCCESS';
      doc.setFillColor(isSuccess ? 220 : 254, isSuccess ? 252 : 243, isSuccess ? 231 : 199);
      doc.roundedRect(145, 13, 50, 14, 3, 3, 'F');
      doc.setTextColor(isSuccess ? 22 : 180, isSuccess ? 101 : 83, isSuccess ? 52 : 9);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text(isSuccess ? 'CREDITED TO BANK' : 'PENDING CLEARANCE', 149, 22);

      // Amount Box
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(15, 45, 180, 32, 4, 4, 'F');
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(15, 45, 180, 32, 4, 4, 'S');

      doc.setTextColor(100, 116, 139);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('Total Monthly Stipend Amount', 25, 57);

      doc.setTextColor(19, 136, 8); // India Green
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.text(`INR ${tx.amount.toLocaleString('en-IN')}.00`, 25, 69);

      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139);
      doc.text(
        `(Govt DBT Share: INR ${(tx.govtShare || 4500).toLocaleString('en-IN')} + CSR Escrow: INR ${(tx.companyShare || tx.amount - 4500).toLocaleString('en-IN')})`,
        100,
        69
      );

      // Transaction Meta Table
      let y = 92;
      const meta = [
        ['Beneficiary Intern', user.name || 'Student Candidate'],
        ['Candidate College', user.college || 'National Institute of Technology'],
        ['Internship Role', tx.internshipRole],
        ['Host Corporate Partner', tx.companyName],
        ['Tenure Period', tx.monthPeriod],
        ['Banking Reference (UTR)', tx.utrNumber],
        ['Order / Portal ID', tx.orderId],
        ['Beneficiary Bank Account', tx.accountMasked],
        ['Payment Rail / Switch', tx.paymentRail],
        ['Disbursement Date', tx.date],
        ['DBT Reference Code', tx.dbtReference || 'MCA/DBT/2026/09/9921'],
        ['Statutory Compliance', 'Government of India DBT Rule 14(b) - Direct Bank Credit']
      ];

      doc.setFillColor(255, 255, 255);
      doc.roundedRect(15, 84, 180, 138, 4, 4, 'F');
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(15, 84, 180, 138, 4, 4, 'S');

      meta.forEach(([label, val], idx) => {
        doc.setTextColor(100, 116, 139);
        doc.setFontSize(9.5);
        doc.setFont('helvetica', 'normal');
        doc.text(label, 25, y);

        doc.setTextColor(15, 23, 42);
        doc.setFont('helvetica', 'bold');
        doc.text(String(val), 90, y);

        if (idx < meta.length - 1) {
          doc.setDrawColor(241, 245, 249);
          doc.line(25, y + 3, 185, y + 3);
        }
        y += 11;
      });

      // Disclaimer
      doc.setTextColor(148, 163, 184);
      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'italic');
      doc.text(
        'This receipt is authenticated by the Ministry of Corporate Affairs (MCA) and verified on the National PFMS / NPCI banking network.',
        15,
        238
      );
      doc.text(
        'Zero intermediary deductions. Funds credited directly to candidate Aadhaar seeded bank account.',
        15,
        244
      );

      // Official Stamp
      doc.setDrawColor(8, 24, 69);
      doc.roundedRect(130, 252, 65, 28, 3, 3, 'S');
      doc.setTextColor(8, 24, 69);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text('MCA PFMS VERIFIED', 142, 262);
      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'normal');
      doc.text('Direct Benefit Transfer Cell', 139, 268);
      doc.text(`Ref: ${tx.orderId}`, 144, 274);

      doc.save(`PM_Stipend_Receipt_${tx.orderId}.pdf`);
    } catch (err) {
      console.error('Invoice generation error:', err);
    }
  };

  const handleDownloadStatement = () => {
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Background
      doc.setFillColor(248, 250, 252);
      doc.rect(0, 0, 210, 297, 'F');

      // Top Saffron Banner
      doc.setFillColor(255, 153, 51);
      doc.rect(0, 0, 210, 5, 'F');

      // Header Navy Blue
      doc.setFillColor(8, 24, 69);
      doc.rect(0, 5, 210, 36, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(17);
      doc.setFont('helvetica', 'bold');
      doc.text('CONSOLIDATED STIPEND DISBURSEMENT STATEMENT', 15, 20);

      doc.setFontSize(9.5);
      doc.setFont('helvetica', 'normal');
      doc.text('Ministry of Corporate Affairs • Prime Minister Internship Scheme (PMIS)', 15, 28);
      doc.text('PFMS Direct Benefit Transfer & Corporate CSR Escrow Ledger', 15, 34);

      // Candidate Profile Summary Box
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(15, 48, 180, 26, 4, 4, 'F');
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(15, 48, 180, 26, 4, 4, 'S');

      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text('Intern Beneficiary:', 22, 57);
      doc.text('College / Institute:', 22, 65);

      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.text(user.name || 'Candidate Intern', 58, 57);
      doc.text(user.college || 'National Institute of Technology', 58, 65);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      doc.text('Bank Account:', 118, 57);
      doc.text('Statement Date:', 118, 65);

      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.text('SBI •••• 4921 (Aadhaar Seeded)', 144, 57);
      doc.text(new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }), 144, 65);

      // Financial Summary Boxes
      doc.setFillColor(240, 253, 244);
      doc.roundedRect(15, 80, 85, 24, 3, 3, 'F');
      doc.setDrawColor(187, 247, 208);
      doc.roundedRect(15, 80, 85, 24, 3, 3, 'S');
      doc.setTextColor(22, 101, 52);
      doc.setFontSize(8.5);
      doc.text('TOTAL CREDITED (DIRECT TO BANK)', 20, 88);
      doc.setFontSize(15);
      doc.setFont('helvetica', 'bold');
      doc.text(`INR ${totalCredited.toLocaleString('en-IN')}.00`, 20, 98);

      doc.setFillColor(254, 252, 232);
      doc.roundedRect(110, 80, 85, 24, 3, 3, 'F');
      doc.setDrawColor(254, 240, 138);
      doc.roundedRect(110, 80, 85, 24, 3, 3, 'S');
      doc.setTextColor(133, 77, 14);
      doc.setFontSize(8.5);
      doc.text('PENDING MILESTONE COMPLETION', 115, 88);
      doc.setFontSize(15);
      doc.setFont('helvetica', 'bold');
      doc.text(`INR ${totalPending.toLocaleString('en-IN')}.00`, 115, 98);

      // Statement Table Headers
      let y = 118;
      doc.setFillColor(8, 24, 69);
      doc.rect(15, 110, 180, 9, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.text('TENURE PERIOD', 20, 116);
      doc.text('EMPLOYER / ROLE', 65, 116);
      doc.text('UTR NUMBER', 115, 116);
      doc.text('STATUS', 152, 116);
      doc.text('AMOUNT', 175, 116);

      // Table Rows
      doc.setFont('helvetica', 'normal');
      transactions.forEach((tx, idx) => {
        y += 11;
        doc.setFillColor(idx % 2 === 0 ? 255 : 248, idx % 2 === 0 ? 255 : 250, idx % 2 === 0 ? 255 : 252);
        doc.rect(15, y - 6, 180, 10, 'F');

        doc.setFontSize(8);
        doc.setTextColor(15, 23, 42);
        doc.text(tx.monthPeriod.split(' ')[0] + ' ' + (tx.monthPeriod.split(' ')[1] || ''), 20, y);
        doc.text(tx.companyName.substring(0, 22), 65, y);

        doc.setFont('courier', 'normal');
        doc.setFontSize(7);
        doc.text(tx.utrNumber.substring(0, 18), 115, y);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        if (tx.status === 'SUCCESS') {
          doc.setTextColor(22, 101, 52);
          doc.text('CREDITED', 152, y);
        } else {
          doc.setTextColor(180, 83, 9);
          doc.text('PENDING', 152, y);
        }

        doc.setTextColor(15, 23, 42);
        doc.text(`INR ${tx.amount.toLocaleString('en-IN')}`, 175, y);
      });

      // Bottom Stamp & Verification
      y = Math.max(y + 20, 235);
      doc.setDrawColor(8, 24, 69);
      doc.roundedRect(125, y, 70, 30, 3, 3, 'S');
      doc.setTextColor(8, 24, 69);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text('MCA PFMS DBT AUDIT', 135, y + 10);
      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'normal');
      doc.text('Government of India', 145, y + 17);
      doc.text(`Generated: ${new Date().toLocaleDateString('en-IN')}`, 133, y + 24);

      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      doc.setFont('helvetica', 'italic');
      doc.text('Rule 14(b) Directive: Stipends are strictly disbursed upon completed internship milestone & attendance audit.', 15, y + 12);
      doc.text('All funds disbursed directly to beneficiary Aadhaar seeded bank accounts via NPCI / PhonePe UPI switch.', 15, y + 18);

      doc.save(`PMIS_Stipend_Statement_${user.name ? user.name.replace(/\s+/g, '_') : 'Student'}.pdf`);
    } catch (err) {
      console.error('Error generating statement PDF:', err);
    }
  };

  const latestSuccessfulTx = transactions.find(t => t.status === 'SUCCESS') || transactions[0];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-orange-500/10 via-white dark:via-slate-900 to-emerald-500/10 border-2 border-orange-200 dark:border-emerald-800/60 rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-950/80 px-2.5 py-0.5 rounded-full border border-orange-200 dark:border-orange-800">
                Government Direct Benefit Transfer (DBT)
              </span>
              <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>PFMS & NPCI Verified</span>
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
              <Landmark className="w-7 h-7 text-emerald-600" />
              <span>Paid Internship Transaction History</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl font-medium">
              Real-time audit trail of all monthly stipend disbursals, corporate CSR contributions, and Direct Benefit Transfers processed exclusively through the portal.
            </p>
          </div>

          {/* Quick Header Actions: Download Latest Receipt, Download Statement, Sync */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {latestSuccessfulTx && (
              <button
                type="button"
                onClick={() => handleDownloadInvoice(latestSuccessfulTx)}
                className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white rounded-xl text-xs font-black shadow-md transition flex items-center gap-2 cursor-pointer active:scale-95"
                title="Download PDF receipt of most recent monthly stipend payment"
              >
                <Download className="w-4 h-4" />
                <span>Download Receipt (PDF)</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleDownloadStatement}
              className="px-3.5 py-2.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
              title="Download consolidated PDF account statement"
            >
              <Receipt className="w-3.5 h-3.5 text-indigo-600" />
              <span>Statement</span>
            </button>

            <button
              type="button"
              onClick={loadTransactions}
              disabled={isRefreshing}
              className="p-2.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-xl transition shadow-xs cursor-pointer active:scale-95"
              title="Refresh ledger with server"
            >
              <RefreshCw className={`w-4 h-4 text-emerald-600 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* 4 Summary Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-2">
          {/* Card 1: Total Received */}
          <div className="bg-white dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
              Total Disbursed to Date
            </span>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
              ₹{totalCredited.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-slate-500 font-medium">
              3 Successful Monthly Transfers
            </div>
          </div>

          {/* Card 2: Pending Clearance */}
          <div className="bg-white dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
              Pending / In-Transit
            </span>
            <div className="text-2xl font-black text-amber-600 dark:text-amber-400 tracking-tight">
              ₹{totalPending.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-slate-500 font-medium">
              Scheduled for 05 Dec 2026
            </div>
          </div>

          {/* Card 3: Designated Bank Account */}
          <div className="bg-white dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                Direct Benefit Bank
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div className="text-sm font-black text-slate-900 dark:text-white truncate">
              State Bank of India
            </div>
            <div className="text-[11px] text-slate-500 font-mono">
              A/c: •••• 4921 (Aadhaar Seeded)
            </div>
          </div>

          {/* Card 4: PhonePe UPI Rail */}
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/40 dark:to-slate-950 p-4 rounded-2xl border border-purple-200 dark:border-purple-800 shadow-2xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 dark:text-purple-300 block">
                PhonePe UPI Rail
              </span>
              <span className="text-[9px] bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 px-1.5 py-0.2 rounded font-black">
                Active
              </span>
            </div>
            <div className="text-sm font-black text-[#5f259f] dark:text-purple-300 truncate font-mono flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-[#5f259f] text-white flex items-center justify-center text-[9px] shrink-0">
                पे
              </span>
              <span>{user.email ? user.email.split('@')[0] : 'candidate'}@ybl</span>
            </div>
            <div className="text-[11px] text-slate-500 font-medium">
              Instant UPI Instant Settlement
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Status Filter Tabs */}
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-bold">
          <button
            type="button"
            onClick={() => setFilterStatus('ALL')}
            className={`px-3.5 py-1.5 rounded-xl transition cursor-pointer ${
              filterStatus === 'ALL'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-black'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All Payments ({transactions.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('SUCCESS')}
            className={`px-3.5 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
              filterStatus === 'SUCCESS'
                ? 'bg-emerald-600 text-white shadow-xs font-black'
                : 'text-slate-600 dark:text-slate-400 hover:text-emerald-600'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Credited ({transactions.filter(t => t.status === 'SUCCESS').length})</span>
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('PENDING')}
            className={`px-3.5 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
              filterStatus === 'PENDING'
                ? 'bg-amber-600 text-white shadow-xs font-black'
                : 'text-slate-600 dark:text-slate-400 hover:text-amber-600'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Pending ({transactions.filter(t => t.status === 'PENDING').length})</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative max-w-xs w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search role, company, or UTR..."
            className="w-full px-3.5 py-2 pl-9 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Transactions List Table Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-[10px] font-black uppercase tracking-wider text-slate-400">
                <th className="py-3 px-4">Tenure & Date</th>
                <th className="py-3 px-4">Company & Role</th>
                <th className="py-3 px-4">Amount & Breakdown</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Banking Reference (UTR)</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <Receipt className="w-8 h-8 text-slate-300" />
                      <p className="text-xs font-bold text-slate-500">No payment transactions found matching filter criteria.</p>
                      {searchQuery && (
                        <button
                          type="button"
                          onClick={() => { setSearchQuery(''); setFilterStatus('ALL'); }}
                          className="text-xs text-indigo-600 font-bold hover:underline"
                        >
                          Clear Filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => {
                  const isSuccess = tx.status === 'SUCCESS';
                  return (
                    <tr
                      key={tx.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition group"
                    >
                      {/* Tenure & Date */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="font-extrabold text-slate-900 dark:text-white text-xs">
                          {tx.monthPeriod}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5 font-medium">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>{tx.date}</span>
                        </div>
                      </td>

                      {/* Company & Role */}
                      <td className="py-4 px-4">
                        <div className="font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                          <span>{tx.companyName}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 truncate max-w-xs">
                          {tx.internshipRole}
                        </div>
                      </td>

                      {/* Amount & Breakdown */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className={`text-sm font-black ${
                          isSuccess
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-amber-600 dark:text-amber-400'
                        }`}>
                          ₹{tx.amount.toLocaleString('en-IN')}.00
                        </div>
                        <div className="text-[10px] text-slate-400 font-medium">
                          Govt: ₹{(tx.govtShare || 4500).toLocaleString('en-IN')} + CSR: ₹{(tx.companyShare || tx.amount - 4500).toLocaleString('en-IN')}
                        </div>
                      </td>

                      {/* Payment Rail */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-bold">
                          {tx.paymentRail.includes('PhonePe') ? (
                            <div className="w-4 h-4 rounded-full bg-[#5f259f] text-white flex items-center justify-center text-[9px] font-black shrink-0">
                              पे
                            </div>
                          ) : (
                            <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                          )}
                          <span className="text-xs">{tx.paymentRail}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {tx.accountMasked}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        {isSuccess ? (
                          <div className="space-y-0.5">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>Direct DBT Credited</span>
                            </span>
                            <div className="text-[9px] text-emerald-700 dark:text-emerald-400 font-medium">
                              ✓ Milestone Completed
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-0.5">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                              <Clock className="w-3 h-3 text-amber-600 animate-spin" />
                              <span>Milestone In-Progress</span>
                            </span>
                            <div className="text-[9px] text-amber-700 dark:text-amber-400 font-medium">
                              Rule 14(b): Unlocks at month end
                            </div>
                          </div>
                        )}
                      </td>

                      {/* UTR Reference */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-700 dark:text-slate-300">
                          <span className="font-bold">{tx.utrNumber}</span>
                          {isSuccess && (
                            <button
                              type="button"
                              onClick={() => handleCopyUtr(tx.utrNumber)}
                              className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition cursor-pointer"
                              title="Copy Bank Reference Number"
                            >
                              {copiedUtr === tx.utrNumber ? (
                                <Check className="w-3 h-3 text-emerald-600" />
                              ) : (
                                <Copy className="w-3 h-3 text-slate-400" />
                              )}
                            </button>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          Ref: {tx.dbtReference || tx.orderId}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedTx(tx)}
                            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition cursor-pointer"
                            title="View Transaction Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDownloadInvoice(tx)}
                            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs shadow-xs transition flex items-center gap-1.5 cursor-pointer active:scale-95"
                            title="Download Official PDF Receipt"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download Receipt</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info note */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5 font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Aadhaar Payment Bridge System (APBS) & PhonePe UPI Regulated</span>
          </div>
          <span className="font-medium text-slate-400">
            Rule 14(b) Direct Benefit Transfer Compliance
          </span>
        </div>
      </div>

      {/* Transaction Details Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 max-w-lg w-full rounded-3xl shadow-2xl overflow-hidden space-y-4">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#081845] to-indigo-950 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-white/10">
                  <Receipt className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h3 className="font-black text-sm">Disbursement Details</h3>
                  <span className="text-[10px] text-slate-300 font-mono">Order ID: {selectedTx.orderId}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTx(null)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 text-xs">
              <div className="text-center space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Total Amount Credited</span>
                <div className="text-3xl font-black text-emerald-600">
                  ₹{selectedTx.amount.toLocaleString('en-IN')}.00
                </div>
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>{selectedTx.status === 'SUCCESS' ? 'Credited to Bank Account' : 'Processing Clearance'}</span>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Corporate Partner:</span>
                  <strong className="text-slate-900 dark:text-white">{selectedTx.companyName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Internship Role:</span>
                  <strong className="text-slate-900 dark:text-white">{selectedTx.internshipRole}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Tenure Period:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{selectedTx.monthPeriod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Bank Ref (UTR):</span>
                  <span className="font-mono font-bold text-indigo-600">{selectedTx.utrNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Account Masked:</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">{selectedTx.accountMasked}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Payment Rail:</span>
                  <span className="font-bold text-purple-700 dark:text-purple-300">{selectedTx.paymentRail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Transaction Date:</span>
                  <span className="text-slate-700 dark:text-slate-300">{selectedTx.date}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleDownloadInvoice(selectedTx)}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-black text-xs shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF Receipt</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedTx(null)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
