import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAuthStore } from '@/stores/useAuthStore'

/**
 * Activity store — the activity records everything else is computed from.
 *
 * Terms (same as production / Salesforce):
 *   recordType   — Sales | Pre-Sales | Marketing
 *   activityType — sub-type, depends on recordType (see ACTIVITY_TYPES)
 *   stage        — Completed | Date Confirmed (derived from the date on create)
 *
 * Companies are referenced by id (see useDirectoryStore).
 *
 * TODO: Replace mock data with:
 *   GET  /api/activities?scope=my|team&q=&recordType=&stage=&from=&to=&page=
 *   POST /api/activities
 *   GET  /api/activities/:id
 */

export const RECORD_TYPES = ['Sales', 'Pre-Sales', 'Marketing']
export const STAGES = ['Completed', 'Date Confirmed']

/** Activity sub-types per record type — mirrors production. */
export const ACTIVITY_TYPES = {
  Sales: ['Account Intelligence', 'Business Review', 'Customer Success', 'New Partner Onboarding', 'Sales Enablement', 'Pipeline Activity'],
  'Pre-Sales': ['Demo/Portfolio Overview', 'Risk Assessment', 'Partner Enablement', 'Sales Enablement', 'Pipeline Activity', 'Qualification Call', 'Scoping Call', 'Vendor Assessment', 'Webinar'],
  Marketing: ['Marketing Enablement', 'Pipeline Activity', 'Webinar'],
}

/** Points awarded per record type when an activity is logged. */
export const POINTS = { Sales: 50, 'Pre-Sales': 30, Marketing: 20 }

const ME = 'Nikola Gavric'

// Compact mock builder. Descriptions are illustrative, not real customer notes.
const a = (id, recordType, activityType, date, vendors, reseller, endUsers, stage, pipelineValue, createdBy, description, nextStep, extra = {}) => ({
  id, recordType, activityType, date, vendors, reseller, endUsers, stage, pipelineValue,
  points: POINTS[recordType], createdBy, attendees: [createdBy], description, nextStep,
  opportunity: null, followUpOf: null, createdAt: `${date}T10:00:00Z`, ...extra,
})

