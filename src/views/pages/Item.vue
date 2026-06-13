<template>
  <div id="item-page">
    <!-- Hero image with back button overlaid -->
    <div class="hero-wrap">
      <img
        v-if="business?.image_url"
        :src="business.image_url"
        :alt="business?.name"
        class="hero-img"
      />
      <div v-else class="hero-placeholder">
        <icon-mdi-store-outline />
      </div>
      <div class="hero-overlay" />

      <button class="back-btn" @click="router.back()" aria-label="Volver">
        <icon-mdi-arrow-left />
      </button>

      <div v-if="business" class="hero-meta">
        <img v-if="business.logo_url" :src="business.logo_url" class="hero-logo" alt="" />
        <div class="hero-meta-text">
          <span class="hero-category">{{ business.label || formatCategory(business.category) }}</span>
          <h1 class="hero-title">{{ business.name }}</h1>
          <div class="hero-rating" v-if="business.rating">
            <icon-mdi-star class="star-icon" />
            <span>{{ business.rating.value.toFixed(1) }}</span>
            <span class="review-count">· {{ business.rating.review_count }} reseñas</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading skeleton -->
    <div v-if="loading" class="page-body">
      <div class="skeleton skeleton-title" />
      <div class="skeleton skeleton-line" />
      <div class="skeleton skeleton-line short" />
    </div>

    <!-- Error -->
    <div v-else-if="error" class="page-body error-state">
      <icon-mdi-alert-circle-outline class="error-icon" />
      <p>No se pudo cargar el negocio</p>
      <button @click="fetchAll" class="retry-btn">Reintentar</button>
    </div>

    <!-- Content -->
    <div v-else-if="business" class="page-body">

      <!-- Quick stats row -->
      <div class="stats-row">
        <div class="stat-chip">
          <icon-mdi-currency-eur />
          <span v-if="business.price_from != null && business.price_to != null && business.price_from !== business.price_to">
            {{ business.price_from }} - {{ business.price_to }}
          </span>
          <span v-else-if="business.price_from != null">
            Desde {{ business.price_from }}
          </span>
          <span v-else-if="business.price_to != null">
            Hasta {{ business.price_to }}
          </span>
          <span v-else-if="business.price_range">
            {{ business.price_range }}
          </span>
          <span v-else>—</span>
        </div>
        <div v-if="business.address?.locality" class="stat-chip">
          <icon-mdi-map-marker-outline />
          <span>{{ business.address.locality }}</span>
        </div>
        <div v-if="business.last_verified" class="stat-chip">
          <icon-mdi-clock-outline />
          <span>{{ formatDate(business.last_verified) }}</span>
        </div>
        <div v-if="business.verified" class="stat-chip stat-chip--verified">
          <icon-mdi-check-decagram />
          <span>Verificado</span>
        </div>
      </div>

      <!-- Description -->
      <section v-if="business.description" class="section">
        <p class="description">{{ business.description }}</p>
      </section>

      <!-- Services list -->
      <section v-if="services.length > 0" class="section">
        <h2 class="section-title">Servicios</h2>
        <div class="services-list">
          <div v-for="svc in visibleServices" :key="svc.name" class="service-row">
            <div class="service-info">
              <span class="service-name">{{ svc.name }}</span>
              <span v-if="svc.description" class="service-desc">{{ svc.description }}</span>
            </div>
            <div class="service-price">
              <template v-if="svc.price != null">
                {{ svc.currency === 'EUR' ? '€' : svc.currency }}{{ svc.price.toFixed(0) }}
              </template>
              <template v-else-if="svc.price_from != null && svc.price_to != null && svc.price_from !== svc.price_to">
                {{ svc.price_from }}€ - {{ svc.price_to }}€
              </template>
              <template v-else-if="svc.price_from != null">
                Desde {{ svc.price_from }}€
              </template>
              <template v-else-if="svc.price_range">
                {{ svc.price_range }}
              </template>
              <template v-else>—</template>
            </div>
          </div>
        </div>
        <button v-if="services.length > 5" @click="servicesExpanded = !servicesExpanded" class="show-more-btn">
          <template v-if="!servicesExpanded">
            <icon-mdi-chevron-down />
            Ver los {{ services.length - 5 }} servicios restantes
          </template>
          <template v-else>
            <icon-mdi-chevron-up />
            Ver menos
          </template>
        </button>
      </section>

      <!-- Sources / platforms -->
      <section v-if="business.sources?.length" class="section">
        <h2 class="section-title">Disponible en</h2>
        <div class="source-pills">
          <span v-for="src in business.sources" :key="src" :class="['source-pill', `source-pill--${src}`]">
            <icon-arcticons-booksy v-if="src === 'booksy'" class="source-icon" />
            {{ capitalize(src) }}
          </span>
        </div>
      </section>

      <!-- Address -->
      <section v-if="business.address?.street" class="section">
        <h2 class="section-title">Dirección</h2>
        <p class="address-text">
          {{ business.address.street }}<br />
          {{ business.address.locality }}, {{ business.address.postal_code }}
        </p>
      </section>

    </div>

    <!-- Floating WhatsApp CTA -->
    <a
      v-if="business"
      :href="`https://wa.me/34600000000?text=${encodeURIComponent('Hola! Me interesa ' + business.name)}`"
      target="_blank"
      rel="noopener noreferrer"
      class="whatsapp-fab"
      aria-label="Contactar por WhatsApp"
    >
      <icon-mdi-whatsapp class="whatsapp-icon" />
      <span>WhatsApp</span>
    </a>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const API_BASE = import.meta.env.VITE_API_BASE ?? ''
