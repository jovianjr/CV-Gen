<script setup>
import { watch } from "vue";

const props = defineProps({
  autocomplete: String,
  class: String,
  format: String,
  label: String,
  name: String,
  placeholder: String,
  type: String,
  lang: { type: String, default: "en" },
  required: { type: Boolean, default: false },
});

const model = defineModel();

const month = {
  id: [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ],
  en: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
};

watch(
  [model, () => props.lang],
  async (newVal, oldVal) => {
    if (props.type === "date") {
      const newDate = newVal[0];
      if (!newDate) return;

      const lang = props.lang ?? "en";
      const timestamp = Date.parse(newDate);
      console.log(newDate);
      if (isNaN(timestamp)) {
        console.log(newDate);
        if (!newDate) return;
        const monthDictionary = month[lang];
        const [monthName, year] = newDate.split(" ");
        if (
          !monthDictionary.some(
            (e) => e.toLowerCase() == monthName.toLowerCase(),
          )
        ) {
          const notLang = lang === "id" ? "en" : "id";
          const notMonthDictionary = month[notLang];
          const e = notMonthDictionary.findIndex(
            (e) => e.toLowerCase() === monthName.toLowerCase(),
          );
          console.log("2 ", monthDictionary);
          console.log("99 ", monthDictionary[e] + " " + year);
          model.value = monthDictionary[e] + " " + year;
          // console.log(newDate);
          // let [monthName, year] = newDate.split(" ");
          // let localeMonth = monthMap[monthName] || monthName;
          // model.value = localeMonth + year;
        }
        return;
      }

      const date = new Date(newDate);
      const formattedDate = date.toLocaleDateString(
        lang === "en" ? "en-GB" : "id-ID",
        {
          month: "long",
          year: "numeric",
        },
      );

      model.value = formattedDate;
    }
  },
  { immediate: true },
);
</script>

<template>
  <div class="flex w-full flex-col gap-2">
    <label
      v-if="props.label"
      :for="props.name"
      class="text-base font-medium text-slate-900"
    >
      {{ props.label }}
    </label>
    <DatePicker
      v-if="type == 'date'"
      :inputId="props.name"
      v-model="model"
      view="month"
      dateFormat="MM yy"
      :required="props.required"
    />
    <Textarea
      v-else-if="type == 'area'"
      :inputId="props.name"
      v-model="model"
      autoResize
      rows="5"
      cols="30"
      :required="props.required"
    />
    <InputNumber
      v-else-if="type == 'number'"
      class="w-full rounded-md border-gray-400"
      :useGrouping="false"
      :inputId="props.name"
      :placeholder="props.placeholder"
      v-model="model"
      :required="props.required"
    />
    <InputText
      v-else
      inputId="props.name"
      :autocomplete="autocomplete"
      :class="`rounded-md border-gray-400 ${props.class}`"
      :id="props.name"
      :name="props.name"
      :type="props.type ?? 'text'"
      v-model="model"
      :required="props.required"
    />
  </div>
</template>
