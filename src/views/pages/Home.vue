<template>
  <MainLayout>
    <Header @toggle-menu="isDrawerOpen = true" @select-item="handleSelectItem" />
    <Map ref="mapRef" :items="items" />
    <MenuDrawer :is-open="isDrawerOpen" @close="isDrawerOpen = false" />
  </MainLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import MainLayout from '@/layouts/MainLayout.vue'
import Header from '@/components/home/Header.vue'
import Map from '@/components/home/Map.vue'
import MenuDrawer from '@/components/inc/MenuDrawer.vue'

const API_BASE = import.meta.env.VITE_API_BASE ?? ''

const isDrawerOpen = ref(false)
const items = ref([])
const mapRef = ref(null)

const handleSelectItem = (item) => {
  if (mapRef.value) {
    mapRef.value.flyToItem(item)
  }
}

onMounted(async () => {
  try {
    const params = new URLSearchParams({ city: 'valencia', limit: '100' })
    const [groomingRes, servicesRes] = await Promise.all([
      fetch(`${API_BASE}/v1/grooming/businesses?${params}`),
      fetch(`${API_BASE}/v1/businesses?vertical=services&${params}`)
    ])
    
    const groomingData = groomingRes.ok ? await groomingRes.json() : { items: [] }
    const servicesData = servicesRes.ok ? await servicesRes.json() : { items: [] }
    
    items.value = [...(groomingData.items ?? []), ...(servicesData.items ?? [])]
    console.log('[Home] API response — total items:', items.value.length)
  } catch (err) {
    console.error('[Home] Failed to load businesses:', err)
  }
})
</script>