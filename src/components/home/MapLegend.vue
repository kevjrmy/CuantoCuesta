<template>
  <div class="map-legend">
    <div v-if="categoryKeys.length === 0" class="legend-item">
      <span class="legend-label legend-label--empty">Sin categorías</span>
    </div>
    <div v-for="cat in categoryKeys" :key="cat" class="legend-item">
      <span class="legend-dot" :style="{ backgroundColor: getCategoryColor(cat) }"></span>
      <span class="legend-label">{{ formatCategoryLabel(cat) }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  items: { type: Array, required: true }
})

console.log('[MapLegend] mounted, items:', props.items?.length, props.items?.map(i => i.category))

// A curated palette of distinct green shades — from deep forest to bright lime
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

const categoryKeys = computed(() => {
  const seen = new Set()
  if (props.items) {
    props.items.forEach(item => {
      if (item.category) seen.add(item.category)
    })
  }
  return Array.from(seen).sort()
})

const getCategoryColor = (category) => {
  const idx = categoryKeys.value.indexOf(category)
  return GREEN_PALETTE[idx % GREEN_PALETTE.length]
}

const formatCategoryLabel = (category) => {
  if (!category) return ''
  return category.replace(/-/g, ' ').replace(/^./, c => c.toUpperCase())
}
</script>

<style scoped>
.map-legend {
  position: absolute;
  left: var(--space-md);
  bottom: calc(var(--bottom-nav-height) + var(--safe-bottom) + var(--space-md));

  display: flex;
  flex-direction: column;
  gap: var(--space-xs);

  padding: var(--space-sm);
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-light);
  box-shadow: var(--shadow-sm);

  z-index: 1000;
  pointer-events: none;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: var(--radius-full);
  border: 1.5px solid var(--surface-elevated);
  flex-shrink: 0;
}

.legend-label {
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--text-dark);
  white-space: nowrap;
}
</style>
