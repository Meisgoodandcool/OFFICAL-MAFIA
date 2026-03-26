export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { password } = req.body
  if (password === process.env.2363564) {
    return res.json({ role: 'hicom' })
  }
  if (password === process.env.52345673) {
    return res.json({ role: 'staff' })
  }
  return res.json({ role: null })
}
