<template>
  <div class="q-pa-md">
    <h2>Incapacidades</h2>
    <q-separator color="primary" class="q-mb-lg"></q-separator>
    <q-table :columns="columns" :rows="incapacidadesFiltrados" :loading="cargando" :filter="buscar" no-data-label="No se encontró informacion disponible."
    loading-label="Buscando información. . . " >
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
                  <q-btn color="primary" icon-right="playlist_add" label="Agregar" no-caps :disable="cargando" @click="agregarDias()"/>
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
            <div class="filtros--historial">
              <q-btn-dropdown dense outline class="col q-my-sm" color="grey" label="Tipo Ramo Seguro">
                <q-checkbox class="q-pa-md" dense :disable="todosTipoRamoSeleccionados"
                  v-model="todosTipoRamoSeleccionados" label="Todos"
                  @update:model-value="filtrar('TODOSTIPORAMO')" />
                <q-separator class="q-mx-sm bg-gray"></q-separator>
                <q-option-group class="q-pa-md" dense :options="opcionesFiltroRamoSeguro"
                  v-model="tiposRamoSeleccionados" @update:model-value="filtrar('OPCIONESTIPORAMO')"
                  type="checkbox" />
              </q-btn-dropdown>
              <q-btn-dropdown dense outline class="col q-my-sm" color="grey" label="Riesgo de Trabajo">
                <q-checkbox class="q-pa-md" dense :disable="todosTipoRiesgoSeleccionados" v-model="todosTipoRiesgoSeleccionados"
                  label="Todos" @update:model-value="filtrar('TODOSTIPORIESGO')" />
                <q-separator class="q-mx-sm bg-gray"></q-separator>
                <q-option-group class="q-pa-md" dense :options="opcionesRiesgoTrabajo" v-model="tiposRiesgoSeleccionados"
                  @update:model-value="filtrar('OPCIONESRIESGO')" type="checkbox" />
              </q-btn-dropdown>
              <q-btn color="primary" icon-right="picture_as_pdf" label="Descargar" no-caps :disable="cargando" @click="descargarDocumentos"/>
              <q-btn color="green" icon-right="description" label="Descargar" no-caps :disable="cargando" @click="descargaExcel"/>
            </div>
      </template>
      <template v-slot:body-cell-acciones="props">
          <q-td>
            <q-btn dense flat color="primary" icon="visibility" @click="verIncapacidad(props.row)">
              <q-tooltip>
                Ver Incapacidad
              </q-tooltip>
            </q-btn>
            <q-btn dense flat color="primary" icon="file_upload" @click="editarIncapacidad(props.row, true)">
              <q-tooltip>
                Subir archivos
              </q-tooltip>
            </q-btn>
            <q-btn v-if="actualizar" dense flat color="primary" icon="edit" @click="editarIncapacidad(props.row)">
              <q-tooltip>
                Editar
              </q-tooltip>
            </q-btn>
            <q-btn dense flat icon="description" @click="abrirUrl(props.row.urlDocumento)">
              <q-tooltip>
                Abrir Documento
              </q-tooltip>
            </q-btn>
          </q-td>
      </template>
      <template v-slot:body-cell-sua="props">
          <td>
            <q-btn
              :disable="!agregar"
              rounded
              flat
              :color="obtenerButton(props.row.estatusSua).color"
              :icon="obtenerButton(props.row.estatusSua).icon"
              @click="actualizarEstatus(props.row, 'SUA')"
            >
            <q-tooltip>{{ obtenerButton(props.row.estatusSua).label }}</q-tooltip>
            </q-btn>
          </td>
      </template>
      <template v-slot:body-cell-contpaq="props">
          <td>
            <q-btn
              :disable="!agregar"
              rounded
              flat
              :color="obtenerButton(props.row.estatusContpaq).color"
              :icon="obtenerButton(props.row.estatusContpaq).icon"
              @click="actualizarEstatus(props.row, 'CONTPAQ')"
            >
            <q-tooltip>{{ obtenerButton(props.row.estatusContpaq).label }}</q-tooltip>
            </q-btn>
          </td>
      </template>
    </q-table>
  </div>
  <modal-incapacidades ref="modalIncapacidades"></modal-incapacidades>
</template>

