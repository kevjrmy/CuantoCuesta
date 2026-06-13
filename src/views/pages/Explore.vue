<template>
  <MainLayout>
    <div id="explore-page" class="app-main">

      <header class="explore-header">
        <div class="search-bar">
          <icon-mdi-magnify class="search-icon" />
          <input
            v-model="searchQuery"
            type="search"
            placeholder="Buscar negocio..."
            class="search-input"
            @input="onSearch"
          />
        </div>
        <button
          @click="showFilters = true"
          class="filter-btn"
          :class="{ 'has-filters': hasActiveFilters }"
          aria-label="Filtros"
        >
          <icon-mdi-tune />
          <span v-if="hasActiveFilters" class="filter-dot" />
        </button>
      </header>

      <div v-if="!loading && filteredItems.length > 0" class="results-count">
        {{ filteredItems.length }} resultado{{ filteredItems.length !== 1 ? 's' : '' }}
      </div>

      <div class="items-list">
        <div v-if="loading" class="loading-state">
          <div class="spinner" />
          <p>Buscando...</p>
        </div>

        <template v-else-if="filteredItems.length > 0">
          <ItemCard
            v-for="item in filteredItems"
            :key="item.id"
            :item="item"
            :user-location="userLocation"
            @click="goToItem(item.id)"
          />
        </template>

        <div v-else class="empty-state">
          <div class="empty-icon">🔍</div>
          <h3>Sin resultados</h3>
          <p>Prueba a cambiar los filtros</p>
          <button @click="clearAll" class="reset-btn">Limpiar todo</button>
        </div>
      </div>

      <ExploreFilters
        :show="showFilters"
        :filters="filters"
        :categories="categoryKeys"
        :category-names="categoryNames"
        @close="showFilters = false"
        @clear="clearFilters"
        @update:filters="val => Object.assign(filters, val)"
      />
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, computed, reactive, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import ItemCard from '@/components/explore/ItemCard.vue'
import ExploreFilters from '@/components/explore/ExploreFilters.vue'

const API_BASE = import.meta.env.VITE_API_BASE ?? ''
const router = useRouter()

const allItems = ref([])
const loading = ref(true)
const showFilters = ref(false)
const userLocation = ref(null)
const searchQuery = ref('')

const filters = reactive({
  category: '',
  priceMin: null,
  priceMax: null,
  source: '',
  minRating: 0,
  sortBy: 'price-asc'
})

const buildUrl = () => {
  const params = new URLSearchParams({ city: 'valencia', limit: '100' })
  if (filters.category) params.set('category', filters.category)
  if (filters.minRating > 0) params.set('min_rating', String(filters.minRating))
  if (searchQuery.value.trim()) params.set('q', searchQuery.value.trim())
  return `${API_BASE}/v1/businesses?${params}`
}

const fetchItems = async () => {
  loading.value = true
  try {
    const res = await fetch(buildUrl())
    if (!res.ok) throw new Error(`API error ${res.status}`)
    const data = await res.json()
    allItems.value = data.items ?? []
  } catch (err) {
    console.error('[Explore] Failed to load businesses:', err)
    allItems.value = []
  } finally {
    loading.value = false
  }
}

let searchTimer = null
const onSearch = () => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(fetchItems, 350)
}

watch(() => [filters.category, filters.minRating], fetchItems)

const categoryKeys = computed(() => {
  const cats = new Set(allItems.value.map(i => i.category).filter(Boolean))
  return [...cats].sort()
})

const categoryNames = computed(() => {
  const names = {}
  for (const item of allItems.value) {
    if (item.category && !names[item.category]) {
      names[item.category] = item.label || item.category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    }
  }
  return names
})

const hasActiveFilters = computed(() =>
  filters.category !== ''
  || filters.priceMin !== null
  || filters.priceMax !== null
  || filters.source !== ''
  || filters.minRating > 0
  || (filters.sortBy !== '' && filters.sortBy !== 'price-asc')
)

