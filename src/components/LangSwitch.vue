<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

function toggleLocale() {
  locale.value = locale.value === 'zh' ? 'en' : 'zh'
}
</script>

<template>
  <button
    class="flex items-center gap-1 rounded px-2 py-1 text-sm text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
    @click="toggleLocale"
  >
    <div i-carbon-language class="h-4 w-4" />
    {{ locale.toUpperCase() }}
  </button>
</template>
