<template>
  <div class="q-pa-md">
    <h2>Mis solicitudes</h2>
    <q-separator color="primary" class="q-mb-lg"></q-separator>
    <q-table rows-per-page-label="Registros por página" :rows-per-page-options="[7, 10, 15, 20, 25, 50, 0]" loading-label="Cargando..." :loading="cargandoMisSolicitudes" :columns="columns" :rows="todasSolicitudesEmpleado" no-data-label="Sin información">
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
import { useAutenticacionStore } from 'src/stores/autenticaciones'
import { useJustificantesVacacionesStore } from 'src/stores/justificantesVacaciones'
import { storeToRefs } from 'pinia'
import { formatearFecha } from 'src/helpers/formatearFecha'

  export default {
    components: {
      StepperSolicitud
    },
    setup () {
      const useAutenticacion = useAutenticacionStore()
      const { usuarioAutenticado } = storeToRefs(useAutenticacion)

      const useJustificantesVacaciones = useJustificantesVacacionesStore()
      const { cargandoMisSolicitudes, todasSolicitudesEmpleado } = storeToRefs(useJustificantesVacaciones)

      const modalSolicitud = ref(null)

      const columns = [
        {
          name: 'folio',
          label: 'Folio',
          field: 'folio',
          align: 'left',
          sortable: true
        },
        {
          name: 'tipoSolicitud',
          label: 'Tipo',
          field: (row) => row.catalogo_tipo_solicitude.nombreSolicitd,
          align: 'left',
          sortable: true
        },
        {
          name: 'motivo',
          label: 'Motivo',
          field: (row) => row.catalogo_motivo?.nombreMotivo,
          align: 'left',
          sortable: true
        },
        {
          name: 'fecha',
          label: 'Fecha solicitud',
          field: (row) => formatearFecha(row.createdAt),
          align: 'left',
          sortable: true
        },
        {
          name: 'estatus',
          label: 'Estatus',
          field: null ,
          align: 'left',
          sortable: true
        },
      ]

      const abrirModalSolicitud = () => {
        modalSolicitud.value.abrir(usuarioAutenticado.value.numero_empleado)
      }

      return {
        columns,
        modalSolicitud,
        todasSolicitudesEmpleado,
        cargandoMisSolicitudes,
        abrirModalSolicitud,
        formatearFecha
      }
    }
  }
</script>
