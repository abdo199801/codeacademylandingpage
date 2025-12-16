// src/app/page.tsx - Children's Programming Education Landing Page
'use client';

import { useState, useEffect, useRef, FormEvent, ChangeEvent } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import Head from 'next/head';
import { 
  Code, Laptop, Brain, Users, Clock, TrendingUp, Award,
  MessageCircle, ChevronDown, Sparkles, Send, ArrowRight, CheckCircle, Star,
  Phone, Mail, MapPin, Menu, X, Facebook, Linkedin, Instagram,
  Briefcase, Check, ShieldCheck, CalendarDays, GraduationCap,
  ActivitySquare, ClipboardCheck, Rocket, BookOpen, Puzzle,
  PhoneIncoming, ShieldAlert, ShieldPlus, Clock4, ArrowLeft,
  Cpu, Globe, Gamepad2, Palette, Music
} from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  phone: string;
  childAge: string;
  program: string;
  date: string;
  time: string;
  experience: string;
  message: string;
}

interface Program {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  ageGroup: string;
  duration: string;
  color: string;
  gradient: string;
  delay: number;
  image: string;
  seoTitle: string;
  price: string;
}

interface Instructor {
  name: string;
  specialty: string;
  experience: string;
  image: string;
  certifications: string[];
  availability: string;
  description: string;
  skills: string[];
  rating: number;
}

interface Testimonial {
  name: string;
  role: string;
  content: string;
  program: string;
  duration: string;
  avatar: string;
  rating: number;
  image: string;
  childAge: string;
}

interface Stat {
  value: string;
  label: string;
  icon: React.ReactNode;
  description: string;
}

