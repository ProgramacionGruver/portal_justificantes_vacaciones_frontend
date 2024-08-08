<template>
  <div class="q-pa-md">
    <h2>Reporte de Faltas</h2>
    <q-separator color="primary" class="q-mb-lg"></q-separator>
    <q-table
      :columns="columns"
      :rows="faltasFiltradas"
      :loading="cargando"
      :filter="buscar"
      no-data-label="No se encontró informacion disponible."
      loading-label="Buscando información. . . "
      row-key="numero_empleado"
    >
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
        <div class="asistencias--select">
          <q-btn-dropdown
            dense
            outline
            class="q-my-sm"
            color="grey"
            label="Empresas"
          >
            <q-checkbox
              class="q-pa-md"
              dense
              :disable="todasEmpresasSeleccionadas"
              v-model="todasEmpresasSeleccionadas"
              label="Todas"
              @update:model-value="filtrar('TODASEMPRESAS')"
            />
            <q-separator class="q-mx-md bg-gray"></q-separator>
            <q-option-group
              class="q-pa-md"
              dense
              :options="empresasFiltradas"
              v-model="modelEmpresasSeleccionadas"
              @update:model-value="filtrar('OPCIONESEMPRESAS')"
              type="checkbox"
            />
          </q-btn-dropdown>
          <q-btn-dropdown
            dense
            outline
            class="q-my-sm"
            color="grey"
            label="Sucursales"
          >
            <q-checkbox
              class="q-pa-md"
              dense
              :disable="todasSucursalesSeleccionadas"
              v-model="todasSucursalesSeleccionadas"
              label="Todas"
              @update:model-value="filtrar('TODASSUCURSALES')"
            />
            <q-separator class="q-mx-sm bg-gray"></q-separator>
            <q-option-group
              class="q-pa-md"
              dense
              :options="sucursalesFiltradas"
              v-model="modelSucursalesSeleccionadas"
              @update:model-value="filtrar('OPCIONESSUCURSALES')"
              type="checkbox"
            />
          </q-btn-dropdown>
          <q-btn-dropdown
            dense
            outline
            class="q-my-sm"
            color="grey"
            label="Departamentos"
          >
            <q-checkbox
              class="q-pa-md"
              dense
              :disable="todosDepartamentosSeleccionados"
              v-model="todosDepartamentosSeleccionados"
              label="Todos"
              @update:model-value="filtrar('TODOSDEPARTAMENTOS')"
            />
            <q-separator class="q-mx-sm bg-gray"></q-separator>
            <q-option-group
              class="q-pa-md"
              dense
              :options="departamentosFiltrados"
              v-model="modelDepartamentosSeleccionados"
              @update:model-value="filtrar('OPCIONESDEPARTAMENTOS')"
              type="checkbox"
            />
          </q-btn-dropdown>
        </div>
      </template>
    </q-table>
  </div>
</template>
<script>
import { ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useEmpresasStore } from "src/stores/empresas";
import { useSucursalesStore } from "src/stores/sucursales";
import { useDepartamentosStore } from "src/stores/departamentos";
import { useAsistenciasStore } from "src/stores/asistencias";
import { formatearFecha } from "src/helpers/formatearFecha";
import { filtrarOpciones, filtrarElementosPorEmpresaSucursalDepartamento } from "src/helpers/filtros";