<script>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useQuasar } from 'quasar'
import { formatearFecha } from 'src/helpers/formatearFecha'
import { useIncapacidadesStore } from 'src/stores/incapacidades'
import { useColaboradoresStore } from 'src/stores/colaboradores'
import { useEmpresasStore } from 'src/stores/empresas'
import { useSucursalesStore } from 'src/stores/sucursales'
import { useDepartamentosStore } from 'src/stores/departamentos'
import { useAutenticacionStore } from "src/stores/autenticaciones"
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import * as XLSX from 'xlsx'
import { descargarPDF } from 'src/helpers/descargarPDF'
import { filtrarElementos, filtrarOpcionesIncapacidades, filtrarElementosPorEmpresaSucursalDepartamento} from 'src/helpers/filtros'
import { opcionesFiltroRamoSeguro, opcionesFiltroRiesgoTrabajo, opcionesRamoSeguro, opcionesRiesgoTrabajo } from 'src/constant/opcionesSeleccionables'
import ModalIncapacidades from 'src/components/ModalIncapacidades.vue'

export default {
    components: {
      ModalIncapacidades
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

      const useIncapacidades = useIncapacidadesStore()
      const { obtenerIncapacidades, actualizarEstatusIncapacidades } = useIncapacidades
      const { incapacidades, incapacidadesFiltrados, ramosSeleccionados, riesgosSeleccionados, tiposRamoSeleccionados, tiposRiesgoSeleccionados, todosTipoRamoSeleccionados, todosTipoRiesgoSeleccionados } = storeToRefs(useIncapacidades)

      const useColaboradores = useColaboradoresStore()
      const { obtenerColaboradores } = useColaboradores

      const useAutenticacion = useAutenticacionStore()
      const { usuarioAutenticado } = storeToRefs(useAutenticacion)

      const cargando = ref(false)
      const modalIncapacidades = ref(null)
      const hoy = new Date()
      const unaSemanaAntes = new Date()
      unaSemanaAntes.setDate(hoy.getDate() - 15)
      const notificacion = useQuasar()

      const modulo = ref({})
      const agregar = ref(false)
      const actualizar = ref(false)
      const eliminar = ref(false)
      const leer = ref(false)

      const columns = [
        {
          name: "sua",
          label: "SUA",
          align: "rigth",
          sortable: true
        },
        {
          name: "contpaq",
          label: "CONTPAQ",
          align: "left",
          sortable: true
        },
        {
          name: "nombreSucursal",
          label: "Sucursal",
          align: "left",
          field: "nombreSucursal",
          sortable: true
        },
        {
          name: "numeroSeguroSocial",
          label: "No. Seguro Social",
          align: "left",
          field: "numeroSeguroSocial",
          sortable: true
        },
        {
          name: "numero_empleado",
          label: "Numero Empleado",
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
          name: "folio",
          label: "Folio",
          align: "left",
          field: "folio",
          sortable: true
        },
        {
          name: "ramoSeguro",
          label: "Ramo Seguro",
          align: "left",
          field: "ramoSeguro",
          sortable: true
        },
        {
          name: "diasIncapacidad",
          label: "Dias Incapacidad",
          align: "left",
          field: "diasIncapacidad",
          sortable: true
        },
        {
          name: "fechaExpedido",
          label: "Expedido",
          align: "left",
          field: (row) => formatearFecha(row.fechaExpedido),
          sortable: true
        },
        {
          name: "fechaApartir",
          label: "A partir de",
          align: "left",
          field: (row) => formatearFecha(row.fechaApartir),
          sortable: true
        },
        {
          name: "fechaTermino",
          label: "Fecha de termino",
          align: "left",
          field: (row) => formatearFecha(row.fechaTermino),
          sortable: true
        },
        {
          name: "observaciones",
          label: "Observaciones",
          align: "left",
          field: "observaciones",
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
        {
          name: "acciones",
          align: "left"
        },
      ]

      const objBusqueda = ref({
        fechaInicio: unaSemanaAntes.toISOString().split("T")[0],
        fechaFin: hoy.toISOString().split("T")[0],
      })

      onMounted(async () => {
        try{
          cargando.value = true
          if(primeraCarga.value){
            primeraCarga.value = false
            await obtenerEmpresas()
            await obtenerSucursales()
            await obtenerDepartamentos()
          }
          await obtenerColaboradores()
          await obtenerIncapacidades(objBusqueda.value)
          await filtrar('TODASEMPRESAS')
          modulo.value = usuarioAutenticado.value.modulos.find(modulo => modulo.idModulo === 68)
          agregar.value = modulo.value.agregar
          actualizar.value = modulo.value.actualizar
          eliminar.value = modulo.value.eliminar
          leer.value = modulo.value.leer
        }catch{

        }finally{
          cargando.value = false
        }
      })

      const agregarDias = () => {
        modalIncapacidades.value.abrir()
      }

      const filtrar = async(tipoFiltro) => {

        // Filtra las opciones según (empresa, sucursal, departamento) (NO FILTRA INFORMACION)
        filtrarOpcionesIncapacidades(tipoFiltro,
          listaClavesEmpresas, todasEmpresasSeleccionadas, modelEmpresasSeleccionadas,
          sucursales, sucursalesFiltradas, listaClavesSucursales, todasSucursalesSeleccionadas, modelSucursalesSeleccionadas,
          departamentos, departamentosFiltrados, listaClavesDepartamentos, todosDepartamentosSeleccionados, modelDepartamentosSeleccionados,
          todosTipoRamoSeleccionados, tiposRamoSeleccionados, todosTipoRiesgoSeleccionados, tiposRiesgoSeleccionados)

        //Filtrar los datos segun las opciones seleccionadas
        filtrarDatos()
      }

      const filtrarDatos = () => {
        filtrarElementosPorEmpresaSucursalDepartamento(incapacidades, incapacidadesFiltrados,
          todasEmpresasSeleccionadas, listaClavesEmpresas, modelEmpresasSeleccionadas,
          todasSucursalesSeleccionadas, listaClavesSucursales, modelSucursalesSeleccionadas,
          todosDepartamentosSeleccionados, listaClavesDepartamentos, modelDepartamentosSeleccionados)

        // Filtra las incapacidades según el tipo de ramo seguro
        incapacidadesFiltrados.value = todosTipoRamoSeleccionados.value ?
        filtrarElementos(opcionesRamoSeguro, incapacidadesFiltrados.value, 'ramoSeguro')
        : filtrarElementos(tiposRamoSeleccionados.value, incapacidadesFiltrados.value, 'ramoSeguro')

         // Filtra las incapacidades según el tipo de riesgo
        incapacidadesFiltrados.value = todosTipoRiesgoSeleccionados.value ?
        filtrarElementos(opcionesFiltroRiesgoTrabajo, incapacidadesFiltrados.value, 'riesgoTrabajo')
        : filtrarElementos(tiposRiesgoSeleccionados.value, incapacidadesFiltrados.value, 'riesgoTrabajo')
      }

      const limpiarFechaFin = () => {
        objBusqueda.value.fechaFin = null
      }

      const busquedaFechas = async () => {
      if (objBusqueda.value.fechaInicio && objBusqueda.value.fechaFin) {
        try {
          cargando.value = true
          await obtenerIncapacidades(objBusqueda.value)
        } catch {
        } finally {
          cargando.value = false
        }
      }
      }

      const editarIncapacidad = (incapacidadObj, editarDocumentos) => {
        modalIncapacidades.value.abrir(incapacidadObj, false, editarDocumentos)
      }

      const verIncapacidad = (incapacidadObj) => {
        modalIncapacidades.value.abrir(incapacidadObj, true)
      }

      const abrirUrl = async (url) => {
        window.open(url, '_blank')
      }

      const obtenerButton = (estatus) => {
        switch (estatus){
          case true:
                return { color: 'green', icon: 'check_circle', label: 'REGISTRADO' }
          case false:
                return { color: 'grey', icon: 'pending', label: 'PENDIENTE' }
        }
      }

      const actualizarEstatus = ( objIncapacidad, nombreEstatus) => {
        notificacion
          .dialog({
            title: 'Cambiar Estatus',
            message: `¿Desea cambiar el estatus de ${nombreEstatus}?`,
            cancel: true,
            persistent: true
          })
          .onOk(async () => {
            if (nombreEstatus === 'CONTPAQ') {
              objIncapacidad.estatusContpaq = !objIncapacidad.estatusContpaq
            } else if (nombreEstatus === 'SUA') {
              objIncapacidad.estatusSua = !objIncapacidad.estatusSua
            }
            await actualizarEstatusIncapacidades(objIncapacidad)
          })
          .onCancel(() => {
          })
      }

      const descargarDocumentos = async () => {
        try {
          cargando.value = true
          const zip = new JSZip()
          const batchSize = 3

          const loteFunciones = []

          incapacidadesFiltrados.value.forEach(objeto => {
            const carpetaFolio = zip.folder(`Incapacidades/${objeto.folio}`)

            loteFunciones.push(async () => {
              const url = objeto.urlDocumento
              const blob = await descargarPDF(url)
              carpetaFolio.file(`${objeto.folio}.pdf`, blob)
            })

            // Descargar ST7 si existe
            if (objeto.urlDocumentoSt7) {
              loteFunciones.push(async () => {
                const url = objeto.urlDocumentoSt7
                const blob = await descargarPDF(url)
                carpetaFolio.file(`${objeto.folio}-ST7.pdf`, blob)
              })
            }

            // Descargar ST2 si existe
            if (objeto.urlDocumentoSt2) {
              loteFunciones.push(async () => {
                const url = objeto.urlDocumentoSt2
                const blob = await descargarPDF(url)
                carpetaFolio.file(`${objeto.folio}-ST2.pdf`, blob)
              })
            }

            // Descargar SIAAT si existe
            if (objeto.urlDocumentoSiaat) {
              loteFunciones.push(async () => {
                const url = objeto.urlDocumentoSiaat
                const blob = await descargarPDF(url)
                carpetaFolio.file(`${objeto.folio}-SIAAT.pdf`, blob)
              })
            }
          })

          await descargarEnLotes(loteFunciones, batchSize)

          const contenidoZip = await zip.generateAsync({ type: 'blob' })
          saveAs(contenidoZip, `Incapacidades-${objBusqueda.value.fechaInicio}-${objBusqueda.value.fechaFin}.zip`)
        } catch (error) {
          console.error("Error descargando los documentos:", error)
        } finally {
          cargando.value = false
        }
      }

      const descargarEnLotes = async (loteFunciones, batchSize) => {
        const resultados = []

        for (let i = 0; i < loteFunciones.length; i += batchSize) {
          const lote = loteFunciones.slice(i, i + batchSize)
          const resultadosLote = await Promise.all(lote.map(fn => fn()))
          resultados.push(...resultadosLote)
        }

        return resultados
      }

      const descargaExcel = () => {
          cargando.value = true
          const ws = XLSX.utils.json_to_sheet(incapacidadesFiltrados.value)
          const wb = XLSX.utils.book_new()
          XLSX.utils.book_append_sheet(wb, ws, 'Datos')
          const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' })
          const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' })
          const url = window.URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.download = `Incapacidades-${objBusqueda.value.fechaInicio}-${objBusqueda.value.fechaFin}.xlsx`
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          cargando.value = false
      }

      const s2ab = (s) => {
        const buf = new ArrayBuffer(s.length)
        const view = new Uint8Array(buf)
        for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF
        return buf
      }

      return {
        buscar: ref(""),
        columns,
        cargando,
        incapacidadesFiltrados,
        agregarDias,
        modalIncapacidades,
        empresasFiltradas,
        modelEmpresasSeleccionadas,
        todasEmpresasSeleccionadas,
        sucursalesFiltradas,
        modelSucursalesSeleccionadas,
        todasSucursalesSeleccionadas,
        departamentosFiltrados,
        modelDepartamentosSeleccionados,
        todosDepartamentosSeleccionados,
        opcionesFiltroRamoSeguro,
        opcionesRiesgoTrabajo,
        ramosSeleccionados,
        riesgosSeleccionados,
        tiposRamoSeleccionados,
        tiposRiesgoSeleccionados,
        todosTipoRamoSeleccionados,
        todosTipoRiesgoSeleccionados,
        filtrar,
        limpiarFechaFin,
        busquedaFechas,
        objBusqueda,
        editarIncapacidad,
        verIncapacidad,
        abrirUrl,
        obtenerButton,
        actualizarEstatus,
        descargarDocumentos,
        descargaExcel,
        agregar,
        actualizar,
        eliminar,
        leer
      }
    }
  }
</script>
