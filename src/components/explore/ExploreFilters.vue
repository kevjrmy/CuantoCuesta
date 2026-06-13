<template>
  <Transition name="fade">
    <div v-if="show" class="filters-overlay" @click.self="$emit('close')">
      <div class="filters-panel">
        <div class="panel-header">
          <h2>Filters</h2>
          <button @click="$emit('close')" class="close-btn"><icon-mdi-close /></button>
        </div>

        <div class="panel-body no-scrollbar">
          <div class="filter-group">
            <label>Category</label>
            <div class="pill-grid">
              <button v-for="cat in categoryKeys" :key="cat"
                @click="updateFilter('category', cat)"
                :class="['pill-btn', { active: filters.category === cat }]">
                {{ getCategoryName(cat) }}
              </button>
            </div>
          </div>

          <div class="filter-group">
            <label>Price Range</label>
            <div class="price-range">
              <div class="input-group">
                <span class="input-prefix">€</span>
                <input type="number" :value="filters.priceMin"
                  @input="emit('update:filters', { ...filters, priceMin: $event.target.value ? Number($event.target.value) : null })"
                  placeholder="Min" min="0" class="price-input" />
              </div>
              <span class="range-separator">—</span>
              <div class="input-group">
                <span class="input-prefix">€</span>
                <input type="number" :value="filters.priceMax"
                  @input="emit('update:filters', { ...filters, priceMax: $event.target.value ? Number($event.target.value) : null })"
                  placeholder="Max" min="0" class="price-input" />
              </div>
            </div>
          </div>

          <div class="filter-group">
            <label>Platform</label>
            <div class="pill-grid">
              <button v-for="src in sourceKeys" :key="src"
                @click="updateFilter('source', src)"
                :class="['pill-btn', { active: filters.source === src }]">
                {{ capitalize(src) }}
              </button>
            </div>
          </div>

          <div class="filter-group">
            <label>Minimum Rating</label>
            <div class="rating-stars">
              <button v-for="star in 5" :key="star"
                @click="updateFilter('minRating', star === filters.minRating ? 0 : star)"
                :class="['star-btn', { active: star <= filters.minRating }]">
                <icon-mdi-star />
              </button>
              <span v-if="filters.minRating > 0" class="rating-label">{{ filters.minRating }}+</span>
            </div>
          </div>

          <div class="filter-group">
            <label>Sort by</label>
            <div class="pill-grid">
              <button v-for="opt in sortOptions" :key="opt.value"
                @click="updateFilter('sortBy', opt.value)"
                :class="['pill-btn', { active: filters.sortBy === opt.value }]">
                {{ opt.label }}
              </button>
            </div>
          </div>
        </div>

        <div class="panel-footer">
          <button @click="$emit('clear')" class="btn-secondary">Clear</button>
          <button @click="$emit('close')" class="btn-primary">Show results</button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
const props = defineProps({
  show: Boolean,
  filters: Object
})

const emit = defineEmits(['close', 'clear', 'update:filters'])

const categoryKeys = ['barberia', 'salon-de-unas']

const sourceKeys = ['booksy', 'treatwell']

const sortOptions = [
  { value: '', label: 'Default' },
  { value: 'price-asc', label: 'Price ↑' },
  { value: 'price-desc', label: 'Price ↓' },
  { value: 'rating-desc', label: 'Rating' }
]

const getCategoryName = (cat) => {
  const map = {
    'barberia': 'Barbershop',
    'salon-de-unas': 'Nail Salon'
  }
  return map[cat] || cat
}

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1)

const updateFilter = (key, value) => {
  const newFilters = { ...props.filters }
  if (newFilters[key] === value) {
    if (key === 'minRating') {
      newFilters[key] = 0
    } else {
      newFilters[key] = ''
    }
  } else {
    newFilters[key] = value
  }
  emit('update:filters', newFilters)
}
</script>

<style scoped>
.filters-overlay {
  position: fixed;
  inset: 0;
  background: var(--surface-overlay);
  z-index: var(--z-drawer-backdrop);
  display: flex;
  justify-content: flex-end;
}

.filters-panel {
  width: 85vw;
  max-width: 320px;
  height: 100%;
  background: var(--surface-elevated);
  box-shadow: var(--shadow-lg);
  display: flex;
  flex-direction: column;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-md);
  border-bottom: 1px solid var(--border-light);
}

.panel-header h2 {
  font-size: var(--text-lg);
  margin: 0;
}

.close-btn {
  font-size: var(--text-xl);
  color: var(--text-medium);
}

.panel-body {
  flex: 1;
  padding: var(--space-md);
  overflow-y: auto;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.filter-group {
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.filter-group label {
  font-weight: 600;
  font-size: var(--text-sm);
  color: var(--text-dark);
}

.pill-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.pill-btn {
  padding: 0.5rem 0.75rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-strong);
  background: var(--surface-primary);
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--text-medium);
  transition: all var(--duration-fast);
}

.pill-btn.active {
  background: var(--clr-primary-light);
  color: var(--clr-primary);
  border-color: var(--clr-primary);
}

.pill-btn:active {
  transform: scale(0.95);
}

.price-range {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.input-group {
  flex: 1;
  display: flex;
  align-items: center;
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-md);
  background: var(--surface-primary);
  overflow: hidden;
}

.input-prefix {
  padding: 0.5rem 0 0.5rem 0.75rem;
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--text-light);
}

.price-input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: none;
  background: none;
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--text-dark);
  outline: none;
  -moz-appearance: textfield;
}

.price-input::-webkit-outer-spin-button,
.price-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.price-input::placeholder {
  color: var(--text-muted);
  font-weight: 400;
}

.range-separator {
  color: var(--text-light);
  font-size: var(--text-sm);
}

.rating-stars {
  display: flex;
  align-items: center;
  gap: 2px;
}

.star-btn {
  font-size: 1.5rem;
  color: var(--border-strong);
  transition: all var(--duration-fast);
  padding: 2px;
}

.star-btn.active {
  color: var(--clr-neutral);
}

.star-btn:active {
  transform: scale(0.9);
}

.rating-label {
  margin-left: var(--space-xs);
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--text-medium);
}

.panel-footer {
  display: flex;
  gap: var(--space-sm);
  padding: var(--space-md);
  border-top: 1px solid var(--border-light);
}

.btn-secondary, .btn-primary {
  flex: 1;
  padding: var(--space-sm);
  border-radius: var(--radius-md);
  font-weight: 600;
  font-size: var(--text-sm);
}

.btn-secondary {
  background: var(--surface-tertiary);
  color: var(--text-dark);
}

.btn-primary {
  background: var(--clr-primary);
  color: var(--text-inverse);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity var(--duration-fast);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
