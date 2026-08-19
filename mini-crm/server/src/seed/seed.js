import "dotenv/config";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import { User } from "../models/User.js";
import { Contact } from "../models/Contact.js";
import { Deal } from "../models/Deal.js";
import { Activity } from "../models/Activity.js";
import { Task } from "../models/Task.js";

const DEMO_PASSWORD = "Passw0rd!";

async function seed() {
  await connectDB();

  console.log("[seed] Clearing existing data...");
  await Promise.all([
    User.deleteMany({}),
    Contact.deleteMany({}),
    Deal.deleteMany({}),
    Activity.deleteMany({}),
    Task.deleteMany({})
  ]);

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
  const user = await User.create({ name: "Dhanya Rao", email: "demo@minicrm.com", passwordHash });

  console.log("[seed] Creating contacts...");
  const contacts = await Contact.insertMany([
    {
      ownerId: user._id,
      name: "Priya Nair",
      email: "priya@northstar-labs.com",
      phone: "+91 98765 43210",
      company: "Northstar Labs",
      tags: ["decision-maker"],
      notes: "Met at a product conference. Interested in the enterprise tier."
    },
    {
      ownerId: user._id,
      name: "Arjun Mehta",
      email: "arjun@brightpath.io",
      phone: "+91 91234 56789",
      company: "BrightPath Education",
      tags: ["warm-lead"],
      notes: "Referred by an existing customer."
    },
    {
      ownerId: user._id,
      name: "Sana Iqbal",
      email: "sana@fieldworks.co",
      phone: "+91 99887 76655",
      company: "Fieldworks Co.",
      tags: ["renewal"],
      notes: "Existing customer, contract renews next quarter."
    },
    {
      ownerId: user._id,
      name: "Ravi Menon",
      email: "ravi@deltatech.com",
      phone: "+91 90000 11223",
      company: "Delta Tech",
      tags: [],
      notes: ""
    }
  ]);

  console.log("[seed] Creating deals across pipeline stages...");
  const dealDefs = [
    { title: "Northstar Labs — Enterprise plan", value: 24000, stage: "proposal", contact: 0 },
    { title: "BrightPath — Annual subscription", value: 9000, stage: "contacted", contact: 1 },
    { title: "Fieldworks — Renewal", value: 15000, stage: "negotiation", contact: 2 },
    { title: "Delta Tech — Pilot program", value: 5000, stage: "lead", contact: 3 },
    { title: "Northstar Labs — Add-on seats", value: 4000, stage: "lead", contact: 0 },
    { title: "Acme Corp — Initial outreach", value: 12000, stage: "lead", contact: null },
    { title: "Fieldworks — Onboarding package", value: 3000, stage: "won", contact: 2 },
    { title: "Legacy Systems Inc — Evaluation", value: 6000, stage: "lost", contact: null }
  ];

  const deals = [];
  const stagePositions = {};
  for (const def of dealDefs) {
    const position = stagePositions[def.stage] ?? 0;
    stagePositions[def.stage] = position + 1;
    const deal = await Deal.create({
      ownerId: user._id,
      title: def.title,
      value: def.value,
      currency: "USD",
      stage: def.stage,
      position,
      contactId: def.contact !== null ? contacts[def.contact]._id : null,
      expectedCloseDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * (14 + position * 7))
    });
    deals.push(deal);
  }

  console.log("[seed] Creating activity timeline entries...");
  await Activity.insertMany([
    {
      ownerId: user._id,
      contactId: contacts[0]._id,
      dealId: deals[0]._id,
      type: "call",
      content: "Discovery call — walked through enterprise pricing and SSO requirements."
    },
    {
      ownerId: user._id,
      contactId: contacts[0]._id,
      dealId: deals[0]._id,
      type: "email",
      content: "Sent the proposal deck and a draft contract for review."
    },
    {
      ownerId: user._id,
      contactId: contacts[2]._id,
      dealId: deals[2]._id,
      type: "meeting",
      content: "Renewal negotiation — they're asking for a 10% discount on a 2-year term."
    },
    {
      ownerId: user._id,
      contactId: contacts[1]._id,
      dealId: deals[1]._id,
      type: "note",
      content: "Champion is the head of curriculum design; budget owner is finance, still TBD."
    }
  ]);

  console.log("[seed] Creating tasks...");
  const today = new Date();
  const daysFromNow = (n) => new Date(today.getTime() + n * 24 * 60 * 60 * 1000);

  await Task.insertMany([
    {
      ownerId: user._id,
      contactId: contacts[0]._id,
      dealId: deals[0]._id,
      title: "Follow up on proposal feedback",
      dueDate: daysFromNow(0)
    },
    {
      ownerId: user._id,
      contactId: contacts[2]._id,
      dealId: deals[2]._id,
      title: "Send revised renewal contract",
      dueDate: daysFromNow(-2) // overdue
    },
    {
      ownerId: user._id,
      contactId: contacts[1]._id,
      dealId: deals[1]._id,
      title: "Schedule a demo for the finance team",
      dueDate: daysFromNow(3)
    },
    {
      ownerId: user._id,
      contactId: contacts[3]._id,
      title: "Introductory call",
      dueDate: daysFromNow(1)
    }
  ]);

  console.log("\n[seed] Done. Demo login:");
  console.log(`  Email:    demo@minicrm.com`);
  console.log(`  Password: ${DEMO_PASSWORD}\n`);

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("[seed] Failed:", err);
  process.exit(1);
});
