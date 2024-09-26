<template>
  <div class="q-pa-md">
    <h2>Mis autorizaciones</h2>
    <q-separator color="primary" class="q-mb-lg"></q-separator>
    <q-table :filter="buscar" rows-per-page-label="Registros por página" :rows-per-page-options="[7, 10, 15, 20, 25, 50, 0]"
      loading-label="Cargando..." :loading="cargandoAutorizaciones" :columns="columns" :rows="todasAutorizacionesEmpleado"
      no-data-label="Sin información">
      <template v-slot:top>
        <div class="contenedor--top">
          <div>
            <q-input outlined dense v-model="buscar" placeholder="Buscar">
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
          <div class="fechas--asistencias">
            <div>
              <q-input
                dense
                filled
                v-model="objBusqueda.fechaInicio"
                type="date"
                @update:model-value="limpiarFechaFin()"
              />
            </div>
            <div>
              <q-input
                dense
                filled
                v-model="objBusqueda.fechaFin"
                type="date"
                @update:model-value="busquedaFechas()"
              />
            </div>
          </div>
        </div>
      </template>
      <template v-slot:body-cell-estatus="props">
        <q-td>
          <q-chip clickable @click="verDetalleSolicitud(props.row)" :icon="obtenerPropsQChip(props.row.solicitud_detalles).icono" text-color="white"
            :color="obtenerPropsQChip(props.row.solicitud_detalles).color" :label="obtenerPropsQChip(props.row.solicitud_detalles).nombre"><q-tooltip>Ver detalles</q-tooltip></q-chip>
        </q-td>
      </template>
      <template v-slot:body-cell-acciones="props">
          <td>
            <q-btn
              v-if="obtenerPropsQChip(props.row.solicitud_detalles).nombre != 'Finalizado'"
              flat
              icon="attach_email"
              color="white"
              class="bg-primary"
              @click="abrirUrl(props.row.url)">
              <q-tooltip>Abrir Autorización</q-tooltip>
            </q-btn>
          </td>
        </template>
    </q-table>
  </div>
  <ModalVerDetalleSolicitud ref="modalDetalle"></ModalVerDetalleSolicitud>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useAutenticacionStore } from 'src/stores/autenticaciones'
import { useJustificantesVacacionesStore } from 'src/stores/justificantesVacaciones'
import { storeToRefs } from 'pinia'
import { formatearFecha } from 'src/helpers/formatearFecha'
import { obtenerPropsQChip, obtenerTextoAutorizacion } from 'src/helpers/autorizacionesSolicitud.js'
import ModalVerDetalleSolicitud from 'src/components/ModalVerDetalleSolicitud.vue'

export default {
  components: {
    ModalVerDetalleSolicitud
  },
  setup() {
    const useAutenticacion = useAutenticacionStore()
    const { usuarioAutenticado } = storeToRefs(useAutenticacion)

    const useJustificantesVacaciones = useJustificantesVacacionesStore()
    const {obtenerAutorizacionesPorEmpleado} = useJustificantesVacaciones
    const { todasAutorizacionesEmpleado } = storeToRefs(useJustificantesVacaciones)

    const modalDetalle = ref(null)
    const cargandoAutorizaciones = ref(false)
    const hoy = new Date()
    const unaSemanaAntes = new Date()
    unaSemanaAntes.setDate(hoy.getDate() - 15)

    const objBusqueda = ref({
      numero_empleado: usuarioAutenticado.value.numero_empleado,
      fechaInicio: unaSemanaAntes.toISOString().split("T")[0],
      fechaFin: hoy.toISOString().split("T")[0],
    })

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
        align: 'left',
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
      {
        name: 'acciones',
        align: 'center'
      }
    ]

    onMounted(async () => {
      try {
        cargandoAutorizaciones.value = true
        await obtenerAutorizacionesPorEmpleado(objBusqueda.value)
      } catch {

      } finally {
        cargandoAutorizaciones.value = false
      }
    })

    const verDetalleSolicitud = (row) => {
      modalDetalle.value.abrir(row)
    }

    const limpiarFechaFin = () => {
      objBusqueda.value.fechaFin = null
    }

    const busquedaFechas = async () => {
      if (objBusqueda.value.fechaInicio && objBusqueda.value.fechaFin) {
        todasAutorizacionesEmpleado.value = []
        try {
          cargandoAutorizaciones.value = true
          await obtenerAutorizacionesPorEmpleado(objBusqueda.value)
        } catch {
        } finally {
          cargandoAutorizaciones.value = false
        }
      }
    }

    const abrirUrl = async (url) => {
      window.open(url, '_blank')
    }

    return {
      buscar: ref(''),
      columns,
      cargandoAutorizaciones,
      formatearFecha,
      obtenerPropsQChip,
      verDetalleSolicitud,
      modalDetalle,
      obtenerTextoAutorizacion,
      limpiarFechaFin,
      busquedaFechas,
      todasAutorizacionesEmpleado,
      objBusqueda,
      abrirUrl
    }
  }
}
</script>
