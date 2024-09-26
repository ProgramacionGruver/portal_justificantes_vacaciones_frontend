<template>
  <div class="q-pa-md">
    <h2>Historial de solicitudes</h2>
    <q-separator color="primary" class="q-mb-lg"></q-separator>
    <q-table :filter="buscar" rows-per-page-label="Registros por página"
      :rows-per-page-options="[7, 10, 15, 20, 25, 50, 0]" loading-label="Cargando..."
      :loading="cargandoHistorialSolicitudes" :columns="columns" :rows="historialSolicitudesFiltradas"
      no-data-label="Sin información">
      <template v-slot:top>
        <div class="fit row q-gutter-sm q-mb-sm justify-end">
          <div class="col">
            <q-input color="blue" outlined dense v-model="buscar" placeholder="Buscar">
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
        <div class="filtros--historial">
          <q-btn-dropdown dense outline class="col q-my-sm" color="grey" label="Empresas">
            <q-checkbox class="q-pa-md" dense :disable="todasEmpresasSeleccionadas" v-model="todasEmpresasSeleccionadas"
              label="Todas" @update:model-value="filtrar('TODASEMPRESAS')" />
            <q-separator class="q-mx-md bg-gray"></q-separator>
            <q-option-group class="q-pa-md" dense :options="empresasFiltradas" v-model="modelEmpresasSeleccionadas"
              @update:model-value="filtrar('OPCIONESEMPRESAS')" type="checkbox" />
          </q-btn-dropdown>
          <q-btn-dropdown dense outline class="col q-my-sm " color="grey" label="Sucursales">
            <q-checkbox class="q-pa-md" dense :disable="todasSucursalesSeleccionadas"
              v-model="todasSucursalesSeleccionadas" label="Todas" @update:model-value="filtrar('TODASSUCURSALES')" />
            <q-separator class="q-mx-sm bg-gray"></q-separator>
            <q-option-group class="q-pa-md" dense :options="sucursalesFiltradas" v-model="modelSucursalesSeleccionadas"
              @update:model-value="filtrar('OPCIONESSUCURSALES')" type="checkbox" />
          </q-btn-dropdown>
          <q-btn-dropdown dense outline class="col q-my-sm " color="grey" label="Departamentos">
            <q-checkbox class="q-pa-md" dense :disable="todosDepartamentosSeleccionados"
              v-model="todosDepartamentosSeleccionados" label="Todos"
              @update:model-value="filtrar('TODOSDEPARTAMENTOS')" />
            <q-separator class="q-mx-sm bg-gray"></q-separator>
            <q-option-group class="q-pa-md" dense :options="departamentosFiltrados"
              v-model="modelDepartamentosSeleccionados" @update:model-value="filtrar('OPCIONESDEPARTAMENTOS')"
              type="checkbox" />
          </q-btn-dropdown>
          <q-btn-dropdown dense outline class="col q-my-sm" color="grey" label="Tipo solicitud">
            <q-checkbox class="q-pa-md" dense :disable="todosTipoSolicitudesSeleccionados"
              v-model="todosTipoSolicitudesSeleccionados" label="Todos"
              @update:model-value="filtrar('TODOSTIPOSOLICITUD')" />
            <q-separator class="q-mx-sm bg-gray"></q-separator>
            <q-option-group class="q-pa-md" dense :options="todosTipoSolicitudesFiltrados"
              v-model="tiposSolicitudSeleccionados" @update:model-value="filtrar('OPCIONESTIPOSOLICITUD')"
              type="checkbox" />
          </q-btn-dropdown>
          <q-btn-dropdown dense outline class="col q-my-sm" color="grey" label="Motivo">
            <q-checkbox class="q-pa-md" dense :disable="todosMotivosSeleccionados" v-model="todosMotivosSeleccionados"
              label="Todos" @update:model-value="filtrar('TODOSMOTIVOS')" />
            <q-separator class="q-mx-sm bg-gray"></q-separator>
            <q-option-group class="q-pa-md" dense :options="todosMotivosFiltrados" v-model="motivosSeleccionados"
              @update:model-value="filtrar('OPCIONESMOTIVOS')" type="checkbox" />
          </q-btn-dropdown>
        </div>
      </template>
      <template v-slot:body-cell-estatus="props">
        <q-td class="align-right">
          <div class="icons-container">
            <q-chip clickable @click="verDetalleSolicitud(props.row)"
              :icon="obtenerPropsQChip(props.row.solicitud_detalles).icono" text-color="white"
              :color="obtenerPropsQChip(props.row.solicitud_detalles).color"
              :label="obtenerPropsQChip(props.row.solicitud_detalles).nombre">
              <q-tooltip>Ver detalles</q-tooltip>
            </q-chip>
          </div>
        </q-td>
      </template>


    </q-table>
  </div>
  <ModalVerDetalleSolicitud ref="modalDetalle"></ModalVerDetalleSolicitud>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useEmpresasStore } from 'src/stores/empresas'
