const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User");
const Lead = require("./models/Lead");
const Deal = require("./models/Deal");
const Activity = require("./models/Activity");

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // ─── Clear existing data ───────────────────────────────────────────────
    await Activity.deleteMany({});
    await Deal.deleteMany({});
    await Lead.deleteMany({});
    await User.deleteMany({});
    console.log("🗑️  Cleared existing data");

    // ─── Create Users ──────────────────────────────────────────────────────
    const usersData = [
      { name: "Prathamesh Kamble", email: "admin@gmail.com", mobile: "9000000001", password: "Admin@2003", role: "admin" },
      { name: "Amit Deshmukh", email: "amit.deshmukh@gmail.com", mobile: "9000000002", password: "Amit@1234", role: "sales" },
      { name: "Aditya Patil", email: "aditya.patil@gmail.com", mobile: "9000000003", password: "Aditya@1234", role: "sales" },
      { name: "Ram Shinde", email: "ram.shinde@gmail.com", mobile: "9000000004", password: "Ram@1234", role: "sales" },
      { name: "Shyam Jadhav", email: "shyam.jadhav@gmail.com", mobile: "9000000005", password: "Shyam@1234", role: "sales" },
      { name: "Radha Kulkarni", email: "radha.kulkarni@gmail.com", mobile: "9000000006", password: "Radha@1234", role: "sales" },
      { name: "Kishori Tipugade", email: "kishori.tipugade@gmail.com", mobile: "9000000007", password: "Kishori@1234", role: "sales" },
      { name: "Piyush Mane", email: "piyush.mane@gmail.com", mobile: "9000000008", password: "Piyush@1234", role: "sales" },
      { name: "Manisha Gaikwad", email: "manisha.gaikwad@gmail.com", mobile: "9000000009", password: "Manisha@1234", role: "sales" },
    ];

    const createdUsers = await User.create(usersData);
    console.log(`👥 Created ${createdUsers.length} users`);

    const [admin, amit, aditya, ram, shyam, radha, kishori, piyush, manisha] = createdUsers;

    // ─── Create Leads (3 per sales user = 24 leads) ────────────────────────
    const leadsData = [
      // ── AMIT (3 leads) ──
      { name: "Suresh Wagh", email: "suresh.wagh@techcorp.in", phone: "9823456701", company: "TechCorp Pune", status: "New", source: "Website", notes: "Interested in enterprise software.", assignedTo: amit._id },
      { name: "Priya Joshi", email: "priya.joshi@infosys.in", phone: "9823456702", company: "Infosys Nashik", status: "Contacted", source: "Referral", notes: "Follow up next Monday regarding pricing.", assignedTo: amit._id },
      { name: "Kiran Bhosale", email: "kiran.bhosale@itservices.in", phone: "9823456703", company: "IT Services Pune", status: "Qualified", source: "LinkedIn", notes: "Wants cloud migration support.", assignedTo: amit._id },

      // ── ADITYA (3 leads) ──
      { name: "Nikhil Deshpande", email: "nikhil.d@solutionsltd.com", phone: "9823456704", company: "Solutions Ltd. Mumbai", status: "Qualified", source: "LinkedIn", notes: "Requested a product demo. Very interested.", assignedTo: aditya._id },
      { name: "Sunita More", email: "sunita.more@nagpurcorp.com", phone: "9823456705", company: "Nagpur Corp", status: "New", source: "Cold Call", notes: "Initial contact made. Awaiting callback.", assignedTo: aditya._id },
      { name: "Rohan Kulkarni", email: "rohan.k@autoparts.in", phone: "9823456706", company: "AutoParts Aurangabad", status: "Contacted", source: "Trade Show", notes: "Looking for ERP for auto parts inventory.", assignedTo: aditya._id },

      // ── RAM (3 leads) ──
      { name: "Vijay Thosar", email: "vijay.thosar@startupkolhapur.com", phone: "9823456707", company: "StartupHub Kolhapur", status: "Lost", source: "Trade Show", notes: "Budget constraints. Re-engage next quarter.", assignedTo: ram._id },
      { name: "Deepa Naik", email: "deepa.naik@retailco.in", phone: "9823456708", company: "RetailCo Aurangabad", status: "Contacted", source: "Website", notes: "Sent product brochure via email.", assignedTo: ram._id },
      { name: "Mahesh Salunke", email: "mahesh.s@printingpress.in", phone: "9823456709", company: "PrintPress Sangli", status: "Qualified", source: "Referral", notes: "Needs digital printing management system.", assignedTo: ram._id },

      // ── SHYAM (3 leads) ──
      { name: "Rohit Kawade", email: "rohit.kawade@finance.in", phone: "9823456710", company: "Finance Partners Solapur", status: "Qualified", source: "Referral", notes: "Strong interest in CRM integration.", assignedTo: shyam._id },
      { name: "Archana Pol", email: "archana.pol@mediasol.com", phone: "9823456711", company: "MediaSol Thane", status: "New", source: "Social Media", notes: "Came through Instagram ad campaign.", assignedTo: shyam._id },
      { name: "Tejas Rane", email: "tejas.rane@ecommerce.in", phone: "9823456712", company: "ShopEasy Mumbai", status: "Contacted", source: "LinkedIn", notes: "Wants integration with Shopify store.", assignedTo: shyam._id },

      // ── RADHA (3 leads) ──
      { name: "Ganesh Salve", email: "ganesh.salve@edtech.in", phone: "9823456713", company: "EdTech Nagpur", status: "Contacted", source: "Website", notes: "Looking for a student management module.", assignedTo: radha._id },
      { name: "Meera Kale", email: "meera.kale@healthcare.com", phone: "9823456714", company: "HealthCare Pune", status: "Qualified", source: "LinkedIn", notes: "Interested in patient data management.", assignedTo: radha._id },
      { name: "Smita Chandane", email: "smita.c@pharmaworld.in", phone: "9823456715", company: "PharmaWorld Nanded", status: "New", source: "Cold Call", notes: "Enquired about pharma billing software.", assignedTo: radha._id },

      // ── KISHORI (3 leads) ──
      { name: "Sanjay Kharat", email: "sanjay.kharat@constructco.in", phone: "9823456716", company: "ConstructCo Nashik", status: "New", source: "Cold Call", notes: "Building project management needs.", assignedTo: kishori._id },
      { name: "Vaishali Borate", email: "vaishali.borate@textiles.com", phone: "9823456717", company: "Textiles Ichalkaranji", status: "Contacted", source: "Referral", notes: "Looking for inventory tracking software.", assignedTo: kishori._id },
      { name: "Amol Nimbalkar", email: "amol.n@sugarmills.in", phone: "9823456718", company: "SugarMill Solapur", status: "Qualified", source: "Trade Show", notes: "Interested in production tracking tools.", assignedTo: kishori._id },

      // ── PIYUSH (3 leads) ──
      { name: "Dinesh Pawar", email: "dinesh.pawar@agritech.in", phone: "9823456719", company: "AgriTech Satara", status: "Qualified", source: "Trade Show", notes: "Needs agricultural supply chain solution.", assignedTo: piyush._id },
      { name: "Lata Chaudhari", email: "lata.chaudhari@logistics.in", phone: "9823456720", company: "Logistics Amravati", status: "New", source: "Website", notes: "Reached out for fleet management solution.", assignedTo: piyush._id },
      { name: "Nilesh Jagtap", email: "nilesh.j@coldchain.in", phone: "9823456721", company: "ColdChain Nashik", status: "Contacted", source: "LinkedIn", notes: "Wants temperature-monitored supply chain.", assignedTo: piyush._id },

      // ── MANISHA (3 leads) ──
      { name: "Pramod Sonawane", email: "pramod.sonawane@manufacturing.com", phone: "9823456722", company: "Manufacturing Co. Pune", status: "Lost", source: "Cold Call", notes: "Chose a competitor. Follow up in 6 months.", assignedTo: manisha._id },
      { name: "Kavita Mhetre", email: "kavita.m@fashionhouse.in", phone: "9823456723", company: "FashionHouse Kolhapur", status: "Contacted", source: "Social Media", notes: "Interested in retail billing + CRM combo.", assignedTo: manisha._id },
      { name: "Sunil Gorde", email: "sunil.g@hardware.in", phone: "9823456724", company: "HardwarePlus Jalgaon", status: "Qualified", source: "Referral", notes: "Needs POS system for hardware store chain.", assignedTo: manisha._id },
    ];

    const createdLeads = await Lead.create(leadsData);
    console.log(`📋 Created ${createdLeads.length} leads`);

    // ─── Create Deals (3 per sales user = 24 deals) ────────────────────────
    const dealsData = [
      // ── AMIT (3 deals) ──
      { title: "TechCorp Enterprise License", value: 150000, stage: "Prospect", lead: createdLeads[0]._id, assignedTo: amit._id, notes: "Annual enterprise software license deal." },
      { title: "Infosys CRM Integration", value: 85000, stage: "Negotiation", lead: createdLeads[1]._id, assignedTo: amit._id, notes: "CRM integration project. Discount discussed." },
      { title: "IT Services Cloud Migration", value: 200000, stage: "Won", lead: createdLeads[2]._id, assignedTo: amit._id, notes: "Cloud infra migration — deal closed!" },

      // ── ADITYA (3 deals) ──
      { title: "Solutions Ltd. Full Suite", value: 220000, stage: "Won", lead: createdLeads[3]._id, assignedTo: aditya._id, notes: "Full software suite — closed successfully!" },
      { title: "Nagpur Corp Starter Pack", value: 45000, stage: "Prospect", lead: createdLeads[4]._id, assignedTo: aditya._id, notes: "Starter package for a small team." },
      { title: "AutoParts ERP Deal", value: 98000, stage: "Negotiation", lead: createdLeads[5]._id, assignedTo: aditya._id, notes: "ERP for auto parts warehouse. In discussion." },

      // ── RAM (3 deals) ──
      { title: "StartupHub Budget Deal", value: 30000, stage: "Lost", lead: createdLeads[6]._id, assignedTo: ram._id, notes: "Client went with a cheaper alternative." },
      { title: "RetailCo Inventory Module", value: 60000, stage: "Negotiation", lead: createdLeads[7]._id, assignedTo: ram._id, notes: "PO pending. Legal team reviewing contract." },
      { title: "PrintPress Digital System", value: 75000, stage: "Won", lead: createdLeads[8]._id, assignedTo: ram._id, notes: "Digital printing mgmt system — closed!" },

      // ── SHYAM (3 deals) ──
      { title: "Finance Partners Analytics", value: 175000, stage: "Won", lead: createdLeads[9]._id, assignedTo: shyam._id, notes: "Analytics dashboard — deal closed!" },
      { title: "MediaSol Ad Platform", value: 95000, stage: "Prospect", lead: createdLeads[10]._id, assignedTo: shyam._id, notes: "Social media ad platform integration." },
      { title: "ShopEasy Shopify Integration", value: 55000, stage: "Negotiation", lead: createdLeads[11]._id, assignedTo: shyam._id, notes: "Shopify + CRM bridge module. Demo given." },

      // ── RADHA (3 deals) ──
      { title: "EdTech Student Management", value: 55000, stage: "Negotiation", lead: createdLeads[12]._id, assignedTo: radha._id, notes: "Custom student management module." },
      { title: "HealthCare Patient Data System", value: 310000, stage: "Won", lead: createdLeads[13]._id, assignedTo: radha._id, notes: "Full patient data system — major win!" },
      { title: "PharmaWorld Billing Suite", value: 88000, stage: "Prospect", lead: createdLeads[14]._id, assignedTo: radha._id, notes: "Pharma billing + inventory combo package." },

      // ── KISHORI (3 deals) ──
      { title: "ConstructCo Project Tool", value: 72000, stage: "Prospect", lead: createdLeads[15]._id, assignedTo: kishori._id, notes: "Site project management tool deal." },
      { title: "Textiles Inventory Tracker", value: 48000, stage: "Negotiation", lead: createdLeads[16]._id, assignedTo: kishori._id, notes: "Real-time inventory tracking needed." },
      { title: "SugarMill Production Tracker", value: 120000, stage: "Won", lead: createdLeads[17]._id, assignedTo: kishori._id, notes: "Production tracking dashboard — closed!" },

      // ── PIYUSH (3 deals) ──
      { title: "AgriTech Supply Chain", value: 130000, stage: "Won", lead: createdLeads[18]._id, assignedTo: piyush._id, notes: "Agricultural supply chain platform — closed!" },
      { title: "Logistics Fleet Manager", value: 90000, stage: "Prospect", lead: createdLeads[19]._id, assignedTo: piyush._id, notes: "GPS-based fleet management solution." },
      { title: "ColdChain Temperature Monitor", value: 105000, stage: "Negotiation", lead: createdLeads[20]._id, assignedTo: piyush._id, notes: "IoT temp sensors + dashboard. In talks." },

      // ── MANISHA (3 deals) ──
      { title: "Manufacturing ERP Lite", value: 200000, stage: "Lost", lead: createdLeads[21]._id, assignedTo: manisha._id, notes: "Client signed with competitor. Re-engage later." },
      { title: "FashionHouse Retail CRM", value: 67000, stage: "Negotiation", lead: createdLeads[22]._id, assignedTo: manisha._id, notes: "Retail billing + CRM integration in scope." },
      { title: "HardwarePlus POS System", value: 82000, stage: "Won", lead: createdLeads[23]._id, assignedTo: manisha._id, notes: "POS system for 5 hardware store branches — won!" },
    ];

    const createdDeals = await Deal.create(dealsData);
    console.log(`💼 Created ${createdDeals.length} deals`);

    // ─── Create Activities (3 per sales user = 24 activities) ─────────────
    const activitiesData = [
      // ── AMIT ──
      { type: "Call", description: "Discovery call with Suresh Wagh — discussed enterprise software pain points.", lead: createdLeads[0]._id, createdBy: amit._id, date: new Date("2026-02-01") },
      { type: "Meeting", description: "Product demo with Priya Joshi over Google Meet. Positive response on pricing.", lead: createdLeads[1]._id, createdBy: amit._id, date: new Date("2026-02-05") },
      { type: "Follow-up", description: "Sent cloud migration proposal to Kiran Bhosale. Awaiting sign-off.", lead: createdLeads[2]._id, createdBy: amit._id, date: new Date("2026-02-09") },

      // ── ADITYA ──
      { type: "Follow-up", description: "Sent pricing proposal to Nikhil Deshpande. Awaiting approval from finance.", lead: createdLeads[3]._id, createdBy: aditya._id, date: new Date("2026-02-08") },
      { type: "Note", description: "Sunita More requested a callback next week. Reminder set in calendar.", lead: createdLeads[4]._id, createdBy: aditya._id, date: new Date("2026-02-10") },
      { type: "Call", description: "Rohan Kulkarni confirmed ERP requirements. Preparing custom proposal.", lead: createdLeads[5]._id, createdBy: aditya._id, date: new Date("2026-02-13") },

      // ── RAM ──
      { type: "Call", description: "Follow-up call with Vijay Thosar. Budget issue confirmed by their CFO.", lead: createdLeads[6]._id, createdBy: ram._id, date: new Date("2026-02-12") },
      { type: "Meeting", description: "In-person meeting with Deepa Naik at RetailCo Aurangabad head office.", lead: createdLeads[7]._id, createdBy: ram._id, date: new Date("2026-02-13") },
      { type: "Follow-up", description: "Shared digital printing system demo video with Mahesh Salunke.", lead: createdLeads[8]._id, createdBy: ram._id, date: new Date("2026-02-17") },

      // ── SHYAM ──
      { type: "Follow-up", description: "Rohit Kawade requested a second demo with their tech team. Scheduled next week.", lead: createdLeads[9]._id, createdBy: shyam._id, date: new Date("2026-02-14") },
      { type: "Note", description: "Archana Pol came through Instagram. Needs management approval before proceeding.", lead: createdLeads[10]._id, createdBy: shyam._id, date: new Date("2026-02-15") },
      { type: "Meeting", description: "Online meeting with Tejas Rane. Showed Shopify + CRM integration demo.", lead: createdLeads[11]._id, createdBy: shyam._id, date: new Date("2026-02-18") },

      // ── RADHA ──
      { type: "Call", description: "Requirement gathering call with Ganesh Salve from EdTech Nagpur.", lead: createdLeads[12]._id, createdBy: radha._id, date: new Date("2026-02-16") },
      { type: "Meeting", description: "Meera Kale signed the contract. HealthCare deal officially won!", lead: createdLeads[13]._id, createdBy: radha._id, date: new Date("2026-02-17") },
      { type: "Note", description: "Smita Chandane requested a pharma-specific billing demo. Scheduling for next week.", lead: createdLeads[14]._id, createdBy: radha._id, date: new Date("2026-02-20") },

      // ── KISHORI ──
      { type: "Follow-up", description: "Emailed Sanjay Kharat product catalogue and site management integration docs.", lead: createdLeads[15]._id, createdBy: kishori._id, date: new Date("2026-02-18") },
      { type: "Note", description: "Vaishali Borate wants to include warehouse module in scope. Revised proposal sent.", lead: createdLeads[16]._id, createdBy: kishori._id, date: new Date("2026-02-19") },
      { type: "Call", description: "Amol Nimbalkar from SugarMill confirmed deal. Contract sent for signature.", lead: createdLeads[17]._id, createdBy: kishori._id, date: new Date("2026-02-21") },

      // ── PIYUSH ──
      { type: "Call", description: "Discussed AgriTech deal terms with Dinesh Pawar. Contract sent for review.", lead: createdLeads[18]._id, createdBy: piyush._id, date: new Date("2026-02-20") },
      { type: "Meeting", description: "Lata Chaudhari met at Amravati logistics hub for a live GPS fleet demo.", lead: createdLeads[19]._id, createdBy: piyush._id, date: new Date("2026-02-21") },
      { type: "Follow-up", description: "Sent IoT temperature monitoring brochure to Nilesh Jagtap from ColdChain.", lead: createdLeads[20]._id, createdBy: piyush._id, date: new Date("2026-02-22") },

      // ── MANISHA ──
      { type: "Note", description: "Pramod Sonawane confirmed lost deal. Added to re-engagement list for Q3 2026.", lead: createdLeads[21]._id, createdBy: manisha._id, date: new Date("2026-02-22") },
      { type: "Call", description: "Kavita Mhetre interested in retail CRM. Scheduled product walkthrough call.", lead: createdLeads[22]._id, createdBy: manisha._id, date: new Date("2026-02-23") },
      { type: "Meeting", description: "Visited Sunil Gorde's main branch. Closed POS deal for 5 store locations!", lead: createdLeads[23]._id, createdBy: manisha._id, date: new Date("2026-02-24") },
    ];

    const createdActivities = await Activity.create(activitiesData);
    console.log(`📝 Created ${createdActivities.length} activities`);

    // ─── Summary ───────────────────────────────────────────────────────────
    console.log("\n🎉 Database seeded successfully!\n");
    console.log("═══════════════════════════════════════════");
    console.log("  ADMIN LOGIN CREDENTIALS");
    console.log("  Name    : Prathamesh Kamble");
    console.log("  Email   : admin@gmail.com");
    console.log("  Password: Admin@2003");
    console.log("  Mobile  : 9000000001");
    console.log("  Role    : admin");
    console.log("═══════════════════════════════════════════");
    console.log("\n  SALES USER CREDENTIALS (Password format: Name@1234)");
    console.log("  amit.deshmukh@gmail.com     → Amit@1234    | Mobile: 9000000002");
    console.log("  aditya.patil@gmail.com      → Aditya@1234  | Mobile: 9000000003");
    console.log("  ram.shinde@gmail.com        → Ram@1234     | Mobile: 9000000004");
    console.log("  shyam.jadhav@gmail.com      → Shyam@1234   | Mobile: 9000000005");
    console.log("  radha.kulkarni@gmail.com    → Radha@1234   | Mobile: 9000000006");
    console.log("  kishori.tipugade@gmail.com  → Kishori@1234 | Mobile: 9000000007");
    console.log("  piyush.mane@gmail.com       → Piyush@1234  | Mobile: 9000000008");
    console.log("  manisha.gaikwad@gmail.com   → Manisha@1234 | Mobile: 9000000009");
    console.log("═══════════════════════════════════════════\n");

    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    process.exit(1);
  }
};

seed();
