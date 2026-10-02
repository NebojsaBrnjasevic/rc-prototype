import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

/**
 * Admin store — users, Salesforce sync health and the audit log.
 *
 * TODO: Replace mock data with:
 *   GET  /api/admin/stats
 *   GET  /api/admin/users?search=&role=&status=&page=
 *   GET  /api/admin/syncs/failed
 *   POST /api/admin/syncs/:id/retry
 *   GET  /api/admin/audit?type=&page=
 */

// Totals across the whole org (the user list below is one page of it).
const STATS = {
  users: { total: 102, active: 92, admins: 4, managers: 19 },
  points: { total: 568_990, usersWithPoints: 98, purchases: 6, spent: 25_000, avgLevel: 6.5 },
}

const MOCK_USERS = [
  { id: 'u01', name: 'Amy Shingles',          email: 'amy.shingles@ignition.technology',     role: 'Manager', territory: 'Ignition - UK',      level: 22, points: 32_900, status: 'Active',   lastActive: '2 hours ago' },
  { id: 'u02', name: 'Lewis Harman',          email: 'lewis.harman@ignition.technology',     role: 'Member',  territory: 'Ignition - UK',      level: 22, points: 32_500, status: 'Active',   lastActive: '5 hours ago' },
  { id: 'u03', name: 'Arno van Doorn',        email: 'arno.vandoorn@ignition.technology',    role: 'Manager', territory: 'Ignition - Benelux', level: 21, points: 25_750, status: 'Active',   lastActive: 'yesterday' },
  { id: 'u04', name: 'Kim Paulsen',           email: 'kim.paulsen@ignition.technology',      role: 'Member',  territory: 'Ignition - Nordics', level: 16, points: 18_700, status: 'Active',   lastActive: 'yesterday' },
  { id: 'u05', name: 'Dominic Hammond',       email: 'dominic.hammond@ignition.technology',  role: 'Member',  territory: 'Ignition - UK',      level: 15, points: 14_750, status: 'Active',   lastActive: '3 days ago' },
  { id: 'u06', name: 'Wolfgang Hohenthanner', email: 'wolfgang.h@ignition.technology',       role: 'Manager', territory: 'Ignition - DACH',    level: 5,  points: 1_700,  status: 'Active',   lastActive: '1 hour ago' },
  { id: 'u07', name: 'Nikola Gavric',         email: 'nikola.gavric@devtechgroup.com',       role: 'Admin',   territory: 'Ignition - UK',      level: 3,  points: 710,    status: 'Active',   lastActive: 'now' },
  { id: 'u08', name: 'Darren Goswell',        email: 'darren.goswell@ignition.technology',   role: 'Member',  territory: 'Ignition - UK',      level: 4,  points: 1_150,  status: 'Active',   lastActive: '4 hours ago' },
  { id: 'u09', name: 'Shane Rogers',          email: 'shane.rogers@ignition.technology',     role: 'Member',  territory: 'Ignition - Ireland', level: 10, points: 5_600,  status: 'Active',   lastActive: '2 days ago' },
  { id: 'u10', name: 'Chris Faulkner',        email: 'chris.faulkner@ignition.technology',   role: 'Member',  territory: 'Ignition - UK',      level: 15, points: 14_100, status: 'Inactive', lastActive: '3 weeks ago' },
  { id: 'u11', name: 'Stefan Gessner',        email: 'stefan.gessner@ignition.technology',   role: 'Member',  territory: 'Ignition - DACH',    level: 4,  points: 1_000,  status: 'Active',   lastActive: '6 days ago' },
]

const MOCK_FAILED_SYNCS = [
  { id: 's1', title: 'Meeting with Alem Sistem regarding ongoing projects (Fedja). As for BH Telekom, the tender is expected to be issued in August…', error: 'Failed to create Sales Activity: <html><body><center>We are down for maintenance.</center></body></html>', ago: '14 days ago' },
  { id: 's2', title: 'CISO.bg - podcast. Presentor - Presales engineer from CRWD + Presales Engineer from EXN (Rafal)', error: 'Failed to create Sales Activity: [{"message":"bad value for restricted picklist field: Ignition - CEE","errorCode":"INVALID_OR_NULL_FOR_RESTRICTED_PICKLIST","fields":["Territory__c"]}]', ago: '6 months ago' },
  { id: 's3', title: 'On-site event organized by Cyber Club Bulgaria, gathering together the cybersecurity community at one place (around 500 participants).', error: 'Failed to create Sales Activity: [{"message":"bad value for restricted picklist field: Ignition - CEE","errorCode":"INVALID_OR_NULL_FOR_RESTRICTED_PICKLIST","fields":["Territory__c"]}]', ago: '6 months ago' },
  { id: 's4', title: 'Cyber Security Talks Bulgaria - onsite event dedicated to Crowdstrike', error: 'Failed to create Sales Activity: [{"message":"bad value for restricted picklist field: Ignition - CEE","errorCode":"INVALID_OR_NULL_FOR_RESTRICTED_PICKLIST","fields":["Territory__c"]}]', ago: '6 months ago' },
  { id: 's5', title: 'End Customer Event - Protecting Your Organization in the Era of AI-Powered Adversaries', error: 'Failed to create Sales Activity: [{"message":"bad value for restricted picklist field: Ignition - CEE","errorCode":"INVALID_OR_NULL_FOR_RESTRICTED_PICKLIST","fields":["Territory__c"]}]', ago: '6 months ago' },
  { id: 's6', title: 'Example new partner onboarding - updated', error: 'The requested resource does not exist', ago: '6 months ago' },
  { id: 's7', title: 'Failed Activity Sync Test - Example Example', error: 'Failed to create Sales Activity: [{"message":"No such column \'Related_Opportunity__c\' on object of type Sales_Activity__c","errorCode":"INVALID_FIELD"}]', ago: '6 months ago' },
  { id: 's8', title: 'I sent the follow ups to the subscribers of the Mimecast webinar 26-02-2026', error: 'Failed to create Sales Activity: [{"message":"bad value for restricted picklist field: Ignition - Italy","errorCode":"INVALID_OR_NULL_FOR_RESTRICTED_PICKLIST","fields":["Territory__c"]}]', ago: '7 months ago' },
]

