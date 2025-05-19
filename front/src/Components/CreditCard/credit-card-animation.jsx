"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useSpring } from "framer-motion";
import "./card.css";

export default function CreditCardAnimation() {
    const containerRef = useRef(null);
    const cardRef = useRef(null);
    const [mouseX, setMouseX] = useState(0);
    const [mouseY, setMouseY] = useState(0);
    const [isHovering, setIsHovering] = useState(false);
    const [activeTextIndex, setActiveTextIndex] = useState(0);

    const rotateXSpring = useSpring(0, { stiffness: 150, damping: 15 });
    const rotateYSpring = useSpring(0, { stiffness: 150, damping: 15 });
    const scaleSpring = useSpring(1, { stiffness: 150, damping: 15 });
    const translateXSpring = useSpring(0, { stiffness: 150, damping: 15 });
    const translateYSpring = useSpring(0, { stiffness: 150, damping: 15 });


    //const textTranslateYSpring = useSpring(0, { stiffness: 150, damping: 15 });

    const textTranslateYSpring = useSpring(0, {
        stiffness: 60,   // más bajo = más suave
        damping: 20,
    });

    useEffect(() => {
        const handleScroll = () => {
            if (!containerRef.current) return;
            const container = containerRef.current;
            const containerTop = container.getBoundingClientRect().top;
            const containerHeight = container.offsetHeight;
            const viewportHeight = window.innerHeight;

            let scrollPercent = 0;
            if (containerTop <= 0) {
                scrollPercent = Math.min(Math.abs(containerTop) / (containerHeight - viewportHeight), 1);
            }

            const newScale = 1 - scrollPercent * 0.2;
            const newTranslateX = scrollPercent * 600;
            scaleSpring.set(newScale);
            translateXSpring.set(newTranslateX);

            const newTranslateY = scrollPercent * 200;
            translateYSpring.set(newTranslateY);



            const newTextTranslateY = scrollPercent * 600; // ajusta el valor según el desplazamiento deseado
            textTranslateYSpring.set(newTextTranslateY);



            const scrollBasedRotateX = scrollPercent * 5 - 2.5;
            const scrollBasedRotateY = scrollPercent * 20 - 10;

            if (!isHovering) {
                rotateXSpring.set(scrollBasedRotateX);
                rotateYSpring.set(scrollBasedRotateY);
            }

            if (scrollPercent < 0.25) setActiveTextIndex(0);
            else if (scrollPercent < 0.5) setActiveTextIndex(1);
            else if (scrollPercent < 0.75) setActiveTextIndex(2);
            else setActiveTextIndex(3);
        };

        window.addEventListener("scroll", handleScroll);
        handleScroll();

        return () => window.removeEventListener("scroll", handleScroll);
    }, [isHovering, rotateXSpring, rotateYSpring, scaleSpring, translateXSpring]);

    const handleMouseMove = (e) => {
        if (!cardRef.current || !isHovering) return;
        const rect = cardRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const mouseXNorm = (e.clientX - centerX) / (rect.width / 2);
        const mouseYNorm = (e.clientY - centerY) / (rect.height / 2);
        setMouseX(mouseXNorm);
        setMouseY(mouseYNorm);
    };

    useEffect(() => {
        if (isHovering) {
            rotateXSpring.set(-mouseY * 9);
            rotateYSpring.set(mouseX * 4);
        }
    }, [mouseX, mouseY, isHovering, rotateXSpring, rotateYSpring]);

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
            text: "Revisa regularmente los movimientos de tu tarjeta.",
        },
    ];

    return (
        <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            className="relative height-300vh overflow-hidden bg-transparent"
        >
            <div
                className="sticky top-50 translate-y-minus-50 flex-justify-center-items-center height-screen width-full pointer-events-none perspective-1000">
                <motion.div
                    ref={cardRef}
                    className="width-350px height-220px rounded-2xl bg-gradient-to-br shadow-xl text-white pointer-events-auto"
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
                >
                    <div className="padding-6 flex flex-column justify-between height-full">
                        <div className="text-sm opacity-80">ECONOMICALLY E</div>
                        <div className="text-xl tracking-widest font-mono">**** **** **** 1234</div>
                        <div className="flex-justify-between-items-center text-xs margin-top-2">
                            <span>TITULAR</span>
                            <span>EXPIRA 05/28</span>
                        </div>
                    </div>
                </motion.div>
            </div>
            {/* Texto animado durante el scroll */}
            <div
                className="absolute top-0 left-0 width-full height-full flex flex-column items-center justify-center text-center pointer-events-none">
                <motion.div
                    key={activeTextIndex}
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    transition={{duration: 1.0}}
                    className="max-w-lg px-4 text-white drop-shadow-lg"
                    style={{ y: textTranslateYSpring }} // controla la posición solo con spring
                >
                    <h2 className="text-2xl font-bold mb-2">{texts[activeTextIndex].title}</h2>
                    <p className="text-md">{texts[activeTextIndex].text}</p>
                </motion.div>
            </div>
        </div>
    );
}
