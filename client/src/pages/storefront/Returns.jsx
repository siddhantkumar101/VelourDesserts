import React from 'react';
import { RefreshCw, ShieldAlert, CheckCircle, HelpCircle } from 'lucide-react';

const Returns = () => {
  const points = [
    {
      icon: <ShieldAlert className="w-8 h-8 text-rose" />,
      title: 'Bespoke Cancellation Policy',
      description: 'Because our cakes, tarts, and pastries are custom-baked from scratch to order, cancellations or order modifications are accepted up to 48 hours prior to your scheduled delivery or pickup slot.'
    },
    {
      icon: <RefreshCw className="w-8 h-8 text-rose" />,
      title: 'Refund Structure & Store Credit',
      description: 'Cancellations made 48 hours in advance will receive a 100% refund or equivalent store credit. For cancellations within the 48-hour window, refunds cannot be processed as ingredients and customized decorations are already prepared.'
    },
    {
      icon: <CheckCircle className="w-8 h-8 text-rose" />,
      title: 'Freshness Guarantee & Discrepancies',
      description: 'In the extremely rare event that your order arrives damaged during transit or has incorrect structural variants, contact our support desk immediately with pictures. We will replace the item or issue a complete refund.'
    }
  ];

  return (
    <div className="w-full bg-cream min-h-screen py-16 px-4 sm:px-6 lg:px-8 page-transition">
      <div className="max-w-5xl mx-auto flex flex-col gap-12">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto flex flex-col gap-4">
          <span className="text-xs font-semibold uppercase tracking-widest text-rose flex items-center justify-center gap-1">
            <RefreshCw className="w-4 h-4" /> Returns & Cancellations
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-chocolate">
            Returns & Cancellations Policy
          </h1>
          <p className="font-serif text-chocolate/75 leading-relaxed">
            Everything you need to know about modifying your orders, cancellation lead times, fresh delivery assurances, and store credit protocols.
          </p>
        </div>

        {/* Dynamic Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {points.map((point, idx) => (
            <div 
              key={idx} 
              className="bg-white p-6 md:p-8 rounded-3xl border border-chocolate/5 hover-lift hover-glow flex flex-col gap-4"
            >
              <div className="p-4 bg-rose/10 rounded-2xl shrink-0 w-fit">
                {point.icon}
              </div>
              <h3 className="font-serif text-xl font-bold text-chocolate leading-tight">{point.title}</h3>
              <p className="text-sm text-chocolate/70 leading-relaxed font-serif text-base">{point.description}</p>
            </div>
          ))}
        </div>

        {/* Need Help Column */}
        <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-chocolate/5 flex flex-col md:flex-row justify-between items-center gap-6 mt-6 hover-glow transition-all duration-300">
          <div className="flex gap-4 items-start">
            <div className="p-3 bg-rose/10 rounded-xl shrink-0 mt-1">
              <HelpCircle className="w-6 h-6 text-rose" />
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="font-serif text-xl font-bold text-chocolate">Have a direct discrepancy to report?</h3>
              <p className="text-sm text-chocolate/70 max-w-xl">
                Our customer satisfaction desk is fully dedicated to resolving order queries. You can connect with our pastry consultants instantly on email or phone.
              </p>
            </div>
          </div>
          <a href="/contact" className="shrink-0 w-full md:w-auto text-center">
            <button className="bg-chocolate text-cream hover:bg-rose hover:text-white px-6 py-3 rounded-xl font-medium transition-colors w-full md:w-auto shadow-sm">
              Connect to Support
            </button>
          </a>
        </div>

      </div>
    </div>
  );
};

export default Returns;
