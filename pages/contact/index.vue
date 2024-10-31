<script setup>
import { ref } from "vue";
import Footer from "~/pages/Footer.vue";
import { langOptions } from "~/constants/lang";
const languageOptions = ref(langOptions);
const language = ref(languageOptions.value[0]);
</script>

<template>
  <main class="flex h-svh min-h-svh w-full flex-col items-center">
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

    <div class="flex w-[60svw] flex-col gap-4 py-20">
      <h1 class="text-3xl font-bold text-emerald-500">Kontak</h1>
      <p>Anda dapat menghubungi saya melalui salah satu kontak di bawah ini</p>
      <div class="mt-4 flex flex-col gap-6">
        <a
          class="flex cursor-pointer items-center gap-4 pl-4 text-xl font-medium hover:text-emerald-500"
          href="https://github.com/jovianjr"
          target="_blank"
          noopener
          noreferrer
        >
          <li class="pi pi-github !text-4xl"></li>
          Github
        </a>
        <a
          class="flex cursor-pointer items-center gap-4 pl-4 text-xl font-medium hover:text-emerald-500"
          href="https://linkedin.com/in/jovianjr"
          target="_blank"
          noopener
          noreferrer
        >
          <li class="pi pi-linkedin !text-4xl"></li>
          Linkedin
        </a>
        <a
          class="flex cursor-pointer items-center gap-4 pl-4 text-xl font-medium hover:text-emerald-500"
          href="mailto:alphonsusjovian@gmail.com"
          target="_blank"
          noopener
          noreferrer
        >
          <li class="pi pi-envelope !text-4xl"></li>
          Mail
        </a>
      </div>
    </div>
  </main>
  <Footer />
</template>
