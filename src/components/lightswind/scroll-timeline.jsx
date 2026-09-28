"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { cn } from "../../lib/utils";
import { Card, CardContent } from "../ui/card";
import { Calendar } from "lucide-react";

const DEFAULT_EVENTS = [
  {
    year: "2023",
    title: "Major Achievement",
    subtitle: "Organization Name",
    description:
      "Description of the achievement or milestone reached during this time period.",
  },
  {
    year: "2022",
    title: "Important Milestone",
    subtitle: "Organization Name",
    description: "Details about this significant milestone and its impact.",
  },
  {
    year: "2021",
    title: "Key Event",
    subtitle: "Organization Name",
    description: "Information about this key event in the timeline.",
  },
];

const LINE_LEFT = 32;

export const ScrollTimeline = ({
  events = DEFAULT_EVENTS,
  title = "Timeline",
  animationOrder = "sequential",
  cardAlignment = "left",
  lineColor = "bg-primary/30",
  activeColor = "bg-primary",
  progressIndicator = true,
  cardVariant = "default",
  cardEffect = "none",
  parallaxIntensity = 0.2,
  progressLineWidth = 2,
  progressLineCap = "round",
  dateFormat = "badge",
  revealAnimation = "fade",
  className = "",
  connectorStyle = "line",
  perspective = false,
  darkMode = false,
  smoothScroll = true,
}) => {
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const timelineRefs = useRef([]);

  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const progressHeight = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);

  useEffect(() => {
    const unsubscribe = scrollYProgress.onChange((v) => {
      const newIndex = Math.floor(v * events.length);
      if (
        newIndex !== activeIndex &&
        newIndex >= 0 &&
        newIndex < events.length
      ) {
        setActiveIndex(newIndex);
      }
    });
    return () => unsubscribe();
  }, [scrollYProgress, events.length, activeIndex]);

  const getCardVariants = (index) => {
    const baseDelay =
      animationOrder === "simultaneous"
        ? 0
        : animationOrder === "staggered"
          ? index * 0.2
          : index * 0.3;

    const initialStates = {
      fade: { opacity: 0, y: 20 },
      slide: { x: -100, opacity: 0 },
      scale: { scale: 0.8, opacity: 0 },
      flip: { rotateY: 90, opacity: 0 },
      none: { opacity: 1 },
    };

    return {
      initial: initialStates[revealAnimation] || initialStates.fade,
      whileInView: {
        opacity: 1,
        y: 0,
        x: 0,
        scale: 1,
        rotateY: 0,
        transition: {
          duration: 0.7,
          delay: baseDelay,
          ease: [0.25, 0.1, 0.25, 1.0],
        },
      },
      viewport: { once: false, margin: "-100px" },
    };
  };

  const getCardClasses = (index) => {
    const baseClasses = "relative z-30 rounded-lg transition-all duration-300";
    const variantClasses = {
      default: "bg-card border shadow-sm",
      elevated: "bg-card border border-border/40 shadow-md",
      outlined: "bg-card/50 backdrop-blur border-2 border-primary/20",
      filled: "bg-primary/10 border border-primary/30",
    };
    const effectClasses = {
      none: "",
      glow: "hover:shadow-[0_0_15px_rgba(var(--primary-rgb)/0.5)]",
      shadow: "hover:shadow-lg hover:-translate-y-1",
      bounce: "hover:scale-[1.03] hover:shadow-md active:scale-[0.97]",
    };

    return cn(
      baseClasses,
      variantClasses[cardVariant] || variantClasses.default,
      effectClasses[cardEffect] || effectClasses.none,

      "w-full",
    );
  };

  return (
    <div
      ref={scrollRef}
      className={cn(
        "relative min-h-screen w-full overflow-hidden",
        darkMode ? "bg-background text-foreground" : "",
        className,
      )}
    >
      <div className="text-left py-16 px-4">
        <h2 className="text-3xl md:text-5xl font-bold mb-4 text-primary">
          {title}
        </h2>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 pb-24">
        <div className="relative" style={{ paddingLeft: LINE_LEFT + 28 }}>
          <div
            className={cn("absolute top-0 h-full z-10", lineColor)}
            style={{
              left: LINE_LEFT,
              width: progressLineWidth,
            }}
          />

          {progressIndicator && (
            <>
              <motion.div
                className="absolute top-0 z-10"
                style={{
                  height: progressHeight,
                  width: progressLineWidth,
                  left: LINE_LEFT,
                  borderRadius: progressLineCap === "round" ? "9999px" : "0px",
                  background: `linear-gradient(to bottom, #22d3ee, #6366f1, #a855f7)`,
                  boxShadow: `0 0 15px rgba(99,102,241,0.5), 0 0 25px rgba(168,85,247,0.3)`,
                }}
              />

              <motion.div
                className="absolute z-20"
                style={{
                  top: progressHeight,
                  left: LINE_LEFT,
                  translateX: "-50%",
                  translateY: "-50%",
                }}
              >
                <motion.div
                  className="w-5 h-5 rounded-full"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(168,85,247,0.8) 0%, rgba(99,102,241,0.5) 40%, rgba(34,211,238,0) 70%)",
                    boxShadow: `
                      0 0 15px 4px rgba(168, 85, 247, 0.6),
                      0 0 25px 8px rgba(99, 102, 241, 0.4),
                      0 0 40px 15px rgba(34, 211, 238, 0.2)
                    `,
                  }}
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </motion.div>
            </>
          )}

          <div className="relative z-20">
            {events.map((event, index) => {
              const yOffset = useTransform(
                smoothProgress,
                [0, 1],
                [parallaxIntensity * 100, -parallaxIntensity * 100],
              );

              return (
                <div
                  key={event.id || index}
                  ref={(el) => {
                    timelineRefs.current[index] = el;
                  }}
                  className="relative flex items-start mb-20 py-4"
                >
                  <div
                    className="absolute z-30 flex-shrink-0"
                    style={{
                      left: -28,
                      top: "50%",
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    <motion.div
                      className={cn(
                        "w-6 h-6 rounded-full border-4 bg-background flex items-center justify-center",
                        index <= activeIndex ? activeColor : "border bg-card",
                      )}
                      animate={
                        index <= activeIndex
                          ? {
                              scale: [1, 1.3, 1],
                              boxShadow: [
                                "0 0 0px rgba(99,102,241,0)",
                                "0 0 12px rgba(99,102,241,0.6)",
                                "0 0 0px rgba(99,102,241,0)",
                              ],
                            }
                          : {}
                      }
                      transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        repeatDelay: 4,
                        ease: "easeInOut",
                      }}
                    />
                  </div>

                  <motion.div
                    className={cn(getCardClasses(index), "mt-0")}
                    variants={getCardVariants(index)}
                    initial="initial"
                    whileInView="whileInView"
                    viewport={{ once: false, margin: "-100px" }}
                    style={parallaxIntensity > 0 ? { y: yOffset } : undefined}
                  >
                    <Card className="bg-background border">
                      <CardContent className="p-6">
                        <h3
                          className="text-xl font-bold mb-1 hover:underline hover:text-blue-400"
                          href=""
                        >
                          {event.institution}
                        </h3>

                        <p className="text-muted-foreground font-medium mb-2">
                          {event.title}
                        </p>

                        {event.period && (
                          <div className="flex items-center mb-2">
                            <Calendar className="h-4 w-4 mr-2 text-primary" />
                            <p className="text-sm text-muted-foreground">
                              {event.period}
                            </p>
                          </div>
                        )}

                        <p className="text-muted-foreground">
                          {event.description}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
