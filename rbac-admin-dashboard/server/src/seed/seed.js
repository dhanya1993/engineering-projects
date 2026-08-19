import "dotenv/config";
import bcrypt from "bcryptjs";
import { connectDB } from "../config/db.js";
import { User } from "../models/User.js";
import { Ticket } from "../models/Ticket.js";
import { ROLES } from "../utils/permissions.js";
import mongoose from "mongoose";

const DEMO_PASSWORD = "Passw0rd!";

async function seed() {
  await connectDB();

  console.log("[seed] Clearing existing users and tickets...");
  await User.deleteMany({});
  await Ticket.deleteMany({});

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  console.log("[seed] Creating org hierarchy...");

  const superAdmin = await User.create({
    name: "Asha Rao",
    email: "superadmin@demo.com",
    passwordHash,
    role: ROLES.SUPER_ADMIN,
    region: "ALL"
  });

  const nationalManager = await User.create({
    name: "Vikram Shah",
    email: "national@demo.com",
    passwordHash,
    role: ROLES.NATIONAL_MANAGER,
    managerId: superAdmin._id,
    region: "ALL"
  });

  const regionalManagerSouth = await User.create({
    name: "Priya Nair",
    email: "regional.south@demo.com",
    passwordHash,
    role: ROLES.REGIONAL_MANAGER,
    managerId: nationalManager._id,
    region: "South"
  });

  const regionalManagerNorth = await User.create({
    name: "Arjun Mehta",
    email: "regional.north@demo.com",
    passwordHash,
    role: ROLES.REGIONAL_MANAGER,
    managerId: nationalManager._id,
    region: "North"
  });

  const fieldAgentSouth = await User.create({
    name: "Ravi Menon",
    email: "agent.south@demo.com",
    passwordHash,
    role: ROLES.FIELD_AGENT,
    managerId: regionalManagerSouth._id,
    region: "South"
  });

  const fieldAgentNorth = await User.create({
    name: "Sana Iqbal",
    email: "agent.north@demo.com",
    passwordHash,
    role: ROLES.FIELD_AGENT,
    managerId: regionalManagerNorth._id,
    region: "North"
  });

  const viewer = await User.create({
    name: "Meera Joshi",
    email: "viewer@demo.com",
    passwordHash,
    role: ROLES.VIEWER,
    managerId: nationalManager._id,
    region: "ALL"
  });

  console.log("[seed] Creating sample tickets...");
  await Ticket.create([
    {
      title: "Device DVC-2201 offline in Chennai depot",
      description: "No heartbeat for 6 hours, needs field visit.",
      status: "open",
      region: "South",
      createdBy: regionalManagerSouth._id,
      assignedTo: fieldAgentSouth._id
    },
    {
      title: "Refill schedule conflict — Delhi route 4",
      description: "Two agents assigned to the same route window.",
      status: "in_progress",
      region: "North",
      createdBy: regionalManagerNorth._id,
      assignedTo: fieldAgentNorth._id
    },
    {
      title: "Onboarding delay for new distributor — Bengaluru",
      description: "Contract signed, device allocation pending.",
      status: "resolved",
      region: "South",
      createdBy: nationalManager._id,
      assignedTo: regionalManagerSouth._id
    }
  ]);

  console.log("\n[seed] Done. Demo accounts (all use the same password):");
  console.log(`  Password for every account: ${DEMO_PASSWORD}\n`);
  [superAdmin, nationalManager, regionalManagerSouth, regionalManagerNorth, fieldAgentSouth, fieldAgentNorth, viewer]
    .forEach((u) => console.log(`  ${u.role.padEnd(18)} ${u.email}`));

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("[seed] Failed:", err);
  process.exit(1);
});
