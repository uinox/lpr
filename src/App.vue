<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="header">
  </div>
  <main style="height: 100%;">
    <RouterView />
  </main>
  <div class="footer">
    <a href="https://beian.miit.gov.cn/">京ICP备17049124</a>
  </div>
</template>

<style scoped>
.footer{
  text-align: center;height: 50px;background-color: #fafafa;line-height: 50px;
}
.footer a {
  color: #b0b0b0
}
.footer a:hover {
  background-color: #fafafa;
}
</style>
