<template>
  <header class="floating-header">
    <button class="icon-btn" @click="emit('toggle-menu')" aria-label="Abrir menú">
      <icon-mdi-menu class="icon" />
    </button>

    <RouterLink to="/explore" class="search-bar">
      <icon-mdi-magnify class="icon" />
      <span class="search-placeholder">Buscar...</span>
    </RouterLink>

    <RouterLink to="/account" class="icon-btn" aria-label="Your account">
      <icon-mdi-account-outline class="icon" />
    </RouterLink>
  </header>
</template>

<script setup>
const emit = defineEmits(['toggle-menu'])
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

.search-bar {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  flex: 1;
  min-width: 0;

  height: 44px;
  padding: 0 var(--space-md);
  border-radius: var(--radius-full);

  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(8px);
  border: 1px solid var(--border-light);
  box-shadow: var(--shadow-md);

  color: var(--text-light);
}

.search-placeholder {
  font-size: var(--text-sm);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.icon {
  width: 22px;
  height: 22px;
  flex-shrink: 0;
}
</style>