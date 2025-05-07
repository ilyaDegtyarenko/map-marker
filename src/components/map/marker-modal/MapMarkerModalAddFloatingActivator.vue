<script
  setup
  lang="ts"
>
  type Emit = {
    (event: 'open'): void
  }

  const emit = defineEmits<Emit>()
</script>

<template>
  <v-btn
    size="large"
    rounded="xl"
    class="fixed bottom-20 left-1/2 -translate-x-1/2 z-[1001]"
    @click="emit('open')"
  >
    <template v-slot:prepend>
      <v-icon icon="mdi-plus" />
    </template>

    {{ $t('add-place') }}
  </v-btn>
</template>
