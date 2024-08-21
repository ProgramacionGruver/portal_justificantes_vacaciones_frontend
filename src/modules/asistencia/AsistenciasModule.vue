<template>
  <div class="q-pa-md">
    <h2>Reporte de Asistencias</h2>
    <q-separator color="primary" class="q-mb-lg"></q-separator>
    <q-table
      :columns="columns"
      :rows="asistenciasFiltradas"
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
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td v-for="col in props.cols" :key="col.name" :props="props">
            <template v-if="!col.name.startsWith('semana_')">
              {{ col.value }}
            </template>
            <template v-if="col.name.startsWith('semana_')">
              <div v-if="col.value.estado === 'COMPLETO'">
                {{ col.value.value }}
              </div>
              <q-btn
                v-else-if="
                  col.value.estado === 'RETARDO' ||
                  col.value.estado === 'FALTA' ||
                  col.value.estado === 'TURNO ESPECIAL'
                "
                class="q-mx-sm text-white"
                size="1.2rem"
                unelevated
                rounded
                :color="colorBoton(col.value)"
                :label="col.value.value"
              />
              <q-btn
                v-else
                class="q-mx-sm text-white"
                size="1.2rem"
                unelevated
                rounded
                :color="colorBoton(col.value)"
                :label="col.value.value"
                @click="verSolicitud(col.value.solicitud)"
              />
            </template>
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <ModalVerSolicitud ref="modalVerSolicitud"></ModalVerSolicitud>
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
import { coloresBotones } from "src/constant/constantes";
import {
  filtrarOpciones,
  filtrarElementosPorEmpresaSucursalDepartamento,
} from "src/helpers/filtros";
import ModalVerSolicitud from "src/components/ModalVerSolicitud.vue";

export default {
  components: {
    ModalVerSolicitud,
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
    const { obtenerAsistencias } = useAsistencias;
    const { asistencias, asistenciasFiltradas } = storeToRefs(useAsistencias);

    const cargando = ref(false);
    const dynamicColumns = ref([]);
    const columns = ref([]);
    const modalVerSolicitud = ref(null);
    const hoy = new Date();
    hoy.setDate(hoy.getDate() - 1);
    const unaSemanaAntes = new Date();
    unaSemanaAntes.setDate(hoy.getDate() - 7);

    const basecolumns = [
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
        await obtenerAsistencias(objBusqueda.value);
        await columnasDinamicas();
        await filtrar("TODASEMPRESAS");
      } catch {
      } finally {
        cargando.value = false;
      }
    });

    const columnasDinamicas = async () => {
      // Crear un mapa para almacenar la fecha de registro para cada combinación de semana y día
      const fechasPorSemanaYDia = {};

      //Recorrer cada empleado en asistencias
      asistencias.value.forEach((empleado) => {
        Object.keys(empleado.semanas).forEach((semana) => {
          if (!fechasPorSemanaYDia[semana]) {
            fechasPorSemanaYDia[semana] = {};
          }
          Object.keys(empleado.semanas[semana]).forEach((dia) => {
            const registroDia = empleado.semanas[semana][dia];
            if (registroDia && registroDia.fechaRegistro) {
              if (!fechasPorSemanaYDia[semana][dia]) {
                fechasPorSemanaYDia[semana][dia] = registroDia.fechaRegistro;
              }
            }
          });
        });
      });

      // Crear columnas basadas en las fechas
      Object.keys(fechasPorSemanaYDia).forEach((semana) => {
        Object.keys(fechasPorSemanaYDia[semana]).forEach((dia) => {
          const columnName = `semana_${semana}_${dia}`;
          if (!dynamicColumns.value.find((col) => col.name === columnName)) {
            const fechaRegistro = fechasPorSemanaYDia[semana][dia];
            dynamicColumns.value.push({
              name: columnName,
              label: `${formatearFecha(fechaRegistro)} ${
                dia.charAt(0).toUpperCase() + dia.slice(1)
              }`,
              align: "center",
              field: (row) => {
                const diaData = row.semanas[semana] && row.semanas[semana][dia];
                if (
                  diaData &&
                  typeof diaData === "object" &&
                  Object.keys(diaData).length > 0
                ) {
                  if (diaData.solicitud) {
                    return {
                      value: diaData.solicitud.nombreSolicitud,
                      estado: diaData.solicitud.nombreSolicitud,
                      retardo: diaData.retardo,
                      solicitud: diaData.solicitud,
                    };
                  } else if (diaData.retardo) {
                    return {
                      value: diaData.horaRegistro,
                      estado: "RETARDO",
                      retardo: diaData.retardo,
                    };
                  } else if (diaData.sinTurno) {
                    return {
                      value: `${diaData.horaRegistro}/SIN TURNO`,
                      estado: "COMPLETO",
                      retardo: diaData.retardo,
                    };
                  } else if (diaData.horaRegistro) {
                    return {
                      value: diaData.horaRegistro,
                      estado: "COMPLETO",
                      retardo: diaData.retardo,
                    };
                  }else if (diaData.incapacidad) {
                    return {
                      value: "INCAPACIDAD",
                      estado: "INCAPACIDAD",
                      solicitud: diaData.incapacidad,
                    };
                  }else if (row.turnoEspecialSabado && dia === "sabado") {
                    return {
                      value: `${row.turnoEspecialSabado.turno}`,
                      estado: `TURNO ESPECIAL`,
                    };
                  }else if (row.turnoEspecialSemana) {
                    return {
                      value: `${row.turnoEspecialSemana.turno}`,
                      estado: `TURNO ESPECIAL`,
                    };
                  }
                }
                return {
                  value: "FALTA",
                  estado: "FALTA",
                  retardo: false,
                }
              },
            });
          }
        });
      });

      //Juntar las columnas dinamicas y las base
      columns.value = [...basecolumns, ...dynamicColumns.value];
    };

    const colorBoton = (entrada) => {
      const { estado } = entrada;
      const colores = coloresBotones.find((e) => e.estado === estado);
      return colores?.color;
    };

    const verSolicitud = (solicitud) => {
      modalVerSolicitud.value.abrir(solicitud);
    };

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
        asistencias,
        asistenciasFiltradas,
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
        asistenciasFiltradas.value = [];
        columns.value = [];
        dynamicColumns.value = [];
        try {
          cargando.value = true;
          await obtenerAsistencias(objBusqueda.value);
          await columnasDinamicas();
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
      asistenciasFiltradas,
      objBusqueda,
      colorBoton,
      cargando,
      modalVerSolicitud,
      verSolicitud,
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
