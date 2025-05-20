"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion, useAnimation, useInView } from "framer-motion";
import { ArrowPathIcon, ClockIcon, Cog6ToothIcon, ShieldCheckIcon, SparklesIcon } from "@heroicons/react/20/solid";
import GyralisLogo from "~~/components/assets/GyralisLogo.svg";
import { ParticleBackground } from "~~/components/landing-page";
import { InfoSlider } from "~~/components/landing-page";

export default function Home() {
  const controls = useAnimation();
  const aboutRef = useRef(null);
  const divisionsRef = useRef(null);
  const whyUsRef = useRef(null);

  const aboutInView = useInView(aboutRef, { once: true, amount: 0.3 });
  const divisionsInView = useInView(divisionsRef, { once: true, amount: 0.1 });
  const whyUsInView = useInView(whyUsRef, { once: true, amount: 0.3 });

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

      {/* What is Gylaris */}
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
              Loops are dynamic engines for distributing tokens. Modular, customizable contracts that organizations can
              design to distribute tokens with 4 main settings: Period Lenght, Distribution Per Period, Sybil
              Verification and Elegibility Criteria.
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
              className="inline-block text-[#f7cd6f]"
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
            Loops Features
          </motion.h2>
          <motion.div
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
            variants={staggerContainer}
            initial="hidden"
            animate={divisionsInView ? "visible" : "hidden"}
          >
            {[
              {
                icon: <ShieldCheckIcon className="h-7 w-7 text-[#f7cd6f]" />,
                title: "Loop shield",
                description: "Ensuring Verified Participation.",
                content:
                  "Loop Shield protects the integrity of Loops by requiring users to verify their identity. This ensures that  unique individuals can claim, making rewards distribution fairer.",
                services: [
                  "Gitcoin Passport integration",
                  "Minimum score requirement: 15 points",
                  "Future support for additional verification methods",
                ],
              },
              {
                icon: <ArrowPathIcon className="h-7 w-7 text-[#f7cd6f]" />,
                title: "Eligibility Criteria:",
                description: "Encouraging Active Participation.",
                content:
                  "Gyralis allows communities to define who can participate in Loops by setting eligibility requirements. These criteria ensure that participants are meaningfully aligned with the community's goals and values",
                services: [
                  "Default criteria like token staking and NFT ownership (Coming Soon)",
                  "Custom eligibility logic built with the Gyralis team",
                ],
              },
              {
                icon: <ClockIcon className="h-7 w-7 text-[#f7cd6f]" />,
                title: "Daily Claims",
                description: "Rewarding Consistent Engagement.",
                content:
                  "Gyralis encourages regular user participation through a daily claim system. This powerful mechanic ensures continuous community momentum and makes rewards predictable and transparent.",
                services: [
                  "Daily claim period (currently 24 hours for prototype)",
                  "10% of the Loop balance is distributed daily among registered users",
                  "Missed a claim? Re-register to join the next cycle",
                ],
              },
              {
                icon: <Cog6ToothIcon className="h-7 w-7 text-[#f7cd6f]" />,
                title: "Period Length",
                description: "Time Setting for Claims.",
                content: "Each loop runs on a defined period that determines the frequency of claims.",
                services: [
                  "Current demo uses a 24-hour period per claim window",
                  "Period settings align with community rhythms and objectives",
                  "Future support for dynamic period adjustments (Coming Soon)",
                ],
              },
              {
                icon: <Cog6ToothIcon className="h-7 w-7 text-[#f7cd6f]" />,
                title: "Distribution Per Period",
                description: "Predictable, Fair Token Distribution.",
                content:
                  "A fixed percentage of the loop’s token balance is allocated for each distribution cycle, rewarding active participants during that period evenly.",
                services: [
                  "10% of the loop’s balance allocation is released every period",
                  "Tokens are evenly split among all eligible claimants",

                  "Adjustable distribution rates per campaign (Coming Soon)",
                ],
              },

              {
                icon: <SparklesIcon className="h-7 w-7 text-[#f7cd6f]" />,
                title: "Boosted Loops (coming soon)",
                description: "Powering the Gyra-Economy.",
                content:
                  " A new layer is coming to Gyralis... where loops aren’t just about distribution—they're about strategy, gamification, and token utility. Boosted Loops will introduce the native Gyralis Token into the ecosystem, unlocking new mechanics and deeper incentive design for communities.",
                services: [
                  "Gamified token distribution using the Gyralis Token to power the Gyra-Economy",
                  "Loop creators gain new tools to amplify engagement",
                  "Exclusive utility and multipliers tied to user actions",
                ],
              },
            ].map((division, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                custom={index}
                whileHover={{ y: -10, transition: { duration: 0.2 } }}
              >
                <div className="bg-gray-900 card border-[1px] border-gray-800 hover:border-[#f7cd6f] transition-colors h-full overflow-hidden group p-2">
                  <div className="relative px-4">
                    <div className="absolute top-0 right-2">{division.icon}</div>
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
                            className="h-1.5 w-1.5 rounded-full bg-[#f7cd6f] mr-2"
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

      {/* How It Works */}
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
                icon: "🛡️",
                title: "Step 1 - Register",
                description:
                  "Pass the Loop shield and match the eligibily criteria. Everytime you register in a period, you wil be able to claim in the next one.",
              },
              {
                icon: "💰",
                title: "Step 2 - Claim",
                description:
                  "Sign a transaction diaily and claim your share of token distributions.​ If you claim, you automatically register for the next period.",
              },
              {
                icon: "🔄",
                title: "Step 3 - Maintain Eligibility",
                description:
                  "Consistently engage and remain eligible, missing a claim period requires re-registration.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-[#f7cd6f] transition-colors group"
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

      {/* About Us Info Slider */}
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
                  "We’re building Gyralis to turn daily participation into progress — by creating dynamic loops that reward real engagement and power innovation. It’s transparent, fair, and built for long-term growth.",
                color: "#0065BD",
              },
              {
                title: "Our Vision",
                content:
                  "To become the leading platform for decentralized orgnization-driven engagement, where organizations, users, and sponsors collaborate seamlessly in a self-sustaining economy.",
                color: "#0065BD",
              },
              {
                title: "The Road Ahead",
                content:
                  "Our focus is on growing Gyralis and bringing it to new DAOs, communities, and users. As we scale, we’ll support a wider range of sybil-resistance verification methods while at the same time expand eligibility criteria to allow more flexible participation requirements.",
                color: "#0065BD",
              },
              {
                title: "Be Part of Gyralis",
                content:
                  "Whether you're a DAO seeking to reward your community, a user eager to engage meaningfully, or a verification provider looking to integrate or chain looking for new project — Gyralis is your platform. Together, we can build sustainable engagement loops powered by a shared economy that rewards daily participation.",
                color: "#0065BD",
              },
            ]}
          />
        </div>
      </section>
    </div>
  );
}
