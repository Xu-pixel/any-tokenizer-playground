<script setup lang="ts">
defineProps<{
  token: string
  id: number
}>()
</script>

<template>
  <div class="m-1 inline-flex flex-col items-center rounded bg-gray-100 p-2 dark:bg-gray-800">
    <span class="text-sm">{{ token }}</span>
    <span class="text-xs text-gray-500">{{ id }}</span>
  </div>
</template>