const route = useRoute()
const router = useRouter()

const business = ref(null)
const services = ref([])
const servicesExpanded = ref(false)
const loading = ref(true)
const error = ref(false)

const visibleServices = computed(() =>
  servicesExpanded.value ? services.value : services.value.slice(0, 5)
)

const formatCategory = (cat) => {
  if (!cat) return ''
  return cat.replace(/-/g, ' ').replace(/^./, c => c.toUpperCase())
}

const capitalize = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1) : ''

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const yy = String(d.getFullYear()).slice(-2)
  return `${dd}/${mm}/${yy}`
}

const fetchAll = async () => {
  loading.value = true
  error.value = false
  const id = route.params.id
  try {
    const [bizRes, svcRes] = await Promise.all([
      fetch(`${API_BASE}/v1/businesses/${id}`),
      fetch(`${API_BASE}/v1/businesses/${id}/services`)
    ])
    if (!bizRes.ok) throw new Error(`${bizRes.status}`)
    business.value = await bizRes.json()
    if (svcRes.ok) {
      const svcData = await svcRes.json()
      services.value = svcData.items ?? []
    }
  } catch (err) {
    console.error('[Item] fetch error:', err)
    error.value = true
  } finally {
    loading.value = false
  }
}

onMounted(fetchAll)
</script>

<style scoped>
#item-page {
  min-height: 100dvh;
  background: var(--surface-secondary);
  padding-bottom: calc(var(--safe-bottom) + var(--space-xl));
}

/* ── Hero ── */
.hero-wrap {
  position: relative;
  width: 100%;
  height: 280px;
  overflow: hidden;
  background: var(--surface-tertiary);
}

.hero-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  color: var(--border-strong);
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.55) 100%);
}

.back-btn {
  position: absolute;
  top: calc(var(--safe-top) + var(--space-md));
  left: var(--space-md);
  width: 40px;
  height: 40px;
  border-radius: var(--radius-full);
  background: rgba(0,0,0,0.35);
  backdrop-filter: blur(8px);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-xl);
  z-index: 2;
}

.hero-meta {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: var(--space-md) var(--space-md) var(--space-lg);
  z-index: 2;
  display: flex;
  align-items: flex-end;
  gap: var(--space-md);
}

.hero-logo {
  width: 64px;
  height: 64px;
  border-radius: var(--radius-md);
  border: 2px solid #fff;
  object-fit: cover;
  background: #fff;
  flex-shrink: 0;
  box-shadow: var(--shadow-sm);
}

.hero-meta-text {
  display: flex;
  flex-direction: column;
}

.hero-category {
  display: inline-block;
  font-size: var(--text-xs);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: rgba(255,255,255,0.75);
  margin-bottom: 4px;
}

