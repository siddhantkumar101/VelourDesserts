import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Search } from 'lucide-react';

const FAQ = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeIdx, setActiveIdx] = useState(null);

  const faqs = [
    {
      question: 'How much notice do you require for cake orders?',
      answer: 'For our signature cakes and tarts, we require a minimum of 48 hours notice. For bespoke custom cakes (2-3 tiers) or massive corporate event orders, we request at least 4 to 7 days to finalize designs and guarantee availability.',
      category: 'Orders'
    },
    {
      question: 'What are your delivery areas and rates?',
      answer: 'We deliver fresh daily across all major zones in the metropolitan region. We charge a flat delivery fee of ₹100 to ensure your treats are dispatched in chilled, custom-fitted compartments preventing damage.',
      category: 'Delivery'
    },
    {
      question: 'Do you offer eggless or sugar-free variations?',
      answer: 'Yes! Over 80% of our cakes and tarts can be prepared 100% eggless upon request (look for the "Eggless" toggle on checkout pages). We are also working on a keto/low-glycemic collection coming very soon!',
      category: 'Ingredients'
    },
    {
      question: 'Can I change or cancel my dessert order?',
      answer: 'Because all our desserts are freshly baked to order, we accept cancellations or modifications up to 48 hours before your scheduled delivery or pickup slot. Cancellations within 48 hours will receive store credit.',
      category: 'Orders'
    },
    {
      question: 'How should I store my entremets and tarts?',
      answer: 'Our Belgian chocolate entremets should be kept refrigerated and served cold. For our butter tarts and chunky cookies, they can be stored at room temperature in airtight boxes for up to 3 days, or warmed in the oven for 2 minutes for a gooey center!',
      category: 'Ingredients'
    },
    {
      question: 'Do you make customized design cakes?',
      answer: 'Absolutely! We love bringing your dream designs to life. Head over to our "Custom Orders" page to select occasion, flavor profiles, servings, tiers, and reference ideas, and our pastry architect will sketch a quotation.',
      category: 'Custom Cakes'
    }
  ];

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleAccordion = (idx) => {
    setActiveIdx(activeIdx === idx ? null : idx);
  };

  return (
    <div className="w-full bg-cream min-h-screen py-16 px-4 sm:px-6 lg:px-8 page-transition">
      <div className="max-w-4xl mx-auto flex flex-col gap-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto flex flex-col gap-4">
          <span className="text-xs font-semibold uppercase tracking-widest text-rose flex items-center justify-center gap-1">
            <HelpCircle className="w-4 h-4" /> Got Questions?
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-chocolate">
            Frequently Asked Questions
          </h1>
          <p className="font-serif text-chocolate/75 leading-relaxed">
            Find answers to commonly asked questions regarding order lead times, shipping methods, customized cakes, and artisan ingredients.
          </p>
          
          {/* FAQ Search */}
          <div className="relative mt-4">
            <input
              type="text"
              placeholder="Search your questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-chocolate/10 shadow-sm focus:outline-none focus:border-rose text-chocolate font-serif text-base bg-white transition-all hover:border-chocolate/20"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-chocolate/40" />
          </div>
        </div>

        {/* FAQ Accordion Grid */}
        <div className="flex flex-col gap-4">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-10 text-chocolate/50 font-serif">
              No matching questions found... Try typing "delivery", "eggless", or "cake"!
            </div>
          ) : (
            filteredFaqs.map((faq, idx) => {
              const isOpen = activeIdx === idx;
              return (
                <div 
                  key={idx} 
                  className={`bg-white rounded-2xl border transition-all duration-300 ${
                    isOpen ? 'border-rose/30 shadow-md translate-y-[-2px]' : 'border-chocolate/5 hover:border-chocolate/25 hover:shadow-sm'
                  }`}
                >
                  <button
                    onClick={() => toggleAccordion(idx)}
                    className="w-full text-left p-6 flex justify-between items-center focus:outline-none"
                  >
                    <div className="flex gap-4 items-center pr-4">
                      <span className="text-xs font-bold uppercase tracking-wider text-rose bg-rose/10 px-2.5 py-1 rounded-md shrink-0">
                        {faq.category}
                      </span>
                      <h3 className="font-serif text-lg font-bold text-chocolate leading-snug">
                        {faq.question}
                      </h3>
                    </div>
                    <div>
                      {isOpen ? (
                        <ChevronUp className="w-5 h-5 text-rose shrink-0 transition-transform duration-300" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-chocolate/40 shrink-0 transition-transform duration-300" />
                      )}
                    </div>
                  </button>

                  {/* Expandable Panel with slide-down feel */}
                  <div 
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${
                      isOpen ? 'max-h-[300px] border-t border-chocolate/5' : 'max-h-0'
                    }`}
                  >
                    <p className="p-6 text-sm text-chocolate/80 leading-relaxed font-serif text-lg bg-cream/20">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
};

export default FAQ;
