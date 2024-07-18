<template>
  <div class="q-pa-md">
    <h2>Dias Ganados</h2>
    <q-separator color="primary" class="q-mb-lg"></q-separator>
    <q-table :columns="columns" :rows="diasGanados" :loading="cargando" :filter="buscar" no-data-label="No se encontró informacion disponible."
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
            <q-btn-dropdown dense outline class="col q-ma-sm" color="grey" label="Empresas">
              <q-checkbox class="q-pa-md" dense :disable="todasEmpresasSeleccionadas" v-model="todasEmpresasSeleccionadas"
                label="Todas" @update:model-value="filtrar('TODASEMPRESAS')" />
              <q-separator class="q-mx-md bg-gray"></q-separator>
              <q-option-group class="q-pa-md" dense :options="empresas" v-model="modelEmpresasSeleccionadas"
                @update:model-value="filtrar('OPCIONESEMPRESAS')" type="checkbox" />
            </q-btn-dropdown>
            <q-btn-dropdown dense outline class="col q-ma-sm " color="grey" label="Sucursales">
              <q-checkbox class="q-pa-md" dense :disable="todasSucursalesSeleccionadas"
                v-model="todasSucursalesSeleccionadas" label="Todas" @update:model-value="filtrar('TODASSUCURSALES')" />
              <q-separator class="q-mx-sm bg-gray"></q-separator>
              <q-option-group class="q-pa-md" dense :options="sucursalesFiltradas" v-model="modelSucursalesSeleccionadas"
                @update:model-value="filtrar('OPCIONESSUCURSALES')" type="checkbox" />
            </q-btn-dropdown>
            <q-btn-dropdown dense outline class="col q-ma-sm " color="grey" label="Departamentos">
              <q-checkbox class="q-pa-md" dense :disable="todosDepartamentosSeleccionados"
                v-model="todosDepartamentosSeleccionados" label="Todos"
                @update:model-value="filtrar('TODOSDEPARTAMENTOS')" />
              <q-separator class="q-mx-sm bg-gray"></q-separator>
              <q-option-group class="q-pa-md" dense :options="departamentosFiltrados"
                v-model="modelDepartamentosSeleccionados" @update:model-value="filtrar('OPCIONESDEPARTAMENTOS')"
                type="checkbox" />
            </q-btn-dropdown>
          </div>

          <div class="fit row q-gutter-sm">
            <div class="col q-ma-sm">
              <q-select outlined dense :disable="cargando" :options="anios" v-model="anioSeleccionado"
                @update:model-value="cargarPresupuestos" map-options option-value="name" />
            </div>
            <div class="col q-ma-sm">
              <q-select outlined dense map-options :disable="cargando" :options="meses" v-model="mesSeleccionado"
                @update:model-value="cargarPresupuestos" option-value="name" />
            </div>
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
import ModalDiasGanados from 'src/components/ModalDiasGanados.vue'

export default {
    components: {
      ModalDiasGanados
    },
    setup () {

      const useDiasGanados = useDiasGanadosStore()
      const { obtenerDiasGanados } = useDiasGanados
      const { diasGanados, cargando } = storeToRefs(useDiasGanados)

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
      })

      const agregarDias = () => {
        modalDias.value.abrir()
      }

      return {
        buscar: ref(''),
        columns,
        cargando,
        diasGanados,
        agregarDias,
        modalDias
      }
    }
  }
</script>
