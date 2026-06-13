<template>
  <main id="map-container">
    <Transition name="fade-fast">
      <div v-if="isMapLoading" class="map-skeleton">
        <span class="map-skeleton-text">Cargando el mapa…</span>
      </div>
    </Transition>

    <div ref="mapContainer" class="leaflet-map-element"></div>

    <div class="map-controls">
      <MapControls @zoom-in="handleZoomIn" @zoom-out="handleZoomOut" />
      <button class="map-btn" @click="locateUser" aria-label="Mi ubicación">
        <icon-mdi-crosshairs-gps />
      </button>
    </div>

    <MapLegend :items="items" />

    <BottomItem :item="selectedItem" @close="selectedItem = null" />

    <Transition name="fade-fast">
      <div v-if="toastMessage" class="map-toast">{{ toastMessage }}</div>
    </Transition>
  </main>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, onActivated, nextTick, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import '@maplibre/maplibre-gl-leaflet'
import BottomItem from './BottomItem.vue'
import MapLegend from './MapLegend.vue'
import MapControls from './MapControls.vue'

const props = defineProps({
  items: { type: Array, required: true }
})

// TODO: move this to an env var (e.g. import.meta.env.VITE_JAWG_TOKEN) before this repo goes public
const styleURL = 'https://api.jawg.io/styles/jawg-terrain.json?access-token=XiBXEUhmb1ZDyFDl0LhMcwfotiZzhdyDZ7JJwOfa8I5xnNdb3Ar7IMyGp6HQ1cWX'

const mapContainer = ref(null)
const isMapLoading = ref(true)
const selectedItem = ref(null)
const userLocation = ref(null)
const hasInitialLocation = ref(false)
const toastMessage = ref('')

let map = null
let markerLayer = null
let userMarker = null
let userCircle = null
let toastTimer = null

// Same green palette as MapLegend — must stay in sync
const GREEN_PALETTE = [
  '#14532d', // deep forest
  '#15803d', // logo dark green
  '#16a34a', // primary brand green
  '#22c55e', // medium green
  '#4ade80', // light green
  '#86efac', // mint
  '#6ee7b7', // teal-green
  '#34d399', // emerald
  '#059669', // dark emerald
  '#10b981', // emerald mid
  '#065f46', // deep emerald
  '#a3e635', // yellow-green / lime
]

const getCategoryColor = (category) => {
  const allCategories = [...new Set(props.items.map(i => i.category).filter(Boolean))].sort()
  const idx = allCategories.indexOf(category)
  return GREEN_PALETTE[idx % GREEN_PALETTE.length] ?? GREEN_PALETTE[0]
}

const CURRENCY_SYMBOLS = {
  EUR: '€',
  USD: '$',
  GBP: '£'
}


const formatMarkerPrice = (item) => {
  if (item.price_from == null) return '?'
  const symbol = CURRENCY_SYMBOLS[item.price_currency] || ''
  return `${symbol}${item.price_from}`
}

// Our mock data stores plain { lat, lng } (unlike Firestore's { latitude, longitude })
const getLatLng = (item) => {
  if (item.location?.lat != null && item.location?.lng != null) {
    return [item.location.lat, item.location.lng]
  }
  return [0, 0]
}

const showToast = (message, duration = 3000) => {
  toastMessage.value = message
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toastMessage.value = '' }, duration)
}

const renderMarkers = () => {
  // Map may still be initialising when the API fetch resolves — retry once it's ready
  if (!map) {
    console.warn('[Map] renderMarkers called before map ready, retrying in 200ms')
    setTimeout(renderMarkers, 200)
    return
  }
  if (!props.items?.length) {
    console.log('[Map] renderMarkers called but items is empty, skipping')
    return
  }
  console.log('[Map] Rendering', props.items.length, 'markers')

  if (markerLayer) markerLayer.clearLayers()
  else markerLayer = L.layerGroup().addTo(map)

  props.items.forEach(item => {
    const coords = getLatLng(item)
    const color = getCategoryColor(item.category)

    const icon = L.divIcon({
      className: 'custom-marker',
      html: `<div class="marker-pin" style="background-color: ${color}">${formatMarkerPrice(item)}</div>`,
      iconSize: [36, 28],
      iconAnchor: [18, 14]
    })

    const marker = L.marker(coords, { icon })
    marker.on('click', () => flyToItem(item))
    markerLayer.addLayer(marker)
  })
}

// Re-render pins whenever the item list is replaced (API fetch) or mutated (filters)
watch(() => props.items, renderMarkers)

const flyToItem = (item) => {
  if (!map) return
  const coords = getLatLng(item)
  selectedItem.value = item
  map.flyTo([coords[0] - 0.002, coords[1]], 16, { animate: true, duration: 1.5 })
}

const locateUser = () => {
  if (!map) return
  if (!userLocation.value) {
    showToast('Buscando señal GPS…')
    return
  }
  map.flyTo([userLocation.value.lat, userLocation.value.lng], 16)
}

const handleZoomIn = () => {
  if (map) map.zoomIn()
}

const handleZoomOut = () => {
  if (map) map.zoomOut()
}

