<script
  setup
  lang="ts"
>
  import type { MarkerItem } from '@/ts/types/map.ts'
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useSyncProp } from '@/composables/useSyncProp.ts'
  import { isPlaceMarker } from '@/utils/isPlaceMarker.ts'

  type Props = {
    item: MarkerItem
  }

  type ListItem = {
    title: string
    subtitle: string
  }

  type Emit = {
    (event: 'update:item', value: null): void
  }

  const props = defineProps<Props>()
  const emit = defineEmits<Emit>()

  const { t } = useI18n()

  const itemModel = useSyncProp<MarkerItem>(props, 'item', emit)

  const showModal = computed<boolean>({
    get() {
      return !!itemModel.value
    },
    set() {
      itemModel.value = null
    },
  })

  const cardTitle = computed<string>(() => {
    if (isPlaceMarker(itemModel.value)) {
      return t('placeType.' + itemModel.value.type)
    }

    return t('person')
  })

  const listItems = computed<ListItem[]>(() => {
    if (isPlaceMarker(itemModel.value)) {
      return [
        {
          title: t('name'),
          subtitle: itemModel.value.name,
        },
        {
          title: t('type'),
          subtitle: t('placeType.' + itemModel.value.type),
        },
        {
          title: t('coordinates'),
          subtitle: itemModel.value.coordinates.join(', '),
        },
      ]
    }

    return [
      {
        title: t('name'),
        subtitle: itemModel.value.name,
      },
      {
        title: t('phone'),
        subtitle: itemModel.value.phone,
      },
      {
        title: t('coordinates'),
        subtitle: itemModel.value.address.geo.lat + ', ' + itemModel.value.address.geo.lng,
      },
    ]
  })
</script>

<template>
  <v-dialog
    v-model="showModal"
    :scrim="false"
    max-width="400"
  >
    <template v-slot:default="{ isActive }">
      <v-card :title="cardTitle">
        <v-card-text>
          <v-list
            density="compact"
            lines="two"
          >
            <v-list-item
              v-for="(item, index) in listItems"
              :key="index"
            >
              <v-list-item-title>
                {{ item.title }}
              </v-list-item-title>

              <v-list-item-subtitle>
                {{ item.subtitle }}
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card-text>

        <v-card-actions>
          <v-btn
            variant="plain"
            @click="isActive.value = false"
          >
            {{ $t('close') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>
