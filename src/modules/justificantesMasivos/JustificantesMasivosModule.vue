<template>
  <div class="q-pa-md">
    <h2>Justificantes Masivos</h2>
    <q-separator color="primary" class="q-mb-lg"></q-separator>
    <q-table :columns="columns" :rows="justificantesMasivosFiltrados" :loading="cargandoJustificantesMasivos" :filter="buscar" no-data-label="No se encontró informacion disponible."
    loading-label="Buscando información. . . "  row-key="numero_empleado">
    <template v-slot:top>
          <div class="fit row q-gutter-sm q-mb-sm justify-end">
            <div class="col">
              <q-input outlined dense v-model="buscar" :disable="cargando" placeholder="Buscar">
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
            <div class="q-ml-md">
                  <q-btn color="primary" icon-right="playlist_add" label="Agregar" no-caps :disable="cargando" @click="agregarJustificantes()"/>
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
            </div>
      </template>
      <template v-slot:body-cell-acciones="props">
          <q-td>
            <q-btn dense flat color="primary" icon="visibility" @click="verJustificantes(props.row)">
              <q-tooltip>
                Ver Justificantes
              </q-tooltip>
            </q-btn>
          </q-td>
      </template>
    </q-table>
  </div>
  <ModalJustificantesMasivos ref="modalJustificantes"></ModalJustificantesMasivos>
  <ModalVerJustificantesMasivos ref="modalVerJustificantes"></ModalVerJustificantesMasivos>
</template>
<script>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { formatearFecha } from 'src/helpers/formatearFecha'
import { useJustificantesVacacionesStore } from 'src/stores/justificantesVacaciones'
import { useEmpresasStore } from 'src/stores/empresas'
import { useSucursalesStore } from 'src/stores/sucursales'
import { useDepartamentosStore } from 'src/stores/departamentos'
import { useCatalogosStore } from 'src/stores/catalogos'
import { filtrarOpciones, filtrarElementosPorEmpresaSucursalDepartamento} from 'src/helpers/filtros'
import ModalJustificantesMasivos from 'src/components/ModalJustificantesMasivos.vue'
import ModalVerJustificantesMasivos from 'src/components/ModalVerJustificantesMasivos.vue'

export default {
    components: {
      ModalJustificantesMasivos,
      ModalVerJustificantesMasivos
    },
    setup () {

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
      const { cargandoJustificantesMasivos, justificantesMasivos, justificantesMasivosFiltrados } = storeToRefs(useJustificantesVacaciones)
      const { obtenerJustificantesMasivos } = useJustificantesVacaciones

      const useCatalogos = useCatalogosStore()
      const { cargando } = storeToRefs(useCatalogos)
      const { obtenerCatalogoUsuarios } = useCatalogos

      const modalJustificantes = ref(null)
      const modalVerJustificantes = ref(null)
      const hoy = new Date()
      const unaSemanaAntes = new Date()
      unaSemanaAntes.setDate(hoy.getDate() - 15)

      const objBusqueda = ref({
        fechaInicio: unaSemanaAntes.toISOString().split("T")[0],
        fechaFin: hoy.toISOString().split("T")[0],
      })

      const columns = [
        {
          name: 'folioJustificanteMasivo',
          label: 'Folio',
          field: 'folioJustificanteMasivo',
          align: 'left',
          sortable: true
        },
        {
          name: 'motivo',
          label: 'Motivo',
          field: 'motivo',
          align: 'left',
          sortable: true
        },
        {
          name: 'descripcionMotivo',
          label: 'Descripción Motivo',
          field: 'descripcionMotivo',
          align: 'left',
          sortable: true
        },
        {
          name: 'editedBy',
          label: 'Agregado por',
          field: 'editedBy',
          align: 'left',
          sortable: true
        },
        {
          name: 'fecha',
          label: 'Fecha creación',
          field: (row) => formatearFecha(row.createdAt),
          align: 'left',
          sortable: true
        },
        {
          name: 'acciones',
          field:'acciones',
          align: 'left'
        }
      ]

      onMounted(async () => {
        try{
          cargandoJustificantesMasivos.value = true
          if(primeraCarga.value){
            primeraCarga.value = false
            await obtenerEmpresas()
            await obtenerSucursales()
            await obtenerDepartamentos()
          }
          await obtenerJustificantesMasivos(objBusqueda.value)
          await filtrar('TODASEMPRESAS')
          await obtenerCatalogoUsuarios()
        }catch{

        }finally{
          cargandoJustificantesMasivos.value = false
        }
      })

      const agregarJustificantes = () => {
        modalJustificantes.value.abrir()
      }

      const verJustificantes = (row) => {
        modalVerJustificantes.value.abrir(row)
      }

      const filtrar = async(tipoFiltro) => {

        // Filtra las opciones según (empresa, sucursal, departamento) (NO FILTRA INFORMACION)
        filtrarOpciones(tipoFiltro,
          listaClavesEmpresas, todasEmpresasSeleccionadas, modelEmpresasSeleccionadas,
          sucursales, sucursalesFiltradas, listaClavesSucursales, todasSucursalesSeleccionadas, modelSucursalesSeleccionadas,
          departamentos, departamentosFiltrados, listaClavesDepartamentos, todosDepartamentosSeleccionados, modelDepartamentosSeleccionados)

        //Filtrar los datos segun las opciones seleccionadas
        filtrarDatos()
      }

      // Filtrar los datos segun las opciones seleccionadas
      const filtrarDatos = () => {
        filtrarElementosPorEmpresaSucursalDepartamento(justificantesMasivos, justificantesMasivosFiltrados,
          todasEmpresasSeleccionadas, listaClavesEmpresas, modelEmpresasSeleccionadas,
          todasSucursalesSeleccionadas, listaClavesSucursales, modelSucursalesSeleccionadas,
          todosDepartamentosSeleccionados, listaClavesDepartamentos, modelDepartamentosSeleccionados)

      }

      const limpiarFechaFin = () => {
        objBusqueda.value.fechaFin = null
      }

      const busquedaFechas = async () => {
        if (objBusqueda.value.fechaInicio && objBusqueda.value.fechaFin) {
          try {
            cargandoJustificantesMasivos.value = true
            await obtenerJustificantesMasivos(objBusqueda.value)
          } catch {
          } finally {
            cargandoJustificantesMasivos.value = false
          }
        }
      }

      return {
        buscar: ref(''),
        columns,
        cargando,
        justificantesMasivosFiltrados,
        cargandoJustificantesMasivos,
        agregarJustificantes,
        modalJustificantes,
        verJustificantes,
        modalVerJustificantes,
        empresasFiltradas,
        modelEmpresasSeleccionadas,
        todasEmpresasSeleccionadas,
        sucursalesFiltradas,
        modelSucursalesSeleccionadas,
        todasSucursalesSeleccionadas,
        departamentosFiltrados,
        modelDepartamentosSeleccionados,
        todosDepartamentosSeleccionados,
        filtrar,
        objBusqueda,
        limpiarFechaFin,
        busquedaFechas
      }
    }
  }
</script>
