import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faPhone, faLocationDot } from "@fortawesome/free-solid-svg-icons";

function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log("Form submitted:", formData);
      alert("Thank you for your message! We'll get back to you soon.");
      setFormData({ name: "", email: "", message: "" });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 shadow-2xl rounded-3xl overflow-hidden bg-white">
        
        {/* Left Side: Contact Information */}
        <div className="bg-primary p-8 lg:p-12 text-white flex flex-col justify-between">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">Let's build something <span className="text-secondary">amazing</span> together.</h2>
            <p className="text-gray-300 mb-10">
              Have a project in mind? Fill out the form and our team will get back to you within 24 hours.
            </p>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-secondary">
                  <FontAwesomeIcon icon={faPhone} />
                </div>
                <span>+254 700 000 000</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-secondary">
                  <FontAwesomeIcon icon={faEnvelope} />
                </div>
                <span>hello@kwetucreations.com</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-secondary">
                  <FontAwesomeIcon icon={faLocationDot} />
                </div>
                <span>Nairobi, Kenya</span>
              </div>
            </div>
          </div>

          <div className="mt-12">
             <p className="text-sm text-gray-400 italic font-light">"Your Vision Is Our Mission"</p>
          </div>
        </div>

        {/* Right Side: Contact Form */}
        <div className="p-8 lg:p-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="John Doe"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-all"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="john@example.com"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-all"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Project Details</label>
              <textarea
                name="message"
                id="message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                required
                placeholder="Tell us about your design needs..."
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-all resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-4 bg-secondary text-white font-bold rounded-xl shadow-lg transition-all transform active:scale-[0.98] ${
                isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:bg-opacity-90 hover:shadow-secondary/20"
              }`}
            >
              {isSubmitting ? "Sending Message..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Contact;