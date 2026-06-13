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
    const url = `${API_BASE}/v1/grooming/businesses?city=valencia&limit=100`
    console.log('[Home] Fetching:', url)
    const res = await fetch(url)
    if (!res.ok) throw new Error(`API error ${res.status}`)
    const data = await res.json()
    console.log('[Home] API response — total:', data.total, 'items received:', data.items?.length, data.items?.map(i => ({ id: i.id, name: i.name, lat: i.location?.lat, lng: i.location?.lng })))
    items.value = data.items ?? []
  } catch (err) {
    console.error('[Home] Failed to load businesses:', err)
  }
})
</script>