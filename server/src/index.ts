import express from 'express'
import type { Request, Response, NextFunction } from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { PrismaClient } from './generated/prisma/client'

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(
    cors({
        origin: 'http://localhost:5173', // Vite dev server
        credentials: true,               // allow the auth cookie through
    })
)

const prisma = new PrismaClient()
const SECRET = 'change-me-later' // TODO: move to process.env.JWT_SECRET before deploying

// Anything past this middleware has a verified req.userId.
function requireAuth(req: Request, res: Response, next: NextFunction) {
    try {
        const { userId } = jwt.verify(req.cookies.token, SECRET) as { userId: number }
        ;(req as any).userId = userId
        next()
    } catch {
        res.status(401).json({ error: 'Not authenticated' })
    }
}

function setAuthCookie(res: Response, userId: number) {
    const token = jwt.sign({ userId }, SECRET, { expiresIn: '7d' })
    res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })
}

// ── AUTH ────────────────────────────────────────────────
app.post('/api/signup', async (req: Request, res: Response) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required' })
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
        return res.status(409).json({ error: 'Email already in use' })
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
        data: {
            email,
            passwordHash,
            // give every new account a starting folder
            folders: { create: { name: 'My Todos' } },
        },
        include: { folders: true },
    })

    setAuthCookie(res, user.id)
    res.json({ id: user.id, email: user.email, folders: user.folders })
})

app.post('/api/login', async (req: Request, res: Response) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required' })
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' })
    }

    const ok = await bcrypt.compare(password, user.passwordHash)
    if (!ok) {
        return res.status(401).json({ error: 'Invalid email or password' })
    }

    setAuthCookie(res, user.id)
    res.json({ id: user.id, email: user.email })
})

app.post('/api/logout', (_req: Request, res: Response) => {
    res.clearCookie('token')
    res.json({ ok: true })
})

// Lets the frontend check "am I still logged in?" on page load.
app.get('/api/me', requireAuth, async (req: Request, res: Response) => {
    const userId = (req as any).userId as number
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, email: true },
    })
    res.json(user)
})

// ── FOLDERS ─────────────────────────────────────────────
app.get('/api/folders', requireAuth, async (req: Request, res: Response) => {
    const userId = (req as any).userId as number
    const folders = await prisma.folder.findMany({ where: { userId } })
    res.json(folders)
})

app.post('/api/folders', requireAuth, async (req: Request, res: Response) => {
    const userId = (req as any).userId as number
    const { name } = req.body
    if (!name?.trim()) {
        return res.status(400).json({ error: 'Folder name required' })
    }
    const folder = await prisma.folder.create({
        data: { name: name.trim(), userId },
    })
    res.json(folder)
})

app.delete('/api/folders/:id', requireAuth, async (req: Request, res: Response) => {
    const userId = (req as any).userId as number
    const id = Number(req.params.id)
    // remove the folder's todos first to satisfy the foreign key
    await prisma.todo.deleteMany({ where: { folderId: id, userId } })
    await prisma.folder.deleteMany({ where: { id, userId } })
    res.json({ ok: true })
})

// ── TODOS ───────────────────────────────────────────────
app.get('/api/todos', requireAuth, async (req: Request, res: Response) => {
    const userId = (req as any).userId as number
    const todos = await prisma.todo.findMany({ where: { userId } })
    res.json(todos)
})

app.post('/api/todos', requireAuth, async (req: Request, res: Response) => {
    const userId = (req as any).userId as number
    const { text, folderId } = req.body
    if (!text?.trim() || !folderId) {
        return res.status(400).json({ error: 'text and folderId required' })
    }
    const todo = await prisma.todo.create({
        data: { text: text.trim(), folderId: Number(folderId), userId },
    })
    res.json(todo)
})

app.put('/api/todos/:id', requireAuth, async (req: Request, res: Response) => {
    const userId = (req as any).userId as number
    const id = Number(req.params.id)
    const { text } = req.body
    // updateMany scopes by userId so people can only edit their own todos
    await prisma.todo.updateMany({
        where: { id, userId },
        data: { text: text?.trim() ?? '' },
    })
    const todo = await prisma.todo.findUnique({ where: { id } })
    res.json(todo)
})

app.delete('/api/todos/:id', requireAuth, async (req: Request, res: Response) => {
    const userId = (req as any).userId as number
    const id = Number(req.params.id)
    await prisma.todo.deleteMany({ where: { id, userId } })
    res.json({ ok: true })
})

app.listen(4000, () => console.log('API on http://localhost:4000'))
