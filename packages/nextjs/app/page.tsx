"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
//import { ArrowRight, Mail, MapPin, Phone, Linkedin, Instagram, Youtube, TrendingUp, Users, Target } from "lucide-react"
//import { Button } from "@/components/ui/button"
import { motion, useAnimation, useInView } from "framer-motion";
import GyralisLogo from "~~/components/assets/GyralisLogo.svg";
//import { useMobile } from "@/hooks/use-mobile"
import { ParticleBackground } from "~~/components/landing-page";
import { InfoSlider } from "~~/components/landing-page";

export default function Home() {
  //const isMobile = useMobile()
  const controls = useAnimation();
  const aboutRef = useRef(null);
  const divisionsRef = useRef(null);
  const expertiseRef = useRef(null);
  const whyUsRef = useRef(null);
  const contactRef = useRef(null);
  const performanceRef = useRef(null);

  const aboutInView = useInView(aboutRef, { once: true, amount: 0.3 });
  const divisionsInView = useInView(divisionsRef, { once: true, amount: 0.1 });
  const expertiseInView = useInView(expertiseRef, { once: true, amount: 0.3 });
  const whyUsInView = useInView(whyUsRef, { once: true, amount: 0.3 });
  const contactInView = useInView(contactRef, { once: true, amount: 0.3 });
  const performanceInView = useInView(performanceRef, { once: true, amount: 0.3 });

  useEffect(() => {
    if (aboutInView) {
      controls.start("visible");
    }
  }, [aboutInView, controls]);

  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.6 },
    },
  };

  const scaleUp = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  const slideInLeft = {
    hidden: { x: -100, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const slideInRight = {
    hidden: { x: 100, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#121212] text-white overflow-hidden">
      {/* Navigation */}
      <motion.header
        className="border-b border-gray-800 sticky top-0 z-50 backdrop-blur-md bg-[#121212]/80"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="container mx-auto px-4 md:px-6 py-4">
          <div className="flex justify-between items-center">
            <motion.div
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-300 flex items-center justify-center text-white font-bold relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-[#3182C8] to-blue-[#DDE7F0] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Image src={GyralisLogo} alt="Gyralis Logo" width={30} height={30} />
                {/* <svg viewBox="0 0 24 24" className="w-6 h-6 relative z-10">
                  <path d="M12,3 L19,7 L19,17 L12,21 L5,17 L5,7 Z" fill="rgba(255, 255, 255, 0.8)" />
                  <circle cx="12" cy="12" r="2" fill="rgba(255, 255, 255, 1)" />
                </svg> */}
              </div>
              <span className="text-2xl font-bold text-blue-500">Gyralis</span>
            </motion.div>
            <nav className="hidden md:flex space-x-8">
              {["What is Gylaris", "Loops Features", "How it Works", "Roadmap", "Contact"].map((item, i) => (
                <motion.a
                  key={i}
                  href={`#${item.toLowerCase().replace(" ", "-")}`}
                  className="text-gray-300 hover:text-blue-500 transition-colors relative"
                  whileHover={{ scale: 1.1 }}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * i }}
                >
                  {item}
                  <motion.span
                    className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500"
                    initial={{ width: 0 }}
                    whileHover={{ width: "100%" }}
                    transition={{ duration: 0.2 }}
                  />
                </motion.a>
              ))}
            </nav>
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href={"/prototype/1hive"}
                className="btn border-none text-black bg-[#3182C8]  relative overflow-hidden group"
              >
                Go to Prototype
              </Link>
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden min-h-[90vh] flex items-center">
        <ParticleBackground />
        <div className="absolute inset-0 bg-gradient-radial from-gray-800/50 to-transparent opacity-30"></div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <motion.h1
                className=" tracking-tight sm:text-6xl md:text-7xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <motion.span
                  className="text-blue-500 inline-block sm:text-6xl md:text-7xl"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                >
                  Claim Tokens,
                </motion.span>{" "}
                Every Day
              </motion.h1>
              <motion.p
                className="text-xl md:text-2xl text-gray-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.9 }}
              >
                A new, fair and transparent future of Web3 tokens distribution starts here.
              </motion.p>
              <motion.div
                className="flex flex-col sm:flex-row gap-4 pt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.1 }}
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <span className="relative z-10">Scroll down</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-400 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110"></span>
                </motion.div>
              </motion.div>
            </motion.div>
            <motion.div
              className="flex justify-center skew-y-12"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ rotate: 360, opacity: 1, scale: 1 }}
              transition={{
                opacity: { duration: 0.8, delay: 0.5 },
                scale: { duration: 0.8, delay: 0.5, type: "spring" },
                repeat: 1,

                duration: 200,
              }}
            >
              <Image src={GyralisLogo} alt="Gyralis Logo" width={400} height={400} />
            </motion.div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#121212] to-transparent"></div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-gray-900" id="about" ref={aboutRef}>
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            className="flex flex-col items-center text-center max-w-3xl mx-auto"
            variants={fadeInUp}
            initial="hidden"
            animate={aboutInView ? "visible" : "hidden"}
          >
            <motion.h2 className="text-3xl font-bold tracking-tight mb-4" variants={fadeIn}>
              What is Gyralis
            </motion.h2>
            <motion.p className="text-gray-300 text-lg mb-6 leading-relaxed" variants={fadeIn}>
              Gyralis is an innovative and modular platform designed to transform token distribution into a fair,
              engaging, and community-driven experience
            </motion.p>
            <motion.p className="text-gray-300 text-lg mb-8 leading-relaxed" variants={fadeIn}>
              We introduce a dynamic system where daily participation directly translates to rewards. Know from now on
              as Loops
            </motion.p>
            <motion.p className="text-gray-300 text-lg mb-8 leading-relaxed" variants={fadeIn}>
              Loops: Dynamic Engines for distributing tokens. Modular, customizable contracts that organizations can
              design to distribute tokens with 4 main settings: Period lenght, distribution per period, sybil
              verification and elegibility criteria. Lear More
            </motion.p>
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-8 w-full mt-8"
              variants={staggerContainer}
              initial="hidden"
              animate={aboutInView ? "visible" : "hidden"}
            ></motion.div>
          </motion.div>
        </div>
      </section>

      {/* Loop Features Section */}
      <section className="py-16 bg-[#121212]" id="divisions" ref={divisionsRef}>
        <div className="container mx-auto px-4 md:px-6">
          <motion.h2
            className="text-3xl font-bold tracking-tight text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={divisionsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="inline-block text-amber-500"
              animate={{
                rotate: [0, 10, 0, -10, 0],
              }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 5 }}
            >
              <svg viewBox="0 0 24 24" className="inline-block h-8 w-8">
                <motion.path
                  d="M4 4h6v6H4V4z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, repeatDelay: 5 }}
                />
                <motion.path
                  d="M14 4h6v6h-6V4z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: 0.3, repeat: Number.POSITIVE_INFINITY, repeatDelay: 5 }}
                />
                <motion.path
                  d="M4 14h6v6H4v-6z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: 0.6, repeat: Number.POSITIVE_INFINITY, repeatDelay: 5 }}
                />
                <motion.path
                  d="M14 14h6v6h-6v-6z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: 0.9, repeat: Number.POSITIVE_INFINITY, repeatDelay: 5 }}
                />
              </svg>
            </motion.div>{" "}
            Loop Features
          </motion.h2>
          <motion.div
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
            variants={staggerContainer}
            initial="hidden"
            animate={divisionsInView ? "visible" : "hidden"}
          >
            {[
              {
                icon: "tech",
                title: "Loop shield",
                description: "Ensuring Verified Participation.",
                content:
                  "A technology hub that builds real-world digital solutions, including mobile apps, smart tools, and next-gen platforms. We believe in solving problems through functionality, simplicity, and speed.",
                services: [
                  "Web & Mobile App Development",
                  "Software Engineering & Tool Creation",
                  "Platform Design",
                  "UI/UX Strategy",
                ],
              },
              {
                icon: "audio",
                title: "Maintaining Eligibility:",
                description: "Encouraging Active Participation.",
                content:
                  "A music production and sound design studio producing high-quality house, soulful, and Afro-inspired music. Perfect for DJs, vocalists, producers, and creatives.",
                services: [
                  "Music Production & Remixes",
                  "Professional Mixing & Mastering",
                  "Vocal Processing & Audio Engineering",
                  "Sound Branding",
                ],
              },
              {
                icon: "publishing",
                title: "Daily Claims",
                description: "Rewarding Consistent Engagement.",
                content:
                  "Combining traditional publishing with modern music and content marketing strategies to amplify African voices, authors, and artists.",
                services: [
                  "Book Publishing & eBook Development",
                  "Artist Branding & Digital Marketing",
                  "Social Media Content Strategy",
                  "Content Writing & Distribution Support",
                ],
              },
              {
                icon: "forex",
                title: "Trading101 FX",
                description: "Trade Smarter, Live Freer",
                content:
                  "Our forex and crypto arm focuses on high-precision trading tools, mentorship, and automated systems for consistent performance in volatile markets.",
                services: [
                  "Forex & Crypto Strategy (Smart Money Concepts)",
                  "Expert Advisor (EA) Development for MT4/MT5",
                  "Market Mentorship & Analysis",
                  "Trading Content & Education",
                ],
              },
              {
                icon: "capital",
                title: "Trading101 Capital",
                description: "Build Wealth. Think Long-Term.",
                content:
                  "Focused on strategic investments in property and equities, Trading101 Capital supports individuals and entities looking to grow wealth sustainably.",
                services: [
                  "Share & Property Investment",
                  "Portfolio Strategy & Management",
                  "Investment Research & Reports",
                  "Passive Income Guidance",
                ],
              },
              {
                icon: "consulting",
                title: "VisionSpark Consulting",
                description: "Ignite Your Business Potential",
                content:
                  "VisionSpark is our premium business consulting agency helping startups, creatives, and enterprises grow through strategic thinking, data-backed insights, and future-focused development.",
                services: [
                  "Business & Brand Strategy",
                  "Market Research & Competitor Analysis",
                  "Process Optimization",
                  "Startup Support & Business Growth Planning",
                ],
              },
            ].map((division, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                custom={index}
                whileHover={{ y: -10, transition: { duration: 0.2 } }}
              >
                <div className="bg-gray-900 card border-2 border-gray-800 hover:border-amber-500 transition-colors h-full overflow-hidden group p-2">
                  <div className="relative border1 px-4">
                    <div className="absolute top-0 right-0 h-12 w-12 bg-gradient-to-bl from-[#F6E6A5] to-[#98B2CC] rounded-bl-full opacity-10 border1"></div>
                    <h4 className="text-xl text-[#F7DC6F] mb-1">{division.title}</h4>
                    <p className="text-gray-400 text-sm">{division.description}</p>
                  </div>
                  <div className="card-body p-4">
                    <p className="text-sm text-gray-300 mb-4">{division.content}</p>
                    <ul className="text-sm space-y-2 text-gray-300">
                      {division.services.map((service, i) => (
                        <motion.li
                          key={i}
                          className="flex items-center"
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * i, duration: 0.3 }}
                          viewport={{ once: true }}
                        >
                          <motion.span
                            className="h-1.5 w-1.5 rounded-full bg-amber-500 mr-2"
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            transition={{ delay: 0.1 * i + 0.2, duration: 0.3 }}
                            viewport={{ once: true }}
                          ></motion.span>
                          {service}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Performance Section */}
      {/* <section className="py-16 bg-gray-900" id="performance" ref={performanceRef}>
        <div className="container mx-auto px-4 md:px-6">
          <motion.h2
            className="text-3xl font-bold tracking-tight text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={performanceInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            <motion.span
              className="text-blue-500 inline-block"
              animate={{
                rotate: [0, 10, 0, -10, 0],
              }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 5 }}
            >
              📊
            </motion.span>{" "}
            Future Projections
          </motion.h2>

          <motion.div
            className="grid gap-8 md:grid-cols-2 mb-12"
            variants={staggerContainer}
            initial="hidden"
            animate={performanceInView ? "visible" : "hidden"}
          >
            <motion.div variants={fadeInUp}>
              <PerformanceChart
                title="Revenue Projections (ZAR)"
                type="bar"
                currency={true}
                data={[
                  { label: "2024", value: 2500000, color: "rgba(0, 101, 189, 0.8)" },
                  { label: "2025", value: 5800000, color: "rgba(0, 101, 189, 0.8)" },
                  { label: "2026", value: 9500000, color: "rgba(0, 101, 189, 0.8)" },
                  { label: "2027", value: 15000000, color: "rgba(0, 101, 189, 0.7)" },
                  { label: "2028", value: 22000000, color: "rgba(0, 101, 189, 0.6)" },
                ]}
              />
            </motion.div>

            <motion.div variants={fadeInUp}>
              <PerformanceChart
                title="Projected Division Growth"
                type="pie"
                data={[
                  { label: "Khoding Technologies", value: 35, color: "rgba(0, 101, 189, 0.9)" },
                  { label: "Trading101 FX", value: 25, color: "rgba(0, 101, 189, 0.7)" },
                  { label: "Audiolab", value: 15, color: "rgba(0, 101, 189, 0.5)" },
                  { label: "Trading101 Capital", value: 12, color: "rgba(0, 101, 189, 0.4)" },
                  { label: "VisionSpark", value: 8, color: "rgba(0, 101, 189, 0.3)" },
                  { label: "Afrimu Publishing", value: 5, color: "rgba(0, 101, 189, 0.2)" },
                ]}
              />
            </motion.div>
          </motion.div>

          <motion.div
            className="grid gap-8 md:grid-cols-3"
            variants={staggerContainer}
            initial="hidden"
            animate={performanceInView ? "visible" : "hidden"}
          >
            {[
              {
                icon: <TrendingUp className="h-8 w-8 text-blue-500" />,
                title: "Projected Growth",
                value: "45%",
                description: "Annual growth target across all divisions",
              },
              {
                icon: <Users className="h-8 w-8 text-blue-500" />,
                title: "Target Client Base",
                value: "200+",
                description: "Clients across South Africa by end of 2025",
              },
              {
                icon: <Target className="h-8 w-8 text-blue-500" />,
                title: "5-Year Target",
                value: "R22M",
                description: "Projected annual revenue by 2028",
              },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-amber-500/50 transition-all"
                variants={fadeInUp}
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(245, 158, 11, 0.1)" }}
              >
                <div className="flex flex-col items-center text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 * index }}
                  >
                    {stat.icon}
                  </motion.div>
                  <h3 className="mt-4 text-lg font-medium text-white">{stat.title}</h3>
                  <div className="mt-2 text-3xl font-bold text-blue-500">{stat.value}</div>
                  <p className="mt-2 text-sm text-gray-400">{stat.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section> */}

      {/* Company Info Slider */}
      <section className="py-16 bg-[#121212]">
        <div className="container mx-auto px-4 md:px-6">
          <motion.h2
            className="text-3xl font-bold tracking-tight text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            About us
          </motion.h2>

          <InfoSlider
            slides={[
              {
                title: "Our Mission",
                content:
                  "We’re building Gyralis to empower organizations and users thrive together. Our mission is to turn daily participation into progress — by creating dynamic loops that reward real engagement and power innovation. It’s transparent, fair, and built for long-term growth.",
                color: "#0065BD",
              },
              {
                title: "Our Vision",
                content:
                  "To become the a leading platform for decentralized orgnization-driven engagement, where organizations, users, and sponsors collaborate seamlessly in a self-sustaining economy. .",
                color: "#0065BD",
              },
              {
                title: "The Road Ahead",
                content:
                  "Our focus is on growing Gyralis and bringing it to new DAOs, communities, and users. As we scale, we’ll support a wider range of sybil-resistance verification methods to ensure fair participation while at the same time, expand eligibility criteria to allow more flexible participation requirements — such as token staking, NFT ownership, or custom community conditions.",
                color: "#0065BD",
              },
              {
                title: "Be Part of Gyralis",
                content:
                  "Whether you're a DAO seeking to reward your community, a user eager to engage meaningfully, or a verification provider looking to integrate — Gyralis is your platform. Together, we can build sustainable engagement loops powered by a shared economy that rewards participation.",
                color: "#0065BD",
              },
            ]}
          />
        </div>
      </section>


      {/* Why Choose Us */}
      <section className="py-16 bg-[#121212]" id="why-us" ref={whyUsRef}>
        <div className="container mx-auto px-4 md:px-6">
          <motion.h2
            className="text-3xl font-bold tracking-tight text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={whyUsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            How It Works
          </motion.h2>
          <motion.div
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
            variants={staggerContainer}
            initial="hidden"
            animate={whyUsInView ? "visible" : "hidden"}
          >
            {[
              {
                icon: "🌍",
                title: "Step 1 - Register",
                description:
                  "Pass the Loop shield and join the Loop. Everytime you register in a period, you wil be able to claim in the next one.",
              },
              {
                icon: "💡",
                title: "Step 2 - Claim",
                description:
                  "Sign a transaction diaily and claim your share of token distributions.​ If you claim, you automatically register for the next period.",
              },
              {
                icon: "⚡",
                title: "Step 3 - Maintain Eligibility",
                description:
                  "Consistently engage to remain eligible; missing a claim period requires re-registration.",
              },
             
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-amber-500 transition-colors group"
                variants={fadeInUp}
                whileHover={{ y: -10, transition: { duration: 0.2 } }}
              >
                <motion.div
                  className="h-12 w-12 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-500/20 transition-colors"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <motion.span
                    className="text-blue-500 text-xl"
                    animate={
                      whyUsInView
                        ? {
                            scale: [1, 1.2, 1],
                          }
                        : {}
                    }
                    transition={{ duration: 1, delay: index * 0.2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 5 }}
                  >
                    {feature.icon}
                  </motion.span>
                </motion.div>
                <h3 className="font-semibold mb-2 text-center text-white">{feature.title}</h3>
                <p className="text-gray-400 text-sm text-center">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-[#121212]" id="contact" ref={contactRef}>
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-10 lg:grid-cols-2">
            <motion.div variants={slideInLeft} initial="hidden" animate={contactInView ? "visible" : "hidden"}>
              <h2 className="text-3xl font-bold tracking-tight mb-6">
                <motion.span
                  className="text-blue-500 inline-block"
                  animate={{
                    rotate: [0, 10, 0, -10, 0],
                  }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 5 }}
                >
                  💬
                </motion.span>{" "}
                Ready to Elevate?
              </h2>
              <p className="text-gray-300 mb-8">
                Whether you are a creator, investor, startup, or entrepreneur—Chiloane Holdings is your growth partner.
              </p>
              <div className="space-y-4">
                <motion.div
                  className="flex items-center"
                  initial={{ opacity: 0, x: -20 }}
                  animate={contactInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  {/* <MapPin className="h-5 w-5 mr-3 text-blue-500" /> */}
                  <span className="text-gray-300">Turfloop, Polokwane, South Africa</span>
                </motion.div>
                <motion.div
                  className="flex items-center"
                  initial={{ opacity: 0, x: -20 }}
                  animate={contactInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  {/* <Mail className="h-5 w-5 mr-3 text-blue-500" /> */}
                  <span className="text-gray-300">audiolab@afrimail.com</span>
                </motion.div>
                <motion.div
                  className="flex items-center"
                  initial={{ opacity: 0, x: -20 }}
                  animate={contactInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  {/* <Phone className="h-5 w-5 mr-3 text-blue-500" /> */}
                  <span className="text-gray-300">0680813261</span>
                </motion.div>
                <motion.div
                  className="flex space-x-4 pt-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={contactInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  {/* {[Linkedin, Instagram, Youtube].map((Icon, index) => (
                    <motion.a
                      key={index}
                      href="#"
                      className="text-gray-300 hover:text-blue-500 transition-colors"
                      whileHover={{ scale: 1.2, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <Icon className="h-6 w-6" />
                    </motion.a>
                  ))} */}
                </motion.div>
              </div>
            </motion.div>
            <motion.div
              className="bg-gray-800 p-6 rounded-lg"
              variants={fadeInUp}
              initial="hidden"
              animate={contactInView ? "visible" : "hidden"}
            >
              <form className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <motion.div className="space-y-2" variants={fadeIn} transition={{ delay: 0.1 }}>
                    <label htmlFor="name" className="text-sm font-medium text-gray-300">
                      Name
                    </label>
                    <input
                      id="name"
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:border-amber-500 focus:ring-amber-500 transition-colors"
                      placeholder="Your name"
                    />
                  </motion.div>
                  <motion.div className="space-y-2" variants={fadeIn} transition={{ delay: 0.2 }}>
                    <label htmlFor="email" className="text-sm font-medium text-gray-300">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:border-amber-500 focus:ring-amber-500 transition-colors"
                      placeholder="Your email"
                    />
                  </motion.div>
                </div>
                <motion.div className="space-y-2" variants={fadeIn} transition={{ delay: 0.3 }}>
                  <label htmlFor="subject" className="text-sm font-medium text-gray-300">
                    Subject
                  </label>
                  <input
                    id="subject"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:border-amber-500 focus:ring-amber-500 transition-colors"
                    placeholder="Subject"
                  />
                </motion.div>
                <motion.div className="space-y-2" variants={fadeIn} transition={{ delay: 0.4 }}>
                  <label htmlFor="message" className="text-sm font-medium text-gray-300">
                    Message
                  </label>
                  <textarea
                    id="message"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:border-amber-500 focus:ring-amber-500 min-h-[120px] transition-colors"
                    placeholder="Your message"
                  ></textarea>
                </motion.div>
                <motion.div
                  variants={fadeIn}
                  transition={{ delay: 0.5 }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <button className="w-full bg-blue-500 hover:bg-blue-600 text-white relative overflow-hidden group">
                    <span className="relative z-10">Let s Work Together</span>
                    <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-400 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110"></span>
                  </button>
                </motion.div>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 bg-black text-gray-400">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            className="flex flex-col md:flex-row justify-between items-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="mb-4 md:mb-0 flex items-center space-x-2">
              <motion.div
                className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xs"
                whileHover={{ rotate: 10 }}
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5">
                  <path d="M12,3 L19,7 L19,17 L12,21 L5,17 L5,7 Z" fill="rgba(255, 255, 255, 0.8)" />
                  <circle cx="12" cy="12" r="2" fill="rgba(255, 255, 255, 1)" />
                </svg>
              </motion.div>
              <p className="text-sm">© {new Date().getFullYear()} Chiloane Holdings. All rights reserved.</p>
            </div>
            <div className="flex space-x-4">
              <motion.a
                href="#"
                className="text-gray-400 hover:text-blue-500 transition-colors text-sm"
                whileHover={{ x: 3 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                Privacy Policy
              </motion.a>
              <motion.a
                href="#"
                className="text-gray-400 hover:text-blue-500 transition-colors text-sm"
                whileHover={{ x: 3 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                Terms of Service
              </motion.a>
            </div>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}
