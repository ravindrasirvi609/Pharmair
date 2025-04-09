// Define registration fee structure (in INR)
export const REGISTRATION_FEES = {
  Student: 2500,
  Academic: 4000,
  Industry: 6000,
  Speaker: 0, // Free for speakers
  Guest: 0, // Free for special guests
};

// Fee types
export type FeeType = "registration" | "abstract" | "accommodation";