const filteredItems = computed(() => {
  let result = [...allItems.value]

  if (filters.priceMin !== null) {
    result = result.filter(item => item.price_from >= filters.priceMin)
  }
  if (filters.priceMax !== null) {
    result = result.filter(item => item.price_to <= filters.priceMax)
  }
  if (filters.source) {
    result = result.filter(item => item.sources?.includes(filters.source))
  }
  if (!filters.sortBy || filters.sortBy === 'price-asc') {
    result.sort((a, b) => (a.price_from || 0) - (b.price_from || 0))
  } else if (filters.sortBy === 'price-desc') {
    result.sort((a, b) => (b.price_from || 0) - (a.price_from || 0))
  } else if (filters.sortBy === 'rating-desc') {
    result.sort((a, b) => (b.rating?.value || 0) - (a.rating?.value || 0))
  }
  return result
})

const clearFilters = () => {
  filters.category = ''
  filters.priceMin = null
  filters.priceMax = null
  filters.source = ''
  filters.minRating = 0
  filters.sortBy = 'price-asc'
}

const clearAll = () => {
  clearFilters()
  searchQuery.value = ''
  fetchItems()
}

const goToItem = (id) => router.push({ name: 'item', params: { id } })

onMounted(fetchItems)
</script>

<style scoped>
#explore-page {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  padding-inline: var(--space-sm);
  padding-top: calc(var(--safe-top) + var(--space-md));
  padding-bottom: var(--space-xl);
}

/* ── Header ── */
.explore-header {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  margin-bottom: var(--space-sm);
}

.search-bar {
  flex: 1;
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  background: var(--surface-elevated);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-full);
  padding: 0 var(--space-md);
  height: 44px;
  transition: border-color var(--duration-fast);
}

.search-bar:focus-within {
  border-color: var(--clr-primary);
}

.search-icon {
  color: var(--text-light);
  font-size: var(--text-lg);
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  border: none;
  background: none;
  outline: none;
  font-size: var(--text-sm);
  color: var(--text-dark);
}

.search-input::placeholder {
  color: var(--text-muted);
}

/* hide the native clear (x) button in Chrome/Safari */
.search-input::-webkit-search-cancel-button {
  -webkit-appearance: none;
}

.filter-btn {
  position: relative;
  width: 44px;
  height: 44px;
  border-radius: var(--radius-full);
  background: var(--surface-elevated);
  border: 1px solid var(--border-default);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-dark);
  font-size: var(--text-lg);
  flex-shrink: 0;
  transition: all var(--duration-fast);
}

.filter-btn.has-filters {
  background: var(--clr-primary-light);
  color: var(--clr-primary);
  border-color: var(--clr-primary);
}

.filter-dot {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 8px;
  height: 8px;
  border-radius: var(--radius-full);
  background: var(--clr-primary);
  border: 2px solid var(--surface-elevated);
}

/* ── Results count ── */
.results-count {
  font-size: var(--text-xs);
  color: var(--text-light);
  font-weight: 500;
  margin-bottom: var(--space-sm);
  padding-left: var(--space-xs);
}

/* ── List ── */
.items-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

/* ── States ── */
.loading-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-2xl) 0;
  text-align: center;
  color: var(--text-medium);
}

.empty-icon {
  font-size: 2.5rem;
  margin-bottom: var(--space-sm);
}

.empty-state h3 {
  font-size: var(--text-lg);
  color: var(--text-dark);
  margin-bottom: var(--space-xs);
}

.reset-btn {
  margin-top: var(--space-md);
  padding: var(--space-sm) var(--space-lg);
  border-radius: var(--radius-full);
  background: var(--clr-primary);
  color: var(--text-inverse);
  font-size: var(--text-sm);
  font-weight: 600;
}

.spinner {
  width: 28px;
  height: 28px;
  border: 3px solid var(--border-light);
  border-top-color: var(--clr-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: var(--space-md);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>