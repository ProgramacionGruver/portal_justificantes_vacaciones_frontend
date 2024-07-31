<template>
  <div class="q-pa-md">
    <h2>Solicitud de prórroga</h2>
    <q-separator color="primary" class="q-mb-lg"></q-separator>
    <q-table rows-per-page-label="Registros por página" :rows-per-page-options="[7, 10, 15, 20, 25, 50, 0]"
      loading-label="Cargando..." :loading="cargandoMisSolicitudes" :columns="columns" :rows="todasProrrogasEmpleado"
      no-data-label="Sin información">
      <template v-slot:top-left>
        <q-btn color="primary" outline label="Presentar solicitud" dense icon="add" @click="abrirModalProrroga" />
      </template>
      <template v-slot:body-cell-estatus="props">
        <q-td>
          <q-chip clickable @click="verDetalleSolicitud(props.row)" :icon="obtenerPropsQChip(props.row.solicitud_detalles).icono" text-color="white"
            :color="obtenerPropsQChip(props.row.solicitud_detalles).color" :label="obtenerPropsQChip(props.row.solicitud_detalles).nombre"><q-tooltip>Ver detalles</q-tooltip></q-chip>
        </q-td>
      </template>
    </q-table>
  </div>
  <ModalProrroga ref="modalSolicitud"></ModalProrroga>
  <ModalVerDetalleSolicitud ref="modalDetalle"></ModalVerDetalleSolicitud>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useJustificantesVacacionesStore } from 'src/stores/justificantesVacaciones'
import { useAutenticacionStore } from 'src/stores/autenticaciones'
import { storeToRefs } from 'pinia'
import { formatearFecha } from 'src/helpers/formatearFecha'
import { obtenerPropsQChip, obtenerTextoAutorizacion } from 'src/helpers/autorizacionesSolicitud.js'
import ModalProrroga from 'src/components/ModalProrroga.vue'
import ModalVerDetalleSolicitud from 'src/components/ModalVerDetalleSolicitud.vue'

export default {
  components: {
    ModalProrroga,
    ModalVerDetalleSolicitud
  },
  setup() {
    const useAutenticacion = useAutenticacionStore()
    const { usuarioAutenticado } = storeToRefs(useAutenticacion)

    const useJustificantesVacaciones = useJustificantesVacacionesStore()
    const { obtenerProrrogasPorEmpleado } = useJustificantesVacaciones
    const { cargandoMisSolicitudes, todasProrrogasEmpleado } = storeToRefs(useJustificantesVacaciones)

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

    onMounted(async () => {
      await obtenerProrrogasPorEmpleado(usuarioAutenticado.value.numero_empleado)
    })

    const abrirModalProrroga = () => {
      modalSolicitud.value.abrir(usuarioAutenticado.value.numero_empleado)
    }

    const verDetalleSolicitud = (row) => {
      modalDetalle.value.abrir(row)
    }

    return {
      columns,
      modalSolicitud,
      modalDetalle,
      todasProrrogasEmpleado,
      cargandoMisSolicitudes,
      abrirModalProrroga,
      formatearFecha,
      obtenerPropsQChip,
      verDetalleSolicitud,
      obtenerTextoAutorizacion

    }
  }
}
</script>
