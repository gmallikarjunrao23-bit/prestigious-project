"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Shield, CheckCircle, XCircle, Loader2, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface Payment {
  id: string;
  userId: string;
  user: { name: string | null; email: string };
  amount: number;
  plan: string;
  status: string;
  screenshotUrl: string | null;
  createdAt: string;
}

export default function AdminPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchPayments(); }, []);

  const fetchPayments = async () => {
    try {
      const res = await fetch("/api/admin/payments");
      const data = await res.json();
      setPayments(data.payments || []);
    } catch {
      toast({ variant: "destructive", title: "Failed to load payments" });
    } finally {
      setLoading(false);
    }
  };

  const verifyPayment = async (id: string, status: "VERIFIED" | "REJECTED") => {
    try {
      const res = await fetch("/api/admin/payments", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId: id, status }),
      });

      if (res.ok) {
        toast({
          variant: "success",
          title: status === "VERIFIED" ? "Payment verified" : "Payment rejected",
        });
        fetchPayments();
      }
    } catch {
      toast({ variant: "destructive", title: "Action failed" });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Shield className="w-8 h-8 text-purple-400" />
        <div>
          <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
          <p className="text-slate-400">Manage payments and verifications</p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-slate-800 bg-slate-900/50 overflow-hidden"
      >
        <div className="p-5 border-b border-slate-800">
          <h2 className="text-lg font-semibold text-white">Payment Verifications</h2>
          <p className="text-sm text-slate-500">Review and verify UPI payment screenshots</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left p-4 text-xs font-medium text-slate-500 uppercase">User</th>
                <th className="text-left p-4 text-xs font-medium text-slate-500 uppercase">Amount</th>
                <th className="text-left p-4 text-xs font-medium text-slate-500 uppercase">Plan</th>
                <th className="text-left p-4 text-xs font-medium text-slate-500 uppercase">Status</th>
                <th className="text-left p-4 text-xs font-medium text-slate-500 uppercase">Screenshot</th>
                <th className="text-left p-4 text-xs font-medium text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    No pending payments
                  </td>
                </tr>
              ) : (
                payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-slate-800/30">
                    <td className="p-4">
                      <p className="text-sm text-white font-medium">{payment.user.name || "Unknown"}</p>
                      <p className="text-xs text-slate-500">{payment.user.email}</p>
                    </td>
                    <td className="p-4 text-sm text-white">₹{payment.amount}</td>
                    <td className="p-4">
                      <span className="text-xs px-2 py-1 rounded-full bg-purple-500/10 text-purple-400 font-medium">
                        {payment.plan}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        payment.status === "PENDING" ? "bg-amber-500/10 text-amber-400" :
                        payment.status === "VERIFIED" ? "bg-emerald-500/10 text-emerald-400" :
                        "bg-red-500/10 text-red-400"
                      }`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="p-4">
                      {payment.screenshotUrl ? (
                        <a
                          href={payment.screenshotUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300"
                        >
                          <ImageIcon className="w-4 h-4" />
                          View
                        </a>
                      ) : (
                        <span className="text-xs text-slate-600">No screenshot</span>
                      )}
                    </td>
                    <td className="p-4">
                      {payment.status === "PENDING" && (
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            onClick={() => verifyPayment(payment.id, "VERIFIED")}
                            className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 h-8"
                          >
                            <CheckCircle className="w-3.5 h-3.5 mr-1" />
                            Verify
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => verifyPayment(payment.id, "REJECTED")}
                            className="text-red-400 hover:bg-red-500/20 h-8"
                          >
                            <XCircle className="w-3.5 h-3.5 mr-1" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}

