"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserGroupIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

// Speaker data type
interface Speaker {
  id: number;
  name: string;
  role: string;
  organization: string;
  country: string;
  bio: string;
  topics: string[];
  track: string;
  image: string;
  featured: boolean;
}

export default function SpeakersPage() {
  // Sample speaker data
  const speakerData: Speaker[] = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      role: "Chief Medical Officer",
      organization: "NovaTech Pharmaceuticals",
      country: "United States",
      bio: "Dr. Johnson leads research in next-generation drug delivery systems with over 15 years of experience in pharmaceutical innovation.",
      topics: ["Drug Delivery", "Clinical Trials", "Regulatory Affairs"],
      track: "Clinical Development",
      image: "/profile1.jpg",
      featured: true,
    },
    {
      id: 2,
      name: "Prof. Michael Chang",
      role: "Research Director",
      organization: "Global Health Institute",
      country: "Singapore",
      bio: "Prof. Chang's work on sustainable pharmaceutical manufacturing has transformed industry standards across Asia and Europe.",
      topics: ["Manufacturing", "Sustainability", "Process Optimization"],
      track: "Manufacturing",
      image: "/profile2.jpg",
      featured: true,
    },
    {
      id: 3,
      name: "Dr. Elena Rodriguez",
      role: "Head of Innovation",
      organization: "MediCore Labs",
      country: "Spain",
      bio: "Dr. Rodriguez specializes in applying artificial intelligence to accelerate drug discovery and development pipelines.",
      topics: ["AI & Machine Learning", "Drug Discovery", "Bioinformatics"],
      track: "Research & Discovery",
      image: "/profile3.jpg",
      featured: true,
    },
    {
      id: 4,
      name: "Dr. James Wilson",
      role: "VP of Clinical Development",
      organization: "Biogen",
      country: "United Kingdom",
      bio: "Dr. Wilson has led over 20 successful clinical trials for novel therapeutics targeting neurological disorders.",
      topics: ["Neurology", "Clinical Trials", "Drug Safety"],
      track: "Clinical Development",
      image: "/profile4.jpg",
      featured: false,
    },
    {
      id: 5,
      name: "Dr. Aisha Patel",
      role: "Director of Regulatory Affairs",
      organization: "Pfizer",
      country: "India",
      bio: "Dr. Patel is an expert in global regulatory strategies for pharmaceutical products, with particular focus on emerging markets.",
      topics: ["Regulatory Affairs", "Market Access", "Policy"],
      track: "Regulatory & Compliance",
      image: "/profile5.jpg",
      featured: false,
    },
    {
      id: 6,
      name: "Prof. Hiroshi Tanaka",
      role: "Chief Scientific Officer",
      organization: "Tokyo Medical Research Center",
      country: "Japan",
      bio: "Prof. Tanaka's research on personalized medicine using genomic data has pioneered new approaches to treating cancer.",
      topics: ["Genomics", "Personalized Medicine", "Oncology"],
      track: "Research & Discovery",
      image: "/profile6.jpg",
      featured: false,
    },
    {
      id: 7,
      name: "Dr. Olivia Martinez",
      role: "Senior Researcher",
      organization: "Mayo Clinic",
      country: "United States",
      bio: "Dr. Martinez focuses on developing novel immunotherapies for autoimmune disorders and infectious diseases.",
      topics: ["Immunology", "Vaccine Development", "Clinical Trials"],
      track: "Clinical Development",
      image: "/profile7.jpg",
      featured: false,
    },
    {
      id: 8,
      name: "Dr. Thomas Weber",
      role: "Head of Digital Health",
      organization: "Roche",
      country: "Germany",
      bio: "Dr. Weber leads initiatives integrating digital technologies, IoT, and data analytics into healthcare delivery and pharmaceutical research.",
      topics: ["Digital Health", "Data Science", "Healthcare IoT"],
      track: "Digital & Technology",
      image: "/profile8.jpg",
      featured: false,
    },
  ];

  // Available filters
  const tracks = Array.from(
    new Set(speakerData.map((speaker) => speaker.track))
  );
  const countries = Array.from(
    new Set(speakerData.map((speaker) => speaker.country))
  );
  const topics = Array.from(
    new Set(speakerData.flatMap((speaker) => speaker.topics))
  );

  // State for filters and search
  const [activeTrack, setActiveTrack] = useState<string | null>(null);
  const [activeCountry, setActiveCountry] = useState<string | null>(null);
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [displayedSpeakers, setDisplayedSpeakers] =
    useState<Speaker[]>(speakerData);

  // Filter speakers based on selected filters and search query
  useEffect(() => {
    let filtered = speakerData;

    if (activeTrack) {
      filtered = filtered.filter((speaker) => speaker.track === activeTrack);
    }

    if (activeCountry) {
      filtered = filtered.filter(
        (speaker) => speaker.country === activeCountry
      );
    }

    if (activeTopic) {
      filtered = filtered.filter((speaker) =>
        speaker.topics.includes(activeTopic)
      );
    }

    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (speaker) =>
          speaker.name.toLowerCase().includes(query) ||
          speaker.role.toLowerCase().includes(query) ||
          speaker.organization.toLowerCase().includes(query) ||
          speaker.bio.toLowerCase().includes(query)
      );
    }

    setDisplayedSpeakers(filtered);
  }, [activeTrack, activeCountry, activeTopic, searchQuery]);

  // Reset all filters
  const resetFilters = () => {
    setActiveTrack(null);
    setActiveCountry(null);
    setActiveTopic(null);
    setSearchQuery("");
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
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
              Our Speakers
            </h1>
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">
              Meet the industry experts and thought leaders who will be sharing
              their knowledge and insights
            </p>
          </motion.div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-secondary-200 dark:bg-secondary-900/30 rounded-full opacity-50 blur-3xl" />
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary-200 dark:bg-primary-900/30 rounded-full opacity-50 blur-3xl" />
      </section>

      {/* Filters and Search Section */}
      <section className="py-10 px-6 bg-white dark:bg-slate-900/50 sticky top-16 z-20 shadow-sm backdrop-blur-sm">
        <div className="container mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Search input */}
            <div className="relative w-full md:w-auto flex-grow md:max-w-sm">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search speakers..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Filter dropdowns */}
            <div className="flex flex-wrap gap-3">
              {/* Track filter */}
              <select
                value={activeTrack ?? ""}
                onChange={(e) => setActiveTrack(e.target.value || null)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100"
              >
                <option value="">All Tracks</option>
                {tracks.map((track) => (
                  <option key={track} value={track}>
                    {track}
                  </option>
                ))}
              </select>

              {/* Country filter */}
              <select
                value={activeCountry ?? ""}
                onChange={(e) => setActiveCountry(e.target.value || null)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100"
              >
                <option value="">All Countries</option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>

              {/* Topic filter */}
              <select
                value={activeTopic ?? ""}
                onChange={(e) => setActiveTopic(e.target.value || null)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100"
              >
                <option value="">All Topics</option>
                {topics.map((topic) => (
                  <option key={topic} value={topic}>
                    {topic}
                  </option>
                ))}
              </select>

              {/* Reset filters button */}
              <Button
                variant="outline"
                onClick={resetFilters}
                className="whitespace-nowrap"
              >
                Reset Filters
              </Button>
            </div>
          </div>

          {/* Results count */}
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Showing {displayedSpeakers.length} of {speakerData.length} speakers
          </div>
        </div>
      </section>

      {/* Speakers Grid */}
      <section className="py-12 px-6">
        <div className="container mx-auto">
          {displayedSpeakers.length === 0 ? (
            <div className="text-center py-20">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-gray-600 dark:text-gray-400"
              >
                <p className="text-2xl font-semibold mb-4">No speakers found</p>
                <p>Try adjusting your filters or search query</p>
                <Button
                  variant="default"
                  className="mt-6"
                  onClick={resetFilters}
                >
                  Clear All Filters
                </Button>
              </motion.div>
            </div>
          ) : (
            <motion.div
              className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <AnimatePresence>
                {displayedSpeakers.map((speaker) => (
                  <motion.div
                    key={speaker.id}
                    variants={itemVariants}
                    layout
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex"
                  >
                    <Card
                      variant={speaker.featured ? "gradient" : "default"}
                      hover="raise"
                      className="w-full overflow-hidden flex flex-col"
                    >
                      <div className="relative h-64 bg-gray-200 dark:bg-gray-700">
                        {/* This would be replaced with actual images in a real implementation */}
                        <div className="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-500">
                          <UserGroupIcon className="h-16 w-16" />
                        </div>

                        {speaker.featured && (
                          <div className="absolute top-4 right-4 bg-secondary-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                            Featured
                          </div>
                        )}
                      </div>

                      <CardContent className="flex-grow flex flex-col">
                        <h3 className="text-xl font-bold mb-1">
                          {speaker.name}
                        </h3>
                        <p className="text-primary-600 dark:text-primary-400 font-medium">
                          {speaker.role}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400 mb-3">
                          {speaker.organization}, {speaker.country}
                        </p>

                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
                          {speaker.bio}
                        </p>

                        <div className="mt-auto">
                          <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Track: {speaker.track}
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {speaker.topics.map((topic, index) => (
                              <span
                                key={index}
                                className="inline-block bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-xs px-2 py-1 rounded-full"
                              >
                                {topic}
                              </span>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

      {/* Featured Panel Section */}
      <section className="py-16 px-6 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-slate-900 dark:to-slate-950">
        <div className="container mx-auto">
          <motion.div
            className="max-w-3xl mx-auto text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gradient">
              Featured Panels
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              Join these exciting discussion panels featuring our distinguished
              speakers
            </p>
          </motion.div>
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gradient">
              Featured Panels
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              Join these exciting discussion panels featuring our distinguished
              speakers
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: "Future of Personalized Medicine",
                description:
                  "Explore how genomics, AI, and advanced diagnostics are transforming patient care and treatment protocols.",
                speakers: [
                  "Dr. Sarah Johnson",
                  "Prof. Hiroshi Tanaka",
                  "Dr. Thomas Weber",
                ],
                time: "September 16, 10:00 AM - 11:30 AM",
                location: "Main Hall A",
              },
              {
                title: "Sustainable Pharmaceutical Manufacturing",
                description:
                  "Discussing innovative approaches to reduce environmental impact while maintaining quality and efficiency.",
                speakers: [
                  "Prof. Michael Chang",
                  "Dr. Aisha Patel",
                  "Dr. Elena Rodriguez",
                ],
                time: "September 17, 2:00 PM - 3:30 PM",
                location: "Conference Room C",
              },
            ].map((panel, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: index * 0.1 }}
              >
                <Card variant="glass" hover="glow" className="h-full">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold mb-4">{panel.title}</h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-6">
                      {panel.description}
                    </p>

                    <div className="mb-4"></div>
                    <h4 className="text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                      Featuring
                    </h4>
                    <ul className="space-y-1">
                      {panel.speakers.map((speaker, i) => (
                        <li
                          key={i}
                          className="text-primary-600 dark:text-primary-400 font-medium"
                        >
                          {speaker}
                        </li>
                      ))}
                    </ul>

                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <div className="mb-1">{panel.time}</div>
                      <div>{panel.location}</div>
                    </div>
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
