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
    <div class="h-1 w-full bg-black"></div>
    <div
      class="flex w-full items-center justify-center gap-10 bg-white px-20 pb-16 pt-20 font-medium text-emerald-700"
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
