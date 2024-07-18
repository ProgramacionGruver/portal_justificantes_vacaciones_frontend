<template>
  <q-dialog v-model="stepperSolicitud" full-width>
    <q-card>
      <q-card-section>
        <div class="text-h4 text-center q-mb-sm">CREAR SOLICITUD</div>
        <q-separator />
      </q-card-section>

      <q-card-section class="q-pt-none padings-form">
        <q-stepper v-model="step" ref="stepper" color="primary" animated>
          <q-step :name="1" title="Selecciona el tipo de solicitud" icon="settings">
            <div class="text-h5 q-pa-sm text-center bg-primary text-white">
              Tipo de solicitud
            </div>
            <div class="row q-my-sm">
              <q-card-section class="col-12 q-pt-none">
                <div class="row">
                  <q-radio v-model="solicitudObj.idTipoSolicitud" class="col-6" checked-icon="task_alt"
                    unchecked-icon="panorama_fish_eye" :val="1" label="Ausencias y retardos" />
                  <q-radio v-model="solicitudObj.idTipoSolicitud" class="col-6" checked-icon="task_alt"
                    unchecked-icon="panorama_fish_eye" :val="2" label="Vacaciones" />
                  <q-radio v-model="solicitudObj.idTipoSolicitud" class="col-6" checked-icon="task_alt"
                    unchecked-icon="panorama_fish_eye" :val="3" label="Días económicos" />
                  <!-- mostrar si detecta que tiene días vencidos etc...  -->
                  <!-- <q-radio v-model="solicitudObj.idTipoSolicitud" class="col-6" checked-icon="task_alt"
                    unchecked-icon="panorama_fish_eye" :val="3" label="Vacaciones vencidas" />
                    <q-radio v-model="solicitudObj.idTipoSolicitud" class="col-6" checked-icon="task_alt"
                    unchecked-icon="panorama_fish_eye" :val="3" label="Sábados 5s" />
                    <q-radio v-model="solicitudObj.idTipoSolicitud" class="col-6" checked-icon="task_alt"
                    unchecked-icon="panorama_fish_eye" :val="3" label="Días ganados" /> -->
                </div>
              </q-card-section>
            </div>
            <q-stepper-navigation>
              <q-btn color="primary" @click="validarPasoUno" label="continuar" class="q-ml-sm" />
            </q-stepper-navigation>
          </q-step>

          <q-step :name="2" title="Llena la solicitud" icon="create_new_folder">
            <div class="text-h5 q-pa-sm text-center bg-primary text-white">
              Datos de la solicitud
            </div>
            <div class="row q-my-sm">
              <q-card-section class="col-6 q-pt-none">
                <label>Nombre del solicitante</label>
                <q-input readonly outlined v-model="detalleVacacionesDiasEconomicos.nombre"></q-input>
              </q-card-section>

              <q-card-section class="col-6 q-pt-none">
                <label> Empresa solicitante </label>
                <q-input readonly outlined v-model="detalleVacacionesDiasEconomicos.division"></q-input>
              </q-card-section>
            </div>
            <div class="row q-my-sm">
              <q-card-section class="col-6 q-pt-none">
                <label> Centro de trabajo </label>
                <q-input readonly outlined v-model="detalleVacacionesDiasEconomicos.centroTrabajo"></q-input>
              </q-card-section>
              <q-card-section class="col-6 q-pt-none">
                <label> Numero de empleado </label>
                <q-input readonly outlined v-model="detalleVacacionesDiasEconomicos.numero_empleado"></q-input>
              </q-card-section>
            </div>
            <div class="row q-my-sm">
              <q-card-section class="col-6 q-pt-none">
                <label> Departamento </label>
                <q-input readonly outlined v-model="detalleVacacionesDiasEconomicos.departamento"></q-input>
              </q-card-section>
              <q-card-section class="col-6 q-pt-none">
                <label>Puesto del solicitante </label>
                <q-input readonly outlined v-model="detalleVacacionesDiasEconomicos.puesto"></q-input>
              </q-card-section>
            </div>
            <q-separator class="q-mb-lg" />

            <q-form v-if="solicitudObj.idTipoSolicitud === AUSENCIAS_Y_RETARDOS" ref="formulario">
              <div class="q-mt-sm">
                <q-card-section class="col-6 q-py-none">
                  <label>Tipo de pase <span style="color: red;">*</span></label>
                  <q-option-group inline :options="opcionesTipoPase" v-model="solicitudObj.idMotivo"
                    color="primary"></q-option-group>
                </q-card-section>
              </div>
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
              <div class="row q-my-sm">
                <q-card-section class="col">
                  <label>Describe los motivos <span style="color: red;">*</span></label>
                </q-card-section>
              </div>
              <div class="row q-my-sm">
                <q-card-section class="col q-pt-none">
                  <q-input maxlength="255" counter autogrow outlined v-model="solicitudObj.descripcionMotivo"></q-input>
                </q-card-section>
              </div>
            </q-form>

            <q-form v-if="solicitudObj.idTipoSolicitud === VACACIONES" ref="formulario">
              <div class="row q-my-sm">
                <q-card-section class="col-6 q-pt-none">
                  <label>Fecha de ingreso </label>
                  <q-input readonly outlined v-model="detalleVacacionesDiasEconomicos.fechaAlta"></q-input>
                </q-card-section>
                <q-card-section class="col-6 q-pt-none">
                  <label> Años en GRUVER </label>
                  <q-input readonly outlined v-model="detalleVacacionesDiasEconomicos.aniosLaborados"></q-input>
                </q-card-section>
              </div>
              <div class="row q-my-sm">
                <q-card-section class="col-6 q-pt-none">
                  <label>Dias que corresponden por años laborados </label>
                  <q-input readonly outlined v-model="detalleVacacionesDiasEconomicos.diasVacacionesLey"></q-input>
                </q-card-section>
                <q-card-section class="col-6 q-pt-none">
                  <label>Dias disponibles </label>
                  <q-input readonly outlined
                    v-model="detalleVacacionesDiasEconomicos.diasVacacionesRestantes"></q-input>
                </q-card-section>
              </div>
              <div class=" q-my-sm">
                <q-card-section>
                  <label> Seleccione como máximo <span style="color: red;"><b>{{
                    detalleVacacionesDiasEconomicos.diasVacacionesRestantes }}</b></span>
                    días <span style="color: red;">*</span></label>
                </q-card-section>
                <div class="q-my-sm flex flex-center">
                  <q-date v-model="solicitudObj.fechasSeleccionadas" landscape multiple mask="YYYY-MM-DD"
                    label="Selecciona fechas de vacaciones" :locale="myLocale" />
                </div>
              </div>
              <div class="row q-my-sm">
                <q-card-section class="col">
                  <label>Describe los motivos <span style="color: red;">*</span></label>
                </q-card-section>
              </div>
              <div class="row q-my-sm">
                <q-card-section class="col q-pt-none">
                  <q-input maxlength="255" counter autogrow outlined v-model="solicitudObj.descripcionMotivo"></q-input>
                </q-card-section>
              </div>
            </q-form>

            <q-form v-if="solicitudObj.idTipoSolicitud === DIAS_ECONOMICOS" ref="formulario">
              <div class="row q-my-sm">
                <q-card-section class="col-6 q-pt-none">
                  <label>Fecha de ingreso </label>
                  <q-input readonly outlined v-model="detalleVacacionesDiasEconomicos.fechaAlta"></q-input>
                </q-card-section>
                <q-card-section class="col-6 q-pt-none">
                  <label> Años en GRUVER </label>
                  <q-input readonly outlined v-model="detalleVacacionesDiasEconomicos.aniosLaborados"></q-input>
                </q-card-section>
              </div>
              <div class="row q-my-sm">
                <q-card-section class="col-6 q-pt-none">
                  <label>Dias que corresponden al año </label>
                  <q-input readonly outlined v-model="detalleVacacionesDiasEconomicos.diasEconomicosLey"></q-input>
                </q-card-section>
                <q-card-section class="col-6 q-pt-none">
                  <label>Dias disponibles </label>
                  <q-input readonly outlined
                    v-model="detalleVacacionesDiasEconomicos.diasEconomicosRestantes"></q-input>
                </q-card-section>
              </div>
              <div class="q-my-sm">
                <q-card-section class="q-pt-none">
                  <label> Seleccione como máximo <span style="color: red;"><b>{{
                    detalleVacacionesDiasEconomicos.diasEconomicosRestantes }}</b></span>
                    días <span style="color: red;">*</span></label>
                </q-card-section>
                <div class="q-my-sm flex flex-center">
                  <q-date v-model="solicitudObj.fechasSeleccionadas" landscape multiple mask="YYYY-MM-DD"
                    label="Selecciona fechas de vacaciones" :locale="myLocale" />
                </div>
              </div>
              <div class="q-mt-lg">
                <q-card-section class="col-6 q-py-none">
                  <label>Selecciona un motivo <span style="color: red;">*</span></label>
                  <q-option-group inline :options="opcionesDiaEconomico" v-model="solicitudObj.idMotivo"
                    color="primary"></q-option-group>
                </q-card-section>
              </div>
              <div class="row q-my-sm">
                <q-card-section class="col">
                  <label>Describe los motivos <span style="color: red;">*</span></label>
                </q-card-section>
              </div>
              <div class="row q-my-sm">
                <q-card-section class="col q-pt-none">
                  <q-input maxlength="255" counter autogrow outlined v-model="solicitudObj.descripcionMotivo"></q-input>
                </q-card-section>
              </div>
            </q-form>

            <q-stepper-navigation>
              <q-btn color="primary" @click="validarPasoDos" label="continuar" class="q-ml-sm" />
              <q-btn color="primary" flat @click="step = 1" label="atras" class="q-ml-sm" />
            </q-stepper-navigation>
          </q-step>

          <q-step :name="3" title="Envío por correo" icon="settings" :done="step > 4">
            <div class="text-h5 q-pa-sm text-center bg-primary text-white">
              Envío por correo
            </div>
            <q-form ref="formularioCorreos" @submit.prevent="validarPasoTres">
              <div class="row q-my-sm">
                <q-card-section class="col-6 q-pt-none">
                  <label>Email del solicitante <span style="color: red;">*</span></label>
                  <q-input outlined readonly v-model="detalleUsuario.correo"></q-input>
                </q-card-section>
                <q-card-section class="col-5 q-pt-none">
                  <label>Email del jefe inmediato <span style="color: red;">*</span></label>
                  <q-input outlined :readonly="!emailJefeIncorrecto" v-model="emailJefeDirecto" lazy-rules
                    :rules="validarCorreo"></q-input>
                </q-card-section>
                <q-card-section class="col-1 q-pt-none">
                  <div class="checkbox-container">
                    <q-checkbox v-model="emailJefeIncorrecto">
                      <q-tooltip style="font-size: 1.25rem;">Activa solo en caso de ser incorrecto el correo electronico
                        de jefe inmediato</q-tooltip>
                    </q-checkbox>
                  </div>
                </q-card-section>
              </div>
              <q-stepper-navigation>
                <q-btn :loading="cargandoEnvioSolicitud" color="primary" type="submit" label="Enviar solicitud"
                  class="q-ml-sm" />
                <q-btn color="primary" flat @click="step = 2" label="atras" class="q-ml-sm" />
              </q-stepper-navigation>
            </q-form>
          </q-step>
        </q-stepper>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="cerrar" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref, watch } from 'vue'
