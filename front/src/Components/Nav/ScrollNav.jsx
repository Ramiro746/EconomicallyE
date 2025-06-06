"use client"

import { useEffect, useState } from "react"
import { Menu } from "lucide-react"
import "./scrollNav.css"

export default function ScrollNav({ links, user, onSignOut, onOpenLogin, onOpenRegister }) {
    const [visible, setVisible] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            // Show nav when scrolled down more than 200px to avoid conflict with main header
            const scrolled = window.scrollY > 200
            setVisible(scrolled)
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <nav className={`scroll-nav ${visible ? "scroll-nav-visible" : ""}`}>
            <div className="scroll-nav-container">
                <div className="scroll-nav-logo">
                    <a href="/">EconomicallyE</a>
                </div>

                <div className="scroll-nav-links-desktop">
                    {links.map((link) => (
                        <a key={link.href} href={link.href} className="scroll-nav-link" onClick={link.onClick}>
                            {link.label}
                        </a>
                    ))}
                </div>

                <div className="scroll-nav-auth">
                    {user ? (
                        <div className="scroll-nav-user-menu">
                            <span className="scroll-nav-username">¡Hola, {user.name}!</span>
                            <button onClick={onSignOut} className="scroll-nav-signout">
                                Cerrar Sesión
                            </button>
                        </div>
                    ) : (
                        <div className="scroll-nav-auth-buttons">
                            <button onClick={onOpenLogin} className="scroll-nav-login">
                                Login
                            </button>
                            <button onClick={onOpenRegister} className="scroll-nav-register">
                                Register
                            </button>
                        </div>
                    )}
                </div>

                <button
                    className="scroll-nav-mobile-toggle"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    <Menu size={24} />
                </button>
            </div>

            {mobileMenuOpen && (
                <div className="scroll-nav-mobile-menu">
                    {links.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            className="scroll-nav-mobile-link"
                            onClick={(e) => {
                                setMobileMenuOpen(false)
                                if (link.onClick) {
                                    e.preventDefault()
                                    link.onClick()
                                }
                            }}
                        >
                            {link.label}
                        </a>
                    ))}

                    {user ? (
                        <div className="scroll-nav-mobile-user">
                            <span className="scroll-nav-mobile-username">¡Hola, {user.name}!</span>
                            <button onClick={onSignOut} className="scroll-nav-mobile-signout">
                                Cerrar Sesión
                            </button>
                        </div>
                    ) : (
                        <div className="scroll-nav-mobile-auth">
                            <button onClick={onOpenLogin} className="scroll-nav-mobile-login">
                                Login
                            </button>
                            <button onClick={onOpenRegister} className="scroll-nav-mobile-register">
                                Register
                            </button>
                        </div>
                    )}
                </div>
            )}
        </nav>
    )
}
