<script setup lang="ts">
import {computed, watch, ref} from 'vue';
import {exportToExcel} from '~/composables/useAuxFunc';

const emit = defineEmits(['deleteItem', 'downloadItem', 'viewItem', 'previsualizeItem', 'updateItem'])
const props = defineProps({
  sorted: {
    type: Array,
    default: []
  },
  data: {
    type: Array,
    default: [],
    required: true,
  },
  dataTypeOptions: {
    type: Object,
    default: null,
    required: false,
  },
  headers: {
    type: Array,
    default: [],
    required: true
  },
  exportExcel: {
    type: Boolean,
    default: true,
    required: false
  },
  canDownload: {
    type: Boolean,
    default: false,
    required: false
  },
  canPrevisualize: {
    type: Boolean,
    default: false,
    required: false
  },
  canView: {
    type: Boolean,
    default: false,
    required: false
  },
  canEdit: {
    type: Boolean,
    default: false,
    required: false
  },
  canDelete: {
    type: Boolean,
    default: false,
    required: false
  },
  pagination: {
    type: Boolean,
    default: false,
    required: false
  },
  itemsPerPage: {
    type: Number,
    default: 0,
    required: false
  },
  isReadOnly: {
    type: Boolean,
    default: false
  },
  searchKeyword: {
    type: String,
    required: false
  },
  hasTags: {
    type: Boolean,
    default: false
  },
});

const dialogConfirm = ref(false);
const dialog = ref(false);
const editedIndex = ref(-1);
const editedItem = ref();
const defaultItem = ref();
const page = ref(1);
const itemsPerPage = ref(10);
const sortedBy = ref<Array<any>>([]);
sortedBy.value = props.sorted;
if (!props.pagination) {
  itemsPerPage.value = -1;
} else {
  if (props.itemsPerPage > 0) {
    itemsPerPage.value = props.itemsPerPage;
  }
}
const listItemsPerPage = ref([10, 20, 40, 100])

const formTitle = computed(() => {
  return editedIndex.value === -1 ? 'New Item' : 'Edit Item'
})

const dataset = ref(props.data);

function downloadItem(item: any) {
  emit('downloadItem', item);
}

function viewItem(item: any) {
  emit('viewItem', item);
}

function previsualizeItem(item: any) {
  emit('previsualizeItem', item);
}

function editItem(item: any) {
  editedIndex.value = dataset.value.indexOf(item.value);
  editedItem.value = Object.assign({}, item.value);
  dialog.value = true;
}

function deleteItem() {
  const row = dataset.value.filter((r: any) => r.id === editedItem.value.value)[0];
  const index = dataset.value.indexOf(row);
  emit('deleteItem', editedItem.value);
  dataset.value.splice(index, 1);
}

function showDialogConfirm(item: any) {
  editedItem.value = item;
  dialogConfirm.value = true;
}

function save() {
  if (editedIndex.value > -1) {
    Object.assign(dataset.value[editedIndex.value], editedItem.value);
  } else {
    dataset.value.push(editedItem.value);
  }
  close()
}

function close() {
  dialog.value = false;
  setTimeout(() => {
    editedItem.value = Object.assign({}, defaultItem.value);
    editedIndex.value = -1;
  }, 300)
}

watch(dialog, (newValue) => {
  newValue || close();
})
</script>

<template>
  <button
      class="exportToExcel button-primary align-center pl-3 pr-3 pt-1 pb-1 mb-1"
      v-if="exportExcel"
  >
<!--    @click="exportToExcel(props.data, props.headers)"-->
    <v-icon icon="mdi mdi-microsoft-excel" size="large" class="color-white"/>
    <span class="ml-3 span-download">Download</span>
  </button>
  <v-data-table
      v-model:page="page"
      :items-per-page="itemsPerPage"
      :headers="props.headers"
      :items="dataset"
      hide-default-footer
      :search="searchKeyword"
      v-model:sort-by="sortedBy"
  >

    <template v-slot:item.action="{ item }">
      <v-btn
          v-if="props.canView"
          icon="mdi-open-in-new"
          variant="text"
          class="btn-edit"
          @click="viewItem(item)"
      ></v-btn>
      <v-btn
          v-if="props.canDownload"
          icon="mdi-download"
          variant="text"
          class="btn-edit"
          @click="downloadItem(item)"
      ></v-btn>
      <v-btn
          v-if="props.canEdit"
          icon="mdi-pencil"
          variant="text"
          class="btn-edit"
          :disabled="isReadOnly"
          @click="editItem(item)"
      ></v-btn>
      <v-btn
          v-if="props.canDelete"
          icon="mdi-delete"
          variant="text"
          class="btn-delete"
          :disabled="isReadOnly || item.raw.disableDelete"
          @click="showDialogConfirm(item)"
      ></v-btn>
    </template>
    <template v-slot:no-data>
      <div class="d-flex !w-100 p-4 justify-center">No available data</div>
    </template>
    <template v-slot:bottom>
      <div :class="pagination ? 'd-flex justify-space-between footBar align-center' : 'hidden'">
        <v-spacer></v-spacer>
        <v-select
            label="Items per page"
            v-model="itemsPerPage"
            class="selectItems"
            density="compact"
            :items="listItemsPerPage"
            variant="outlined"
        ></v-select>

        <span class="ml-5 mr-3">Page {{ page }} of {{ Math.ceil(dataset.length / itemsPerPage) }}</span>

        <v-pagination
            v-model="page"
            :length="Math.ceil(dataset.length / itemsPerPage)"
        ></v-pagination>

      </div>
    </template>
  </v-data-table>
  <v-dialog v-model="dialog" max-width="1000px">
    <v-card>
      <v-card-title>
        <span>{{ formTitle }}</span>
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-row>
            <v-col v-for="item in Object.keys(editedItem)" cols="12" sm="6" md="4">
              <v-select
                  v-if="props.dataTypeOptions && props.dataTypeOptions[item].type === 'select'"
                  :items="props.dataTypeOptions[item].options"
                  v-model="editedItem[item]"
                  density="compact" variant="outlined"></v-select>
              <v-text-field
                  v-else
                  v-model="editedItem[item]"
                  :label="props.headers.find((h) => h.key === item).title"
                  density="compact" variant="outlined"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <div class="flex-grow-1"></div>
        <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
        <v-btn color="blue darken-1" text @click="save">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog
      v-model="dialogConfirm"
      persistent
      width="auto"
  >
    <v-card>
      <v-card-title>
        <div class="w-100 d-flex justify-lg-space-around">
          <span>Delete Item</span>
        </div>
      </v-card-title>
      <v-card-text>Are you sure you want to delete this item?</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
            color="gray darken-1"
            variant="text"
            @click="dialogConfirm = false"
        >
          Disagree
        </v-btn>
        <v-btn
            color="green darken-1"
            variant="text"
            @click="deleteItem(); dialogConfirm = false;"
        >
          Agree
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style>
@import 'assets/scss/global.css';

.selectItems {
  max-width: 120px !important;
  margin-top: 10px;
}

.footBar {
  padding-top: 10px;
}

.exportToExcel {
  margin: auto 0 auto auto;
  display: block;
}

:deep(.v-table__wrapper) {
  border: 1px solid var(--grey-light);
}

.v-menu__content .theme--light .menuable__content__active {
  position: initial !important;
}

.span-download {
  font-size: 14px;
  letter-spacing: 0.16px;
}
</style>
