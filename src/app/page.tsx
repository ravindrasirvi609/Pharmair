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
              <span className="block">Pharmair Conference</span>
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
                onClick={() => (window.location.href = "/agenda")}
              >
                View Schedule
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
