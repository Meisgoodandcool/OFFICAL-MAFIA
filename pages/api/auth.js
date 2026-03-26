export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  
  try {
    const { password } = req.body
    const hicom = process.env.HICOM_PASSWORD
    const staff = process.env.STAFF_PASSWORD

    if (password === hicom) {
      return res.status(200).json({ role: 'hicom' })
    }
    if (password === staff) {
      return res.status(200).json({ role: 'staff' })
    }
    return res.status(200).json({ role: null })
  } catch (err) {
    return res.status(500).json({ role: null, error: err.message })
  }
}
