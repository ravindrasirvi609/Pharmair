"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

// Conference schedule data
const conferenceDays = [
  {
    date: "April 10, 2025",
    dayNumber: 1,
    tracks: [
      {
        name: "Main Hall",
        events: [
          {
            time: "08:00 - 09:00",
            title: "Registration & Breakfast",
            description: "Check-in and morning refreshments",
          },
          {
            time: "09:00 - 09:30",
            title: "Opening Ceremony",
            description: "Welcome address by conference chair",
          },
          {
            time: "09:30 - 10:30",
            title: "Keynote: Future of Pharmaceutical Research",
            description: "Dr. Elena Rodriguez, Stanford University",
            type: "keynote",
          },
          {
            time: "10:30 - 11:00",
            title: "Coffee Break",
            description: "Networking opportunity",
          },
          {
            time: "11:00 - 12:30",
            title: "Panel Discussion: Regulatory Challenges",
            description:
              "Industry experts discuss global regulatory frameworks",
            type: "panel",
          },
          {
            time: "12:30 - 14:00",
            title: "Lunch",
            description: "Catered networking lunch",
          },
          {
            time: "14:00 - 15:30",
            title: "Innovations in Drug Delivery",
            description: "Dr. Michael Chen, Harvard Medical School",
            type: "presentation",
          },
          {
            time: "15:30 - 16:00",
            title: "Coffee Break",
            description: "Afternoon refreshments",
          },
          {
            time: "16:00 - 17:30",
            title: "AI Applications in Pharmaceutical Research",
            description: "Panel of AI and pharma experts",
            type: "workshop",
          },
          {
            time: "18:00 - 20:00",
            title: "Welcome Reception",
            description: "Cocktails and networking",
            type: "social",
          },
        ],
      },
      {
        name: "Workshop Room A",
        events: [
          {
            time: "11:00 - 12:30",
            title: "Workshop: Clinical Trial Design",
            description:
              "Interactive session on optimizing trial methodologies",
            type: "workshop",
          },
          {
            time: "14:00 - 15:30",
            title: "Data Analysis in Pharma Research",
            description: "Hands-on statistical methods workshop",
            type: "workshop",
          },
          {
            time: "16:00 - 17:30",
            title: "Regulatory Compliance Workshop",
            description: "Practical approach to FDA and EMA regulations",
            type: "workshop",
          },
        ],
      },
    ],
  },
  {
    date: "April 11, 2025",
    dayNumber: 2,
    tracks: [
      {
        name: "Main Hall",
        events: [
          {
            time: "08:30 - 09:00",
            title: "Morning Coffee",
            description: "Start your day with networking",
          },
          {
            time: "09:00 - 10:00",
            title: "Keynote: Precision Medicine Revolution",
            description: "Prof. Sarah Johnson, MIT",
            type: "keynote",
          },
          {
            time: "10:00 - 10:30",
            title: "Coffee Break",
            description: "Morning refreshments",
          },
          {
            time: "10:30 - 12:00",
            title: "Sustainable Pharmaceutical Manufacturing",
            description: "Industry approaches to reducing environmental impact",
            type: "panel",
          },
          {
            time: "12:00 - 13:30",
            title: "Lunch",
            description: "Catered networking lunch",
          },
          {
            time: "13:30 - 15:00",
            title: "Digital Transformation in Healthcare",
            description: "Dr. Robert Park, Digital Health Institute",
            type: "presentation",
          },
          {
            time: "15:00 - 15:30",
            title: "Coffee Break",
            description: "Afternoon refreshments",
          },
          {
            time: "15:30 - 17:00",
            title: "Future of Personalized Therapies",
            description: "Innovations in treatment customization",
            type: "presentation",
          },
          {
            time: "19:00 - 22:00",
            title: "Gala Dinner",
            description: "Awards ceremony and dinner at Grand Hotel",
            type: "social",
          },
        ],
      },
      {
        name: "Workshop Room A",
        events: [
          {
            time: "10:30 - 12:00",
            title: "Workshop: Drug Formulation Techniques",
            description: "Hands-on demonstration of novel formulation methods",
            type: "workshop",
          },
          {
            time: "13:30 - 15:00",
            title: "Patent Strategy Workshop",
            description:
              "Maximizing IP protection for pharmaceutical innovations",
            type: "workshop",
          },
          {
            time: "15:30 - 17:00",
            title: "Digital Marketing for Pharma",
            description:
              "Effective communication strategies in regulated industries",
            type: "workshop",
          },
        ],
      },
    ],
  },
  {
    date: "April 12, 2025",
    dayNumber: 3,
    tracks: [
      {
        name: "Main Hall",
        events: [
          {
            time: "08:30 - 09:00",
            title: "Morning Coffee",
            description: "Final day networking",
          },
          {
            time: "09:00 - 10:00",
            title: "Keynote: Global Health Challenges",
            description: "Dr. William Tan, WHO Representative",
            type: "keynote",
          },
          {
            time: "10:00 - 10:30",
            title: "Coffee Break",
            description: "Morning refreshments",
          },
          {
            time: "10:30 - 12:00",
            title: "Emerging Markets and Access to Medicines",
            description: "Panel on global healthcare equity",
            type: "panel",
          },
          {
            time: "12:00 - 13:30",
            title: "Lunch",
            description: "Catered networking lunch",
          },
          {
            time: "13:30 - 15:00",
            title: "Future Trends in Biotechnology",
            description: "Dr. Lisa Wong, Biotech Innovations",
            type: "presentation",
          },
          {
            time: "15:00 - 15:30",
            title: "Coffee Break",
            description: "Afternoon refreshments",
          },
          {
            time: "15:30 - 16:30",
            title: "Closing Keynote: Building Tomorrow's Healthcare",
            description: "Industry vision for the next decade",
            type: "keynote",
          },
          {
            time: "16:30 - 17:00",
            title: "Closing Remarks & Next Conference Announcement",
            description: "Conference wrap-up and future plans",
          },
        ],
      },
      {
        name: "Workshop Room A",
        events: [
          {
            time: "10:30 - 12:00",
            title: "Workshop: Quality Control in Manufacturing",
            description: "Best practices for pharmaceutical quality assurance",
            type: "workshop",
          },
          {
            time: "13:30 - 15:00",
            title: "Grant Writing for Research Funding",
            description:
              "Strategies for securing pharmaceutical research grants",
            type: "workshop",
          },
        ],
      },
    ],
  },
];

