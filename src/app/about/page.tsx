"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/Card";
import { UserGroupIcon } from "@heroicons/react/24/outline";

export default function AboutPage() {
  // Animation variants
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-primary-50 dark:bg-slate-900">
        <div className="container mx-auto px-6">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">
              About Pharmair
            </h1>
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">
              Advancing pharmaceutical innovation through global collaboration
              and knowledge exchange
            </p>
          </motion.div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-secondary-200 dark:bg-secondary-900/30 rounded-full opacity-50 blur-3xl" />
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary-200 dark:bg-primary-900/30 rounded-full opacity-50 blur-3xl" />
      </section>

      {/* Mission Statement */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Our Mission
              </h2>
              <div className="space-y-4 text-lg text-gray-700 dark:text-gray-300">
                <p>
                  Pharmair International Conference is dedicated to fostering
                  innovation, collaboration, and knowledge exchange within the
                  pharmaceutical and healthcare industries.
                </p>
                <p>
                  We bring together leading researchers, industry professionals,
                  healthcare providers, and policy makers to address current
                  challenges, discover emerging opportunities, and shape the
                  future of global healthcare.
                </p>
                <p>
                  Through our diverse program of keynote presentations, panel
                  discussions, workshops, and networking events, we aim to
                  accelerate the development and adoption of novel therapeutics,
                  technologies, and best practices that improve patient outcomes
                  worldwide.
                </p>
              </div>
            </motion.div>

            <motion.div
              className="relative h-96 lg:h-auto"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="relative h-full rounded-2xl overflow-hidden bg-gray-200 dark:bg-gray-800">
                {/* This would be replaced with an actual image in production */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-4xl font-bold text-gray-300 dark:text-gray-600">
                    Mission Image
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* History Timeline */}
      <section className="py-20 px-6 bg-gray-50 dark:bg-slate-950">
        <div className="container mx-auto">
          <motion.div
            className="max-w-3xl mx-auto text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gradient">
              Our History
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              From humble beginnings to a globally recognized event
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline center line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-primary-200 dark:bg-primary-900/30 z-0"></div>

            {/* Timeline events */}
            <div className="relative z-10">
              {[
                {
                  year: 2023,
                  title: "Pharmair 2023",
                  location: "Berlin, Germany",
                  description:
                    "Our second conference expanded to include representatives from over 40 countries, featuring breakthrough research in mRNA technology and personalized medicine.",
                  attendees: 1200,
                  isLeft: false,
                },
                {
                  year: 2021,
                  title: "Pharmair 2021",
                  location: "Boston, USA",
                  description:
                    "The inaugural Pharmair Conference brought together experts from the pharmaceutical industry to discuss innovation in drug discovery and development.",
                  attendees: 850,
                  isLeft: true,
                },
                {
                  year: 2020,
                  title: "Conference Planning",
                  location: "Virtual",
                  description:
                    "A global committee of industry leaders and researchers was formed to establish the Pharmair Conference as a Pharmair forum for pharmaceutical innovation.",
                  isLeft: false,
                },
              ].map((event, index) => (
                <motion.div
                  key={index}
                  className={`flex items-center mb-20 ${
                    event.isLeft ? "flex-row-reverse" : ""
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: index * 0.1 }}
                >
                  <div className="w-1/2 px-6">
                    <Card
                      variant={index % 2 === 0 ? "glass" : "gradient"}
                      hover="raise"
                      className="p-6"
                    >
                      <h3 className="text-2xl font-bold mb-2">
                        {event.title} - {event.year}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-3">
                        {event.location}
                      </p>
                      <p className="text-gray-700 dark:text-gray-300">
                        {event.description}
                      </p>
                      {event.attendees && (
                        <p className="mt-3 text-primary-600 dark:text-primary-400 font-medium">
                          {event.attendees} attendees
                        </p>
                      )}
                    </Card>
                  </div>
                  <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-primary-500 dark:bg-primary-700 border-4 border-white dark:border-slate-950">
                    <span className="text-white font-bold text-sm">
                      {event.year}
                    </span>
                  </div>
                  <div className="w-1/2"></div>
                </motion.div>
              ))}

              {/* Future Event */}
              <motion.div
                className="flex items-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.3 }}
              >
                <div className="w-1/2 px-6">
                  <Card
                    variant="default"
                    hover="glow"
                    className="p-6 border-2 border-secondary-500 dark:border-secondary-700"
                  >
                    <h3 className="text-2xl font-bold mb-2">
                      Pharmair 2025 - Coming Soon
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-3">
                      New York City, USA
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                      Join us for our biggest conference yet, featuring
                      groundbreaking research, cutting-edge technologies, and
                      unprecedented networking opportunities.
                    </p>
                    <p className="mt-3 text-secondary-600 dark:text-secondary-400 font-medium">
                      Expected attendance: 2,000+
                    </p>
                  </Card>
                </div>
                <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-secondary-500 dark:bg-secondary-700 border-4 border-white dark:border-slate-950 shadow-lg">
                  <span className="text-white font-bold text-sm">2025</span>
                </div>
                <div className="w-1/2"></div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gradient">
              Meet Our Team
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              The dedicated professionals behind Pharmair who work tirelessly to
              create an exceptional conference experience
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {/* Team Member Cards */}
            {[
              {
                name: "Dr. Robert Chen",
                title: "Conference Chair",
                company: "University of California",
                image: "/team1.jpg",
              },
              {
                name: "Dr. Maria Santos",
                title: "Program Director",
                company: "European Medicines Agency",
                image: "/team2.jpg",
              },
              {
                name: "James Wilson",
                title: "Partnerships Director",
                company: "Global Health Alliance",
                image: "/team3.jpg",
              },
              {
                name: "Dr. Aisha Patel",
                title: "Scientific Committee Lead",
                company: "Innovate Pharmaceuticals",
                image: "/team4.jpg",
              },
            ].map((member, index) => (
              <motion.div key={index} variants={fadeIn}>
                <Card
                  variant="default"
                  hover="raise"
                  className="overflow-hidden text-center"
                >
                  <div className="h-48 bg-gray-200 dark:bg-gray-700 relative">
                    {/* This would be replaced with actual images in a real implementation */}
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-500">
                      <UserGroupIcon className="h-16 w-16" />
                    </div>
                  </div>
                  <CardContent>
                    <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                    <p className="text-primary-600 dark:text-primary-400 font-medium mb-1">
                      {member.title}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {member.company}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-slate-900 dark:to-slate-950">
        <div className="container mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gradient">
              Our Values
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              The guiding principles that shape everything we do at Pharmair
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Innovation",
                description:
                  "We encourage novel ideas and approaches that have the potential to transform healthcare and patient outcomes.",
              },
              {
                title: "Collaboration",
                description:
                  "We believe that the greatest advances come from cross-disciplinary partnerships and open exchange of knowledge.",
              },
              {
                title: "Integrity",
                description:
                  "We uphold the highest standards of ethics and transparency in all our operations and scientific content.",
              },
              {
                title: "Inclusivity",
                description:
                  "We are committed to diverse representation and accessibility for participants from all backgrounds and regions.",
              },
              {
                title: "Excellence",
                description:
                  "We strive for exceptional quality in our program, speakers, and overall conference experience.",
              },
              {
                title: "Impact",
                description:
                  "We focus on developments with the potential to make meaningful differences in healthcare delivery and patient lives.",
              },
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: index * 0.1 }}
                className="group"
              >
                <Card
                  variant="glass"
                  hover="glow"
                  className="h-full relative overflow-hidden"
                >
                  <CardContent className="p-6">
                    <h3 className="text-xl md:text-2xl font-bold mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {value.title}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
