"use client"
import { motion } from "framer-motion"
import "./HeroGeometric.css"

function ElegantShape({
                          className = "",
                          delay = 0,
                          width = 400,
                          height = 100,
                          rotate = 0,
                          shapeClass = "shape-indigo",
                          style = {},
                          darkMode = false,
                      }) {
    return (
        <motion.div
            initial={{
                opacity: 0,
                y: -150,
                rotate: rotate - 15,
            }}
            animate={{
                opacity: 1,
                y: 0,
                rotate: rotate,
            }}
            transition={{
                duration: 2.4,
                delay,
                ease: [0.23, 0.86, 0.39, 0.96],
                opacity: { duration: 1.2 },
            }}
            className={`elegant-shape ${className} ${darkMode ? "dark-mode" : ""}`}
            style={style}
        >
            <motion.div
                animate={{
                    y: [0, 15, 0],
                }}
                transition={{
                    duration: 12,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                }}
                className="shape-content"
                style={{
                    width,
                    height,
                }}
            >
                <div className={`shape-element ${shapeClass} ${darkMode ? "dark" : ""}`} />
            </motion.div>
        </motion.div>
    )
}

export default function HeroGeometric({ darkMode = false }) {
    return (
        <div className={`hero-container ${darkMode ? "dark-mode" : ""}`}>
            <div className={`background-gradient ${darkMode ? "dark" : ""}`} />

            <div className="shapes-container">
                <ElegantShape
                    delay={0.3}
                    width={600}
                    height={140}
                    rotate={12}
                    shapeClass="shape-indigo"
                    style={{
                        left: "-10%",
                        top: "15%",
                    }}
                    className="shape-1"
                    darkMode={darkMode}
                />
                <ElegantShape
                    delay={0.5}
                    width={500}
                    height={120}
                    rotate={-15}
                    shapeClass="shape-rose"
                    style={{
                        right: "-5%",
                        top: "70%",
                    }}
                    className="shape-2"
                    darkMode={darkMode}
                />
                <ElegantShape
                    delay={0.4}
                    width={300}
                    height={80}
                    rotate={-8}
                    shapeClass="shape-violet"
                    style={{
                        left: "5%",
                        bottom: "5%",
                    }}
                    className="shape-3"
                    darkMode={darkMode}
                />
                <ElegantShape
                    delay={0.6}
                    width={200}
                    height={60}
                    rotate={20}
                    shapeClass="shape-amber"
                    style={{
                        right: "15%",
                        top: "10%",
                    }}
                    className="shape-4"
                    darkMode={darkMode}
                />
                <ElegantShape
                    delay={0.7}
                    width={150}
                    height={40}
                    rotate={-25}
                    shapeClass="shape-cyan"
                    style={{
                        left: "20%",
                        top: "5%",
                    }}
                    className="shape-5"
                    darkMode={darkMode}
                />
            </div>

            <div className={`overlay-gradient ${darkMode ? "dark" : ""}`} />
        </div>
    )
}
