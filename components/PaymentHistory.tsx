'use client';

import { MdPayment, MdReceipt, MdCheckCircle, MdAccessTime, MdSmartphone, MdAccountBalanceWallet } from 'react-icons/md';

interface PaymentHistoryProps {
  payments: any[];
}

export default function PaymentHistory({ payments }: PaymentHistoryProps) {
  const getMethodIcon = (method: string) => {
    const m = method.toLowerCase();
    if (m.includes('bkash')) return <MdSmartphone className="text-[#D12053]" />;
    if (m.includes('nagad')) return <MdAccountBalanceWallet className="text-[#F7941D]" />;
    return <MdPayment className="text-primary" />;
  };

  if (!payments || payments.length === 0) {
    return (
      <div className="bg-surface-container-lowest rounded-xl p-xl shadow-elevation-1 border border-outline-variant/30 text-center">
        <div className="w-16 h-16 bg-surface-container-low rounded-full flex items-center justify-center mx-auto mb-md">
          <MdReceipt size={32} className="text-on-surface-variant/40" />
        </div>
        <h3 className="font-h3 text-on-surface">No Payment History</h3>
        <p className="font-body-md text-on-surface-variant mt-sm">Transactions will appear here after you book appointments.</p>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-lowest rounded-xl p-lg shadow-elevation-1 border border-outline-variant/30">
      <div className="flex items-center justify-between mb-lg">
        <h3 className="font-h3 text-h3 text-primary flex items-center gap-sm">
          Payment History
        </h3>
        <span className="px-sm py-xs bg-surface-container rounded-lg text-on-surface-variant text-[14px] font-bold">
          {payments.length} Transactions
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-outline-variant/30 text-on-surface-variant font-label-sm uppercase tracking-wider">
              <th className="pb-md font-bold">Details</th>
              <th className="pb-md font-bold">Method</th>
              <th className="pb-md font-bold">Date</th>
              <th className="pb-md font-bold">Status</th>
              <th className="pb-md font-bold text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10">
            {payments.map((payment) => (
              <tr key={payment.id} className="group hover:bg-surface-container-low/50 transition-colors">
                <td className="py-lg">
                  <div className="flex flex-col">
                    <span className="font-body-md font-bold text-on-surface">Transaction ID</span>
                    <span className="font-caption text-on-surface-variant font-mono">{payment.transactionId}</span>
                  </div>
                </td>
                <td className="py-lg">
                  <div className="flex items-center gap-sm font-label-md text-on-surface">
                    {getMethodIcon(payment.method)}
                    {payment.method}
                  </div>
                </td>
                <td className="py-lg">
                  <div className="flex flex-col">
                    <span className="font-body-sm text-on-surface">
                      {new Date(payment.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="font-caption text-on-surface-variant flex items-center gap-1">
                      <MdAccessTime size={12} />
                      {new Date(payment.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </td>
                <td className="py-lg">
                  <span className={`inline-flex items-center gap-1 px-md py-1 rounded-full text-[12px] font-bold ${
                    payment.status === 'Success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {payment.status === 'Success' && <MdCheckCircle size={14} />}
                    {payment.status}
                  </span>
                </td>
                <td className="py-lg text-right">
                  <span className="font-h3 text-h3 text-secondary">৳ {payment.amount}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
