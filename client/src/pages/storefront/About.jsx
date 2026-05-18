import React from 'react';
import { Link } from 'react-router-dom';
import { Award, ShieldCheck, Heart, Sparkles } from 'lucide-react';
import { ROUTES } from '../../constants/routes';
import Button from '../../components/ui/Button';

const About = () => {
  const pillars = [
    {
      icon: <Award className="w-8 h-8 text-rose" />,
      title: 'French Patisserie Craft',
      description: 'Our recipes fuse time-honored French baking techniques with modern, avant-garde flavor profiles.'
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-rose" />,
      title: '100% Premium Ingredients',
      description: 'We source pure single-origin Belgian chocolate, organic seasonal fruits, and rich cultured butter. No exceptions.'
    },
    {
      icon: <Heart className="w-8 h-8 text-rose" />,
      title: 'Baked with Love & Fresh Daily',
      description: 'Every entremet, tart, and cookie is handcrafted in small batches, ensuring exceptional texture and quality.'
    },
    {
      icon: <Sparkles className="w-8 h-8 text-rose" />,
      title: 'Bespoke Artistry',
      description: 'From elegant celebration cakes to curated luxury gifting hampers, we customize dessert creations to suit your occasion.'
    }
  ];

  return (
    <div className="w-full bg-cream min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto flex flex-col gap-16">
        
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-sm font-semibold uppercase tracking-widest text-rose">Our Story</span>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-chocolate mt-2 mb-6">
            Crafting Sweet Artistry Since 2024
          </h1>
          <p className="font-serif text-lg md:text-xl text-chocolate/80 leading-relaxed">
            Velour Desserts Co. was founded on a simple, singular philosophy: to elevate the everyday dessert into a premium sensory experience. We combine texture, temperature, and visual elegance to craft pastries that taste as extraordinary as they look.
          </p>
        </div>

        {/* Narrative & Image Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
          <div className="md:col-span-6 overflow-hidden rounded-3xl shadow-lg border border-chocolate/5 h-[400px]">
            <img 
              src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&auto=format&fit=crop&q=80" 
              alt="Baking Pastry Chef" 
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="md:col-span-6 flex flex-col gap-6">
            <h2 className="font-serif text-3xl font-bold text-chocolate">The Philosophy of Taste</h2>
            <p className="text-chocolate/80 leading-relaxed">
              Our master chef, trained at the prestigious *Ecole Lenôtre* in Paris, returned with a dream of introducing gourmet, artisanal dessert craftsmanship to food lovers. We avoid overwhelming sweetness, choosing instead to focus on balancing the deep bitterness of pure cocoa, the bright tang of fresh fruit compotes, and the rich nuttiness of praline.
            </p>
            <p className="text-chocolate/80 leading-relaxed">
              Whether you are ordering our signature Belgian Chocolate Entremet for a grand celebration or indulging in our double chocolate chunky cookies on a quiet afternoon, you are experiencing the absolute peak of dessert artistry.
            </p>
          </div>
        </div>

        {/* Pillars / Values Section */}
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-chocolate/5">
          <h2 className="font-display text-3xl font-bold text-chocolate text-center mb-10">Our Commitments</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-12">
            {pillars.map((pillar, idx) => (
              <div key={idx} className="flex gap-4 items-start">
                <div className="p-3 bg-rose/10 rounded-xl shrink-0">
                  {pillar.icon}
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="font-serif text-lg font-bold text-chocolate">{pillar.title}</h3>
                  <p className="text-sm text-chocolate/70 leading-relaxed">{pillar.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-chocolate text-cream p-10 md:p-14 rounded-3xl shadow-xl flex flex-col items-center gap-6">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold">Indulge in Our Collections</h2>
          <p className="text-cream/80 max-w-2xl">
            Treat yourself or your loved ones to our premium collection of artisanal cakes, tarts, and cookies. Freshly baked and delivered right to your doorstep.
          </p>
          <Link to={ROUTES.SHOP}>
            <Button className="bg-rose text-white hover:bg-rose-dark px-8 shadow-hover">
              Browse the Boutique
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default About;
