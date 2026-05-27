const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clear existing data
  await prisma.enrollment.deleteMany({});
  await prisma.question.deleteMany({});
  await prisma.assessment.deleteMany({});
  await prisma.lesson.deleteMany({});
  await prisma.module.deleteMany({});
  await prisma.course.deleteMany({});
  await prisma.learner.deleteMany({});

  // Create Courses
  const course1 = await prisma.course.create({
    data: {
      title: "Basic First Aid Fundamentals",
      description: "Learn the fundamentals of first aid including CPR, wound care, and emergency response.",
      category: "First Aid",
      duration: 120,
      thumbnail: "https://via.placeholder.com/300x200?text=First+Aid+Fundamentals",
    },
  });

  const course2 = await prisma.course.create({
    data: {
      title: "CPR and Emergency Response",
      description: "Master CPR techniques and emergency response procedures for life-threatening situations.",
      category: "First Aid",
      duration: 90,
      thumbnail: "https://via.placeholder.com/300x200?text=CPR+Emergency+Response",
    },
  });

  // Course 1 Modules
  const module1_1 = await prisma.module.create({
    data: {
      courseId: course1.id,
      title: "Introduction to First Aid",
      description: "Basic concepts and principles of first aid",
      order: 1,
    },
  });

  const module1_2 = await prisma.module.create({
    data: {
      courseId: course1.id,
      title: "Assessing the Patient",
      description: "How to perform primary and secondary assessments",
      order: 2,
    },
  });

  const module1_3 = await prisma.module.create({
    data: {
      courseId: course1.id,
      title: "Wound Care and Bleeding Control",
      description: "Managing wounds and controlling bleeding",
      order: 3,
    },
  });

  const module1_4 = await prisma.module.create({
    data: {
      courseId: course1.id,
      title: "Shock and Severe Reactions",
      description: "Recognizing and managing shock",
      order: 4,
    },
  });

  // Course 2 Modules
  const module2_1 = await prisma.module.create({
    data: {
      courseId: course2.id,
      title: "CPR Basics",
      description: "Understanding the fundamentals of CPR",
      order: 1,
    },
  });

  const module2_2 = await prisma.module.create({
    data: {
      courseId: course2.id,
      title: "Adult CPR Technique",
      description: "Step-by-step adult CPR procedure",
      order: 2,
    },
  });

  const module2_3 = await prisma.module.create({
    data: {
      courseId: course2.id,
      title: "Pediatric and Infant CPR",
      description: "CPR for children and infants",
      order: 3,
    },
  });

  const module2_4 = await prisma.module.create({
    data: {
      courseId: course2.id,
      title: "Using an AED",
      description: "Automated External Defibrillator operation",
      order: 4,
    },
  });

  // Create Lessons for Course 1
  await prisma.lesson.create({
    data: {
      moduleId: module1_1.id,
      title: "What is First Aid?",
      content: "<h3>What is First Aid?</h3><p>First aid is the immediate assistance given to a person who has suffered an injury or sudden illness.</p><p>Key principles include assessing the situation, calling emergency services, and providing care until professional help arrives.</p>",
      order: 1,
    },
  });

  await prisma.lesson.create({
    data: {
      moduleId: module1_1.id,
      title: "Legal Responsibilities",
      content: "<h3>Legal Responsibilities</h3><p>Understanding your legal obligations when providing first aid.</p><p>First aiders have a duty of care and must act reasonably and responsibly.</p>",
      order: 2,
    },
  });

  await prisma.lesson.create({
    data: {
      moduleId: module1_1.id,
      title: "Safety First",
      content: "<h3>Safety First</h3><p>Always ensure the scene is safe before providing aid.</p><p>Check for hazards, use personal protective equipment, and protect yourself from bloodborne pathogens.</p>",
      order: 3,
    },
  });

  await prisma.lesson.create({
    data: {
      moduleId: module1_1.id,
      title: "Recovery Position",
      content: "<h3>Recovery Position</h3><p>Learn the proper recovery position for unconscious breathing victims.</p>",
      order: 4,
    },
  });

  // Additional lessons for other modules
  const additionalLessons = [
    { moduleId: module1_2.id, title: "Primary Assessment (ABCs)", content: "<h3>Airway, Breathing, Circulation</h3><p>The ABCs are the priority in assessing a patient.</p>", order: 1 },
    { moduleId: module1_2.id, title: "Responsive vs Unresponsive", content: "<h3>Determining Responsiveness</h3><p>Check if the patient is conscious and responsive.</p>", order: 2 },
    { moduleId: module1_2.id, title: "Vital Signs", content: "<h3>Taking Vital Signs</h3><p>Learn to measure pulse, breathing rate, and blood pressure.</p>", order: 3 },
    { moduleId: module1_2.id, title: "Secondary Survey", content: "<h3>Secondary Survey</h3><p>Perform a thorough head-to-toe assessment.</p>", order: 4 },
    { moduleId: module1_3.id, title: "Types of Wounds", content: "<h3>Wound Classification</h3><p>Understanding different types of wounds helps determine proper treatment.</p>", order: 1 },
    { moduleId: module1_3.id, title: "Controlling Bleeding", content: "<h3>Hemorrhage Control</h3><p>Effective bleeding control is critical in emergency care.</p>", order: 2 },
    { moduleId: module1_3.id, title: "Infection Prevention", content: "<h3>Preventing Infection</h3><p>Proper wound cleaning and dressing prevents complications.</p>", order: 3 },
    { moduleId: module1_3.id, title: "Bandaging Techniques", content: "<h3>Proper Bandaging</h3><p>Learn various bandaging methods for different wounds.</p>", order: 4 },
    { moduleId: module1_4.id, title: "Shock Recognition", content: "<h3>Signs and Symptoms of Shock</h3><p>Recognize shock symptoms early for better outcomes.</p>", order: 1 },
    { moduleId: module1_4.id, title: "Managing Shock", content: "<h3>Shock Management Protocol</h3><p>Proper treatment of shock can save lives.</p>", order: 2 },
    { moduleId: module1_4.id, title: "Severe Allergic Reactions", content: "<h3>Anaphylaxis Management</h3><p>How to recognize and treat severe allergic reactions.</p>", order: 3 },
    { moduleId: module1_4.id, title: "Poisoning and Overdose", content: "<h3>Toxicological Emergencies</h3><p>Response to poisoning and overdose situations.</p>", order: 4 },
  ];

  for (const lesson of additionalLessons) {
    await prisma.lesson.create({ data: lesson });
  }

  // Lessons for Course 2
  const course2Lessons = [
    { moduleId: module2_1.id, title: "The Chain of Survival", content: "<h3>Chain of Survival</h3><p>Understanding the steps that maximize survival chances.</p>", order: 1 },
    { moduleId: module2_1.id, title: "When to Call 911", content: "<h3>Emergency Response</h3><p>Know when and how to call emergency services.</p>", order: 2 },
    { moduleId: module2_1.id, title: "CPR Myths vs Facts", content: "<h3>Clarifying CPR Misconceptions</h3><p>Separate fact from fiction about CPR.</p>", order: 3 },
    { moduleId: module2_1.id, title: "Legal Protection", content: "<h3>Good Samaritan Laws</h3><p>Understanding legal protections for first aiders.</p>", order: 4 },
    { moduleId: module2_2.id, title: "Hand Placement and Compression", content: "<h3>CPR Technique</h3><p>Proper hand placement and compression depth are crucial.</p>", order: 1 },
    { moduleId: module2_2.id, title: "Rescue Breathing", content: "<h3>Rescue Breathing</h3><p>Providing oxygen to the patient during CPR.</p>", order: 2 },
    { moduleId: module2_2.id, title: "Compression Rate", content: "<h3>100-120 Compressions Per Minute</h3><p>Maintaining proper compression speed for effectiveness.</p>", order: 3 },
    { moduleId: module2_2.id, title: "Recovery After CPR", content: "<h3>Post-CPR Care</h3><p>Care after return of spontaneous circulation.</p>", order: 4 },
    { moduleId: module2_3.id, title: "Pediatric CPR", content: "<h3>CPR for Children</h3><p>CPR modifications for pediatric patients.</p>", order: 1 },
    { moduleId: module2_3.id, title: "Infant CPR", content: "<h3>Infant CPR Technique</h3><p>Special considerations for infants.</p>", order: 2 },
    { moduleId: module2_3.id, title: "Choking in Children", content: "<h3>Pediatric Choking Response</h3><p>Age-appropriate choking management.</p>", order: 3 },
    { moduleId: module2_3.id, title: "Special Pediatric Situations", content: "<h3>Drowning, Seizures, and Asthma</h3><p>Managing pediatric emergencies.</p>", order: 4 },
    { moduleId: module2_4.id, title: "AED Operation", content: "<h3>Using an Automated External Defibrillator</h3><p>Step-by-step AED usage.</p>", order: 1 },
    { moduleId: module2_4.id, title: "AED Safety", content: "<h3>Safe AED Use</h3><p>Preventing injury while using an AED.</p>", order: 2 },
    { moduleId: module2_4.id, title: "Special AED Situations", content: "<h3>Children and Wet Conditions</h3><p>Using AED in special circumstances.</p>", order: 3 },
    { moduleId: module2_4.id, title: "Post-Defibrillation Care", content: "<h3>After Using an AED</h3><p>Care after defibrillation.</p>", order: 4 },
  ];

  for (const lesson of course2Lessons) {
    await prisma.lesson.create({ data: lesson });
  }

  // Create Assessments
  const assessment1_1 = await prisma.assessment.create({
    data: {
      moduleId: module1_1.id,
      title: "Introduction to First Aid Quiz",
      passingScore: 70,
    },
  });

  const assessment1_2 = await prisma.assessment.create({
    data: {
      moduleId: module1_2.id,
      title: "Patient Assessment Quiz",
      passingScore: 75,
    },
  });

  const assessment2_1 = await prisma.assessment.create({
    data: {
      moduleId: module2_1.id,
      title: "CPR Basics Quiz",
      passingScore: 75,
    },
  });

  const assessment2_2 = await prisma.assessment.create({
    data: {
      moduleId: module2_2.id,
      title: "Adult CPR Technique Quiz",
      passingScore: 80,
    },
  });

  // Create Questions for assessments
  const questions = [
    {
      assessmentId: assessment1_1.id,
      type: "multiple_choice",
      questionText: "What is the primary goal of first aid?",
      options: JSON.stringify([
        "To treat all medical conditions",
        "To provide immediate assistance and stabilize the patient",
        "To replace professional medical care",
        "To diagnose injuries",
      ]),
      correctAnswer: "1",
      order: 1,
    },
    {
      assessmentId: assessment1_1.id,
      type: "true_false",
      questionText: "True or False: You should move an injured person immediately to get them help.",
      correctAnswer: "false",
      order: 2,
    },
    {
      assessmentId: assessment1_2.id,
      type: "multiple_choice",
      questionText: "What does ABC stand for in first aid?",
      options: JSON.stringify([
        "Assessment, Breathing, Circulation",
        "Airway, Breathing, Circulation",
        "Alert, Breathing, Check",
        "Assess, Bandage, Call",
      ]),
      correctAnswer: "1",
      order: 1,
    },
    {
      assessmentId: assessment2_1.id,
      type: "multiple_choice",
      questionText: "What is the correct compression rate for adult CPR?",
      options: JSON.stringify([
        "80-100 compressions per minute",
        "100-120 compressions per minute",
        "140-160 compressions per minute",
        "60-80 compressions per minute",
      ]),
      correctAnswer: "1",
      order: 1,
    },
    {
      assessmentId: assessment2_1.id,
      type: "true_false",
      questionText: "True or False: CPR alone can be as effective as CPR with an AED.",
      correctAnswer: "false",
      order: 2,
    },
    {
      assessmentId: assessment2_2.id,
      type: "multiple_choice",
      questionText: "How deep should chest compressions be for adults?",
      options: JSON.stringify([
        "At least 1 inch",
        "At least 2 inches but not more than 2.4 inches",
        "At least 3 inches",
        "At least 0.5 inches",
      ]),
      correctAnswer: "1",
      order: 1,
    },
  ];

  for (const question of questions) {
    await prisma.question.create({ data: question });
  }

  // Create Learners
  const learnerNames = [
    "John Smith", "Sarah Johnson", "Michael Brown", "Emily Davis", "David Wilson",
    "Jessica Martinez", "James Anderson", "Lisa Taylor", "Robert Thomas", "Karen Jackson",
    "William White", "Nancy Harris", "Charles Martin", "Sandra Thompson", "Christopher Lee",
    "Ashley Garcia", "Mark Rodriguez", "Katherine Martinez", "Donald Martinez", "Brenda Robinson",
    "Steven Clark", "Susan Rodriguez", "Edward Lewis", "Deborah Walker", "Brian Hall",
    "Cynthia Allen", "Ronald Young", "Kathleen King", "Anthony Wright", "Shirley Lopez",
    "Kevin Hill", "Angela Green", "Jason Adams", "Anna Nelson", "Jeffrey Carter",
    "Pamela Mitchell", "Ryan Roberts", "Deborah Phillips", "Jacob Campbell", "Kathryn Parker",
    "Gary Evans", "Diane Edwards", "Nicholas Collins", "Christina Stewart", "Eric Sanchez",
    "Christine Morris", "Jonathan Rogers", "Carol Rogers", "Stephen Reed", "Rosalie Cook",
  ];

  const domains = ["gmail.com", "yahoo.com", "outlook.com", "company.com", "example.com"];

  const learners = [];
  for (let i = 0; i < 50; i++) {
    const learner = await prisma.learner.create({
      data: {
        name: learnerNames[i] || `Learner ${i + 1}`,
        email: `${learnerNames[i]?.toLowerCase().replace(/\s+/g, ".") || `learner${i + 1}`}@${domains[i % domains.length]}`,
      },
    });
    learners.push(learner);
  }

  // Create Enrollments
  for (let i = 0; i < learners.length; i++) {
    const coursesToEnroll = i % 2 === 0 ? [course1, course2] : [course1];
    for (const course of coursesToEnroll) {
      const progress = Math.floor(Math.random() * 100);
      await prisma.enrollment.create({
        data: {
          learnerId: learners[i].id,
          courseId: course.id,
          progress: progress,
          completed: progress === 100,
          completedAt: progress === 100 ? new Date() : null,
        },
      });
    }
  }

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });