import React from 'react';
import { Truck, ShieldCheck, ThermometerSnowflake, Clock } from 'lucide-react';

const Shipping = () => {
  const steps = [
    {
      icon: <Clock className="w-8 h-8 text-rose" />,
      title: '1. Handcrafted to Order',
      description: 'We do not freeze our pastries. Every dessert is baked from scratch and compiled by hand just hours before dispatch.'
    },
    {
      icon: <ThermometerSnowflake className="w-8 h-8 text-rose" />,
      title: '2. Cold-Chain Chilled Transit',
      description: 'Your desserts are placed in insulated, chilled transit pods inside our custom-fitted delivery fleet to keep creams and glaze perfectly intact.'
    },
    {
      icon: <Truck className="w-8 h-8 text-rose" />,
      title: '3. Hand-delivered Freshness',
      description: 'Our professional handlers travel carefully over bumps to hand over the treats directly to you. No curbside dropping.'
    }
  ];

  return (
    <div className="w-full bg-cream min-h-screen py-16 px-4 sm:px-6 lg:px-8 page-transition">
      <div className="max-w-5xl mx-auto flex flex-col gap-16">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto flex flex-col gap-4">
          <span className="text-xs font-semibold uppercase tracking-widest text-rose flex items-center justify-center gap-1">
            <Truck className="w-4 h-4" /> Freshness Guaranteed
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-chocolate">
            Shipping & Delivery Care
          </h1>
          <p className="font-serif text-chocolate/75 leading-relaxed">
            Discover how we manage to deliver fragile, fresh, and beautiful artisanal pastries across metropolitan areas in pristine condition.
          </p>
        </div>

        {/* Milestones Flow */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector Line for Desktop */}
          <div className="hidden md:block absolute top-[52px] left-[15%] right-[15%] h-[2px] bg-rose/25 z-0" />
          
          {steps.map((step, idx) => (
            <div 
              key={idx} 
              className="bg-white p-6 md:p-8 rounded-3xl border border-chocolate/5 hover-lift hover-glow flex flex-col items-center text-center gap-4 relative z-10"
            >
              <div className="p-4 bg-rose/10 rounded-2xl shrink-0 shadow-sm">
                {step.icon}
              </div>
              <h3 className="font-serif text-xl font-bold text-chocolate mt-2">{step.title}</h3>
              <p className="text-sm text-chocolate/70 leading-relaxed font-serif text-base">{step.description}</p>
            </div>
          ))}
        </div>

        {/* Dynamic Detail Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch mt-6">
          
          {/* Left Details: Zones & Fee */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-chocolate/5 flex flex-col gap-6 hover-glow transition-all duration-300">
            <h2 className="font-serif text-2xl font-bold text-chocolate flex items-center gap-2 border-b border-chocolate/5 pb-2">
              <ShieldCheck className="w-6 h-6 text-rose" /> Coverage Areas & Rates
            </h2>
            <div className="flex flex-col gap-4 text-chocolate/85">
              <p className="text-sm leading-relaxed">
                We currently service a **40km radius** around our central baking studio. This includes all prime downtown sectors, suburban pockets, and commercial zones.
              </p>
              <div className="bg-cream/40 p-4 rounded-xl flex items-center justify-between border border-chocolate/5">
                <span className="font-semibold text-sm">Flat Delivery Rate</span>
                <span className="font-display text-2xl font-bold text-rose">₹100</span>
              </div>
              <p className="text-xs text-chocolate/50">
                * Note: Delivery slots are allocated on a first-come, first-served basis. We recommend booking at least 3-4 days in advance for weekend slots.
              </p>
            </div>
          </div>

          {/* Right Details: Handling Tips */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-chocolate/5 flex flex-col gap-6 hover-glow transition-all duration-300">
            <h2 className="font-serif text-2xl font-bold text-chocolate flex items-center gap-2 border-b border-chocolate/5 pb-2">
              <ThermometerSnowflake className="w-6 h-6 text-rose" /> Upon Handoff Care
            </h2>
            <div className="flex flex-col gap-4 text-chocolate/85">
              <p className="text-sm leading-relaxed">
                Artisan entremets are highly temperature-sensitive. To maintain their glossy mirror finish and structural balance:
              </p>
              <ul className="text-sm list-disc pl-5 flex flex-col gap-2 font-serif text-base">
                <li>Transfer the dessert box to a refrigerator immediately upon receipt.</li>
                <li>Chill for at least 1 hour before cutting to ensure a clean slice.</li>
                <li>Store remaining cake pieces inside airtight glass boxes in the fridge.</li>
                <li>Warm cookies for 1-2 minutes in a conventional oven to retrieve chewiness.</li>
              </ul>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Shipping;
