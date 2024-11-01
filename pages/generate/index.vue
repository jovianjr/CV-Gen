<script setup>
import { ref } from "vue";
import Footer from "~/pages/Footer.vue";

import { langOptions } from "~/constants/lang";
import { generate as generateLang } from "~/constants/locale";
import toc from "~/constants/toc";
import Input from "~/components/Input.vue";
import generateCV from "~/helpers/generateCV";

const activeSection = ref("section1");
const fileInput = ref(null);
const languageOptions = ref(langOptions);
const language = ref({});
const locale = ref({});
const form = ref({
  name: "",
  address: "",
  phone_number: "",
  email: "",
  linkedin: "",
  summary: "",
  experience: [],
  education: [{}],
  project: [],
  organization: [],
  award: [],
  skill: [],
  interest: [],
});

onMounted(() => {
  const lang = localStorage.getItem("app_lang") ?? "en";
  const findLang = langOptions.find((o) => o.code === lang);
  language.value = findLang;
});

watch(language, (val) => {
  localStorage.setItem("app_lang", val.code);
  locale.value = generateLang[val.code];
});

const handleImport = () => {
  const file = event.target.files[0];
  if (file && file.type === "application/json") {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        form.value = JSON.parse(e.target.result);
      } catch (error) {
        console.error("Error parsing JSON:", error);
        form.value = null;
      }
    };
    reader.readAsText(file);
  } else {
    alert("Please upload a valid JSON file.");
  }
};

