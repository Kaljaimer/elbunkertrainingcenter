<script setup>
import Alert from "~/components/Alert.vue";

useHead({
  htmlAttrs: { lang: "es-ES" },
  title: "Bunker Stuntplace",
  meta: [
    {
      name: "description",
      content:
        "",
    },
  ],
  bodyAttrs: {
    class: 'font-display'
  }
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
    <Alert />
  </NuxtLayout>
</template>
