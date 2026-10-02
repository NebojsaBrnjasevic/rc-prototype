import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useActivityStore } from '@/stores/useActivityStore'

/**
 * Directory store — vendors, resellers and end users.
 *
 * Company stats (activities, last activity, dominant signal, partners, trending)
 * are computed from the activity store, so the directory never disagrees with it.
 *
 * TODO: Replace mock data with:
 *   GET  /api/companies?kind=vendor|reseller|end-user&q=&page=
 *   GET  /api/companies/:kind/:id
 *   POST /api/companies/:kind        — created in Salesforce
 */

export const KINDS = {
  vendor:   { label: 'Vendors',   singular: 'Vendor',   route: 'vendor' },
  reseller: { label: 'Resellers', singular: 'Reseller', route: 'reseller' },
  endUser:  { label: 'End users', singular: 'End user', route: 'end-user' },
}
export const KIND_FROM_ROUTE = { vendor: 'vendor', reseller: 'reseller', 'end-user': 'endUser' }

export const FOCUS_LEVELS = ['P1 - Focused', 'P2 - Tail', 'P3 - Unmanaged']
export const SOURCED_BY = ['Sales', 'N/A']

const v = (id, name, website, category, territories, regions) =>
  ({ id, kind: 'vendor', name, website, category, territories, regions, status: 'Active', salesforceId: `a078d0000${id.slice(2, 8).toUpperCase()}AA` })
const r = (id, name, website, recordType, focusLevel = 'P2 - Tail') =>
  ({ id, kind: 'reseller', name, website, recordType, focusLevel, status: 'Active', territories: [], regions: [], salesforceId: `0018d0000${id.slice(2, 8).toUpperCase()}AA` })
const e = (id, name, website) =>
  ({ id, kind: 'endUser', name, website, status: 'Active', territories: [], regions: [], salesforceId: `0018d0001${id.slice(2, 8).toUpperCase()}AA` })

