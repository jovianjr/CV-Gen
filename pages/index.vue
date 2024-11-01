<script setup>
import { ref } from "vue";
import i18n from "~/constants/locale";
const locale = ref({});

onMounted(() => {
  const lang = localStorage.getItem("app_lang") ?? "en";
  locale.value = i18n[lang];
});
</script>

<template>
  <main class="flex h-full min-h-svh w-full flex-col gap-10 px-16 py-20">
    <div class="flex flex-grow gap-4">
      <div class="w-full flex-1 rounded-lg border border-black bg-black">
        <div
          class="flex h-full w-full -translate-x-1 -translate-y-1 items-center justify-center rounded-lg border-2 border-black bg-white p-2"
        >
          <img src="/assets/images/preview.png" alt="app preview" />
        </div>
      </div>
      <div class="flex flex-1 items-center justify-center">
        <div class="flex flex-col items-center justify-center gap-4">
          <div class="flex flex-col items-center gap-2">
            <h1 class="text-4xl font-bold">
              <span class="font-extrabold text-emerald-500">CV</span> Generator
            </h1>
            <p>{{ locale.app_description }}</p>
          </div>
          <div class="rounded-lg bg-black">
            <NuxtLink to="/generate">
              <button
                class="-translate-x-1 -translate-y-1 rounded-lg border-2 border-black bg-emerald-400 px-4 py-3 font-medium transition-all hover:translate-x-0 hover:translate-y-0"
              >
                {{ locale.start_now }}
              </button>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
