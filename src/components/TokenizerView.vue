<script setup lang="ts">
import { AutoTokenizer } from '@huggingface/transformers'
import Splitter from 'primevue/splitter'

import SplitterPanel from 'primevue/splitterpanel'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  modelId: string
}>()

const { t } = useI18n()

const inputText = ref('')
const tokens = ref<{ text: string, id: number }[]>([])
const loading = ref(false)
const downloading = ref(false)
const leftPanel = ref<HTMLElement>()

let tokenizer: any = null

watch(() => props.modelId, async (newId) => {
  if (!newId)
    return

  loading.value = true
  downloading.value = true
  try {
    tokenizer = await AutoTokenizer.from_pretrained(newId)
    if (inputText.value) {
      updateTokens()
    }
  }
  catch (err) {
    console.error(err)
  }
  loading.value = false
  downloading.value = false
})

function updateTokens() {
  if (!tokenizer || !inputText.value) {
    tokens.value = []
    return
  }

  const encoded = tokenizer.encode(inputText.value)
  const decoded = encoded.map((id: number) => ({
    id,
    text: tokenizer.decode([id]),
  }))
  tokens.value = decoded
}

watch(inputText, updateTokens)

// 添加计算属性
const stats = computed(() => {
  return {
    characters: inputText.value.length,
    tokens: tokens.value.length,
  }
})
</script>

<template>
  <Splitter class="f flex gap-1 overflow-auto">
    <SplitterPanel>
      <div class="relative h-full">
        <textarea
          v-model="inputText"
          :placeholder="t('tokenizer.inputPlaceholder')"
          class="h-full min-h-[200px] w-full resize-none overflow-y-scroll border-2 border-gray-200 rounded-lg bg-white p-4 text-gray-800 outline-none transition-colors dark:border-gray-700 focus:border-green-500 dark:bg-gray-900 dark:text-gray-200 focus:shadow-[0_0_0_2px_rgba(34,197,94,0.2)]"
          :disabled="loading"
        />
        <div
          class="absolute bottom-2 left-3 flex gap-3 rounded-sm bg-white p-2 pb-0 pl-0 text-sm text-gray-500 dark:text-gray-400"
          :class="{ 'opacity-50': loading }"
        >
          <div class="flex items-center gap-1">
            <div i-carbon-text-font class="h-4 w-4" />
            {{ stats.characters }} {{ t('tokenizer.characters') }}
          </div>
          <div class="flex items-center gap-1">
            <div i-carbon-code class="h-4 w-4" />
            {{ stats.tokens }} {{ t('tokenizer.tokens') }}
          </div>
        </div>
      </div>
    </SplitterPanel>

    <SplitterPanel class="flex border-2 border-gray-200 rounded-lg bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
      <div v-if="downloading" class="flex flex-1 flex-col items-center justify-center py-8 text-gray-500 dark:text-gray-400">
        <div class="mb-4 h-8 w-8 animate-spin border-2 border-gray-300 border-t-green-500 rounded-full" />
        <div class="mb-2 text-base font-medium">
          {{ t('tokenizer.downloading') }}
        </div>
        <div class="text-sm">
          {{ t('tokenizer.downloadingHint') }}
        </div>
      </div>
      <div v-else-if="loading" class="flex flex-1 flex-col items-center justify-center py-8 text-gray-500 dark:text-gray-400">
        <div class="mb-4 h-8 w-8 animate-spin border-2 border-gray-300 border-t-green-500 rounded-full" />
        <div class="mb-2 text-base font-medium">
          {{ t('tokenizer.initializing') }}
        </div>
      </div>
      <div
        v-else-if="tokens.length === 0 && inputText"
        class="flex flex-1 items-center justify-center text-gray-500 dark:text-gray-400"
      >
        {{ t('tokenizer.noTokens') }}
      </div>
      <div
        v-else-if="tokens.length === 0"
        class="flex flex-1 items-center justify-center text-gray-500 dark:text-gray-400"
      >
        {{ t('tokenizer.enterText') }}
      </div>
      <div v-else class="f overflow-auto">
        <div class="flex flex-wrap">
          <TokenBlock v-for="(token, idx) in tokens" :id="token.id" :key="idx" :token="token.text" />
        </div>
      </div>
    </SplitterPanel>
  </Splitter>
</template>

<style scoped>
.group:hover::before,
.group:hover::after {
  content: '';
  position: absolute;
  top: 50%;
  height: 2rem;
  width: 2px;
  transform: translateY(-50%);
  background-color: #22c55e;
  /* Green-500 */
  border-radius: 9999px;
}

.group:hover::before {
  left: -3px;
}

.group:hover::after {
  right: -3px;
}

/* Disabled state for textarea */
textarea:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* 确保统计信息不会被文本遮挡 */
textarea {
  padding-bottom: 2.5rem;
}
</style>
