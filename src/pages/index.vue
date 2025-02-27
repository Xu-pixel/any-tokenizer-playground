<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const modelId = ref('')
</script>

<template>
  <div class="h-screen flex flex-col">
    <div class="flex flex-none items-center justify-between p-8">
      <h1 class="text-2xl font-bold">
        {{ t('title') }}
      </h1>
      <LangSwitch />
    </div>

    <div class="flex flex-1 flex-col gap-4 px-8 pb-8">
      <ModelSearch v-model:model-id="modelId" class="flex-none" />
      <TokenizerView :model-id="modelId" class="" />
    </div>
  </div>
</template>
