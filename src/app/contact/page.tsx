"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [formStatus, setFormStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("submitting");

    // Simulate form submission
    setTimeout(() => {
      setFormStatus("success");
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });

      // Reset form status after 3 seconds
      setTimeout(() => {
        setFormStatus("idle");
      }, 3000);
    }, 1500);
  };

  return (
    <div>
      <section className="pt-16 pb-10 bg-gradient-to-b from-primary-50 to-white dark:from-slate-900 dark:to-slate-950">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <motion.h1
              className="text-4xl md:text-5xl font-bold text-gradient mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Contact Us
            </motion.h1>
            <motion.p
              className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Have questions about the Pharmair Conference? We&apos;re here to
              help.
            </motion.p>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Information */}
            <div className="order-2 lg:order-1">
              <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>

              <div className="space-y-6">
                <Card variant="glass" className="p-6">
                  <div className="flex items-start">
                    <MapPinIcon className="h-6 w-6 text-primary-600 dark:text-primary-400 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold mb-1">Conference Venue</h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Sultan ul Uloom College of Pharmacy
                        <br />
                        Road Number 3, Banjara Hills
                        <br />
                        Hyderabad, Telangana 500034
                      </p>
                    </div>
                  </div>
                </Card>

                <Card variant="glass" className="p-6">
                  <div className="flex items-start">
                    <EnvelopeIcon className="h-6 w-6 text-primary-600 dark:text-primary-400 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold mb-1">Email</h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        General Inquiries:{" "}
                        <a
                          href="mailto:info@pharmanecia.org"
                          className="text-primary-600 dark:text-primary-400 hover:underline"
                        >
                          info@pharmanecia.org
                        </a>
                        <br />
                        Registration Support:{" "}
                        <a
                          href="mailto:registration@pharmanecia.org"
                          className="text-primary-600 dark:text-primary-400 hover:underline"
                        >
                          registration@pharmanecia.org
                        </a>
                        <br />
                        Speaker Coordination:{" "}
                        <a
                          href="mailto:speakers@pharmanecia.org"
                          className="text-primary-600 dark:text-primary-400 hover:underline"
                        >
                          speakers@pharmanecia.org
                        </a>
                      </p>
                    </div>
                  </div>
                </Card>

                <Card variant="glass" className="p-6">
                  <div className="flex items-start">
                    <PhoneIcon className="h-6 w-6 text-primary-600 dark:text-primary-400 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold mb-1">Phone</h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Conference Helpline:{" "}
                        <a
                          href="tel:+15551234567"
                          className="text-primary-600 dark:text-primary-400 hover:underline"
                        >
                          +1 (555) 123-4567
                        </a>
                        <br />
                        Registration Desk:{" "}
                        <a
                          href="tel:+15555678910"
                          className="text-primary-600 dark:text-primary-400 hover:underline"
                        >
                          +1 (555) 567-8910
                        </a>
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Embedded Map */}
                <div className="mt-8">
                  <h3 className="text-xl font-semibold mb-4">Location</h3>
                  <div className="h-64 sm:h-80 rounded-xl overflow-hidden glass">
                    {/* Replace with actual Google Maps embed */}
                    <div className="w-full h-full bg-gray-200 dark:bg-slate-700 flex items-center justify-center">
                      <p className="text-gray-500 dark:text-gray-400">
                        Map Embed Placeholder
                        <br />
                        (Google Maps API integration would go here)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="order-1 lg:order-2">
              <Card variant="glass" className="p-6">
                <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium mb-1"
                    >
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 rounded-md bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium mb-1"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 rounded-md bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium mb-1"
                    >
                      Subject
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 rounded-md bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">Please select</option>
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Registration">Registration Support</option>
                      <option value="Speaker Information">
                        Speaker Information
                      </option>
                      <option value="Sponsorship Opportunities">
                        Sponsorship Opportunities
                      </option>
                      <option value="Media Inquiry">Media Inquiry</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium mb-1"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-2 rounded-md bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div className="pt-2">
                    <Button
                      type="submit"
                      isLoading={formStatus === "submitting"}
                      disabled={
                        formStatus === "submitting" || formStatus === "success"
                      }
                      className="w-full"
                    >
                      {formStatus === "success"
                        ? "Message Sent!"
                        : "Send Message"}
                    </Button>

                    {formStatus === "success" && (
                      <p className="mt-3 text-sm text-green-600 dark:text-green-400 text-center">
                        Thank you! We&apos;ll get back to you soon.
                      </p>
                    )}

                    {formStatus === "error" && (
                      <p className="mt-3 text-sm text-red-600 dark:text-red-400 text-center">
                        There was an error sending your message. Please try
                        again.
                      </p>
                    )}
                  </div>
                </form>
              </Card>

              {/* FAQ Information */}
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">
                  Frequently Asked Questions
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Can&apos;t find what you&apos;re looking for? Check our FAQ
                  section for quick answers to common questions.
                </p>
                <Button variant="outline">View FAQ</Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
