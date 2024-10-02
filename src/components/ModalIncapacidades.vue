<template>
  <q-dialog persistent v-model="abrirModal">
    <q-card style="min-width: 50vw;">
      <q-card-section class="bg-primary text-white row items-center q-pb-none">
        <h2 class="text-h4">Incapacidades</h2>
        <q-space />
      </q-card-section>
      <q-form ref="formulario" @submit.prevent="agregarDias">
        <div class="div--contenedor__general">
          <div style="display: block;">
            <div class="q-ma-md ">
              <label v-if="!actualizacion">Agregar Colaborador: <span style="color: red;">*</span></label>
              <q-select
                v-if="!actualizacion"
                :readonly="lectura"
                dense
                outlined
                clearable
                use-input
                input-debounce="0"
                emit-value
                map-options
                option-value="value"
                @filter="parametrosFiltradosColaboradores"
                :options="opcionesEmpleados"
                v-model="usuarioSeleccionado"
                label="Buscar colaborador"
                @update:model-value="datosAutomaticos"
                :rules="[(val) => { return val !== null && val !== undefined && val !== '' ? true : 'Seleccione un usuario' }]"
              />
              <div v-if="!actualizacion" class="row items-start q-col-gutter-sm">
                <div class="col-6">
                  <label>Sucursal:</label>
                  <q-input
                    dense
                    outlined
                    v-model="incapacidadesObj.nombreSucursal"
                    readonly
                  />
                </div>
                <div class="col-6">
                  <label>No. Seguro Social: <span style="color: red;">*</span></label>
                  <q-input
                    readonly
                    dense
                    outlined
                    v-model="incapacidadesObj.numeroSeguroSocial"
                    :rules="[(val) => { return val !== null && val !== undefined && val !== '' ? true : 'Escribe un No. Seguro Social' }]"
                  />
                </div>
              </div>
              <div v-if="!actualizacion" class="row items-start q-col-gutter-sm">
                <div class="col-6">
                  <label>Folio Incapacidad: <span style="color: red;">*</span></label>
                  <q-input
                    :readonly="lectura"
                    dense
                    outlined
                    v-model="incapacidadesObj.folio"
                    label="Escribe el folio"
                    :rules="[(val) => { return val !== null && val !== undefined && val !== '' ? true : 'Escribe un folio' }]"
                  />
                </div>
                <div class="col-6">
                  <label>Motivo: <span style="color: red;">*</span></label>
                  <q-input
                    :readonly="lectura"
                    dense
                    outlined
                    v-model="incapacidadesObj.motivo"
                    label="Escribe el motivo"
                    :rules="[(val) => { return val !== null && val !== undefined && val !== '' ? true : 'Escribe un motivo' }]"
                  />
                </div>
              </div>
              <div v-if="!actualizacion" class="row items-start q-col-gutter-sm">
                <div class="col-6">
                  <label>Ramo Seguro: <span style="color: red;">*</span></label>
                  <q-select
                    :readonly="lectura"
                    dense
                    outlined
                    clearable
                    map-options
                    :options="opcionesRamoSeguro"
                    v-model="incapacidadesObj.ramoSeguro"
                    label="Seleccionar Ramo Seguro"
                    :rules="[(val) => { return val !== null && val !== undefined && val !== '' ? true : 'Seleccione un usuario' }]"
                  />
                </div>
                <div class="col-6">
                  <label>Tipo Incapacidad: <span style="color: red;">*</span></label>
                  <q-select
                    :readonly="lectura"
                    dense
                    outlined
                    clearable
                    map-options
                    :options="opcionesTipoIncapacidad"
                    v-model="incapacidadesObj.tipoIncapacidad"
                    label="Seleccionar Tipo Incapacidad"
                    :rules="[(val) => { return val !== null && val !== undefined && val !== '' ? true : 'Seleccione un usuario' }]"
                  />
                </div>
              </div>
              <div v-if="!actualizacion" class="row items-start q-col-gutter-sm">
                <div class="col-6">
                  <label>Probable Riesgo de Trabajo: <span style="color: red;">*</span></label>
                  <q-select
                    :readonly="lectura"
                    dense
                    outlined
                    clearable
                    emit-value
                    map-options
                    option-value="value"
                    :options="opcionesRiesgoTrabajo"
                    v-model="incapacidadesObj.riesgoTrabajo"
                    label="Seleccionar Riesgo Trabajo"
                    :rules="[(val) => { return val !== null && val !== undefined && val !== '' ? true : 'Seleccione un usuario' }]"
                  />
                </div>
                <div class="col-6">
                  <label>Días de Incapacidad: <span style="color: red;">*</span></label>
                  <q-input
                    :readonly="lectura"
                    ref="lista"
                    dense
                    outlined
                    type="number"
                    v-model="incapacidadesObj.diasIncapacidad"
                    label="Agrega los días de Incapacidad"
                    :rules="[val => (val > 0) || 'LLena el este campo para continuar.']"
                  />
                </div>
              </div>
              <div v-if="!actualizacion" class="row items-start q-col-gutter-sm q-mb-xs">
                <div class="col-4">
                  <label>A partir de: <span style="color: red;">*</span></label>
                  <q-input :readonly="lectura" dense type="date" outlined v-model="incapacidadesObj.fechaApartir" :rules="[(val) => { return val !== null && val !== undefined && val !== '' ? true : 'Seleccione una fecha' }]"></q-input>
                </div>
                <div class="col-4">
                  <label>Fecha de termino: <span style="color: red;">*</span></label>
                  <q-input :readonly="lectura" dense type="date" outlined v-model="incapacidadesObj.fechaTermino" :rules="[verificarFechas]"></q-input>
                </div>
                <div class="col-4">
                  <label>Expedido: <span style="color: red;">*</span></label>
                  <q-input :readonly="lectura" dense type="date" outlined v-model="incapacidadesObj.fechaExpedido" :rules="[(val) => { return val !== null && val !== undefined && val !== '' ? true : 'Seleccione una fecha' }]" ></q-input>
                </div>
              </div>
              <div v-if="!actualizacion" class="row items-start q-col-gutter-sm q-pb-md">
                <div class="col-6">
                  <label>Descuento Dias Economicos: </label>
                  <q-checkbox
                    :disable="lectura || !incapacidadesObj.nombreSucursal || (usuarioSeleccionado?.diasEconomicosRestantes === 0 && !edicion)"
                    v-model="incapacidadesObj.descuentoDiasEconomicos" @update:model-value="updateDescuentoDiasEconomicos"
                    >
                    <q-tooltip class="bg-red" v-if="usuarioSeleccionado?.diasEconomicosRestantes === 0 && incapacidadesObj.numeroDiasEconomicos === 0">Sin dias disponibles</q-tooltip>
                  </q-checkbox>
                </div>
                <div v-if="incapacidadesObj.descuentoDiasEconomicos" class="col-6">
                  <label>Número de dias a descontar: <span style="color: red;">*</span> <br>(Disponibles {{ usuarioSeleccionado?.diasEconomicosRestantes }} días)</label>
                  <q-input
                    v-if="!edicion"
                    :readonly="lectura || !incapacidadesObj.descuentoDiasEconomicos"
                    ref="lista"
                    dense
                    outlined
                    type="number"
                    v-model="incapacidadesObj.numeroDiasEconomicos"
                    label="Agrega los días a descontar"
                    :rules="[val => (val <= usuarioSeleccionado?.diasEconomicosRestantes && val > 0 && val <= incapacidadesObj.diasIncapacidad) || 'Digite una cantidad valida de días']"
                  />
                  <q-input
                    v-if="edicion"
                    :readonly="lectura || !incapacidadesObj.descuentoDiasEconomicos"
                    ref="lista"
                    dense
                    outlined
                    type="number"
                    v-model="incapacidadesObj.numeroDiasEconomicos"
                    min="0"
                    :hint="`${incapacidadesObj?.diasEconomicosPrevios?incapacidadesObj?.diasEconomicosPrevios:0} días previamente descontados`"
                    :rules="[val => revisarDiasEconomicos(val)]"
                    @update:model-value="revisarDiasEconomicos"
                  />
                </div>
              </div>
              <label v-if="!actualizacion">Tipo de riesgo:</label>
              <q-input
                v-if="!actualizacion"
                :readonly="lectura"
                class="q-pb-md"
                dense
                outlined
                autogrow
                v-model="incapacidadesObj.tipoRiesgo"
                label="Describe el Tipo de Riesgo"
              />
              <label v-if="!actualizacion">Observaciones:</label>
              <q-input
                v-if="!actualizacion"
                :readonly="lectura"
                class="q-pb-md"
                dense
                outlined
                autogrow
                v-model="incapacidadesObj.observaciones"
                label="Escribe las observaciones"
              />
              <label v-if="!lectura && !actualizacion">Archivo: <span style="color: red;">*</span></label>
              <label v-if="lectura || actualizacion">Archivos: <span style="color: red;">*</span></label>
              <div v-if="lectura && !actualizacion" class="q-gutter-sm items-center" :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-2'" style="display: flex; justify-content: center; align-items: center; flex-wrap: wrap;">
                <q-btn v-if="incapacidadesObj.urlDocumento" color="primary" icon="attach_file" label="Incapacidad" @click="abrirUrl(incapacidadesObj.urlDocumento)"/>
                <q-btn v-if="incapacidadesObj.urlDocumentoSt7" color="primary" icon="attach_file" label="Archivo ST7" @click="abrirUrl(incapacidadesObj.urlDocumentoSt7)"/>
                <q-btn v-if="incapacidadesObj.urlDocumentoSt2" color="primary" icon="attach_file" label="Archivo ST2" @click="abrirUrl(incapacidadesObj.urlDocumentoSt2)"/>
                <q-btn v-if="incapacidadesObj.urlDocumentoSiaat" color="primary" icon="attach_file" label="Archivo SIAAT" @click="abrirUrl(incapacidadesObj.urlDocumentoSiaat)"/>
              </div>
              <q-file
                  v-if="!incapacidadesObj.urlDocumento && !lectura && !actualizacion"
                  outlined
                  use-chips
                  v-model="documento"
                  :label="'Click aquí para subir archivo'"
                  accept=".pdf, .PDF pdf/*"
                  counter
                  :counter-label="counterLabel"
                  max-file-size="5000000"
                  @rejected="onRejected"
                >
              </q-file>
              <div class="row items-start q-col-gutter-sm q-mb-xs">
                <div class="col-11">
                  <q-file
                    v-if="incapacidadesObj.urlDocumento && !lectura && !actualizacion"
                    outlined
                    use-chips
                    v-model="documento"
                    :disable="documento"
                    :label="documento?'***Documento cargado anteriormente***':'Click aquí para subir archivo'"
                    accept=".pdf, .PDF pdf/*"
                    counter
                    :counter-label="counterLabel"
                    max-file-size="5000000"
                    @rejected="onRejected"
                  >
                  </q-file>
                </div>
                <div class="col-1 q-pt-md">
                  <q-btn v-if="incapacidadesObj.urlDocumento && !lectura && !actualizacion" round dense flat :icon="documento?'edit_off':'edit'" @click="documento = !documento"/>
                </div>
              </div>
              <div v-if="!lectura" class="q-mt-md q-mb-md rounded-borders" :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-2'" style="display: flex; flex-direction: column; align-items: center;">
                <div>
                  Documentos seguimiento:
                </div>
                <q-option-group
                  name="accepted_genres"
                  v-model="checkArchivos"
                  :options="opcionesArchivosExtras"
                  @update:model-value="checkArchivosExtra"
                  type="checkbox"
                  color="primary"
                  inline
                />
              </div>
              <label v-if="incapacidadesObj.st7 && !lectura">ST-7:</label>
              <q-file
                  v-if="!incapacidadesObj.urlDocumentoSt7 && incapacidadesObj.st7 && !lectura"
                  class="q-pb-md"
                  outlined
                  use-chips
                  v-model="documentoSt7"
                  :label="'Click aquí para subir archivo'"
                  accept=".pdf, .PDF pdf/*"
                  counter
                  :counter-label="counterLabel"
                  max-file-size="5000000"
                  @rejected="onRejected"
                >
              </q-file>
              <div class="row items-start q-col-gutter-sm q-mb-md">
                <div class="col-11">
                  <q-file
                    v-if="incapacidadesObj.urlDocumentoSt7 && incapacidadesObj.st7 && !lectura"
                    outlined
                    use-chips
                    v-model="documentoSt7"
                    :disable="documentoSt7"
                    :label="documentoSt7?'***Documento cargado anteriormente***':'Click aquí para subir archivo'"
                    accept=".pdf, .PDF pdf/*"
                    counter
                    :counter-label="counterLabel"
                    max-file-size="5000000"
                    @rejected="onRejected"
                  >
                  </q-file>
                </div>
                <div class="col-1 q-pt-md">
                  <q-btn v-if="incapacidadesObj.urlDocumentoSt7 && incapacidadesObj.st7 && !lectura" round dense flat :icon="documentoSt7?'edit_off':'edit'" @click="documentoSt7 = !documentoSt7"/>
                </div>
              </div>
              <label v-if="incapacidadesObj.st2 && !lectura">ST-2:</label>
              <q-file
                  v-if="!incapacidadesObj.urlDocumentoSt2 && incapacidadesObj.st2 && !lectura"
                  class="q-pb-md"
                  outlined
                  use-chips
                  v-model="documentoSt2"
                  :label="'Click aquí para subir archivo'"
                  accept=".pdf, .PDF pdf/*"
                  counter
                  :counter-label="counterLabel"
                  max-file-size="5000000"
                  @rejected="onRejected"
                >
              </q-file>
              <div class="row items-start q-col-gutter-sm q-mb-md">
                <div class="col-11">
                  <q-file
                    v-if="incapacidadesObj.urlDocumentoSt2 && incapacidadesObj.st2 && !lectura"
                    outlined
                    use-chips
                    v-model="documentoSt2"
                    :disable="documentoSt2"
                    :label="documentoSt2?'***Documento cargado anteriormente***':'Click aquí para subir archivo'"
                    accept=".pdf, .PDF pdf/*"
                    counter
                    :counter-label="counterLabel"
                    max-file-size="5000000"
                    @rejected="onRejected"
                  >
                  </q-file>
                </div>
                <div class="col-1 q-pt-md">
                  <q-btn v-if="incapacidadesObj.urlDocumentoSt2 && incapacidadesObj.st2 && !lectura" round dense flat :icon="documentoSt2?'edit_off':'edit'" @click="documentoSt2 = !documentoSt2"/>
                </div>
              </div>
              <label v-if="incapacidadesObj.siaat && !lectura">SIAAT:</label>
              <q-file
                  v-if="!incapacidadesObj.urlDocumentoSiaat && incapacidadesObj.siaat && !lectura"
                  outlined
                  use-chips
                  v-model="documentoSiaat"
                  :label="'Click aquí para subir archivo'"
                  accept=".pdf, .PDF pdf/*"
                  counter
                  :counter-label="counterLabel"
                  max-file-size="5000000"
                  @rejected="onRejected"
                >
              </q-file>
              <div class="row items-start q-col-gutter-sm q-mb-xs">
                <div class="col-11">
                  <q-file
                    v-if="incapacidadesObj.urlDocumentoSiaat && incapacidadesObj.siaat && !lectura"
                    outlined
                    use-chips
                    v-model="documentoSiaat"
                    :disable="documentoSiaat"
                    :label="documentoSiaat?'***Documento cargado anteriormente***':'Click aquí para subir archivo'"
                    accept=".pdf, .PDF pdf/*"
                    counter
                    :counter-label="counterLabel"
                    max-file-size="5000000"
                    @rejected="onRejected"
                  >
                  </q-file>
                </div>
                <div class="col-1 q-pt-md">
                  <q-btn v-if="incapacidadesObj.urlDocumentoSiaat && incapacidadesObj.siaat && !lectura" round dense flat :icon="documentoSiaat?'edit_off':'edit'" @click="documentoSiaat = !documentoSiaat"/>
                </div>
              </div>
            </div>
          </div>
        </div>
      <q-card-section>
          <q-card-actions align="right">
            <q-btn
              :disable="cargando"
              icon-right="close"
              flat
              label="Cerrar"
              text-color="dark"
              color="gris"
              v-close-popup
            />
            <q-btn
              v-if="!edicion && !lectura && !actualizacion"
              :loading="cargando"
              icon-right="save"
              type="submit"
              label="Guardar"
              color="primary"
            />
            <q-btn
              v-if="edicion || actualizacion"
              :loading="cargando"
              icon-right="save"
              label="Actualizar"
              color="primary"
              @click="editarDias"
            />
          </q-card-actions>
      </q-card-section>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref } from "vue"