import { useJustificantesVacacionesStore } from 'src/stores/justificantesVacaciones'
import { storeToRefs } from 'pinia'
import { notificacion } from 'src/helpers/mensajes'
import { validarCorreo } from 'src/helpers/inputReglas'

export default {
  setup() {
    const useJustificantesVacaciones = useJustificantesVacacionesStore()
    const { obtenerDetalleVacacionesDiasEconomicos, solicitarAusenciasYRetardos, solicitarVacaciones, solicitarDiasEconomicos } = useJustificantesVacaciones
    const { cargandoEnvioSolicitud, detalleVacacionesDiasEconomicos, detalleUsuario, detalleJefeDirecto, todasSucursales, todosDepartamentos } = storeToRefs(useJustificantesVacaciones)

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
      }
    ]

    const opcionesDiaEconomico = [
      {
        label: 'Fallecimiento de un familiar en primer grado',
        value: 4
      },
      {
        label: 'Enfermedad del empleado',
        value: 5
      },
      {
        label: 'Nacimiento de hijo(a)',
        value: 6
      }
    ]

    const stepperSolicitud = ref(false)
    const step = ref(1)
    const previousStep = ref(1)
    const errorSeleccion = ref(false)

    const AUSENCIAS_Y_RETARDOS = 1
    const VACACIONES = 2
    const DIAS_ECONOMICOS = 3

    const PASE_DE_ENTRADA = 1
    const PASE_DE_SALIDA = 2
    const FALTA = 3

    const emailJefeDirecto = ref('')
    const emailJefeIncorrecto = ref(false)

    const MOTIVO_VACACIONES = 7

    const formularioCorreos = ref(null)

    const solicitudInit = {
      folio: '',
      idTipoSolicitud: '',
      numero_empleado: '',
      claveEmpresa: '',
      claveSucursal: '',
      claveDepartamento: '',
      idMotivo: '',
      descripcionMotivo: '',
      fechaDiaSolicitado: '',
      horaDiaSolicitado: '',
      fechasSeleccionadas: []
    }

    const solicitudObj = ref({ ...solicitudInit })

    const abrir = async (numero_empleado) => {
      await obtenerDetalleVacacionesDiasEconomicos(numero_empleado)
      solicitudObj.value = { ...solicitudInit }
      step.value = 1
      emailJefeIncorrecto.value = false
      emailJefeDirecto.value = detalleJefeDirecto.value.correo
      stepperSolicitud.value = true
    }

    const validarPasoUno = () => {
      if (typeof solicitudObj.value.idTipoSolicitud !== 'number') {
        notificacion('warning', 'Selecciona un tipo de solicitud')
      } else {
        step.value++
      }
    }

    const validarPasoDos = () => {
      switch (solicitudObj.value.idTipoSolicitud) {
        case AUSENCIAS_Y_RETARDOS:
          if (typeof solicitudObj.value.idMotivo === 'number') {
            if ([PASE_DE_ENTRADA, PASE_DE_SALIDA].includes(solicitudObj.value.idMotivo)) {
              if (solicitudObj.value.fechaDiaSolicitado !== '' && solicitudObj.value.horaDiaSolicitado !== '' && solicitudObj.value.descripcionMotivo !== '') {
                step.value++
              } else {
                notificacion('warning', 'Revise que la información esté completa')
              }
            }

            if ([FALTA].includes(solicitudObj.value.idMotivo)) {
              if (solicitudObj.value.fechasSeleccionadas?.length > 0 && solicitudObj.value.descripcionMotivo !== '') {
                step.value++
              } else {
                notificacion('warning', 'Revise que la información esté completa')
              }
            }
          } else {
            notificacion('warning', 'Seleccione un tipo de pase')
          }
          break
        case VACACIONES:
          if (solicitudObj.value?.fechasSeleccionadas?.length > 0 && solicitudObj.value?.descripcionMotivo !== '') {
            solicitudObj.value.idMotivo = MOTIVO_VACACIONES
            step.value++
          } else {
            notificacion('warning', 'Revise que la información esté completa')
          }
          break
        case DIAS_ECONOMICOS:
          if (solicitudObj.value?.fechasSeleccionadas?.length > 0 && typeof solicitudObj.value.idMotivo === 'number' && solicitudObj.value.descripcionMotivo !== '') {
            step.value++
          } else {
            notificacion('warning', 'Revise que la información esté completa')
          }
          break
      }
    }

    const validarPasoTres = async () => {
      if (!await formularioCorreos.value.validate()) {
        notificacion('warning', 'Revise que la información esté completa')
        return
      }
      const sucursal = todasSucursales.value.find(sucursal => sucursal.claveSucursal === detalleUsuario.value.claveSucursal)
      const departamento = todosDepartamentos.value.find(departamento => departamento.nombreDepartamento === detalleUsuario.value.departamento)

      if (sucursal && departamento) {
        solicitudObj.value.numero_empleado = detalleUsuario.value.numero_empleado
        solicitudObj.value.claveSucursal = sucursal.claveSucursal
        solicitudObj.value.claveEmpresa = sucursal.claveEmpresa
        solicitudObj.value.claveDepartamento = departamento.claveDepartamento

        // Ordena las fechas solicitadas
        solicitudObj.value.fechasSeleccionadas.sort((a, b) => {
          if (a < b) return -1
          if (a > b) return 1
          return 0
        })

        if (detalleUsuario.value?.correo !== '' && detalleJefeDirecto.value?.correo !== '') {
          switch (solicitudObj.value.idTipoSolicitud) {
            case AUSENCIAS_Y_RETARDOS:
              await solicitarAusenciasYRetardos(solicitudObj.value, emailJefeDirecto.value)
              break
            case VACACIONES:
              await solicitarVacaciones(solicitudObj.value, emailJefeDirecto.value)
              break
            case DIAS_ECONOMICOS:
              await solicitarDiasEconomicos(solicitudObj.value, emailJefeDirecto.value)
              break
          }
          stepperSolicitud.value = false
        } else {
          notificacion('warning', 'Revise que la información esté completa')
        }
      }


    }

    // observa los cambios en las fechas seleccionadas del q-date
    watch(() => solicitudObj.value.fechasSeleccionadas, (newVal) => {
      if ([VACACIONES, DIAS_ECONOMICOS].includes(solicitudObj.value.idTipoSolicitud)) {
        const numeroDiasRestantes = solicitudObj.value?.idTipoSolicitud === VACACIONES ? detalleVacacionesDiasEconomicos.value.diasVacacionesRestantes : solicitudObj.value?.idTipoSolicitud === DIAS_ECONOMICOS ? detalleVacacionesDiasEconomicos.value.diasEconomicosRestantes : 0

        if (newVal && newVal.length > numeroDiasRestantes) {
          errorSeleccion.value = true
          // corta el arreglo de fechas según el límite de días
          solicitudObj.value.fechasSeleccionadas = solicitudObj.value?.idTipoSolicitud === VACACIONES ? newVal.slice(0, detalleVacacionesDiasEconomicos.value.diasVacacionesRestantes) : solicitudObj.value?.idTipoSolicitud === DIAS_ECONOMICOS ? newVal.slice(0, detalleVacacionesDiasEconomicos.value.diasEconomicosRestantes) : 0
          notificacion('warning', `Alcanzaste el límite de días disponibles restantes`)
        } else {
          errorSeleccion.value = false
        }
      }
    }, { deep: true })

    return {
      stepperSolicitud,
      step,
      previousStep,
      solicitudObj,
      AUSENCIAS_Y_RETARDOS,
      VACACIONES,
      DIAS_ECONOMICOS,
      PASE_DE_ENTRADA,
      PASE_DE_SALIDA,
      FALTA,
      opcionesTipoPase,
      detalleVacacionesDiasEconomicos,
      abrir,
      errorSeleccion,
      validarPasoUno,
      validarPasoDos,
      validarPasoTres,
      opcionesDiaEconomico,
      detalleUsuario,
      detalleJefeDirecto,
      cargandoEnvioSolicitud,
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
      emailJefeIncorrecto,
      emailJefeDirecto,
      validarCorreo,
      formularioCorreos
    }
  }
}
</script>

<style scoped>
.checkbox-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
</style>
