self.addEventListener('push', (event) => {
  const data = event.data?.json() ?? {}
  event.waitUntil(
    self.registration.showNotification(data.title ?? 'Mzobs', {
      body: data.body ?? '',
      icon: '/favicon.svg',
      badge: '/favicon.svg',
      data: data.data ?? {},
    })
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const url = event.notification.data?.url ?? '/'
  const targetUrl = new URL(url, self.location.origin).href

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // Already have that exact page open — just bring it forward.
      const exactMatch = windowClients.find((client) => client.url === targetUrl)
      if (exactMatch) return exactMatch.focus()

      // No exact match, but some other tab of this app is open — focus it
      // and navigate it there instead of opening a duplicate tab.
      const anyClient = windowClients[0]
      if (anyClient) return anyClient.focus().then(() => anyClient.navigate(targetUrl))

      // Nothing open at all — open a fresh tab.
      return self.clients.openWindow(targetUrl)
    })
  )
})
