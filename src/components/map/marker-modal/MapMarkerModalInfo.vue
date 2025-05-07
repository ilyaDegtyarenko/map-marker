<script
  setup
  lang="ts"
>
  import type { MarkerItem } from '@/ts/types/map.ts'
  import type { User } from '@/ts/types/user.ts'
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { mapService } from '@/services/map.service.ts'
  import { userService } from '@/services/user.service.ts'

  type Props = {
    item: MarkerItem
    nearestUsers: User[]
  }

  type ListItem = {
    title: string
    subtitle: string
  }

  type Emit = {
    (event: 'close'): void
  }

  const props = defineProps<Props>()
  const emit = defineEmits<Emit>()

  const { t } = useI18n()

  const showModal = computed<boolean>({
    get() {
      return !!props.item
    },
    set() {
      emit('close')
    },
  })

  const cardTitle = computed<string>(() => {
    if (mapService.isPlaceMarker(props.item)) {
      return t('placeType.' + props.item.type)
    }

    return t('person')
  })

  const nearestUserNames = computed<string>(() => {
    return userService.getUserNames(props.nearestUsers)
      .join(', ')
  })

  const listItems = computed<ListItem[]>(() => {
    if (mapService.isPlaceMarker(props.item)) {
      return [
        {
          title: t('name'),
          subtitle: props.item.name,
        },
        {
          title: t('type'),
          subtitle: t('placeType.' + props.item.type),
        },
        {
          title: t('coordinates'),
          subtitle: props.item.coordinates.join(', '),
        },
        {
          title: t('nearest-people'),
          subtitle: nearestUserNames.value,
        },
      ]
    }

    return [
      {
        title: t('name'),
        subtitle: props.item.name,
      },
      {
        title: t('phone'),
        subtitle: props.item.phone,
      },
      {
        title: t('coordinates'),
        subtitle: props.item.address.geo.lat + ', ' + props.item.address.geo.lng,
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
