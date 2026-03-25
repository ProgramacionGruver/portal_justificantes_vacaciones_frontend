<template>
  <div class="q-pa-md">
    <h2>Reporte de Faltas y Retardos</h2>
    <q-separator color="primary" class="q-mb-lg"></q-separator>
    <q-table
      :columns="columns"
      :rows="faltasRetardosFiltradas"
      :loading="cargando"
      :filter="buscar"
      no-data-label="No se encontró informacion disponible."
      loading-label="Buscando información. . . "
      row-key="numero_empleado"
      dense
      separator="cell"
    >
      <template v-slot:top>
        <div class="fit row q-gutter-sm q-mb-sm q-mt-xs justify-end">
          <div class="col">
            <q-input
              outlined
              dense
              v-model="buscar"
              :disable="cargando"
              placeholder="Buscar"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
          <div class="fechas--asistencias q-pr-md">
            <div>
              <q-select
                dense
                outlined
                v-model="mesSeleccionado"
                :options="listaMeses"
                label="Mes"
                @update:model-value="buscarPorMes"
              />
            </div>

            <div>
              <q-select
                dense
                outlined
                v-model="anioSeleccionado"
                :options="listaAnios"
                label="Año"
                @update:model-value="buscarPorMes"
              />
            </div>
          </div>
          <q-btn
            color="green"
            icon-right="description"
            label="Descargar"
            no-caps
            dense
            :disable="cargando"
            @click="exportarExcel"
            v-if="permisoDescargar"
          />
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
      <template v-slot:header>
        <q-tr class="bg-primary text-white text-center">
          <q-th rowspan="2"></q-th>
          <q-th rowspan="2">No Empleado</q-th>
          <q-th rowspan="2">Nombre</q-th>
          <q-th rowspan="2">Puesto</q-th>
          <q-th colspan="2">1ra Quincena</q-th>
          <q-th colspan="2">2da Quincena</q-th>
          <q-th colspan="2">Total</q-th>
        </q-tr>
        <q-tr class="bg-primary text-white text-center">
          <q-th>Retardos</q-th>
          <q-th>Faltas</q-th>
          <q-th>Retardos</q-th>
          <q-th>Faltas</q-th>
          <q-th>Retardos</q-th>
          <q-th>Faltas</q-th>
        </q-tr>
      </template>
      <template #body="props">
        <q-tr :props="props">
          <q-td v-for="col in props.cols" :key="col.name">
            <q-btn
              v-if="col.name === 'expandir'"
              size="sm"
              color="primary"
              dense
              round
              :icon="
                filaExpandida === props.row.numero_empleado ? 'remove' : 'add'
              "
              @click="verDetalle(props.row)"
            />

            <span v-else>
              {{ col.value }}
            </span>
          </q-td>
        </q-tr>

        <transition name="expand-smooth">
          <q-tr v-if="filaExpandida === props.row.numero_empleado">
            <q-td colspan="100%" class="bg-grey-1">
              <q-card flat bordered class="q-pa-md">
                <div class="row items-center q-mb-md">
                  <q-avatar color="primary" text-color="white">
                    {{ props.row.nombre.charAt(0) }}
                  </q-avatar>

                  <div class="q-ml-md">
                    <div class="text-weight-medium">
                      {{ props.row.nombre }}
                    </div>
                    <div class="text-subtitle1 text-grey-7">
                      {{ props.row.puesto }}
                    </div>
                  </div>

                  <q-space />

                  <q-chip color="primary" text-color="white">
                    {{ props.row.total }}
                    incidencias
                  </q-chip>
                </div>

                <q-separator />

                <div class="row q-col-gutter-md q-mt-md">
                  <div class="col-12 col-md-6">
                    <q-card flat bordered class="card-detalle">
                      <q-card-section class="row items-center q-pb-sm">
                        <q-icon name="schedule" color="primary" size="20px" />
                        <div class="primary text-weight-medium q-ml-sm">
                          Retardos
                        </div>
                        <q-space />
                        <q-badge
                          color="deep-orange-5"
                          style="font-size: 12px; padding: 6px 10px"
                        >
                          {{ props.row.detalle_retardos.length }}
                        </q-badge>
                      </q-card-section>

                      <q-separator />

                      <q-card-section class="q-pa-sm">
                        <div v-if="props.row.detalle_retardos.length">
                          <div
                            v-for="(r, i) in props.row.detalle_retardos"
                            :key="i"
                            class="item-detalle row items-center q-pa-sm q-mb-xs"
                          >
                            <q-icon name="circle" size="8px" color="primary" />
                            <div class="q-ml-sm col">
                              <div class="text-weight-medium">
                                {{ formatearFecha(r.fecha) }}
                              </div>
                              <div class="text-caption text-grey-7">
                                {{
                                  r.quincena === "Q1"
                                    ? "1ra Quincena"
                                    : "2da Quincena"
                                }}
                              </div>
                            </div>
                            <q-chip dense outline color="deep-orange-5">
                              {{ r.hora }}
                            </q-chip>
                          </div>
                        </div>

                        <div v-else class="text-grey text-center q-pa-md">
                          Sin retardos
                        </div>
                      </q-card-section>
                    </q-card>
                  </div>

                  <div class="col-12 col-md-6">
                    <q-card flat bordered class="card-detalle">
                      <q-card-section class="row items-center q-pb-sm">
                        <q-icon name="event_busy" color="primary" size="20px" />
                        <div class="primary text-weight-medium q-ml-sm">
                          Faltas
                        </div>
                        <q-space />
                        <q-badge
                          color="red-7"
                          style="font-size: 12px; padding: 6px 10px"
                        >
                          {{ props.row.detalle_faltas.length }}
                        </q-badge>
                      </q-card-section>
                      <q-separator />
                      <q-card-section class="q-pa-sm">
                        <div v-if="props.row.detalle_faltas.length">
                          <div
                            v-for="(f, i) in props.row.detalle_faltas"
                            :key="i"
                            class="item-detalle row items-center q-pa-sm q-mb-xs"
                          >
                            <q-icon name="circle" size="8px" color="primary" />

                            <div class="q-ml-sm">
                              <div class="text-weight-medium">
                                {{ formatearFecha(f.fecha) }}
                              </div>
                              <div class="text-caption text-grey-7">
                                {{
                                  f.quincena === "Q1"
                                    ? "1ra Quincena"
                                    : "2da Quincena"
                                }}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div v-else class="text-grey text-center q-pa-md">
                          Sin faltas
                        </div>
                      </q-card-section>
                    </q-card>
                  </div>
                </div>
              </q-card>
            </q-td>
          </q-tr>
        </transition>
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
import { useAutenticacionStore } from "src/stores/autenticaciones";
import { formatearFecha } from "src/helpers/formatearFecha";
import { listaMeses, listaAnios } from "src/helpers/listas";
import { generarExcel } from "src/helpers/generarExcel";
import {
  filtrarOpciones,
  filtrarElementosPorEmpresaSucursalDepartamento,
} from "src/helpers/filtros";

