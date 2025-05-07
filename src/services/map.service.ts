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
   * Adds place markers to a Leaflet map based on filtered places and selection criteria.
   *
   * @param map The Leaflet map instance where markers will be added.
   * @param places An array of all available places to potentially add as markers.
   * @param placeTypeFilter An array of place types used to filter which places should be included as markers.
   * @param onClick A callback function invoked when a marker is clicked, receiving the clicked marker as its argument.
   * @param clearSelectedMarker A function invoked to clear the currently selected marker when its criteria are no longer met.
   * @param [selectedMarker] The currently selected marker, if any, to differentiate its appearance or remove it if it no longer matches the filter.
   * @returns {void}
   */
  addPlaceMarkers: (
    map: L.Map,
    places: Place[],
    placeTypeFilter: PlaceTypeEnum[],
    onClick: (markerItem: MarkerItem) => void,
    clearSelectedMarker: VoidFunction,
    selectedMarker?: MarkerItem | null,
  ): void => {
    const filteredPlaces = mapService.getFilteredPlaces(places, placeTypeFilter)

    if (
      selectedMarker
      && mapService.isPlaceMarker(selectedMarker)
      && !filteredPlaces.some((place) => place.id === selectedMarker.id)
    ) {
      clearSelectedMarker()
    }

    filteredPlaces.forEach((place) => {
      return mapService.addMarker(
        map,
        place,
        selectedMarker?.id === place.id,
        onClick,
      )
    })
  },

  /**
   * Adds user markers to a map.
   *
   * This function adds markers representing users to a Leaflet map based on the provided parameters.
   *
   * @param map - The Leaflet map instance where markers will be added.
   * @param users - The array of all users to potentially display as markers on the map.
   * @param nearestUsers - The subset of users identified as nearest, which may be highlighted.
   * @param userShowAllFilter - A flag that determines whether markers for all users or only for the nearest users should be added.
   * @param onClick - The callback function to be executed when a marker is clicked.
   *
   * If `userShowAllFilter` is true, markers for all users are added, with the nearest users highlighted.
   * If `userShowAllFilter` is false, only markers for the nearest users are added.
   */
  addUserMarkers: (
    map: L.Map,
    users: User[],
    nearestUsers: User[],
    userShowAllFilter: boolean,
    onClick: (markerItem: MarkerItem) => void,
  ): void => {
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

  /**
   * Adds markers to a Leaflet map based on provided data and filters.
   *
   * @param map - The Leaflet map instance where the markers will be added.
   * @param places - Array of places to display as markers on the map.
   * @param users - Array of users to display as markers on the map.
   * @param nearestUsers - Array of nearby users to display with a special emphasis.
   * @param placeTypeFilter - Filter criteria for the types of places to display as markers.
   * @param userShowAllFilter - Switch to determine if all users should be displayed, regardless of the nearest filter.
   * @param onClick - Callback invoked when a marker is clicked. Receives the clicked marker item as an argument.
   * @param clearSelectedMarker - Callback invoked to clear the currently selected marker on the map.
   * @param [selectedMarker] - The currently selected marker item, or null/undefined if none is selected.
   */
  addMarkersToMap: (
    map: L.Map,
    places: Place[],
    users: User[],
    nearestUsers: User[],
    placeTypeFilter: PlaceTypeEnum[],
    userShowAllFilter: boolean,
    onClick: (markerItem: MarkerItem) => void,
    clearSelectedMarker: VoidFunction,
    selectedMarker?: MarkerItem | null,
  ): void => {
    mapService.addPlaceMarkers(
      map,
      places,
      placeTypeFilter,
      onClick,
      clearSelectedMarker,
      selectedMarker,
    )

    mapService.addUserMarkers(
      map,
      users,
      nearestUsers,
      userShowAllFilter,
      onClick,
    )
  },

  /**
   * Calculates the distance between two geographical coordinates.
   *
   * @param origin - The starting point as a latitude and longitude tuple.
   * @param target - The ending point as a latitude and longitude tuple.
   * @returns {string} The calculated distance in kilometers, formatted as a string with one decimal place, followed by ' km'.
   */
  getDistanceBetweenCoords: (origin: L.LatLngTuple, target: L.LatLngTuple): string => {
    const distanceInMeters = L.latLng(origin).distanceTo(L.latLng(target))
    const distanceInKm = (distanceInMeters / 1000).toFixed(1)

    return `${ distanceInKm } km`
  },
}
