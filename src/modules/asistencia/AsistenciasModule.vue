<template>
  <div class="q-pa-md">
    <h2>Reporte de Asistencias</h2>
    <q-separator color="primary" class="q-mb-lg"></q-separator>
    <q-table :columns="columns" :rows="asistencias" :loading="cargando" :filter="buscar" no-data-label="No se encontró informacion disponible."
    loading-label="Buscando información. . . "  row-key="numero_empleado">
      <template v-slot:top>
          <div class="fit row q-gutter-sm q-mb-sm justify-end">
            <div class="col">
              <q-input outlined dense v-model="buscar" placeholder="Buscar">
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>
          </div>
          <div class="fit row q-gutter-sm">
            <q-btn-dropdown dense outline class="col q-ma-sm" color="grey" label="Empresas">
              <q-checkbox class="q-pa-md" dense v-model="todasEmpresasSeleccionadas" label="Todas" />
              <q-separator class="q-mx-md bg-gray"></q-separator>
              <q-option-group class="q-pa-md" dense v-model="grupoEmpresas" type="checkbox" />
            </q-btn-dropdown>
            <q-btn-dropdown dense outline class="col q-ma-sm " color="grey" label="Sucursales" >
              <q-checkbox class="q-pa-md" dense v-model="todasSucursalesSeleccionadas" label="Todas" />
              <q-separator class="q-mx-sm bg-gray"></q-separator>
              <q-option-group class="q-pa-md" dense v-model="grupoSucursales" type="checkbox" />
            </q-btn-dropdown>
            <q-btn-dropdown  dense outline class="col q-ma-sm " color="grey" label="Departamentos" >
                <q-checkbox class="q-pa-md" dense v-model="todasSucursalesSeleccionadas" label="Todas" />
                <q-separator class="q-mx-sm bg-gray"></q-separator>
                <q-option-group class="q-pa-md" dense v-model="grupoSucursales" type="checkbox" />
            </q-btn-dropdown>
          </div>
          <div class="fit row q-gutter-sm">
            <div class="col q-ma-sm">
              <q-select outlined dense :options="tipoGratificacion" v-model="gratificacionSeleccionado" map-options
                label="Tipo Asistencia" />
            </div>
            <div class="col-3 q-ma-sm">
              <q-input dense filled v-model="objBusqueda.fechaInicio" type="date" />
            </div>
            <div class="col-3 q-ma-sm">
              <q-input dense filled v-model="objBusqueda.fechaFin" type="date"/>
            </div>
          </div>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
          >
            <template v-if="!col.name.startsWith('semana_')">
              {{ col.value }}
            </template>
            <template v-if="col.name.startsWith('semana_')">
              <div v-if="col.value.estado === 'COMPLETO'">
                {{ col.value.value }}
              </div>
              <q-btn
                v-else-if="col.value.estado === 'RETARDO' || col.value.estado === 'FALTA'"
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
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useAsistenciasStore } from 'src/stores/asistencias'
import { formatearFecha } from 'src/helpers/formatearFecha'
import { coloresBotones } from 'src/constant/constantes'
import ModalVerSolicitud from 'src/components/ModalVerSolicitud.vue'

  export default {
    components: {
      ModalVerSolicitud
    },
    setup () {

      const useAsistencias = useAsistenciasStore()
      const { obtenerAsistencias } = useAsistencias
      const { asistencias, cargando } = storeToRefs(useAsistencias)

      const dynamicColumns = ref([])
      const columns = ref([])
      const modalVerSolicitud = ref(null)

      const basecolumns = [
      {
        name: "numero_empleado",
        label: "No Empleado",
        align: "left",
        field: "numero_empleado",
      },
      {
        name: "nombre",
        label: "Nombre",
        align: "left",
        field: "nombre",
      },
      {
        name: "puesto",
        label: "Puesto",
        align: "left",
        field: "puesto",
      },
      ]

      const objBusqueda = ref({
        fechaInicio: `2024-06-01`,
        fechaFin: '2024-06-14'
      })

      onMounted(async () => {
        await obtenerAsistencias(objBusqueda.value)
        await columnasDinamicas()
      })

      const columnasDinamicas = async() => {

          // Crear un mapa para almacenar la fecha de registro para cada combinación de semana y día
          const fechasPorSemanaYDia = {}

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
                    fechasPorSemanaYDia[semana][dia] = registroDia.fechaRegistro
                  }
                }
              })
            })
          })

          // Crear columnas basadas en las fechas
          Object.keys(fechasPorSemanaYDia).forEach((semana) => {
            Object.keys(fechasPorSemanaYDia[semana]).forEach((dia) => {
              const columnName = `semana_${semana}_${dia}`
              if (!dynamicColumns.value.find(col => col.name === columnName)) {
                const fechaRegistro = fechasPorSemanaYDia[semana][dia]
                dynamicColumns.value.push({
                      name: columnName,
                      label: `${formatearFecha(fechaRegistro)} ${dia.charAt(0).toUpperCase() + dia.slice(1)}`,
                      align: "center",
                      field: row => {
                        const diaData = row.semanas[semana] && row.semanas[semana][dia]
                        if (diaData) {
                          if (diaData.solicitud) {
                            return {
                              value: diaData.solicitud.nombreSolicitud,
                              estado: diaData.solicitud.nombreSolicitud,
                              retardo: diaData.retardo,
                              solicitud: diaData.solicitud
                            }
                          }else if (diaData.retardo) {
                            return {
                              value: diaData.horaRegistro,
                              estado: 'RETARDO',
                              retardo: diaData.retardo
                            }
                          }else if (diaData.horaRegistro) {
                            return {
                              value: diaData.horaRegistro,
                              estado: 'COMPLETO',
                              retardo: diaData.retardo
                            }
                          }
                        }
                        return {
                          value: 'FALTA',
                          estado: 'FALTA',
                          retardo: false
                        }
                      }
                    })
              }
            })
          })

          //Juntar las columnas dinamicas y las base
          columns.value = [...basecolumns, ...dynamicColumns.value]
      }

      const colorBoton = (entrada) => {
        const { estado } = entrada
        const colores = coloresBotones.find(e => e.estado === estado)
        return colores.color
      }

      const verSolicitud = (solicitud) => {
        modalVerSolicitud.value.abrir(solicitud)
      }

      return {
        columns,
        buscar: ref(''),
        asistencias,
        objBusqueda,
        colorBoton,
        cargando,
        modalVerSolicitud,
        verSolicitud
      }
    }
  }
</script>
