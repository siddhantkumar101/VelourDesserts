import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, CheckCircle } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addToast } from '../../stores/uiSlice';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const Contact = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      dispatch(addToast({ message: 'Please fill in all required fields.', type: 'error' }));
      return;
    }

    setIsSubmitting(true);
    
    // Simulate contact submission API
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      dispatch(addToast({ message: 'Message sent successfully!', type: 'success' }));
    }, 1200);
  };

  const contactDetails = [
    {
      icon: <Phone className="w-6 h-6 text-rose" />,
      title: 'Phone & WhatsApp',
      detail: '+91 98765 43210',
      description: 'Available daily 9 AM - 8 PM IST'
    },
    {
      icon: <Mail className="w-6 h-6 text-rose" />,
      title: 'Email Address',
      detail: 'connoisseur@velourdesserts.com',
      description: 'Pastry & order queries response in 3 hours'
    },
    {
      icon: <MapPin className="w-6 h-6 text-rose" />,
      title: 'Gourmet Studio',
      detail: '84, Lavelle Road, Bangalore, India',
      description: 'Drop by to pick up pre-booked treats!'
    }
  ];

  return (
    <div className="w-full bg-cream min-h-screen py-16 px-4 sm:px-6 lg:px-8 page-transition">
      <div className="max-w-6xl mx-auto flex flex-col gap-16">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto flex flex-col gap-4">
          <span className="text-xs font-semibold uppercase tracking-widest text-rose flex items-center justify-center gap-1">
            <MessageSquare className="w-4 h-4" /> Say Hello
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-chocolate">
            Contact Our Connoisseurs
          </h1>
          <p className="font-serif text-chocolate/75 leading-relaxed">
            Have an event query, customized menu request, or feedback? Reach out to our boutique, and we will get back to you immediately.
          </p>
        </div>

        {/* Split Content Column */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Left Column: Visual details */}
          <div className="lg:col-span-5 flex flex-col gap-6 justify-center">
            {contactDetails.map((detail, idx) => (
              <div 
                key={idx} 
                className="bg-white p-6 rounded-3xl border border-chocolate/5 hover-lift hover-glow flex items-start gap-4 transition-all duration-300"
              >
                <div className="p-3 bg-rose/10 rounded-2xl shrink-0 mt-1">
                  {detail.icon}
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="font-serif text-lg font-bold text-chocolate">{detail.title}</h3>
                  <p className="font-mono text-rose text-base font-bold select-all">{detail.detail}</p>
                  <p className="text-xs text-chocolate/55 font-medium">{detail.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Contact form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-8 md:p-10 rounded-3xl border border-chocolate/5 hover-glow transition-all duration-500">
              {isSuccess ? (
                <div className="text-center py-10 flex flex-col items-center gap-4 fade-in">
                  <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <CheckCircle className="w-8 h-8 text-success" />
                  </div>
                  <h2 className="font-display text-2xl font-bold text-chocolate">Message Transmitted!</h2>
                  <p className="font-serif text-chocolate/85 max-w-sm">
                    Thank you for writing to us. One of our master pastry specialists will get in touch with you shortly.
                  </p>
                  <Button onClick={() => { setIsSuccess(false); setFormData({ name:'', email:'', subject:'', message:'' }); }} className="mt-4">
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                  <h2 className="font-serif text-2xl font-bold text-chocolate border-b border-chocolate/5 pb-2">
                    Send a Message
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Your Name *" id="name" value={formData.name} onChange={handleChange} />
                    <Input label="Email Address *" id="email" type="email" value={formData.email} onChange={handleChange} />
                  </div>
                  <Input label="Subject / Topic" id="subject" value={formData.subject} onChange={handleChange} />
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-chocolate" htmlFor="message">Message Body *</label>
                    <textarea
                      id="message"
                      rows="4"
                      placeholder="Write your dessert enquiry details here..."
                      value={formData.message}
                      onChange={handleChange}
                      className="p-3 border border-chocolate/20 rounded-lg focus:outline-none focus:border-rose text-chocolate text-sm resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    isLoading={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 mt-2 shadow-hover py-3"
                  >
                    <Send className="w-4 h-4" /> Dispatch Message
                  </Button>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Contact;
