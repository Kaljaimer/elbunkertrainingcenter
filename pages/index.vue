<script setup>
const { data: page } = await useAsyncData("index", () =>
  queryContent("/").findOne()
);
if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Page not found",
    fatal: true,
  });
}
definePageMeta({
  layout: "default",
});
</script>

<template>
<register></register>
</template>
