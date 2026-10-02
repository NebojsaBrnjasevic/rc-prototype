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

const ME = 'Luka Petrovic'

// Compact mock builder. Descriptions are illustrative, not real customer notes.
const a = (id, recordType, activityType, date, vendors, reseller, endUsers, stage, pipelineValue, createdBy, description, nextStep, extra = {}) => ({
  id, recordType, activityType, date, vendors, reseller, endUsers, stage, pipelineValue,
  points: POINTS[recordType], createdBy, attendees: [createdBy], description, nextStep,
  opportunity: null, followUpOf: null, createdAt: `${date}T10:00:00Z`, ...extra,
})

const MOCK_ACTIVITIES = [
  // ── Mine ──────────────────────────────────────────────────────────────────
  a('act_001', 'Sales', 'Business Review', '2026-09-25', ['v-sentrix'], 'r-northstar', ['e-acme'], 'Completed', 45000, ME,
    'Demo of the Sentrix platform to the CISO team. Strong interest in the EDR module and managed threat hunting.',
    'Follow up with a pricing proposal by end of week.', { opportunity: 'OPP-10421 · Acme EDR refresh' }),
  a('act_002', 'Pre-Sales', 'Qualification Call', '2026-10-05', ['v-inboxa'], 'r-northstar', ['e-beta'], 'Date Confirmed', 22000, ME,
    'Technical discovery call. Reviewed email security posture and current gateway setup.',
    'Schedule POC environment setup.'),

  // ── Team, this week ──────────────────────────────────────────────────────
  a('act_101', 'Sales', 'Pipeline Activity', '2026-10-01', ['v-identiq'], 'r-brightwave', ['e-northwind'], 'Completed', 0, 'Tom Whitaker',
    'Intro call between the Brightwave account team and IdentiQ to discuss an identity governance opportunity at Northwind Health.',
    'IdentiQ and Brightwave to build a discovery workshop on identity governance use cases.'),
  a('act_102', 'Sales', 'Business Review', '2026-09-28', ['v-identiq'], null, [], 'Completed', 0, 'Jonas Reiter',
    'Meeting with the IdentiQ account team in Düsseldorf.',
    'Account planning sessions for Q4.'),
  a('act_103', 'Sales', 'Customer Success', '2026-09-30', ['v-sentrix', 'v-mailguard'], 'r-kilobyte', ['e-fabrikam'], 'Completed', 0, 'Ciaran Doyle',
    'Introduction to a senior security specialist in the Kilobyte team who leads cyber for the public sector unit.',
    'Follow-up call to agree how we work together on joint targets.'),
  a('act_104', 'Pre-Sales', 'Demo/Portfolio Overview', '2026-10-06', ['v-skyedge'], 'r-compunet', ['e-contoso'], 'Date Confirmed', 38000, 'Lukas Brenner',
    'Portfolio overview for Contoso Bank security architecture team.',
    'Run a Skyedge SSE demo with the network team.'),
  a('act_105', 'Sales', 'Account Intelligence', '2026-09-29', ['v-inboxa'], 'r-brightwave', ['e-litware'], 'Completed', 18000, 'Lukas Brenner',
    'Mapped Litware renewal dates against the Brightwave customer base.',
    'Share target list with the Brightwave inside sales team.'),
  a('act_106', 'Marketing', 'Webinar', '2026-09-30', ['v-mailguard'], null, [], 'Completed', 0, 'Tom Whitaker',
    'Joint webinar on email resilience with Mailguard — 84 registrations, 41 attendees.',
    'Send follow-ups and recording to attendees.'),
  a('act_107', 'Sales', 'Pipeline Activity', '2026-10-08', ['v-sentrix'], 'r-kessler', ['e-tailspin'], 'Date Confirmed', 52000, 'James Holloway',
    'Kessler IT brought in a Sentrix MDR opportunity for Tailspin Toys.',
    'Scoping call with Sentrix SE booked for next week.'),
  a('act_108', 'Pre-Sales', 'Scoping Call', '2026-09-29', ['v-skyedge'], 'r-mcc', ['e-northwind'], 'Completed', 15000, 'Ciaran Doyle',
    'Scoping call for a Skyedge CASB rollout across 4,000 users.',
    'Prepare the statement of work.'),

  // ── Team, earlier this month / quarter ──────────────────────────────────
  a('act_110', 'Sales', 'Account Intelligence', '2026-09-24', ['v-inboxa'], 'r-brightwave', ['e-acme'], 'Completed', 0, 'Hannah Clarke',
    '400-user Brightwave trading account with no email security add-on today.',
    'Shared battlecards with the Brightwave account manager to target.'),
  a('act_111', 'Sales', 'Account Intelligence', '2026-09-24', ['v-inboxa'], 'r-brightwave', ['e-beta'], 'Completed', 0, 'Hannah Clarke',
    '100-user Brightwave account, no prior UK history for the vendor.',
    'Shared battlecards with the Brightwave account manager to target.'),
  a('act_112', 'Sales', 'Business Review', '2026-09-23', ['v-mailguard'], 'r-kilobyte', [], 'Completed', 0, 'Ciaran Doyle',
    'Quarterly business review with the Kilobyte cyber lead.',
    'Agree joint pipeline targets for Q4.'),
  a('act_113', 'Pre-Sales', 'Demo/Portfolio Overview', '2026-09-22', ['v-sentrix'], 'r-meridian', [], 'Completed', 0, 'Pieter de Vries',
    'Supported the partner security event with a portfolio stand.',
    'Follow up on leads generated at the event.'),
  a('act_114', 'Sales', 'Customer Success', '2026-09-29', ['v-mailguard'], 'r-compunet', ['e-contoso'], 'Completed', 58259, 'Lukas Brenner',
    'Drive renewal revenue for Contoso Bank.',
    'Prepare a proposal and quotation.'),
  a('act_115', 'Pre-Sales', 'Qualification Call', '2026-09-21', ['v-sentrix'], 'r-brightwave', ['e-fabrikam'], 'Completed', 12000, 'James Holloway',
    'Call with Brightwave to discuss an SMB opportunity.',
    'Waiting on the customer to confirm dates for a scoping call.'),
  a('act_116', 'Sales', 'New Partner Onboarding', '2026-09-16', ['v-identiq'], 'r-mcc', [], 'Completed', 0, 'Tom Whitaker',
    'Onboarded MCC onto the IdentiQ partner programme.',
    'Enablement session for MCC presales.'),

  // ── Earlier this year ────────────────────────────────────────────────────
  a('act_120', 'Sales', 'Pipeline Activity', '2026-08-14', ['v-sentrix'], 'r-brightwave', ['e-acme'], 'Completed', 40000, 'Hannah Clarke',
    'Pipeline review with the Brightwave Sentrix champion.', 'Joint account plan for the top 10 accounts.'),
  a('act_121', 'Pre-Sales', 'Risk Assessment', '2026-07-22', ['v-skyedge'], 'r-compunet', ['e-northwind'], 'Completed', 25000, 'Oliver Bennett',
    'Shadow IT risk assessment for Northwind Health.', 'Present findings to the CIO.'),
  a('act_122', 'Marketing', 'Marketing Enablement', '2026-06-05', ['v-vigilon'], 'r-kilobyte', [], 'Completed', 0, 'Pieter de Vries',
    'Marketing enablement session with the Kilobyte campaign team.', 'Launch a joint email campaign.'),
  a('act_123', 'Sales', 'Business Review', '2026-05-19', ['v-mailguard'], 'r-brightwave', ['e-contoso'], 'Completed', 33000, 'Freja Lindqvist',
    'Half-year business review.', 'Agree H2 targets.'),
  a('act_124', 'Sales', 'Customer Success', '2026-03-11', ['v-inboxa'], 'r-northstar', ['e-fabrikam'], 'Completed', 21000, 'Sam Fletcher',
    'Customer success check-in after go-live.', 'Expansion conversation in Q3.'),
  a('act_125', 'Sales', 'Pipeline Activity', '2026-02-03', ['v-sentrix'], 'r-compunet', ['e-acme'], 'Completed', 60000, 'Hannah Clarke',
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
