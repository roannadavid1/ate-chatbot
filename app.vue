<template>
    <div>
      <NuxtRouteAnnouncer />
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </div>
  </template>
  
  <script setup>
  useHead({
    title: 'Ate',
    meta: [
      { name: 'description', content: 'The older sister for the older sister' },
      { hid: 'og:image', property: 'og:image', content: '/banner.jpg' }
    ],
  })
  </script>