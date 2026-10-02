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
  v('v-crowdstrike', 'CrowdStrike', 'www.crowdstrike.com', 'XDR', ['UK', 'DACH', 'Benelux', 'Nordics', 'France'], ['EMEA North', 'EMEA Central', 'EMEA South', 'UK&I', 'DACH', 'Benelux', 'Nordics']),
  v('v-abnormal', 'Abnormal AI', 'www.abnormal.ai', 'Email Security', ['UK', 'DACH'], ['UK&I', 'DACH']),
  v('v-mimecast', 'Mimecast', 'www.mimecast.com', 'Email Security', ['UK', 'Benelux', 'Nordics'], ['UK&I', 'Benelux', 'Nordics']),
  v('v-sailpoint', 'SailPoint', 'www.sailpoint.com', 'Identity Governance', ['UK', 'DACH'], ['UK&I', 'DACH']),
  v('v-netskope', 'Netskope', 'www.netskope.com', 'SSE', ['UK', 'France'], ['UK&I', 'France']),
  v('v-sentinelone', 'SentinelOne', 'www.sentinelone.com', 'XDR', ['UK'], ['UK&I']),
  v('v-appomni', 'AppOmni', 'www.appomni.com', 'SaaS Security', ['UK'], ['UK&I']),
  v('v-axonius', 'Axonius', 'www.axonius.com', 'Asset Management', ['UK', 'DACH'], ['UK&I', 'DACH']),
  v('v-beyondtrust', 'BeyondTrust', 'www.beyondtrust.com', 'PAM', ['UK'], ['UK&I']),
  v('v-censys', 'Censys', 'www.censys.com', 'Attack Surface', ['UK'], ['UK&I']),
  v('v-claroty', 'Claroty', 'www.claroty.com', 'OT Security', ['DACH'], ['DACH']),
  v('v-cyberhaven', 'Cyberhaven', 'www.cyberhaven.com', 'Data Security', ['UK'], ['UK&I']),
  v('v-delinea', 'Delinea', 'www.delinea.com', 'PAM', ['UK', 'Nordics'], ['UK&I', 'Nordics']),
  v('v-druva', 'Druva', 'www.druva.com', 'Backup', ['UK'], ['UK&I']),
  v('v-exabeam', 'Exabeam', 'www.exabeam.com', 'SIEM', ['UK'], ['UK&I']),
  v('v-illumio', 'Illumio', 'www.illumio.com', 'Segmentation', ['UK', 'France'], ['UK&I', 'France']),
  v('v-imperva', 'Imperva', 'www.imperva.com', 'Application Security', ['UK'], ['UK&I']),
  v('v-orca', 'Orca Security', 'www.orca.security', 'Cloud Security', ['UK'], ['UK&I']),
  v('v-silverfort', 'Silverfort', 'www.silverfort.com', 'Identity Protection', ['UK', 'DACH'], ['UK&I', 'DACH']),
  v('v-xmcyber', 'XM Cyber', 'www.xmcyber.com', 'Exposure Management', ['UK'], ['UK&I']),
  // Resellers
  r('r-softcat', 'Softcat plc', 'www.softcat.com', 'Regional', 'P1 - Focused'),
  r('r-bechtle', 'Bechtle Ltd', 'www.bechtle.co.uk', 'Regional', 'P1 - Focused'),
  r('r-scc', 'Specialist Computer Centres plc', 'www.scc.com', 'Regional', 'P1 - Focused'),
  r('r-bytes', 'Bytes Software Services', 'www.bytes.co.uk', 'Regional', 'P1 - Focused'),
  r('r-computacenter', 'Computacenter', 'www.computacenter.com', 'Global'),
  r('r-ignition', 'Ignition Technology', 'www.ignition-technology.com', 'Regional'),
  r('r-exclusive', 'Exclusive Networks', 'www.exclusive-networks.com', 'Global'),
  r('r-02it', '02IT', 'www.02it.co.uk', 'Regional', 'P3 - Unmanaged'),
  r('r-2tsecurity', '2T Security Ltd', 'www.2tsecurity.co.uk', 'Regional', 'P3 - Unmanaged'),
  r('r-4way', '4way', 'www.4way.co.uk', 'Regional', 'P3 - Unmanaged'),
  r('r-cdw', 'CDW UK', 'www.uk.cdw.com', 'Global'),
  r('r-insight', 'Insight Enterprises', 'www.insight.com', 'Global'),
  r('r-phoenix', 'Phoenix Software', 'www.phoenixs.co.uk', 'Regional'),
  r('r-trustmarque', 'Trustmarque', 'www.trustmarque.com', 'Regional'),
  r('r-xalient', 'Xalient', 'www.xalient.com', 'Regional', 'P3 - Unmanaged'),
  r('r-nccgroup', 'NCC Group', 'www.nccgroup.com', 'Regional'),
  r('r-iron', 'Iron Mountain', 'www.ironmountain.co.uk', 'Global', 'P3 - Unmanaged'),
  r('r-kocho', 'Kocho', 'www.kocho.co.uk', 'Regional'),
  r('r-littlefish', 'Littlefish', 'www.littlefish.co.uk', 'Regional', 'P3 - Unmanaged'),
  r('r-ultima', 'Ultima', 'www.ultima.com', 'Regional'),
  r('r-wavenet', 'Wavenet', 'www.wavenet.co.uk', 'Regional', 'P3 - Unmanaged'),
  r('r-coretech', 'Coretech', 'www.coretech.co.uk', 'Regional', 'P3 - Unmanaged'),
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
