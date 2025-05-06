<template>
  <div
    class="
        z-[1100]
        fixed
        top-0
        left-0
        w-full
        h-full
        flex
        flex-col
        items-center
        justify-center
        gap-4
        bg-[rgb(var(--v-theme-surface))]
    "
  >
    <div class="w-28">
      <img
        src="/apple-touch-icon.png"
        alt="Loader icon"
        draggable="false"
      />
    </div>

    <div class="flex items-center gap-2">
      <v-progress-circular
        color="primary"
        indeterminate
        size="16"
        width="2"
      />

      <div class="text-md text-[rgba(var(--v-theme-on-surface),var(--v-high-emphasis-opacity))]">
        {{ $t('loading') }}...
      </div>
    </div>
  </div>
</template>
