"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

// Sponsor data with placeholder logos
const sponsors = {
  platinum: [
    {
      id: 1,
      name: "Pharma Global",
      logo: "/placeholder-logo.svg",
      website: "https://example.com",
    },
    {
      id: 2,
      name: "MediTech Solutions",
      logo: "/placeholder-logo.svg",
      website: "https://example.com",
    },
  ],
  gold: [
    {
      id: 3,
      name: "BioResearch Inc",
      logo: "/placeholder-logo.svg",
      website: "https://example.com",
    },
    {
      id: 4,
      name: "HealthCare Partners",
      logo: "/placeholder-logo.svg",
      website: "https://example.com",
    },
    {
      id: 5,
      name: "PharmaDev Labs",
      logo: "/placeholder-logo.svg",
      website: "https://example.com",
    },
  ],
  silver: [
    {
      id: 6,
      name: "Medical Innovations",
      logo: "/placeholder-logo.svg",
      website: "https://example.com",
    },
    {
      id: 7,
      name: "BioEquip Co",
      logo: "/placeholder-logo.svg",
      website: "https://example.com",
    },
    {
      id: 8,
      name: "Research Analytics",
      logo: "/placeholder-logo.svg",
      website: "https://example.com",
    },
    {
      id: 9,
      name: "PharmaNet",
      logo: "/placeholder-logo.svg",
      website: "https://example.com",
    },
  ],
  partners: [
    {
      id: 10,
      name: "University of Science",
      logo: "/placeholder-logo.svg",
      website: "https://example.com",
    },
    {
      id: 11,
      name: "Healthcare Association",
      logo: "/placeholder-logo.svg",
      website: "https://example.com",
    },
    {
      id: 12,
      name: "Biotech Alliance",
      logo: "/placeholder-logo.svg",
      website: "https://example.com",
    },
    {
      id: 13,
      name: "Research Institute",
      logo: "/placeholder-logo.svg",
      website: "https://example.com",
    },
    {
      id: 14,
      name: "Global Health Initiative",
      logo: "/placeholder-logo.svg",
      website: "https://example.com",
    },
  ],
};

// Sponsorship packages data
const sponsorshipPackages = [
  {
    level: "Platinum",
    price: "$25,000",
    benefits: [
      "Premium exhibit space (10×10 booth)",
      "Company logo on conference website with link",
      "5 complimentary conference registrations",
      "Full-page ad in conference program",
      "Premium logo placement on all conference materials",
      "Acknowledgment during opening and closing ceremonies",
      "Promotional material in conference bags",
      "30-minute speaking opportunity",
      "Access to attendee list",
      "Social media promotion",
    ],
  },
  {
    level: "Gold",
    price: "$15,000",
    benefits: [
      "Standard exhibit space (8×8 booth)",
      "Company logo on conference website with link",
      "3 complimentary conference registrations",
      "Half-page ad in conference program",
      "Logo on conference materials",
      "Acknowledgment during opening ceremony",
      "Promotional material in conference bags",
      "Access to attendee list",
      "Social media mention",
    ],
  },
  {
    level: "Silver",
    price: "$7,500",
    benefits: [
      "Standard exhibit space (6×6 booth)",
      "Company name on conference website",
      "2 complimentary conference registrations",
      "Quarter-page ad in conference program",
      "Logo on select conference materials",
      "Promotional material in conference bags",
      "Social media mention",
    ],
  },
  {
    level: "Bronze",
    price: "$3,500",
    benefits: [
      "Tabletop display",
      "Company name on conference website",
      "1 complimentary conference registration",
      "Business card ad in conference program",
      "Logo on select conference materials",
    ],
  },
];

