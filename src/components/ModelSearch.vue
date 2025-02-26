<script setup lang="ts">
const props = defineProps<{
  modelId: string
}>()

const emit = defineEmits<{
  (e: 'update:model-id', value: string): void
}>()

const searchText = ref('')
const searchResults = ref<string[]>([])
const loading = ref(false)
const isSelecting = ref(false)

async function searchModels(query: string) {
  if (!query) {
    searchResults.value = []
    return
  }

  loading.value = true
  try {
    const res = await fetch(`https://huggingface.co/api/models?search=${query}`)
    const data = await res.json()
    searchResults.value = data.map((item: any) => item.id)
  }
  catch (err) {
    console.error(err)
    searchResults.value = []
  }
  loading.value = false
}

const debouncedSearch = useDebounceFn(searchModels, 300)

watch(searchText, (val) => {
  if (!isSelecting.value) {
    debouncedSearch(val)
  }
  isSelecting.value = false
})

function selectModel(modelName: string) {
  isSelecting.value = true
  searchText.value = modelName
  searchResults.value = []
  emit('update:model-id', modelName)
}

watch(() => props.modelId, (newId) => {
  if (newId && !searchText.value) {
    isSelecting.value = true
    searchText.value = newId
  }
})
</script>

<template>
  <div class="w-full">
    <div class="relative">
      <input
        v-model="searchText"
        type="text"
        placeholder="搜索模型..."
        class="w-full border-2 border-gray-200 rounded-lg bg-white px-4 py-3 text-gray-800 outline-none transition-colors dark:border-gray-700 focus:border-green-500 dark:bg-gray-900 dark:text-gray-200"
      >
      <div v-if="loading" class="absolute right-3 top-1/2 -translate-y-1/2">
        <div class="h-5 w-5 animate-spin border-2 border-gray-300 border-t-green-500 rounded-full" />
      </div>
    </div>

    <div v-if="loading && !searchResults.length" class="mt-2 px-2 text-sm text-gray-500 dark:text-gray-400">
      搜索中...
    </div>

    <div v-else-if="searchResults.length" class="mt-2 max-h-64 overflow-auto border border-gray-200 rounded-lg bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <div
        v-for="result in searchResults"
        :key="result"
        class="cursor-pointer border-b border-gray-100 px-4 py-3 text-gray-800 transition-colors last:border-b-0 dark:border-gray-800 hover:bg-green-50 dark:text-gray-200 hover:text-green-700 dark:hover:bg-gray-800 dark:hover:text-green-400"
        @click="selectModel(result)"
      >
        {{ result }}
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Optional: Add a subtle green glow on focus */
input:focus {
  box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.2);
}
</style>
