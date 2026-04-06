'use client'

import { useState } from 'react'
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaWhatsapp, FaInstagram, FaFacebook, FaTwitter, FaPaperPlane, FaCheckCircle } from 'react-icons/fa'
import toast from 'react-hot-toast'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Message sent successfully! We will get back to you soon.');
        setFormData({ name: '', email: '', subject: '', message: '' });
        setSubmitted(true);
      } else {
        toast.error(data.error || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
      setTimeout(() => setSubmitted(false), 3000);
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const contactInfo = [
    {
      icon: FaPhone,
      title: 'Phone',
      details: ['+234 704 301 6178'],
      color: 'bg-amber-500',
      hover: 'hover:bg-amber-600',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      link: 'tel:+2347043016178'
    },
    {
      icon: FaWhatsapp,
      title: 'WhatsApp',
      details: ['+234 704 301 6178'],
      color: 'bg-green-500',
      hover: 'hover:bg-green-600',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      link: 'https://wa.me/2347043016178'
    },
    {
      icon: FaEnvelope,
      title: 'Email',
      details: ['ebortypeace81@gmail.com'],
      color: 'bg-teal-500',
      hover: 'hover:bg-teal-600',
      iconBg: 'bg-teal-100',
      iconColor: 'text-teal-600',
      link: 'mailto:ebortypeace81@gmail.com'
    },
    {
      icon: FaMapMarkerAlt,
      title: 'Office Location',
      details: ['123 Victoria Island', 'Lagos, Nigeria'],
      color: 'bg-orange-500',
      hover: 'hover:bg-orange-600',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600'
    },
    {
      icon: FaClock,
      title: 'Business Hours',
      details: ['Monday - Friday: 8am - 8pm', 'Saturday - Sunday: 9am - 6pm'],
      color: 'bg-purple-500',
      hover: 'hover:bg-purple-600',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600'
    }
  ]

  const socialLinks = [
    { icon: FaFacebook, name: 'Facebook', color: 'bg-blue-600', hover: 'hover:bg-blue-700' },
    { icon: FaTwitter, name: 'Twitter', color: 'bg-sky-500', hover: 'hover:bg-sky-600' },
    { icon: FaInstagram, name: 'Instagram', color: 'bg-pink-600', hover: 'hover:bg-pink-700' },
    { icon: FaWhatsapp, name: 'WhatsApp', color: 'bg-green-500', hover: 'hover:bg-green-600', link: 'https://wa.me/2347043016178' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 py-12 sm:py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 bg-amber-100 px-4 py-2 rounded-full mb-4 mt-10">
            <FaEnvelope className="text-amber-600" />
            <span className="text-sm font-semibold text-amber-700">Get in Touch</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-800 mb-4">
            Contact <span className="text-amber-500">Us</span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-base sm:text-lg">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        {/* Contact Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 mb-12">
          {contactInfo.map((info, index) => (
            <div 
              key={index} 
              className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-5 text-center hover:-translate-y-1 border border-amber-100"
            >
              <div className={`${info.iconBg} w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300`}>
                <info.icon className={`text-2xl ${info.iconColor}`} />
              </div>
              <h3 className="text-base font-bold text-gray-800 mb-2">{info.title}</h3>
              {info.details.map((detail, i) => (
                info.link ? (
                  <a 
                    key={i} 
                    href={info.link}
                    className="text-sm text-gray-600 leading-relaxed hover:text-amber-600 transition-colors block"
                  >
                    {detail}
                  </a>
                ) : (
                  <p key={i} className="text-sm text-gray-600 leading-relaxed">{detail}</p>
                )
              ))}
            </div>
          ))}
        </div>

        {/* Contact Form and Map Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-amber-100">
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FaPaperPlane />
                Send us a Message
              </h2>
              <p className="text-amber-100 text-sm mt-1">We'll get back to you within 24 hours</p>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-amber-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  placeholder="John Doe"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-amber-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  placeholder="john@example.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-amber-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  placeholder="Booking Inquiry"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  name="message"
                  rows="4"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-amber-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all resize-none"
                  placeholder="Tell us how we can help..."
                ></textarea>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message <FaPaperPlane />
                  </>
                )}
              </button>

              {submitted && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-2 animate-fadeIn">
                  <FaCheckCircle className="text-green-500" />
                  <p className="text-green-700 text-sm">Message sent successfully!</p>
                </div>
              )}
            </form>
          </div>

          {/* Map and Social Section */}
          <div className="space-y-6">
            {/* Map */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-amber-100">
              <div className="bg-gradient-to-r from-teal-500 to-cyan-500 px-6 py-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <FaMapMarkerAlt />
                  Find Us Here
                </h2>
                <p className="text-teal-100 text-sm mt-1">Visit our office in Lagos</p>
              </div>
              <div className="h-80 w-full">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126940.88668583445!2d3.319914455419922!3d6.496294399999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8b2ae68280c1%3A0xdc9e87a367c3d9cb!2sLagos%2C%20Nigeria!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Iwada Rentals Location"
                  className="w-full h-full"
                ></iframe>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-amber-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-amber-500 rounded-full"></span>
                Connect With Us
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.link || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${social.color} ${social.hover} text-white p-3 rounded-xl flex flex-col items-center gap-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}
                  >
                    <social.icon className="text-xl" />
                    <span className="text-xs font-medium">{social.name}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl shadow-xl p-6 text-white text-center">
              <FaPhone className="text-3xl mx-auto mb-3 animate-pulse" />
              <h3 className="text-lg font-bold mb-2">24/7 Emergency Support</h3>
              <p className="text-amber-100 text-sm mb-3">For urgent matters, call us anytime</p>
              <a href="tel:+2347043016178" className="text-2xl font-bold hover:underline">
                +234 704 301 6178
              </a>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 text-center">
          <p className="text-gray-500 text-sm">
            📍 We respond to all inquiries within 24 hours. For urgent matters, please call our support line.
          </p>
        </div>
      </div>
    </div>
  )
}