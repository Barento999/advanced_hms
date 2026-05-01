import mongoose from "mongoose";
import dotenv from "dotenv";
import BlogPost from "../models/BlogPost.js";
import User from "../models/User.js";
import connectDB from "../config/db.js";

dotenv.config();

const blogPosts = [
  {
    title: "10 Tips for Maintaining Heart Health",
    description:
      "Learn essential practices to keep your heart healthy and reduce the risk of cardiovascular diseases.",
    content: `
# 10 Tips for Maintaining Heart Health

Your heart is one of the most vital organs in your body, and taking care of it should be a top priority. Here are 10 essential tips to help you maintain a healthy heart:

## 1. Exercise Regularly
Aim for at least 150 minutes of moderate aerobic activity or 75 minutes of vigorous activity per week. Regular exercise strengthens your heart and improves circulation.

## 2. Eat a Heart-Healthy Diet
Focus on fruits, vegetables, whole grains, lean proteins, and healthy fats. Limit saturated fats, trans fats, sodium, and added sugars.

## 3. Maintain a Healthy Weight
Being overweight puts extra strain on your heart. Work with your healthcare provider to achieve and maintain a healthy weight.

## 4. Quit Smoking
Smoking is one of the leading risk factors for heart disease. If you smoke, quitting is the best thing you can do for your heart health.

## 5. Manage Stress
Chronic stress can contribute to heart disease. Practice stress-reduction techniques like meditation, yoga, or deep breathing exercises.

## 6. Get Enough Sleep
Aim for 7-9 hours of quality sleep each night. Poor sleep is linked to high blood pressure and other heart disease risk factors.

## 7. Monitor Your Blood Pressure
High blood pressure often has no symptoms but can lead to serious heart problems. Check your blood pressure regularly.

## 8. Control Cholesterol Levels
High cholesterol can lead to plaque buildup in your arteries. Get your cholesterol checked and follow your doctor's recommendations.

## 9. Limit Alcohol Consumption
If you drink alcohol, do so in moderation. Excessive drinking can raise blood pressure and contribute to heart disease.

## 10. Stay Hydrated
Drinking enough water helps your heart pump blood more easily through your blood vessels to your muscles.

Remember, small changes can make a big difference in your heart health. Consult with your healthcare provider before making significant lifestyle changes.
    `,
    category: "Health Tips",
    status: "published",
    featured: true,
    tags: ["heart health", "cardiovascular", "wellness", "prevention"],
  },
  {
    title: "New Feature: Virtual Consultations Now Available",
    description:
      "We're excited to announce our new telemedicine feature, making healthcare more accessible than ever.",
    content: `
# Introducing Virtual Consultations

We're thrilled to announce the launch of our new virtual consultation feature! This innovative addition to our platform makes quality healthcare more accessible and convenient for everyone.

## What Are Virtual Consultations?

Virtual consultations allow you to connect with healthcare professionals through secure video calls, right from the comfort of your home. No more waiting rooms, no more travel time – just quality healthcare at your fingertips.

## Key Features

### Secure Video Calls
All consultations are conducted through our HIPAA-compliant, encrypted video platform ensuring your privacy and security.

### Easy Scheduling
Book virtual appointments just as easily as in-person visits. Choose a time that works for you and receive instant confirmation.

### Digital Prescriptions
Your doctor can send prescriptions directly to your preferred pharmacy electronically.

### Medical Records Access
Both you and your healthcare provider have instant access to your complete medical history during the consultation.

## How to Get Started

1. Log in to your account
2. Select "Book Appointment"
3. Choose "Virtual Consultation" as your appointment type
4. Select your preferred doctor and time slot
5. Join the video call at your scheduled time

## Benefits of Virtual Consultations

- **Convenience**: No travel required
- **Time-Saving**: Reduced waiting times
- **Accessibility**: Healthcare from anywhere
- **Safety**: Reduced exposure to illnesses
- **Flexibility**: More appointment slots available

## When to Use Virtual Consultations

Virtual consultations are ideal for:
- Follow-up appointments
- Prescription refills
- Minor illnesses and symptoms
- Mental health consultations
- Chronic disease management
- Health advice and guidance

Start using virtual consultations today and experience the future of healthcare!
    `,
    category: "Platform Updates",
    status: "published",
    featured: true,
    tags: ["telemedicine", "virtual care", "platform update", "technology"],
  },
  {
    title: "Understanding Your Digital Medical Records",
    description:
      "A comprehensive guide to understanding and managing your digital medical records securely.",
    content: `
# Understanding Your Digital Medical Records

In today's digital age, managing your health information has never been easier. This guide will help you understand and make the most of your digital medical records.

## What Are Digital Medical Records?

Digital medical records, also known as Electronic Health Records (EHR), are digital versions of your paper medical charts. They contain your complete medical history, including:

- Diagnoses and treatment plans
- Medications and allergies
- Laboratory test results
- Immunization records
- Radiology images
- Doctor's notes and observations

## Benefits of Digital Records

### Instant Access
Access your medical information anytime, anywhere through our secure platform.

### Better Coordination
All your healthcare providers can access the same up-to-date information, leading to better coordinated care.

### Improved Accuracy
Digital records reduce errors from illegible handwriting and ensure information is complete and accurate.

### Enhanced Security
Advanced encryption and security measures protect your sensitive health information.

## How to Access Your Records

1. Log in to your patient portal
2. Navigate to "Medical Records"
3. View, download, or share your records as needed

## Understanding Your Records

### Lab Results
Learn to read common lab values and what they mean for your health. Always discuss results with your healthcare provider.

### Medications
Keep track of current medications, dosages, and refill dates. Report any side effects to your doctor.

### Diagnoses
Understand your medical conditions and treatment plans. Don't hesitate to ask questions.

## Privacy and Security

Your medical records are protected by:
- 256-bit encryption
- HIPAA compliance
- Multi-factor authentication
- Regular security audits
- Strict access controls

## Sharing Your Records

You can securely share your medical records with:
- New healthcare providers
- Specialists
- Family members (with your permission)
- Insurance companies

## Tips for Managing Your Records

1. **Review Regularly**: Check your records for accuracy
2. **Update Information**: Keep contact and insurance information current
3. **Track Changes**: Monitor new entries and test results
4. **Ask Questions**: Don't hesitate to clarify anything you don't understand
5. **Download Copies**: Keep personal backups of important documents

## Your Rights

You have the right to:
- Access your medical records
- Request corrections to inaccurate information
- Know who has accessed your records
- Receive copies of your records
- Control who can view your information

Take control of your health by actively managing your digital medical records. If you have questions, our support team is here to help!
    `,
    category: "Guides",
    status: "published",
    featured: true,
    tags: ["medical records", "EHR", "patient education", "privacy"],
  },
  {
    title: "The Importance of Regular Health Checkups",
    description:
      "Why preventive care matters and how regular checkups can help detect health issues early.",
    content: `
# The Importance of Regular Health Checkups

Prevention is better than cure. Regular health checkups are essential for maintaining good health and catching potential problems early.

## Why Regular Checkups Matter

Regular health screenings can detect diseases early when they're most treatable. Many serious conditions, including heart disease, diabetes, and cancer, can develop without obvious symptoms.

## Recommended Checkup Schedule

### Annual Checkups
- Physical examination
- Blood pressure screening
- Weight and BMI assessment
- General health discussion

### Age-Specific Screenings
Different age groups require different screenings. Consult with your healthcare provider about what's right for you.

## What to Expect

During a routine checkup, your doctor will:
1. Review your medical history
2. Perform a physical examination
3. Order necessary tests
4. Discuss lifestyle and health concerns
5. Update vaccinations if needed

## Preparing for Your Checkup

- List current medications
- Note any symptoms or concerns
- Bring previous medical records
- Prepare questions for your doctor

Schedule your checkup today through our easy online booking system!
    `,
    category: "Health Tips",
    status: "published",
    featured: false,
    tags: ["preventive care", "checkups", "wellness", "screening"],
  },
  {
    title: "Managing Stress for Better Health",
    description:
      "Practical strategies for managing stress and improving your overall wellbeing.",
    content: `
# Managing Stress for Better Health

Stress is a normal part of life, but chronic stress can take a toll on your physical and mental health. Learn effective strategies to manage stress and improve your wellbeing.

## Understanding Stress

Stress affects everyone differently. Common signs include:
- Headaches
- Muscle tension
- Fatigue
- Sleep problems
- Anxiety
- Irritability

## Stress Management Techniques

### 1. Mindfulness and Meditation
Practice being present in the moment. Even 5-10 minutes daily can make a difference.

### 2. Regular Exercise
Physical activity releases endorphins, natural mood boosters that help reduce stress.

### 3. Healthy Sleep Habits
Aim for 7-9 hours of quality sleep each night. Establish a consistent sleep schedule.

### 4. Social Connections
Spend time with friends and family. Strong social support helps buffer stress.

### 5. Time Management
Prioritize tasks and learn to say no. Don't overcommit yourself.

## When to Seek Help

If stress is overwhelming or affecting your daily life, consider speaking with a mental health professional. Our platform makes it easy to connect with qualified therapists and counselors.

Remember, taking care of your mental health is just as important as your physical health!
    `,
    category: "Wellness",
    status: "published",
    featured: false,
    tags: ["stress management", "mental health", "wellness", "self-care"],
  },
];

const seedBlogPosts = async () => {
  try {
    await connectDB();

    // Clear existing blog posts
    await BlogPost.deleteMany({});
    console.log("Cleared existing blog posts");

    // Find an admin user to be the author
    const adminUser = await User.findOne({ role: "admin" });

    if (!adminUser) {
      console.error("No admin user found. Please create an admin user first.");
      process.exit(1);
    }

    // Add author to each blog post and create them one by one
    const createdPosts = [];
    for (const postData of blogPosts) {
      const post = new BlogPost({
        ...postData,
        author: adminUser._id,
      });
      await post.save();
      createdPosts.push(post);
    }

    console.log(`✅ Successfully created ${createdPosts.length} blog posts`);

    // Display created posts
    createdPosts.forEach((post) => {
      console.log(`- ${post.title} (${post.category}) - Featured: ${post.featured}`);
    });

    process.exit(0);
  } catch (error) {
    console.error("Error seeding blog posts:", error);
    process.exit(1);
  }
};

seedBlogPosts();
