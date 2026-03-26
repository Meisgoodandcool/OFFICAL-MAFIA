import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: 'https://resolved-buzzard-84776.upstash.io',
  token: 'ggAAAAAAAUsoAAIgcDG3GtVYv7BEZOb4Nl9mR1kIwYGoRtlIthVQ1h8qiFLGWg',
})

export async function getAllStaff() {
  const keys = await redis.smembers('staff:all')
  if (!keys || keys.length === 0) return []
  const members = await Promise.all(keys.map(id => redis.hgetall(`staff:${id}`)))
  return members.filter(Boolean)
}

export async function getStaffById(id) {
  return await redis.hgetall(`staff:${id}`)
}

export async function createStaff(member) {
  const id = `${Date.now()}`
  const data = { ...member, id, createdAt: new Date().toISOString(), infractions: '[]', tasks: '[]', reports: '[]' }
  await redis.hmset(`staff:${id}`, data)
  await redis.sadd('staff:all', id)
  return data
}

export async function updateStaff(id, updates) {
  await redis.hmset(`staff:${id}`, updates)
  return await redis.hgetall(`staff:${id}`)
}

export async function deleteStaff(id) {
  await redis.del(`staff:${id}`)
  await redis.srem('staff:all', id)
}

export async function addInfraction(staffId, infraction) {
  const member = await getStaffById(staffId)
  if (!member) return null
  const infractions = JSON.parse(member.infractions || '[]')
  infractions.push({ ...infraction, id: Date.now(), date: new Date().toISOString() })
  await redis.hset(`staff:${staffId}`, { infractions: JSON.stringify(infractions) })
  return infractions
}

export async function addTask(staffId, task) {
  const member = await getStaffById(staffId)
  if (!member) return null
  const tasks = JSON.parse(member.tasks || '[]')
  tasks.push({ ...task, id: Date.now(), date: new Date().toISOString(), status: 'pending' })
  await redis.hset(`staff:${staffId}`, { tasks: JSON.stringify(tasks) })
  return tasks
}

export async function updateTaskStatus(staffId, taskId, status) {
  const member = await getStaffById(staffId)
  if (!member) return null
  const tasks = JSON.parse(member.tasks || '[]')
  const idx = tasks.findIndex(t => t.id == taskId)
  if (idx !== -1) tasks[idx].status = status
  await redis.hset(`staff:${staffId}`, { tasks: JSON.stringify(tasks) })
  return tasks
}

export async function addReport(staffId, report) {
  const member = await getStaffById(staffId)
  if (!member) return null
  const reports = JSON.parse(member.reports || '[]')
  reports.push({ ...report, id: Date.now(), date: new Date().toISOString(), status: 'open' })
  await redis.hset(`staff:${staffId}`, { reports: JSON.stringify(reports) })
  return reports
}