export default {
  components: {
  },
  setup() {
    const useEmpresas = useEmpresasStore();
    const {
      primeraCarga,
      listaClavesEmpresas,
      empresasFiltradas,
      modelEmpresasSeleccionadas,
      todasEmpresasSeleccionadas,
    } = storeToRefs(useEmpresas);
    const { obtenerEmpresas } = useEmpresas;

    const useSucursales = useSucursalesStore();
    const {
      listaClavesSucursales,
      sucursales,
      sucursalesFiltradas,
      modelSucursalesSeleccionadas,
      todasSucursalesSeleccionadas,
    } = storeToRefs(useSucursales);
    const { obtenerSucursales } = useSucursales;

    const useDepartamentos = useDepartamentosStore();
    const {
      listaClavesDepartamentos,
      departamentos,
      departamentosFiltrados,
      modelDepartamentosSeleccionados,
      todosDepartamentosSeleccionados,
    } = storeToRefs(useDepartamentos);
    const { obtenerDepartamentos } = useDepartamentos;

    const useAsistencias = useAsistenciasStore();
    const { obtenerFaltas } = useAsistencias;
    const { faltas, faltasFiltradas } = storeToRefs(useAsistencias);

    const cargando = ref(false);
    const hoy = new Date();
    hoy.setDate(hoy.getDate() - 1);
    const unaSemanaAntes = new Date();
    unaSemanaAntes.setDate(hoy.getDate() - 7);

    const columns = [
      {
        name: "numero_empleado",
        label: "No Empleado",
        align: "left",
        field: "numero_empleado",
        sortable: true
      },
      {
        name: "nombre",
        label: "Nombre",
        align: "left",
        field: "nombre",
        sortable: true
      },
      {
        name: "puesto",
        label: "Puesto",
        align: "left",
        field: "puesto",
        sortable: true
      },
      {
        name: "faltas",
        label: "Faltas",
        align: "left",
        field: "faltas",
        sortable: true
      },
      {
        name: "fechaDeFaltas",
        label: "Fechas",
        align: "left",
        field: "fechaDeFaltas",
        sortable: true
      },
    ];

    const objBusqueda = ref({
      fechaInicio: unaSemanaAntes.toISOString().split("T")[0],
      fechaFin: hoy.toISOString().split("T")[0],
    });

    onMounted(async () => {
      try {
        cargando.value = true;
        if (primeraCarga.value) {
          primeraCarga.value = false;
          await obtenerEmpresas();
          await obtenerSucursales();
          await obtenerDepartamentos();
        }
        faltasFiltradas.value = [];
        await obtenerFaltas(objBusqueda.value);
        await filtrar("TODASEMPRESAS");
      } catch {
      } finally {
        cargando.value = false;
      }
    });

    const filtrar = async (tipoFiltro) => {
      // Filtra las opciones según (empresa, sucursal, departamento) (NO FILTRA INFORMACION)
      filtrarOpciones(
        tipoFiltro,
        listaClavesEmpresas,
        todasEmpresasSeleccionadas,
        modelEmpresasSeleccionadas,
        sucursales,
        sucursalesFiltradas,
        listaClavesSucursales,
        todasSucursalesSeleccionadas,
        modelSucursalesSeleccionadas,
        departamentos,
        departamentosFiltrados,
        listaClavesDepartamentos,
        todosDepartamentosSeleccionados,
        modelDepartamentosSeleccionados
      );

      //Filtrar los datos segun las opciones seleccionadas
      filtrarDatos();
    };

    // Filtrar los datos segun las opciones seleccionadas
    const filtrarDatos = () => {
      filtrarElementosPorEmpresaSucursalDepartamento(
        faltas,
        faltasFiltradas,
        todasEmpresasSeleccionadas,
        listaClavesEmpresas,
        modelEmpresasSeleccionadas,
        todasSucursalesSeleccionadas,
        listaClavesSucursales,
        modelSucursalesSeleccionadas,
        todosDepartamentosSeleccionados,
        listaClavesDepartamentos,
        modelDepartamentosSeleccionados
      );
    };

    const limpiarFechaFin = () => {
      objBusqueda.value.fechaFin = null;
    };

    const busquedaFechas = async () => {
      if (objBusqueda.value.fechaInicio && objBusqueda.value.fechaFin) {
        faltasFiltradas.value = [];
        try {
          cargando.value = true;
          await obtenerFaltas(objBusqueda.value);
          await filtrar("TODASEMPRESAS");
        } catch {
        } finally {
          cargando.value = false;
        }
      }
    };

    return {
      columns,
      buscar: ref(""),
      faltasFiltradas,
      objBusqueda,
      cargando,
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
      limpiarFechaFin,
      busquedaFechas,
    };
  },
};
</script>
