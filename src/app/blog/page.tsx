"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

// Blog post data
const blogPosts = [
  {
    id: 1,
    title: "Announcing Keynote Speakers for the 3rd Pharmair Conference",
    excerpt:
      "We are thrilled to announce our lineup of distinguished keynote speakers who will be sharing their insights at the upcoming Pharmair Conference.",
    date: "January 15, 2025",
    author: "Conference Committee",
    category: "Announcements",
    image: "/images/blog/keynote-speakers.jpg", // This path would need an actual image
    slug: "announcing-keynote-speakers",
  },
  {
    id: 2,
    title: "Innovations in Pharmaceutical Research: Trends to Watch",
    excerpt:
      "Explore the cutting-edge technologies and methodologies that are reshaping pharmaceutical research and development.",
    date: "February 2, 2025",
    author: "Dr. Elena Rodriguez",
    category: "Research",
    image: "/images/blog/pharma-research.jpg", // This path would need an actual image
    slug: "innovations-pharmaceutical-research",
  },
  {
    id: 3,
    title: "Regulatory Updates Every Pharmaceutical Professional Should Know",
    excerpt:
      "Stay informed about the latest regulatory changes affecting pharmaceutical development, manufacturing, and distribution.",
    date: "February 20, 2025",
    author: "Michael Chen, Regulatory Affairs",
    category: "Regulation",
    image: "/images/blog/regulatory-updates.jpg", // This path would need an actual image
    slug: "regulatory-updates-pharmaceutical",
  },
  {
    id: 4,
    title: "Networking at Pharmair: Making the Most of Your Experience",
    excerpt:
      "Maximize your networking opportunities at the upcoming Pharmair Conference with these practical tips and strategies.",
    date: "March 5, 2025",
    author: "Sarah Johnson, Event Coordinator",
    category: "Tips",
    image: "/images/blog/networking-tips.jpg", // This path would need an actual image
    slug: "networking-pharmair-conference",
  },
  {
    id: 5,
    title: "Sustainable Practices in Pharmaceutical Manufacturing",
    excerpt:
      "How the industry is embracing eco-friendly approaches to reduce environmental impact without compromising quality or safety.",
    date: "March 18, 2025",
    author: "Dr. Robert Park",
    category: "Sustainability",
    image: "/images/blog/sustainable-pharma.jpg", // This path would need an actual image
    slug: "sustainable-practices-pharmaceutical-manufacturing",
  },
];

// Categories for filtering
const categories = [
  "All",
  "Announcements",
  "Research",
  "Regulation",
  "Tips",
  "Sustainability",
];

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  // Filter posts based on selected category
  const filteredPosts =
    activeCategory === "All"
      ? blogPosts
      : blogPosts.filter((post) => post.category === activeCategory);

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
              Pharmair Blog
            </motion.h1>
            <motion.p
              className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Stay updated with the latest news, research highlights, and
              insights from the pharmaceutical industry
            </motion.p>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category filters */}
          <div className="mb-12 flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                onClick={() => setActiveCategory(category)}
                className="mb-2"
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Blog posts grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card
                  variant="glass"
                  hover="raise"
                  className="h-full flex flex-col"
                >
                  <div className="relative h-48 w-full">
                    <div className="bg-gradient-to-r from-primary-500 to-secondary-500 w-full h-full flex items-center justify-center text-white font-bold">
                      {/* Placeholder for actual image */}
                      Pharmair Blog
                    </div>
                    {/* Once you have actual images, uncomment this:
                    <Image 
                      src={post.image} 
                      alt={post.title} 
                      layout="fill" 
                      objectFit="cover"
                      className="rounded-t-xl"
                    /> */}
                    <div className="absolute top-2 right-2 bg-white dark:bg-slate-800 text-xs font-medium px-2 py-1 rounded-full">
                      {post.category}
                    </div>
                  </div>
                  <CardContent className="flex-1 flex flex-col">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      {post.date} • By {post.author}
                    </div>
                    <h3 className="text-xl font-bold mb-2 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="mt-auto">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="text-primary-600 dark:text-primary-400 font-medium hover:underline"
                      >
                        Read More →
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-12 flex justify-center">
            <div className="flex space-x-2">
              <Button variant="outline" disabled>
                Previous
              </Button>
              <Button variant="default">1</Button>
              <Button variant="outline">2</Button>
              <Button variant="outline">3</Button>
              <Button variant="outline">Next</Button>
            </div>
          </div>

          {/* Newsletter signup */}
          <div className="mt-16 glass dark:glass-dark rounded-xl p-8">
            <div className="max-w-2xl mx-auto text-center">
              <h3 className="text-2xl font-bold mb-4">
                Subscribe to Our Newsletter
              </h3>
              <p className="mb-6 text-gray-600 dark:text-gray-300">
                Get the latest updates, articles, and insights from the
                pharmaceutical industry delivered straight to your inbox.
              </p>
              <div className="sm:flex justify-center">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full sm:w-auto px-4 py-2 rounded-l-md border border-gray-300 dark:border-gray-700 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <Button className="w-full sm:w-auto mt-3 sm:mt-0 rounded-l-none">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
