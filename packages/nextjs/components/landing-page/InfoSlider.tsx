"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline"

type SlideType = {
  title: string
  content: string
  image?: string
  color: string
}

type InfoSliderProps = {
  slides: SlideType[]
  autoPlay?: boolean
  interval?: number
}

export const InfoSlider = ({ slides, autoPlay = true, interval = 5000 }: InfoSliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)

  useEffect(() => {
    if (!autoPlay) return

    const timer = setInterval(() => {
      setDirection(1)
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length)
    }, interval)

    return () => clearInterval(timer)
  }, [autoPlay, interval, slides.length])

  const handlePrevious = () => {
    setDirection(-1)
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? slides.length - 1 : prevIndex - 1))
  }

  const handleNext = () => {
    setDirection(1)
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length)
  }

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -1000 : 1000,
      opacity: 0,
    }),
  }

  return (
    <div className="relative w-full overflow-hidden rounded-lg bg-gray-900 shadow-xl">
      <div className="relative h-[400px] w-full">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center"
          >
            <div
              className="absolute inset-0 opacity-10"
              style={{
                background: `radial-gradient(circle at center, ${slides[currentIndex].color}, transparent 70%)`,
              }}
            />

            {slides[currentIndex].image && (
              <div className="mb-6 h-24 w-24 overflow-hidden rounded-full bg-gray-800 p-2">
                <img
                  src={slides[currentIndex].image || "/placeholder.svg"}
                  alt={slides[currentIndex].title}
                  className="h-full w-full object-cover"
                />
              </div>
            )}

            <h3 className="mb-4 text-2xl font-bold text-white">
              <span className="text-amber-500">{slides[currentIndex].title.split(" ")[0]}</span>{" "}
              {slides[currentIndex].title.split(" ").slice(1).join(" ")}
            </h3>

            <p className="max-w-2xl text-gray-300">{slides[currentIndex].content}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1)
              setCurrentIndex(index)
            }}
            className={`h-2 w-2 rounded-full transition-all ${
              index === currentIndex ? "bg-amber-500 w-6" : "bg-gray-600"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      <button
        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full border-gray-700 bg-gray-800/50 text-white hover:bg-gray-700 hover:text-amber-500"
        onClick={handlePrevious}
        aria-label="Previous slide"
      >
        <ChevronLeftIcon className="h-5 w-5" />
      </button>

      <button
     
        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full border-gray-700 bg-gray-800/50 text-white hover:bg-gray-700 hover:text-amber-500"
        onClick={handleNext}
        aria-label="Next slide"
      >
        <ChevronRightIcon className="h-5 w-5" />
      </button>
    </div>
  )
}

