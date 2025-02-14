<template>
  <div v-if="displayedAlert" class="alertContainer">
    <v-alert
      style="margin: auto"
      :closable="closable"
      :title="displayedAlert.message"
      :color="color"
    >
      <template v-slot:close>
        <v-btn
          icon="mdi mdi-close"
          class="ml-auto"
          variant="text"
          color="white"
          @click="setAlertInfo(null)"
        >
          <v-icon icon="mdi mdi-close" size="large" class="color-white"/>
        </v-btn>
      </template>
    </v-alert>
  </div>
</template>

<script setup lang="ts">
import {AlertType, setAlertInfo, alertInfo} from '~/composables/useToast';

let timer: any;

const displayedAlert = computed(() => {
  return alertInfo.value;
});

watch(displayedAlert, (newValue) => {
  if (newValue) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      setAlertInfo(null);
    }, newValue.timer || 5000);
  }
});

const props = defineProps({
  closable: {
    type: Boolean,
    default: true,
  },
  color: {
    type: String,
    default: 'success',
  },
});

const color = computed(() => {
  return props.color ? getColorFromType(displayedAlert.value?.type) : 'info';
});

function getColorFromType(type?: AlertType) {
  switch (type) {
    case AlertType.ERROR:
      return 'error';
    case AlertType.WARNING:
      return 'warning';
    case AlertType.INFO:
      return 'info';
    case AlertType.SUCCESS:
      return 'success';
    default:
      return 'info';
  }
}
</script>

<style scoped>
.alertContainer {
  position: fixed;
  z-index: 10000;
  bottom: 40px;
  display: grid;
  place-content: center;
  width: 100vw;
}
</style>
