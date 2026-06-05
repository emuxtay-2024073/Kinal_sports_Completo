import { useState } from "react"
import { useForm } from "react-hook-form"
import { register as registerRequest } from "../../../shared/apis/auth.js"
import { showError, showSuccess } from "../../../shared/utils/toast.js"

export const RegisterForm = ({ onSwitch }) => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm()

    const onSubmit = async (data) => {
        try {
            setLoading(true)
            setError(null)

            await registerRequest(data)
            showSuccess("Usuario registrado correctamente. Ahora puedes iniciar sesión.")
            onSwitch()
        } catch (err) {
            const message = err.response?.data?.message || "Error al registrar el usuario"
            setError(message)
            showError(message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-800 mb-1.5">
                        Nombre
                    </label>
                    <input
                        type="text"
                        id="name"
                        placeholder="Nombre"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        {...register("name", { required: "Este campo es obligatorio" })}
                    />
                    {errors.name && (
                        <p className="text-red-600 text-xs mt-1">{errors.name.message}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="surname" className="block text-sm font-medium text-gray-800 mb-1.5">
                        Apellido
                    </label>
                    <input
                        type="text"
                        id="surname"
                        placeholder="Apellido"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        {...register("surname", { required: "Este campo es obligatorio" })}
                    />
                    {errors.surname && (
                        <p className="text-red-600 text-xs mt-1">{errors.surname.message}</p>
                    )}
                </div>
            </div>

            <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-800 mb-1.5">
                    Usuario
                </label>
                <input
                    type="text"
                    id="username"
                    placeholder="Nombre de usuario"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    {...register("username", { required: "Este campo es obligatorio" })}
                />
                {errors.username && (
                    <p className="text-red-600 text-xs mt-1">{errors.username.message}</p>
                )}
            </div>

            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-800 mb-1.5">
                    Email
                </label>
                <input
                    type="email"
                    id="email"
                    placeholder="correo@example.com"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    {...register("email", {
                        required: "Este campo es obligatorio",
                        pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: "Ingresa un email válido",
                        },
                    })}
                />
                {errors.email && (
                    <p className="text-red-600 text-xs mt-1">{errors.email.message}</p>
                )}
            </div>

            <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-800 mb-1.5">
                    Teléfono
                </label>
                <input
                    type="tel"
                    id="phone"
                    placeholder="88001234"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    {...register("phone", {
                        required: "Este campo es obligatorio",
                        minLength: { value: 8, message: "Debe tener 8 dígitos" },
                        maxLength: { value: 8, message: "Debe tener 8 dígitos" },
                    })}
                />
                {errors.phone && (
                    <p className="text-red-600 text-xs mt-1">{errors.phone.message}</p>
                )}
            </div>

            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-800 mb-1.5">
                    Contraseña
                </label>
                <input
                    type="password"
                    id="password"
                    placeholder="* * * * * * * *"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    {...register("password", {
                        required: "Este campo es obligatorio",
                        minLength: { value: 8, message: "Mínimo 8 caracteres" },
                    })}
                />
                {errors.password && (
                    <p className="text-red-600 text-xs mt-1">{errors.password.message}</p>
                )}
            </div>

            {error && <p className="text-red-600 text-sm text-center">{error}</p>}

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-main-blue hover:opacity-90 text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 text-sm"
            >
                {loading ? "Registrando..." : "Registrarme"}
            </button>

            <p className="text-center text-sm">
                ¿Ya tienes cuenta?{' '}
                <button
                    type="button"
                    onClick={onSwitch}
                    className='text-main-blue hover:underline hover:cursor-pointer'
                >
                    Iniciar Sesión
                </button>
            </p>
        </form>
    )
}
