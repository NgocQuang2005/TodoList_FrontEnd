<script setup>
import { RouterView } from 'vue-router';
</script>

<template>
  <div id="app">
    <RouterView />
    
    <!-- Global Toast Container -->
    <Toast position="top-right" group="app" />
  </div>
</template>

<style scoped>
#app {
  min-height: 100vh;
  background-color: #f8fafc;
}
</style>