import { useSucursalesStore } from 'src/stores/sucursales'
import { useDepartamentosStore } from 'src/stores/departamentos'
import { useJustificantesVacacionesStore } from 'src/stores/justificantesVacaciones'
import { storeToRefs } from 'pinia'
import { formatearFecha } from 'src/helpers/formatearFecha'
import { obtenerPropsQChip, obtenerTextoAutorizacion } from 'src/helpers/autorizacionesSolicitud.js'
import { filtrarElementos, filtrarElementosPorEmpresaSucursalDepartamento, filtrarOpcionesHistorialSolicitudes } from 'src/helpers/filtros'
import ModalVerDetalleSolicitud from 'src/components/ModalVerDetalleSolicitud.vue'

export default {
  components: {
    ModalVerDetalleSolicitud
  },
  setup() {
    const useEmpresas = useEmpresasStore()
    const { primeraCarga, listaClavesEmpresas, empresasFiltradas, modelEmpresasSeleccionadas, todasEmpresasSeleccionadas } = storeToRefs(useEmpresas)
    const { obtenerEmpresas } = useEmpresas

    const useSucursales = useSucursalesStore()
    const { listaClavesSucursales, sucursales, sucursalesFiltradas, modelSucursalesSeleccionadas, todasSucursalesSeleccionadas } = storeToRefs(useSucursales)
    const { obtenerSucursales } = useSucursales

    const useDepartamentos = useDepartamentosStore()
    const { listaClavesDepartamentos, departamentos, departamentosFiltrados, modelDepartamentosSeleccionados, todosDepartamentosSeleccionados } = storeToRefs(useDepartamentos)
    const { obtenerDepartamentos } = useDepartamentos

    const useJustificantesVacaciones = useJustificantesVacacionesStore()
    const { obtenerTodasSolicitudes } = useJustificantesVacaciones
    const { todosMotivosFiltrados, todosMotivosSeleccionados, motivosSeleccionados, listaIdsMotivos, todosTipoSolicitudesFiltrados
      , todosTipoSolicitudesSeleccionados, tiposSolicitudSeleccionados, listaIdsTipoSolicitudes, historialSolicitudes, historialSolicitudesFiltradas } = storeToRefs(useJustificantesVacaciones)

    const modalDetalle = ref(null)
    const cargandoHistorialSolicitudes = ref(false)
    const hoy = new Date()
    hoy.setDate(hoy.getDate() - 1)
    const unaSemanaAntes = new Date()
    unaSemanaAntes.setDate(hoy.getDate() - 7)

    const objBusqueda = ref({
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
        name: 'colaborador',
        label: 'Colaborador',
        field: (row) => row.usuario.nombre,
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
      try {
        cargandoHistorialSolicitudes.value = true
        if (primeraCarga.value) {
          primeraCarga.value = false
          await obtenerEmpresas()
          await obtenerSucursales()
          await obtenerDepartamentos()
        }
        await obtenerTodasSolicitudes(objBusqueda.value)
        await filtrar('TODASEMPRESAS')
      } catch {

      } finally {
        cargandoHistorialSolicitudes.value = false
      }
    })

    const verDetalleSolicitud = (row) => {
      modalDetalle.value.abrir(row)
    }

    const filtrar = async (tipoFiltro) => {

      // Filtra las opciones según (empresa, sucursal, departamento) (NO FILTRA INFORMACION)
      filtrarOpcionesHistorialSolicitudes(tipoFiltro,
        listaClavesEmpresas, todasEmpresasSeleccionadas, modelEmpresasSeleccionadas,
        sucursales, sucursalesFiltradas, listaClavesSucursales, todasSucursalesSeleccionadas, modelSucursalesSeleccionadas,
        departamentos, departamentosFiltrados, listaClavesDepartamentos, todosDepartamentosSeleccionados, modelDepartamentosSeleccionados,
        todosTipoSolicitudesSeleccionados, tiposSolicitudSeleccionados, todosMotivosSeleccionados, motivosSeleccionados
      )

      //Filtrar los datos segun las opciones seleccionadas
      filtrarDatos()
    }

    // Filtrar los datos segun las opciones seleccionadas
    const filtrarDatos = () => {
      filtrarElementosPorEmpresaSucursalDepartamento(historialSolicitudes, historialSolicitudesFiltradas,
        todasEmpresasSeleccionadas, listaClavesEmpresas, modelEmpresasSeleccionadas,
        todasSucursalesSeleccionadas, listaClavesSucursales, modelSucursalesSeleccionadas,
        todosDepartamentosSeleccionados, listaClavesDepartamentos, modelDepartamentosSeleccionados)

      // Filtra el historial de solicitudes según el tipo de solicitud
      historialSolicitudesFiltradas.value = todosTipoSolicitudesSeleccionados.value ?
        filtrarElementos(listaIdsTipoSolicitudes.value, historialSolicitudesFiltradas.value, 'idTipoSolicitud')
        : filtrarElementos(tiposSolicitudSeleccionados.value, historialSolicitudesFiltradas.value, 'idTipoSolicitud')

      // Filtra el historial de solicitudes según el motivo de solicitud
      historialSolicitudesFiltradas.value = todosMotivosSeleccionados.value ?
        filtrarElementos(listaIdsMotivos.value, historialSolicitudesFiltradas.value, 'idMotivo')
        : filtrarElementos(motivosSeleccionados.value, historialSolicitudesFiltradas.value, 'idMotivo')
    }

    const limpiarFechaFin = () => {
      objBusqueda.value.fechaFin = null;
    };

    const busquedaFechas = async () => {
      if (objBusqueda.value.fechaInicio && objBusqueda.value.fechaFin) {
        historialSolicitudesFiltradas.value = [];
        columns.value = [];
        try {
          cargandoHistorialSolicitudes.value = true;
          await obtenerTodasSolicitudes(objBusqueda.value);
          await filtrar("TODASEMPRESAS");
        } catch {
        } finally {
          cargandoHistorialSolicitudes.value = false;
        }
      }
    };

    return {
      objBusqueda,
      columns,
      historialSolicitudesFiltradas,
      cargandoHistorialSolicitudes,
      formatearFecha,
      obtenerPropsQChip,
      verDetalleSolicitud,
      modalDetalle,
      obtenerTextoAutorizacion,
      limpiarFechaFin,
      busquedaFechas,
      buscar: ref(''),
      empresasFiltradas,
      modelEmpresasSeleccionadas,
      todasEmpresasSeleccionadas,
      sucursalesFiltradas,
      modelSucursalesSeleccionadas,
      todasSucursalesSeleccionadas,
      departamentosFiltrados,
      modelDepartamentosSeleccionados,
      todosDepartamentosSeleccionados,
      todosMotivosFiltrados,
      todosMotivosSeleccionados,
      motivosSeleccionados,
      todosTipoSolicitudesFiltrados,
      todosTipoSolicitudesSeleccionados,
      tiposSolicitudSeleccionados,
      filtrar
    }
  }
}
</script>
<style scoped>
.align-right {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.icons-container {
  display: flex;
  align-items: center;
}
</style>
