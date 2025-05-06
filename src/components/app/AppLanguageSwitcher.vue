<script
  setup
  lang="ts"
>
  import { useI18n } from 'vue-i18n'

  const { locale } = useI18n()

  const selectLanguage = (value: string): void => {
    locale.value = value

    localStorage.setItem('userLang', value)
  }
</script>

<template>
  <v-menu>
    <template v-slot:activator="{ props, isActive }">
      <v-btn
        variant="flat"
        v-bind="props"
      >
        <template v-slot:prepend>
          <v-icon icon="mdi-translate" />
        </template>

        <template v-slot:append>
          <v-icon
            icon="mdi-chevron-down"
            :class="{
              'transition-transform': true,
              'rotate-180': isActive,
            }"
          />
        </template>

        {{ $i18n.locale }}
      </v-btn>
    </template>

    <v-list>
      <v-list-item
        v-for="locale in $i18n.availableLocales"
        :key="`locale-${ locale }`"
        :value="locale"
        :active="$i18n.locale === locale"
        @click="selectLanguage(locale)"
      >
        <v-list-item-title class="text-center text-capitalize">
          {{ locale }}
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>
