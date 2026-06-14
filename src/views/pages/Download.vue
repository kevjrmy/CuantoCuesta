<script setup>
import { ref, onMounted } from 'vue'
import AltLayout from '@/layouts/AltLayout.vue'
import IconApple from '~icons/mdi/apple'
import IconExportVariant from '~icons/mdi/export-variant'
import IconPlusBoxOutline from '~icons/mdi/plus-box-outline'
import IconDownload from '~icons/mdi/download'

const isIOS = ref(false)
const isStandalone = ref(false)
const deferredPrompt = ref(null)

onMounted(() => {
  const ua = window.navigator.userAgent
  isIOS.value = /iPad|iPhone|iPod/.test(ua) && !window.MSStream

  // Check if already in standalone mode
  isStandalone.value = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferredPrompt.value = e
  })
})

const handleInstall = async () => {
  if (deferredPrompt.value) {
    deferredPrompt.value.prompt()
    const { outcome } = await deferredPrompt.value.userChoice
    if (outcome === 'accepted') {
      deferredPrompt.value = null
    }
  } else {
    alert("To install the app, look for the 'Add to Home Screen' option in your browser menu.")
  }
}
</script>

<template>
  <AltLayout>
    <main class="download-page">
      <div class="content">
        <img src="/logo-full.svg" alt="CuantoCuesta Logo" class="logo" />

        <div v-if="isStandalone" class="state-already-installed fade-in">
          <h2>App Installed</h2>
          <p>You are already using the app natively!</p>
          <router-link to="/" class="btn btn-primary">Go to Home</router-link>
        </div>

        <div v-else-if="isIOS" class="state-ios fade-in">
          <h2>Install on iOS</h2>
          <p>To get the best experience, add CuantoCuesta to your Home Screen:</p>
          <ol class="ios-instructions">
            <li>Tap the Share icon
              <IconExportVariant class="inline-icon" /> at the bottom of Safari.
            </li>
            <li>Scroll down and tap <strong>"Add to Home Screen"</strong>
              <IconPlusBoxOutline class="inline-icon" />.
            </li>
          </ol>
        </div>

        <div v-else class="state-android fade-in">
          <h2>Download the App</h2>
          <p>Get the best experience and faster access by installing our app directly to your device.</p>
          <button class="btn btn-primary" @click="handleInstall">
            <IconDownload /> Install App
          </button>
        </div>
        
        <div class="skip-action">
          <router-link to="/" class="link-secondary">Go to homepage</router-link>
        </div>
      </div>
    </main>
  </AltLayout>
</template>

<style scoped>
.download-page {
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-lg);
  background: var(--surface-primary);
  text-align: center;
}

.content {
  max-width: 400px;
  width: 100%;
}

.logo {
  height: 60px;
  margin: 0 auto var(--space-2xl);
}

h2 {
  font-size: var(--text-2xl);
  color: var(--text-dark);
  margin-bottom: var(--space-md);
}

p {
  color: var(--text-medium);
  margin-bottom: var(--space-xl);
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  width: 100%;
  padding: var(--space-md) var(--space-lg);
  border-radius: var(--radius-full);
  font-weight: 600;
  font-size: var(--text-lg);
  transition: all var(--duration-fast) var(--ease-out);
}

.btn-primary {
  background: var(--clr-primary);
  color: var(--text-inverse);
  box-shadow: var(--shadow-md);
}

.btn-primary:hover {
  background: var(--clr-primary-dark);
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.ios-instructions {
  text-align: left;
  background: var(--surface-secondary);
  padding: var(--space-lg);
  border-radius: var(--radius-lg);
  list-style: none;
  border: 1px solid var(--border-light);
}

.ios-instructions li {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  margin-bottom: var(--space-md);
  color: var(--text-dark);
  font-size: var(--text-base);
  line-height: 1.4;
}

.ios-instructions li:last-child {
  margin-bottom: 0;
}

.inline-icon {
  color: var(--clr-primary);
  font-size: 1.4em;
  flex-shrink: 0;
}

.fade-in {
  animation: fadeIn 0.4s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.skip-action {
  margin-top: var(--space-xl);
}

.link-secondary {
  color: var(--text-medium);
  font-size: var(--text-base);
  font-weight: 500;
  text-decoration: underline;
  text-decoration-color: transparent;
  transition: all var(--duration-fast) var(--ease-default);
}

.link-secondary:hover {
  color: var(--clr-primary);
  text-decoration-color: var(--clr-primary);
}
</style>
