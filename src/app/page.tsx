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
  AcademicCapIcon,
  ClockIcon,
  BuildingOfficeIcon,
  ArrowPathIcon,
  GlobeAltIcon,
  LightBulbIcon,
  ShieldCheckIcon,
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

  const slideInLeft = {
    initial: { opacity: 0, x: -30 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.7 },
  };

  const slideInRight = {
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.7 },
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

      {/* NEW SECTION: Key Topics & Tracks */}
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
              Key Topics & Tracks
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              Explore cutting-edge research and innovations across specialized
              tracks designed for pharmacy and healthcare professionals
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
            {[
              {
                title: "Pharmaceutical AI & Machine Learning",
                description:
                  "Applications of artificial intelligence in drug discovery, development, and personalized medicine",
                icon: (
                  <LightBulbIcon className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                ),
                color: "from-blue-500 to-cyan-400",
              },
              {
                title: "Next-Gen Drug Delivery Systems",
                description:
                  "Innovative methods for targeted drug delivery and improved patient outcomes",
                icon: (
                  <GlobeAltIcon className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                ),
                color: "from-purple-500 to-pink-500",
              },
              {
                title: "Regulatory Affairs & Compliance",
                description:
                  "Navigating complex regulatory landscapes and ensuring compliance in global markets",
                icon: (
                  <ShieldCheckIcon className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                ),
                color: "from-amber-500 to-orange-500",
              },
              {
                title: "Digital Health & Telemedicine",
                description:
                  "How digital technologies are transforming healthcare delivery and patient monitoring",
                icon: (
                  <ArrowPathIcon className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                ),
                color: "from-green-500 to-emerald-500",
              },
              {
                title: "Sustainable Pharmaceutical Production",
                description:
                  "Eco-friendly approaches to manufacturing and distributing pharmaceuticals",
                icon: (
                  <BuildingOfficeIcon className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                ),
                color: "from-teal-500 to-cyan-500",
              },
              {
                title: "Personalized Medicine & Pharmacogenomics",
                description:
                  "Tailoring medical treatment to individual genetic profiles for optimal efficacy",
                icon: (
                  <AcademicCapIcon className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                ),
                color: "from-indigo-500 to-blue-500",
              },
            ].map((track, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                className="group"
              >
                <Card
                  variant="default"
                  hover="raise"
                  className="h-full overflow-hidden border-0 dark:border-gray-800"
                >
                  <div className={`h-2 bg-gradient-to-r ${track.color}`}></div>
                  <CardContent className="p-6">
                    <div className="flex items-start mb-4">
                      <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                        {track.icon}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-3">{track.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {track.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/agenda">
              <Button
                variant="outline"
                animate
                className="inline-flex items-center"
              >
                See Full Agenda
                <ChevronRightIcon className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* NEW SECTION: Conference Schedule Highlights */}
      <section className="py-20 px-6 bg-gray-50 dark:bg-slate-950 relative overflow-hidden">
        <div className="container mx-auto relative z-10">
          <motion.div
            className="max-w-3xl mx-auto text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gradient">
              Conference Schedule Highlights
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              A preview of the key events during our four-day pharmaceutical
              innovation conference
            </p>
          </motion.div>

          <div className="relative max-w-4xl mx-auto">
            <div className="absolute left-5 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-300 via-primary-500 to-secondary-500 dark:from-primary-700 dark:via-primary-600 dark:to-secondary-700 md:transform md:-translate-x-1/2"></div>

            {[
              {
                day: "Day 1 - September 15",
                title: "Opening Ceremony & Keynotes",
                description:
                  "Join our opening ceremony featuring addresses from industry leaders and policy makers, setting the stage for three days of innovation and discovery.",
                time: "9:00 AM - 5:00 PM",
                align: "right",
              },
              {
                day: "Day 2 - September 16",
                title: "Research Presentations & Workshops",
                description:
                  "Dive into cutting-edge research presentations and participate in hands-on workshops across multiple tracks and specialties.",
                time: "8:30 AM - 6:00 PM",
                align: "left",
              },
              {
                day: "Day 3 - September 17",
                title: "Industry Panel Discussions & Networking",
                description:
                  "Engage with panel discussions on pressing industry challenges and expand your professional network at our gala dinner event.",
                time: "9:00 AM - 9:00 PM",
                align: "right",
              },
              {
                day: "Day 4 - September 18",
                title: "Innovation Showcase & Closing Ceremony",
                description:
                  "Witness the latest innovations in pharmaceutical technology, followed by awards presentation and closing remarks.",
                time: "9:00 AM - 3:00 PM",
                align: "left",
              },
            ].map((day, index) => (
              <motion.div
                key={index}
                className={`relative flex items-start mb-12 ${
                  day.align === "right"
                    ? "md:flex-row"
                    : "md:flex-row-reverse text-right md:text-left"
                }`}
                variants={day.align === "right" ? slideInLeft : slideInRight}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
              >
                <div
                  className={`hidden md:block w-1/2 ${day.align === "right" ? "pr-12" : "pl-12"}`}
                ></div>

                <div className="absolute left-5 md:left-1/2 w-5 h-5 rounded-full bg-primary-500 dark:bg-primary-400 transform -translate-y-1 md:-translate-x-1/2 z-10 border-4 border-white dark:border-slate-900"></div>

                <div
                  className={`pl-10 md:pl-0 ${
                    day.align === "right"
                      ? "md:pl-12 md:w-1/2"
                      : "md:pr-12 md:w-1/2"
                  }`}
                >
                  <Card
                    variant="glass"
                    hover="glow"
                    className="overflow-hidden border border-gray-200 dark:border-gray-800"
                  >
                    <CardContent className="p-6">
                      <p className="text-sm font-semibold text-primary-600 dark:text-primary-400 mb-1">
                        {day.day}
                      </p>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold">{day.title}</h3>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {day.description}
                      </p>
                      <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        {day.time}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/agenda">
              <Button
                variant="default"
                animate
                className="inline-flex items-center"
              >
                View Complete Schedule
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

      {/* NEW SECTION: Sponsors & Partners */}
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
              Our Sponsors & Partners
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              Pharmair {conferenceYear} is made possible by the support of these
              industry-leading organizations
            </p>
          </motion.div>

          <div className="mb-16">
            <h3 className="text-center text-xl font-bold mb-8 text-primary-600 dark:text-primary-400">
              Platinum Sponsors
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-items-center">
              {[1, 2, 3, 4].map((sponsor, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-center justify-center w-full"
                >
                  <div className="h-20 w-full bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center text-gray-400">
                    <BuildingOfficeIcon className="h-10 w-10" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="text-center mt-12">
            <Button
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
        </div>
      </section>
    </>
  );
}
