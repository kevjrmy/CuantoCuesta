<template>
  <MainLayout>
    <Header @toggle-menu="isDrawerOpen = true" />
    <Map ref="mapRef" :items="items" />
    <MenuDrawer :is-open="isDrawerOpen" @close="isDrawerOpen = false" />
  </MainLayout>
</template>

<script setup>
import { ref } from 'vue'
import MainLayout from '@/layouts/MainLayout.vue'
import Header from '@/components/home/Header.vue'
import Map from '@/components/home/Map.vue'
import MenuDrawer from '@/components/inc/MenuDrawer.vue'
import mockData from '@/data/cuanto_cuesta.json'

const isDrawerOpen = ref(false)
const items = mockData.items
</script>