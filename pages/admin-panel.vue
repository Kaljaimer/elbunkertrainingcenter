<script setup lang="ts">

import {showError} from "~/composables/useToast";

const data = ref(null);

onBeforeMount(async () => {
  const response = await useGet(`/check-ins/`);
  if (!response.error?.value) {
    data.value = response.data.value?.map((item: any) => {
      return {
        username: item.user.username,
        email: item.user.email,
        check_in_time: new Date(item.check_in_time).toLocaleString(),
      };
    });
  } else {
    showError(response);
  }
})

const headers = [
  { title: 'Username', align: 'center', sortable: false, key: 'username' },
  { title: 'Email', align: 'center', sortable: false, key: 'email' },
  { title: 'Check In', align: 'center', sortable: false, key: 'check_in_time' },
];
</script>

<template>
  <v-card v-if="data" class="card" style="margin: 50px;">
    <DataTable :data="data" :headers="headers" :exportExcel="false"></DataTable>
  </v-card>
</template>

<style scoped>

</style>
