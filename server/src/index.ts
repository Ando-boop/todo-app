import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { PrismaClient } from './generated/prisma/client'

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(
    cors({
        origin: 'http://localhost:5173',
        credentials: true,
    })
)

const prisma = new PrismaClient()

app.get('/', async(req, res) => {
    const userCount = await prisma.user.count()
    res.json({status: 'alive', user: userCount})
})

app.listen(4000, () => console.log('API on http://localhost:4000'))

