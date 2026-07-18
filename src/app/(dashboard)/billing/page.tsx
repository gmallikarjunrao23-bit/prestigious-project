"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, Check, Zap, Shield, Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const plans = [
  {
    name: "Free",
    price: "₹0",
    period: "forever",
    description: "Perfect for personal projects and small teams",
    features: [
      "5 monitors",
      "1-minute checks",
      "Email alerts",
      "7-day data retention",
      "Basic analytics",
    ],
    cta: "Current Plan",
    popular: false,
    disabled: true,
  },
  {
    name: "Pro",
    price: "₹999",
    period: "/month",
    description: "For growing teams that need more power",
    features: [
      "50 monitors",
      "30-second checks",
      "Email, Discord, Slack alerts",
      "90-day data retention",
      "Advanced analytics & AI insights",
      "Team collaboration",
      "Status pages",
      "SSL monitoring",
    ],
    cta: "Upgrade to Pro",
    popular: true,
    disabled: false,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For large organizations with custom needs",
    features: [
      "Unlimited monitors",
      "10-second checks",
      "All notification channels",
      "1-year data retention",
      "Custom integrations",
      "Dedicated support",
      "SLA guarantee",
      "On-premise option",
    ],
    cta: "Contact Sales",
    popular: false,
    disabled: false,
  },
];

export default function BillingPage() {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handleUpgrade = async (planName: string) => {
    if (planName === "Enterprise") {
      toast({ title: "Contact Sales", description: "Please email us at enterprise@infraops.dev" });
      return;
    }
    setSelectedPlan(planName);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("screenshot", file);
    formData.append("plan", selectedPlan || "PRO");
    formData.append("amount", "999");

    try {
      const res = await fetch("/api/billing/verify", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        toast({
          variant: "success",
          title: "Payment verification submitted",
          description: "Our team will verify your UPI payment within 24 hours.",
        });
        setSelectedPlan(null);
      } else {
        throw new Error("Upload failed");
      }
    } catch {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "Please try again or contact support.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Billing</h1>
        <p className="text-slate-400 mt-1">Manage your subscription and payments</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`relative rounded-2xl border p-6 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] ${
              plan.popular
                ? "bg-gradient-to-b from-purple-500/10 to-blue-500/10 border-purple-500/30 shadow-lg shadow-purple-500/10"
                : "bg-slate-900/50 border-slate-800 hover:border-slate-700"
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  MOST POPULAR
                </span>
              </div>
            )}

            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
              <div className="mt-2 flex items-baseline justify-center gap-1">
                <span className="text-4xl font-bold text-white">{plan.price}</span>
                <span className="text-slate-500">{plan.period}</span>
              </div>
              <p className="text-sm text-slate-500 mt-2">{plan.description}</p>
            </div>

            <ul className="space-y-3 mb-6">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm text-slate-300">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>

            <Button
              onClick={() => handleUpgrade(plan.name)}
              disabled={plan.disabled || isUploading}
              className={`w-full ${
                plan.popular
                  ? "bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white"
                  : plan.disabled
                  ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                  : "bg-slate-800 text-white hover:bg-slate-700"
              }`}
            >
              {plan.cta}
            </Button>
          </motion.div>
        ))}
      </div>

      {selectedPlan && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-purple-500/30 bg-purple-500/5 p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-2">Complete Payment</h3>
          <p className="text-sm text-slate-400 mb-4">
            Pay <strong className="text-white">₹999</strong> to UPI ID: <code className="bg-slate-800 px-2 py-1 rounded text-emerald-400 font-mono">toxic-karthik.sai@fam</code>
          </p>
          <p className="text-sm text-slate-400 mb-4">
            After payment, upload the screenshot below for verification.
          </p>
          <div className="flex items-center gap-4">
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-700 hover:border-purple-500 transition-colors text-white text-sm">
                {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                {isUploading ? "Uploading..." : "Upload Screenshot"}
              </div>
            </label>
            <Button variant="ghost" onClick={() => setSelectedPlan(null)} className="text-slate-400">
              Cancel
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

