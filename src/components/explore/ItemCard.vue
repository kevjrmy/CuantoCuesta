<template>
  <article class="item-card">
    <div class="card-img-wrap">
      <img v-if="item.image_url" :src="item.image_url" :alt="item.name" class="card-img" loading="lazy" />
      <div v-else class="card-img-placeholder">
        <icon-mdi-store-outline />
      </div>
      <img v-if="item.logo_url" :src="item.logo_url" class="card-logo" loading="lazy" alt="" />
    </div>

    <div class="card-body">
      <div class="card-top">
        <div class="card-category">{{ item.label || formatCategory(item.category) }}</div>
        <div v-if="item.rating" class="card-rating">
          <icon-mdi-star class="star-icon" />
          <span>{{ item.rating.value.toFixed(1) }}</span>
          <span class="review-count">({{ item.rating.review_count }})</span>
        </div>
      </div>

      <div class="name-row">
        <h3 class="card-name">{{ item.name }}</h3>
        <icon-mdi-check-decagram v-if="item.verified || item.sponsored" class="verified-badge" aria-label="Verified" />
      </div>

      <div class="card-footer">
        <div v-if="item.price_from != null || item.price_to != null" class="card-main-price">
          <span v-if="item.price_from != null && item.price_to == null" class="from-label">Desde</span>
          <span v-else-if="item.price_to != null && item.price_from == null" class="from-label">Hasta</span>
          <span class="price-value">
            <template v-if="item.price_from != null && item.price_to != null && item.price_from !== item.price_to">
              {{ item.price_from }}€ - {{ item.price_to }}€
            </template>
            <template v-else>
              {{ item.price_from ?? item.price_to }}€
            </template>
          </span>
        </div>
        <div class="card-sources">
          <span v-for="src in item.sources" :key="src" :class="['source-tag', `source-tag--${src}`]">
            <icon-arcticons-booksy v-if="src === 'booksy'" class="source-icon" />
            {{ capitalize(src) }}
          </span>
        </div>
      </div>
    </div>

    <icon-mdi-chevron-right class="card-chevron" />
  </article>
</template>

<script setup>
defineProps({
  item: { type: Object, required: true },
  userLocation: { type: Object, default: null }
})

const formatCategory = (cat) => {
  if (!cat) return ''
  return cat.replace(/-/g, ' ').replace(/^./, c => c.toUpperCase())
}

const capitalize = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1) : ''
</script>

<style scoped>
.item-card {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-sm);
  background: var(--surface-elevated);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-light);
  box-shadow: var(--shadow-xs);
  cursor: pointer;
  transition: box-shadow var(--duration-fast), transform var(--duration-fast);
  -webkit-tap-highlight-color: transparent;
}

.item-card:active {
  transform: scale(0.985);
  box-shadow: none;
}

/* ── Image ── */
.card-img-wrap {
  position: relative;
  width: 76px;
  height: 76px;
  flex-shrink: 0;
  border-radius: var(--radius-md);
  overflow: hidden;
  background: var(--surface-tertiary);
}

.card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-img-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  color: var(--text-muted);
}

.card-logo {
  position: absolute;
  bottom: 4px;
  right: 4px;
  width: 24px;
  height: 24px;
  border-radius: var(--radius-full);
  border: 2px solid var(--surface-elevated);
  object-fit: cover;
  background: var(--surface-primary);
  z-index: 2;
  box-shadow: var(--shadow-xs);
}



/* ── Body ── */
.card-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-xs);
}

.card-category {
  font-size: var(--text-xs);
  color: var(--clr-primary);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.card-rating {
  display: flex;
  align-items: center;
  gap: 2px;
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--text-medium);
}

.star-icon {
  color: var(--clr-neutral);
  width: 12px;
  height: 12px;
}

.review-count {
  color: var(--text-muted);
  font-weight: 400;
}

.name-row {
  display: flex;
  align-items: center;
  gap: 4px;
}

.card-name {
  font-size: var(--text-sm);
  font-weight: 700;
  color: var(--text-dark);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.3;
}

.verified-badge {
  color: var(--clr-primary, #1da1f2); /* Twitter-like blue if primary differs */
  font-size: 1rem;
  flex-shrink: 0;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-xs);
  margin-top: 2px;
}

.card-main-price {
  display: flex;
  align-items: baseline;
  gap: 4px;
  flex-wrap: wrap;
}

.from-label {
  font-size: var(--text-xs);
  color: var(--text-muted);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.price-value {
  font-size: var(--text-sm);
  font-weight: 700;
  color: var(--text-dark);
  font-variant-numeric: tabular-nums;
  line-height: 1;
}

.full-range {
  font-size: var(--text-xs);
  color: var(--text-muted);
}

.card-sources {
  display: flex;
  gap: 4px;
}

.source-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.65rem;
  font-weight: 600;
  color: var(--text-light);
  background: var(--surface-tertiary);
  border-radius: var(--radius-sm);
  padding: 2px 6px;
}

.source-tag--booksy {
  background: #00d2d3;
  color: #fff;
}

.source-icon {
  font-size: 1.2em;
}

/* ── Chevron ── */
.card-chevron {
  color: var(--border-strong);
  font-size: var(--text-lg);
  flex-shrink: 0;
}
</style>
