"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  MapPinIcon,
  BuildingOfficeIcon,
  GlobeAltIcon,
  PaperAirplaneIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";

// Hotels data
const hotels = [
  {
    id: 1,
    name: "Hotel near Sultan ul Uloom College of Pharmacy",
    address: "Banjara Hills, Hyderabad, Telangana 500034",
    distance: "0.2 km from venue",
    rate: "$289/night",
    website: "https://example.com",
    amenities: [
      "Free Wi-Fi",
      "Business Center",
      "Fitness Center",
      "Restaurant",
      "Bar",
    ],
    conferenceRate: true,
  },
  {
    id: 2,
    name: "Nearby Hotel 2",
    address: "Masab Tank, Hyderabad, Telangana 500028",
    distance: "0.4 km from venue",
    rate: "$269/night",
    website: "https://example.com",
    amenities: ["Free Wi-Fi", "Spa", "Fitness Center", "Restaurant", "Pool"],
    conferenceRate: true,
  },
  {
    id: 3,
    name: "Courtyard by Marriott",
    address: "Mehdipatnam, Hyderabad, Telangana 500028",
    distance: "0.7 km from venue",
    rate: "$219/night",
    website: "https://example.com",
    amenities: ["Free Wi-Fi", "Business Center", "Fitness Center", "Café"],
    conferenceRate: true,
  },
  {
    id: 4,
    name: "NYC Luxury Suites",
    address: "Lakdi Ka Pul, Hyderabad, Telangana 500004",
    distance: "1.2 km from venue",
    rate: "$329/night",
    website: "https://example.com",
    amenities: ["Free Wi-Fi", "Kitchen", "Concierge", "Luxury Amenities"],
    conferenceRate: false,
  },
];

// Transportation options
const transportation = {
  airports: [
    {
      name: "John F. Kennedy International Airport (JFK)",
      code: "JFK",
      distance: "15 km from venue",
      transportOptions: [
        { type: "Taxi/Rideshare", cost: "$55-70", time: "45-60 minutes" },
        { type: "AirTrain + Subway", cost: "$10.75", time: "60-75 minutes" },
        { type: "Airport Shuttle", cost: "$20-25", time: "60-90 minutes" },
      ],
    },
    {
      name: "LaGuardia Airport (LGA)",
      code: "LGA",
      distance: "9 km from venue",
      transportOptions: [
        { type: "Taxi/Rideshare", cost: "$35-45", time: "30-45 minutes" },
        { type: "Bus + Subway", cost: "$2.75", time: "45-60 minutes" },
        { type: "Airport Shuttle", cost: "$15-20", time: "45-60 minutes" },
      ],
    },
    {
      name: "Newark Liberty International Airport (EWR)",
      code: "EWR",
      distance: "16 km from venue",
      transportOptions: [
        { type: "Taxi/Rideshare", cost: "$65-80", time: "45-60 minutes" },
        {
          type: "AirTrain + NJ Transit",
          cost: "$15.25",
          time: "60-75 minutes",
        },
        { type: "Airport Shuttle", cost: "$20-25", time: "60-90 minutes" },
      ],
    },
  ],
  localTransport: [
    {
      type: "Subway",
      description:
        "Sultan ul Uloom College of Pharmacy is easily accessible from all major parts of Hyderabad.",
    },
    {
      type: "Bus",
      description:
        "Several TSRTC bus routes stop near Sultan ul Uloom College of Pharmacy.",
    },
    {
      type: "Taxi/Rideshare",
      description:
        "Taxis and rideshare services are readily available throughout Hyderabad.",
    },
  ],
};

// Tab options for the venue page
type TabType = "venue" | "hotels" | "travel";