const MOCK_ACTIVITIES = [
  // ── Mine ──────────────────────────────────────────────────────────────────
  a('act_001', 'Sales', 'Business Review', '2026-09-25', ['v-crowdstrike'], 'r-ignition', ['e-acme'], 'Completed', 45000, ME,
    'Demo of the Falcon platform to the CISO team. Strong interest in the EDR module and managed threat hunting.',
    'Follow up with a pricing proposal by end of week.', { opportunity: 'OPP-10421 · Acme EDR refresh' }),
  a('act_002', 'Pre-Sales', 'Qualification Call', '2026-10-05', ['v-abnormal'], 'r-ignition', ['e-beta'], 'Date Confirmed', 22000, ME,
    'Technical discovery call. Reviewed email security posture and current gateway setup.',
    'Schedule POC environment setup.'),

  // ── Team, this week ──────────────────────────────────────────────────────
  a('act_101', 'Sales', 'Pipeline Activity', '2026-10-01', ['v-sailpoint'], 'r-softcat', ['e-northwind'], 'Completed', 0, 'Darren Goswell',
    'Intro call between the Softcat account team and SailPoint to discuss an identity governance opportunity at Northwind Health.',
    'SailPoint and Softcat to build a discovery workshop on identity governance use cases.'),
  a('act_102', 'Sales', 'Business Review', '2026-09-28', ['v-sailpoint'], null, [], 'Completed', 0, 'Stefan Gessner',
    'Meeting with the SailPoint account team in Düsseldorf.',
    'Account planning sessions for Q4.'),
  a('act_103', 'Sales', 'Customer Success', '2026-09-30', ['v-crowdstrike', 'v-mimecast'], 'r-bytes', ['e-fabrikam'], 'Completed', 0, 'Shane Rogers',
    'Introduction to a senior security specialist in the Bytes team who leads cyber for the public sector unit.',
    'Follow-up call to agree how we work together on joint targets.'),
  a('act_104', 'Pre-Sales', 'Demo/Portfolio Overview', '2026-10-06', ['v-netskope'], 'r-computacenter', ['e-contoso'], 'Date Confirmed', 38000, 'Wolfgang Hohenthanner',
    'Portfolio overview for Contoso Bank security architecture team.',
    'Run a Netskope SSE demo with the network team.'),
  a('act_105', 'Sales', 'Account Intelligence', '2026-09-29', ['v-abnormal'], 'r-softcat', ['e-litware'], 'Completed', 18000, 'Wolfgang Hohenthanner',
    'Mapped Litware renewal dates against the Softcat customer base.',
    'Share target list with the Softcat inside sales team.'),
  a('act_106', 'Marketing', 'Webinar', '2026-09-30', ['v-mimecast'], null, [], 'Completed', 0, 'Darren Goswell',
    'Joint webinar on email resilience with Mimecast — 84 registrations, 41 attendees.',
    'Send follow-ups and recording to attendees.'),
  a('act_107', 'Sales', 'Pipeline Activity', '2026-10-08', ['v-crowdstrike'], 'r-bechtle', ['e-tailspin'], 'Date Confirmed', 52000, 'Chris Faulkner',
    'Bechtle brought in a Falcon Complete opportunity for Tailspin Toys.',
    'Scoping call with CrowdStrike SE booked for next week.'),
  a('act_108', 'Pre-Sales', 'Scoping Call', '2026-09-29', ['v-netskope'], 'r-scc', ['e-northwind'], 'Completed', 15000, 'Shane Rogers',
    'Scoping call for a Netskope CASB rollout across 4,000 users.',
    'Prepare the statement of work.'),

  // ── Team, earlier this month / quarter ──────────────────────────────────
  a('act_110', 'Sales', 'Account Intelligence', '2026-09-24', ['v-abnormal'], 'r-softcat', ['e-acme'], 'Completed', 0, 'Amy Shingles',
    '400-user Softcat trading account with no email security add-on today.',
    'Shared battlecards with the Softcat account manager to target.'),
  a('act_111', 'Sales', 'Account Intelligence', '2026-09-24', ['v-abnormal'], 'r-softcat', ['e-beta'], 'Completed', 0, 'Amy Shingles',
    '100-user Softcat account, no prior UK history for the vendor.',
    'Shared battlecards with the Softcat account manager to target.'),
  a('act_112', 'Sales', 'Business Review', '2026-09-23', ['v-mimecast'], 'r-bytes', [], 'Completed', 0, 'Shane Rogers',
    'Quarterly business review with the Bytes cyber lead.',
    'Agree joint pipeline targets for Q4.'),
  a('act_113', 'Pre-Sales', 'Demo/Portfolio Overview', '2026-09-22', ['v-crowdstrike'], 'r-exclusive', [], 'Completed', 0, 'Arno van Doorn',
    'Supported the NetSec partner event with a portfolio stand.',
    'Follow up on leads generated at the event.'),
  a('act_114', 'Sales', 'Customer Success', '2026-09-29', ['v-mimecast'], 'r-computacenter', ['e-contoso'], 'Completed', 58259, 'Wolfgang Hohenthanner',
    'Drive renewal revenue for Contoso Bank.',
    'Prepare a proposal and quotation.'),
  a('act_115', 'Pre-Sales', 'Qualification Call', '2026-09-21', ['v-crowdstrike'], 'r-softcat', ['e-fabrikam'], 'Completed', 12000, 'Chris Faulkner',
    'Call with Softcat to discuss an SMB opportunity.',
    'Waiting on the customer to confirm dates for a scoping call.'),
  a('act_116', 'Sales', 'New Partner Onboarding', '2026-09-16', ['v-sailpoint'], 'r-scc', [], 'Completed', 0, 'Darren Goswell',
    'Onboarded SCC onto the SailPoint partner programme.',
    'Enablement session for SCC presales.'),

  // ── Earlier this year ────────────────────────────────────────────────────
  a('act_120', 'Sales', 'Pipeline Activity', '2026-08-14', ['v-crowdstrike'], 'r-softcat', ['e-acme'], 'Completed', 40000, 'Amy Shingles',
    'Pipeline review with the Softcat CrowdStrike champion.', 'Joint account plan for the top 10 accounts.'),
  a('act_121', 'Pre-Sales', 'Risk Assessment', '2026-07-22', ['v-netskope'], 'r-computacenter', ['e-northwind'], 'Completed', 25000, 'Lewis Harman',
    'Shadow IT risk assessment for Northwind Health.', 'Present findings to the CIO.'),
  a('act_122', 'Marketing', 'Marketing Enablement', '2026-06-05', ['v-sentinelone'], 'r-bytes', [], 'Completed', 0, 'Arno van Doorn',
    'Marketing enablement session with the Bytes campaign team.', 'Launch a joint email campaign.'),
  a('act_123', 'Sales', 'Business Review', '2026-05-19', ['v-mimecast'], 'r-softcat', ['e-contoso'], 'Completed', 33000, 'Kim Paulsen',
    'Half-year business review.', 'Agree H2 targets.'),
  a('act_124', 'Sales', 'Customer Success', '2026-03-11', ['v-abnormal'], 'r-ignition', ['e-fabrikam'], 'Completed', 21000, 'Dominic Hammond',
    'Customer success check-in after go-live.', 'Expansion conversation in Q3.'),
  a('act_125', 'Sales', 'Pipeline Activity', '2026-02-03', ['v-crowdstrike'], 'r-computacenter', ['e-acme'], 'Completed', 60000, 'Amy Shingles',
    'New opportunity for an endpoint refresh.', 'Technical validation.'),
]

export const useActivityStore = defineStore('activity', () => {
  const auth = useAuthStore()

  const activities = ref([...MOCK_ACTIVITIES])
  const loading = ref(false)

  function getById(id) {
    return activities.value.find((x) => x.id === id) ?? null
  }

  /** Activities linked to a company (vendor, reseller or end user). */
  function forCompany(companyId) {
    return activities.value.filter((x) =>
      x.vendors.includes(companyId) || x.reseller === companyId || x.endUsers.includes(companyId))
  }

  /**
   * TODO: POST /api/activities — mock: adds locally and awards points.
   * Stage follows the date like production: future → Date Confirmed, past → Completed.
   */
  async function createActivity(payload) {
    loading.value = true
    await new Promise((r) => setTimeout(r, 500))
    const today = new Date().toISOString().slice(0, 10)
    const record = {
      id: `act_${Date.now()}`,
      ...payload,
      stage: payload.date > today ? 'Date Confirmed' : 'Completed',
      points: POINTS[payload.recordType] ?? 0,
      pipelineValue: payload.pipelineValue ?? 0,
      createdBy: auth.user?.name ?? ME,
      attendees: [auth.user?.name ?? ME],
      createdAt: new Date().toISOString(),
    }
    activities.value.unshift(record)
    auth.addPoints(record.points)
    loading.value = false
    return record
  }

  return {
    activities,
    loading,
    getById,
    forCompany,
    createActivity,
  }
})
