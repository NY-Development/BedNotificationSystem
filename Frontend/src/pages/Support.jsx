import React, { useState } from "react";
import { Mail, HelpCircle, MessageSquare, ChevronDown, ChevronUp, Send, Smartphone } from "lucide-react";
import { toast } from "react-hot-toast";

const faqs = [
  {
    question: "What is the Bed Notification System (BNS)?",
    answer:
      "BNS is a hospital management platform that simplifies bed, ward, and department assignments. It helps supervisors and healthcare workers manage rotations, track expiries, and stay updated through notifications.",
  },
  {
    question: "Who can use BNS?",
    answer:
      "BNS is designed for hospitals and healthcare institutions. Admins, supervisors, and staff members can use it to manage bed allocations and assignments efficiently.",
  },
  {
    question: "What happens when my ward or department expires?",
    answer:
      "When your expiry date reaches, BNS automatically requires you to update your assignment. You’ll be prompted to select a new ward or department to continue using the system.",
  },
  {
    question: "I can’t log in or verify my email. What should I do?",
    answer:
      "Make sure you’ve checked your spam folder for the verification email. If you still can’t access your account, contact your system supervisor or reach out to NYDev Support.",
  },
  {
    question: "How do I contact support?",
    answer:
      `You can fill out the support form below or DM us directly at @NYDevchat through our telegram group. Our team will respond as soon as possible.`,
  },
];

const Support = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

const handleSubmit = (e) => {
e.preventDefault();
if (!form.name || !form.email || !form.message) {
    toast.error("Please fill in all fields.");
    return;
}
setLoading(true);

const mailtoLink = `mailto:yamlaknegash96@gmail.com?subject=${encodeURIComponent(form.name)}&body=${encodeURIComponent(`Message: ${form.message}\nFrom: ${form.email}`)}`;

// Open the mailto link
window.location.href = mailtoLink;

setLoading(false);
toast.success("Support request submitted successfully! 💬");
setForm({ name: "", email: "", message: "" });
};

  return (
    <div className="min-h-screen bg-gray-100 font-inter">
      <div className="w-full mx-auto bg-white shadow-3xl p-6 sm:p-10">

        {/* Header */}
        <div className="text-center mb-12">
            <Smartphone className="w-12 h-12 text-indigo-600 mx-auto mb-3"/>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-3 tracking-tight">
            Dedicated <span className="text-indigo-600">Support</span> Center
          </h1>
          <p className="text-gray-500 text-lg max-w-3xl mx-auto">
            Find immediate answers to common questions or reach out to our team for personalized assistance with <span className="font-semibold text-indigo-600">BNS</span>.
          </p>
        </div>

        {/* FAQ Section */}
        <section className="mb-14">
          <div className="flex items-center space-x-3 mb-6 border-b border-gray-200 pb-2">
            <HelpCircle className="text-indigo-600 w-6 h-6" />
            <h2 className="text-2xl font-bold text-gray-800">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`rounded-xl transition-all duration-300 ${
                    openIndex === index 
                        ? 'bg-indigo-50 border-indigo-300 shadow-lg' 
                        : 'bg-white border-gray-200 hover:shadow-md hover:border-indigo-100'
                } border`}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex justify-between items-center px-6 py-4 text-left focus:outline-none"
                >
                  <span className={`text-lg font-semibold ${openIndex === index ? 'text-indigo-800' : 'text-gray-800'}`}>{faq.question}</span>
                  {openIndex === index ? (
                    <ChevronUp className="text-indigo-600 w-5 h-5 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="text-gray-400 w-5 h-5 flex-shrink-0" />
                  )}
                </button>
                {openIndex === index && (
                  <div className="px-6 py-4 text-gray-700 border-t border-indigo-200 bg-white rounded-b-xl">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Contact Form */}
        <section className="pt-6">
          <div className="flex items-center space-x-3 mb-6 border-b border-gray-200 pb-2">
            <MessageSquare className="text-indigo-600 w-6 h-6" />
            <h2 className="text-2xl font-bold text-gray-800">Send Us a Message</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 mt-6">
            <div className="flex flex-col justify-center items-baseline">
              <label htmlFor="name" className="justify-start text-sm font-bold text-gray-700 mb-1">Your Name</label>
              <input
                id="name"
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-gray-300 rounded-xl p-3 shadow-sm focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all duration-200"
                placeholder="Enter your full name"
              />
            </div>

            <div className="flex flex-col justify-center items-baseline">
              <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-1">Your Email</label>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border border-gray-300 rounded-xl p-3 shadow-sm focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all duration-200"
                placeholder="example@domain.com"
              />
            </div>

            <div className="flex flex-col justify-center items-baseline">
              <label htmlFor="message" className="block text-sm font-bold text-gray-700 mb-1">Your Message</label>
              <textarea
                id="message"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full border border-gray-300 rounded-xl p-3 shadow-sm focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all duration-200"
                rows="4"
                placeholder="Describe your issue or question..."
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="cp flex items-center justify-center space-x-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-full shadow-lg transition-all duration-300 w-full sm:w-auto transform hover:scale-[1.01] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Mail className="w-5 h-5" />
                  <span>Send Message</span>
                </>
              )}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default Support;
