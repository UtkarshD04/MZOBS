self.addEventListener('push', (event) => {
  const data = event.data?.json() ?? {}
  event.waitUntil(
    self.registration.showNotification(data.title ?? 'Mzobs', {
      body: data.body ?? '',
      icon: '/favicon.svg',
      data: data.data ?? {},
    })
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clients) => {
      if (clients.length) return clients[0].focus()
      return self.clients.openWindow('/')
    })
  )
})
