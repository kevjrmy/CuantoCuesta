<template>
  <article class="item-card">
    <div class="card-img-wrap">
      <img v-if="item.image_url" :src="item.image_url" :alt="item.name" class="card-img" loading="lazy" />
      <div v-else class="card-img-placeholder">
        <icon-mdi-store-outline />
      </div>
      <span v-if="item.sponsored" class="badge badge-sponsored">Patrocinado</span>
    </div>

    <div class="card-body">
      <div class="card-top">
        <div class="card-category">{{ formatCategory(item.category) }}</div>
        <div v-if="item.rating" class="card-rating">
          <icon-mdi-star class="star-icon" />
          <span>{{ item.rating.value.toFixed(1) }}</span>
          <span class="review-count">({{ item.rating.review_count }})</span>
        </div>
      </div>

      <h3 class="card-name">{{ item.name }}</h3>

      <div class="card-footer">
        <span v-if="item.price_range" class="card-price">{{ item.price_range }}</span>
        <div class="card-sources">
          <span v-for="src in item.sources" :key="src" class="source-tag">{{ capitalize(src) }}</span>
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

.badge {
  position: absolute;
  bottom: 4px;
  left: 4px;
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  padding: 2px 5px;
  border-radius: var(--radius-sm);
  line-height: 1.3;
}

.badge-sponsored {
  background: var(--clr-neutral-light);
  color: var(--clr-neutral);
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

.card-name {
  font-size: var(--text-sm);
  font-weight: 700;
  color: var(--text-dark);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.3;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-xs);
  margin-top: 2px;
}

.card-price {
  font-size: var(--text-sm);
  font-weight: 700;
  color: var(--text-dark);
  font-variant-numeric: tabular-nums;
}

.card-sources {
  display: flex;
  gap: 4px;
}

.source-tag {
  font-size: 0.65rem;
  font-weight: 600;
  color: var(--text-light);
  background: var(--surface-tertiary);
  border-radius: var(--radius-sm);
  padding: 2px 6px;
}

/* ── Chevron ── */
.card-chevron {
  color: var(--border-strong);
  font-size: var(--text-lg);
  flex-shrink: 0;
}
</style>
