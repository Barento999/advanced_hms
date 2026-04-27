import { useContext, useEffect } from "react";
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
} from "lucide-react";
import { AuthContext } from "../context/AuthContext";

const LandingPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
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

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
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
