require("dotenv").config();
const prisma = require("../prisma/prismaClient");

// -----------------------------
// REALISTIC NAME GENERATOR
// -----------------------------
const firstNames = [
  "Juan", "Maria", "Jose", "Ana", "Mark", "John", "Carlo", "Miguel",
  "Liza", "Angela", "Christian", "Paolo", "Nicole", "Joshua", "Rey",
  "Daniel", "Paula", "Kim", "Andrea", "Rafael"
];

const lastNames = [
  "Dela Cruz", "Reyes", "Santos", "Garcia", "Mendoza",
  "Cruz", "Bautista", "Torres", "Ramos", "Flores"
];

function randomName() {
  const first = firstNames[Math.floor(Math.random() * firstNames.length)];
  const last = lastNames[Math.floor(Math.random() * lastNames.length)];
  return `${first} ${last}`;
}

function randomEmail(name, i) {
  return (
    name.toLowerCase().replace(" ", ".") +
    i +
    "@firstaidlms.com"
  );
}

// -----------------------------
// MAIN SEED
// -----------------------------
async function main() {
  console.log("🌱 Seeding realistic First Aid LMS...");

  await prisma.enrollment.deleteMany();
  await prisma.learner.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.module.deleteMany();
  await prisma.course.deleteMany();

  // =========================
  // COURSES
  // =========================
  const course1 = await prisma.course.create({
    data: {
      title: "Basic First Aid Fundamentals",
      description:
        "Core life-saving skills including wound care, bleeding control, and emergency assessment.",
    },
  });

  const course2 = await prisma.course.create({
    data: {
      title: "CPR and Emergency Response",
      description:
        "Advanced CPR techniques including adult, child, and infant response protocols.",
    },
  });

  // =========================
  // MODULES
  // =========================
  const modules = [
    {
      courseId: course1.id,
      title: "Emergency Scene Assessment & Safety",
      outcome: "Learners can assess emergency scenes safely and call for help correctly.",
      lessons: [
        "Principles of Emergency Scene Safety",
        "DRABC Method (Danger, Response, Airway, Breathing, Circulation)",
        "How to Call Emergency Services (911/Local Hotline)",
      ],
    },
    {
      courseId: course1.id,
      title: "Wound Care & Bleeding Control",
      outcome: "Learners can manage minor and severe bleeding incidents.",
      lessons: [
        "Types of Wounds and Bleeding Severity",
        "Direct Pressure and Bandaging Techniques",
        "Preventing Infection in Open Wounds",
      ],
    },
    {
      courseId: course2.id,
      title: "CPR Fundamentals",
      outcome: "Learners can perform high-quality CPR on adults.",
      lessons: [
        "Chain of Survival",
        "Hand Placement and Compression Technique",
        "Compression Rate and Depth Standards",
      ],
    },
    {
      courseId: course2.id,
      title: "Child & Infant CPR",
      outcome: "Learners can adapt CPR techniques for pediatric patients.",
      lessons: [
        "Differences in Adult vs Child CPR",
        "Infant CPR Technique",
        "Choking Response for Infants",
      ],
    },
  ];

  for (const m of modules) {
    const module = await prisma.module.create({
      data: {
        title: m.title,
        courseId: m.courseId,
      },
    });

    for (const lesson of m.lessons) {
      await prisma.lesson.create({
        data: {
          title: lesson,
          content: `
Learning Objective:
${m.outcome}

Lesson:
${lesson}

Key Points:
- Follow safety protocols at all times
- Apply correct first aid procedures
- Prioritize patient stability before transport
          `,
          moduleId: module.id,
        },
      });
    }
  }

  // =========================
  // LEARNERS
  // =========================
  const learners = [];

  for (let i = 1; i <= 50; i++) {
    const name = randomName();

    const learner = await prisma.learner.create({
      data: {
        name,
        email: randomEmail(name, i),
      },
    });

    learners.push(learner);
  }

  // =========================
  // KPI + ENROLLMENT DATA
  // =========================
  for (const learner of learners) {
    const completionRate = Math.floor(Math.random() * 100);
    const avgScore = Math.floor(60 + Math.random() * 40);

    const riskLevel =
      avgScore >= 85 ? "High Performer" :
      avgScore >= 70 ? "Average" :
      "At Risk";

    await prisma.enrollment.create({
      data: {
        learnerId: learner.id,
        courseId:
          Math.random() > 0.5 ? course1.id : course2.id,
        progress: completionRate,
        completed: completionRate > 80,
        kpiScore: avgScore,
        performanceLevel: riskLevel,
      },
    });
  }

  console.log("✅ Realistic First Aid LMS seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });