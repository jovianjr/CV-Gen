<template>
  <footer class="w-full font-medium text-white">
    <div class="h-1 w-full bg-black"></div>
    <div
      class="flex w-full items-center justify-center gap-10 bg-white px-20 pb-16 pt-20 font-medium text-emerald-700"
    >
      <NuxtLink to="/">
        <span class="cursor-pointer hover:underline">Home</span>
      </NuxtLink>
      <span>/</span>
      <NuxtLink to="/policy">
        <span class="cursor-pointer hover:underline">Privacy Policy</span>
      </NuxtLink>
      <span>/</span>
      <NuxtLink to="/contact">
        <span class="cursor-pointer hover:underline">Contact</span>
      </NuxtLink>
    </div>
  </footer>
</template>
