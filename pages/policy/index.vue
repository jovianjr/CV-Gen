<script setup>
import { ref } from "vue";
import Footer from "~/pages/Footer.vue";
import { langOptions } from "~/constants/lang";
const languageOptions = ref(langOptions);
const language = ref(languageOptions.value[0]);
</script>

<template>
  <main class="flex min-h-svh w-full flex-col items-center">
    <nav
      class="flex h-20 w-full items-center justify-between border-b-4 border-black bg-white px-10 py-6"
    >
      <NuxtLink to="/">
        <h1 class="text-2xl font-semibold">
          <span class="font-bold text-emerald-500">CV</span>Gen
        </h1>
      </NuxtLink>
      <div class="flex items-center gap-4">
        <div class="rounded-md bg-black">
          <Select
            v-model="language"
            :options="languageOptions"
            optionLabel="name"
            placeholder="Select a City"
            class="-all !h-12 w-40 -translate-x-0.5 -translate-y-0.5 !border-2 !border-emerald-500 text-base font-medium hover:translate-x-0 hover:translate-y-0"
          >
            <template #option="slotProps">
              <div class="flex items-center font-medium">
                <div>{{ slotProps.option.name }}</div>
              </div>
            </template>
            <template #value="slotProps">
              <div
                v-if="slotProps.value"
                class="flex h-full items-center gap-2 !text-emerald-500"
              >
                <i class="pi pi-globe"></i>
                <div>{{ slotProps.value.name }}</div>
              </div>
              <span v-else>
                {{ slotProps.placeholder }}
              </span>
            </template>
          </Select>
        </div>
      </div>
    </nav>

    <div class="flex w-[60svw] flex-col gap-4 py-20 leading-8">
      <h1 class="text-3xl font-bold text-emerald-500">Kebijakan pengguna</h1>
      <p>
        Aplikasi ini berkomitmen untuk menjaga privasi data pengguna dengan
        baik. Kebijakan ini merinci bagaimana data dikumpulkan, digunakan, dan
        dilindungi dalam aplikasi ini.
      </p>

      <h2 class="mt-2 text-xl font-semibold">Penyimpanan Data</h2>
      <ul class="list-disc pl-10 text-justify leading-8">
        <li>Aplikasi ini tidak menyimpan data pengguna pada database.</li>
        <li>
          Data akan disimpan secara lokal pada perangkat pengguna melalui
          penyimpanan browser dan dalam bentuk file JSON yang dapat diunduh.
        </li>
      </ul>
      <p>
        Dengan pendekatan ini, pengguna memiliki kendali penuh atas data mereka,
        sehingga keamanan dan privasi informasi tetap terjaga tanpa melibatkan
        penyimpanan di server eksternal.
      </p>
    </div>
  </main>
  <Footer />
</template>
