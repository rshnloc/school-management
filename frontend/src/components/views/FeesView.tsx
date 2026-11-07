import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { FeeInvoice } from '../../types';
import { CreditCard, CheckCircle2, Clock, DollarSign, Filter, Receipt, ArrowRight } from 'lucide-react';

export const FeesView: React.FC = () => {
  const [invoices, setInvoices] = useState<FeeInvoice[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [loading, setLoading] = useState<boolean>(true);
  const [payingId, setPayingId] = useState<number | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchFees = async () => {
    try {
      setLoading(true);
      const data = await api.getFees(undefined, filterStatus !== 'All' ? filterStatus : undefined);
      setInvoices(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFees();
  }, [filterStatus]);

  const handlePay = async (invoiceId: number) => {
    setPayingId(invoiceId);
    try {
      await api.payFee(invoiceId, 'Simulated Electronic Clearing (Demo)');
      await fetchFees();
      setSuccessMsg('Electronic fee transaction cleared successfully (Demo Mode).');
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setPayingId(null);
    }
  };

  const totalCollected = invoices
    .filter((i) => i.status === 'Paid')
    .reduce((sum, i) => sum + i.amount, 0);

  const totalPending = invoices
    .filter((i) => i.status !== 'Paid')
    .reduce((sum, i) => sum + i.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center space-x-2">
            <CreditCard className="w-5 h-5 text-emerald-600" />
            <span>Tuition Invoicing & Bursar Ledger</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Student fee schedules, tuition installments, and demo electronic payment reconciliations.
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium px-4 py-3 rounded-xl flex items-center space-x-2 shadow-sm animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Total Collected</span>
            <span className="text-2xl font-black text-emerald-600 block mt-1">
              ${totalCollected.toLocaleString()}
            </span>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Outstanding Receivable</span>
            <span className="text-2xl font-black text-amber-600 block mt-1">
              ${totalPending.toLocaleString()}
            </span>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Total Invoices</span>
            <span className="text-2xl font-black text-slate-900 block mt-1">{invoices.length}</span>
          </div>
          <div className="p-3 bg-slate-100 text-slate-600 rounded-xl">
            <Receipt className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-2">
        <span className="text-xs font-semibold text-slate-400 px-2 flex items-center">
          <Filter className="w-3.5 h-3.5 mr-1" /> Status:
        </span>
        {['All', 'Pending', 'Paid'].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterStatus === st ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Invoices List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Settlement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoices.map((inv) => {
                const isPaid = inv.status === 'Paid';
                return (
                  <tr key={inv.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-xs font-bold text-slate-700">
                      {inv.invoice_number}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-xs text-slate-900">
                      {inv.student_name}
                    </td>
                    <td className="py-3.5 px-4 text-xs font-medium text-slate-700">{inv.title}</td>
                    <td className="py-3.5 px-4 font-black text-xs text-slate-900">
                      ${inv.amount.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-500 font-mono">{inv.due_date}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          isPaid
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {isPaid ? (
                        <span className="text-[11px] text-slate-400 font-medium">
                          Paid on {inv.paid_date?.split(' ')[0]}
                        </span>
                      ) : (
                        <button
                          onClick={() => handlePay(inv.id)}
                          disabled={payingId === inv.id}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs transition-all active:scale-95 disabled:opacity-50"
                        >
                          {payingId === inv.id ? 'Processing...' : 'Pay Now (Demo)'}
                        </button>
                      )}
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
};