export default function SponsorsPage() {
  const [activePackage, setActivePackage] = useState<number | null>(null);

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
              Sponsors & Partners
            </motion.h1>
            <motion.p
              className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              We thank our sponsors and partners for making the 3rd Pharmair
              International Conference possible
            </motion.p>
          </div>
        </div>
      </section>

      {/* Current Sponsors Section */}
      <section className="py-12">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Our Sponsors</h2>

          {/* Platinum Sponsors */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-primary-800 dark:text-primary-300 text-center mb-8">
              Platinum Sponsors
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sponsors.platinum.map((sponsor) => (
                <motion.div
                  key={sponsor.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <Card variant="glass" hover="glow" className="h-full">
                    <CardContent className="flex flex-col items-center p-8">
                      <div className="bg-white dark:bg-slate-800 rounded-xl p-8 w-56 h-56 flex items-center justify-center mb-4">
                        <div className="text-2xl font-bold text-primary-600 text-center">
                          {sponsor.name}
                        </div>
                      </div>
                      <h4 className="text-xl font-semibold mt-2">
                        {sponsor.name}
                      </h4>
                      <Link
                        href={sponsor.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 text-primary-600 dark:text-primary-400 hover:underline"
                      >
                        Visit Website
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Gold Sponsors */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-yellow-600 dark:text-yellow-500 text-center mb-8">
              Gold Sponsors
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {sponsors.gold.map((sponsor) => (
                <motion.div
                  key={sponsor.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <Card variant="glass" hover="raise" className="h-full">
                    <CardContent className="flex flex-col items-center p-6">
                      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 w-40 h-40 flex items-center justify-center mb-4">
                        <div className="text-xl font-bold text-primary-600 text-center">
                          {sponsor.name}
                        </div>
                      </div>
                      <h4 className="text-lg font-semibold mt-2">
                        {sponsor.name}
                      </h4>
                      <Link
                        href={sponsor.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 text-primary-600 dark:text-primary-400 hover:underline"
                      >
                        Visit Website
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Silver Sponsors */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-gray-500 dark:text-gray-400 text-center mb-8">
              Silver Sponsors
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {sponsors.silver.map((sponsor) => (
                <motion.div
                  key={sponsor.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <Card variant="glass" className="h-full">
                    <CardContent className="flex flex-col items-center p-4">
                      <div className="bg-white dark:bg-slate-800 rounded-lg p-4 w-32 h-32 flex items-center justify-center mb-3">
                        <div className="text-lg font-bold text-primary-600 text-center">
                          {sponsor.name}
                        </div>
                      </div>
                      <h4 className="text-base font-semibold mt-2">
                        {sponsor.name}
                      </h4>
                      <Link
                        href={sponsor.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 text-sm text-primary-600 dark:text-primary-400 hover:underline"
                      >
                        Visit Website
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Partners */}
          <div>
            <h3 className="text-2xl font-bold text-center mb-8">
              Academic & Industry Partners
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              {sponsors.partners.map((partner) => (
                <motion.div
                  key={partner.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  viewport={{ once: true }}
                  className="bg-white dark:bg-slate-800 rounded-lg p-3 w-32 h-32 flex items-center justify-center"
                >
                  <div className="text-center">
                    <div className="text-sm font-bold text-primary-600">
                      {partner.name}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Sponsorship Packages Section */}
      <section className="py-12 bg-gray-50 dark:bg-slate-900">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Become a Sponsor</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              Join leading organizations in supporting the pharmaceutical
              industry&apos;s premier conference. We offer various sponsorship
              packages to maximize your organization&apos;s visibility.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sponsorshipPackages.map((pkg, index) => (
              <motion.div
                key={pkg.level}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card
                  variant={pkg.level === "Platinum" ? "gradient" : "default"}
                  className={`h-full ${
                    pkg.level === "Platinum"
                      ? "border-2 border-primary-500"
                      : ""
                  }`}
                >
                  <CardHeader>
                    <CardTitle className="text-center">{pkg.level}</CardTitle>
                    <p className="text-2xl font-bold text-center mt-2">
                      {pkg.price}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {pkg.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-start">
                          <svg
                            className="h-5 w-5 text-primary-600 dark:text-primary-400 mr-2 flex-shrink-0"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span className="text-sm">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="flex justify-center">
                    <Button
                      variant={pkg.level === "Platinum" ? "default" : "outline"}
                      onClick={() =>
                        setActivePackage(index === activePackage ? null : index)
                      }
                    >
                      Learn More
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="mb-6 text-gray-700 dark:text-gray-300">
              Interested in a custom sponsorship package? Contact our
              sponsorship team to discuss tailored options for your
              organization.
            </p>
            <Button
              variant="glass"
              size="lg"
              onClick={() => (window.location.href = "/contact")}
            >
              Contact Sponsorship Team
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
