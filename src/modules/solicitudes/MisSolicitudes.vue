<template>
  <div class="q-pa-md">
    <h2>Mis solicitudes</h2>
    <q-separator color="primary" class="q-mb-lg"></q-separator>
    <q-table :columns="columns" :rows="rows" no-data-label="Sin información">
      <template v-slot:top-left>
        <q-btn color="primary" outline label="Crear solicitud"  dense icon="add" @click="abrirModalSolicitud" />
      </template>
    </q-table>
  </div>
  <StepperSolicitud ref="modalSolicitud"></StepperSolicitud>
</template>
<script>
import { ref } from 'vue'
import StepperSolicitud from '../../components/StepperSolicitud.vue'

  export default {
    components: {
      StepperSolicitud
    },
    setup () {
      const modalSolicitud = ref(null)

      const columns = []
      const rows = []

      const abrirModalSolicitud = () => {
        modalSolicitud.value.abrir()
      }

      return {
        columns,
        rows,
        modalSolicitud,
        abrirModalSolicitud
      }
    }
  }
</script>
