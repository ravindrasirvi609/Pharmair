"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ChevronRightIcon,
  CalendarIcon,
  MapPinIcon,
  UserGroupIcon,
  BeakerIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  BuildingLibraryIcon,
  ChartBarIcon,
  StarIcon,
  QuestionMarkCircleIcon,
  ArrowTopRightOnSquareIcon,
  LightBulbIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { CountdownTimer } from "@/components/ui/CountdownTimer";

export default function Home() {
  // Conference details
  const conferenceDate = new Date("September 15, 2025 09:00:00");
  const conferenceLocation = "Javits Center, New York, NY";
  const conferenceYear = 2025;

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

  const fadeInRight = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.6 },
  };

  const fadeInLeft = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.6 },
  };

  const scaleIn = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.5 },
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-screen min-h-[600px] flex items-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          {/* <Image
            src="/public/hero-bg.jpg"
            alt="Conference hall"
            fill
            priority
            className="object-cover"
            style={{ filter: "brightness(0.7)" }}
          /> */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary-900 to-secondary-900" />
        </div>

        <div className="container mx-auto relative z-10 px-6">
          <motion.div
            className="max-w-3xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              <span className="block">PharMAIR Conference</span>
              <span className="text-gradient bg-gradient-to-r from-blue-200 via-white to-blue-100">
                {conferenceYear}
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-white/90 mb-8">
              The Premier International Conference for Pharmaceutical and
              Healthcare Innovation
            </p>

            <p className="flex items-center text-white/80 mb-2">
              <CalendarIcon className="h-5 w-5 mr-2" />
              September 15-18, {conferenceYear}
            </p>

            <p className="flex items-center text-white/80 mb-6">
              <MapPinIcon className="h-5 w-5 mr-2" />
              {conferenceLocation}
            </p>

            <div className="flex flex-wrap gap-4">
              <Button
                variant="default"
                size="lg"
                animate
                onClick={() => (window.location.href = "/registration")}
              >
                Register Now
              </Button>
              <Button
                variant="glass"
                size="lg"
                animate
                onClick={() => (window.location.href = "/abstract-submission")}
                className="border-white/20 dark:border-gray-700/30"
              >
                Abstract Submission
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Floating card with countdown */}
        <motion.div
          className="absolute bottom-10 right-10 z-10 hidden md:block"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <Card variant="glass" className="w-64 p-4">
            <CardContent className="p-0">
              <CountdownTimer targetDate={conferenceDate} />
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* Key Conference Themes Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-white to-gray-50 dark:from-slate-900 dark:to-slate-950">
        <div className="container mx-auto">
          <motion.div
            className="max-w-3xl mx-auto text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gradient">
              Key Conference Themes
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              Explore cutting-edge developments and critical conversations
              shaping the future of pharmaceutical sciences
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "AI in Drug Discovery",
                description:
                  "Exploring how artificial intelligence is revolutionizing the identification and development of novel therapeutic compounds",
                icon: (
                  <LightBulbIcon className="h-10 w-10 text-primary-600 dark:text-primary-400" />
                ),
                color: "from-blue-500 to-purple-600",
              },
              {
                title: "Precision Medicine",
                description:
                  "Tailoring treatments to individual genetic profiles for enhanced efficacy and reduced side effects",
                icon: (
                  <AcademicCapIcon className="h-10 w-10 text-primary-600 dark:text-primary-400" />
                ),
                color: "from-green-500 to-teal-600",
              },
              {
                title: "Vaccine Innovation",
                description:
                  "Next-generation vaccine technologies and rapid development platforms responding to emerging health threats",
                icon: (
                  <BeakerIcon className="h-10 w-10 text-primary-600 dark:text-primary-400" />
                ),
                color: "from-yellow-500 to-orange-600",
              },
              {
                title: "Sustainable Pharmacy",
                description:
                  "Environmentally conscious approaches to pharmaceutical manufacturing, packaging, and delivery",
                icon: (
                  <BuildingLibraryIcon className="h-10 w-10 text-primary-600 dark:text-primary-400" />
                ),
                color: "from-green-600 to-emerald-700",
              },
              {
                title: "Digital Health Integration",
                description:
                  "Leveraging digital technologies to enhance medication adherence, monitoring, and patient outcomes",
                icon: (
                  <ChartBarIcon className="h-10 w-10 text-primary-600 dark:text-primary-400" />
                ),
                color: "from-cyan-500 to-blue-600",
              },
              {
                title: "Regulatory Harmonization",
                description:
                  "Exploring global approaches to streamline regulatory processes while maintaining rigorous safety standards",
                icon: (
                  <DocumentTextIcon className="h-10 w-10 text-primary-600 dark:text-primary-400" />
                ),
                color: "from-red-500 to-pink-600",
              },
            ].map((theme, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                className="group"
              >
                <Card
                  variant="glass"
                  hover="raise"
                  className="h-full border-t-4 overflow-hidden"
                  style={{
                    borderImageSource: `linear-gradient(to right, ${theme.color})`,
                  }}
                >
                  <CardContent className="flex flex-col pt-8">
                    <div className="p-3 bg-primary-100 dark:bg-primary-900/50 rounded-full mb-4 inline-flex self-start transition-all group-hover:bg-primary-200 dark:group-hover:bg-primary-800">
                      {theme.icon}
                    </div>
                    <h3 className="font-bold text-xl mb-2">{theme.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {theme.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-6 bg-gray-50 dark:bg-slate-950">
        <div className="container mx-auto">
          <motion.div
            className="max-w-3xl mx-auto text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gradient">
              About The Conference
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              Join us at the 3rd Pharmair International Conference, where
              pharmaceutical industry professionals, healthcare providers,
              researchers, and policy makers gather to exchange knowledge,
              explore innovations, and shape the future of healthcare.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {/* Feature Cards */}
            {[
              {
                title: "Expert Speakers",
                description:
                  "Learn from more than 50 industry leaders and innovators",
                icon: (
                  <UserGroupIcon className="h-10 w-10 text-primary-600 dark:text-primary-400" />
                ),
              },
              {
                title: "Interactive Workshops",
                description:
                  "Get hands-on experience with the latest technologies and methodologies",
                icon: (
                  <BeakerIcon className="h-10 w-10 text-primary-600 dark:text-primary-400" />
                ),
              },
              {
                title: "Networking Events",
                description:
                  "Connect with peers and potential collaborators from around the world",
                icon: (
                  <CalendarIcon className="h-10 w-10 text-primary-600 dark:text-primary-400" />
                ),
              },
              {
                title: "Exhibition Hall",
                description:
                  "Explore innovative products and services from over 100 exhibitors",
                icon: (
                  <MapPinIcon className="h-10 w-10 text-primary-600 dark:text-primary-400" />
                ),
              },
            ].map((feature, index) => (
              <motion.div key={index} variants={fadeIn} className="group">
                <Card variant="glass" hover="raise" className="h-full">
                  <CardContent className="flex flex-col items-center text-center pt-8">
                    <div className="p-3 bg-primary-100 dark:bg-primary-900 rounded-full mb-4 transition-colors group-hover:bg-primary-200 dark:group-hover:bg-primary-900">
                      {feature.icon}
                    </div>
                    <h3 className="font-bold text-xl mb-2">{feature.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Schedule Highlights Section */}
      <section className="py-20 px-6 bg-white dark:bg-slate-900">
        <div className="container mx-auto">
          <motion.div
            className="max-w-3xl mx-auto text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gradient">
              Schedule Highlights
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              Four days of groundbreaking presentations, interactive workshops,
              and invaluable networking opportunities
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {[
              {
                day: "Day 1",
                date: "September 15",
                title: "Innovation & Discovery",
                highlights: [
                  "Opening Keynote: The Future of Pharmaceutical Sciences",
                  "Panel: Emerging Technologies in Drug Discovery",
                  "Workshop: AI-Powered Research Methods",
                  "Evening Networking Reception",
                ],
              },
              {
                day: "Day 2",
                date: "September 16",
                title: "Clinical Advances",
                highlights: [
                  "Keynote: Breakthrough Clinical Trial Designs",
                  "Symposium: Precision Medicine Implementation",
                  "Roundtable: Patient-Centered Drug Development",
                  "Poster Sessions & Exhibition",
                ],
              },
              {
                day: "Day 3",
                date: "September 17",
                title: "Regulatory & Access",
                highlights: [
                  "Keynote: Global Regulatory Harmonization",
                  "Panel: Enhancing Healthcare Access & Equity",
                  "Workshop: Navigating Approval Pathways",
                  "Conference Gala Dinner",
                ],
              },
              {
                day: "Day 4",
                date: "September 18",
                title: "Future Perspectives",
                highlights: [
                  "Keynote: Ethical Frontiers in Pharmaceutical Innovation",
                  "Panel: Sustainability in Healthcare Systems",
                  "Closing Ceremony & Awards Presentation",
                  "Post-Conference Workshops",
                ],
              },
            ].map((day, index) => (
              <motion.div
                key={index}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={index % 2 === 0 ? fadeInLeft : fadeInRight}
                className="mb-12 last:mb-0"
              >
                <Card
                  variant={index % 2 === 0 ? "default" : "glass"}
                  className="relative overflow-hidden border-l-4 border-primary-500 dark:border-primary-600"
                >
                  <CardContent className="p-6 pl-8">
                    <div className="flex flex-wrap md:flex-nowrap justify-between items-start gap-4 mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                          {day.day} - {day.date}
                        </h3>
                        <h4 className="text-xl font-semibold mb-4">
                          {day.title}
                        </h4>
                      </div>
                      <Link
                        href="/agenda"
                        className="inline-flex items-center text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                      >
                        Full Schedule
                        <ChevronRightIcon className="h-4 w-4 ml-1" />
                      </Link>
                    </div>
                    <ul className="space-y-3">
                      {day.highlights.map((item, i) => (
                        <li key={i} className="flex items-start">
                          <div className="h-2 w-2 mt-2 mr-3 rounded-full bg-primary-500 dark:bg-primary-400"></div>
                          <span className="text-gray-700 dark:text-gray-300">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/agenda">
              <Button
                variant="outline"
                animate
                className="inline-flex items-center"
              >
                View Complete Agenda
                <ChevronRightIcon className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Speakers Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gradient">
              Featured Speakers
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              Learn from the brightest minds in pharmaceutical innovation,
              healthcare technology, and medical research
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {/* Speaker Cards */}
            {[
              {
                name: "Dr. Sarah Johnson",
                role: "Chief Medical Officer, NovaTech Pharmaceuticals",
                image: "/profile1.jpg",
                topic: "Next-Generation Drug Delivery Systems",
              },
              {
                name: "Prof. Michael Chang",
                role: "Research Director, Global Health Institute",
                image: "/profile2.jpg",
                topic: "Sustainable Pharmaceutical Manufacturing",
              },
              {
                name: "Dr. Elena Rodriguez",
                role: "Head of Innovation, MediCore Labs",
                image: "/profile3.jpg",
                topic: "AI Applications in Drug Discovery",
              },
            ].map((speaker, index) => (
              <motion.div key={index} variants={fadeIn}>
                <Card
                  variant="default"
                  hover="glow"
                  className="overflow-hidden"
                >
                  <div className="h-64 bg-gray-200 dark:bg-gray-700 relative">
                    {/* This would be replaced with actual images in a real implementation */}
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-500">
                      {/* Placeholder for speaker image */}
                      <UserGroupIcon className="h-16 w-16" />
                    </div>
                  </div>
                  <CardContent>
                    <h3 className="text-xl font-bold mb-1">{speaker.name}</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      {speaker.role}
                    </p>
                    <p className="text-sm font-medium text-primary-600 dark:text-primary-400">
                      Speaking on: {speaker.topic}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <div className="text-center mt-12">
            <Link href="/speakers">
              <Button
                variant="outline"
                animate
                className="inline-flex items-center"
              >
                View All Speakers
                <ChevronRightIcon className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Conference Stats Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-slate-800 to-slate-900 text-white">
        <div className="container mx-auto">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gradient">
              Conference Impact
            </h2>
            <p className="text-lg text-gray-200 max-w-3xl mx-auto">
              Join the global community of pharmaceutical professionals making a
              difference
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              {
                value: "1,500+",
                label: "Attendees",
                icon: <UserGroupIcon className="h-8 w-8" />,
              },
              {
                value: "50+",
                label: "Countries",
                icon: <MapPinIcon className="h-8 w-8" />,
              },
              {
                value: "100+",
                label: "Exhibitors",
                icon: <BuildingLibraryIcon className="h-8 w-8" />,
              },
              {
                value: "200+",
                label: "Presentations",
                icon: <DocumentTextIcon className="h-8 w-8" />,
              },
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center p-4 rounded-full bg-white/10 mb-4">
                  {stat.icon}
                </div>
                <div className="text-3xl md:text-4xl font-bold mb-1 text-white">
                  {stat.value}
                </div>
                <div className="text-gray-300">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Latest Research & Innovation Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-white to-gray-50 dark:from-slate-900 dark:to-slate-950">
        <div className="container mx-auto">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gradient">
              Latest Research & Innovation
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              Discover groundbreaking research and innovations being showcased
              at this year&apos;s conference
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                category: "Drug Delivery",
                title:
                  "Novel Nanomaterial-Based Drug Delivery Systems for Enhanced Bioavailability",
                author: "Research Team, PharmaTech University",
                abstract:
                  "Exploring how engineered nanomaterials can revolutionize drug delivery to overcome traditional bioavailability challenges.",
              },
              {
                category: "Digital Health",
                title:
                  "Blockchain-Enabled Pharmaceutical Supply Chain Management",
                author: "Secure Pharma Consortium",
                abstract:
                  "Implementing blockchain technology to enhance transparency, security, and efficiency in global pharmaceutical supply chains.",
              },
              {
                category: "Precision Medicine",
                title:
                  "Genomic Profiling for Personalized Pharmacy: Clinical Implementation",
                author: "Advanced Therapeutic Initiative",
                abstract:
                  "Translating genomic data into actionable clinical decisions for pharmaceutical therapy selection and dosing.",
              },
              {
                category: "Manufacturing",
                title:
                  "Continuous Manufacturing Technologies for Small Molecule Drugs",
                author: "Process Innovation Lab",
                abstract:
                  "Developing efficient, scalable, and sustainable continuous manufacturing processes for pharmaceutical production.",
              },
              {
                category: "AI Research",
                title:
                  "Deep Learning Models for Predicting Drug-Drug Interactions",
                author: "AI in Healthcare Consortium",
                abstract:
                  "Leveraging artificial intelligence to identify potential drug interactions and enhance patient safety.",
              },
              {
                category: "Clinical Trials",
                title:
                  "Decentralized Clinical Trials: Methods and Best Practices",
                author: "Global Clinical Research Network",
                abstract:
                  "Reimagining clinical trial design through remote monitoring and patient-centric approaches.",
              },
            ].map((research, index) => (
              <motion.div
                key={index}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={fadeIn}
              >
                <Card
                  variant={index % 2 === 0 ? "default" : "glass"}
                  hover="raise"
                  className="h-full"
                >
                  <CardContent className="p-6">
                    <span className="inline-block px-3 py-1 bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200 text-xs font-medium rounded-full mb-3">
                      {research.category}
                    </span>
                    <h3 className="text-lg font-bold mb-2">{research.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                      {research.author}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                      {research.abstract}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/abstract-submission">
              <Button
                variant="default"
                animate
                className="inline-flex items-center"
              >
                Submit Your Research
                <ChevronRightIcon className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-6 bg-gray-50 dark:bg-slate-950">
        <div className="container mx-auto">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gradient">
              What Past Attendees Say
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              Hear from participants who have experienced the value of PharMAIR
              conferences
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                quote:
                  "The networking opportunities at PharMAIR were exceptional. I connected with key industry leaders and formed collaborations that directly impacted our research pipeline.",
                name: "Dr. James Wilson",
                role: "Head of R&D, BioGenesis Pharmaceuticals",
              },
              {
                quote:
                  "As a first-time attendee, I was impressed by the quality of presentations and workshops. The knowledge I gained has been instrumental in advancing our clinical trial methodologies.",
                name: "Dr. Aisha Patel",
                role: "Clinical Research Director, MediSphere",
              },
              {
                quote:
                  "PharMAIR consistently delivers cutting-edge content that keeps our team at the forefront of pharmaceutical innovation. It's the one conference we never miss.",
                name: "Prof. Thomas Lee",
                role: "Department Chair, University of Medical Sciences",
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={scaleIn}
              >
                <Card variant="glass" className="h-full">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="mb-6 text-primary-400 dark:text-primary-300">
                      <StarIcon className="h-8 w-8 inline-block" />
                      <StarIcon className="h-8 w-8 inline-block" />
                      <StarIcon className="h-8 w-8 inline-block" />
                      <StarIcon className="h-8 w-8 inline-block" />
                      <StarIcon className="h-8 w-8 inline-block" />
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 italic mb-6 flex-grow">
                      &quot;{testimonial.quote}&quot;
                    </p>
                    <div>
                      <p className="font-bold">{testimonial.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {testimonial.role}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sponsors Section */}
      <section className="py-20 px-6 bg-white dark:bg-slate-900">
        <div className="container mx-auto">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gradient">
              Our Sponsors
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              PharMAIR is made possible through the generous support of industry
              leaders committed to advancing pharmaceutical sciences
            </p>
          </motion.div>

          <div className="mb-16">
            <h3 className="text-xl font-bold text-center mb-8">
              Platinum Sponsors
            </h3>
            <div className="flex flex-wrap justify-center gap-12 items-center">
              {[1, 2, 3].map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="h-24 w-48 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center"
                >
                  {/* Replace with actual sponsor logos */}
                  <div className="text-gray-400 dark:text-gray-500 font-medium">
                    Sponsor Logo
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="mb-16">
            <h3 className="text-xl font-bold text-center mb-8">
              Gold Sponsors
            </h3>
            <div className="flex flex-wrap justify-center gap-8 items-center">
              {[1, 2, 3, 4].map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="h-20 w-40 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center"
                >
                  {/* Replace with actual sponsor logos */}
                  <div className="text-gray-400 dark:text-gray-500 font-medium">
                    Sponsor Logo
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-center mb-8">
              Silver Sponsors
            </h3>
            <div className="flex flex-wrap justify-center gap-6 items-center">
              {[1, 2, 3, 4, 5].map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="h-16 w-32 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center"
                >
                  {/* Replace with actual sponsor logos */}
                  <div className="text-gray-400 dark:text-gray-500 font-medium">
                    Sponsor Logo
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="text-center mt-12">
            <Link href="/sponsors">
              <Button
                variant="outline"
                animate
                className="inline-flex items-center"
              >
                Become a Sponsor
                <ChevronRightIcon className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6 bg-gray-50 dark:bg-slate-950">
        <div className="container mx-auto">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gradient">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              Get answers to common questions about PharMAIR Conference{" "}
              {conferenceYear}
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            {[
              {
                question: "Who should attend PharMAIR Conference?",
                answer:
                  "PharMAIR is designed for pharmaceutical scientists, researchers, healthcare professionals, industry leaders, regulatory experts, and anyone involved in pharmaceutical innovation and patient care.",
              },
              {
                question: "How can I submit my research for presentation?",
                answer:
                  "Submissions are accepted through our Abstract Submission portal. All submissions undergo peer review by our Scientific Committee. Visit the Abstract Submission page for guidelines and deadlines.",
              },
              {
                question: "Are continuing education credits available?",
                answer:
                  "Yes, attendees can earn Continuing Education Units (CEUs) for participating in designated sessions. Certificates will be provided after successful completion of the required sessions.",
              },
              {
                question: "What networking opportunities are available?",
                answer:
                  "PharMAIR offers multiple networking events including welcome reception, poster sessions, themed lunch discussions, exhibitor meetings, and the gala dinner.",
              },
              {
                question: "Is there a virtual attendance option?",
                answer:
                  "Yes, we offer a hybrid format with virtual attendance options. Virtual attendees will have access to livestreamed sessions, digital networking platforms, and on-demand content.",
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={fadeIn}
                className="mb-6"
              >
                <Card
                  variant={index % 2 === 0 ? "default" : "glass"}
                  className="overflow-hidden"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="rounded-full p-2 bg-primary-100 dark:bg-primary-900">
                        <QuestionMarkCircleIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold mb-2">
                          {faq.question}
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/contact">
              <Button
                variant="default"
                animate
                className="inline-flex items-center"
              >
                Have More Questions? Contact Us
                <ChevronRightIcon className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section className="py-20 px-6 bg-white dark:bg-slate-900">
        <div className="container mx-auto">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gradient">
              Resources & Publications
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              Explore valuable resources from previous conferences and prepare
              for this year&apos;s event
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              {
                title: "Conference Proceedings",
                description:
                  "Access the complete collection of abstracts and papers from previous PharMAIR conferences",
                icon: (
                  <DocumentTextIcon className="h-10 w-10 text-primary-600 dark:text-primary-400" />
                ),
                link: "#",
              },
              {
                title: "Presenter Guidelines",
                description:
                  "Essential information for oral and poster presenters at this year's conference",
                icon: (
                  <AcademicCapIcon className="h-10 w-10 text-primary-600 dark:text-primary-400" />
                ),
                link: "#",
              },
              {
                title: "Industry Reports",
                description:
                  "Exclusive pharmaceutical industry trend reports and white papers",
                icon: (
                  <ChartBarIcon className="h-10 w-10 text-primary-600 dark:text-primary-400" />
                ),
                link: "#",
              },
            ].map((resource, index) => (
              <motion.div key={index} variants={fadeIn} className="group">
                <Card variant="glass" hover="raise" className="h-full">
                  <CardContent className="flex flex-col items-center text-center pt-8">
                    <div className="p-3 bg-primary-100 dark:bg-primary-900 rounded-full mb-4 transition-colors group-hover:bg-primary-200 dark:group-hover:bg-primary-900">
                      {resource.icon}
                    </div>
                    <h3 className="font-bold text-xl mb-2">{resource.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {resource.description}
                    </p>
                    <Link
                      href={resource.link}
                      className="mt-auto inline-flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
                    >
                      Access Resource
                      <ArrowTopRightOnSquareIcon className="ml-1 h-4 w-4" />
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Registration CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-primary-600 to-secondary-600 dark:from-primary-800 dark:to-secondary-800">
        <div className="container mx-auto">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Ready to be part of Pharmair {conferenceYear}?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Secure your spot at the pharmaceutical industry&apos;s most
              anticipated event of the year. Early bird registration ends July
              31, {conferenceYear}.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                variant="glass"
                size="xl"
                animate
                onClick={() => (window.location.href = "/registration")}
              >
                Register Now
              </Button>
              <Button
                variant="outline"
                size="xl"
                className="border-white text-white hover:bg-white/10"
                animate
                onClick={() => (window.location.href = "/contact")}
              >
                Contact Us
              </Button>
            </div>

            {/* Mobile countdown timer */}
            <div className="mt-12 md:hidden">
              <CountdownTimer
                targetDate={conferenceDate}
                className="bg-white/10 p-6 rounded-xl"
              />
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
