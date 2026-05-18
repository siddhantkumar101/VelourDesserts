import React from 'react';
import { ShieldCheck, BookOpen } from 'lucide-react';

const PrivacyPolicy = () => {
  const sections = [
    {
      id: 'collection',
      title: '1. Information We Collect',
      content: 'We collect personal information that you voluntarily provide to us when registering on the storefront, adding items to your cart, submitting custom cake blueprints, or communicating with us. This details name, email address, shipping billing coordinates, contact numbers, and customized cake messages.'
    },
    {
      id: 'usage',
      title: '2. How We Use Your Details',
      content: 'We process your collected details for purposes of carrying out core operations including: fulfilling premium dessert orders, calculating delivery timelines, coordinating kitchen customization details, verifying secure Stripe card payments, communicating order updates, and sending curated newsletter promotions.'
    },
    {
      id: 'sharing',
      title: '3. Data Sharing protocols',
      content: 'We value your absolute privacy. We do not sell or trade your details. We only share details with trusted logistics handlers (to dispatch cakes safely) and transaction processors (Stripe) to authenticate checkouts.'
    },
    {
      id: 'security',
      title: '4. High-Fidelity Protection',
      content: 'We employ secure database encryptions and SSL parameters to protect customer database states. No credit card details are stored directly on our servers, ensuring your transactions are 100% compliant with standard card industry safety standards.'
    }
  ];

  const handleScroll = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="w-full bg-cream min-h-screen py-16 px-4 sm:px-6 lg:px-8 page-transition">
      <div className="max-w-5xl mx-auto flex flex-col gap-12">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto flex flex-col gap-4">
          <span className="text-xs font-semibold uppercase tracking-widest text-rose flex items-center justify-center gap-1">
            <ShieldCheck className="w-4 h-4" /> Data Integrity
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-chocolate">
            Privacy Policy
          </h1>
          <p className="font-serif text-chocolate/75 leading-relaxed">
            Your trust is our highest priority. Read about how we collect, safeguard, and coordinate customer profiles to deliver luxury culinary service.
          </p>
        </div>

        {/* Dynamic Reader Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Left Chapter Picker (Sticky on Desktop) */}
          <div className="md:col-span-4 bg-white p-6 rounded-3xl border border-chocolate/5 sticky top-24 flex flex-col gap-4">
            <h3 className="font-serif text-lg font-bold text-chocolate flex items-center gap-2 border-b border-chocolate/5 pb-2">
              <BookOpen className="w-5 h-5 text-rose" /> Chapters
            </h3>
            <nav className="flex flex-col gap-2">
              {sections.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => handleScroll(sec.id)}
                  className="text-left font-serif text-base text-chocolate/70 hover:text-rose hover:pl-1 transition-all duration-300 focus:outline-none"
                >
                  {sec.title}
                </button>
              ))}
            </nav>
          </div>

          {/* Right Chapters Reader */}
          <div className="md:col-span-8 flex flex-col gap-6">
            {sections.map((sec) => (
              <div 
                key={sec.id}
                id={sec.id}
                className="bg-white p-8 rounded-3xl border border-chocolate/5 hover-glow transition-all duration-300 flex flex-col gap-3 scroll-mt-24"
              >
                <h3 className="font-serif text-xl font-bold text-chocolate border-b border-chocolate/5 pb-2">
                  {sec.title}
                </h3>
                <p className="text-sm text-chocolate/80 leading-relaxed font-serif text-lg">
                  {sec.content}
                </p>
              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
};

export default PrivacyPolicy;
