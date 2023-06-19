export const subscribeToEvent = (name, listener) => {
  document.addEventListener(name, listener)
}

export const unsubscribeToEvent = (name, listener) => {
  document.removeEventListener(name, listener)
}

export const publishEvent = (name, data) => {
  const event = new CustomEvent(name, { detail: data })
  document.dispatchEvent(event)
}
