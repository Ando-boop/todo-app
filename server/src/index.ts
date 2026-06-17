import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { PrismaClient } from './generated/prisma/client'
import type { Request, Response, NextFunction} from "express";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}))


const SECRET = 'change-me-later'
const prisma = new PrismaClient()


function setAuthCookie(res: Response, userId: number){
    const token = jwt.sign({userId}, SECRET, {expiresIn: '7d'})
    res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    })
}

function requireAuth(req: Request, res: Response, next: NextFunction) {
    try {
        const {userId} = jwt.verify(req.cookies.token, SECRET) as {userId: number}
        ;(req as any).userId = userId
        next()
    } catch {
        res.status(401).json({error: 'Not Authenticated'})
    }
}

app.post('/api/signup', async (req, res) => {
    const {email, password} = req.body
    if (!email || !password) {
        return res.status(400).json({error: 'email and password required'})
    }

    const existing = await prisma.user.findUnique({where: {email}})
    if(existing) {
        return res.status(409).json({error: 'email already in use'})
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
        data: {
            email,
            passwordHash,
            folders: {create: {name: 'My Todos'} },
        },
        include: {folders: true}
    })
})

app.post('/api/login', async(req,res) => {
    const {email, password} = req.body
    if (!email || !password) {
        return res.status(400).json({error: 'email and password required'})
    }

    const user = await prisma.user.findUnique({where: {email}})
    if (!user) {
        return res.status(401).json({error: 'Invalid email or password'})
    }

    const ok = await bcrypt.compare(password, user.passwordHash)
    if (!ok) {
        return res.status(401).json({error: 'Invalid email or password'})
    }

    setAuthCookie(res, user.id)
    res.json({id: user.id, email: user.email})
})

app.get('/', async(req, res) => {
    const userCount = await prisma.user.count()
    res.json({status: 'alive', user: userCount})
})




app.listen(4000, () => console.log('API on http://localhost:4000'))

