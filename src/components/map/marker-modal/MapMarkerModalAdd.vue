<script
  setup
  lang="ts"
>
  import type { Place } from '@/ts/types/place.ts'
  import type { LatLngLiteral } from 'leaflet'
  import { PlaceTypeEnum } from '@/ts/enums/place.ts'
  import L from 'leaflet'
  import { computed, ref, useTemplateRef } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useMapStore } from '@/stores/map.ts'
  import { mapService } from '@/services/map.service.ts'

  type Props = {
    coordinates?: L.LatLngLiteral | null
  }

  type Emit = {
    (event: 'close'): void
    (event: 'add', value: Place): void
  }

  type FormValues = Omit<Place, 'coordinates'> & Omit<LatLngLiteral, 'alt'>

  const props = defineProps<Props>()
  const emit = defineEmits<Emit>()

  const formRef = useTemplateRef('formRef')

  const { t } = useI18n()
  const mapStore = useMapStore()

  const formValues = ref<FormValues>({
    id: 0,
    name: '',
    type: PlaceTypeEnum.Store,
    lat: props.coordinates?.lat || 0,
    lng: props.coordinates?.lng || 0,
  })

  const formRules = {
    name: [
      (v: string) => !!v || t('form.rule.place.name-required'),
      (v: string) => (v && v.length <= 20) || t('form.rule.place.name-max'),
    ],
    type: [ (v: string) => !!v || t('form.rule.place.type-required') ],
    coordinates: [ (v: number) => !!v || t('form.rule.place.coordinates-required') ],
  }

  const maxPlaceId = computed<number>(() => {
    return mapStore.places.reduce((result, value) => Math.max(result, value.id), 0)
  })

  const placeTypeOptions = computed(() => {
    return mapService.getPlaceTypeOptions(t)
  })

  const submit = async (): Promise<void> => {
    if (!formRef.value) {
      return
    }

    const { valid } = await formRef.value.validate()

    if (!valid) {
      return
    }

    emit('add', {
      ...formValues.value,
      id: maxPlaceId.value + 1,
      coordinates: [ formValues.value.lat, formValues.value.lng ],
    })
  }
</script>

<template>
  <v-dialog
    :model-value="true"
    max-width="400"
    @update:model-value="emit('close')"
  >
    <template v-slot:default="{ isActive }">
      <v-card :title="$t('add-place')">
        <v-card-text>
          <v-form
            ref="formRef"
            class="flex flex-col gap-2"
          >
            <v-card-subtitle class="pl-0">
              {{ $t('general-information') }}
            </v-card-subtitle>

            <v-text-field
              v-model="formValues.name"
              :counter="20"
              :rules="formRules.name"
              :label="$t('place.name')"
              required
              autofocus
            />

            <v-select
              v-model="formValues.type"
              :items="placeTypeOptions"
              :rules="formRules.type"
              :label="$t('type')"
              required
            />

            <v-card-subtitle class="pl-0">
              {{ $t('coordinates') }}
            </v-card-subtitle>

            <v-row>
              <v-col>
                <v-number-input
                  v-model.number="formValues.lat"
                  :rules="formRules.coordinates"
                  :label="$t('latitude')"
                  required
                  :precision="null"
                  control-variant="hidden"
                />
              </v-col>

              <v-col>
                <v-number-input
                  v-model.number="formValues.lng"
                  :rules="formRules.coordinates"
                  :label="$t('longitude')"
                  required
                  :precision="null"
                  control-variant="hidden"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-btn
            variant="plain"
            @click="isActive.value = false"
          >
            {{ $t('close') }}
          </v-btn>

          <v-btn
            color="primary"
            variant="tonal"
            @click="submit()"
          >
            {{ $t('add') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>