export default function CodeKidsAcademy() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    childAge: '',
    program: '',
    date: '',
    time: '',
    experience: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [hoveredProgram, setHoveredProgram] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState('light');

  const heroRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();

  const headerScale = useTransform(scrollYProgress, [0, 0.1], [1, 0.95]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0.98]);

  // Initialize theme
  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  }, []);

  // Apply theme
  useEffect(() => {
    if (!mounted) return;
    
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    localStorage.setItem('theme', theme);
  }, [theme, mounted]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validation
    if (!formData.name || !formData.email || !formData.phone || !formData.program) {
      setSubmitStatus('error');
      setIsSubmitting(false);
      
      setTimeout(() => {
        setSubmitStatus(null);
      }, 5000);
      return;
    }
    
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          childAge: '',
          program: '',
          date: '',
          time: '',
          experience: '',
          message: ''
        });
        
        setTimeout(() => {
          if (formRef.current) {
            formRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 300);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      
      setTimeout(() => {
        setSubmitStatus(null);
      }, 8000);
    }
  };

  const openWhatsApp = () => {
    const message = `Bonjour Code Kids Academy,

Je souhaite inscrire mon enfant à votre programme de programmation.
Âge de l'enfant : ${formData.childAge}
Programme choisi : ${formData.program}
Expérience en programmation : ${formData.experience}

Pourriez-vous me recontacter pour plus d'informations ?
Cordialement,
${formData.name}
${formData.phone}`;
    window.open(`https://wa.me/212600000000?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleFreeTrial = () => {
    scrollToSection('contact');
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 14; hour < 20; hour++) {
      for (const minute of ['00', '30']) {
        slots.push(`${hour.toString().padStart(2, '0')}:${minute}`);
      }
    }
    return slots;
  };

  const programs: Program[] = [
    {
      icon: <Gamepad2 className="w-8 h-8" />,
      title: 'Initiation au Code',
      description: 'Introduction ludique à la programmation à travers la création de jeux simples.',
      features: ['Scratch & Blockly', 'Logique algorithmique', 'Création de jeux', 'Pensée computationnelle'],
      ageGroup: '6-9 ans',
      duration: '12 semaines',
      color: 'from-purple-500 to-pink-500',
      gradient: 'bg-gradient-to-br from-purple-50/50 to-white',
      delay: 0.1,
      image: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=1168&auto=format&fit=crop',
      seoTitle: 'Initiation à la Programmation pour Enfants',
      price: '1.200 DH/mois'
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: 'Développement Web Junior',
      description: 'Apprenez à créer des sites web interactifs avec HTML, CSS et JavaScript simplifié.',
      features: ['HTML/CSS basics', 'JavaScript junior', 'Sites web responsives', 'Projets créatifs'],
      ageGroup: '10-13 ans',
      duration: '16 semaines',
      color: 'from-blue-500 to-cyan-500',
      gradient: 'bg-gradient-to-br from-blue-50/50 to-white',
      delay: 0.2,
      image: 'https://images.unsplash.com/photo-1545235617-9465d2a55698?q=80&w=1160&auto=format&fit=crop',
      seoTitle: 'Développement Web pour Adolescents',
      price: '1.500 DH/mois'
    },
    {
      icon: <Cpu className="w-8 h-8" />,
      title: 'Python pour Débutants',
      description: 'Découverte de la programmation Python avec des projets concrets et amusants.',
      features: ['Python basics', 'Algorithmes simples', 'Projets pratiques', 'Résolution de problèmes'],
      ageGroup: '12-15 ans',
      duration: '20 semaines',
      color: 'from-green-500 to-emerald-500',
      gradient: 'bg-gradient-to-br from-green-50/50 to-white',
      delay: 0.3,
      image: 'https://images.unsplash.com/photo-1526379879527-8559ecfcaec6?q=80&w=1170&auto=format&fit=crop',
      seoTitle: 'Cours de Python pour Adolescents',
      price: '1.800 DH/mois'
    },
    {
      icon: <Rocket className="w-8 h-8" />,
      title: 'Roblox & Game Dev',
      description: 'Créez vos propres jeux Roblox et découvrez le développement de jeux vidéo.',
      features: ['Développement Roblox', 'Lua programming', 'Game design', 'Publication de jeux'],
      ageGroup: '10-14 ans',
      duration: '14 semaines',
      color: 'from-orange-500 to-red-500',
      gradient: 'bg-gradient-to-br from-orange-50/50 to-white',
      delay: 0.4,
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1170&auto=format&fit=crop',
      seoTitle: 'Développement de Jeux Roblox',
      price: '1.400 DH/mois'
    }
  ];

  const instructors: Instructor[] = [
    {
      name: 'Abdellah Baqba',
      specialty: 'Expert en Digitalisation & Éducation',
      experience: '5 ans en développement + éducation enfantine',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1167&auto=format&fit=crop',
      certifications: ['Bachelor Informatique', 'DTS Développement', 'Éducateur Petite Enfance'],
      availability: 'Lun-Sam, 14h-20h',
      description: 'Passionné par la digitalisation et l\'éducation, je combine expertise technique et pédagogique pour rendre la programmation accessible aux enfants.',
      skills: ['Next.js', 'Python', 'Web Scraping', 'Pédagogie'],
      rating: 4.9
    },
    {
      name: 'Sarah Tech',
      specialty: 'Spécialiste STEM pour Enfants',
      experience: '8 ans d\'expérience',
      image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?q=80&w=1167&auto=format&fit=crop',
      certifications: ['Master en Éducation', 'Certification Scratch', 'Pédagogie Montessori'],
      availability: 'Mar-Dim, 15h-19h',
      description: 'Spécialisée dans l\'enseignement des sciences et technologies aux enfants avec une approche ludique et interactive.',
      skills: ['STEM Education', 'Scratch', 'Robotique', 'Pédagogie Active'],
      rating: 4.8
    },
    {
      name: 'Karim Dev',
      specialty: 'Développeur Full-Stack',
      experience: '6 ans d\'expérience',
      image: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=1170&auto=format&fit=crop',
      certifications: ['Ingénieur Informatique', 'Certification AWS', 'Web Development'],
      availability: 'Lun-Ven, 16h-20h',
      description: 'Expert en développement web qui adore partager sa passion pour le code avec la nouvelle génération.',
      skills: ['JavaScript', 'React', 'Node.js', 'Cloud Computing'],
      rating: 4.9
    }
  ];

  const testimonials: Testimonial[] = [
    {
      name: 'Fatima Zahra',
      role: 'Mère de Youssef, 9 ans',
      content: 'Mon fils adore les cours ! Il a créé son premier jeu vidéo après seulement 4 semaines. L\'approche pédagogique est parfaite pour les enfants.',
      program: 'Initiation au Code',
      duration: 'Élève depuis 6 mois',
      avatar: 'FZ',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1168&auto=format&fit=crop',
      childAge: '9 ans'
    },
    {
      name: 'Mehdi Laraki',
      role: 'Père de Amina, 12 ans',
      content: 'Excellent programme ! Ma fille a développé un site web pour son club de lecture. Les instructeurs sont patients et très compétents.',
      program: 'Développement Web Junior',
      duration: 'Élève depuis 8 mois',
      avatar: 'ML',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1167&auto=format&fit=crop',
      childAge: '12 ans'
    },
    {
      name: 'Leila Mansouri',
      role: 'Mère de Omar, 14 ans',
      content: 'Mon adolescent a découvert une vraie passion pour la programmation Python. Il parle maintenant de devenir développeur !',
      program: 'Python pour Débutants',
      duration: 'Élève depuis 3 mois',
      avatar: 'LM',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1494790108755-2616b786d4d9?q=80&w=1167&auto=format&fit=crop',
      childAge: '14 ans'
    }
  ];

  const stats: Stat[] = [
    { value: '500+', label: 'Élèves Formés', icon: <Users className="w-5 h-5" />, description: 'Depuis notre création' },
    { value: '98%', label: 'Satisfaction', icon: <Star className="w-5 h-5" />, description: 'Des parents satisfaits' },
    { value: '30+', label: 'Projets Réalisés', icon: <Code className="w-5 h-5" />, description: 'Par élève en moyenne' },
    { value: '1:6', label: 'Ratio Élève/Coach', icon: <Users className="w-5 h-5" />, description: 'Attention personnalisée' },
    { value: '95%', label: 'Réussite', icon: <GraduationCap className="w-5 h-5" />, description: 'Aux certifications' },
    { value: '4.9/5', label: 'Note Moyenne', icon: <Award className="w-5 h-5" />, description: 'Sur Google Reviews' }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 antialiased overflow-x-hidden transition-colors duration-300">
      
      <Head>
        <title>Code Kids Academy | Programme de Programmation pour Enfants à Casablanca</title>
        <meta name="description" content="Code Kids Academy à Casablanca : apprenez la programmation aux enfants dès 6 ans. Cours de coding, développement web, Python, jeux vidéo avec des experts pédagogiques." />
        <meta name="keywords" content="programmation enfants, cours coding Casablanca, développement web junior, Python pour enfants, école programmation, coding kids" />
        <meta name="author" content="Code Kids Academy - Abdellah Baqba" />
        
        <meta property="og:title" content="Code Kids Academy | Programme de Programmation pour Enfants" />
        <meta property="og:description" content="École de programmation pour enfants à Casablanca : cours adaptés par âge, instructeurs experts, approche ludique et pédagogique." />
        <meta property="og:type" content="website" />
      </Head>

      {/* Promo Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 px-4 text-center">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-center gap-2">
          <div className="flex items-center">
            <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
            <span className="font-semibold">OFFRE SPÉCIALE :</span>
          </div>
          <span className="font-bold text-lg">Premier cours d'essai GRATUIT !</span>
          <span className="hidden sm:inline mx-2">•</span>
          <span>Inscription ouverte pour la rentrée</span>
        </div>
      </div>

      {/* Header */}
      <motion.header 
        style={{ scale: headerScale, opacity: headerOpacity }}
        className={`fixed w-full z-50 transition-all duration-300 backdrop-blur-lg ${
          isScrolled 
            ? 'bg-white/90 dark:bg-gray-900/90 shadow-lg py-3' 
            : 'bg-white/80 dark:bg-gray-900/80 py-4'
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mr-3 shadow-lg">
                <Code className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-xl font-bold text-gray-900 dark:text-white">Code Kids</div>
                <div className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                  ACADEMY
                </div>
              </div>
            </div>

            <nav className="hidden lg:flex items-center space-x-8">
              {['accueil', 'programmes', 'instructeurs', 'temoignages', 'contact'].map((item) => (
                <motion.button
                  key={item}
                  onClick={() => scrollToSection(item)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors font-medium"
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </motion.button>
              ))}
              
              <motion.button
                onClick={handleFreeTrial}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:shadow-lg transition-all font-semibold"
              >
                ESSAI GRATUIT
              </motion.button>

              <motion.button
                onClick={() => scrollToSection('contact')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all font-semibold"
              >
                Inscrire mon enfant
              </motion.button>
            </nav>

            <div className="flex items-center gap-4 lg:hidden">
              <motion.button
                onClick={handleFreeTrial}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg text-sm font-semibold"
              >
                ESSAI GRATUIT
              </motion.button>
              
              <motion.button
                className="p-2"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                whileTap={{ scale: 0.95 }}
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
            <motion.div 
              className="absolute right-0 top-0 h-full w-64 bg-white dark:bg-gray-900 shadow-xl"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
            >
              <div className="flex flex-col h-full pt-20 px-6 space-y-6">
                {['accueil', 'programmes', 'instructeurs', 'temoignages', 'contact'].map((item) => (
                  <motion.button
                    key={item}
                    onClick={() => {
                      scrollToSection(item);
                      setIsMobileMenuOpen(false);
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="text-lg text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors py-3 text-left"
                  >
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </motion.button>
                ))}
                
                <motion.button
                  onClick={handleFreeTrial}
                  whileTap={{ scale: 0.95 }}
                  className="mt-4 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:shadow-lg transition-all font-semibold"
                >
                  ESSAI GRATUIT
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section id="accueil" ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-purple-900/20">
        <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-900/20" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-sm font-medium mb-6">
                <Award className="w-4 h-4 mr-2" />
                École Agréée par le Ministère
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                Votre enfant,
                <span className="block bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                  futur développeur
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                Programme de programmation pour enfants à Casablanca. Nous enseignons le code de manière ludique 
                et pédagogique pour développer la créativité et la pensée logique dès le plus jeune âge.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  onClick={() => scrollToSection('contact')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-xl transition-all font-semibold text-lg flex items-center justify-center group"
                >
                  <span>Inscrire mon enfant</span>
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
                
                <motion.button
                  onClick={handleFreeTrial}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 border-2 border-purple-600 dark:border-purple-500 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all font-semibold text-lg flex items-center justify-center"
                >
                  <BookOpen className="w-5 h-5 mr-2" />
                  Essai Gratuit
                </motion.button>
              </div>
              
              <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Dès 6 ans</span>
                </div>
                <div className="flex items-center">
                  <Code className="w-5 h-5 text-blue-500 mr-2" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Projets concrets</span>
                </div>
                <div className="flex items-center">
                  <Users className="w-5 h-5 text-pink-500 mr-2" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Petits groupes</span>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                <div 
                  className="absolute inset-0 bg-cover bg-center transform hover:scale-105 transition-transform duration-700"
                  style={{
                    backgroundImage: 'url("https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")'
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </div>
              
              <motion.div 
                className="absolute -bottom-6 -left-6 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl max-w-sm"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center mr-4">
                    <CalendarDays className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white">Cours d'essai gratuit</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Sans engagement</div>
                  </div>
                </div>
                <div className="text-gray-700 dark:text-gray-300 text-sm">
                  • Découverte gratuite<br />
                  • Matériel fourni<br />
                  • Instructeurs experts
                </div>
              </motion.div>
              
              <motion.div 
                className="absolute -top-6 -right-6 bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-xl"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-400 flex items-center justify-center mr-3">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white">Certifié</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Ministère</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="text-center bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 mb-4 mx-auto">
                  <div className="text-white">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{stat.value}</div>
                <div className="font-semibold text-gray-700 dark:text-gray-300">{stat.label}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{stat.description}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section id="programmes" className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-sm font-medium mb-4">
              Nos Programmes
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Programmes adaptés par âge
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Des cours de programmation spécialement conçus pour chaque tranche d'âge
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {programs.map((program, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                onHoverStart={() => setHoveredProgram(idx)}
                onHoverEnd={() => setHoveredProgram(null)}
                className={`relative group bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-800 ${
                  hoveredProgram === idx ? 'ring-2 ring-purple-500/20' : ''
                }`}
              >
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${program.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                
                <div className={`relative w-14 h-14 rounded-xl bg-gradient-to-br ${program.color} flex items-center justify-center mb-6 shadow-lg`}>
                  <div className="text-white">
                    {program.icon}
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-3">
                  <div className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-xs font-medium text-gray-600 dark:text-gray-400">
                    {program.ageGroup}
                  </div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {program.price}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  {program.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                  {program.description}
                </p>
                
                <ul className="space-y-2 mb-6">
                  {program.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-center text-gray-700 dark:text-gray-300 text-sm">
                      <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Durée: {program.duration}
                  </div>
                  <motion.button
                    whileHover={{ x: 5 }}
                    className="inline-flex items-center text-purple-600 dark:text-purple-400 font-medium text-sm group"
                    onClick={() => scrollToSection('contact')}
                  >
                    S'inscrire
                    <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Instructors Section */}
      <section id="instructeurs" className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-sm font-medium mb-4">
              Notre Équipe
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Des instructeurs experts
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Des professionnels passionnés par la technologie et l'éducation
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {instructors.map((instructor, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <div className="relative h-64 overflow-hidden">
                  <div 
                    className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-700"
                    style={{ backgroundImage: `url('${instructor.image}')` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  <div className="absolute top-4 right-4">
                    <div className="flex items-center px-2 py-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full">
                      <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{instructor.rating}</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {instructor.name}
                  </h3>
                  <p className="text-purple-600 dark:text-purple-400 font-medium mb-3">{instructor.specialty}</p>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{instructor.description}</p>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                      <Briefcase className="w-4 h-4 mr-2" />
                      <span>{instructor.experience}</span>
                    </div>
                    <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>{instructor.availability}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {instructor.skills.map((skill, skillIdx) => (
                        <span key={skillIdx} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => scrollToSection('contact')}
                    className="w-full py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all font-medium text-sm"
                  >
                    Réserver un cours d'essai
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="temoignages" className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-sm font-medium mb-4">
              Témoignages
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Ce que disent les parents
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Découvrez les expériences des familles qui nous font confiance
            </p>
          </motion.div>

          <div className="max-w-6xl mx-auto">
            <div className="relative">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-gradient-to-br from-purple-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-3xl p-8 md:p-12 shadow-xl"
              >
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <div className="w-12 h-12 text-purple-500/20 mb-6">
                      <svg fill="currentColor" viewBox="0 0 24 24">
                        <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z"/>
                      </svg>
                    </div>
                    <p className="text-xl text-gray-700 dark:text-gray-300 italic mb-8 leading-relaxed">
                      &quot;{testimonials[activeTestimonial].content}&quot;
                    </p>
                    
                    <div className="flex items-center">
                      <div className="w-16 h-16 rounded-full overflow-hidden mr-4 border-2 border-purple-500/20">
                        <div 
                          className="w-full h-full bg-cover bg-center"
                          style={{ backgroundImage: `url('${testimonials[activeTestimonial].image}')` }}
                        />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                          {testimonials[activeTestimonial].name}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">{testimonials[activeTestimonial].role}</p>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          Enfant: {testimonials[activeTestimonial].childAge}
                        </div>
                        <div className="flex items-center mt-1">
                          {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white">
                    <div className="mb-4">
                      <div className="text-sm opacity-80">Programme suivi</div>
                      <div className="font-bold text-lg">{testimonials[activeTestimonial].program}</div>
                    </div>
                    <div className="mb-4">
                      <div className="text-sm opacity-80">Durée</div>
                      <div className="font-bold text-lg">{testimonials[activeTestimonial].duration}</div>
                    </div>
                    <div className="mb-4">
                      <div className="text-sm opacity-80">Âge de l'enfant</div>
                      <div className="font-bold text-lg">{testimonials[activeTestimonial].childAge}</div>
                    </div>
                    <div className="flex items-center justify-center mt-8">
                      <div className="text-center">
                        <div className="text-4xl font-bold mb-2">98%</div>
                        <div className="text-sm opacity-80">Taux de satisfaction</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <div className="flex justify-center mt-8 space-x-4">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveTestimonial(idx)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      idx === activeTestimonial 
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 w-8' 
                        : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                    }`}
                  />
                ))}
              </div>
              
              <button
                onClick={() => setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
              >
                <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </button>
              
              <button
                onClick={() => setActiveTestimonial((prev) => (prev + 1) % testimonials.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
              >
                <ArrowRight className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" ref={formRef} className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid lg:grid-cols-2 gap-12 items-start"
          >
            <div>
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-sm font-medium mb-4">
                Inscription
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Inscrivez votre enfant
              </h2>
              
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                Remplissez ce formulaire pour réserver un cours d'essai gratuit 
                ou inscrire votre enfant à nos programmes.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mr-4">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">Téléphone</h3>
                    <a href="tel:212600000000" className="text-lg text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                      212 600 000 000
                    </a>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Lun-Sam, 9h-18h</p>
                  </div>
                </div>
                
                <div className="flex items-start p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mr-4">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">Email</h3>
                    <a href="mailto:contact@codekidsacademy.ma" className="text-lg text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                      contact@codekidsacademy.ma
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mr-4">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">Adresse</h3>
                    <p className="text-lg text-gray-600 dark:text-gray-400">Casablanca, Maroc</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Centre ville, accès facile</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-12 p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <CalendarDays className="w-5 h-5 mr-2" />
                  Horaires des cours
                </h3>
                <div className="space-y-3">
                  {[
                    { day: 'Mercredi après-midi', hours: '14h - 18h' },
                    { day: 'Samedi matin', hours: '9h - 12h' },
                    { day: 'Samedi après-midi', hours: '14h - 18h' },
                    { day: 'Vacances scolaires', hours: 'Stage intensif' }
                  ].map((schedule, idx) => (
                    <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700 last:border-0">
                      <span className="text-gray-600 dark:text-gray-400">{schedule.day}</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{schedule.hours}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 shadow-xl"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nom complet *
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="Votre nom"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Téléphone *
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="212 XX XX XX XX"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email *
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="votre@email.com"
                    required
                  />
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="childAge" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Âge de l'enfant *
                    </label>
                    <select
                      id="childAge"
                      value={formData.childAge}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      required
                    >
                      <option value="">Sélectionnez</option>
                      <option value="6-8">6-8 ans</option>
                      <option value="9-11">9-11 ans</option>
                      <option value="12-14">12-14 ans</option>
                      <option value="15+">15 ans et plus</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="program" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Programme souhaité *
                    </label>
                    <select
                      id="program"
                      value={formData.program}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      required
                    >
                      <option value="">Sélectionnez</option>
                      <option value="initiation">Initiation au Code (6-9 ans)</option>
                      <option value="web">Développement Web Junior (10-13 ans)</option>
                      <option value="python">Python pour Débutants (12-15 ans)</option>
                      <option value="roblox">Roblox & Game Dev (10-14 ans)</option>
                      <option value="cours-essai">Cours d'essai gratuit seulement</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Date souhaitée pour l'essai
                    </label>
                    <input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="time" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Horaire souhaité
                    </label>
                    <select
                      id="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    >
                      <option value="">Sélectionnez</option>
                      {generateTimeSlots().map((slot) => (
                        <option key={slot} value={slot}>{slot}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="experience" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Expérience en programmation de l'enfant
                  </label>
                  <textarea
                    id="experience"
                    rows={3}
                    value={formData.experience}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                    placeholder="L'enfant a-t-il déjà fait de la programmation ? Quel est son niveau ?"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Message additionnel
                  </label>
                  <textarea
                    id="message"
                    rows={3}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                    placeholder="Questions ou informations complémentaires..."
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
                      required
                    />
                    <label className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                      J'accepte les conditions d'utilisation
                    </label>
                  </div>
                  
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Envoi en cours...
                      </span>
                    ) : (
                      'Envoyer la demande'
                    )}
                  </motion.button>
                </div>
              </form>
              
              {submitStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border border-green-200 dark:border-green-800 rounded-lg"
                >
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
                    <div>
                      <span className="font-semibold text-green-800 dark:text-green-300">Demande envoyée avec succès !</span>
                      <p className="text-green-700 dark:text-green-400 text-sm mt-1">
                        Nous vous contacterons dans les plus brefs délais pour confirmer le cours d'essai.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
              
              {submitStatus === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/30 dark:to-orange-900/30 border border-red-200 dark:border-red-800 rounded-lg"
                >
                  <div className="flex items-center">
                    <X className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
                    <div>
                      <span className="font-semibold text-red-800 dark:text-red-300">Une erreur est survenue</span>
                      <p className="text-red-700 dark:text-red-400 text-sm mt-1">
                        Veuillez réessayer ou nous contacter par téléphone.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  Vous pouvez également nous contacter par WhatsApp
                </p>
                <motion.button
                  onClick={openWhatsApp}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full mt-3 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:shadow-lg transition-all font-semibold flex items-center justify-center"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Envoyer un message WhatsApp
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-white pt-16 pb-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mr-3">
                  <Code className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-xl font-bold">Code Kids</div>
                  <div className="text-lg font-semibold text-pink-400">ACADEMY</div>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                École de programmation pour enfants à Casablanca. Nous enseignons le code de manière ludique 
                et pédagogique pour développer la créativité et la pensée logique dès le plus jeune âge.
              </p>
              <div className="flex space-x-4 mt-6">
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-purple-600 transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-pink-600 transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-700 transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-6">Programmes</h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-pink-400 transition-colors">Initiation au Code (6-9 ans)</a></li>
                <li><a href="#" className="hover:text-pink-400 transition-colors">Développement Web Junior</a></li>
                <li><a href="#" className="hover:text-pink-400 transition-colors">Python pour Débutants</a></li>
                <li><a href="#" className="hover:text-pink-400 transition-colors">Roblox & Game Dev</a></li>
                <li><a href="#" className="hover:text-pink-400 transition-colors">Stages Vacances</a></li>
                <li><a href="#" className="hover:text-pink-400 transition-colors">Cours Particuliers</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-6">Contact</h3>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-start">
                  <Phone className="w-5 h-5 mr-3 mt-1 text-pink-400" />
                  <div>
                    <div>212 600 000 000</div>
                    <div className="text-sm text-gray-500">Lun-Sam, 9h-18h</div>
                  </div>
                </li>
                <li className="flex items-start">
                  <Mail className="w-5 h-5 mr-3 mt-1 text-pink-400" />
                  <div>contact@codekidsacademy.ma</div>
                </li>
                <li className="flex items-start">
                  <MapPin className="w-5 h-5 mr-3 mt-1 text-pink-400" />
                  <div>Casablanca, Maroc</div>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-6">Horaires des cours</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="flex justify-between">
                  <span>Mercredi</span>
                  <span className="font-semibold text-white">14h - 18h</span>
                </li>
                <li className="flex justify-between">
                  <span>Samedi matin</span>
                  <span className="font-semibold text-white">9h - 12h</span>
                </li>
                <li className="flex justify-between">
                  <span>Samedi après-midi</span>
                  <span className="font-semibold text-white">14h - 18h</span>
                </li>
                <li className="flex justify-between mt-4 pt-4 border-t border-gray-800">
                  <span className="text-green-300">Cours d'essai</span>
                  <span className="font-bold text-green-300">GRATUIT</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-800">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-500 text-sm mb-4 md:mb-0">
                &copy; {new Date().getFullYear()} Code Kids Academy. Tous droits réservés.
              </p>
              <div className="flex space-x-6 text-sm text-gray-500">
                <a href="#" className="hover:text-pink-400 transition-colors">Mentions légales</a>
                <a href="#" className="hover:text-pink-400 transition-colors">Politique de confidentialité</a>
                <a href="#" className="hover:text-pink-400 transition-colors">Conditions d&apos;utilisation</a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Action Buttons */}
      <motion.button
        onClick={handleFreeTrial}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 shadow-2xl flex items-center justify-center hover:shadow-3xl transition-all group"
      >
        <BookOpen className="w-7 h-7 text-white" />
        <span className="absolute -top-12 right-0 bg-green-600 text-white px-3 py-1 rounded-lg text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          ESSAI GRATUIT
        </span>
      </motion.button>

      <AnimatePresence>
        {isScrolled && (
          <motion.button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="fixed bottom-6 left-6 z-50 w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg flex items-center justify-center hover:shadow-xl transition-all"
          >
            <ChevronDown className="w-5 h-5 text-white rotate-180" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* WhatsApp Button */}
      <motion.button
        onClick={openWhatsApp}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-28 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 shadow-2xl flex items-center justify-center hover:shadow-3xl transition-all"
      >
        <MessageCircle className="w-7 h-7 text-white" />
      </motion.button>
    </div>
  );
}