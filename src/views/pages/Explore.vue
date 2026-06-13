<template>
  <MainLayout>
    <div id="explore-page" class="app-main">
      <header class="explore-header">
        <h1>Explore</h1>
        <button @click="showFilters = true" class="filter-btn" :class="{ 'has-filters': hasActiveFilters }"
          aria-label="Filters">
          <icon-mdi-tune />
        </button>
      </header>

      <div class="items-list">
        <div v-if="loading" class="loading-state">
          <div class="spinner"></div>
          <p>Searching for places...</p>
        </div>

        <template v-else-if="filteredItems.length > 0">
          <ItemCard v-for="item in filteredItems" :key="item.id" :item="item" :user-location="userLocation" />
        </template>

        <div v-else class="empty-state">
          <div class="empty-icon">☁️</div>
          <h3>No results found</h3>
          <p>Try adjusting your filters</p>
          <button @click="clearFilters" class="reset-link">Clear filters</button>
        </div>
      </div>

      <ExploreFilters :show="showFilters" :filters="filters" @close="showFilters = false" @clear="clearFilters"
        @update:filters="val => Object.assign(filters, val)" />
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import MainLayout from '@/layouts/MainLayout.vue'
import ItemCard from '@/components/explore/ItemCard.vue'
import ExploreFilters from '@/components/explore/ExploreFilters.vue'
import mockData from '@/data/cuanto_cuesta.json'

const items = mockData.items
const loading = ref(true)
const showFilters = ref(false)
const userLocation = ref(null)

const filters = reactive({
  category: '',
  priceMin: null,
  priceMax: null,
  source: '',
  minRating: 0,
  sortBy: ''
})

const hasActiveFilters = computed(() => {
  return filters.category !== ''
    || filters.priceMin !== null
    || filters.priceMax !== null
    || filters.source !== ''
    || filters.minRating > 0
    || filters.sortBy !== ''
})

const filteredItems = computed(() => {
  let result = items

  if (filters.category) {
    result = result.filter(item => item.category === filters.category)
  }

  if (filters.priceMin !== null) {
    result = result.filter(item => item.price_from >= filters.priceMin)
  }

  if (filters.priceMax !== null) {
    result = result.filter(item => item.price_to <= filters.priceMax)
  }

  if (filters.source) {
    result = result.filter(item => item.sources && item.sources.includes(filters.source))
  }

  if (filters.minRating > 0) {
    result = result.filter(item => item.rating && item.rating.value >= filters.minRating)
  }

  if (filters.sortBy) {
    switch (filters.sortBy) {
      case 'price-asc':
        result.sort((a, b) => (a.price_from || 0) - (b.price_from || 0))
        break
      case 'price-desc':
        result.sort((a, b) => (b.price_from || 0) - (a.price_from || 0))
        break
      case 'rating-desc':
        result.sort((a, b) => (b.rating?.value || 0) - (a.rating?.value || 0))
        break
    }
  }

  return result
})

const clearFilters = () => {
  filters.category = ''
  filters.priceMin = null
  filters.priceMax = null
  filters.source = ''
  filters.minRating = 0
  filters.sortBy = ''
}

onMounted(() => {
  // Simulate network request to show the loader for a brief moment
  setTimeout(() => {
    loading.value = false
  }, 600)
})
</script>

<style scoped>
#explore-page {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  padding-bottom: var(--space-xl);
}

.explore-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-md);
}

.explore-header h1 {
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--text-dark);
}

.filter-btn {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-full);
  background: var(--surface-elevated);
  border: 1px solid var(--border-light);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-dark);
  font-size: var(--text-lg);
  transition: all var(--duration-fast);
}

.filter-btn.has-filters {
  background: var(--clr-primary-light);
  color: var(--clr-primary);
  border-color: var(--clr-primary);
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

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
  font-size: 3rem;
  margin-bottom: var(--space-sm);
}

.reset-link {
  margin-top: var(--space-md);
  color: var(--clr-primary);
  font-weight: 600;
  text-decoration: underline;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--border-light);
  border-top-color: var(--clr-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: var(--space-md);
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>