// Define the event type for styling
const getEventTypeStyles = (type: string | undefined) => {
  switch (type) {
    case "keynote":
      return "border-l-4 border-secondary-500";
    case "panel":
      return "border-l-4 border-primary-500";
    case "workshop":
      return "border-l-4 border-green-500";
    case "presentation":
      return "border-l-4 border-amber-500";
    case "social":
      return "border-l-4 border-purple-500";
    default:
      return "border-l-4 border-gray-300 dark:border-gray-700";
  }
};

export default function AgendaPage() {
  const [activeDay, setActiveDay] = useState(1);

  const currentDayData = conferenceDays.find(
    (day) => day.dayNumber === activeDay
  );

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
              Conference Agenda
            </motion.h1>
            <motion.p
              className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Explore our comprehensive schedule of keynotes, workshops, panels,
              and networking events
            </motion.p>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-wrap justify-center gap-2">
            {conferenceDays.map((day) => (
              <Button
                key={day.dayNumber}
                variant={activeDay === day.dayNumber ? "default" : "outline"}
                onClick={() => setActiveDay(day.dayNumber)}
                className="mb-2"
              >
                Day {day.dayNumber}: {day.date}
              </Button>
            ))}
          </div>

          {currentDayData && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-6">
                Day {currentDayData.dayNumber} - {currentDayData.date}
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {currentDayData.tracks.map((track, trackIndex) => (
                  <div key={trackIndex}>
                    <h3 className="text-xl font-semibold mb-4 text-primary-700 dark:text-primary-400">
                      {track.name}
                    </h3>
                    <div className="space-y-4">
                      {track.events.map((event, eventIndex) => (
                        <Card
                          key={eventIndex}
                          variant="default"
                          hover="raise"
                          animate={true}
                          className={`${getEventTypeStyles(event.type)}`}
                        >
                          <CardHeader>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {event.time}
                            </div>
                            <CardTitle className="mt-1">
                              {event.title}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {event.description}
                            </p>
                            {event.type && (
                              <div className="mt-2">
                                <span
                                  className={`inline-block px-2 py-1 text-xs rounded-full ${
                                    event.type === "keynote"
                                      ? "bg-secondary-100 text-secondary-800 dark:bg-secondary-900 dark:text-secondary-200"
                                      : event.type === "panel"
                                      ? "bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200"
                                      : event.type === "workshop"
                                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                      : event.type === "presentation"
                                      ? "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
                                      : event.type === "social"
                                      ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                                      : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                                  }`}
                                >
                                  {event.type.charAt(0).toUpperCase() +
                                    event.type.slice(1)}
                                </span>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-12 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              The schedule is subject to change. Please check back for updates.
            </p>
            <Button variant="glass" size="lg">
              Download Full Schedule (PDF)
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
