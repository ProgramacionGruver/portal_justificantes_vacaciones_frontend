<template>
  <div class="contenedor-dashboard">
    <div class="contenedor-banner-fecha">
      <q-card class="card-banner">
        <q-card-section class="row no-wrap items-center contenedor--bienvenida">
          <div class="col">
            <h3 class="text-white">Buen día, </h3>
            <h4 class="text-white">{{ usuarioAutenticado?.nombre }}</h4>
            <h5 class="text-white"><strong>Jefe Directo:</strong> <br> {{ detalleJefeDirecto.nombre }}</h5>
          </div>
          <div class="col" style="display: flex; justify-content: center; align-items: center;">
            <q-img src="../../img/sensible.png" spinner-color="white" class="contenedor--imagen" />
          </div>
        </q-card-section>
      </q-card>
      <div class="contenedor-date">
        <q-date v-model="date" :locale="myLocale" class="contenedor--date__modificador" />
      </div>
    </div>
  </div>
  <div class="contenedor-asistenciaUsuario">
    <div class="contenedor-banner-fecha-usuario">
      <div class="card-banner-usuario">
        <h2 class="q-ma-none">Asistencias</h2>
        <q-separator color="primary" class="q-mb-md" />
        <q-table
        :columns="columns"
        :rows="asistencias"
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
                    col.value.estado === 'TURNO ESPECIAL' ||
                    col.value.estado === 'DIA FERIADO'
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
      </div>
    </div>
  </div>
  <ModalVerSolicitud ref="modalVerSolicitud"></ModalVerSolicitud>
</template>

<script>
import { useAutenticacionStore } from 'src/stores/autenticaciones'
import { useAsistenciasStore } from 'src/stores/asistencias'
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'
import { formatearFecha } from "src/helpers/formatearFecha";
import { coloresBotones } from "src/constant/constantes"
import { useJustificantesVacacionesStore } from 'src/stores/justificantesVacaciones';
import ModalVerSolicitud from "src/components/ModalVerSolicitud.vue";

export default {
  components: {
    ModalVerSolicitud
  },
  setup () {

    const useUsuario = useAutenticacionStore()
    const { usuarioAutenticado } = storeToRefs(useUsuario)

    const useAsistencias = useAsistenciasStore()
    const { obtenerAsistencias } = useAsistencias
    const { asistencias } = storeToRefs(useAsistencias)

    const useJustificantesVacaciones = useJustificantesVacacionesStore()
    const { detalleJefeDirecto } = storeToRefs(useJustificantesVacaciones)

    const today = new Date()
    const year = today.getFullYear()
    const month = today.getMonth() + 1
    const day = today.getDate()

    const cargando = ref(false)
    const dynamicColumns = ref([])
    const columns = ref([])
    const modalVerSolicitud = ref(null)
    const hoy = new Date();
    hoy.setDate(hoy.getDate() - 1);
    const unaSemanaAntes = new Date()
    unaSemanaAntes.setDate(hoy.getDate() - 7)

    const objBusqueda = ref({
      fechaInicio: unaSemanaAntes.toISOString().split("T")[0],
      fechaFin: hoy.toISOString().split("T")[0],
      numero_empleado: usuarioAutenticado.value.numero_empleado
    })

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
    ]

    onMounted(async () => {
        try {
          cargando.value = true
          await obtenerAsistencias(objBusqueda.value)
          await columnasDinamicas()
        } catch {
        } finally {
          cargando.value = false
        }
      })

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
                    }else if (diaData.diaFeriado) {
                      return {
                        value: "DIA FERIADO",
                        estado: "DIA FERIADO",
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
        const { estado } = entrada
        const colores = coloresBotones.find((e) => e.estado === estado)
        return colores?.color
      }

      const verSolicitud = (solicitud) => {
        modalVerSolicitud.value.abrir(solicitud)
      }

      const limpiarFechaFin = () => {
        objBusqueda.value.fechaFin = null
      }

      const busquedaFechas = async () => {
        if (objBusqueda.value.fechaInicio && objBusqueda.value.fechaFin) {
          asistencias.value = []
          columns.value = []
          dynamicColumns.value = []
          try {
            cargando.value = true
            await obtenerAsistencias(objBusqueda.value)
            await columnasDinamicas()
          } catch {
          } finally {
            cargando.value = false
          }
        }
      }

    return {
      buscar: ref(''),
      usuarioAutenticado,
      columns,
      cargando,
      objBusqueda,
      asistencias,
      modalVerSolicitud,
      detalleJefeDirecto,
      verSolicitud,
      colorBoton,
      limpiarFechaFin,
      busquedaFechas,
      date: ref(`${year}/${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}`),
      myLocale: {
        /* starting with Sunday */
        days: 'Domingo_Lunes_Martes_Miércoles_Jueves_Viernes_Sábado'.split('_'),
        daysShort: 'Dom_Lun_Mar_Mié_Jue_Vie_Sáb'.split('_'),
        months: 'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split('_'),
        monthsShort: 'Ene_Feb_Mar_Abr_May_Jun_Jul_Ago_Sep_Oct_Nov_Dic'.split('_'),
        firstDayOfWeek: 1, // 0-6, 0 - Sunday, 1 Monday, ...
        format24h: true,
        pluralDay: 'dias'
      },
      pagination: {
        sortBy: 'noEmpleado',
        descending: true
      },
    }
  }
}
</script>

<style scoped>

</style>
