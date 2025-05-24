"use client"

import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import "./edit.css"

function Edit() {
    const { userId } = useParams()
    const [userData, setUserData] = useState({
        monthlyIncome: 0,
    })
    const [fixedExpenses, setFixedExpenses] = useState([])
    const [variableExpenses, setVariableExpenses] = useState([])
    const [goals, setGoals] = useState([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [currentUserId, setCurrentUserId] = useState(null)

    const navigate = useNavigate()

    // Opciones de frecuencia para gastos fijos
    const frequencyOptions = [
        { value: "MONTHLY", label: "Mensual" },
        { value: "WEEKLY", label: "Semanal" },
        { value: "YEARLY", label: "Anual" },
        { value: "DAILY", label: "Diario" },
    ]

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("token")
            try {
                const resUser = await fetch("http://localhost:8080/api/users/me", {
                    headers: { Authorization: `Bearer ${token}` },
                })
                const user = await resUser.json()
                setCurrentUserId(user.id)
                setUserData({
                    monthlyIncome: user.monthlyIncome || 0,
                })

                const [resFixed, resVar, resGoals] = await Promise.all([
                    fetch(`http://localhost:8080/api/fixed-expenses/${user.id}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    fetch(`http://localhost:8080/api/variable-expenses/${user.id}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    fetch(`http://localhost:8080/api/goals/${user.id}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ])

                if (resFixed.ok) {
                    setFixedExpenses(await resFixed.json())
                }
                if (resVar.ok) {
                    setVariableExpenses(await resVar.json())
                }
                if (resGoals.ok) {
                    setGoals(await resGoals.json())
                }
            } catch (error) {
                console.error("Error fetching data:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    const handleDelete = async (type, id) => {
        const token = localStorage.getItem("token")

        if (id >= 1000000000000) {
            if (type === "fixed") {
                setFixedExpenses((prev) => prev.filter((e) => e.id !== id))
            } else if (type === "variable") {
                setVariableExpenses((prev) => prev.filter((e) => e.id !== id))
            } else if (type === "goal") {
                setGoals((prev) => prev.filter((e) => e.id !== id))
            }
            return
        }

        try {
            let endpoint = ""
            if (type === "fixed") endpoint = "fixed-expenses"
            else if (type === "variable") endpoint = "variable-expenses"
            else if (type === "goal") endpoint = "goals"

            const res = await fetch(`http://localhost:8080/api/${endpoint}/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            if (res.ok) {
                if (type === "fixed") {
                    setFixedExpenses((prev) => prev.filter((e) => e.id !== id))
                } else if (type === "variable") {
                    setVariableExpenses((prev) => prev.filter((e) => e.id !== id))
                } else if (type === "goal") {
                    setGoals((prev) => prev.filter((e) => e.id !== id))
                }
                alert("Elemento eliminado correctamente")
            } else {
                throw new Error("Error al eliminar")
            }
        } catch (error) {
            console.error("Error deleting:", error)
            alert("Error al eliminar el elemento")
        }
    }

    const handleAdd = (type) => {
        if (!currentUserId) {
            alert("Usuario no identificado. Recargando...")
            window.location.reload()
            return
        }
        const tempId = Date.now()

        if (type === "fixed") {
            setFixedExpenses((prev) => [
                ...prev,
                {
                    id: tempId,
                    name: "",
                    amount: 0,
                    frequency: "MONTHLY",
                    description: "",
                    userId: currentUserId,
                },
            ])
        } else if (type === "variable") {
            setVariableExpenses((prev) => [
                ...prev,
                {
                    id: tempId,
                    name: "",
                    amount: 0,
                    expenseDate: new Date().toISOString().split("T")[0],
                    description: "",
                    affectedGoalIds: [],
                    userId: currentUserId,
                },
            ])
        } else if (type === "goal") {
            setGoals((prev) => [
                ...prev,
                {
                    id: tempId,
                    name: "",
                    targetAmount: 0,
                    currentAmount: 0,
                    description: "",
                    userId: currentUserId,
                },
            ])
        }
    }

    const handleUpdateUser = async () => {
        const token = localStorage.getItem("token")
        if (!token) {
            alert("No estás autenticado. Por favor inicia sesión.")
            navigate("/login")
            return
        }

        try {
            const res = await fetch(`http://localhost:8080/api/users/${currentUserId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    monthlyIncome: userData.monthlyIncome,
                }),
            })

            if (!res.ok) {
                throw new Error("Error al actualizar los datos del usuario")
            }

            const updatedUser = await res.json()
            setUserData({
                monthlyIncome: updatedUser.monthlyIncome,
            })

            return updatedUser
        } catch (error) {
            console.error("Error updating user:", error)
            throw error
        }
    }

    const handleSaveItem = async (type, item) => {
        const token = localStorage.getItem("token")
        if (!token) {
            alert("No estás autenticado. Por favor inicia sesión.")
            navigate("/login")
            return
        }

        try {
            let endpoint = ""
            if (type === "fixed") endpoint = "fixed-expenses"
            else if (type === "variable") endpoint = "variable-expenses"
            else if (type === "goal") endpoint = "goals"

            let method = "PUT"
            let url = `http://localhost:8080/api/${endpoint}/${item.id}`

            if (item.id >= 1000000000000) {
                method = "POST"
                url = `http://localhost:8080/api/${endpoint}`
                const { id, ...itemWithoutId } = item
                item = { ...itemWithoutId, userId: currentUserId }
            }

            const res = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(item),
            })

            if (!res.ok) {
                throw new Error(`Error al ${method === "POST" ? "crear" : "actualizar"} ${endpoint}`)
            }

            const savedItem = await res.json()

            if (type === "fixed") {
                setFixedExpenses((prev) => prev.map((e) => (e.id === (item.id || savedItem.id) ? savedItem : e)))
            } else if (type === "variable") {
                setVariableExpenses((prev) => prev.map((e) => (e.id === (item.id || savedItem.id) ? savedItem : e)))
            } else if (type === "goal") {
                setGoals((prev) => prev.map((e) => (e.id === (item.id || savedItem.id) ? savedItem : e)))
            }

            return savedItem
        } catch (error) {
            console.error(`Error saving ${type}:`, error)
            throw error
        }
    }

    const handleSaveAll = async () => {
        setSaving(true)
        const token = localStorage.getItem("token")

        try {
            let hasErrors = false

            fixedExpenses.forEach((item) => {
                if (item.name && item.amount && !item.frequency) {
                    alert(`El gasto fijo "${item.name}" necesita una frecuencia.`)
                    hasErrors = true
                }
            })

            variableExpenses.forEach((item) => {
                if (item.name && item.amount && !item.expenseDate) {
                    alert(`El gasto variable "${item.name}" necesita una fecha.`)
                    hasErrors = true
                }
            })

            if (hasErrors) return

            const savePromises = []

            fixedExpenses.forEach((item) => {
                if (item.name && item.amount && item.frequency) {
                    savePromises.push(handleSaveItem("fixed", item))
                }
            })

            variableExpenses.forEach((item) => {
                if (item.name && item.amount && item.expenseDate) {
                    savePromises.push(handleSaveItem("variable", item))
                }
            })

            await handleUpdateUser()

            goals.forEach((item) => {
                if (item.name && item.targetAmount) {
                    savePromises.push(handleSaveItem("goal", item))
                }
            })

            await Promise.all(savePromises)
            alert("Todos los cambios se han guardado correctamente.")
            navigate(`/perfil/${currentUserId}`)
        } catch (error) {
            console.error("Error saving all:", error)
            alert("Error al guardar algunos cambios. Revisa la consola para más detalles.")
        } finally {
            setSaving(false)
        }
    }

    const updateField = (type, id, field, value) => {
        if (type === "fixed") {
            setFixedExpenses((prev) => prev.map((i) => (i.id === id ? { ...i, [field]: value } : i)))
        } else if (type === "variable") {
            setVariableExpenses((prev) => prev.map((i) => (i.id === id ? { ...i, [field]: value } : i)))
        } else if (type === "goal") {
            setGoals((prev) => prev.map((i) => (i.id === id ? { ...i, [field]: value } : i)))
        }
    }

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Cargando datos...</p>
            </div>
        )
    }

    return (
        <div className="edit-container">
            {/* Header */}
            <header className="edit-header">
                <div className="header-content">
                    <h1 className="page-title">✏️ Editar Finanzas</h1>
                    <button className="btn btn-outline" onClick={() => navigate(`/perfil/${currentUserId}`)}>
                        ← Volver al Perfil
                    </button>
                </div>
            </header>

            {/* Ingreso Mensual */}
            <section className="income-section">
                <div className="section-card">
                    <div className="card-header income-header">
                        <h2>💰 Ingreso Mensual</h2>
                    </div>
                    <div className="card-content">
                        <div className="income-form">
                            <div className="input-group">
                                <span className="input-prefix">€</span>
                                <input
                                    type="number"
                                    className="form-input"
                                    placeholder="Ingreso mensual"
                                    value={userData.monthlyIncome}
                                    onChange={(e) =>
                                        setUserData({
                                            ...userData,
                                            monthlyIncome: Number.parseFloat(e.target.value) || 0,
                                        })
                                    }
                                    min="0"
                                    step="0.01"
                                />
                            </div>
                            <button className="btn btn-primary" onClick={handleUpdateUser} disabled={saving}>
                                {saving ? "Guardando..." : "Actualizar Ingreso"}
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Gastos Fijos */}
            <section className="expenses-section">
                <div className="section-card">
                    <div className="card-header fixed-header">
                        <h2>🏠 Gastos Fijos</h2>
                    </div>
                    <div className="card-content">
                        <div className="expenses-list">
                            {fixedExpenses.map((exp) => (
                                <div key={exp.id} className="expense-row">
                                    <div className="form-group">
                                        <label>Nombre *</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            placeholder="Nombre del gasto"
                                            value={exp.name || ""}
                                            onChange={(e) => updateField("fixed", exp.id, "name", e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Cantidad *</label>
                                        <input
                                            type="number"
                                            className="form-input"
                                            placeholder="0.00"
                                            value={exp.amount || ""}
                                            onChange={(e) => updateField("fixed", exp.id, "amount", Number.parseFloat(e.target.value) || 0)}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Frecuencia *</label>
                                        <select
                                            className="form-select"
                                            value={exp.frequency || "MONTHLY"}
                                            onChange={(e) => updateField("fixed", exp.id, "frequency", e.target.value)}
                                            required
                                        >
                                            {frequencyOptions.map((option) => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Descripción</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            placeholder="Descripción opcional"
                                            value={exp.description || ""}
                                            onChange={(e) => updateField("fixed", exp.id, "description", e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <button className="btn btn-danger btn-small" onClick={() => handleDelete("fixed", exp.id)}>
                                            🗑️ Eliminar
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="btn btn-success add-btn" onClick={() => handleAdd("fixed")}>
                            ➕ Añadir Gasto Fijo
                        </button>
                    </div>
                </div>
            </section>

            {/* Gastos Variables */}
            <section className="expenses-section">
                <div className="section-card">
                    <div className="card-header variable-header">
                        <h2>🛒 Gastos Variables</h2>
                    </div>
                    <div className="card-content">
                        <div className="expenses-list">
                            {variableExpenses.map((exp) => (
                                <div key={exp.id} className="expense-row">
                                    <div className="form-group">
                                        <label>Nombre *</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            placeholder="Nombre del gasto"
                                            value={exp.name || ""}
                                            onChange={(e) => updateField("variable", exp.id, "name", e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Cantidad *</label>
                                        <input
                                            type="number"
                                            className="form-input"
                                            placeholder="0.00"
                                            value={exp.amount || ""}
                                            onChange={(e) =>
                                                updateField("variable", exp.id, "amount", Number.parseFloat(e.target.value) || 0)
                                            }
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Fecha *</label>
                                        <input
                                            type="date"
                                            className="form-input"
                                            value={exp.expenseDate || ""}
                                            onChange={(e) => updateField("variable", exp.id, "expenseDate", e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Descripción</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            placeholder="Descripción opcional"
                                            value={exp.description || ""}
                                            onChange={(e) => updateField("variable", exp.id, "description", e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <button className="btn btn-danger btn-small" onClick={() => handleDelete("variable", exp.id)}>
                                            🗑️ Eliminar
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="btn btn-success add-btn" onClick={() => handleAdd("variable")}>
                            ➕ Añadir Gasto Variable
                        </button>
                    </div>
                </div>
            </section>

            {/* Metas de Ahorro */}
            <section className="goals-section">
                <div className="section-card">
                    <div className="card-header goals-header">
                        <h2>🎯 Metas de Ahorro</h2>
                    </div>
                    <div className="card-content">
                        <div className="goals-list">
                            {goals.map((goal) => (
                                <div key={goal.id} className="goal-row">
                                    <div className="form-group">
                                        <label>Nombre *</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            placeholder="Nombre de la meta"
                                            value={goal.name || ""}
                                            onChange={(e) => updateField("goal", goal.id, "name", e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Meta (€) *</label>
                                        <input
                                            type="number"
                                            className="form-input"
                                            placeholder="0.00"
                                            value={goal.targetAmount || ""}
                                            onChange={(e) =>
                                                updateField("goal", goal.id, "targetAmount", Number.parseFloat(e.target.value) || 0)
                                            }
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Actual (€)</label>
                                        <input
                                            type="number"
                                            className="form-input"
                                            placeholder="0.00"
                                            value={goal.currentAmount || ""}
                                            onChange={(e) =>
                                                updateField("goal", goal.id, "currentAmount", Number.parseFloat(e.target.value) || 0)
                                            }
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Descripción</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            placeholder="Descripción opcional"
                                            value={goal.description || ""}
                                            onChange={(e) => updateField("goal", goal.id, "description", e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <button className="btn btn-danger btn-small" onClick={() => handleDelete("goal", goal.id)}>
                                            🗑️ Eliminar
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="btn btn-success add-btn" onClick={() => handleAdd("goal")}>
                            ➕ Añadir Meta
                        </button>
                    </div>
                </div>
            </section>

            {/* Botón de guardar */}
            <section className="save-section">
                <div className="save-card">
                    <button className="btn btn-primary btn-large save-btn" onClick={handleSaveAll} disabled={saving}>
                        {saving ? (
                            <>
                                <span className="spinner-small"></span>
                                Guardando...
                            </>
                        ) : (
                            <>💾 Guardar todos los cambios</>
                        )}
                    </button>
                </div>
            </section>
        </div>
    )
}

export default Edit
