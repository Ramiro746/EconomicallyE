"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useSpring, useMotionValue, useTransform } from "framer-motion"
import "./card.css"

export default function CreditCardAnimation() {
    const containerRef = useRef(null)
    const cardRef = useRef(null)
    const [mouseX, setMouseX] = useState(0)
    const [mouseY, setMouseY] = useState(0)
    const [isHovering, setIsHovering] = useState(false)
    const [activeTextIndex, setActiveTextIndex] = useState(0)
    const [isVisible, setIsVisible] = useState(false)

    // Springs más suaves y naturales
    const rotateXSpring = useSpring(0, { stiffness: 100, damping: 20 })
    const rotateYSpring = useSpring(0, { stiffness: 100, damping: 20 })
    const scaleSpring = useSpring(1, { stiffness: 120, damping: 25 })
    const translateXSpring = useSpring(0, { stiffness: 80, damping: 20 })
    const translateYSpring = useSpring(0, { stiffness: 80, damping: 20 })
    const textTranslateYSpring = useSpring(0, { stiffness: 60, damping: 20 })

    // Motion values para efectos avanzados
    const glowX = useMotionValue(50)
    const glowY = useMotionValue(50)
    const shimmerX = useTransform(glowX, [0, 100], [-100, 100])
    const shimmerY = useTransform(glowY, [0, 100], [-100, 100])

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting)
            },
            { threshold: 0.1 },
        )

        if (containerRef.current) {
            observer.observe(containerRef.current)
        }

        return () => observer.disconnect()
    }, [])

    useEffect(() => {
        const handleScroll = () => {
            if (!containerRef.current) return
            const container = containerRef.current
            const containerTop = container.getBoundingClientRect().top
            const containerHeight = container.offsetHeight
            const viewportHeight = window.innerHeight

            let scrollPercent = 0
            if (containerTop <= 0) {
                scrollPercent = Math.min(Math.abs(containerTop) / (containerHeight - viewportHeight), 1)
            }

            // Animaciones más suaves basadas en scroll
            const newScale = 1 - scrollPercent * 0.15
            const newTranslateX = scrollPercent * 500
            const newTranslateY = scrollPercent * 150
            const newTextTranslateY = scrollPercent * 400

            scaleSpring.set(newScale)
            translateXSpring.set(newTranslateX)
            translateYSpring.set(newTranslateY)
            textTranslateYSpring.set(newTextTranslateY)

            // Rotaciones más sutiles
            const scrollBasedRotateX = Math.sin(scrollPercent * Math.PI) * 8
            const scrollBasedRotateY = scrollPercent * 15 - 7.5

            if (!isHovering) {
                rotateXSpring.set(scrollBasedRotateX)
                rotateYSpring.set(scrollBasedRotateY)
            }

            // Cambio de texto más suave
            const textIndex = Math.floor(scrollPercent * 4)
            if (textIndex !== activeTextIndex && textIndex < 4) {
                setActiveTextIndex(textIndex)
            }
        }

        window.addEventListener("scroll", handleScroll)
        handleScroll()

        return () => window.removeEventListener("scroll", handleScroll)
    }, [
        isHovering,
        activeTextIndex,
        rotateXSpring,
        rotateYSpring,
        scaleSpring,
        translateXSpring,
        translateYSpring,
        textTranslateYSpring,
    ])

    const handleMouseMove = (e) => {
        if (!cardRef.current) return
        const rect = cardRef.current.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2

        const mouseXNorm = (e.clientX - centerX) / (rect.width / 2)
        const mouseYNorm = (e.clientY - centerY) / (rect.height / 2)

        setMouseX(mouseXNorm)
        setMouseY(mouseYNorm)

        // Actualizar posición del brillo
        const glowXPercent = ((e.clientX - rect.left) / rect.width) * 100
        const glowYPercent = ((e.clientY - rect.top) / rect.height) * 100
        glowX.set(glowXPercent)
        glowY.set(glowYPercent)
    }

    useEffect(() => {
        if (isHovering) {
            rotateXSpring.set(-mouseY * 12)
            rotateYSpring.set(mouseX * 8)
            scaleSpring.set(1.05)
        } else {
            const currentScale = scaleSpring.get()
            if (currentScale > 1) {
                scaleSpring.set(1)
            }
        }
    }, [mouseX, mouseY, isHovering, rotateXSpring, rotateYSpring, scaleSpring])

    const texts = [
        {
            title: "Usa el crédito con responsabilidad",
            text: "La tarjeta de crédito puede ser una herramienta poderosa cuando se usa correctamente.",
        },
        {
            title: "Paga siempre a tiempo",
            text: "Evita intereses y cargos por mora manteniendo tus pagos al día.",
        },
        {
            title: "No superes el 30% de tu crédito",
            text: "Mantén un uso saludable de tu crédito para mejorar tu historial.",
        },
        {
            title: "Monitorea tus gastos",
            text: "Revisa regularmente los movimientos de tu tarjeta para mantener el control.",
        },
    ]

    return (
        <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            className="relative overflow-hidden bg-transparent height-300vh"
        >
            {/* Partículas de fondo */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="particle"
                        initial={{
                            x: typeof window !== "undefined" ? Math.random() * window.innerWidth : 0,
                            y: typeof window !== "undefined" ? Math.random() * window.innerHeight : 0,
                            scale: 0,
                        }}
                        animate={
                            isVisible
                                ? {
                                    y: [null, -100],
                                    opacity: [0.2, 0, 0.2],
                                    scale: [0, 1, 0],
                                }
                                : {}
                        }
                        transition={{
                            duration: 3 + Math.random() * 2,
                            repeat: Number.POSITIVE_INFINITY,
                            delay: Math.random() * 2,
                            ease: "easeInOut",
                        }}
                    />
                ))}
            </div>

            <div className="sticky top-50 translate-y-minus-50 flex-justify-center-items-center height-screen width-full pointer-events-none perspective-1000">
                <motion.div
                    ref={cardRef}
                    className="relative width-400px height-250px rounded-2xl text-white pointer-events-auto card-cursor"
                    style={{
                        rotateX: rotateXSpring,
                        rotateY: rotateYSpring,
                        scale: scaleSpring,
                        x: translateXSpring,
                        y: translateYSpring,
                        transformStyle: "preserve-3d",
                    }}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                    initial={{ opacity: 0, z: -100 }}
                    animate={isVisible ? { opacity: 1, z: 0 } : {}}
                    transition={{ duration: 1, ease: "easeOut" }}
                >
                    {/* Fondo principal con gradiente mejorado */}
                    <div className="card-background" />

                    {/* Efecto de brillo holográfico */}
                    <motion.div
                        className="card-glow"
                        style={{
                            background: `radial-gradient(circle at ${glowX.get()}% ${glowY.get()}%, rgba(59, 130, 246, 0.8) 0%, rgba(147, 51, 234, 0.4) 25%, transparent 50%)`,
                        }}
                    />

                    {/* Efecto shimmer */}
                    <motion.div
                        className="card-shimmer"
                        style={{
                            background: `linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%)`,
                            transform: `translateX(${shimmerX.get()}px) translateY(${shimmerY.get()}px)`,
                        }}
                    />

                    {/* Contenido de la tarjeta */}
                    <div className="card-content">
                        {/* Header con logo y chip */}
                        <div className="card-header">
                            <motion.div
                                className="card-logo"
                                animate={isHovering ? { scale: 1.05 } : { scale: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                ECONOMICALLY E
                            </motion.div>

                            {/* Chip animado */}
                            <motion.div
                                className="card-chip"
                                animate={
                                    isHovering
                                        ? {
                                            rotateY: [0, 10, -10, 0],
                                            scale: [1, 1.1, 1],
                                        }
                                        : {}
                                }
                                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                            >
                                <div className="chip-inner" />
                                <div className="chip-grid">
                                    {[...Array(9)].map((_, i) => (
                                        <div key={i} className="chip-dot" />
                                    ))}
                                </div>
                            </motion.div>
                        </div>

                        {/* Número de tarjeta */}
                        <motion.div
                            className="card-number"
                            animate={
                                isHovering
                                    ? {
                                        letterSpacing: "0.4em",
                                        textShadow: "0 0 20px rgba(255,255,255,0.5)",
                                    }
                                    : {
                                        letterSpacing: "0.3em",
                                        textShadow: "none",
                                    }
                            }
                            transition={{ duration: 0.5 }}
                        >
                            •••• •••• •••• 1234
                        </motion.div>

                        {/* Footer */}
                        <div className="card-footer">
                            <div className="card-info">
                                <div className="info-label">TITULAR</div>
                                <motion.div
                                    className="info-value"
                                    animate={isHovering ? { scale: 1.05 } : { scale: 1 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    USUARIO DEMO
                                </motion.div>
                            </div>

                            <div className="card-info card-info-right">
                                <div className="info-label">EXPIRA</div>
                                <motion.div
                                    className="info-value"
                                    animate={isHovering ? { scale: 1.05 } : { scale: 1 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    05/28
                                </motion.div>
                            </div>
                        </div>
                    </div>

                    {/* Efecto de borde brillante */}
                    <motion.div
                        className="card-border"
                        animate={
                            isHovering
                                ? {
                                    borderColor: "rgba(255,255,255,0.4)",
                                    boxShadow: "0 0 30px rgba(59, 130, 246, 0.3)",
                                }
                                : {
                                    borderColor: "rgba(255,255,255,0.2)",
                                    boxShadow: "none",
                                }
                        }
                        transition={{ duration: 0.5 }}
                    />

                    {/* Sombra dinámica */}
                    <motion.div
                        className="card-shadow"
                        style={{
                            rotateX: rotateXSpring,
                            rotateY: rotateYSpring,
                            scale: scaleSpring,
                        }}
                    />
                </motion.div>
            </div>

            {/* Texto animado mejorado */}
            <div className="text-container">
                <motion.div
                    key={activeTextIndex}
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -50, scale: 0.9 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-content"
                    style={{ y: textTranslateYSpring }}
                >
                    <motion.h2
                        className="text-title"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                    >
                        {texts[activeTextIndex].title}
                    </motion.h2>
                    <motion.p
                        className="text-description"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                    >
                        {texts[activeTextIndex].text}
                    </motion.p>
                </motion.div>
            </div>

            {/* Indicador de progreso */}
            <div className="progress-indicator">
                {texts.map((_, index) => (
                    <motion.div
                        key={index}
                        className="progress-dot"
                        animate={{
                            backgroundColor: index === activeTextIndex ? "rgba(59, 130, 246, 0.8)" : "rgba(255, 255, 255, 0.3)",
                            scale: index === activeTextIndex ? 1.2 : 1,
                        }}
                        transition={{ duration: 0.3 }}
                    />
                ))}
            </div>
        </div>
    )
}
