<script
  setup
  lang="ts"
>
  import type { MarkerItem } from '@/ts/types/map.ts'
  import type { Place } from '@/ts/types/place.ts'
  import type { User } from '@/ts/types/user.ts'
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { mapService } from '@/services/map.service.ts'

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

  const nearestUserNamesWithDistance = computed<string>(() => {
    return props.nearestUsers
      .map((user) => {
        const distance = mapService.getDistanceBetweenCoords(
          [ user.address.geo.lat, user.address.geo.lng ],
          (props.item as Place).coordinates,
        )

        return user.name + ` (${ distance })`
      })
      .join(', ')
  })

  const listItems = computed<ListItem[]>(() => {
    if (mapService.isPlaceMarker(props.item)) {
      return getPlaceListItems(props.item)
    }

    return getUserListItems(props.item)
  })

  const getPlaceListItems = (item: Place): ListItem[] => {
    return [
      {
        title: t('place.name'),
        subtitle: item.name,
      },
      {
        title: t('type'),
        subtitle: t('placeType.' + item.type),
      },
      {
        title: t('coordinates'),
        subtitle: item.coordinates.join(', '),
      },
      {
        title: t('nearest-people'),
        subtitle: nearestUserNamesWithDistance.value,
      },
    ]
  }

  const getUserListItems = (item: User): ListItem[] => {
    return [
      {
        title: t('user.name'),
        subtitle: item.name,
      },
      {
        title: t('phone'),
        subtitle: item.phone,
      },
      {
        title: t('coordinates'),
        subtitle: item.address.geo.lat + ', ' + item.address.geo.lng,
      },
    ]
  }
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