const handleExport = () => {
  // blob url
  const dataStr = JSON.stringify(form.value, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `cvgen-${Date.now()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const handleTocScroll = () => {
  let active = toc[0].id;
  toc.forEach((section) => {
    const element = document.getElementById(section.id);
    if (window.scrollY >= element.offsetTop - 100) {
      active = section.id;
    }
  });
  activeSection.value = active;
};

onMounted(() => {
  window.addEventListener("scroll", handleTocScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleTocScroll);
});
</script>

<template>
  <nav
    class="flex h-20 items-center justify-between border-b-4 border-black bg-white px-10 py-6"
  >
    <NuxtLink to="/">
      <h1 class="text-2xl font-semibold">
        <span class="font-bold text-emerald-500">CV</span>Gen
      </h1>
    </NuxtLink>
    <div class="flex items-center gap-4">
      <div class="rounded-md bg-black">
        <input
          ref="fileInput"
          class="hidden"
          type="file"
          @change="handleImport"
          accept=".json"
        />

        <Button
          @click="fileInput.click()"
          class="!h-12 -translate-x-0.5 -translate-y-0.5 !rounded-md !border-2 !border-emerald-500 !bg-white font-medium !text-emerald-500 !transition-all hover:translate-x-0 hover:translate-y-0"
        >
          Import
        </Button>
      </div>
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
  <main>
    <div class="flex gap-40 bg-emerald-300 px-40 pb-40 pt-12">
      <div class="relative flex-1">
        <div class="sticky left-0 top-10 flex justify-center py-10">
          <div class="w-full rounded-lg bg-black">
            <div
              class="w-full -translate-x-2 -translate-y-2 rounded-lg bg-white px-4 py-12"
            >
              <ul class="flex flex-col gap-5 font-semibold">
                <li
                  :class="
                    activeSection === content.id
                      ? 'bg-emerald-400 text-white'
                      : 'hover:border-emerald-400 hover:bg-emerald-100 hover:text-black'
                  "
                  class="w-full rounded-lg border hover:cursor-pointer"
                  v-for="(content, contentIdx) in toc"
                  :key="'toc_' + language.code + '_' + contentIdx"
                >
                  <a :href="'#' + content.id" class="block w-full px-6 py-3">
                    {{ contentIdx + 1 }}.
                    {{
                      language.code === "id"
                        ? content.title_id
                        : content.title_en
                    }}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <form
        class="flex w-full flex-[2] flex-col gap-4"
        @submit.prevent="generateCV({ data: form, lang: language.code })"
      >
        <section id="personal" class="py-10">
          <div class="rounded-lg bg-black">
            <div
              class="flex -translate-x-2 -translate-y-2 flex-col gap-6 rounded-lg border border-black bg-white px-10 py-6"
            >
              <div class="relative">
                <div class="sticky left-0 top-0 flex flex-col gap-2">
                  <h2 class="text-xl font-semibold text-emerald-500">
                    {{ locale.personal?.title }}
                  </h2>
                  <p class="text-base">{{ locale.personal?.description }}</p>
                </div>
              </div>
              <Input
                name="name"
                :label="locale.full_name"
                v-model="form.name"
                class="w-full"
                :required="true"
              />
              <Input
                name="address"
                :label="locale.city"
                v-model="form.address"
              />
              <Input
                name="phone_number"
                :label="locale.phone_number"
                placeholder="+628xxxxxxxx"
                v-model="form.phone_number"
              />
              <Input
                type="email"
                name="email"
                :label="locale.email"
                class="w-3/5"
                autocomplete="email"
                v-model="form.email"
                :required="true"
              />
              <Input
                name="linkedin"
                :label="locale.linkedin"
                class="w-3/4"
                v-model="form.linkedin"
              />
              <Input
                type="area"
                :label="locale.summary"
                name="summary"
                v-model="form.summary"
                :required="true"
              />
            </div>
          </div>
        </section>

        <hr class="border-black" />

        <section id="experience" class="py-10">
          <div class="rounded-lg bg-black">
            <div
              class="flex -translate-x-2 -translate-y-2 flex-col gap-6 rounded-lg border border-black bg-white px-10 pb-10 pt-6"
            >
              <div class="relative">
                <div class="sticky left-0 top-0 flex flex-col gap-2">
                  <h2 class="text-xl font-semibold text-emerald-500">
                    {{ locale.experience?.title }}
                  </h2>
                  <p class="text-base">
                    {{ locale.experience?.description }}
                  </p>
                </div>
              </div>
              <div
                class="relative mt-2 flex flex-col gap-2 border-t-2 border-gray-200 pt-4"
                v-for="(experience, experienceIdx) in form.experience"
              >
                <Input
                  :label="locale.position"
                  name="experience_title"
                  v-model="experience.title"
                  class="w-full"
                  :required="true"
                />
                <Input
                  :label="locale.company"
                  name="experience_company"
                  v-model="experience.company"
                  class="w-full"
                  :required="true"
                />
                <div class="flex w-full gap-4">
                  <Input
                    :lang="language.code"
                    type="date"
                    :label="locale.start_date"
                    name="experience_start_date"
                    v-model="experience.start_date"
                    class="w-full flex-1"
                    :required="true"
                  />
                  <Input
                    :lang="language.code"
                    type="date"
                    :label="locale.end_date"
                    name="experience_end_date"
                    v-model="experience.end_date"
                    class="w-full flex-1"
                    :required="true"
                  />
                </div>
                <Input
                  type="area"
                  :label="locale.description"
                  name="experience_description"
                  v-model="experience.description"
                  class="w-full"
                />
                <div class="mt-4 flex justify-end">
                  <div class="w-fit rounded-md bg-black">
                    <Button
                      @click="form.experience.splice(experienceIdx, 1)"
                      size="small"
                      class="-translate-x-1 -translate-y-1 !bg-emerald-500 font-medium !transition-all hover:translate-x-0 hover:translate-y-0"
                    >
                      {{ locale.delete }}
                    </Button>
                  </div>
                </div>
              </div>
              <div class="flex w-full rounded-lg bg-black">
                <button
                  type="button"
                  @click="form.experience = [...form.experience, {}]"
                  class="w-full -translate-x-1 -translate-y-1 rounded-lg border-2 border-black bg-white px-4 py-3 font-medium transition-all hover:translate-x-0 hover:translate-y-0"
                >
                  {{ locale.add + " " + locale.experience?.title }}
                </button>
              </div>
            </div>
          </div>
        </section>

        <hr class="border-black" />

        <section id="education" class="py-10">
          <div class="rounded-lg bg-black">
            <div
              class="flex -translate-x-2 -translate-y-2 flex-col gap-6 rounded-lg border border-black bg-white px-10 pb-10 pt-6"
            >
              <div class="relative">
                <div class="sticky left-0 top-0 flex flex-col gap-2">
                  <h2 class="text-xl font-semibold text-emerald-500">
                    {{ locale.education?.title }}
                  </h2>
                  <p class="text-base">
                    {{ locale.education?.description }}
                  </p>
                </div>
              </div>
              <div
                class="relative mt-2 flex flex-col gap-2 border-t-2 border-gray-200 pt-4"
                v-for="(education, educationIdx) in form.education"
              >
                <Input
                  :label="locale.school_name"
                  name="education_title"
                  v-model="education.title"
                  class="w-full"
                  :required="true"
                />
                <Input
                  :label="locale.major"
                  name="education_company"
                  v-model="education.company"
                  class="w-full"
                  :required="true"
                />
                <div class="flex w-full gap-4">
                  <Input
                    :lang="language.code"
                    type="date"
                    :label="locale.start_date"
                    name="education_start_date"
                    v-model="education.start_date"
                    class="w-full flex-1"
                    :required="true"
                  />
                  <Input
                    :lang="language.code"
                    type="date"
                    :label="locale.end_date"
                    name="education_end_date"
                    v-model="education.end_date"
                    class="w-full flex-1"
                    :required="true"
                  />
                </div>
                <Input
                  type="area"
                  :label="locale.description"
                  name="education_description"
                  v-model="education.description"
                  class="w-full"
                />
                <div class="mt-4 flex justify-end">
                  <div
                    v-if="educationIdx > 0"
                    class="w-fit rounded-md bg-black"
                  >
                    <Button
                      @click="form.education.splice(educationIdx, 1)"
                      size="small"
                      class="-translate-x-1 -translate-y-1 !bg-emerald-500 font-medium !transition-all hover:translate-x-0 hover:translate-y-0"
                    >
                      {{ locale.delete }}
                    </Button>
                  </div>
                </div>
              </div>
              <div class="flex w-full rounded-lg bg-black">
                <button
                  type="button"
                  @click="form.education = [...form.education, {}]"
                  class="w-full -translate-x-1 -translate-y-1 rounded-lg border-2 border-black bg-white px-4 py-3 font-medium transition-all hover:translate-x-0 hover:translate-y-0"
                >
                  {{ locale.add + " " + locale.education?.title }}
                </button>
              </div>
            </div>
          </div>
        </section>

        <hr class="border-black" />

        <section id="project" class="py-10">
          <div class="rounded-lg bg-black">
            <div
              class="flex -translate-x-2 -translate-y-2 flex-col gap-6 rounded-lg border border-black bg-white px-10 pb-10 pt-6"
            >
              <div class="relative">
                <div class="sticky left-0 top-0 flex flex-col gap-2">
                  <h2 class="text-xl font-semibold text-emerald-500">
                    {{ locale.project?.title }}
                  </h2>
                  <p class="text-base">{{ locale.project?.description }}</p>
                </div>
              </div>
              <div
                class="relative mt-2 flex flex-col gap-2 border-t-2 border-gray-200 pt-4"
                v-for="(project, projectIdx) in form.project"
              >
                <Input
                  :label="locale.project_name"
                  name="project_company"
                  v-model="project.company"
                  class="w-full"
                  :required="true"
                />
                <Input
                  :label="locale.project_position"
                  name="project_title"
                  v-model="project.title"
                  class="w-full"
                  :required="true"
                />
                <div class="flex w-full gap-4">
                  <Input
                    :lang="language.code"
                    type="date"
                    :label="locale.start_date"
                    name="project_start_date"
                    v-model="project.start_date"
                    class="w-full flex-1"
                    :required="true"
                  />
                  <Input
                    :lang="language.code"
                    type="date"
                    :label="locale.end_date"
                    name="project_end_date"
                    v-model="project.end_date"
                    class="w-full flex-1"
                    :required="true"
                  />
                </div>
                <Input
                  type="area"
                  :label="locale.description"
                  name="project_description"
                  v-model="project.description"
                  class="w-full"
                />
                <div class="mt-4 flex justify-end">
                  <div class="w-fit rounded-md bg-black">
                    <Button
                      @click="form.project.splice(projectIdx, 1)"
                      size="small"
                      class="-translate-x-1 -translate-y-1 !bg-emerald-500 font-medium !transition-all hover:translate-x-0 hover:translate-y-0"
                    >
                      {{ locale.delete }}
                    </Button>
                  </div>
                </div>
              </div>
              <div class="flex w-full rounded-lg bg-black">
                <button
                  type="button"
                  @click="form.project = [...form.project, {}]"
                  class="w-full -translate-x-1 -translate-y-1 rounded-lg border-2 border-black bg-white px-4 py-3 font-medium transition-all hover:translate-x-0 hover:translate-y-0"
                >
                  {{ locale.add + " " + locale.project?.title }}
                </button>
              </div>
            </div>
          </div>
        </section>

        <hr class="border-black" />

        <section id="organization" class="py-10">
          <div class="rounded-lg bg-black">
            <div
              class="flex -translate-x-2 -translate-y-2 flex-col gap-6 rounded-lg border border-black bg-white px-10 pb-10 pt-6"
            >
              <div class="relative">
                <div class="sticky left-0 top-0 flex flex-col gap-2">
                  <h2 class="text-xl font-semibold text-emerald-500">
                    {{ locale.organization?.title }}
                  </h2>
                  <p class="text-base">
                    {{ locale.organization?.description }}
                  </p>
                </div>
              </div>
              <div
                class="relative mt-2 flex flex-col gap-2 border-t-2 border-gray-200 pt-4"
                v-for="(organization, organizationIdx) in form.organization"
              >
                <Input
                  :label="locale.organization_name"
                  name="organization_company"
                  v-model="organization.company"
                  class="w-full"
                  :required="true"
                />
                <Input
                  :label="locale.position"
                  name="organization_title"
                  v-model="organization.title"
                  class="w-full"
                  :required="true"
                />
                <div class="flex w-full gap-4">
                  <Input
                    :lang="language.code"
                    type="date"
                    :label="locale.start_date"
                    name="organization_start_date"
                    v-model="organization.start_date"
                    class="w-full flex-1"
                    :required="true"
                  />
                  <Input
                    :lang="language.code"
                    type="date"
                    :label="locale.end_date"
                    name="organization_end_date"
                    v-model="organization.end_date"
                    class="w-full flex-1"
                    :required="true"
                  />
                </div>
                <Input
                  type="area"
                  :label="locale.description"
                  name="organization_description"
                  v-model="organization.description"
                  class="w-full"
                />
                <div class="mt-4 flex justify-end">
                  <div class="w-fit rounded-md bg-black">
                    <Button
                      @click="form.organization.splice(organizationIdx, 1)"
                      size="small"
                      class="-translate-x-1 -translate-y-1 !bg-emerald-500 font-medium !transition-all hover:translate-x-0 hover:translate-y-0"
                    >
                      {{ locale.delete }}
                    </Button>
                  </div>
                </div>
              </div>
              <div class="flex w-full rounded-lg bg-black">
                <button
                  type="button"
                  @click="form.organization = [...form.organization, {}]"
                  class="w-full -translate-x-1 -translate-y-1 rounded-lg border-2 border-black bg-white px-4 py-3 font-medium transition-all hover:translate-x-0 hover:translate-y-0"
                >
                  {{ locale.add + " " + locale.organization?.title }}
                </button>
              </div>
            </div>
          </div>
        </section>

        <hr class="border-black" />

        <section id="award" class="py-10">
          <div class="rounded-lg bg-black">
            <div
              class="flex -translate-x-2 -translate-y-2 flex-col gap-6 rounded-lg border border-black bg-white px-10 pb-10 pt-6"
            >
              <div class="relative">
                <div class="sticky left-0 top-0 flex flex-col gap-2">
                  <h2 class="text-xl font-semibold text-emerald-500">
                    {{ locale.award?.title }}
                  </h2>
                  <p class="text-base">
                    {{ locale.award?.description }}
                  </p>
                </div>
              </div>
              <div
                class="relative mt-2 flex flex-col gap-2 border-t-2 border-gray-200 pt-4"
                v-for="(award, awardIdx) in form.award"
              >
                <Input
                  :label="locale.award_name"
                  name="award_title"
                  v-model="award.title"
                  class="w-full"
                  :required="true"
                />
                <Input
                  :label="locale.award_organizer"
                  name="award_company"
                  v-model="award.company"
                  class="w-full"
                  :required="true"
                />
                <Input
                  type="area"
                  :label="locale.description"
                  name="award_description"
                  v-model="award.description"
                  class="w-full"
                />
                <div class="mt-4 flex justify-end">
                  <div class="w-fit rounded-md bg-black">
                    <Button
                      @click="form.award.splice(awardIdx, 1)"
                      size="small"
                      class="-translate-x-1 -translate-y-1 !bg-emerald-500 font-medium !transition-all hover:translate-x-0 hover:translate-y-0"
                    >
                      {{ locale.delete }}
                    </Button>
                  </div>
                </div>
              </div>
              <div class="flex w-full rounded-lg bg-black">
                <button
                  type="button"
                  @click="form.award = [...form.award, {}]"
                  class="w-full -translate-x-1 -translate-y-1 rounded-lg border-2 border-black bg-white px-4 py-3 font-medium transition-all hover:translate-x-0 hover:translate-y-0"
                >
                  {{ locale.add + " " + locale.award?.title }}
                </button>
              </div>
            </div>
          </div>
        </section>

        <hr class="border-black" />

        <section id="skill" class="py-10">
          <div class="rounded-lg bg-black">
            <div
              class="flex -translate-x-2 -translate-y-2 flex-col gap-4 rounded-lg border border-black bg-white px-10 pb-10 pt-6"
            >
              <div class="relative">
                <div class="sticky left-0 top-0 flex flex-col gap-2">
                  <h2 class="text-xl font-semibold text-emerald-500">
                    {{ locale.skill?.title }}
                  </h2>
                  <p class="text-base">
                    {{ locale.skill?.description }}
                  </p>
                </div>
              </div>
              <div class="flex flex-col gap-1">
                <div
                  class="relative flex items-end gap-4"
                  v-for="(skill, skillIdx) in form.skill"
                >
                  <Input
                    name="skill"
                    v-model="form.skill[skillIdx]"
                    class="w-full"
                    :required="true"
                  />
                  <div class="mt-4 flex justify-end">
                    <div class="h-fit w-fit rounded-md bg-black">
                      <Button
                        @click="form.skill.splice(skillIdx, 1)"
                        size="small"
                        class="-translate-x-1 -translate-y-1 !bg-emerald-500 font-medium !transition-all hover:translate-x-0 hover:translate-y-0"
                      >
                        {{ locale.delete }}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <div class="mt-4 flex w-full rounded-lg bg-black">
                <button
                  type="button"
                  @click="form.skill = [...form.skill, '']"
                  class="w-full -translate-x-1 -translate-y-1 rounded-lg border-2 border-black bg-white px-4 py-3 font-medium transition-all hover:translate-x-0 hover:translate-y-0"
                >
                  {{ locale.add + " " + locale.skill?.title }}
                </button>
              </div>
            </div>
          </div>
        </section>

        <hr class="border-black" />

        <section id="interest" class="py-10">
          <div class="rounded-lg bg-black">
            <div
              class="flex -translate-x-2 -translate-y-2 flex-col gap-4 rounded-lg border border-black bg-white px-10 pb-10 pt-6"
            >
              <div class="relative">
                <div class="sticky left-0 top-0 flex flex-col gap-2">
                  <h2 class="text-xl font-semibold text-emerald-500">
                    {{ locale.interest?.title }}
                  </h2>
                  <p class="text-base">
                    {{ locale.interest?.description }}
                  </p>
                </div>
              </div>
              <div class="flex flex-col gap-1">
                <div
                  class="relative flex items-end gap-4"
                  v-for="(interest, interestIdx) in form.interest"
                >
                  <Input
                    name="interest"
                    v-model="form.interest[interestIdx]"
                    class="w-full"
                    :required="true"
                  />
                  <div class="mt-4 flex justify-end">
                    <div class="h-fit w-fit rounded-md bg-black">
                      <Button
                        @click="form.interest.splice(interestIdx, 1)"
                        size="small"
                        class="-translate-x-1 -translate-y-1 !bg-emerald-500 font-medium !transition-all hover:translate-x-0 hover:translate-y-0"
                      >
                        {{ locale.delete }}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <div class="mt-4 flex w-full rounded-lg bg-black">
                <button
                  type="button"
                  @click="form.interest = [...form.interest, '']"
                  class="w-full -translate-x-1 -translate-y-1 rounded-lg border-2 border-black bg-white px-4 py-3 font-medium transition-all hover:translate-x-0 hover:translate-y-0"
                >
                  {{ locale.add + " " + locale.interest?.title }}
                </button>
              </div>
            </div>
          </div>
        </section>

        <section id="submit" class="mt-6 flex items-center justify-end gap-x-6">
          <div class="rounded-lg bg-black">
            <button
              type="button"
              @click="handleExport"
              class="-translate-x-1 -translate-y-1 rounded-lg border-2 border-black bg-white px-4 py-3 transition-all hover:translate-x-0 hover:translate-y-0"
            >
              {{ locale.save_file }}
            </button>
          </div>
          <div class="rounded-lg bg-black">
            <button
              type="submit"
              class="-translate-x-1 -translate-y-1 rounded-lg border-2 border-black bg-emerald-500 px-4 py-3 font-semibold text-white transition-all hover:translate-x-0 hover:translate-y-0"
            >
              {{ locale.generate_cv }}
            </button>
          </div>
        </section>
      </form>
    </div>
  </main>
  <Footer :lang="language.code" />
</template>
