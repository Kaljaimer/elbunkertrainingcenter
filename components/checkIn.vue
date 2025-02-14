<script setup lang="ts">
import {showError} from "~/composables/useToast";

onBeforeMount(async () => {
  const response = await useGet(`/check-ins/last_checkin/`, { user_id: props.user.user_id });
  if (!response.error?.value) {
    if (response.data.value?.check_in_time) {
      localStorage.setItem('lastCheckIn', response.data.value.check_in_time);
      await isLastCheckingToday(response.data.value.check_in_time)
    }
  } else {
    showError(response);
  }
})

const props = defineProps({
  user: {
    type: Object,
    default: {}
  },
});
const isCheckedIn = ref(false);

async function checkIn() {
  const response = await usePost(`/check-ins/`, { user_id: props.user.user_id });
  if (response?.error?.value) {
    showError(response);
  } else {
    localStorage.setItem('lastCheckIn', response.data.value.check_in_time);
    isCheckedIn.value = true;
  }
}

async function isLastCheckingToday(lastDate: string) {
  const lastCheckInDate = new Date(lastDate);
  const now = new Date();

  // set hours, minutes, seconds and milliseconds to 0 to only compare the date part
  lastCheckInDate.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);
  isCheckedIn.value = lastCheckInDate.getTime() == now.getTime();
}
</script>

<template>
  <!-- Main content area -->
  <div class="flex-grow bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col justify-center items-center">
    <div class="w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden pa-5">
      <div class="p-6 sm:p-10">
        <h1 class="text-3xl sm:text-4xl font-bold text-gray-800 mb-6 text-center">
          Check-In
        </h1>
        <p class="text-gray-600 mb-8 text-center">
          Bienvenido. {{user?.name}} {{user?.lastname}} {{isCheckedIn ? 'Ya has realizado check-in.': 'Haz click para registrar tu llegada.'}}
        </p>
        <button
            class="w-full py-4 btn btn-warning text-white"
            @click="checkIn"
            :disabled="isCheckedIn"
        >
          {{isCheckedIn ? '¡Check-In Realizado!' : 'Hacer Check-In'}}
        </button>
      </div>
    </div>
    <p v-if="isCheckedIn" class="mt-6 text-green-600 font-semibold text-center">
      ¡Check-in exitoso! Gracias por registrar tu llegada.
    </p>
  </div>
</template>

<style scoped>

</style>
