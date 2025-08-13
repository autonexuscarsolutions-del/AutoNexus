import React from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  CreditCard,
  Shield,
  Truck,
  Headphones
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-300">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              AutoNexus
            </h3>
            <p className="text-sm">
              Your trusted partner for premium automotive parts and solutions.
            </p>

            <div className="space-y-2">
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-4 h-4 text-red-400" />
                <span>123 Auto Street, Detroit, MI 48201</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-red-400" />
                <span>(123) 456-7890</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-red-400" />
                <span>support@autonexus.com</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Clock className="w-4 h-4 text-red-400" />
                <span>Mon-Fri: 9AM - 6PM</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { name: "Home", href: "#home" },
                { name: "About Us", href: "#about" },
                { name: "Products", href: "#products" },
                { name: "Special Offers", href: "#offers" },
                { name: "My Account", href: "#account" },
                { name: "Order Tracking", href: "#tracking" }
              ].map((item, index) => (
                <li key={index}>
                  <a
                    href={item.href}
                    className="text-sm hover:text-red-400 transition-colors"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">
              Customer Service
            </h3>
            <ul className="space-y-2">
              {[
                { name: "Contact Us", href: "#contact" },
                { name: "FAQs", href: "#faqs" },
                { name: "Returns & Exchanges", href: "#returns" },
                { name: "Shipping Info", href: "#shipping" },
                { name: "Privacy Policy", href: "#privacy" },
                { name: "Terms of Service", href: "#terms" }
              ].map((item, index) => (
                <li key={index}>
                  <a
                    href={item.href}
                    className="text-sm hover:text-red-400 transition-colors"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Newsletter</h3>
            <p className="text-sm mb-4">
              Subscribe to get updates on new products and special offers.
            </p>

            <form className="flex flex-col space-y-3">
              <input
                type="email"
                placeholder="Your email address"
                className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                required
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-red-600 to-red-700 text-white py-2 px-4 rounded-lg text-sm font-medium hover:from-red-700 hover:to-red-800 transition-all shadow-lg shadow-red-900/20"
              >
                Subscribe
              </button>
            </form>

            <div className="mt-6">
              <h4 className="text-sm font-semibold text-white mb-3">
                Follow Us
              </h4>
              <div className="flex space-x-4">
                {[
                  { icon: Facebook, href: "#" },
                  { icon: Twitter, href: "#" },
                  { icon: Instagram, href: "#" },
                  { icon: Linkedin, href: "#" }
                ].map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <social.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Features Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12 pt-8 border-t border-slate-800">
          {[
            {
              icon: Truck,
              title: "Free Shipping",
              description: "On orders over $100"
            },
            {
              icon: CreditCard,
              title: "Secure Payment",
              description: "100% secure checkout"
            },
            {
              icon: Shield,
              title: "Quality Guarantee",
              description: "Authentic products"
            },
            {
              icon: Headphones,
              title: "24/7 Support",
              description: "Dedicated support"
            }
          ].map((feature, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-600/20 to-red-800/20 rounded-lg flex items-center justify-center">
                <feature.icon className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h4 className="font-semibold text-white">{feature.title}</h4>
                <p className="text-xs text-slate-400">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-slate-950/50 py-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} AutoNexus. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <img
              src="https://via.placeholder.com/40x25?text=Visa"
              alt="Visa"
              className="h-6 opacity-80 hover:opacity-100 transition-opacity"
            />
            <img
              src="https://via.placeholder.com/40x25?text=MC"
              alt="Mastercard"
              className="h-6 opacity-80 hover:opacity-100 transition-opacity"
            />
            <img
              src="https://via.placeholder.com/40x25?text=Amex"
              alt="American Express"
              className="h-6 opacity-80 hover:opacity-100 transition-opacity"
            />
            <img
              src="https://via.placeholder.com/40x25?text=PayPal"
              alt="PayPal"
              className="h-6 opacity-80 hover:opacity-100 transition-opacity"
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
