<script setup>
import { ref, computed } from 'vue'
import MainLayout from '@/layouts/MainLayout.vue'

const metrics = ref([
  { id: 1, label: 'Indexed Places', value: '1,402', change: '+12%', positive: true },
  { id: 2, label: 'Avg Haircut', value: '14.50€', change: '+0.50€', positive: false },
  { id: 3, label: 'Categories', value: '45', change: '0', positive: true }
])

const chartData = ref([
  { label: 'Jan', value: 35, color: 'var(--color-primary, #6366f1)' },
  { label: 'Feb', value: 45, color: 'var(--color-primary, #6366f1)' },
  { label: 'Mar', value: 40, color: 'var(--color-primary, #6366f1)' },
  { label: 'Apr', value: 60, color: 'var(--color-primary, #6366f1)' },
  { label: 'May', value: 75, color: 'var(--color-primary, #6366f1)' },
  { label: 'Jun', value: 90, color: 'var(--color-primary, #6366f1)' }
])

// Calculate max for bar chart scaling
const maxChartValue = computed(() => {
  return Math.max(...chartData.value.map(d => d.value))
})
</script>

<template>
  <MainLayout>
    <div class="app-main dashboard-page">
    <header class="dashboard-header">
      <h1 class="page-title">Market Overview</h1>
      <p class="page-subtitle">Valencia, Spain</p>
    </header>

    <section class="metrics-grid">
      <div v-for="metric in metrics" :key="metric.id" class="metric-card">
        <span class="metric-label">{{ metric.label }}</span>
        <div class="metric-value-row">
          <span class="metric-value">{{ metric.value }}</span>
          <span class="metric-change" :class="metric.positive ? 'is-positive' : 'is-negative'">
            {{ metric.change }}
          </span>
        </div>
      </div>
    </section>

    <section class="chart-section">
      <h2 class="section-title">Price Index Trend</h2>
      <div class="bar-chart">
        <div 
          v-for="(point, idx) in chartData" 
          :key="idx" 
          class="bar-column"
        >
          <div class="bar-wrapper">
            <div 
              class="bar-fill" 
              :style="{ 
                height: `${(point.value / maxChartValue) * 100}%`,
                backgroundColor: point.color
              }"
            ></div>
          </div>
          <span class="bar-label">{{ point.label }}</span>
        </div>
      </div>
    </section>
    
    <section class="recent-insights">
      <h2 class="section-title">Latest Insights</h2>
      <ul class="insights-list">
        <li class="insight-item">
          <div class="insight-icon">💡</div>
          <div class="insight-content">
            <span><strong>Barbershops</strong> are 15% cheaper in Russafa compared to Eixample.</span>
          </div>
        </li>
        <li class="insight-item">
          <div class="insight-icon">📈</div>
          <div class="insight-content">
            <span><strong>Gym memberships</strong> average at 35€/mo this season.</span>
          </div>
        </li>
      </ul>
    </section>
  </div>
  </MainLayout>
</template>

<style scoped>
.dashboard-page {
  /* Use app-main for safe area padding */
  background-color: var(--color-background, #f9fafb);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.dashboard-header {
  margin-top: 1rem;
}

.page-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-text, #111827);
  margin: 0 0 0.25rem 0;
  letter-spacing: -0.02em;
}

.page-subtitle {
  font-size: 1rem;
  color: var(--color-text-muted, #6b7280);
  margin: 0;
}

/* Metrics Grid */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

/* Make the first metric card stand out taking full width */
.metric-card:first-child {
  grid-column: 1 / -1;
}

.metric-card {
  background: var(--color-surface, #ffffff);
  border-radius: 1rem;
  padding: 1.25rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.metric-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-muted, #6b7280);
}

.metric-value-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}

.metric-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text, #111827);
}

.metric-change {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
}

.is-positive {
  background-color: #dcfce7;
  color: #166534;
}

.is-negative {
  background-color: #fee2e2;
  color: #991b1b;
}

/* Chart Section */
.chart-section {
  background: var(--color-surface, #ffffff);
  border-radius: 1rem;
  padding: 1.25rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
}

.section-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-text, #111827);
  margin: 0 0 1rem 0;
}

.bar-chart {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  height: 140px;
  padding-top: 1rem;
  gap: 0.5rem;
}

.bar-column {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  height: 100%;
}

.bar-wrapper {
  width: 100%;
  max-width: 32px;
  flex-grow: 1;
  background-color: var(--color-border, #f3f4f6);
  border-radius: 0.5rem;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: flex-end;
}

.bar-fill {
  width: 100%;
  border-radius: 0.5rem;
  transition: height 0.5s ease;
}

.bar-label {
  font-size: 0.75rem;
  color: var(--color-text-muted, #6b7280);
  margin-top: 0.5rem;
}

/* Insights Section */
.recent-insights {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.insights-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.insight-item {
  display: flex;
  gap: 1rem;
  background: var(--color-surface, #ffffff);
  padding: 1rem;
  border-radius: 1rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  align-items: center;
}

.insight-icon {
  font-size: 1.25rem;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  background: var(--color-background, #f9fafb);
  border-radius: 50%;
}

.insight-content {
  font-size: 0.875rem;
  line-height: 1.4;
  color: var(--color-text-secondary, #374151);
}

.insight-content strong {
  color: var(--color-text, #111827);
  font-weight: 600;
}
</style>
