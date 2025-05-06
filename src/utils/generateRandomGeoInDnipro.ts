import L from 'leaflet'

export const generateRandomGeoInDnipro = (): L.LatLngTuple => {
  const lat = +(48.45 + Math.random() * 0.02).toFixed(6)
  const lng = +(35.05 + Math.random() * 0.02).toFixed(6)

  return [ lat, lng ]
}
