<script setup>
const props = defineProps(["lang"]);
import { footer as footerLang } from "~/constants/locale";
const locale = ref({});

watch(
  () => props.lang,
  (val) => {
    locale.value = footerLang[val];
  },
);
</script>

<template>
  <footer class="w-full font-medium text-white">
    <div class="h-0.5 w-full bg-black md:h-1"></div>
    <div
      class="flex w-full items-center justify-center gap-6 bg-white px-20 pb-8 pt-10 text-sm font-medium text-emerald-700 md:gap-10 md:pb-16 md:pt-20 md:text-base"
    >
      <NuxtLink to="/">
        <span class="cursor-pointer hover:underline">{{ locale.home }}</span>
      </NuxtLink>
      <span>/</span>
      <NuxtLink to="/policy">
        <span class="cursor-pointer hover:underline">{{ locale.policy }}</span>
      </NuxtLink>
      <span>/</span>
      <NuxtLink to="/contact">
        <span class="cursor-pointer hover:underline">{{ locale.contact }}</span>
      </NuxtLink>
    </div>
  </footer>
</template>
