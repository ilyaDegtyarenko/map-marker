import type { MarkerData, MarkerItem, PlaceTypeOption } from '@/ts/types/map.ts'
import type { User } from '@/ts/types/user.ts'
import type { Place } from '@/ts/types/place.ts'
import type { useI18n } from 'vue-i18n'
import { PlaceTypeEnum } from '@/ts/enums/place.ts'
import L from 'leaflet'
import axiosInstance from '@/api/axiosInstance.ts'
import placeApi from '@/api/endpoints/place.api.ts'
import { userService } from '@/services/user.service.ts'

export const mapService = {
  /**
   * Retrieves all places using the specified API.
   *
   * @function
   * @returns A promise that resolves to an array of place objects.
   */
  getAllPlaces: () => placeApi(axiosInstance).all(),

  /**
   * Generates a random geographical coordinate within the specified area of Dnipro.
   *
   * @returns {L.LatLngTuple} A tuple containing the randomly generated latitude and longitude.
   */
  generateRandomGeoInDnipro: (): L.LatLngTuple => {
    const lat = +(48.45 + Math.random() * 0.02).toFixed(6)
    const lng = +(35.05 + Math.random() * 0.02).toFixed(6)

    return [ lat, lng ]
  },

  /**
   * Generates marker data based on the provided marker item and its active state.
   * The returned marker data includes the type, name, coordinates, and the icon configuration.
   *
   * @param markerItem - The marker item containing details of the location or user.
   * @param [active=false] - Indicates if the marker should use the active state styling.
   * @returns {MarkerData} - The configured marker data including type, name, coordinates, and icon.
   */
  getMarkerData: (markerItem: MarkerItem, active = false): MarkerData => {
    const icon: L.IconOptions = {
      iconUrl: `/img/marker-person${ active ? '-active' : '' }.png`,
      iconSize: [ 32, 32 ],
      iconAnchor: [ 16, 32 ],
      popupAnchor: [ 0, -32 ],
      shadowUrl: '/img/marker-shadow.png',
      shadowSize: [ 41, 41 ],
      shadowAnchor: [ 13, 41 ],
    }

    if (mapService.isUserMarker(markerItem)) {
      return {
        type: 'user',
        name: markerItem.name,
        coordinates: [ markerItem.address.geo.lat, markerItem.address.geo.lng ],
        icon: L.icon(icon),
      }
    }

    // Adjust the icon for places based on their type and whether they are active
    icon.iconUrl = `/img/marker-${ markerItem.type }${ active ? '-active' : '' }.png`

    return {
      type: markerItem.type,
      name: markerItem.name,
      coordinates: markerItem.coordinates,
      icon: L.icon(icon),
    }
  },

  /**
   * Generates a list of place type options based on the `PlaceTypeEnum` values.
   *
   * @param t - A translation function used to fetch localized strings for place types.
   * @returns {PlaceTypeOption[]} An array of place type options, each containing a `title` for the localized name and a `value` corresponding to the enum value.
   */
  getPlaceTypeOptions: (t: ReturnType<typeof useI18n>['t']): PlaceTypeOption[] => {
    return Object.values(PlaceTypeEnum)
      .map((value) => ({
        title: t(`placeType.${ value }`),
        value,
      }))
  },

  /**
   * Type guard function to determine if the given marker item is a Place.
   *
   * @param markerItem - The marker item to be checked.
   * @returns {boolean} - Returns true if the marker item is of type Place, otherwise false.
   */
  isPlaceMarker: (markerItem: MarkerItem): markerItem is Place => {
    return (markerItem as Place).coordinates !== undefined
  },

  /**
   * Type guard function to determine if the given marker item is a User.
   *
   * @param markerItem - The marker item to be checked.
   * @returns {markerItem is User} - Returns true if the marker item is of type User, otherwise false.
   */
  isUserMarker: (markerItem: MarkerItem): markerItem is User => {
    return (markerItem as User).address !== undefined
  },

  /**
   * Finds the three users closest to the given geographical coordinates.
   *
   * @param users - An array of user objects, each containing geographical coordinates in their address property.
   * @param latLng - A tuple representing the latitude and longitude to compare against.
   * @returns {User[]} An array of up to three users closest to the provided latitude and longitude.
   */
  getNearestUsers: (users: User[], latLng: L.LatLngTuple): User[] => {
    const point = L.latLng(latLng)

    const userPoints = users.map((user) => {
      return {
        user,
        latLng: L.latLng(user.address.geo),
      }
    })

    userPoints.sort((a, b) => {
      return point.distanceTo(a.latLng) - point.distanceTo(b.latLng)
    })

    return userPoints.slice(0, 3).map(({ user }) => user)
  },

  /**
   * Removes all marker layers from the specified Leaflet map instance.
   *
   * @param map - The Leaflet map instance from which all markers will be removed.
   * @returns {void}
   */
  clearAllMarkers: (map: L.Map): void => {
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer)
      }
    })
  },

  /**
   * Filters an array of places based on specified place type filters.
   *
   * @function
   * @param places - An array of Place objects to filter.
   * @param placeTypeFilter - An array of place type enums used as the filter criteria.
   * @returns {Place[]} A new array of Place objects that match the specified type filters
   */
  getFilteredPlaces: (places: Place[], placeTypeFilter: PlaceTypeEnum[]): Place[] => {
    return places
      .filter((place) => placeTypeFilter.includes(place.type))
  },

  /**
   * Adds a marker to the provided Leaflet map with specified data and functionality.
   *
   * @param map - An instance of the Leaflet map where the marker will be added.
   * @param markerItem - The data representing the marker to be added.
   * @param [active=false] - A flag indicating whether the marker should be active.
   * @param onClick - The callback function to be executed when the marker is clicked.
   */
  addMarker: (
    map: L.Map,
    markerItem: MarkerItem,
    active = false,
    onClick: (markerItem: MarkerItem) => void,
  ): void => {
    const markerData = mapService.getMarkerData(markerItem, active)

    const marker = L
      .marker(markerData.coordinates, { icon: markerData.icon })
      .addTo(map)

    marker.on('click', () => onClick(markerItem))
  },

  /**
   * Adds markers to a Leaflet map based on provided places, users, and filters.
   *
   * @param map - The Leaflet map instance to add markers to.
   * @param places - A list of places to add as markers on the map.
   * @param users - A list of users to add as markers on the map.
   * @param nearestUsers - A list of nearest users to highlight on the map.
   * @param placeTypeFilter - Filters to specify which types of places should have markers added.
   * @param userShowAllFilter - A boolean flag indicating if all users should have markers added or just the nearest users.
   * @param onClick - The callback function that will be triggered when a marker is clicked. It receives a `MarkerItem` as an argument.
   * @param [selectedMarker] - An optional parameter representing the currently selected marker, if any.
   * @returns {void} This function does not return any value.
   */
  addMarkersToMap: (
    map: L.Map,
    places: Place[],
    users: User[],
    nearestUsers: User[],
    placeTypeFilter: PlaceTypeEnum[],
    userShowAllFilter: boolean,
    onClick: (markerItem: MarkerItem) => void,
    selectedMarker?: MarkerItem | null,
  ): void => {
    mapService.getFilteredPlaces(places, placeTypeFilter)
      .forEach((place) => {
        return mapService.addMarker(
          map,
          place,
          selectedMarker?.id === place.id,
          onClick,
        )
      })

    if (userShowAllFilter) {
      const nearestUserIds = userService.getUserIds(nearestUsers)

      users.forEach((user) => {
        mapService.addMarker(
          map,
          user,
          nearestUserIds.includes(user.id),
          onClick,
        )
      })
    } else {
      nearestUsers.forEach((user) => {
        mapService.addMarker(map, user, true, onClick)
      })
    }
  },
}
