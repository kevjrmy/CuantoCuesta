<template>
  <nav class="bottom-nav" role="navigation">
    <RouterLink to="/" class="nav-item">
      <span class="nav-icon-wrapper">
        <icon-mdi-map-outline class="nav-icon" />
      </span>
      <span class="nav-label">Home</span>
    </RouterLink>

    <RouterLink to="/explore" class="nav-item">
      <span class="nav-icon-wrapper">
        <icon-mdi-magnify class="nav-icon" />
      </span>
      <span class="nav-label">Explore</span>
    </RouterLink>

    <RouterLink to="/dashboard" class="nav-item">
      <span class="nav-icon-wrapper">
        <icon-mdi-account-outline class="nav-icon" />
      </span>
      <span class="nav-label">Dashboard</span>
    </RouterLink>
  </nav>
</template>

<style scoped>
.bottom-nav {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: var(--z-bottom-nav);

  display: flex;
  align-items: stretch;
  justify-content: space-around;

  width: 100%;
  max-width: var(--content-width);
  margin-inline: auto;

  height: var(--bottom-nav-height);
  padding-bottom: var(--safe-bottom);
  padding-left: var(--safe-left);
  padding-right: var(--safe-right);

  background: var(--surface-elevated);
  border-top: 1px solid var(--border-light);
}

.nav-item {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;

  color: var(--text-light);
  transition: color var(--duration-fast) var(--ease-default);
}

.nav-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 44px;
  height: 28px;
  border-radius: var(--radius-full);

  background: transparent;
  transition: background-color var(--duration-normal) var(--ease-out);
}

.nav-icon {
  width: 22px;
  height: 22px;
}

.nav-label {
  font-size: var(--text-xs);
  line-height: 1;
}

/* Active state — pill highlight behind the icon */
.nav-item.router-link-active {
  color: var(--clr-primary);
}

.nav-item.router-link-active .nav-icon-wrapper {
  background: var(--clr-primary-light);
}

.nav-item.router-link-active .nav-label {
  font-weight: 600;
}
</style>