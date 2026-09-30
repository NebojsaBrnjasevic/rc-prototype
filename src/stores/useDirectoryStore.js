import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

/**
 * Directory store — vendors, resellers, end users.
 *
 * TODO: Replace mock data with real API endpoints:
 *   GET /api/directory/vendors?q=&page=1
 *   GET /api/directory/vendors/:id
 *   GET /api/directory/resellers
 *   GET /api/directory/end-users
 */

const MOCK_VENDORS = [
  {
    id: 'a078d000005R1WUAA0',
    name: 'Abnormal AI',
    type: 'Vendor',
    status: 'Active',
    website: 'https://abnormalsecurity.com',
    activities: 653,
    lastActivity: '5 days ago',
    dominantSignal: 'SALES',
    connectedPartners: 10,
    isTrending: true,
    trendingRank: 2,
    territories: ['Ignition Technology UK'],
    regions: ['UK'],
  },
  {
    id: 'a078d000005R1WUBB1',
    name: 'CrowdStrike',
    type: 'Vendor',
    status: 'Active',
    website: 'https://crowdstrike.com',
    activities: 421,
    lastActivity: '1 day ago',
    dominantSignal: 'SALES',
    connectedPartners: 18,
    isTrending: true,
    trendingRank: 1,
    territories: ['Ignition Technology UK'],
    regions: ['UK'],
  },
  {
    id: 'a078d000005R1WUCC2',
    name: 'Mimecast',
    type: 'Vendor',
    status: 'Active',
    website: 'https://mimecast.com',
    activities: 210,
    lastActivity: '3 days ago',
    dominantSignal: 'PRESALES',
    connectedPartners: 7,
    isTrending: true,
    trendingRank: 3,
    territories: ['Ignition Technology UK'],
    regions: ['UK'],
  },
]

export const useDirectoryStore = defineStore('directory', () => {
  const vendors = ref([...MOCK_VENDORS])
  const loading = ref(false)
  const searchQuery = ref('')

  const filteredVendors = computed(() => {
    if (!searchQuery.value) return vendors.value
    const q = searchQuery.value.toLowerCase()
    return vendors.value.filter((v) => v.name.toLowerCase().includes(q))
  })

  const trendingVendors = computed(() =>
    vendors.value
      .filter((v) => v.isTrending)
      .sort((a, b) => a.trendingRank - b.trendingRank)
      .slice(0, 3)
  )

  /**
   * TODO: GET /api/directory/vendors/:id
   */
  function getVendorById(id) {
    return vendors.value.find((v) => v.id === id) ?? null
  }

  /**
   * TODO: GET /api/directory/vendors?q=
   */
  async function fetchVendors() {
    loading.value = true
    await new Promise((r) => setTimeout(r, 300))
    loading.value = false
  }

  function setSearch(q) { searchQuery.value = q }

  return {
    vendors,
    filteredVendors,
    trendingVendors,
    loading,
    searchQuery,
    getVendorById,
    fetchVendors,
    setSearch,
  }
})
