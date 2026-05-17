const mongoose = require("mongoose");
require("dotenv").config();
const JobRequest = require("./models/JobRequest");

const sampleJobs = [
  {
    title: "Leaking kitchen tap needs fixing",
    description: "My kitchen tap has been dripping for a week. Need someone to replace the washer or the whole tap if needed.",
    category: "Plumbing",
    location: "Glasgow",
    contactName: "John Smith",
    contactEmail: "john.smith@email.com",
    status: "Open",
  },
  {
    title: "Bathroom light not working",
    description: "The ceiling light in my bathroom stopped working after a power cut. Not sure if it's the fitting or the wiring.",
    category: "Electrical",
    location: "Edinburgh",
    contactName: "Sarah Connor",
    contactEmail: "sarah.c@email.com",
    status: "Open",
  },
  {
    title: "Living room needs repainting",
    description: "Looking for someone to repaint my living room. Two walls are about 4x3 metres. I can provide the paint.",
    category: "Painting",
    location: "Manchester",
    contactName: "David Lee",
    contactEmail: "d.lee@email.com",
    status: "In Progress",
  },
  {
    title: "Garden fence panels need replacing",
    description: "Three fence panels have blown down in the storm. Need new panels fitted, roughly 6 foot tall.",
    category: "Joinery",
    location: "Leeds",
    contactName: "Emma Wilson",
    contactEmail: "emma.w@email.com",
    status: "Open",
  },
  {
    title: "Boiler making strange noise",
    description: "My boiler started making a banging noise whenever the heating comes on. Happened for the past 3 days.",
    category: "Plumbing",
    location: "Birmingham",
    contactName: "Mike Brown",
    contactEmail: "mike.b@email.com",
    status: "Open",
  },
  {
    title: "Sockets need adding in home office",
    description: "I work from home and need 2 extra double sockets in my spare room. Currently only have one socket in there.",
    category: "Electrical",
    location: "Bristol",
    contactName: "Lisa Park",
    contactEmail: "lisa.park@email.com",
    status: "Closed",
  },
  {
    title: "Kitchen cupboard door hinge broken",
    description: "Two of my kitchen cupboard doors have broken hinges and won't close properly. Need someone to fix or replace them.",
    category: "Joinery",
    location: "Glasgow",
    contactName: "Tom Harris",
    contactEmail: "t.harris@email.com",
    status: "Open",
  },
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // clear existing data
    await JobRequest.deleteMany({});
    console.log("Cleared existing jobs");

    // insert sample jobs
    await JobRequest.insertMany(sampleJobs);
    console.log(`Inserted ${sampleJobs.length} sample jobs`);

    mongoose.connection.close();
    console.log("Done!");
  } catch (err) {
    console.error("Seed error:", err.message);
    process.exit(1);
  }
}

seedDatabase();
