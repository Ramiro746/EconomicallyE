"use client"

import { useState } from "react"

// Actualizar la función extractErrorMessage para limpiar mejor los mensajes

/**
 * Utilidad para limpiar y extraer el mensaje de error más relevante
 */
export const cleanErrorMessage = (message) => {
    if (!message) return "Error desconocido"

    // Si el mensaje contiene JSON, intentar extraer el valor más relevante
    if (message.includes("{") && message.includes("}")) {
        try {
            // Extraer la parte JSON del mensaje
            const jsonMatch = message.match(/\{[^}]+\}/)
            if (jsonMatch) {
                const jsonStr = jsonMatch[0]
                const parsed = JSON.parse(jsonStr)

                // Buscar campos comunes de mensaje
                if (parsed.name) return parsed.name
                if (parsed.message) return parsed.message
                if (parsed.error) return parsed.error
                if (parsed.defaultMessage) return parsed.defaultMessage

                // Si es un objeto simple con un solo valor, devolverlo
                const values = Object.values(parsed)
                if (values.length === 1 && typeof values[0] === "string") {
                    return values[0]
                }
            }
        } catch (e) {
            // Si falla el parsing, continuar con otras estrategias
        }
    }

    // Limpiar prefijos comunes
    const cleanMessage = message
        .replace(/^Error:\s*/, "")
        .replace(/^Error\s*/, "")
        .replace(/^\{"[^"]+"\s*:\s*"([^"]+)"\}$/, "$1")
        .replace(/^\{"([^"]+)"\}$/, "$1")
        .trim()

    return cleanMessage || "Error desconocido"
}

/**
 * Utilidad para extraer mensajes de error del backend
 * Maneja tanto respuestas JSON como texto plano, incluyendo errores de validación de Spring Boot
 */
export const extractErrorMessage = async (response) => {
    let errorMessage = "Error desconocido"
    const fieldErrors = {}

    try {
        // Intentar extraer como JSON primero
        const data = await response.json()

        // Caso 1: errores como array (Spring Boot típico)
        if (data.errors && Array.isArray(data.errors)) {
            data.errors.forEach((error) => {
                if (error.field && error.defaultMessage) {
                    fieldErrors[error.field] = cleanErrorMessage(error.defaultMessage)
                }
            })
            errorMessage = cleanErrorMessage(data.message || "Error de validación")
        }

        // Caso 2: errores como objeto en fieldErrors o errors
        else if (data.fieldErrors || data.errors) {
            const errors = data.fieldErrors || data.errors
            if (typeof errors === "object" && !Array.isArray(errors)) {
                Object.keys(errors).forEach((field) => {
                    fieldErrors[field] = cleanErrorMessage(errors[field])
                })
                errorMessage = cleanErrorMessage(data.message || "Error de validación")
            }
        }

        // ✅ Caso 3: error plano como { amount: "The amount must be greater than 0" }
        else if (typeof data === "object" && !Array.isArray(data)) {
            Object.keys(data).forEach((field) => {
                if (typeof data[field] === "string") {
                    fieldErrors[field] = cleanErrorMessage(data[field])
                }
            })
            // Tomamos el primer mensaje si no hay uno general
            errorMessage = Object.values(fieldErrors)[0] || cleanErrorMessage(data.message || "Error de validación")
        }

        // Caso 4: error simple
        else {
            errorMessage = cleanErrorMessage(data.message || data.error || JSON.stringify(data))
        }
    } catch {
        try {
            // Fallback a texto plano
            const text = await response.text()
            if (text) errorMessage = cleanErrorMessage(text)
        } catch {
            errorMessage = `Error ${response.status}: ${response.statusText}`
        }
    }

    return { message: errorMessage, fieldErrors }
}

/**
 * Wrapper para fetch que maneja errores automáticamente
 */
export const fetchWithErrorHandling = async (url, options = {}) => {
    try {
        const response = await fetch(url, options)

        if (!response.ok) {
            const { message, fieldErrors } = await extractErrorMessage(response)
            const error = new Error(message)
            error.fieldErrors = fieldErrors
            throw error
        }

        return response
    } catch (error) {
        // Re-lanzar el error para que pueda ser manejado por el componente
        throw error
    }
}

// Actualizar el hook useErrorHandler para integrar con el sistema de toast

/**
 * Hook personalizado para manejar estados de error y mensajes con toast
 */
export const useErrorHandler = (toast) => {
    const [errors, setErrors] = useState({})

    const setFieldError = (field, message) => {
        setErrors((prev) => ({
            ...prev,
            [field]: message,
        }))
    }

    const setFieldErrors = (fieldErrorsObj) => {
        setErrors((prev) => ({
            ...prev,
            ...fieldErrorsObj,
        }))
    }

    const clearFieldError = (field) => {
        setErrors((prev) => {
            const newErrors = { ...prev }
            delete newErrors[field]
            return newErrors
        })
    }

    const clearAllErrors = () => {
        setErrors({})
    }

    const setSuccess = (message) => {
        clearAllErrors()
        if (toast) {
            toast.showSuccess(cleanErrorMessage(message))
        }
    }

    const handleApiError = (error, context = "") => {
        console.error(`Error en ${context}:`, error)

        // Si el error tiene fieldErrors, establecerlos
        if (error.fieldErrors && Object.keys(error.fieldErrors).length > 0) {
            setFieldErrors(error.fieldErrors)

            // Mostrar toast con el error principal
            if (toast) {
                const mainMessage = context
                    ? `${context}: ${cleanErrorMessage(error.message)}`
                    : cleanErrorMessage(error.message)
                toast.showError(mainMessage)
            }
        } else {
            // Solo error global
            if (toast) {
                const mainMessage = context
                    ? `${context}: ${cleanErrorMessage(error.message)}`
                    : cleanErrorMessage(error.message)
                toast.showError(mainMessage)
            }
        }
    }

    const setGlobalError = (message) => {
        if (toast) {
            toast.showError(cleanErrorMessage(message))
        }
    }

    return {
        errors,
        setFieldError,
        setFieldErrors,
        clearFieldError,
        clearAllErrors,
        setSuccess,
        handleApiError,
        setGlobalError,
    }
}
