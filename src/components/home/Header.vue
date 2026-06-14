<template>
  <header class="floating-header">
    <button class="icon-btn" @click="emit('toggle-menu')" aria-label="Abrir menú">
      <icon-mdi-menu class="icon" />
    </button>

    <div class="search-container" ref="searchContainerRef">
      <div class="search-bar" :class="{ 'is-active': isFocused || searchQuery }">
        <icon-mdi-magnify class="icon" />
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Buscar..." 
          class="search-input"
          @focus="isFocused = true"
        />
        <button v-if="searchQuery" class="clear-btn" @click="clearSearch" aria-label="Limpiar búsqueda">
          <icon-mdi-close />
        </button>
      </div>

      <div v-if="showDropdown" class="search-dropdown">
        <div v-if="isLoading" class="dropdown-msg">Buscando...</div>
        <div v-else-if="results.length === 0" class="dropdown-msg">No hay resultados.</div>
        <ul v-else class="results-list">
          <li v-for="item in results" :key="item.id" @click="selectItem(item)" class="result-item">
            <span class="result-name">{{ item.name }}</span>
            <span class="result-cat">{{ formatCategory(item.category) }}</span>
          </li>
        </ul>
      </div>
    </div>

    <RouterLink to="/account" class="icon-btn" aria-label="Your account">
      <icon-mdi-account-outline class="icon" />
    </RouterLink>
  </header>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'

const emit = defineEmits(['toggle-menu', 'select-item'])

const API_BASE = import.meta.env.VITE_API_BASE ?? ''

const searchContainerRef = ref(null)
const searchQuery = ref('')
const isFocused = ref(false)
const isLoading = ref(false)
const results = ref([])
const showDropdown = ref(false)

let debounceTimer = null

const formatCategory = (cat) => {
  if (!cat) return ''
  return cat.replace(/-/g, ' ').replace(/^./, c => c.toUpperCase())
}

const clearSearch = () => {
  searchQuery.value = ''
  results.value = []
  showDropdown.value = false
}

const selectItem = (item) => {
  emit('select-item', item)
  clearSearch()
}

// Click outside to close dropdown
const handleClickOutside = (e) => {
  if (searchContainerRef.value && !searchContainerRef.value.contains(e.target)) {
    isFocused.value = false
    showDropdown.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

watch(searchQuery, (newVal) => {
  if (newVal.length < 2) {
    results.value = []
    showDropdown.value = false
    return
  }

  showDropdown.value = true
  isLoading.value = true
  clearTimeout(debounceTimer)

  debounceTimer = setTimeout(async () => {
    try {
      const urlGrooming = `${API_BASE}/v1/grooming/businesses?city=valencia&q=${encodeURIComponent(newVal)}&limit=4`
      const urlServices = `${API_BASE}/v1/businesses?vertical=services&city=valencia&q=${encodeURIComponent(newVal)}&limit=4`
      
      const [resGrooming, resServices] = await Promise.all([
        fetch(urlGrooming),
        fetch(urlServices)
      ])
      
      const dataGrooming = resGrooming.ok ? await resGrooming.json() : { items: [] }
      const dataServices = resServices.ok ? await resServices.json() : { items: [] }
      
      results.value = [...(dataGrooming.items ?? []), ...(dataServices.items ?? [])].slice(0, 5)
    } catch (err) {
      console.error('[Header] Failed to fetch search results:', err)
      results.value = []
    } finally {
      isLoading.value = false
    }
  }, 300)
})

</script>

<style scoped>
.floating-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: var(--z-header);

  display: flex;
  align-items: center;
  gap: var(--space-sm);

  width: 100%;
  max-width: var(--content-width);
  margin-inline: auto;

  padding: var(--space-sm) var(--space-md);
  padding-top: calc(var(--space-sm) + var(--safe-top));

  pointer-events: none;
  box-sizing: border-box;
}

.floating-header>* {
  pointer-events: auto;
}

.icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  width: 44px;
  height: 44px;
  border-radius: var(--radius-full);

  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(8px);
  border: 1px solid var(--border-light);
  box-shadow: var(--shadow-md);

  color: var(--text-medium);
}

.search-container {
  flex: 1;
  min-width: 0;
  position: relative;
}

.search-bar {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  width: 100%;

  height: 44px;
  padding: 0 var(--space-md);
  border-radius: var(--radius-full);

  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(8px);
  border: 1px solid var(--border-light);
  box-shadow: var(--shadow-md);

  color: var(--text-light);
  transition: all var(--duration-fast) var(--ease-default);
}

.search-bar.is-active {
  background: var(--surface-primary);
  border-color: var(--clr-primary);
  color: var(--text-dark);
}

.search-input {
  flex: 1;
  min-width: 0;
  border: none;
  background: transparent;
  font-size: var(--text-sm);
  outline: none;
}

.search-input::placeholder {
  color: var(--text-light);
}

.clear-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-light);
  font-size: var(--text-lg);
}

.clear-btn:hover {
  color: var(--text-medium);
}

.search-dropdown {
  position: absolute;
  top: calc(100% + var(--space-xs));
  left: 0;
  right: 0;
  background: var(--surface-primary);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
  z-index: var(--z-toast);
}

.dropdown-msg {
  padding: var(--space-md);
  font-size: var(--text-sm);
  color: var(--text-light);
  text-align: center;
}

.results-list {
  display: flex;
  flex-direction: column;
}

.result-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-sm) var(--space-md);
  cursor: pointer;
  border-bottom: 1px solid var(--border-light);
}

.result-item:last-child {
  border-bottom: none;
}

.result-item:hover {
  background: var(--surface-tertiary);
}

.result-name {
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--text-dark);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.result-cat {
  font-size: var(--text-xs);
  color: var(--text-light);
  white-space: nowrap;
  margin-left: var(--space-sm);
}

.icon {
  width: 22px;
  height: 22px;
  flex-shrink: 0;
}
</style>