<template>
  <q-dialog persistent v-model="abrirModal">
    <q-card style="min-width: 70vw;" >
      <q-card-section class="bg-primary text-white row items-center q-pb-none">
        <h2 class="text-h4">Agregar Justificante Masivo</h2>
        <q-space />
        <q-btn @disable="cargandoJustificantesMasivos" icon="close" flat round dense v-close-popup />
      </q-card-section>
        <div style="display: block;" >
          <div class="q-ma-md">
            <label>Motivo: <span style="color: red;">*</span></label>
            <q-input
              dense
              class="q-mb-md"
              outlined
              v-model="solicitudObj.motivo"
            />
            <label>Descripción: <span style="color: red;">*</span></label>
            <q-input
              dense
              class="q-mb-md"
              outlined
              autogrow
              v-model="solicitudObj.descripcionMotivo"
            />
            <q-card-section class="col-6 q-py-none">
                  <label>Tipo de pase <span style="color: red;">*</span></label>
                  <q-option-group inline :options="opcionesTipoPase" v-model="solicitudObj.idMotivo"
                    color="primary"></q-option-group>
            </q-card-section>
            <div v-if="[PASE_DE_ENTRADA, PASE_DE_SALIDA].includes(solicitudObj.idMotivo)" class="row q-my-sm">
                <q-card-section class="col-6 q-pt-none">
                  <label>Fecha a justificar <span style="color: red;">*</span></label>
                  <q-input type="date" outlined v-model="solicitudObj.fechaDiaSolicitado"></q-input>
                </q-card-section>
                <q-card-section class="col-6 q-pt-none">
                  <label>Hora a justificar <span style="color: red;">*</span></label>
                  <q-input type="time" outlined v-model="solicitudObj.horaDiaSolicitado"></q-input>
                </q-card-section>
              </div>
              <div v-if="[FALTA].includes(solicitudObj.idMotivo)" class=" q-my-sm q-mb-lg">
                <q-card-section>
                  <label>Seleccione los días a justificar <span style="color: red;">*</span></label>
                </q-card-section>
                <div class="q-my-sm flex flex-center">
                  <q-date landscape multiple mask="YYYY-MM-DD" v-model="solicitudObj.fechasSeleccionadas"
                    :locale="myLocale"></q-date>
                </div>
              </div>
              <div v-if="[VACACIONES].includes(solicitudObj.idMotivo)" class=" q-my-sm q-mb-lg">
                <q-card-section>
                  <label>Seleccione los días <span style="color: red;">*</span></label>
                </q-card-section>
                <div class="q-my-sm flex flex-center">
                  <q-date landscape multiple mask="YYYY-MM-DD" v-model="solicitudObj.fechasSeleccionadas"
                    :locale="myLocale"></q-date>
                </div>
              </div>
          </div>
          <div class="q-ma-md">
               <label>Seleccione los colaboradores a justificar <span style="color: red;">*</span></label>
               <q-table
                      class="q-mt-md"
                      :rows="usuariosFiltradosVisibles"
                      :columns="columns"
                      row-key="numero_empleado"
                      :filter="buscar"
                      :pagination="{ rowsPerPage: 10}"
                    >
                <template v-slot:top>
                  <div class="q-mb-sm" style="width: 100%;">
                    <q-input
                      outlined
                      dense
                      v-model="buscar"
                      placeholder="Buscar"
                      class="full-width"
                    >
                      <template v-slot:append>
                        <q-icon name="search" />
                      </template>
                    </q-input>
                  </div>

                  <div class="row justify-between q-gutter-sm q-mb-sm full-width">
                    <q-btn
                      dense
                      outline
                      label="Seleccionar todos"
                      icon="done_all"
                      @click="seleccionarTodos"
                    />
                    <q-btn
                      dense
                      outline
                      label="Deseleccionar todos"
                      icon="clear_all"
                      color="negative"
                      @click="deseleccionarTodos"
                    />
                    <q-btn
                      dense
                      outline
                      :label="mostrarSoloSeleccionados ? 'Mostrar todos' : 'Solo seleccionados'"
                      :icon="mostrarSoloSeleccionados ? 'list' : 'check'"
                      color="info"
                      @click="toggleMostrarSoloSeleccionados"
                    />
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
                <template v-slot:body-cell-checkbox="props">
                  <q-checkbox
                    v-model="props.row.selected"
                    @update:model-value="(value) => {
                      props.row.selected = value
                    }"
                  />
                </template>
              </q-table>
          </div>
        </div>
        <q-card-section>
          <q-card-actions align="right">
            <q-btn
              @disable="cargandoJustificantesMasivos"
              icon-right="close"
              flat
              label="Cerrar"
              text-color="dark"
              color="gris"
              v-close-popup
            />
            <q-btn
              icon-right="save"
              label="Guardar"
              color="primary"
              :loading="cargandoJustificantesMasivos"
              @click="validarPasoDos"
            />
          </q-card-actions>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref, computed } from "vue"