const MOCK_COMPANIES = [
  // Vendors
  v('v-sentrix', 'Sentrix', 'www.sentrix.com', 'XDR', ['UK', 'DACH', 'Benelux', 'Nordics', 'France'], ['EMEA North', 'EMEA Central', 'EMEA South', 'UK&I', 'DACH', 'Benelux', 'Nordics']),
  v('v-inboxa', 'Inboxa AI', 'www.inboxa.example', 'Email Security', ['UK', 'DACH'], ['UK&I', 'DACH']),
  v('v-mailguard', 'Mailguard', 'www.mailguard.com', 'Email Security', ['UK', 'Benelux', 'Nordics'], ['UK&I', 'Benelux', 'Nordics']),
  v('v-identiq', 'IdentiQ', 'www.identiq.com', 'Identity Governance', ['UK', 'DACH'], ['UK&I', 'DACH']),
  v('v-skyedge', 'Skyedge', 'www.skyedge.com', 'SSE', ['UK', 'France'], ['UK&I', 'France']),
  v('v-vigilon', 'Vigilon', 'www.vigilon.com', 'XDR', ['UK'], ['UK&I']),
  v('v-saaswatch', 'SaaSwatch', 'www.saaswatch.com', 'SaaS Security', ['UK'], ['UK&I']),
  v('v-assetra', 'Assetra', 'www.assetra.com', 'Asset Management', ['UK', 'DACH'], ['UK&I', 'DACH']),
  v('v-privara', 'Privara', 'www.privara.com', 'PAM', ['UK'], ['UK&I']),
  v('v-surfacely', 'Surfacely', 'www.surfacely.com', 'Attack Surface', ['UK'], ['UK&I']),
  v('v-plantshield', 'Plantshield', 'www.plantshield.com', 'OT Security', ['DACH'], ['DACH']),
  v('v-datahaven', 'Datahaven', 'www.datahaven.com', 'Data Security', ['UK'], ['UK&I']),
  v('v-vaultline', 'Vaultline', 'www.vaultline.com', 'PAM', ['UK', 'Nordics'], ['UK&I', 'Nordics']),
  v('v-backstack', 'Backstack', 'www.backstack.com', 'Backup', ['UK'], ['UK&I']),
  v('v-logbeam', 'Logbeam', 'www.logbeam.com', 'SIEM', ['UK'], ['UK&I']),
  v('v-segmenta', 'Segmenta', 'www.segmenta.com', 'Segmentation', ['UK', 'France'], ['UK&I', 'France']),
  v('v-appwall', 'Appwall', 'www.appwall.com', 'Application Security', ['UK'], ['UK&I']),
  v('v-nimbus', 'Nimbus Security', 'www.nimbus.example', 'Cloud Security', ['UK'], ['UK&I']),
  v('v-idarmor', 'Idarmor', 'www.idarmor.com', 'Identity Protection', ['UK', 'DACH'], ['UK&I', 'DACH']),
  v('v-exposio', 'Exposio', 'www.exposio.com', 'Exposure Management', ['UK'], ['UK&I']),
  // Resellers
  r('r-brightwave', 'Brightwave plc', 'www.brightwave.com', 'Regional', 'P1 - Focused'),
  r('r-kessler', 'Kessler IT Ltd', 'www.kessler-it.example', 'Regional', 'P1 - Focused'),
  r('r-mcc', 'Midland Computer Centres plc', 'www.mcc.example', 'Regional', 'P1 - Focused'),
  r('r-kilobyte', 'Kilobyte Software Services', 'www.kilobyte.example', 'Regional', 'P1 - Focused'),
  r('r-compunet', 'Compunet', 'www.compunet.com', 'Global'),
  r('r-northstar', 'Northstar Distribution', 'www.northstar.example', 'Regional'),
  r('r-meridian', 'Meridian Networks', 'www.meridian-networks.example', 'Global'),
  r('r-q2it', 'Q2IT', 'www.q2it.example', 'Regional', 'P3 - Unmanaged'),
  r('r-3ksecurity', '3K Security Ltd', 'www.3ksecurity.example', 'Regional', 'P3 - Unmanaged'),
  r('r-fiveway', 'Fiveway', 'www.fiveway.example', 'Regional', 'P3 - Unmanaged'),
  r('r-dcx', 'DCX UK', 'www.dcx.example', 'Global'),
  r('r-clearview', 'Clearview Enterprises', 'www.clearview.example', 'Global'),
  r('r-firebird', 'Firebird Software', 'www.firebird.example', 'Regional'),
  r('r-trustline', 'Trustline', 'www.trustline.com', 'Regional'),
  r('r-zenient', 'Zenient', 'www.zenient.com', 'Regional', 'P3 - Unmanaged'),
  r('r-northgate', 'Northgate Cyber Group', 'www.northgate.example', 'Regional'),
  r('r-stoneridge', 'Stone Ridge', 'www.stoneridge.example', 'Global', 'P3 - Unmanaged'),
  r('r-kaido', 'Kaido', 'www.kaido.co.uk', 'Regional'),
  r('r-bluefin', 'Bluefin', 'www.bluefin.co.uk', 'Regional', 'P3 - Unmanaged'),
  r('r-optima', 'Optima IT', 'www.optima-it.example', 'Regional'),
  r('r-tidenet', 'Tidenet', 'www.tidenet.co.uk', 'Regional', 'P3 - Unmanaged'),
  r('r-coreline', 'Coreline', 'www.coreline.co.uk', 'Regional', 'P3 - Unmanaged'),
  // End users
  e('e-acme', 'Acme Corp', 'www.acme.example'),
  e('e-beta', 'BetaCorp', 'www.betacorp.example'),
  e('e-northwind', 'Northwind Health', 'www.northwind.example'),
  e('e-fabrikam', 'Fabrikam', 'www.fabrikam.example'),
  e('e-contoso', 'Contoso Bank', 'www.contoso.example'),
  e('e-litware', 'Litware', 'www.litware.example'),
  e('e-tailspin', 'Tailspin Toys', 'www.tailspin.example'),
  e('e-adventure', 'Adventure Works', 'www.adventure-works.example'),
  e('e-wingtip', 'Wingtip Toys', 'www.wingtip.example'),
  e('e-woodgrove', 'Woodgrove Bank', 'www.woodgrove.example'),
  e('e-proseware', 'Proseware', 'www.proseware.example'),
  e('e-alpine', 'Alpine Ski House', 'www.alpineskihouse.example'),
]

