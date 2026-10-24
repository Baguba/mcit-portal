import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { verifyPassword } from "../src/lib/password.js";

async function main() {
  const db = new PrismaClient();
  try {
    const url = process.env.DATABASE_URL || "";
    let host = "(unknown)";
    try {
      host = new URL(url.trim().replace(/^\"|\"$/g, "")).host;
    } catch {}
    console.log("DB host :", host);
    console.log("DB name :", decodeURIComponent(url.split("/")[3]?.split("?")[0] || "(unknown)"));

    const users = await db.user.findMany({
      select: { email: true, name: true, role: true, active: true, password: true },
    });
    console.log("Users found:", users.length);
    for (const u of users) {
      console.log(`- ${u.email} | role=${u.role} | active=${u.active} | hashStyle=${u.password.split(":").length === 3 ? "pbkdf2-salt-hash" : u.password.slice(0, 7) + "..."}`);
    }

    const admin = users.find((u) => u.email === "admin@mcit.gov.et");
    if (admin) {
      const ok = await verifyPassword("AdminPass1", admin.password);
      console.log("AdminPass1 verifies:", ok);
    } else {
      console.log("admin@mcit.gov.et row does NOT exist in this database");
    }
  } finally {
    await db.$disconnect();
  }
}

main().catch((e) => {
  console.error("Diagnostic failed:", e instanceof Error ? e.message : e);
  process.exit(1);
});
