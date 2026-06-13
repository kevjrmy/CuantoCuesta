<template>
  <div class="drawer-wrapper">
    <Transition name="fade">
      <div v-if="isOpen" class="overlay" @click="$emit('close')"></div>
    </Transition>

    <aside :class="{ 'is-open': isOpen }" :inert="!isOpen" aria-label="Menu">
      <div class="drawer-inner">
        <div class="drawer-header">
          <img src="/logo-text.svg" alt="Cuanto Cuesta Logo" class="drawer-logo" />
          <button @click="$emit('close')" class="btn-close" aria-label="Cerrar">
            <icon-mdi-close />
          </button>
        </div>

        <nav class="nav-list">
          <div class="nav-group">
            <RouterLink to="/" class="menu-link" @click="$emit('close')">
              <div class="link-content">
                <icon-mdi-map-outline class="nav-icon" />
                <span class="link-label">Home</span>
              </div>
            </RouterLink>
            <RouterLink to="/explore" class="menu-link" @click="$emit('close')">
              <div class="link-content">
                <icon-mdi-magnify class="nav-icon" />
                <span class="link-label">Explore</span>
              </div>
            </RouterLink>
          </div>
          <div class="nav-group nav-group-secondary">
            <RouterLink to="/about" class="menu-link" @click="$emit('close')">
              <div class="link-content">
                <icon-mdi-information-outline class="nav-icon" />
                <span class="link-label">About</span>
              </div>
            </RouterLink>
          </div>
        </nav>
      </div>
    </aside>
  </div>
</template>

<script setup>
defineProps({
  isOpen: Boolean
})

defineEmits(['close'])
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  z-index: var(--z-drawer-backdrop);
  background: var(--surface-overlay);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity var(--duration-normal) var(--ease-out);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

aside {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: var(--z-drawer);

  width: var(--drawer-width);
  max-width: 85vw;

  background: var(--surface-elevated);
  box-shadow: var(--shadow-lg);

  transform: translateX(-100%);
  transition: transform var(--duration-normal) var(--ease-out);
}

aside.is-open {
  transform: translateX(0);
}

.drawer-inner {
  display: flex;
  flex-direction: column;
  height: 100%;

  padding-top: calc(var(--space-md) + var(--safe-top));
  padding-right: var(--space-md);
  padding-bottom: calc(var(--space-md) + var(--safe-bottom));
  padding-left: calc(var(--space-md) + var(--safe-left));
}

.drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  margin-bottom: var(--space-lg);
}

.drawer-logo {
  height: 28px;
  width: auto;
}

.btn-close {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 36px;
  height: 36px;
  border-radius: var(--radius-full);

  color: var(--text-medium);
  font-size: var(--text-xl);

  transition: background-color var(--duration-fast) var(--ease-default);
}

.btn-close:hover {
  background: var(--surface-tertiary);
}

.nav-list {
  display: flex;
  flex-direction: column;
}

.nav-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.nav-group-secondary {
  margin-top: var(--space-lg);
  padding-top: var(--space-md);
  border-top: 1px solid var(--border-light);
}

.menu-link {
  display: block;
  border-radius: var(--radius-md);
  transition: background-color var(--duration-fast) var(--ease-default);
}

.menu-link:hover {
  background: var(--surface-tertiary);
}

.link-content {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-sm) var(--space-md);
}

.nav-icon {
  width: 22px;
  height: 22px;
  flex-shrink: 0;
  color: var(--text-medium);
}

.link-label {
  font-size: var(--text-base);
  font-weight: 500;
  color: var(--text-dark);
}

/* Active state, in continuity with BottomNav's pill highlight */
.menu-link.router-link-active {
  background: var(--clr-primary-light);
}

.menu-link.router-link-active .nav-icon,
.menu-link.router-link-active .link-label {
  color: var(--clr-primary);
}
</style>