const DAY = 86_400_000

export const useDirectoryStore = defineStore('directory', () => {
  const activityStore = useActivityStore()
  const companies = ref([...MOCK_COMPANIES])

  const byId = computed(() => Object.fromEntries(companies.value.map((c) => [c.id, c])))
  function get(id) { return byId.value[id] ?? null }
  function name(id) { return byId.value[id]?.name ?? 'Unknown' }

  function ofKind(kind) {
    return companies.value.filter((c) => c.kind === kind).sort((a, b) => a.name.localeCompare(b.name))
  }

  /** Stats for one company, computed from its linked activities. */
  function statsFor(id) {
    const linked = activityStore.forCompany(id).sort((a, b) => b.date.localeCompare(a.date))
    const mix = { Sales: 0, 'Pre-Sales': 0, Marketing: 0 }
    const partners = { vendor: new Set(), reseller: new Set(), endUser: new Set() }
    linked.forEach((x) => {
      mix[x.recordType] += 1
      x.vendors.forEach((p) => p !== id && partners.vendor.add(p))
      if (x.reseller && x.reseller !== id) partners.reseller.add(x.reseller)
      x.endUsers.forEach((p) => p !== id && partners.endUser.add(p))
    })
    const dominant = Object.entries(mix).sort((a, b) => b[1] - a[1])[0]
    // "Last activity" = most recent one that already happened; future ones are "upcoming"
    const today = new Date().toISOString().slice(0, 10)
    const past = linked.filter((x) => x.date <= today)
    const upcoming = linked.filter((x) => x.date > today).sort((a, b) => a.date.localeCompare(b.date))
    const recent = past.filter((x) => Date.now() - new Date(x.date) < 30 * DAY).length
    return {
      activities: linked.length,
      latest: past[0] ?? null,
      next: upcoming[0] ?? null,
      dominantSignal: linked.length ? dominant[0] : null,
      mix,
      partners: { vendors: partners.vendor.size, resellers: partners.reseller.size, endUsers: partners.endUser.size },
      connectedPartners: partners.vendor.size + partners.reseller.size + partners.endUser.size,
      recent,
      momentum: recent >= 3 ? 'hot' : recent >= 1 ? 'warm' : 'quiet',
    }
  }

  /** Top 3 per kind by number of linked activities ("links"). */
  function trending(kind) {
    const list = ofKind(kind).map((c) => ({ ...c, links: activityStore.forCompany(c.id).length })).filter((c) => c.links)
    const top = list.sort((a, b) => b.links - a.links).slice(0, 3)
    const max = top[0]?.links ?? 1
    return top.map((c, i) => ({ ...c, rank: i + 1, share: Math.round((c.links / max) * 100) }))
  }

  const topSignal = computed(() => {
    const mix = { Sales: 0, 'Pre-Sales': 0, Marketing: 0 }
    activityStore.activities.forEach((x) => { mix[x.recordType] += 1 })
    const [type, count] = Object.entries(mix).sort((a, b) => b[1] - a[1])[0]
    return { type, count, sample: activityStore.activities.length }
  })

  /** Search across one kind — used by pickers in the activity form. */
  function search(kind, q) {
    const s = q.trim().toLowerCase()
    return ofKind(kind).filter((c) => !s || c.name.toLowerCase().includes(s))
  }

  // TODO: POST /api/companies/:kind — mock creates locally
  async function createCompany(kind, data) {
    await new Promise((res) => setTimeout(res, 500))
    const prefix = { vendor: 'v', reseller: 'r', endUser: 'e' }[kind]
    const company = {
      id: `${prefix}-${Date.now()}`,
      kind,
      status: 'Active',
      territories: [],
      regions: [],
      salesforceId: `0018d0000NEW${Math.floor(Math.random() * 1e4)}`,
      ...(kind === 'reseller' ? { recordType: 'Regional' } : {}),
      ...data,
    }
    companies.value.push(company)
    return company
  }

  return {
    companies,
    get,
    name,
    ofKind,
    statsFor,
    trending,
    topSignal,
    search,
    createCompany,
  }
})
