import express from 'express'
const app = express()
app.use(express.json())
app.get('/api/health', (req, res) => res.json({ok: true}))
app.listen(4000, () => console.log('API on http://localhost:4000'))