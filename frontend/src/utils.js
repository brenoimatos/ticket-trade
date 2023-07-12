export function getLocationDisplay(event) {
  let locationDisplay = ''

  if (event.location_name) {
    locationDisplay += event.location_name
  } else if (event.location_street) {
    locationDisplay += event.location_street
  }

  if (event.location_city) {
    locationDisplay += locationDisplay
      ? ` - ${event.location_city}`
      : event.location_city
  }

  locationDisplay = locationDisplay || event.location.toUpperCase()

  return locationDisplay
}
