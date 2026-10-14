import express from 'express'

const app = express()
app.use(express.json())

app.get('/api/saude', (req, res) => {
  res.json({ ok: true })
})

app.listen(3000, () => {
  console.log('API em http://localhost:3000')
})