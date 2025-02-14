<script setup>
import {showError} from "~/composables/useToast.ts";
import CheckIn from "~/components/checkIn.vue";

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

const user = ref(null);
const userAlreadyLogged = ref(false)
onBeforeMount(() => {
  user.value = JSON.parse(localStorage.getItem('loggedUser'));
  if (user) {
    const inputDate = new Date(user.value?.expires);
    const now = new Date();
    if (inputDate > now) {
      userAlreadyLogged.value = true;
    }
  }
})
</script>

<template>
<login v-if="!userAlreadyLogged"></login>
<checkIn v-else :user="user"></checkIn>
</template>