export default {
  components: {},
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
    const { obtenerFaltasRetardos } = useAsistencias;
    const { faltasRetardos, faltasRetardosFiltradas } =
      storeToRefs(useAsistencias);

    const useAutenticacion = useAutenticacionStore();
    const { usuarioAutenticado } = storeToRefs(useAutenticacion);

    const buscar = ref("");
    const cargando = ref(false);
    const objBusqueda = ref({});
    const mesSeleccionado = ref(listaMeses[new Date().getMonth()]);
    const anioSeleccionado = ref(new Date().getFullYear());
    const filaExpandida = ref(null);
    const permisoDescargar = ref(false);

    const columns = [
      {
        name: "expandir",
        label: "",
        align: "center",
        field: "expandir",
      },
      {
        name: "numero_empleado",
        label: "No Empleado",
        align: "left",
        field: "numero_empleado",
        sortable: true,
      },
      {
        name: "nombre",
        label: "Nombre",
        align: "left",
        field: "nombre",
        sortable: true,
      },
      {
        name: "puesto",
        label: "Puesto",
        align: "left",
        field: "puesto",
        sortable: true,
      },
      {
        name: "q1_retardos",
        label: "1Q Retardos",
        align: "center",
        field: "q1_retardos",
        sortable: true,
      },
      {
        name: "q1_faltas",
        label: "1Q Faltas",
        align: "center",
        field: "q1_faltas",
        sortable: true,
      },
      {
        name: "q2_retardos",
        label: "2Q Retardos",
        align: "center",
        field: "q2_retardos",
        sortable: true,
      },
      {
        name: "q2_faltas",
        label: "2Q Faltas",
        align: "center",
        field: "q2_faltas",
        sortable: true,
      },
      {
        name: "totalRetardos",
        label: "Total Retardos",
        align: "center",
        field: "totalRetardos",
      },
      {
        name: "totalFaltas",
        label: "Total Faltas",
        align: "center",
        field: "totalFaltas",
      },
    ];

    onMounted(async () => {
      try {
        cargando.value = true;
        if (primeraCarga.value) {
          primeraCarga.value = false;
          await obtenerEmpresas();
          await obtenerSucursales();
          await obtenerDepartamentos();
        }
        permisoDescargar.value = usuarioAutenticado.value.modulos.find(
          (modulo) => modulo.moduloPortale.nombreModulo === "faltasRetardos"
        ).leer;
        await buscarPorMes();
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
        faltasRetardos,
        faltasRetardosFiltradas,
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

    const buscarPorMes = async () => {
      if (!mesSeleccionado.value || !anioSeleccionado.value) return;

      const mesIndex = listaMeses.indexOf(mesSeleccionado.value);

      const fechaInicio = new Date(anioSeleccionado.value, mesIndex, 1);
      const fechaFin = new Date(anioSeleccionado.value, mesIndex + 1, 0);

      objBusqueda.value.fechaInicio = fechaInicio.toISOString().split("T")[0];
      objBusqueda.value.fechaFin = fechaFin.toISOString().split("T")[0];

      try {
        cargando.value = true;
        faltasRetardosFiltradas.value = [];

        await obtenerFaltasRetardos(objBusqueda.value);
        await filtrar("TODASEMPRESAS");
      } finally {
        cargando.value = false;
      }
    };

    const verDetalle = (row) => {
      filaExpandida.value =
        filaExpandida.value === row.numero_empleado
          ? null
          : row.numero_empleado;
    };

    const exportarExcel = async () => {
      let data = [...faltasRetardosFiltradas.value];

      if (buscar.value) {
        const filtro = buscar.value.toLowerCase();

        data = data.filter((u) =>
          Object.values(u).some((val) =>
            String(val).toLowerCase().includes(filtro)
          )
        );
      }

      const dataFormateada = data.map((u) => {
        const retardos = u.detalle_retardos
          .map((r) => `${formatearFecha(r.fecha)} ${r.hora} (${r.quincena})`)
          .join(", ");

        const faltas = u.detalle_faltas
          .map((f) => `${formatearFecha(f.fecha)} (${f.quincena})`)
          .join(", ");

        return {
          "No Empleado": u.numero_empleado,
          Nombre: u.nombre,
          Puesto: u.puesto,
          "Retardos 1ra Quincena": u.q1_retardos,
          "Faltas 1ra Quincena": u.q1_faltas,
          "Retardos 2da Quincena": u.q2_retardos,
          "Faltas 2da Quincena": u.q2_faltas,
          "Total Retardos": u.totalRetardos,
          "Total Faltas": u.totalFaltas,
          "Detalle Retardos": retardos || "Sin registros",
          "Detalle Faltas": faltas || "Sin registros",
        };
      });

      await generarExcel(
        dataFormateada,
        `Reporte_Faltas_Retardos_${mesSeleccionado.value}_${anioSeleccionado.value}`,
        "Faltas y Retardos"
      );
    };

    return {
      columns,
      buscar,
      faltasRetardosFiltradas,
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
      mesSeleccionado,
      anioSeleccionado,
      listaMeses,
      listaAnios,
      filaExpandida,
      permisoDescargar,
      filtrar,
      buscarPorMes,
      verDetalle,
      formatearFecha,
      exportarExcel,
    };
  },
};
</script>