import { storeToRefs } from "pinia"
import dayjs from "dayjs"
import { notificacion } from 'src/helpers/mensajes'
import { filtradoBusquedaObj } from "src/helpers/filtradoBusquedaObj"
import { useColaboradoresStore } from 'src/stores/colaboradores'
import { useIncapacidadesStore } from "src/stores/incapacidades"
import { useAutenticacionStore } from "src/stores/autenticaciones"
import { opcionesRamoSeguro, opcionesTipoIncapacidad, opcionesRiesgoTrabajo, opcionesArchivosExtras } from "src/constant/opcionesSeleccionables"
import { urlArchivosIncapacidades } from "src/constant/constantes"
import { abrirUrl } from "src/helpers/abrirURL"

export default {
  setup() {
    const useColaboradores = useColaboradoresStore()
    const { opcionesColaboradores } = storeToRefs(useColaboradores)

    const useIncapacidades = useIncapacidadesStore()
    const { agregarIncapacidades, actualizarIncapacidades } = useIncapacidades
    const { cargando } = storeToRefs(useIncapacidades)

    const useAutenticacion = useAutenticacionStore()
    const { usuarioAutenticado } = storeToRefs(useAutenticacion)

    const abrirModal = ref(false)
    const formulario = ref(null)
    const usuarioSeleccionado = ref(null)
    const fechasEnRango = ref([])
    const opcionesEmpleados = ref(opcionesColaboradores.value)
    const objIncapacidad = ref(null)
    const documento = ref(null)
    const documentoSt7 = ref(null)
    const documentoSt2 = ref(null)
    const documentoSiaat = ref(null)
    const todosDocumentos = [documento, documentoSt7, documentoSt2, documentoSiaat]
    const edicion = ref(false)
    const lectura = ref(false)
    const actualizacion = ref(false)
    const nuevoArchivo = ref(false)
    const checkArchivos = ref([])

    const incapacidadesObjInit = {
      mes: 0,
      anio: 0,
      numero_empleado: 0,
      claveEmpresa: "",
      claveSucursal: "",
      claveDepartamento: "",
      nombreSucursal: "",
      nombre: "",
      numeroSeguroSocial: "",
      folio: "",
      motivo: "",
      ramoSeguro: opcionesRamoSeguro[0],
      tipoIncapacidad: opcionesTipoIncapacidad[0],
      riesgoTrabajo: false,
      diasIncapacidad: 1,
      fechaApartir: '',
      fechaTermino: '',
      fechaExpedido: '',
      tipoRiesgo : "",
      observaciones : "",
      estatusSua: false,
      estatusContpaq: false,
      st7: false,
      st2: false,
      siaat: false,
      descuentoDiasEconomicos: false,
      numeroDiasEconomicos: null,
      editedBy: ""
    }

    const incapacidadesObj = ref(incapacidadesObjInit)

    const abrir = (incapacidad, leer, editarDocumentos) => {
        edicion.value = false
        lectura.value = false
        actualizacion.value = false
        objIncapacidad.value = null
        usuarioSeleccionado.value = null
        fechasEnRango.value = []
        todosDocumentos.forEach(doc => {
            doc.value = null
        })
        opcionesArchivosExtras.forEach(opciones => {
            opciones.disable = false
        })
        checkArchivos.value =[]
        abrirModal.value = true
        if(incapacidad && !leer && !editarDocumentos){
          edicion.value = true
          documento.value = true
          if(incapacidad.urlDocumentoSt7){
            checkArchivos.value=[...checkArchivos.value, 'st7']
            opcionesArchivosExtras[0].disable = true
            documentoSt7.value = true
          }
          if(incapacidad.urlDocumentoSt2){
            checkArchivos.value=[...checkArchivos.value, 'st2']
            opcionesArchivosExtras[1].disable = true
            documentoSt2.value = true
          }
          if(incapacidad.urlDocumentoSiaat){
            checkArchivos.value=[...checkArchivos.value, 'siaat']
            opcionesArchivosExtras[2].disable = true
            documentoSiaat.value = true
          }
          const usuario = opcionesColaboradores.value.find(elemento => elemento.value.numero_empleado === incapacidad.numero_empleado)
          usuarioSeleccionado.value = {label:  usuario.label, value: usuario.value, ...usuario.value}
          incapacidadesObj.value = { ...incapacidad }
          incapacidadesObj.value.diasEconomicosPrevios = incapacidadesObj.value.numeroDiasEconomicos
          verificarFechas(incapacidadesObj.value.fechaTermino)
        }else if(incapacidad && leer){
          lectura.value = true
          documento.value = true
          if(incapacidad.urlDocumentoSt7){
            checkArchivos.value=[...checkArchivos.value, 'st7']
            opcionesArchivosExtras[0].disable = true
            documentoSt7.value = true
          }
          if(incapacidad.urlDocumentoSt2){
            checkArchivos.value=[...checkArchivos.value, 'st2']
            opcionesArchivosExtras[1].disable = true
            documentoSt2.value = true
          }
          if(incapacidad.urlDocumentoSiaat){
            checkArchivos.value=[...checkArchivos.value, 'siaat']
            opcionesArchivosExtras[2].disable = true
            documentoSiaat.value = true
          }
          const usuario = opcionesColaboradores.value.find(elemento => elemento.value.numero_empleado === incapacidad.numero_empleado)
          usuarioSeleccionado.value = {label:  usuario.label, value: usuario.value, ...usuario.value}
          incapacidadesObj.value = { ...incapacidad }
          verificarFechas(incapacidadesObj.value.fechaTermino)
        }else if(incapacidad && editarDocumentos){
          actualizacion.value = true
          documento.value = true
          if(incapacidad.urlDocumentoSt7){
            checkArchivos.value=[...checkArchivos.value, 'st7']
            opcionesArchivosExtras[0].disable = true
            documentoSt7.value = true
          }
          if(incapacidad.urlDocumentoSt2){
            checkArchivos.value=[...checkArchivos.value, 'st2']
            opcionesArchivosExtras[1].disable = true
            documentoSt2.value = true
          }
          if(incapacidad.urlDocumentoSiaat){
            checkArchivos.value=[...checkArchivos.value, 'siaat']
            opcionesArchivosExtras[2].disable = true
            documentoSiaat.value = true
          }
          const usuario = opcionesColaboradores.value.find(elemento => elemento.value.numero_empleado === incapacidad.numero_empleado)
          usuarioSeleccionado.value = {label:  usuario.label, value: usuario.value, ...usuario.value}
          incapacidadesObj.value = { ...incapacidad }
          verificarFechas(incapacidadesObj.value.fechaTermino)
        }else{
          incapacidadesObj.value = { ...incapacidadesObjInit }
        }
    }

    const agregarDias = async () => {
      if (!(await formulario.value.validate())) {
        return
      }
      if (!documento.value) {
        notificacion('negative', 'Debes seleccionar un archivo')
        return
      }
      incapacidadesObj.value.anio = dayjs(incapacidadesObj.value.fechaExpedido).year()
      incapacidadesObj.value.mes = dayjs(incapacidadesObj.value.fechaExpedido).month() + 1
      incapacidadesObj.value.editedBy = usuarioAutenticado.value.nombre
      if(documentoSt7.value){
        incapacidadesObj.value.urlDocumentoSt7 = `${urlArchivosIncapacidades}/${incapacidadesObj.value.folio}-St7.pdf`
      }
      if(documentoSt2.value){
        incapacidadesObj.value.urlDocumentoSt2 = `${urlArchivosIncapacidades}/${incapacidadesObj.value.folio}-St2.pdf`
      }
      if(documentoSiaat.value){
        incapacidadesObj.value.urlDocumentoSiaat = `${urlArchivosIncapacidades}/${incapacidadesObj.value.folio}-Siaat.pdf`
      }
      incapacidadesObj.value.urlDocumento = `${urlArchivosIncapacidades}/${incapacidadesObj.value.folio}.pdf`

      objIncapacidad.value = {
        diasIncapacidades:  fechasEnRango.value.map(fecha => ({
                      fechaIncapacidad: fecha,
                      folio: incapacidadesObj.value.folio,
                      motivo: incapacidadesObj.value.motivo,
                      descripcionMotivo: incapacidadesObj.value.observaciones,
                      editedBy: usuarioAutenticado.value.nombre,
                      numero_empleado: usuarioSeleccionado.value.numero_empleado,
                      nombre: usuarioSeleccionado.value.nombre,
                      claveEmpresa: usuarioSeleccionado.value.claveEmpresa,
                      claveSucursal: usuarioSeleccionado.value.claveSucursal,
                      claveDepartamento: usuarioSeleccionado.value.claveDepartamento,
                      urlDocumento: `${urlArchivosIncapacidades}/${incapacidadesObj.value.folio}.pdf`
                    })),
        diasIncapacidadesNomina: incapacidadesObj.value,
        archivo: documento.value,
        archivoSt7: documentoSt7.value,
        archivoSt2: documentoSt2.value,
        archivoSiaat: documentoSiaat.value
      }
      const incapacidad = await agregarIncapacidades(objIncapacidad.value)
      if(incapacidad.usuario){
        const index = opcionesColaboradores.value.findIndex(empleado => empleado.value.numero_empleado === usuarioSeleccionado.value.numero_empleado)
        opcionesColaboradores.value[index].value = incapacidad.usuario
      }
      abrirModal.value = false
    }

    const editarDias = async () => {
      if (!(await formulario.value.validate())) {
        return
      }
      todosDocumentos.forEach(doc => {
        if (doc.value === true) {
          doc.value = []
        }
      })
      incapacidadesObj.value.anio = dayjs(incapacidadesObj.value.fechaExpedido).year()
      incapacidadesObj.value.mes = dayjs(incapacidadesObj.value.fechaExpedido).month() + 1
      incapacidadesObj.value.editedBy = usuarioAutenticado.value.nombre
      incapacidadesObj.value.urlDocumento = `${urlArchivosIncapacidades}/${incapacidadesObj.value.folio}.pdf`
      if(documentoSt7.value){
        incapacidadesObj.value.urlDocumentoSt7 = `${urlArchivosIncapacidades}/${incapacidadesObj.value.folio}-St7.pdf`
      }
      if(documentoSt2.value){
        incapacidadesObj.value.urlDocumentoSt2 = `${urlArchivosIncapacidades}/${incapacidadesObj.value.folio}-St2.pdf`
      }
      if(documentoSiaat.value){
        incapacidadesObj.value.urlDocumentoSiaat = `${urlArchivosIncapacidades}/${incapacidadesObj.value.folio}-Siaat.pdf`
      }
      objIncapacidad.value = {
        diasIncapacidades:  fechasEnRango.value.map(fecha => ({
                      fechaIncapacidad: fecha,
                      folio: incapacidadesObj.value.folio,
                      motivo: incapacidadesObj.value.motivo,
                      descripcionMotivo: incapacidadesObj.value.observaciones,
                      editedBy: usuarioAutenticado.value.nombre,
                      numero_empleado: usuarioSeleccionado.value.numero_empleado,
                      nombre: usuarioSeleccionado.value.nombre,
                      claveEmpresa: usuarioSeleccionado.value.claveEmpresa,
                      claveSucursal: usuarioSeleccionado.value.claveSucursal,
                      claveDepartamento: usuarioSeleccionado.value.claveDepartamento,
                      urlDocumento: `${urlArchivosIncapacidades}/${incapacidadesObj.value.folio}.pdf`
                    })),
        diasIncapacidadesNomina: incapacidadesObj.value,
        archivo: documento.value,
        archivoSt7: documentoSt7.value,
        archivoSt2: documentoSt2.value,
        archivoSiaat: documentoSiaat.value
      }
      const incapacidad = await actualizarIncapacidades(objIncapacidad.value)
      if(incapacidad.usuario){
        const index = opcionesColaboradores.value.findIndex(empleado => empleado.value.numero_empleado === usuarioSeleccionado.value.numero_empleado)
        opcionesColaboradores.value[index].value = incapacidad.usuario
      }
      abrirModal.value = false
    }

    const datosAutomaticos = async () => {
      incapacidadesObj.value.numero_empleado = usuarioSeleccionado.value?.numero_empleado
      incapacidadesObj.value.nombre = usuarioSeleccionado.value?.nombre
      incapacidadesObj.value.nombreSucursal = usuarioSeleccionado.value?.centroTrabajo
      incapacidadesObj.value.claveEmpresa = usuarioSeleccionado.value?.claveEmpresa
      incapacidadesObj.value.claveSucursal = usuarioSeleccionado.value?.claveSucursal
      incapacidadesObj.value.claveDepartamento = usuarioSeleccionado.value?.claveDepartamento
      incapacidadesObj.value.numeroSeguroSocial = usuarioSeleccionado.value?.numeroSeguroSocial
    }

    const verificarFechas = (val) => {
      fechasEnRango.value = []
      const fechaApartir = dayjs(incapacidadesObj.value.fechaApartir)
      const fechaTermino = dayjs(val)
      const diasIncapacidad = incapacidadesObj.value.diasIncapacidad

      if (!fechaApartir.isValid() || !fechaTermino.isValid()) {
        return 'Ambas fechas deben ser válidas'
      }

      if (fechaTermino.isBefore(fechaApartir)) {
        return 'La fecha de término debe ser mayor que la fecha de inicio'
      }

      const diferenciaDias = fechaTermino.diff(fechaApartir, 'day') + 1
      if (diferenciaDias !== parseInt(diasIncapacidad)) {
        return `La diferencia de días (${diferenciaDias}) debe ser igual a los días de incapacidad (${diasIncapacidad})`
      }

      for (let i = 0; i < diferenciaDias; i++) {
        fechasEnRango.value.push(fechaApartir.add(i, 'day').format('YYYY-MM-DD'))
      }
      return true
    }

    const parametrosFiltradosColaboradores = (val, update) => {
      filtradoBusquedaObj(val, update, opcionesColaboradores.value, opcionesEmpleados)
    }

    const checkArchivosExtra = (nuevosValores) => {
      incapacidadesObj.value.st7 = nuevosValores.includes('st7')
      if (!incapacidadesObj.value.st7) {
        documentoSt7.value = null
      }

      incapacidadesObj.value.st2 = nuevosValores.includes('st2');
      if (!incapacidadesObj.value.st2) {
        documentoSt2.value = null
      }

      incapacidadesObj.value.siaat = nuevosValores.includes('siaat');
      if (!incapacidadesObj.value.siaat) {
        documentoSiaat.value = null
      }
      checkArchivos.value = nuevosValores
    }

    const onRejected = (rejectedEntries) => {
      if (rejectedEntries[0].failedPropValidation === 'max-file-size') {
        notificacion('warning', 'El archivo es mayor a 5 megas')
      } else if (rejectedEntries[0].failedPropValidation === 'accept') {
        notificacion('warning', 'El archivo no es un archivo pdf')
      }
    }

    const revisarDiasEconomicos = (nuevoValor) => {
      if(!nuevoValor){
        return `Digite una cantidad valida de días.`
      }

      if( nuevoValor == 0){
        incapacidadesObj.value.descuentoDiasEconomicos = false
        incapacidadesObj.value.numeroDiasEconomicos = null
        return true
      }

      const diferencia = nuevoValor - incapacidadesObj.value.diasEconomicosPrevios // Diferencia entre lo que ya se descontó y lo nuevo
      if (diferencia <= usuarioSeleccionado.value.diasEconomicosRestantes && nuevoValor <= incapacidadesObj.value.diasIncapacidad) {
        return true
      } else {
        return `Digite una cantidad valida de días.`
      }
    }

    const updateDescuentoDiasEconomicos = (value) => {
        incapacidadesObj.value.descuentoDiasEconomicos = value
        if (!value) {
          incapacidadesObj.value.numeroDiasEconomicos = null
        }
    }

    return {
      abrir,
      abrirUrl,
      abrirModal,
      formulario,
      cargando,
      incapacidadesObj,
      opcionesEmpleados,
      usuarioSeleccionado,
      documento,
      documentoSt7,
      documentoSt2,
      documentoSiaat,
      opcionesRamoSeguro,
      opcionesTipoIncapacidad,
      opcionesRiesgoTrabajo,
      edicion,
      lectura,
      actualizacion,
      nuevoArchivo,
      checkArchivos,
      opcionesArchivosExtras,
      agregarDias,
      editarDias,
      parametrosFiltradosColaboradores,
      datosAutomaticos,
      verificarFechas,
      checkArchivosExtra,
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
      onRejected,
      counterLabel ({ totalSize }) {
        return `${totalSize} / 5 MB`
      },
      revisarDiasEconomicos,
      updateDescuentoDiasEconomicos
    }
  },
}
</script>
<style scoped>
.div--contenedor__general {
  display: grid;
  column-gap: 1rem;
  margin: 1rem;
}
</style>
