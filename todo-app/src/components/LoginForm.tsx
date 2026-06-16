import { type FormEvent, useState} from "react";
import type { LoginFormProps } from "../types/LoginFormProps.ts";

function LoginForm({onLogin}: LoginFormProps) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    async function handleSubmit(e: FormEvent) {
        e.preventDefault()
        setError('')

        const trimmedEmail = email.trim()
        if (!trimmedEmail || !password) return

        try {
            await onLogin(trimmedEmail, password)
        } catch {
            setError('Invalid email or password')
        }
    }

    return (
        <form>
            <input
                type="email"
                placeholder="Email"
                value={email}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
            />

            {error && <p className="login-error">{error}</p>}

            <button type="submit">Log in</button>
        </form>
    );
}

export default LoginForm