onActivated(() => {
  if (map) {
    // Recalculates the container size instantly when the view is re-shown
    map.invalidateSize()
    map.locate({ watch: true, enableHighAccuracy: true })
  }
})

onMounted(async () => {
  if (map) return

  await nextTick()
  if (!mapContainer.value) return

  // Startup Weekend Valencia — keep the map centered on the city
  const corner1 = L.latLng(39.3500, -0.5000)
  const corner2 = L.latLng(39.5500, -0.2500)
  const valenciaBounds = L.latLngBounds(corner1, corner2)
  const savedCoords = localStorage.getItem('cuanto_cuesta_last_location')
  const startCoords = savedCoords ? JSON.parse(savedCoords) : [39.4699, -0.3763]

  map = L.map(mapContainer.value, {
    center: startCoords,
    zoom: 15,
    minZoom: 12,
    maxBounds: valenciaBounds,
    maxBoundsViscosity: 1.0,
    zoomControl: false,
    attributionControl: false
  })

  map.on('load', () => {
    setTimeout(() => { isMapLoading.value = false }, 300)
  })

  L.maplibreGL({
    style: styleURL,
    pane: 'tilePane'
  }).addTo(map)

  renderMarkers()

  map.on('locationfound', (e) => {
    localStorage.setItem('cuanto_cuesta_last_location', JSON.stringify([e.latlng.lat, e.latlng.lng]))
    userLocation.value = { lat: e.latlng.lat, lng: e.latlng.lng }

    if (!hasInitialLocation.value && !selectedItem.value) {
      map.flyTo(e.latlng, 15)
      hasInitialLocation.value = true
    }

    if (!userMarker) {
      // Mirrors --clr-primary — kept literal since divIcon/circle styling sits outside scoped CSS
      userCircle = L.circle(e.latlng, { radius: e.accuracy / 2, color: '#3b82f6', weight: 1, fillOpacity: 0.1 }).addTo(map)
      userMarker = L.circleMarker(e.latlng, { radius: 7, fillColor: '#3b82f6', color: 'white', weight: 3, fillOpacity: 1 }).addTo(map)
    } else {
      userCircle.setLatLng(e.latlng)
      userCircle.setRadius(e.accuracy / 2)
      userMarker.setLatLng(e.latlng)
    }
  })

  map.on('locationerror', (e) => {
    console.warn('Leaflet geolocation error:', e.message)
    if (e.message.toLowerCase().includes('denied') || e.message.toLowerCase().includes('permission')) {
      showToast('Activa la ubicación para ver negocios cerca de ti')
    }
    if (!hasInitialLocation.value && !selectedItem.value) {
      map.setView(startCoords, 15)
      hasInitialLocation.value = true
    }
  })

  map.locate({ watch: true, enableHighAccuracy: true })

  setTimeout(() => {
    if (map) map.invalidateSize()
    isMapLoading.value = false
  }, 2000)
})

onBeforeUnmount(() => {
  if (map) map.stopLocate()
  clearTimeout(toastTimer)
})

defineExpose({ flyToItem })
</script>

<style scoped>
#map-container {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100dvh;
  background-color: var(--surface-secondary);
  z-index: var(--z-content);
  touch-action: pan-x pan-y;
}

.leaflet-map-element {
  width: 100%;
  height: 100%;
}

/* Loading skeleton */
.map-skeleton {
  position: absolute;
  inset: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--surface-tertiary);
}

.map-skeleton-text {
  font-size: var(--text-sm);
  color: var(--text-light);
}

.fade-fast-enter-active,
.fade-fast-leave-active {
  transition: opacity var(--duration-fast) var(--ease-default);
}

.fade-fast-enter-from,
.fade-fast-leave-to {
  opacity: 0;
}

/* Floating controls, stacked above the bottom nav */
.map-controls {
  position: absolute;
  right: var(--space-md);
  bottom: calc(var(--bottom-nav-height) + var(--safe-bottom) + var(--space-md));
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  z-index: 1000;
}

.map-btn {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;

  background: var(--surface-elevated);
  border: 1px solid var(--border-light);
  box-shadow: var(--shadow-md);

  color: var(--clr-primary);
  font-size: var(--text-xl);
  transition: transform var(--duration-fast) var(--ease-default);
}

.map-btn:active {
  transform: scale(0.92);
}

/* Markers — pill showing the starting price, colored by category */
:deep(.custom-marker) {
  background: none !important;
  border: none !important;
}

:deep(.marker-pin) {
  display: flex;
  align-items: center;
  justify-content: center;

  height: 28px;
  min-width: 36px;
  padding: 0 var(--space-xs);

  border-radius: var(--radius-full);
  border: 2px solid var(--surface-elevated);
  box-shadow: var(--shadow-sm);

  color: var(--text-inverse);
  font-size: var(--text-xs);
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}



/* Toast */
.map-toast {
  position: fixed;
  left: 50%;
  bottom: calc(var(--bottom-nav-height) + var(--safe-bottom) + var(--space-xl));
  transform: translateX(-50%);
  z-index: var(--z-toast);

  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-full);
  background: var(--text-dark);
  color: var(--text-inverse);
  font-size: var(--text-sm);
  box-shadow: var(--shadow-md);
  white-space: nowrap;
}
</style>