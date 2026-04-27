import { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Calendar,
  Users,
  Shield,
  Clock,
  Heart,
  Activity,
  FileText,
  CheckCircle,
  ArrowRight,
  UserCheck,
  Stethoscope,
  Award,
  TrendingUp,
  MessageSquare,
  Bell,
  Smartphone,
  Lock,
  Star,
  Video,
  ClipboardCheck,
  HelpCircle,
  Mail,
  Phone,
  MapPin,
  ChevronDown,
} from "lucide-react";
import { AuthContext } from "../context/AuthContext";

const LandingPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  useEffect(() => {
    // Redirect logged-in users to their dashboard
    if (user) {
      if (user.role === "admin") {
        navigate("/admin");
      } else if (user.role === "doctor") {
        navigate("/doctor");
      } else if (user.role === "patient") {
        navigate("/patient");
      }
    }
  }, [user, navigate]);

  const features = [
    {
      icon: Calendar,
      title: "Easy Appointment Booking",
      description:
        "Book appointments with your preferred doctors in just a few clicks. Real-time availability and instant confirmation.",
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      icon: FileText,
      title: "Digital Medical Records",
      description:
        "Access your complete medical history, prescriptions, and lab results anytime, anywhere. Secure and organized.",
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/30",
    },
    {
      icon: Users,
      title: "Expert Healthcare Professionals",
      description:
        "Connect with qualified doctors across various specializations. View profiles, ratings, and patient reviews.",
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description:
        "Your health data is protected with enterprise-grade security. HIPAA compliant and encrypted end-to-end.",
      color: "text-red-600",
      bgColor: "bg-red-100 dark:bg-red-900/30",
    },
    {
      icon: Clock,
      title: "24/7 Access",
      description:
        "Manage your healthcare on your schedule. Book appointments, view records, and communicate with doctors anytime.",
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/30",
    },
    {
      icon: Activity,
      title: "Real-time Updates",
      description:
        "Get instant notifications for appointment confirmations, reminders, and important health updates.",
      color: "text-cyan-600",
      bgColor: "bg-cyan-100 dark:bg-cyan-900/30",
    },
  ];

  const howItWorks = [
    {
      step: "1",
      title: "Create Your Account",
      description:
        "Sign up in minutes with your basic information. Choose your role as a patient or healthcare provider.",
      icon: UserCheck,
    },
    {
      step: "2",
      title: "Complete Your Profile",
      description:
        "Add your medical history, allergies, and preferences for personalized healthcare management.",
      icon: FileText,
    },
    {
      step: "3",
      title: "Book Appointments",
      description:
        "Browse doctors by specialization, check availability, and book appointments instantly.",
      icon: Calendar,
    },
    {
      step: "4",
      title: "Manage Your Health",
      description:
        "Access medical records, prescriptions, and track your health journey all in one place.",
      icon: Heart,
    },
  ];

  const stats = [
    { number: "500+", label: "Healthcare Professionals" },
    { number: "10,000+", label: "Happy Patients" },
    { number: "50,000+", label: "Appointments Completed" },
    { number: "99.9%", label: "Uptime Guarantee" },
  ];

  const specializations = [
    {
      name: "Cardiology",
      icon: Heart,
      doctors: "45+",
      description: "Heart and cardiovascular care",
    },
    {
      name: "Neurology",
      icon: Activity,
      doctors: "38+",
      description: "Brain and nervous system",
    },
    {
      name: "Pediatrics",
      icon: Users,
      doctors: "52+",
      description: "Children's healthcare",
    },
    {
      name: "Orthopedics",
      icon: Stethoscope,
      doctors: "41+",
      description: "Bone and joint care",
    },
    {
      name: "Dermatology",
      icon: Award,
      doctors: "29+",
      description: "Skin and hair care",
    },
    {
      name: "General Medicine",
      icon: ClipboardCheck,
      doctors: "67+",
      description: "Primary healthcare",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Patient",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
      rating: 5,
      text: "This platform has transformed how I manage my health. Booking appointments is so easy, and I can access all my medical records in one place.",
    },
    {
      name: "Dr. Michael Chen",
      role: "Cardiologist",
      image:
        "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop",
      rating: 5,
      text: "As a healthcare provider, this system streamlines my workflow. Patient management, scheduling, and record-keeping have never been easier.",
    },
    {
      name: "Emily Rodriguez",
      role: "Patient",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
      rating: 5,
      text: "The real-time notifications and 24/7 access to my health information give me peace of mind. Highly recommend this platform!",
    },
  ];

  const benefits = [
    {
      icon: Smartphone,
      title: "Mobile-Friendly",
      description: "Access your healthcare from any device, anywhere, anytime.",
    },
    {
      icon: Bell,
      title: "Smart Reminders",
      description: "Never miss an appointment with automated notifications.",
    },
    {
      icon: Video,
      title: "Telemedicine Ready",
      description: "Connect with doctors virtually when needed.",
    },
    {
      icon: Lock,
      title: "Data Privacy",
      description: "Your health data is encrypted and HIPAA compliant.",
    },
    {
      icon: TrendingUp,
      title: "Health Analytics",
      description: "Track your health trends and progress over time.",
    },
    {
      icon: MessageSquare,
      title: "Direct Communication",
      description: "Message your healthcare providers securely.",
    },
  ];

  const faqs = [
    {
      question: "How do I book an appointment?",
      answer:
        "Simply sign up, complete your profile, browse available doctors by specialization, and select a convenient time slot. You'll receive instant confirmation and reminders.",
    },
    {
      question: "Is my medical data secure?",
      answer:
        "Absolutely. We use enterprise-grade encryption, are HIPAA compliant, and conduct regular security audits. Your data is protected both in transit and at rest.",
    },
    {
      question: "Can I access my medical records anytime?",
      answer:
        "Yes! Your complete medical history, prescriptions, lab results, and appointment records are available 24/7 from any device with internet access.",
    },
    {
      question: "What if I need to cancel an appointment?",
      answer:
        "You can cancel or reschedule appointments directly from your dashboard. We recommend doing so at least 24 hours in advance as a courtesy to healthcare providers.",
    },
    {
      question: "Do you support telemedicine consultations?",
      answer:
        "Yes, many of our healthcare providers offer virtual consultations. You can filter for telemedicine-enabled doctors when booking appointments.",
    },
    {
      question: "How do I become a healthcare provider on this platform?",
      answer:
        "Healthcare providers are onboarded by our admin team to ensure credential verification and quality standards. Please contact our support team for more information.",
    },
  ];

  const pricingPlans = [
    {
      name: "For Patients",
      price: "Free",
      description: "Complete healthcare management at no cost",
      features: [
        "Unlimited appointment bookings",
        "Digital medical records access",
        "Secure messaging with doctors",
        "Appointment reminders",
        "Health analytics dashboard",
        "24/7 platform access",
      ],
      cta: "Get Started",
      popular: false,
    },
    {
      name: "For Doctors",
      price: "Custom",
      description: "Professional tools for healthcare providers",
      features: [
        "Patient management system",
        "Appointment scheduling",
        "Digital prescription tools",
        "Medical records management",
        "Analytics and reporting",
        "Secure communication",
      ],
      cta: "Contact Us",
      popular: true,
    },
    {
      name: "For Healthcare Facilities",
      price: "Enterprise",
      description: "Comprehensive solution for medical institutions",
      features: [
        "Multi-provider management",
        "Advanced analytics",
        "Custom integrations",
        "Dedicated support",
        "Training and onboarding",
        "SLA guarantees",
      ],
      cta: "Contact Sales",
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <style>{`
        html {
          scroll-behavior: smooth;
          scroll-padding-top: 80px;
        }
      `}</style>
      {/* Navigation */}
      <nav className="bg-white dark:bg-slate-800 shadow-sm fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-dark dark:text-slate-100">
                HealthCare
              </span>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <a
                href="#about"
                className="text-gray-700 dark:text-slate-300 hover:text-primary transition-colors">
                About
              </a>
              <a
                href="#features"
                className="text-gray-700 dark:text-slate-300 hover:text-primary transition-colors">
                Features
              </a>
              <a
                href="#specializations"
                className="text-gray-700 dark:text-slate-300 hover:text-primary transition-colors">
                Specializations
              </a>
              <a
                href="#pricing"
                className="text-gray-700 dark:text-slate-300 hover:text-primary transition-colors">
                Pricing
              </a>
              <a
                href="#contact"
                className="text-gray-700 dark:text-slate-300 hover:text-primary transition-colors">
                Contact
              </a>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="px-4 py-2 text-gray-700 dark:text-slate-300 hover:text-primary transition-colors">
                Login
              </Link>
              <Link
                to="/register"
                className="px-6 py-2 bg-primary hover:bg-blue-800 text-white rounded-xl transition-colors">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold text-dark dark:text-slate-100 leading-tight mb-6">
                Your Health,
                <br />
                <span className="text-primary">Our Priority</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-slate-400 mb-8">
                Modern healthcare management platform connecting patients with
                healthcare professionals. Book appointments, access medical
                records, and manage your health journey seamlessly.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/register"
                  className="flex items-center justify-center gap-2 px-8 py-4 bg-primary hover:bg-blue-800 text-white rounded-xl transition-colors text-lg font-medium">
                  Get Started Free
                  <ArrowRight size={20} />
                </Link>
                <Link
                  to="/login"
                  className="flex items-center justify-center gap-2 px-8 py-4 border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-xl transition-colors text-lg font-medium">
                  Sign In
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl p-8 backdrop-blur-sm">
                <img
                  src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop"
                  alt="Healthcare professionals"
                  className="rounded-2xl shadow-2xl w-full h-auto"
                />
              </div>
              {/* Floating Stats */}
              <div className="absolute -bottom-6 -left-6 bg-white dark:bg-slate-800 rounded-xl shadow-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-dark dark:text-slate-100">
                      99.9%
                    </p>
                    <p className="text-sm text-gray-600 dark:text-slate-400">
                      Patient Satisfaction
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-4xl font-bold text-white mb-2">
                  {stat.number}
                </p>
                <p className="text-blue-100">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section
        id="about"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&h=600&fit=crop"
                alt="Healthcare team"
                className="rounded-2xl shadow-2xl w-full h-auto"
              />
            </div>
            <div>
              <h2 className="text-4xl font-bold text-dark dark:text-slate-100 mb-6">
                About Our Healthcare Platform
              </h2>
              <p className="text-lg text-gray-600 dark:text-slate-400 mb-6">
                We are dedicated to revolutionizing healthcare management by
                connecting patients with qualified healthcare professionals
                through cutting-edge technology. Our mission is to make quality
                healthcare accessible, efficient, and patient-centered.
              </p>
              <p className="text-lg text-gray-600 dark:text-slate-400 mb-6">
                Founded with the vision of bridging the gap between patients and
                healthcare providers, our platform serves thousands of users
                daily, facilitating seamless appointment scheduling, secure
                medical record management, and real-time communication.
              </p>
              <div className="grid grid-cols-2 gap-6 mt-8">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Award className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-dark dark:text-slate-100">
                        10+
                      </p>
                      <p className="text-sm text-gray-600 dark:text-slate-400">
                        Years Experience
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-dark dark:text-slate-100">
                        50+
                      </p>
                      <p className="text-sm text-gray-600 dark:text-slate-400">
                        Team Members
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-dark dark:text-slate-100 mb-4">
                  Our Core Values
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-dark dark:text-slate-100">
                        Patient-Centered Care
                      </p>
                      <p className="text-sm text-gray-600 dark:text-slate-400">
                        Your health and wellbeing are our top priorities
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-dark dark:text-slate-100">
                        Innovation & Technology
                      </p>
                      <p className="text-sm text-gray-600 dark:text-slate-400">
                        Leveraging latest tech for better healthcare delivery
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-dark dark:text-slate-100">
                        Trust & Transparency
                      </p>
                      <p className="text-sm text-gray-600 dark:text-slate-400">
                        Building lasting relationships through honesty
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-dark dark:text-slate-100 mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-gray-600 dark:text-slate-400 max-w-2xl mx-auto">
              Experience healthcare management that's simple, secure, and
              designed for your convenience.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow">
                <div
                  className={`w-14 h-14 ${feature.bgColor} rounded-xl flex items-center justify-center mb-4`}>
                  <feature.icon className={`w-7 h-7 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-bold text-dark dark:text-slate-100 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-slate-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-dark dark:text-slate-100 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-slate-400 max-w-2xl mx-auto">
              Get started with our platform in four simple steps
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((item, index) => (
              <div key={index} className="relative">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute top-8 left-1/2 w-full h-0.5 bg-gray-200 dark:bg-slate-700 -z-10 hidden lg:block">
                    {index < howItWorks.length - 1 && (
                      <div className="w-full h-full bg-primary"></div>
                    )}
                  </div>
                  <div className="mb-4">
                    <span className="inline-block w-8 h-8 bg-primary/10 text-primary rounded-full font-bold">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-dark dark:text-slate-100 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-slate-400">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specializations Section */}
      <section
        id="specializations"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-dark dark:text-slate-100 mb-4">
              Medical Specializations
            </h2>
            <p className="text-xl text-gray-600 dark:text-slate-400 max-w-2xl mx-auto">
              Connect with expert doctors across various medical specializations
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {specializations.map((spec, index) => (
              <div
                key={index}
                className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <spec.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-dark dark:text-slate-100 mb-1">
                      {spec.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-slate-400 mb-2">
                      {spec.description}
                    </p>
                    <p className="text-sm font-semibold text-primary">
                      {spec.doctors} Doctors Available
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Benefits with Image */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <div className="order-2 lg:order-1">
              <h2 className="text-4xl font-bold text-dark dark:text-slate-100 mb-6">
                Advanced Healthcare Technology
              </h2>
              <p className="text-lg text-gray-600 dark:text-slate-400 mb-8">
                Our platform leverages cutting-edge technology to provide you
                with the best healthcare experience. From AI-powered appointment
                scheduling to secure data encryption, we've got you covered.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-dark dark:text-slate-100 mb-1">
                        {benefit.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-slate-400">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=800&h=600&fit=crop"
                  alt="Healthcare technology"
                  className="rounded-2xl shadow-2xl w-full h-auto"
                />
                <div className="absolute -bottom-6 -right-6 bg-white dark:bg-slate-800 rounded-xl shadow-xl p-4 max-w-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-dark dark:text-slate-100">
                        HIPAA Compliant
                      </p>
                      <p className="text-xs text-gray-600 dark:text-slate-400">
                        Enterprise-grade security
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        id="testimonials"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-dark dark:text-slate-100 mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600 dark:text-slate-400 max-w-2xl mx-auto">
              Trusted by thousands of patients and healthcare professionals
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-slate-400 mb-6 italic">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center gap-3">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-dark dark:text-slate-100">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-slate-400">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Security Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=600&fit=crop"
                alt="Medical professionals"
                className="rounded-2xl shadow-2xl w-full h-auto"
              />
            </div>
            <div>
              <h2 className="text-4xl font-bold text-dark dark:text-slate-100 mb-6">
                Your Trust, Our Responsibility
              </h2>
              <p className="text-lg text-gray-600 dark:text-slate-400 mb-6">
                We understand that your health information is sensitive and
                personal. That's why we've implemented industry-leading security
                measures to protect your data.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-dark dark:text-slate-100 mb-1">
                      End-to-End Encryption
                    </h4>
                    <p className="text-gray-600 dark:text-slate-400">
                      All your medical data is encrypted both in transit and at
                      rest
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-dark dark:text-slate-100 mb-1">
                      HIPAA Compliance
                    </h4>
                    <p className="text-gray-600 dark:text-slate-400">
                      Fully compliant with healthcare data protection
                      regulations
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-dark dark:text-slate-100 mb-1">
                      Regular Security Audits
                    </h4>
                    <p className="text-gray-600 dark:text-slate-400">
                      Continuous monitoring and third-party security assessments
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-dark dark:text-slate-100 mb-1">
                      Access Control
                    </h4>
                    <p className="text-gray-600 dark:text-slate-400">
                      You control who can access your medical information
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section
        id="pricing"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-dark dark:text-slate-100 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 dark:text-slate-400 max-w-2xl mx-auto">
              Choose the plan that works best for you
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm ${
                  plan.popular
                    ? "ring-2 ring-primary transform scale-105"
                    : "hover:shadow-md"
                } transition-all`}>
                {plan.popular && (
                  <div className="bg-primary text-white text-sm font-semibold px-3 py-1 rounded-full inline-block mb-4">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold text-dark dark:text-slate-100 mb-2">
                  {plan.name}
                </h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-primary">
                    {plan.price}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-slate-400 mb-6">
                  {plan.description}
                </p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600 dark:text-slate-400">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link
                  to={plan.price === "Free" ? "/register" : "/login"}
                  className={`block text-center px-6 py-3 rounded-xl transition-colors ${
                    plan.popular
                      ? "bg-primary text-white hover:bg-blue-800"
                      : "border-2 border-primary text-primary hover:bg-primary hover:text-white"
                  }`}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section
        id="faq"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-800">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-dark dark:text-slate-100 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 dark:text-slate-400">
              Everything you need to know about our platform
            </p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-gray-50 dark:bg-slate-900 rounded-xl overflow-hidden transition-all">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <HelpCircle className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-dark dark:text-slate-100 pr-4">
                      {faq.question}
                    </h3>
                  </div>
                  <ChevronDown
                    className={`w-6 h-6 text-gray-600 dark:text-slate-400 flex-shrink-0 transition-transform duration-300 ${
                      openFaqIndex === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openFaqIndex === index
                      ? "max-h-96 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}>
                  <div className="px-6 pb-6 pl-18">
                    <p className="text-gray-600 dark:text-slate-400 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-primary to-blue-800 rounded-3xl p-12 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Stay Updated with Health Tips
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Subscribe to our newsletter for health tips, platform updates, and
              exclusive offers
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-3 rounded-xl border-0 focus:ring-2 focus:ring-white"
              />
              <button className="px-8 py-3 bg-white text-primary hover:bg-gray-100 rounded-xl transition-colors font-medium whitespace-nowrap">
                Subscribe
              </button>
            </div>
            <p className="text-sm text-blue-100 mt-4">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>

      {/* Contact/Support Section */}
      <section
        id="contact"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-dark dark:text-slate-100 mb-4">
              Need Help? We're Here for You
            </h2>
            <p className="text-xl text-gray-600 dark:text-slate-400 max-w-2xl mx-auto">
              Our support team is available 24/7 to assist you
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-dark dark:text-slate-100 mb-2">
                Call Us
              </h3>
              <p className="text-gray-600 dark:text-slate-400 mb-2">
                Available 24/7 for emergencies
              </p>
              <a
                href="tel:+1234567890"
                className="text-primary hover:underline font-medium">
                +1 (234) 567-890
              </a>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-dark dark:text-slate-100 mb-2">
                Email Us
              </h3>
              <p className="text-gray-600 dark:text-slate-400 mb-2">
                We'll respond within 24 hours
              </p>
              <a
                href="mailto:support@healthcare.com"
                className="text-primary hover:underline font-medium">
                support@healthcare.com
              </a>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-dark dark:text-slate-100 mb-2">
                Visit Us
              </h3>
              <p className="text-gray-600 dark:text-slate-400 mb-2">
                Main office location
              </p>
              <p className="text-primary font-medium">
                123 Healthcare Ave, Medical District
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Careers Section */}
      <section
        id="careers"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-dark dark:text-slate-100 mb-4">
              Join Our Team
            </h2>
            <p className="text-xl text-gray-600 dark:text-slate-400 max-w-2xl mx-auto">
              Be part of a mission to transform healthcare delivery. We're
              always looking for talented individuals who share our passion.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop"
                alt="Team collaboration"
                className="rounded-2xl shadow-2xl w-full h-auto"
              />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-dark dark:text-slate-100 mb-6">
                Why Work With Us?
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Heart className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-dark dark:text-slate-100 mb-1">
                      Make a Real Impact
                    </h4>
                    <p className="text-gray-600 dark:text-slate-400">
                      Help improve healthcare access for thousands of patients
                      daily
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-dark dark:text-slate-100 mb-1">
                      Growth Opportunities
                    </h4>
                    <p className="text-gray-600 dark:text-slate-400">
                      Continuous learning and career advancement programs
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-dark dark:text-slate-100 mb-1">
                      Collaborative Culture
                    </h4>
                    <p className="text-gray-600 dark:text-slate-400">
                      Work with passionate professionals in a supportive
                      environment
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-dark dark:text-slate-100 mb-1">
                      Competitive Benefits
                    </h4>
                    <p className="text-gray-600 dark:text-slate-400">
                      Comprehensive health coverage, flexible hours, and more
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Stethoscope className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-dark dark:text-slate-100 mb-3">
                Healthcare Professionals
              </h3>
              <p className="text-gray-600 dark:text-slate-400 mb-4">
                Join our network of qualified doctors and specialists providing
                quality care to patients.
              </p>
              <a
                href="#contact"
                className="text-primary hover:underline font-medium">
                Learn More →
              </a>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Activity className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-dark dark:text-slate-100 mb-3">
                Technology & Engineering
              </h3>
              <p className="text-gray-600 dark:text-slate-400 mb-4">
                Build innovative solutions that power our healthcare platform
                and improve user experience.
              </p>
              <a
                href="#contact"
                className="text-primary hover:underline font-medium">
                Learn More →
              </a>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-dark dark:text-slate-100 mb-3">
                Support & Operations
              </h3>
              <p className="text-gray-600 dark:text-slate-400 mb-4">
                Help our users navigate the platform and ensure smooth
                operations every day.
              </p>
              <a
                href="#contact"
                className="text-primary hover:underline font-medium">
                Learn More →
              </a>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-lg text-gray-600 dark:text-slate-400 mb-6">
              Don't see a position that fits? Send us your resume anyway!
            </p>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary hover:bg-blue-800 text-white rounded-xl transition-colors text-lg font-medium">
              Get In Touch
              <ArrowRight size={20} />
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary to-blue-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Take Control of Your Health?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of patients and healthcare professionals using our
            platform every day.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary hover:bg-gray-100 rounded-xl transition-colors text-lg font-medium">
            Create Free Account
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-white">HealthCare</span>
              </div>
              <p className="text-slate-400">
                Modern healthcare management platform for better health
                outcomes.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Platform</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/register"
                    className="hover:text-white transition-colors">
                    For Patients
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="hover:text-white transition-colors">
                    For Doctors
                  </Link>
                </li>
                <li>
                  <a
                    href="#features"
                    className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#about"
                    className="hover:text-white transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#contact"
                    className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a
                    href="#careers"
                    className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#privacy"
                    className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#terms"
                    className="hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="#security"
                    className="hover:text-white transition-colors">
                    Security
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-slate-400">
            <p>
              &copy; {new Date().getFullYear()} HealthCare Management System.
              All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