export default function VenuePage() {
  const [activeTab, setActiveTab] = useState<TabType>("venue");

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
              Venue & Travel
            </motion.h1>
            <motion.p
              className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Everything you need to know about the conference location,
              accommodations, and travel arrangements
            </motion.p>
          </div>
        </div>
      </section>

      {/* Tab navigation */}
      <section className="border-b border-gray-200 dark:border-gray-800">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto py-2 space-x-8">
            <button
              onClick={() => setActiveTab("venue")}
              className={`px-1 py-2 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === "venue"
                  ? "border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              <BuildingOfficeIcon className="inline-block h-5 w-5 mr-2" />
              Conference Venue
            </button>
            <button
              onClick={() => setActiveTab("hotels")}
              className={`px-1 py-2 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === "hotels"
                  ? "border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              <HomeIcon className="inline-block h-5 w-5 mr-2" />
              Accommodations
            </button>
            <button
              onClick={() => setActiveTab("travel")}
              className={`px-1 py-2 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === "travel"
                  ? "border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              <PaperAirplaneIcon className="inline-block h-5 w-5 mr-2 rotate-45" />
              Travel Information
            </button>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Venue Tab */}
          {activeTab === "venue" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-3xl font-bold mb-6">
                    Sultan ul Uloom College of Pharmacy
                  </h2>
                  <div className="prose dark:prose-invert max-w-none">
                    <p>
                      The 3rd Pharmair International Conference will take place
                      at the renowned Sultan ul Uloom College of Pharmacy, one
                      of Hyderabad&apos;s Pharmair event venues.
                    </p>
                    <p>
                      Located in the heart of Hyderabad, the college offers
                      state-of-the-art facilities, including expansive
                      exhibition halls, modern meeting rooms, and comfortable
                      spaces for networking and collaboration.
                    </p>
                  </div>

                  <div className="mt-8 space-y-4">
                    <div className="flex items-start">
                      <MapPinIcon className="h-6 w-6 text-primary-600 dark:text-primary-400 mr-3 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold">Address</h3>
                        <p className="text-gray-600 dark:text-gray-300">
                          Road Number 3, Banjara Hills
                          <br />
                          Hyderabad, Telangana 500034
                          <br />
                          India
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <GlobeAltIcon className="h-6 w-6 text-primary-600 dark:text-primary-400 mr-3 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold">Website</h3>
                        <p className="text-gray-600 dark:text-gray-300">
                          <a
                            href="https://sultanululoompharmacy.edu.in"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-600 dark:text-primary-400 hover:underline"
                          >
                            sultanululoompharmacy.edu.in
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h3 className="text-xl font-semibold mb-4">
                      Conference Layout
                    </h3>
                    <Card variant="glass" className="p-6">
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <span className="font-medium mr-2">
                            Main Hall (Level 1):
                          </span>
                          <span>
                            Plenary sessions, keynote presentations, exhibition
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="font-medium mr-2">
                            Meeting Rooms (Level 2):
                          </span>
                          <span>
                            Breakout sessions, workshops, panel discussions
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="font-medium mr-2">
                            River Pavilion (Level 4):
                          </span>
                          <span>Networking events, lunches, coffee breaks</span>
                        </li>
                        <li className="flex items-start">
                          <span className="font-medium mr-2">
                            Crystal Palace (Level 3):
                          </span>
                          <span>
                            Registration, information desk, poster presentations
                          </span>
                        </li>
                      </ul>
                      <div className="mt-4">
                        <Button variant="outline" size="sm">
                          Download Venue Map
                        </Button>
                      </div>
                    </Card>
                  </div>
                </div>

                <div>
                  <div className="aspect-video rounded-xl overflow-hidden glass">
                    {/* Replace with actual venue image */}
                    <div className="w-full h-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-white p-4 text-center">
                      Sultan ul Uloom College of Pharmacy Image Placeholder
                      <br />
                      (High-quality image of the venue would go here)
                    </div>
                  </div>

                  <div className="mt-8">
                    <h3 className="text-xl font-semibold mb-4">Location</h3>
                    <div className="h-64 rounded-xl overflow-hidden glass">
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

                  <div className="mt-8">
                    <h3 className="text-xl font-semibold mb-4">
                      Nearby Attractions
                    </h3>
                    <ul className="space-y-2">
                      <li>Hyderabad (0.2 miles) - Shopping & dining complex</li>
                      <li>High Line (0.3 miles) - Elevated linear park</li>
                      <li>Times Square (1.0 miles) - Entertainment district</li>
                      <li>
                        Empire State Building (1.2 miles) - Iconic skyscraper
                      </li>
                      <li>
                        Madison Square Garden (0.7 miles) - Sports &
                        entertainment venue
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Hotels Tab */}
          {activeTab === "hotels" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold mb-6">Accommodations</h2>
              <p className="text-lg mb-8">
                We&apos;ve partnered with several hotels near the conference
                venue to provide special rates for attendees. Book early to
                secure your preferred accommodation.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {hotels.map((hotel) => (
                  <Card key={hotel.id} variant="glass" hover="raise">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle>{hotel.name}</CardTitle>
                        {hotel.conferenceRate && (
                          <span className="inline-block bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full dark:bg-primary-900 dark:text-primary-200">
                            Conference Rate
                          </span>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Address
                          </p>
                          <p>{hotel.address}</p>
                        </div>
                        <div className="flex justify-between">
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Distance
                            </p>
                            <p>{hotel.distance}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Rate
                            </p>
                            <p className="font-semibold">{hotel.rate}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Amenities
                          </p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {hotel.amenities.map((amenity, index) => (
                              <span
                                key={index}
                                className="inline-block bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 text-xs px-2 py-1 rounded-full"
                              >
                                {amenity}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="pt-2">
                          <Link
                            href={hotel.website}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button variant="outline" className="w-full">
                              Book Now
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="mt-10 glass dark:glass-dark p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-2">
                  Booking Information
                </h3>
                <p className="mb-4">
                  To receive the special conference rate, use the booking code{" "}
                  <strong>PHARMAIR2025</strong> when making your reservation
                  directly with the hotel or through their website.
                </p>
                <p>
                  Conference rates are available for stays between April 8-14,
                  2025. Rates are subject to availability and early booking is
                  recommended.
                </p>
              </div>
            </motion.div>
          )}

          {/* Travel Tab */}
          {activeTab === "travel" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold mb-6">Travel Information</h2>

              <div className="space-y-12">
                {/* Airports Section */}
                <div>
                  <h3 className="text-2xl font-semibold mb-6">Airports</h3>
                  <div className="space-y-6">
                    {transportation.airports.map((airport) => (
                      <Card key={airport.code} variant="glass">
                        <CardHeader>
                          <CardTitle>
                            {airport.name} ({airport.code})
                          </CardTitle>
                          <p className="text-gray-600 dark:text-gray-300">
                            {airport.distance}
                          </p>
                        </CardHeader>
                        <CardContent>
                          <h4 className="font-semibold mb-2">
                            Transportation Options to Venue/Hotels:
                          </h4>
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b border-gray-200 dark:border-gray-700">
                                <th className="text-left py-2">Option</th>
                                <th className="text-left py-2">
                                  Estimated Cost
                                </th>
                                <th className="text-left py-2">Travel Time</th>
                              </tr>
                            </thead>
                            <tbody>
                              {airport.transportOptions.map((option, index) => (
                                <tr
                                  key={index}
                                  className="border-b border-gray-200 dark:border-gray-800"
                                >
                                  <td className="py-2">{option.type}</td>
                                  <td className="py-2">{option.cost}</td>
                                  <td className="py-2">{option.time}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Local Transportation */}
                <div>
                  <h3 className="text-2xl font-semibold mb-6">
                    Local Transportation
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {transportation.localTransport.map((option, index) => (
                      <Card key={index} variant="glass">
                        <CardHeader>
                          <CardTitle>{option.type}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p>{option.description}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Visa Information */}
                <div>
                  <h3 className="text-2xl font-semibold mb-4">
                    Visa Information
                  </h3>
                  <Card variant="glass" className="p-6">
                    <p className="mb-4">
                      International attendees may require a visa to enter the
                      United States. We recommend checking visa requirements
                      well in advance of the conference.
                    </p>
                    <p className="mb-4">
                      If you require an invitation letter for visa purposes,
                      please contact us with your registration details, and
                      we&apos;ll provide an official invitation letter.
                    </p>
                    <p>For more information on U.S. visa requirements:</p>
                    <ul className="list-disc ml-6 mt-2">
                      <li>
                        Visit the{" "}
                        <a
                          href="https://travel.state.gov"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 dark:text-primary-400 hover:underline"
                        >
                          U.S. Department of State website
                        </a>
                      </li>
                      <li>
                        Check with the{" "}
                        <a
                          href="https://www.usembassy.gov"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 dark:text-primary-400 hover:underline"
                        >
                          U.S. Embassy or Consulate
                        </a>{" "}
                        in your country
                      </li>
                    </ul>
                    <div className="mt-4">
                      <Button variant="outline">
                        Request Invitation Letter
                      </Button>
                    </div>
                  </Card>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