const MOCK_AUDIT = [
  { id: 'e01', type: 'activity.sync_success', entity: 'activity · 1a3411fd…', actor: 'System',                time: 'about 17 hours ago' },
  { id: 'e02', type: 'activity.created',      entity: 'activity · 1a3411fd…', actor: 'Wolfgang Hohenthanner', time: 'about 17 hours ago' },
  { id: 'e03', type: 'activity.sync_success', entity: 'activity · e9b7f49e…', actor: 'System',                time: 'about 19 hours ago' },
  { id: 'e04', type: 'activity.created',      entity: 'activity · e3b7f49e…', actor: 'Darren Goswell',        time: 'about 19 hours ago' },
  { id: 'e05', type: 'activity.sync_success', entity: 'activity · 93b6e90f…', actor: 'System',                time: 'about 20 hours ago' },
  { id: 'e06', type: 'reward.claimed',        entity: 'daily bonus · +50 pts', actor: 'Shane Rogers',         time: 'about 21 hours ago' },
  { id: 'e07', type: 'user.role_changed',     entity: 'user · Arno van Doorn → Manager', actor: 'Nikola Gavric', time: 'yesterday' },
  { id: 'e08', type: 'activity.sync_failed',  entity: 'activity · 7c21aa03…', actor: 'System',                time: '14 days ago' },
  { id: 'e09', type: 'user.created',          entity: 'user · Stefan Gessner', actor: 'Nikola Gavric',        time: '3 weeks ago' },
]

/** Turn a raw Salesforce error into a short, human label + a group key. */
export function describeSyncError(raw = '') {
  if (/maintenance/i.test(raw)) return { key: 'maintenance', label: 'Salesforce was down for maintenance', hint: 'Usually safe to retry.' }
  const picklist = raw.match(/restricted picklist field: ([^"]+)"/)
  if (picklist) return { key: `picklist:${picklist[1]}`, label: `Territory "${picklist[1]}" isn't allowed in Salesforce`, hint: 'Add the value to the Territory__c picklist, then retry.' }
  const column = raw.match(/No such column '([^']+)'/)
  if (column) return { key: `column:${column[1]}`, label: `Salesforce field ${column[1]} is missing`, hint: 'Field mapping is out of date.' }
  if (/does not exist/i.test(raw)) return { key: 'not-found', label: 'Linked Salesforce record no longer exists', hint: 'Relink or delete the activity.' }
  return { key: 'other', label: 'Unknown sync error', hint: '' }
}

export const AUDIT_TYPES = {
  'activity.created':      { label: 'Activity created',   tone: 'brand' },
  'activity.sync_success': { label: 'Synced to Salesforce', tone: 'success' },
  'activity.sync_failed':  { label: 'Sync failed',        tone: 'warning' },
  'reward.claimed':        { label: 'Reward claimed',     tone: 'reward' },
  'user.created':          { label: 'User created',       tone: 'neutral' },
  'user.role_changed':     { label: 'Role changed',       tone: 'neutral' },
}

export const useAdminStore = defineStore('admin', () => {
  const stats = ref(STATS)
  const users = ref([...MOCK_USERS])
  const failedSyncs = ref(MOCK_FAILED_SYNCS.map((s) => ({ ...s, ...describeSyncError(s.error), retrying: false })))
  const auditLog = ref([...MOCK_AUDIT])
  const salesforce = ref({ status: 'unchecked', checkedAt: null }) // 'unchecked' | 'checking' | 'ok' | 'error'

  /** Failed syncs grouped by root cause — fix the cause once, retry the group. */
  const syncErrorGroups = computed(() => {
    const groups = {}
    failedSyncs.value.forEach((s) => {
      groups[s.key] ??= { key: s.key, label: s.label, hint: s.hint, items: [] }
      groups[s.key].items.push(s)
    })
    return Object.values(groups).sort((a, b) => b.items.length - a.items.length)
  })

  // TODO: POST /api/admin/syncs/:id/retry — mock: succeeds only for maintenance errors
  async function retrySync(id) {
    const sync = failedSyncs.value.find((s) => s.id === id)
    if (!sync || sync.retrying) return
    sync.retrying = true
    await new Promise((r) => setTimeout(r, 900))
    sync.retrying = false
    if (sync.key === 'maintenance') {
      failedSyncs.value = failedSyncs.value.filter((s) => s.id !== id)
      auditLog.value.unshift({ id: `e${Date.now()}`, type: 'activity.sync_success', entity: `activity · retry ${id}`, actor: 'System', time: 'just now' })
    }
  }

  async function retryGroup(key) {
    const ids = failedSyncs.value.filter((s) => s.key === key).map((s) => s.id)
    await Promise.all(ids.map(retrySync))
  }

  // TODO: GET /api/admin/salesforce/health
  async function checkSalesforce() {
    salesforce.value = { status: 'checking', checkedAt: null }
    await new Promise((r) => setTimeout(r, 1000))
    salesforce.value = { status: 'ok', checkedAt: new Date() }
  }

  return {
    stats,
    users,
    failedSyncs,
    syncErrorGroups,
    auditLog,
    salesforce,
    retrySync,
    retryGroup,
    checkSalesforce,
  }
})
