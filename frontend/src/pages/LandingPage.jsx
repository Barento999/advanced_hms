import { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
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
  Moon,
  Sun,
  ChevronUp,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Menu,
  X,
  ShieldCheck,
  BadgeCheck,
  Award as AwardIcon,
  CheckCircle2,
  Calendar as CalendarIcon,
  BookOpen,
  AlertTriangle,
  Globe,
  Zap,
  Target,
  Briefcase,
} from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";

const LandingPage = () => {
  const { user } = useContext(AuthContext);
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [stats, setStats] = useState([
    { number: "500+", label: "Healthcare Professionals" },
    { number: "10,000+", label: "Happy Patients" },
    { number: "50,000+", label: "Appointments Completed" },
    { number: "99.9%", label: "Uptime Guarantee" },
  ]);
  const [specializations, setSpecializations] = useState([]);
  const [testimonials, setTestimonials] = useState([
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
  ]);
  const [loading, setLoading] = useState(true);
  const [blogPosts, setBlogPosts] = useState([]);
  const [showEmergencyBanner, setShowEmergencyBanner] = useState(true);

  // Scroll animation setup
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -100px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-fade-in-up");
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe all sections
    const sections = document.querySelectorAll(".scroll-animate");
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [loading]);

  // Scroll to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Helper function to get category icon and color
  const getCategoryStyle = (category) => {
    const styles = {
      "Health Tips": {
        icon: Heart,
        bgColor: "bg-primary/10 dark:bg-primary/20",
        iconColor: "text-primary",
        gradient: "from-primary/20",
      },
      "Platform Updates": {
        icon: Activity,
        bgColor: "bg-green-50 dark:bg-green-900/20",
        iconColor: "text-green-600 dark:text-green-400",
        gradient: "from-green-500/20",
      },
      Guides: {
        icon: Shield,
        bgColor: "bg-purple-50 dark:bg-purple-900/20",
        iconColor: "text-purple-600 dark:text-purple-400",
        gradient: "from-purple-500/20",
      },
      "Medical News": {
        icon: FileText,
        bgColor: "bg-blue-50 dark:bg-blue-900/20",
        iconColor: "text-blue-600 dark:text-blue-400",
        gradient: "from-blue-500/20",
      },
      Wellness: {
        icon: Heart,
        bgColor: "bg-pink-50 dark:bg-pink-900/20",
        iconColor: "text-pink-600 dark:text-pink-400",
        gradient: "from-pink-500/20",
      },
      Technology: {
        icon: Activity,
        bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
        iconColor: "text-indigo-600 dark:text-indigo-400",
        gradient: "from-indigo-500/20",
      },
      "Patient Stories": {
        icon: Users,
        bgColor: "bg-orange-50 dark:bg-orange-900/20",
        iconColor: "text-orange-600 dark:text-orange-400",
        gradient: "from-orange-500/20",
      },
      "Doctor Insights": {
        icon: Stethoscope,
        bgColor: "bg-teal-50 dark:bg-teal-900/20",
        iconColor: "text-teal-600 dark:text-teal-400",
        gradient: "from-teal-500/20",
      },
    };

    return (
      styles[category] || {
        icon: BookOpen,
        bgColor: "bg-gray-50 dark:bg-gray-900/20",
        iconColor: "text-gray-600 dark:text-gray-400",
        gradient: "from-gray-500/20",
      }
    );
  };

  // Format date for blog posts
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Icon mapping for specializations
  const specializationIcons = {
    Cardiology: Heart,
    Neurology: Activity,
    Pediatrics: Users,
    Orthopedics: Stethoscope,
    Dermatology: Award,
    "General Medicine": ClipboardCheck,
    Gynecology: Users,
    Psychiatry: Activity,
    Ophthalmology: Award,
    ENT: Stethoscope,
    Dentistry: ClipboardCheck,
    Radiology: Activity,
  };

  // Description mapping for specializations
  const specializationDescriptions = {
    Cardiology: "Heart and cardiovascular care",
    Neurology: "Brain and nervous system",
    Pediatrics: "Children's healthcare",
    Orthopedics: "Bone and joint care",
    Dermatology: "Skin and hair care",
    "General Medicine": "Primary healthcare",
    Gynecology: "Women's health",
    Psychiatry: "Mental health care",
    Ophthalmology: "Eye care",
    ENT: "Ear, nose, and throat",
    Dentistry: "Dental care",
    Radiology: "Medical imaging",
  };

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  useEffect(() => {
    const fetchLandingStats = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/auth/landing-stats",
        );
        if (response.data.success) {
          const {
            stats: dbStats,
            specializations: dbSpecs,
            testimonials: dbTestimonials,
          } = response.data.data;

          // Update stats
          setStats([
            {
              number: `${dbStats.doctors}+`,
              label: "Healthcare Professionals",
            },
            { number: `${dbStats.patients}+`, label: "Happy Patients" },
            {
              number: `${dbStats.appointments}+`,
              label: "Appointments Completed",
            },
            { number: "99.9%", label: "Uptime Guarantee" },
          ]);

          // Update specializations with real data
          const formattedSpecs = dbSpecs.map((spec) => ({
            name: spec.name,
            icon: specializationIcons[spec.name] || Stethoscope,
            doctors: `${spec.count}+`,
            description:
              specializationDescriptions[spec.name] ||
              "Specialized medical care",
          }));

          setSpecializations(formattedSpecs);

          // Update testimonials with real data if available
          if (dbTestimonials && dbTestimonials.length > 0) {
            setTestimonials(dbTestimonials);
          }
        }
      } catch (error) {
        console.error("Error fetching landing stats:", error);
        // Set default specializations on error
        setSpecializations([
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
        ]);
      } finally {
        // Add a minimum delay of 2 seconds to show skeletons
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      }
    };

    fetchLandingStats();
  }, []);

  // Fetch featured blog posts
  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/blog/featured?limit=3"
        );
        if (response.data.success) {
          setBlogPosts(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching blog posts:", error);
        // Keep default empty array on error
      }
    };

    fetchBlogPosts();
  }, []);

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
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 overflow-x-hidden">
      <style>{`
        html {
          scroll-behavior: smooth;
          scroll-padding-top: 80px;
          overflow-x: hidden;
        }
        
        body {
          overflow-x: hidden;
        }
        
        .scroll-animate {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }
        
        .animate-fade-in-up {
          opacity: 1;
          transform: translateY(0);
        }
        
        .animate-fade-in {
          animation: fadeIn 0.3s ease-in;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
      {/* Emergency Banner */}
      {showEmergencyBanner && (
        <div className="bg-red-600 text-white py-3 px-4 fixed w-full top-0 z-[60] shadow-lg left-0 right-0">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 animate-pulse">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm md:text-base truncate">
                  🚨 Medical Emergency? Call 911 Immediately
                </p>
                <p className="text-xs text-red-100 hidden sm:block truncate">
                  This platform is not for emergencies. For urgent care, contact emergency services.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowEmergencyBanner(false)}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors flex-shrink-0"
              aria-label="Close emergency banner">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className={`bg-white dark:bg-slate-800 shadow-sm fixed w-full z-50 transition-all left-0 right-0 ${showEmergencyBanner ? 'top-[52px]' : 'top-0'}`}>
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
              <Link
                to="/blog"
                className="text-gray-700 dark:text-slate-300 hover:text-primary transition-colors">
                Blog
              </Link>
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
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                aria-label="Toggle dark mode">
                {darkMode ? (
                  <Sun className="w-5 h-5 text-yellow-500" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-700" />
                )}
              </button>
              <Link
                to="/login"
                className="hidden md:block px-4 py-2 text-gray-700 dark:text-slate-300 hover:text-primary transition-colors whitespace-nowrap">
                Login
              </Link>
              <Link
                to="/register"
                className="hidden md:block px-6 py-2 bg-primary hover:bg-blue-800 text-white rounded-xl transition-colors whitespace-nowrap">
                Get Started
              </Link>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                aria-label="Toggle menu">
                {mobileMenuOpen ? (
                  <X className="w-6 h-6 text-gray-700 dark:text-slate-300" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-700 dark:text-slate-300" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200 dark:border-slate-700">
              <div className="flex flex-col space-y-4">
                <a
                  href="#about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-700 dark:text-slate-300 hover:text-primary transition-colors px-4 py-2">
                  About
                </a>
                <a
                  href="#features"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-700 dark:text-slate-300 hover:text-primary transition-colors px-4 py-2">
                  Features
                </a>
                <a
                  href="#specializations"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-700 dark:text-slate-300 hover:text-primary transition-colors px-4 py-2">
                  Specializations
                </a>
                <Link
                  to="/blog"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-700 dark:text-slate-300 hover:text-primary transition-colors px-4 py-2">
                  Blog
                </Link>
                <a
                  href="#pricing"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-700 dark:text-slate-300 hover:text-primary transition-colors px-4 py-2">
                  Pricing
                </a>
                <a
                  href="#contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-700 dark:text-slate-300 hover:text-primary transition-colors px-4 py-2">
                  Contact
                </a>
                <div className="border-t border-gray-200 dark:border-slate-700 pt-4 px-4 space-y-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-center px-4 py-2 text-gray-700 dark:text-slate-300 hover:text-primary transition-colors border border-gray-300 dark:border-slate-600 rounded-xl">
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-center px-6 py-2 bg-primary hover:bg-blue-800 text-white rounded-xl transition-colors">
                    Get Started
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className={`pt-32 pb-20 px-4 sm:px-6 lg:px-8 scroll-animate ${showEmergencyBanner ? 'mt-[52px]' : ''}`}>
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
                  src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=800&h=600&fit=crop&q=80"
                  alt="Healthcare professionals using technology"
                  className="rounded-2xl shadow-2xl w-full h-auto object-cover"
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
      <section className="py-16 bg-primary scroll-animate">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="text-center animate-pulse">
                  <div className="h-10 bg-white/20 rounded w-24 mx-auto mb-2"></div>
                  <div className="h-4 bg-white/20 rounded w-32 mx-auto"></div>
                </div>
              ))}
            </div>
          ) : (
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
          )}
        </div>
      </section>

      {/* About Us Section */}
      <section
        id="about"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-800 scroll-animate">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=600&fit=crop&q=80"
                alt="Diverse healthcare team collaborating"
                className="rounded-2xl shadow-2xl w-full h-auto object-cover"
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
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 scroll-animate">
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
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-800 scroll-animate">
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
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 relative z-10">
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  {/* Connecting line - only show on large screens and not for last item */}
                  {index < howItWorks.length - 1 && (
                    <div className="absolute top-8 left-1/2 w-full h-0.5 bg-primary -z-0 hidden lg:block" style={{ width: 'calc(100% - 2rem)' }}></div>
                  )}
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

      {/* Doctor Verification Process Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-slate-900 scroll-animate">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
              <ShieldCheck className="w-5 h-5 text-primary" />
              <span className="text-primary font-semibold">Verified Healthcare Professionals</span>
            </div>
            <h2 className="text-4xl font-bold text-dark dark:text-slate-100 mb-4">
              Rigorous Doctor Verification Process
            </h2>
            <p className="text-xl text-gray-600 dark:text-slate-400 max-w-3xl mx-auto">
              Every healthcare provider on our platform undergoes comprehensive verification to ensure you receive care from qualified, licensed professionals.
            </p>
          </div>

          {/* Featured Image */}
          <div className="mb-12">
            <img
              src="https://images.unsplash.com/photo-1584982751601-97dcc096659c?w=1200&h=400&fit=crop&q=80"
              alt="Medical professionals with credentials and certifications"
              className="rounded-2xl shadow-lg w-full h-64 object-cover"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
              <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-4">
                <BadgeCheck className="w-7 h-7 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-dark dark:text-slate-100 mb-3">
                License Verification
              </h3>
              <p className="text-gray-600 dark:text-slate-400 mb-4">
                We verify active medical licenses with state medical boards and ensure all credentials are current and in good standing.
              </p>
              <div className="flex items-center gap-2 text-sm text-primary font-medium">
                <CheckCircle className="w-4 h-4" />
                <span>100% Verified</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
              <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mb-4">
                <Award className="w-7 h-7 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-dark dark:text-slate-100 mb-3">
                Board Certification
              </h3>
              <p className="text-gray-600 dark:text-slate-400 mb-4">
                Confirmation of board certification in their specialty areas, ensuring expertise and adherence to professional standards.
              </p>
              <div className="flex items-center gap-2 text-sm text-primary font-medium">
                <CheckCircle className="w-4 h-4" />
                <span>Specialty Verified</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
              <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-7 h-7 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-dark dark:text-slate-100 mb-3">
                Background Screening
              </h3>
              <p className="text-gray-600 dark:text-slate-400 mb-4">
                Comprehensive background checks including malpractice history, disciplinary actions, and professional references.
              </p>
              <div className="flex items-center gap-2 text-sm text-primary font-medium">
                <CheckCircle className="w-4 h-4" />
                <span>Fully Screened</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
              <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center mb-4">
                <BookOpen className="w-7 h-7 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-xl font-bold text-dark dark:text-slate-100 mb-3">
                Continuing Education
              </h3>
              <p className="text-gray-600 dark:text-slate-400 mb-4">
                Verification of ongoing medical education credits to ensure providers stay current with latest medical practices.
              </p>
              <div className="flex items-center gap-2 text-sm text-primary font-medium">
                <CheckCircle className="w-4 h-4" />
                <span>Up-to-Date</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
              <div className="w-14 h-14 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-7 h-7 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-dark dark:text-slate-100 mb-3">
                Peer Review
              </h3>
              <p className="text-gray-600 dark:text-slate-400 mb-4">
                Regular peer reviews and quality assessments to maintain high standards of care and patient satisfaction.
              </p>
              <div className="flex items-center gap-2 text-sm text-primary font-medium">
                <CheckCircle className="w-4 h-4" />
                <span>Quality Assured</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
              <div className="w-14 h-14 bg-cyan-100 dark:bg-cyan-900/30 rounded-xl flex items-center justify-center mb-4">
                <FileText className="w-7 h-7 text-cyan-600 dark:text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold text-dark dark:text-slate-100 mb-3">
                Insurance & Liability
              </h3>
              <p className="text-gray-600 dark:text-slate-400 mb-4">
                Confirmation of active malpractice insurance and professional liability coverage for your protection.
              </p>
              <div className="flex items-center gap-2 text-sm text-primary font-medium">
                <CheckCircle className="w-4 h-4" />
                <span>Fully Insured</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-sm">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-800 rounded-xl flex items-center justify-center flex-shrink-0">
                <Target className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold text-dark dark:text-slate-100 mb-2">
                  Our Commitment to Quality
                </h3>
                <p className="text-gray-600 dark:text-slate-400">
                  We maintain the highest standards of healthcare provider verification. Our multi-step process ensures that every doctor on our platform meets rigorous professional and ethical standards, giving you peace of mind when booking appointments.
                </p>
              </div>
              <div className="flex-shrink-0">
                <div className="text-center px-6 py-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                  <p className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">100%</p>
                  <p className="text-sm text-gray-600 dark:text-slate-400">Verified Providers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Insurance & Payment Information Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-800 scroll-animate">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
              <Briefcase className="w-5 h-5 text-green-600 dark:text-green-400" />
              <span className="text-green-600 dark:text-green-400 font-semibold">Transparent Pricing</span>
            </div>
            <h2 className="text-4xl font-bold text-dark dark:text-slate-100 mb-4">
              Insurance & Payment Options
            </h2>
            <p className="text-xl text-gray-600 dark:text-slate-400 max-w-3xl mx-auto">
              We accept most major insurance plans and offer flexible payment options to make quality healthcare accessible to everyone.
            </p>
          </div>

          {/* Featured Image */}
          <div className="mb-12">
            <img
              src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=400&fit=crop&q=80"
              alt="Healthcare payment and insurance planning"
              className="rounded-2xl shadow-lg w-full h-64 object-cover"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div className="bg-gray-50 dark:bg-slate-700 rounded-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-dark dark:text-slate-100">
                  Accepted Insurance
                </h3>
              </div>
              <p className="text-gray-600 dark:text-slate-400 mb-6">
                We work with most major insurance providers to ensure you can use your benefits:
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  "Blue Cross Blue Shield",
                  "Aetna",
                  "UnitedHealthcare",
                  "Cigna",
                  "Humana",
                  "Medicare",
                  "Medicaid",
                  "Kaiser Permanente",
                ].map((insurance, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-gray-700 dark:text-slate-300">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span className="text-sm">{insurance}</span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-600 dark:text-slate-400 mt-6 italic">
                Don't see your insurance? Contact us to verify coverage.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-slate-700 rounded-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-dark dark:text-slate-100">
                  Payment Methods
                </h3>
              </div>
              <p className="text-gray-600 dark:text-slate-400 mb-6">
                Multiple convenient payment options for your healthcare needs:
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-dark dark:text-slate-100">
                      Insurance Co-pays
                    </p>
                    <p className="text-sm text-gray-600 dark:text-slate-400">
                      Pay only your insurance co-payment amount
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-dark dark:text-slate-100">
                      Credit/Debit Cards
                    </p>
                    <p className="text-sm text-gray-600 dark:text-slate-400">
                      Visa, Mastercard, American Express, Discover
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-dark dark:text-slate-100">
                      HSA/FSA Cards
                    </p>
                    <p className="text-sm text-gray-600 dark:text-slate-400">
                      Use your health savings or flexible spending accounts
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-dark dark:text-slate-100">
                      Payment Plans
                    </p>
                    <p className="text-sm text-gray-600 dark:text-slate-400">
                      Flexible payment plans available for larger bills
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                <FileText className="w-7 h-7 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-bold text-dark dark:text-slate-100 mb-2">
                  Transparent Pricing Guarantee
                </h3>
                <p className="text-gray-600 dark:text-slate-400">
                  No hidden fees. No surprise bills. You'll know the cost upfront before booking any appointment. We provide detailed cost estimates and work with your insurance to maximize your benefits.
                </p>
              </div>
              <a
                href="#contact"
                className="px-6 py-3 bg-primary hover:bg-blue-800 text-white rounded-xl transition-colors font-medium whitespace-nowrap">
                Verify Coverage
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Specializations Section */}
      <section
        id="specializations"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-slate-900 scroll-animate">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-dark dark:text-slate-100 mb-4">
              Medical Specializations
            </h2>
            <p className="text-xl text-gray-600 dark:text-slate-400 max-w-2xl mx-auto">
              Connect with expert doctors across various medical specializations
            </p>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm animate-pulse">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gray-200 dark:bg-slate-700 rounded-lg flex-shrink-0"></div>
                    <div className="flex-1">
                      <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded w-32 mb-2"></div>
                      <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-full mb-2"></div>
                      <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-24"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
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
          )}
        </div>
      </section>

      {/* Platform Benefits with Image */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-800 scroll-animate">
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
                  src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop&q=80"
                  alt="Doctor using digital healthcare technology"
                  className="rounded-2xl shadow-2xl w-full h-auto object-cover"
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
        className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-slate-900 scroll-animate">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-dark dark:text-slate-100 mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600 dark:text-slate-400 max-w-2xl mx-auto">
              Trusted by thousands of patients and healthcare professionals
            </p>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm animate-pulse">
                  <div className="flex items-center gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((j) => (
                      <div
                        key={j}
                        className="w-5 h-5 bg-gray-200 dark:bg-slate-700 rounded"></div>
                    ))}
                  </div>
                  <div className="space-y-2 mb-6">
                    <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-3/4"></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-200 dark:bg-slate-700 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-24 mb-2"></div>
                      <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-16"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
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
          )}
        </div>
      </section>

      {/* Trust & Security Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-800 scroll-animate">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&h=600&fit=crop&q=80"
                alt="Healthcare professionals reviewing patient data securely"
                className="rounded-2xl shadow-2xl w-full h-auto object-cover"
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
        className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-slate-900 scroll-animate">
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
        className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-800 scroll-animate">
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

      {/* Blog/News Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-slate-900 scroll-animate">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-dark dark:text-slate-100 mb-4">
              Latest Health Tips & Updates
            </h2>
            <p className="text-xl text-gray-600 dark:text-slate-400 max-w-2xl mx-auto">
              Stay informed with our latest articles on health, wellness, and platform updates
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogPosts.length > 0 ? (
              blogPosts.map((post) => {
                const categoryStyle = getCategoryStyle(post.category);
                const CategoryIcon = categoryStyle.icon;

                return (
                  <article
                    key={post._id}
                    className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all hover:-translate-y-1">
                    <div className="h-48 relative overflow-hidden bg-gray-100 dark:bg-slate-700">
                      {post.featuredImage ? (
                        <img
                          src={post.featuredImage}
                          alt={post.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Fallback to category icon if image fails to load
                            e.target.style.display = 'none';
                            e.target.nextElementSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div
                        className={`absolute inset-0 ${categoryStyle.bgColor} ${post.featuredImage ? 'hidden' : 'flex'} items-center justify-center`}
                        style={{ display: post.featuredImage ? 'none' : 'flex' }}>
                        <div
                          className={`absolute inset-0 bg-gradient-to-br ${categoryStyle.gradient} to-transparent`}></div>
                        <CategoryIcon
                          className={`w-16 h-16 ${categoryStyle.iconColor} relative z-10`}
                        />
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400 mb-3">
                        <CalendarIcon className="w-4 h-4" />
                        <span>{formatDate(post.publishedAt)}</span>
                        <span className="mx-2">•</span>
                        <BookOpen className="w-4 h-4" />
                        <span>{post.readTime} min read</span>
                      </div>
                      <h3 className="text-xl font-bold text-dark dark:text-slate-100 mb-3">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 dark:text-slate-400 mb-4 line-clamp-3">
                        {post.description}
                      </p>
                      <Link
                        to={`/blog/${post.slug}`}
                        className="text-primary hover:text-blue-800 dark:hover:text-blue-400 font-medium inline-flex items-center gap-2 transition-colors">
                        Read More
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </article>
                );
              })
            ) : (
              // Fallback content when no blog posts are available
              <>
                <article className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all hover:-translate-y-1">
                  <div className="h-48 bg-primary/10 dark:bg-primary/20 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent"></div>
                    <Heart className="w-16 h-16 text-primary relative z-10" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400 mb-3">
                      <CalendarIcon className="w-4 h-4" />
                      <span>May 1, 2026</span>
                      <span className="mx-2">•</span>
                      <BookOpen className="w-4 h-4" />
                      <span>5 min read</span>
                    </div>
                    <h3 className="text-xl font-bold text-dark dark:text-slate-100 mb-3">
                      10 Tips for Maintaining Heart Health
                    </h3>
                    <p className="text-gray-600 dark:text-slate-400 mb-4 line-clamp-3">
                      Learn essential practices to keep your heart healthy and reduce the risk of cardiovascular diseases.
                    </p>
                    <Link
                      to="/blog"
                      className="text-primary hover:text-blue-800 dark:hover:text-blue-400 font-medium inline-flex items-center gap-2 transition-colors">
                      Read More
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </article>

                <article className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all hover:-translate-y-1">
                  <div className="h-48 bg-green-50 dark:bg-green-900/20 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-transparent"></div>
                    <Activity className="w-16 h-16 text-green-600 dark:text-green-400 relative z-10" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400 mb-3">
                      <CalendarIcon className="w-4 h-4" />
                      <span>April 28, 2026</span>
                      <span className="mx-2">•</span>
                      <BookOpen className="w-4 h-4" />
                      <span>4 min read</span>
                    </div>
                    <h3 className="text-xl font-bold text-dark dark:text-slate-100 mb-3">
                      New Feature: Virtual Consultations
                    </h3>
                    <p className="text-gray-600 dark:text-slate-400 mb-4 line-clamp-3">
                      We're excited to announce our new telemedicine feature, making healthcare more accessible than ever.
                    </p>
                    <Link
                      to="/blog"
                      className="text-primary hover:text-blue-800 dark:hover:text-blue-400 font-medium inline-flex items-center gap-2 transition-colors">
                      Read More
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </article>

                <article className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all hover:-translate-y-1">
                  <div className="h-48 bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-transparent"></div>
                    <Shield className="w-16 h-16 text-purple-600 dark:text-purple-400 relative z-10" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400 mb-3">
                      <CalendarIcon className="w-4 h-4" />
                      <span>April 25, 2026</span>
                      <span className="mx-2">•</span>
                      <BookOpen className="w-4 h-4" />
                      <span>6 min read</span>
                    </div>
                    <h3 className="text-xl font-bold text-dark dark:text-slate-100 mb-3">
                      Understanding Your Medical Records
                    </h3>
                    <p className="text-gray-600 dark:text-slate-400 mb-4 line-clamp-3">
                      A comprehensive guide to understanding and managing your digital medical records securely.
                    </p>
                    <Link
                      to="/blog"
                      className="text-primary hover:text-blue-800 dark:hover:text-blue-400 font-medium inline-flex items-center gap-2 transition-colors">
                      Read More
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </article>
              </>
            )}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 px-8 py-3 bg-primary hover:bg-blue-800 text-white rounded-xl transition-colors font-medium shadow-sm hover:shadow-md">
              View All Articles
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-slate-900 scroll-animate">
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
        className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-800 scroll-animate">
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
        className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-slate-900 scroll-animate">
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
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop&q=80"
                alt="Diverse team collaborating in modern healthcare environment"
                className="rounded-2xl shadow-2xl w-full h-auto object-cover"
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
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary to-blue-800 scroll-animate">
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

      {/* Language & Accessibility Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                  <Globe className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-dark dark:text-slate-100">
                  Multi-Language Support
                </h3>
              </div>
              <p className="text-gray-600 dark:text-slate-400 mb-6">
                Healthcare should be accessible to everyone, regardless of language. We offer:
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-slate-300">
                    Platform available in 12+ languages
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-slate-300">
                    Professional medical interpreters available
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-slate-300">
                    Translated medical documents and records
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-slate-300">
                    Culturally competent care providers
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-2xl font-bold text-dark dark:text-slate-100">
                  Accessibility Features
                </h3>
              </div>
              <p className="text-gray-600 dark:text-slate-400 mb-6">
                Our platform is designed to be accessible to all users:
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-slate-300">
                    WCAG 2.1 AA compliant design
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-slate-300">
                    Screen reader compatible
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-slate-300">
                    Keyboard navigation support
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-slate-300">
                    High contrast mode and adjustable text sizes
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Medical Disclaimer Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-amber-50 dark:bg-amber-900/10 border-y border-amber-200 dark:border-amber-900/30">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="w-14 h-14 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-7 h-7 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-dark dark:text-slate-100 mb-4">
                Important Medical Disclaimer
              </h3>
              <div className="space-y-3 text-gray-700 dark:text-slate-300">
                <p className="flex items-start gap-2">
                  <span className="text-amber-600 dark:text-amber-400 font-bold flex-shrink-0">•</span>
                  <span>
                    <strong>Emergency Services:</strong> This platform is NOT for medical emergencies. If you are experiencing a medical emergency, call 911 or go to your nearest emergency room immediately.
                  </span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-amber-600 dark:text-amber-400 font-bold flex-shrink-0">•</span>
                  <span>
                    <strong>Not a Substitute:</strong> This platform does not replace in-person medical care. Always consult with a licensed healthcare provider for medical advice, diagnosis, or treatment.
                  </span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-amber-600 dark:text-amber-400 font-bold flex-shrink-0">•</span>
                  <span>
                    <strong>Information Purpose:</strong> Content provided on this platform is for informational and educational purposes only and should not be considered medical advice.
                  </span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-amber-600 dark:text-amber-400 font-bold flex-shrink-0">•</span>
                  <span>
                    <strong>Professional Relationship:</strong> Use of this platform does not create a doctor-patient relationship until you have an actual consultation with a healthcare provider.
                  </span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-amber-600 dark:text-amber-400 font-bold flex-shrink-0">•</span>
                  <span>
                    <strong>Crisis Resources:</strong> If you're experiencing a mental health crisis, call the National Suicide Prevention Lifeline at 988 or text "HELLO" to 741741.
                  </span>
                </p>
              </div>
              <div className="mt-6 p-4 bg-white dark:bg-slate-800 rounded-xl border border-amber-200 dark:border-amber-900/30">
                <p className="text-sm text-gray-600 dark:text-slate-400">
                  <strong className="text-dark dark:text-slate-100">Patient Rights:</strong> You have the right to access your medical records, request corrections, and understand how your health information is used. For more information about your rights under HIPAA, please review our{" "}
                  <a href="#privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges / Certifications Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-dark dark:text-slate-100 mb-2">
              Trusted & Certified
            </h3>
            <p className="text-gray-600 dark:text-slate-400">
              Our platform meets the highest standards of security and compliance
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* HIPAA Compliance */}
            <div className="flex flex-col items-center text-center p-6 bg-gray-50 dark:bg-slate-700/30 rounded-xl hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
                <ShieldCheck className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h4 className="font-bold text-dark dark:text-slate-100 mb-2">
                HIPAA Compliant
              </h4>
              <p className="text-sm text-gray-600 dark:text-slate-400">
                Full compliance with healthcare data protection standards
              </p>
            </div>

            {/* ISO Certification */}
            <div className="flex flex-col items-center text-center p-6 bg-gray-50 dark:bg-slate-700/30 rounded-xl hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                <BadgeCheck className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h4 className="font-bold text-dark dark:text-slate-100 mb-2">
                ISO 27001
              </h4>
              <p className="text-sm text-gray-600 dark:text-slate-400">
                International standard for information security management
              </p>
            </div>

            {/* SSL Encryption */}
            <div className="flex flex-col items-center text-center p-6 bg-gray-50 dark:bg-slate-700/30 rounded-xl hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-4">
                <Lock className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h4 className="font-bold text-dark dark:text-slate-100 mb-2">
                256-bit SSL
              </h4>
              <p className="text-sm text-gray-600 dark:text-slate-400">
                Bank-level encryption for all data transmission
              </p>
            </div>

            {/* SOC 2 Certified */}
            <div className="flex flex-col items-center text-center p-6 bg-gray-50 dark:bg-slate-700/30 rounded-xl hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-orange-600 dark:text-orange-400" />
              </div>
              <h4 className="font-bold text-dark dark:text-slate-100 mb-2">
                SOC 2 Type II
              </h4>
              <p className="text-sm text-gray-600 dark:text-slate-400">
                Audited security, availability, and confidentiality controls
              </p>
            </div>
          </div>

          {/* Additional Trust Indicators */}
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-slate-700">
            <div className="flex flex-wrap justify-center items-center gap-8">
              <div className="flex items-center gap-2 text-gray-600 dark:text-slate-400">
                <Shield className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">99.9% Uptime SLA</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-slate-400">
                <AwardIcon className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">GDPR Compliant</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-slate-400">
                <CheckCircle className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">Regular Security Audits</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-slate-400">
                <Lock className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">Data Encryption at Rest</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-white">HealthCare</span>
              </div>
              <p className="text-slate-400 mb-4">
                Modern healthcare management platform for better health
                outcomes. Connecting patients with qualified healthcare professionals.
              </p>
              <div className="space-y-2">
                <p className="text-sm text-slate-400">
                  <strong className="text-slate-300">24/7 Support:</strong> +1 (234) 567-890
                </p>
                <p className="text-sm text-slate-400">
                  <strong className="text-slate-300">Email:</strong> support@healthcare.com
                </p>
              </div>
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
                <li>
                  <a
                    href="#pricing"
                    className="hover:text-white transition-colors">
                    Pricing
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
                  <Link
                    to="/blog"
                    className="hover:text-white transition-colors">
                    Blog
                  </Link>
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
              <h4 className="text-white font-semibold mb-4">Legal & Resources</h4>
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
                    href="#hipaa"
                    className="hover:text-white transition-colors">
                    HIPAA Compliance
                  </a>
                </li>
                <li>
                  <a
                    href="#accessibility"
                    className="hover:text-white transition-colors">
                    Accessibility
                  </a>
                </li>
                <li>
                  <a
                    href="#patient-rights"
                    className="hover:text-white transition-colors">
                    Patient Rights
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Emergency Resources */}
          <div className="border-t border-slate-800 pt-8 mb-8">
            <div className="bg-slate-800 rounded-xl p-6">
              <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                Emergency & Crisis Resources
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-slate-400 mb-1">Medical Emergency</p>
                  <p className="text-white font-semibold">Call 911</p>
                </div>
                <div>
                  <p className="text-slate-400 mb-1">Suicide Prevention Lifeline</p>
                  <p className="text-white font-semibold">Call or Text 988</p>
                </div>
                <div>
                  <p className="text-slate-400 mb-1">Crisis Text Line</p>
                  <p className="text-white font-semibold">Text HELLO to 741741</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-center md:text-left">
                <p className="text-slate-400 mb-2">
                  &copy; {new Date().getFullYear()} HealthCare Management System.
                  All rights reserved.
                </p>
                <p className="text-xs text-slate-500">
                  HIPAA Compliant • ISO 27001 Certified • SOC 2 Type II Audited
                </p>
              </div>
              <div className="flex items-center gap-4">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-slate-800 hover:bg-primary rounded-full flex items-center justify-center transition-colors"
                  aria-label="Facebook">
                  <Facebook className="w-5 h-5 text-slate-300" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-slate-800 hover:bg-primary rounded-full flex items-center justify-center transition-colors"
                  aria-label="Twitter">
                  <Twitter className="w-5 h-5 text-slate-300" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-slate-800 hover:bg-primary rounded-full flex items-center justify-center transition-colors"
                  aria-label="LinkedIn">
                  <Linkedin className="w-5 h-5 text-slate-300" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-slate-800 hover:bg-primary rounded-full flex items-center justify-center transition-colors"
                  aria-label="Instagram">
                  <Instagram className="w-5 h-5 text-slate-300" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 p-4 bg-primary hover:bg-blue-800 text-white rounded-full shadow-lg transition-all duration-300 hover:scale-110 animate-fade-in"
          aria-label="Scroll to top">
          <ChevronUp className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};

export default LandingPage;
