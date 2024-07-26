<template>
  <div class="q-pa-md">
    <h2>Dias Ganados</h2>
    <q-separator color="primary" class="q-mb-lg"></q-separator>
    <q-table :columns="columns" :rows="diasGanadosFiltrados" :loading="cargando" :filter="buscar" no-data-label="No se encontró informacion disponible."
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
            <q-btn dense color="primary" icon-right="playlist_add"
            label="Agregar" no-caps :disable="cargando" @click="agregarDias()"/>
          </div>
          <div class="fit row q-gutter-sm">
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
    </q-table>
  </div>
  <modal-dias-ganados ref="modalDias"></modal-dias-ganados>
</template>
<script>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { formatearFecha } from 'src/helpers/formatearFecha'
import { useDiasGanadosStore } from 'src/stores/diasGanados'
import { useColaboradoresStore } from 'src/stores/colaboradores'
import { useEmpresasStore } from 'src/stores/empresas'
import { useSucursalesStore } from 'src/stores/sucursales'
import { useDepartamentosStore } from 'src/stores/departamentos'
import { filtrarOpciones, filtrarElementosPorEmpresaSucursalDepartamento, limpiarFiltrosEmpresaSucursalDepartamento} from 'src/helpers/filtros'
import ModalDiasGanados from 'src/components/ModalDiasGanados.vue'

export default {
    components: {
      ModalDiasGanados
    },
    setup () {

      const useEmpresas = useEmpresasStore()
      const { listaClavesEmpresas, empresasFiltradas, modelEmpresasSeleccionadas, todasEmpresasSeleccionadas } = storeToRefs(useEmpresas)

      const useSucursales = useSucursalesStore()
      const { listaClavesSucursales, sucursales, sucursalesFiltradas, modelSucursalesSeleccionadas, todasSucursalesSeleccionadas } = storeToRefs(useSucursales)

      const useDepartamentos = useDepartamentosStore()
      const { listaClavesDepartamentos, departamentos, departamentosFiltrados, modelDepartamentosSeleccionados, todosDepartamentosSeleccionados } = storeToRefs(useDepartamentos)

      const useDiasGanados = useDiasGanadosStore()
      const { obtenerDiasGanados } = useDiasGanados
      const { diasGanados, diasGanadosFiltrados, cargando } = storeToRefs(useDiasGanados)

      const useColaboradores = useColaboradoresStore()
      const { obtenerColaboradores } = useColaboradores

      const modalDias = ref(null)

      const columns = [
        {
          name: "numero_empleado",
          label: "Numero Empleado",
          align: "left",
          field: "numero_empleado",
          sortable: true
        },
        {
          name: "nombreEmpleado",
          label: "Nombre",
          align: "left",
          field: "nombreEmpleado",
          sortable: true
        },
        {
          name: "diasGanados",
          label: "Dias Ganados",
          align: "left",
          field: "diasGanados",
          sortable: true
        },
        {
          name: "motivo",
          label: "Motivo",
          align: "left",
          field: "motivo",
          sortable: true
        },
        {
          name: "descripcionMotivo",
          label: "Descripción",
          align: "left",
          field: "descripcionMotivo",
          sortable: true
        },
        {
          name: "editedBy",
          label: "Agregado por",
          align: "left",
          field: "editedBy",
          sortable: true
        },
        {
          name: "createdAt",
          label: "Fecha Registro",
          align: "left",
          field: (row) => formatearFecha(row.createdAt),
          sortable: true
        },
      ]

      onMounted(async () => {
        await obtenerDiasGanados()
        await obtenerColaboradores()
        limpiarFiltros()
      })

      const agregarDias = () => {
        modalDias.value.abrir()
      }

      const filtrar = (tipoFiltro) => {

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
        filtrarElementosPorEmpresaSucursalDepartamento(diasGanados, diasGanadosFiltrados,
          todasEmpresasSeleccionadas, listaClavesEmpresas, modelEmpresasSeleccionadas,
          todasSucursalesSeleccionadas, listaClavesSucursales, modelSucursalesSeleccionadas,
          todosDepartamentosSeleccionados, listaClavesDepartamentos, modelDepartamentosSeleccionados)

      }

      const limpiarFiltros = () => {
        limpiarFiltrosEmpresaSucursalDepartamento(todasEmpresasSeleccionadas, modelEmpresasSeleccionadas,
        todasSucursalesSeleccionadas, modelSucursalesSeleccionadas, todosDepartamentosSeleccionados,
        modelDepartamentosSeleccionados, sucursales, sucursalesFiltradas,
        listaClavesEmpresas, departamentos, departamentosFiltrados)
      }

      return {
        buscar: ref(''),
        columns,
        cargando,
        diasGanadosFiltrados,
        agregarDias,
        modalDias,
        empresasFiltradas,
        modelEmpresasSeleccionadas,
        todasEmpresasSeleccionadas,
        sucursalesFiltradas,
        modelSucursalesSeleccionadas,
        todasSucursalesSeleccionadas,
        departamentosFiltrados,
        modelDepartamentosSeleccionados,
        todosDepartamentosSeleccionados,
        filtrar
      }
    }
  }
</script>
