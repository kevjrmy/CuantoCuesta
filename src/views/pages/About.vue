<template>
  <MainLayout>
    <div class="about-page">
      <section class="hero-section">
        <div class="hero-icon">
          <icon-mdi-currency-eur />
        </div>
        <h1>Cuánto Cuesta</h1>
        <p class="tagline">Compara precios en Valencia y ahorra</p>
        <p class="description">
          Encuentra y compara precios de servicios y productos cerca de ti.
          Desde barberías hasta talleres, te ayudamos a elegir la mejor opción.
        </p>
      </section>

      <section class="how-section">
        <h2 class="section-title">Cómo funciona</h2>
        <div class="steps">
          <div class="step">
            <div class="step-number">1</div>
            <icon-mdi-magnify class="step-icon" />
            <h3>Busca</h3>
            <p>Explora negocios y servicios en Valencia</p>
          </div>
          <div class="step">
            <div class="step-number">2</div>
            <icon-mdi-scale-balance class="step-icon" />
            <h3>Compara</h3>
            <p>Mira los precios de distintas opciones</p>
          </div>
          <div class="step">
            <div class="step-number">3</div>
            <icon-mdi-check-circle-outline class="step-icon" />
            <h3>Ahorra</h3>
            <p>Elige la mejor relación calidad-precio</p>
          </div>
        </div>
      </section>

      <section class="project-section">
        <h2 class="section-title">El proyecto</h2>
        <p>
          Construido en 48 horas durante la Techstars Startup Weekend Valencia.
          Un MVP para ayudar a los valencianos a encontrar los mejores precios
          cerca de ellos, comparando fuentes como Booksy y otros partners.
        </p>
        <div class="badge">
          <icon-mdi-rocket-launch class="badge-icon" />
          Techstars Startup Weekend Valencia 2026
        </div>
      </section>

      <section class="team-section">
        <h2 class="section-title">Equipo</h2>
        <div class="team-list">
          <div class="team-member">
            <div class="member-avatar">
              <icon-mdi-lightbulb-on-outline />
            </div>
            <div class="member-info">
              <span class="member-name">Chris</span>
              <span class="member-role">Idea & pitch</span>
            </div>
          </div>
          <div class="team-member">
            <div class="member-avatar">
              <icon-mdi-code-tags />
            </div>
            <div class="member-info">
              <span class="member-name">Adriano</span>
              <span class="member-role">Scraper engine (Python)</span>
            </div>
          </div>
          <div class="team-member">
            <div class="member-avatar">
              <icon-mdi-language-go />
            </div>
            <div class="member-info">
              <span class="member-name">Luis</span>
              <span class="member-role">Backend (Go)</span>
            </div>
          </div>
          <div class="team-member">
            <div class="member-avatar">
              <icon-mdi-cellphone />
            </div>
            <div class="member-info">
              <span class="member-name">Kevin</span>
              <span class="member-role">Frontend (JavaScript)</span>
            </div>
          </div>
          <div class="team-member">
            <div class="member-avatar">
              <icon-mdi-bank-outline />
            </div>
            <div class="member-info">
              <span class="member-name">Oleksandra</span>
              <span class="member-role">Estrategia & legal</span>
            </div>
          </div>
          <div class="team-member">
            <div class="member-avatar">
              <icon-mdi-megaphone />
            </div>
            <div class="member-info">
              <span class="member-name">Nyawira</span>
              <span class="member-role">Marketing</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  </MainLayout>
</template>

<script setup>
import MainLayout from '@/layouts/MainLayout.vue'
</script>

<style scoped>
.about-page {
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
  padding: var(--space-lg) var(--space-md) calc(var(--bottom-nav-height) + var(--safe-bottom) + var(--space-md));
}

/* ── Hero ── */
.hero-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: var(--space-xl) 0;
}

.hero-icon {
  width: 56px;
  height: 56px;
  border-radius: var(--radius-full);
  background: var(--clr-primary-light);
  color: var(--clr-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-2xl);
  margin-bottom: var(--space-md);
}

.hero-section h1 {
  font-size: var(--text-3xl);
  font-weight: 700;
  color: var(--text-dark);
  margin-bottom: var(--space-xs);
}

.tagline {
  font-size: var(--text-lg);
  color: var(--clr-primary);
  font-weight: 600;
  margin-bottom: var(--space-md);
}

.description {
  font-size: var(--text-sm);
  color: var(--text-medium);
  max-width: 320px;
  line-height: 1.6;
}

/* ── Section titles ── */
.section-title {
  font-size: var(--text-xl);
  font-weight: 700;
  color: var(--text-dark);
  margin-bottom: var(--space-md);
  padding-bottom: var(--space-sm);
  border-bottom: 2px solid var(--clr-primary-light);
}

/* ── How it works ── */

.steps {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: var(--space-lg);
  background: var(--surface-elevated);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-light);
  position: relative;
}

.step-number {
  position: absolute;
  top: -8px;
  left: -8px;
  width: 28px;
  height: 28px;
  border-radius: var(--radius-full);
  background: var(--clr-primary);
  color: var(--text-inverse);
  font-size: var(--text-sm);
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.step-icon {
  font-size: 28px;
  color: var(--clr-primary);
  margin-bottom: var(--space-sm);
}

.step h3 {
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--text-dark);
  margin-bottom: var(--space-xs);
}

.step p {
  font-size: var(--text-sm);
  color: var(--text-light);
}

/* ── Project ── */

.project-section p {
  font-size: var(--text-sm);
  color: var(--text-medium);
  line-height: 1.6;
  margin-bottom: var(--space-md);
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-md);
  background: var(--surface-tertiary);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--text-medium);
}

.badge-icon {
  color: var(--clr-primary);
  font-size: var(--text-lg);
}

/* ── Team ── */

.team-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.team-member {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-md);
  background: var(--surface-elevated);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-light);
}

.member-avatar {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-full);
  background: var(--surface-tertiary);
  color: var(--text-medium);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-lg);
  flex-shrink: 0;
}

.member-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.member-name {
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--text-dark);
}

.member-role {
  font-size: var(--text-sm);
  color: var(--text-light);
}
</style>
