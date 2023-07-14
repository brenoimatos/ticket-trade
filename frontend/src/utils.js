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

export function formatName(firstName, lastName) {
  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
  }
  let firstNameWords = firstName ? firstName.split(' ') : ['']
  let lastNameWords = lastName ? lastName.split(' ') : ['']

  let firstNameWord, lastNameWord

  if (firstName && !lastName) {
    firstNameWord = capitalize(firstNameWords[0])
    lastNameWord = capitalize(firstNameWords[firstNameWords.length - 1])
  } else if (lastName && !firstName) {
    firstNameWord = capitalize(lastNameWords[0])
    lastNameWord = capitalize(lastNameWords[lastNameWords.length - 1])
  } else {
    firstNameWord = capitalize(firstNameWords[0])
    lastNameWord = capitalize(lastNameWords[lastNameWords.length - 1])
  }

  return `${firstNameWord} ${lastNameWord}`
}

export function getInitials(firstName, lastName) {
  firstName = firstName || ''
  lastName = lastName || ''

  let joined = (firstName + ' ' + lastName).trim().toUpperCase()
  let words = joined.split(' ').filter((word) => word.length > 0)
  let firstInitial = words.length > 0 ? words[0].charAt(0) : ''
  let lastInitial = words.length > 0 ? words[words.length - 1].charAt(0) : ''

  return firstInitial + lastInitial
}

export function formatFullName(firstName, lastName) {
  // Verificar se firstName e lastName são null ou vazios
  firstName = firstName || ''
  lastName = lastName || ''

  // Juntar firstName e lastName
  let fullName = (firstName + ' ' + lastName).trim()

  // Função para capitalizar cada palavra em uma string
  function capitalizeWords(str) {
    return str
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
  }

  // Capitalizar cada palavra no fullName
  return capitalizeWords(fullName)
}
