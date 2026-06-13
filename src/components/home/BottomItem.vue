<template>
  <Teleport to="body">
    <Transition name="slide-up">
      <div v-if="item" :key="item.id" class="bottom-sheet">
        <div class="sheet-backdrop" @click="$emit('close')"></div>
        <div class="sheet-content">
          <button class="sheet-close" @click="$emit('close')" aria-label="Cerrar">
            <icon-mdi-close />
          </button>

          <img v-if="item.image_url" :src="item.image_url" :alt="item.name" class="item-image" />

          <div class="item-details">
            <h2 class="item-name">{{ item.name }}</h2>
            
            <p class="item-address">
              <icon-mdi-map-marker-outline class="icon-sm" />
              {{ item.address?.street || item.city }}
            </p>

            <div class="item-meta">
              <div class="price-badge price-badge--neutral">
                <icon-mdi-currency-eur class="icon-sm" />
                <span>{{ item.price_range }}</span>
              </div>

              <span v-if="item.rating" class="item-rating">
                <icon-mdi-star class="star-icon icon-sm" />
                {{ item.rating.value }} ({{ item.rating.review_count }})
              </span>
            </div>

            <RouterLink :to="`/item/${item.id}`" class="btn-primary" @click="$emit('close')">
              Ver detalle
            </RouterLink>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
defineProps({
  item: { type: Object, default: null }
})
defineEmits(['close'])
</script>

<style scoped>
.bottom-sheet {
  position: fixed;
  inset: 0;
  z-index: var(--z-drawer);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  pointer-events: none;
}

.sheet-backdrop {
  position: absolute;
  inset: 0;
  background: var(--surface-overlay);
  pointer-events: auto;
}

.sheet-content {
  position: relative;
  background: var(--surface-elevated);
  border-top-left-radius: var(--radius-xl);
  border-top-right-radius: var(--radius-xl);
  padding: var(--space-md);
  padding-bottom: calc(var(--space-lg) + var(--safe-bottom));
  pointer-events: auto;
  box-shadow: var(--shadow-lg);
  
  width: 100%;
  max-width: var(--content-width);
  margin-inline: auto;
}

.sheet-close {
  position: absolute;
  top: var(--space-sm);
  right: var(--space-sm);
  width: 32px;
  height: 32px;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--surface-tertiary);
  color: var(--text-medium);
  z-index: 2;
}

.item-image {
  width: 100%;
  height: 180px;
  border-radius: var(--radius-md);
  object-fit: cover;
  margin-bottom: var(--space-md);
}

.item-details {
  display: flex;
  flex-direction: column;
}

.item-name {
  font-size: var(--text-xl);
  font-weight: 700;
  color: var(--text-dark);
  margin-bottom: var(--space-xs);
}

.item-address {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  font-size: var(--text-sm);
  color: var(--text-medium);
  margin-bottom: var(--space-md);
}

.item-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-lg);
}

.item-rating {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  font-size: var(--text-sm);
  color: var(--text-medium);
}

.star-icon {
  color: var(--clr-neutral);
}

.icon-sm {
  width: 18px;
  height: 18px;
}

.btn-primary {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: var(--space-md);
  border-radius: var(--radius-full);
  background: var(--clr-primary);
  color: var(--text-inverse);
  font-weight: 600;
  font-size: var(--text-base);
  text-align: center;
  transition: background-color var(--duration-fast);
}

.btn-primary:active {
  background: var(--clr-primary-dark);
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: opacity var(--duration-fast), transform var(--duration-normal) var(--ease-out);
}

.slide-up-enter-active .sheet-content,
.slide-up-leave-active .sheet-content {
  transition: transform var(--duration-normal) var(--ease-out);
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
}

.slide-up-enter-from .sheet-content,
.slide-up-leave-to .sheet-content {
  transform: translateY(100%);
}
</style>
