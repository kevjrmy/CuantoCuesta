<template>
  <div class="item-card">
    <img v-if="item.image_url" :src="item.image_url" alt="" class="card-img" />
    <div class="card-body">
      <h3>{{ item.name }}</h3>
      <p class="category">{{ formatCategory(item.category) }}</p>
      <div class="card-meta">
        <span class="price">{{ item.price_range }}</span>
        <span v-if="item.rating" class="rating">
          <icon-mdi-star class="star-icon" /> {{ item.rating.value }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  item: Object,
  userLocation: Object
})

const formatCategory = (cat) => {
  if (!cat) return ''
  return cat.replace(/-/g, ' ').replace(/^./, c => c.toUpperCase())
}
</script>

<style scoped>
.item-card {
  display: flex;
  gap: var(--space-md);
  padding: var(--space-sm);
  background: var(--surface-elevated);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}

.card-img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: var(--radius-sm);
  flex-shrink: 0;
}

.card-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.card-body h3 {
  font-size: var(--text-base);
  margin-bottom: var(--space-xs);
  color: var(--text-dark);
}

.category {
  font-size: var(--text-xs);
  color: var(--text-light);
  margin-bottom: var(--space-xs);
}

.card-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: var(--text-sm);
}

.price {
  font-weight: 600;
  color: var(--text-dark);
}

.rating {
  display: flex;
  align-items: center;
  gap: 2px;
  color: var(--text-medium);
}

.star-icon {
  color: var(--clr-neutral);
  width: 14px;
  height: 14px;
}
</style>