import { storeToRefs } from "pinia"
import { useCatalogosStore } from "src/stores/catalogos"
import { useEmpresasStore } from "src/stores/empresas"
import { useSucursalesStore } from "src/stores/sucursales"
import { useDepartamentosStore } from "src/stores/departamentos"
import { useAutenticacionStore } from "src/stores/autenticaciones"
import { useJustificantesVacacionesStore } from "src/stores/justificantesVacaciones"
import { notificacion } from 'src/helpers/mensajes'
import { filtrarOpciones, filtrarElementosPorEmpresaSucursalDepartamento} from 'src/helpers/filtros'

export default {
  setup() {

    const useCatalogos = useCatalogosStore()
    const { catalogoUsuarios, catalogoUsuariosFiltrados } = storeToRefs(useCatalogos)

    const useEmpresas = useEmpresasStore()
    const { listaClavesEmpresas, empresasFiltradas, modelEmpresasSeleccionadas, todasEmpresasSeleccionadas } = storeToRefs(useEmpresas)

    const useSucursales = useSucursalesStore()
    const { listaClavesSucursales, sucursales, sucursalesFiltradas, modelSucursalesSeleccionadas, todasSucursalesSeleccionadas } = storeToRefs(useSucursales)

    const useDepartamentos = useDepartamentosStore()
    const { listaClavesDepartamentos, departamentos, departamentosFiltrados, modelDepartamentosSeleccionados, todosDepartamentosSeleccionados } = storeToRefs(useDepartamentos)

    const useAutenticacion = useAutenticacionStore()
    const { usuarioAutenticado } = storeToRefs(useAutenticacion)

    const useJustificantesVacaciones = useJustificantesVacacionesStore()
    const { cargandoJustificantesMasivos } = storeToRefs(useJustificantesVacaciones)
    const { agregarJustificantesMasivos } = useJustificantesVacaciones

    const opcionesTipoPase = [
      {
        label: 'Pase de entrada',
        value: 1
      },
      {
        label: 'Pase de salida',
        value: 2
      },
      {
        label: 'Falta',
        value: 3
      },
      {
        label: 'Vacaciones',
        value: 7
      }
    ]

    const abrirModal = ref(false)
    const solicitudObjInit = {fechasSeleccionadas: []}
    const PASE_DE_ENTRADA = 1
    const PASE_DE_SALIDA = 2
    const FALTA = 3
    const VACACIONES = 7

    const usuarios = ref(catalogoUsuarios.value)
    const usuariosFiltrados = ref(catalogoUsuariosFiltrados.value)
    const solicitudObj = ref(solicitudObjInit)
    const mostrarSoloSeleccionados = ref(false)

    const columns = [
      {
        name: 'checkbox',
        label: '',
        align: 'left',
        field: 'selected' },
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
        name: "diasVacacionesRestantes",
        label: "Dias Vacaciones Restantes",
        align: "left",
        field: "diasVacacionesRestantes",
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

    const abrir = async() => {
        solicitudObj.value = { ...solicitudObjInit }
        usuarios.value = catalogoUsuarios.value.filter(usuario => usuario.estatus === true)
        usuariosFiltrados.value = catalogoUsuariosFiltrados.value.filter(usuario => usuario.estatus === false)
        usuarios.value.forEach(usuario => { usuario.selected = false})
        usuariosFiltrados.value.forEach(usuario => { usuario.selected = false})
        await filtrar('TODASEMPRESAS')
        abrirModal.value = true
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
    filtrarElementosPorEmpresaSucursalDepartamento(usuarios, usuariosFiltrados,
      todasEmpresasSeleccionadas, listaClavesEmpresas, modelEmpresasSeleccionadas,
      todasSucursalesSeleccionadas, listaClavesSucursales, modelSucursalesSeleccionadas,
      todosDepartamentosSeleccionados, listaClavesDepartamentos, modelDepartamentosSeleccionados)
    }

    const validarPasoDos = () => {
      const { motivo ,idMotivo, fechaDiaSolicitado, horaDiaSolicitado, descripcionMotivo, fechasSeleccionadas } = solicitudObj.value

      const notificarError = () => {
        notificacion('warning', 'Revise que la información esté completa')
        return
      }

      if(!motivo){
        notificarError()
        return
      }

      if (typeof idMotivo !== 'number') {
        notificarError()
        return
      }

      if(usuariosFiltrados.value.filter(usuario => usuario.selected === true).length < 1){
        notificacion('warning', 'Seleccione al menos un colaborador')
        return
      }

      if ([PASE_DE_ENTRADA, PASE_DE_SALIDA].includes(idMotivo)) {
        if (verificarCamposCompletos([fechaDiaSolicitado, horaDiaSolicitado, descripcionMotivo])) {
          validarPasoTres()
        } else {
          notificarError()
        }
      }
      if (idMotivo === FALTA || idMotivo === VACACIONES) {
        if (verificarCamposCompletos([descripcionMotivo]) && fechasSeleccionadas?.length > 0) {
          if(idMotivo === VACACIONES){
              const valido = validarVacaciones()
             if (!valido) return
          }
          validarPasoTres()
        } else {
          notificarError()
        }
      }

    }

    const verificarCamposCompletos = (campos) => {
      return campos.every(campo => campo !== '' && campo !== undefined && campo !== null)
    }

    const validarPasoTres = async () => {
      const { numero_empleado, nombre, claveEmpresa, claveSucursal, claveDepartamento } = usuarioAutenticado.value
      const { motivo ,idMotivo, fechaDiaSolicitado, horaDiaSolicitado, descripcionMotivo } = solicitudObj.value

      //Creo el justificante
      solicitudObj.value.numero_empleado = numero_empleado
      solicitudObj.value.nombre = nombre
      solicitudObj.value.editedBy = nombre
      solicitudObj.value.claveEmpresa = claveEmpresa
      solicitudObj.value.claveSucursal = claveSucursal
      solicitudObj.value.claveDepartamento = claveDepartamento

      // Ordena las fechas solicitadas
      solicitudObj.value.fechasSeleccionadas.sort((a, b) => {
        if (a < b) return -1
        if (a > b) return 1
        return 0
      })

      let idTipoSolicitud
      if([VACACIONES].includes(idMotivo)){
        idTipoSolicitud = 2
      }else{
        idTipoSolicitud = 1
      }

      //Creo solicitudes por cada usuario seleccionado
      solicitudObj.value.solicitudes = usuariosFiltrados.value.filter(user => user.selected === true).map(usuario => ({
        ...usuario,
        idTipoSolicitud,
        motivo,
        idMotivo,
        fechaDiaSolicitado,
        horaDiaSolicitado,
        descripcionMotivo,
        fechasSeleccionadas: [...solicitudObj.value.fechasSeleccionadas]  // Agregar el array de fechas seleccionadas
      }))
      await agregarJustificantesMasivos(solicitudObj.value)
      abrirModal.value = false
    }

    const validarVacaciones = () => {
      const diasSolicitados = solicitudObj.value.fechasSeleccionadas.length
      for (const usuario of usuariosFiltrados.value.filter(u => u.selected === true)) {
        if ((usuario.diasVacacionesRestantes ?? 0) < diasSolicitados) {
          notificacion(
            'warning',
            `El usuario ${usuario.nombre} no cuenta con los días suficientes de vacaciones (${usuario.diasVacacionesRestantes} disponibles)`
          )
          return false
        }
      }
      return true
    }

    const seleccionarTodos = () => {
      usuariosFiltrados.value.forEach(usuario => {
        usuario.selected = true
      })
    }

    const deseleccionarTodos = () => {
      usuariosFiltrados.value.forEach(usuario => {
        usuario.selected = false
      })
    }

    const usuariosFiltradosVisibles = computed(() => {
      if (mostrarSoloSeleccionados.value) {
        return usuariosFiltrados.value.filter(u => u.selected)
      }
      return usuariosFiltrados.value
    })

    const toggleMostrarSoloSeleccionados = () => {
      mostrarSoloSeleccionados.value = !mostrarSoloSeleccionados.value
    }

    return {
      buscar: ref(''),
      abrir,
      abrirModal,
      filtrar,
      columns,
      PASE_DE_ENTRADA,
      PASE_DE_SALIDA,
      FALTA,
      VACACIONES,
      solicitudObj,
      opcionesTipoPase,
      usuariosFiltrados,
      empresasFiltradas,
      modelEmpresasSeleccionadas,
      todasEmpresasSeleccionadas,
      sucursalesFiltradas,
      modelSucursalesSeleccionadas,
      todasSucursalesSeleccionadas,
      departamentosFiltrados,
      modelDepartamentosSeleccionados,
      todosDepartamentosSeleccionados,
      validarPasoDos,
      cargandoJustificantesMasivos,
      seleccionarTodos,
      deseleccionarTodos,
      toggleMostrarSoloSeleccionados,
      mostrarSoloSeleccionados,
      usuariosFiltradosVisibles,
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
    }
  },
}
</script>
<style scoped>
.div--contenedor__general {
  display: grid;
  grid-template-columns: 0.5fr 1.5fr;
  column-gap: 1rem;
  margin: 1rem;
}
</style>
