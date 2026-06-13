<script setup>
const emit = defineEmits(['zoom-in', 'zoom-out'])

function zoomIn() {
  emit('zoom-in')
}

function zoomOut() {
  emit('zoom-out')
}
</script>

<template>
  <div class="zoom-controls-wrapper">
    <button class="map-btn zoom-btn" @click="zoomIn" aria-label="Acercar">
      <icon-mdi-plus />
    </button>
    <div class="divider"></div>
    <button class="map-btn zoom-btn" @click="zoomOut" aria-label="Alejar">
      <icon-mdi-minus />
    </button>
  </div>
</template>

<style scoped>
.zoom-controls-wrapper {
  display: flex;
  flex-direction: column;
  background-color: var(--surface-elevated, #ffffff);
  border-radius: var(--radius-full, 9999px);
  box-shadow: var(--shadow-md, 0 4px 6px rgba(0, 0, 0, 0.1));
  border: 1px solid var(--border-light, #f0f0ee);
  overflow: hidden;
}

.map-btn.zoom-btn {
  width: 44px;
  height: 44px;
  border-radius: 0;
  border: none;
  box-shadow: none;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--clr-primary, #3b82f6);
  font-size: var(--text-xl, 1.25rem);
  transition: background-color var(--duration-fast) var(--ease-default);
}

.map-btn.zoom-btn:active {
  background-color: var(--surface-tertiary, #f2f2f0);
  transform: scale(0.92);
}

.divider {
  width: 100%;
  height: 1px;
  background-color: var(--border-light, #f0f0ee);
}
</style>
