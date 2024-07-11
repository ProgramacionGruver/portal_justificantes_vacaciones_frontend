<template>
  <div class="q-pa-md">
    <h2>Mis solicitudes</h2>
    <q-separator color="primary" class="q-mb-lg"></q-separator>
    <q-table rows-per-page-label="Registros por página" :rows-per-page-options="[5, 7, 10, 15, 20, 25, 50, 0]"
      loading-label="Cargando..." :loading="cargandoMisSolicitudes" :columns="columns" :rows="todasSolicitudesEmpleado"
      no-data-label="Sin información">
      <template v-slot:top-left>
        <q-btn color="primary" outline label="Crear solicitud" dense icon="add" @click="abrirModalSolicitud" />
      </template>
      <template v-slot:body-cell-estatus="props">
        <q-td>
          <q-icon v-for="index in numeroAutorizaciones" :key="index" class="q-mr-md" size="sm"
            :name="obtenerIconoYColorAutorizacion(props.row.solicitud_detalles, index).icon"
            :color="obtenerIconoYColorAutorizacion(props.row.solicitud_detalles, index).color"><q-tooltip>{{ obtenerTextoAutorizacion(index-1) }}</q-tooltip></q-icon>
          <q-chip clickable @click="verDetalleSolicitud(props.row)" :icon="obtenerPropsQChip(props.row.solicitud_detalles).icono" text-color="white"
            :color="obtenerPropsQChip(props.row.solicitud_detalles).color" :label="obtenerPropsQChip(props.row.solicitud_detalles).nombre"><q-tooltip>Ver detalles</q-tooltip></q-chip>
        </q-td>
      </template>
    </q-table>
  </div>
  <StepperSolicitud ref="modalSolicitud"></StepperSolicitud>
  <ModalVerDetalleSolicitud ref="modalDetalle"></ModalVerDetalleSolicitud>
</template>

<script>
import { ref, computed } from 'vue'
import StepperSolicitud from '../../components/StepperSolicitud.vue'
import { useAutenticacionStore } from 'src/stores/autenticaciones'
import { useJustificantesVacacionesStore } from 'src/stores/justificantesVacaciones'
import { storeToRefs } from 'pinia'
import { formatearFecha } from 'src/helpers/formatearFecha'
import { obtenerIconoYColorAutorizacion, obtenerPropsQChip, obtenerTextoAutorizacion } from 'src/helpers/autorizacionesSolicitud.js'
import ModalVerDetalleSolicitud from '../../components/ModalVerDetalleSolicitud.vue'

export default {
  components: {
    StepperSolicitud,
    ModalVerDetalleSolicitud
  },
  setup() {
    const useAutenticacion = useAutenticacionStore()
    const { usuarioAutenticado } = storeToRefs(useAutenticacion)

    const useJustificantesVacaciones = useJustificantesVacacionesStore()
    const { cargandoMisSolicitudes, todasSolicitudesEmpleado } = storeToRefs(useJustificantesVacaciones)

    const modalSolicitud = ref(null)
    const modalDetalle = ref(null)

    const columns = [
      {
        name: 'folio',
        label: 'Folio',
        field: 'folio',
        align: 'center',
        sortable: true
      },
      {
        name: 'estatus',
        label: 'Estatus',
        align: 'center',
        sortable: true
      },
      {
        name: 'tipoSolicitud',
        label: 'Tipo',
        field: (row) => row.catalogo_tipo_solicitude.nombreSolicitud,
        align: 'center',
        sortable: true
      },
      {
        name: 'motivo',
        label: 'Motivo',
        field: (row) => row.catalogo_motivo?.nombreMotivo,
        align: 'center',
        sortable: true
      },
      {
        name: 'fecha',
        label: 'Fecha solicitud',
        field: (row) => formatearFecha(row.createdAt),
        align: 'center',
        sortable: true
      },
    ]

    const abrirModalSolicitud = () => {
      modalSolicitud.value.abrir(usuarioAutenticado.value.numero_empleado)
    }

    const verDetalleSolicitud = (row) => {
      modalDetalle.value.abrir(row)
    }

    const numeroAutorizaciones = computed(() => {
      return todasSolicitudesEmpleado.value?.[0]?.solicitud_detalles?.[0]?.autorizaciones_solicitudes?.length ?? 0
    })

    return {
      columns,
      modalSolicitud,
      todasSolicitudesEmpleado,
      cargandoMisSolicitudes,
      abrirModalSolicitud,
      formatearFecha,
      numeroAutorizaciones,
      obtenerIconoYColorAutorizacion,
      obtenerPropsQChip,
      verDetalleSolicitud,
      modalDetalle,
      obtenerTextoAutorizacion
    }
  }
}
</script>
