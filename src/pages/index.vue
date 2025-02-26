<script setup lang="ts">
const modelId = ref('')
</script>

<template>
  <div class="h-screen flex flex-col">
    <div class="flex-none p-8">
      <h1 class="text-2xl font-bold">
        Tokenizer 查看器
      </h1>
    </div>

    <div class="flex flex-1 flex-col gap-4 px-8 pb-8">
      <ModelSearch v-model:model-id="modelId" class="flex-none" />
      <TokenizerView :model-id="modelId" class="" />
    </div>
  </div>
</template>