.hero-title {
  font-size: var(--text-2xl);
  font-weight: 800;
  color: #fff;
  line-height: 1.2;
  margin-bottom: 6px;
}

.hero-rating {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: var(--text-sm);
  font-weight: 600;
  color: rgba(255,255,255,0.9);
}

.star-icon {
  color: var(--clr-neutral);
  width: 14px;
  height: 14px;
}

.review-count {
  color: rgba(255,255,255,0.65);
  font-weight: 400;
}

/* ── Page body ── */
.page-body {
  padding: var(--space-lg) var(--space-md);
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

/* ── Stats row ── */
.stats-row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
}

.stat-chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 6px var(--space-sm);
  background: var(--surface-elevated);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--text-medium);
}

.stat-chip--verified {
  background: var(--clr-primary-light);
  color: var(--clr-primary);
  border-color: transparent;
}

/* ── Sections ── */
.section {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.section-title {
  font-size: var(--text-base);
  font-weight: 700;
  color: var(--text-dark);
}

.description {
  font-size: var(--text-sm);
  line-height: 1.65;
  color: var(--text-medium);
}

/* ── Services ── */
.services-list {
  background: var(--surface-elevated);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-light);
  overflow: hidden;
}

.service-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--space-md);
  padding: var(--space-md);
  border-bottom: 1px solid var(--border-light);
}

.service-row:last-child {
  border-bottom: none;
}

.service-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.service-name {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--text-dark);
}

.service-desc {
  font-size: var(--text-xs);
  color: var(--text-light);
  line-height: 1.4;
}

.service-price {
  font-size: var(--text-sm);
  font-weight: 700;
  color: var(--clr-primary);
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}

/* ── Sources ── */
.source-pills {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
}

.source-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: var(--space-sm) var(--space-md);
  background: var(--surface-elevated);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--text-medium);
}

.source-pill--booksy {
  background: #00d2d3;
  color: #fff;
  border-color: transparent;
}

.source-icon {
  font-size: 1.2em;
}

/* ── Address ── */
.address-text {
  font-size: var(--text-sm);
  color: var(--text-medium);
  line-height: 1.6;
  background: var(--surface-elevated);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  padding: var(--space-md);
}

/* ── Skeletons ── */
.skeleton {
  background: var(--surface-tertiary);
  border-radius: var(--radius-md);
  animation: shimmer 1.4s ease-in-out infinite;
}

.skeleton-title {
  height: 28px;
  width: 60%;
}

.skeleton-line {
  height: 16px;
  width: 100%;
}

.skeleton-line.short {
  width: 40%;
}

@keyframes shimmer {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.45; }
}

/* ── Error ── */
.error-state {
  align-items: center;
  justify-content: center;
  padding: var(--space-2xl) var(--space-md);
  text-align: center;
}

.error-icon {
  font-size: 2.5rem;
  color: var(--clr-danger);
  margin-bottom: var(--space-sm);
}

.retry-btn {
  margin-top: var(--space-md);
  padding: var(--space-sm) var(--space-lg);
  border-radius: var(--radius-full);
  background: var(--clr-primary);
  color: var(--text-inverse);
  font-weight: 600;
  font-size: var(--text-sm);
}

/* ── WhatsApp FAB ── */
.whatsapp-fab {
  position: fixed;
  bottom: calc(var(--space-xl) + var(--safe-bottom));
  right: var(--space-md);
  z-index: var(--z-toast);

  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);

  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-full);
  background: #25d366;
  color: #fff;
  font-size: var(--text-sm);
  font-weight: 700;
  box-shadow: 0 4px 16px rgba(37, 211, 102, 0.45);

  transition: transform var(--duration-fast) var(--ease-out),
              box-shadow var(--duration-fast) var(--ease-out);
  animation: fab-pop 0.4s var(--ease-out) both;
}

.whatsapp-fab:hover {
  transform: translateY(-2px) scale(1.03);
  box-shadow: 0 8px 24px rgba(37, 211, 102, 0.55);
}

.whatsapp-fab:active {
  transform: scale(0.96);
}

.whatsapp-icon {
  font-size: 1.4em;
}

@keyframes fab-pop {
  from { opacity: 0; transform: scale(0.7) translateY(12px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}
</style>
