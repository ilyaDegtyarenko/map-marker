import { PlaceTypeEnum } from '@/ts/enums/place.ts'
import type { ComputedRef } from 'vue'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

type Option = {
  title: string
  value: PlaceTypeEnum
}

export const getPlaceTypeOptions = (): ComputedRef<Option[]> => {
  const { t } = useI18n()

  return computed(() => {
    return Object.values(PlaceTypeEnum)
      .map((value) => ({
        title: t(`placeType.${ value }`),
        value,
      }))
  })
}
