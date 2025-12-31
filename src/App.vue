<template>
  <div id="app">
    <TopNav />
    <router-view />
  </div>
</template>

<script setup lang="ts">
import TopNav from '@/components/TopNav.vue'
</script>

<style lang="scss">
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>

