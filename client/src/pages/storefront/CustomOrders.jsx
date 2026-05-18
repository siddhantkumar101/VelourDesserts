import React, { useState } from 'react';
import { Sparkles, Calendar, Users, FileText, CheckCircle } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addToast } from '../../stores/uiSlice';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const CustomOrders = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    occasion: 'Birthday',
    eventDate: '',
    servings: '',
    flavours: 'Chocolate',
    tierCount: '1 Tier',
    themeDescription: '',
    customMessage: '',
    specialInstructions: '',
    fulfillmentType: 'delivery'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.eventDate || !formData.servings) {
      dispatch(addToast({ message: 'Please fill in all required fields.', type: 'error' }));
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API request
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      dispatch(addToast({ 
        message: 'Bespoke request submitted! We will contact you soon.', 
        type: 'success' 
      }));
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 bg-cream">
        <div className="max-w-xl w-full bg-white p-8 md:p-12 rounded-3xl shadow-lg border border-chocolate/5 text-center fade-in">
          <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-success" />
          </div>
          <h1 className="font-display text-3xl font-bold text-chocolate mb-4">Request Received!</h1>
          <p className="font-serif text-lg text-chocolate/80 mb-6">
            Your request for a bespoke culinary masterpiece has been successfully transmitted to our master pastry chefs.
          </p>
          <p className="text-sm text-chocolate/60 mb-8">
            Our pastry design consultant will review your design, date, and flavor preferences, and contact you via **WhatsApp** or **Email** within **24 hours** to discuss quotation and finalized sketches.
          </p>
          <Button onClick={() => setIsSuccess(false)} className="w-full">
            Submit Another Request
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-cream min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto flex flex-col gap-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-sm font-semibold uppercase tracking-widest text-rose flex items-center justify-center gap-1">
            <Sparkles className="w-4 h-4" /> Bespoke Pastry Design
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-chocolate mt-2 mb-4">
            Bespoke Creations
          </h1>
          <p className="font-serif text-chocolate/75 leading-relaxed">
            Dreaming of a stunning center-piece for your celebration? Whether it is a multi-tiered wedding cake with delicate sugar flowers or custom birthday cupcakes, our culinary artisans will bring your vision to life.
          </p>
        </div>

        {/* Custom Request Form */}
        <form onSubmit={handleSubmit} className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-chocolate/5 grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <h2 className="md:col-span-2 font-serif text-2xl font-bold text-chocolate border-b border-chocolate/5 pb-2">
            1. Contact Details
          </h2>
          <Input label="Your Name *" id="name" value={formData.name} onChange={handleChange} />
          <Input label="Email Address *" id="email" type="email" value={formData.email} onChange={handleChange} />
          <Input label="Phone Number / WhatsApp *" id="phone" type="tel" value={formData.phone} onChange={handleChange} wrapperClassName="md:col-span-2" />

          <h2 className="md:col-span-2 font-serif text-2xl font-bold text-chocolate border-b border-chocolate/5 pb-2 mt-4">
            2. Event & Concept Details
          </h2>
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-chocolate" htmlFor="occasion">Occasion Type</label>
            <select
              id="occasion"
              value={formData.occasion}
              onChange={handleChange}
              className="p-3 border border-chocolate/20 rounded-lg focus:outline-none focus:border-rose text-chocolate text-sm bg-white"
            >
              <option value="Birthday">Birthday Celebration</option>
              <option value="Wedding">Wedding Ceremony</option>
              <option value="Anniversary">Anniversary</option>
              <option value="Corporate">Corporate Event</option>
              <option value="Other">Other Bespoke Event</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-chocolate flex items-center gap-1" htmlFor="eventDate">
              <Calendar className="w-4 h-4 text-rose" /> Event Date *
            </label>
            <input
              id="eventDate"
              type="date"
              value={formData.eventDate}
              onChange={handleChange}
              className="p-3 border border-chocolate/20 rounded-lg focus:outline-none focus:border-rose text-chocolate text-sm"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-chocolate flex items-center gap-1" htmlFor="servings">
              <Users className="w-4 h-4 text-rose" /> Servings / Guests *
            </label>
            <input
              id="servings"
              type="number"
              min="1"
              placeholder="e.g. 15, 50, 100"
              value={formData.servings}
              onChange={handleChange}
              className="p-3 border border-chocolate/20 rounded-lg focus:outline-none focus:border-rose text-chocolate text-sm"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-chocolate" htmlFor="tierCount">Tiers / Structure</label>
            <select
              id="tierCount"
              value={formData.tierCount}
              onChange={handleChange}
              className="p-3 border border-chocolate/20 rounded-lg focus:outline-none focus:border-rose text-chocolate text-sm bg-white"
            >
              <option value="1 Tier">1 Tier Cake</option>
              <option value="2 Tiers">2 Tiers Celebration Cake</option>
              <option value="3 Tiers">3 Tiers Grand Pastry</option>
              <option value="Cupcakes">Custom Cupcakes Box</option>
              <option value="Hampers">Assorted Gourmet Hampers</option>
            </select>
          </div>

          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-sm font-medium text-chocolate" htmlFor="flavours">Flavor Profile Preferences</label>
            <select
              id="flavours"
              value={formData.flavours}
              onChange={handleChange}
              className="p-3 border border-chocolate/20 rounded-lg focus:outline-none focus:border-rose text-chocolate text-sm bg-white"
            >
              <option value="Chocolate">Pure Belgian Dark Chocolate & Hazelnut</option>
              <option value="Pistachio Rose">Pistachio Rose & White Chocolate Ganache</option>
              <option value="Victoria">Classic Victoria Sponge Strawberry Mascarpone</option>
              <option value="Red Velvet">Rich Red Velvet & Tangy Cream Cheese</option>
              <option value="Custom">Custom Blends (Describe below)</option>
            </select>
          </div>

          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-sm font-medium text-chocolate flex items-center gap-1" htmlFor="themeDescription">
              <FileText className="w-4 h-4 text-rose" /> Styling, Concept & Colors Description
            </label>
            <textarea
              id="themeDescription"
              rows="3"
              placeholder="Describe your desired colors, cake themes, reference imagery details, or visual style (minimalist, floral, rustic, kid themes etc.)"
              value={formData.themeDescription}
              onChange={handleChange}
              className="p-3 border border-chocolate/20 rounded-lg focus:outline-none focus:border-rose text-chocolate text-sm resize-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-chocolate" htmlFor="customMessage">Custom Cake Inscription</label>
            <input
              id="customMessage"
              placeholder="e.g. 'Happy 25th Birthday Priya'"
              value={formData.customMessage}
              onChange={handleChange}
              className="p-3 border border-chocolate/20 rounded-lg focus:outline-none focus:border-rose text-chocolate text-sm"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-chocolate" htmlFor="fulfillmentType">Fulfillment Type</label>
            <select
              id="fulfillmentType"
              value={formData.fulfillmentType}
              onChange={handleChange}
              className="p-3 border border-chocolate/20 rounded-lg focus:outline-none focus:border-rose text-chocolate text-sm bg-white"
            >
              <option value="delivery">Home Delivery</option>
              <option value="pickup">Studio Pickup</option>
            </select>
          </div>

          <div className="md:col-span-2 mt-4">
            <Button
              type="submit"
              isLoading={isSubmitting}
              className="w-full shadow-hover text-base py-3"
            >
              Submit Design Request
            </Button>
            <p className="text-xs text-chocolate/50 text-center mt-3">
              * Design submission does not confirm your order. We will reach out to provide sketches, pricing, and final payment details.
            </p>
          </div>

        </form>

      </div>
    </div>
  );
};

export default CustomOrders;
