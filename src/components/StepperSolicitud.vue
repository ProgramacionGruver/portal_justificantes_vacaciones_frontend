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
            <div class="text-h5 text-center bg-primary text-white q-pt-sm q-pb-sm">
              Tipo de solicitud
            </div>
            <div class="row">
              <q-card-section class="col-12">
                <div class="radios">
                  <q-radio v-model="solicitudObj.idTipoSolicitud" class="col-6" checked-icon="task_alt"
                    unchecked-icon="panorama_fish_eye" :val="1" label="Ausencias y retardos" />
                  <q-radio v-model="solicitudObj.idTipoSolicitud" class="col-6" checked-icon="task_alt"
                    unchecked-icon="panorama_fish_eye" :val="2" label="Vacaciones" />
                  <q-radio v-model="solicitudObj.idTipoSolicitud" class="col-6" checked-icon="task_alt"
                    unchecked-icon="panorama_fish_eye" :val="3" label="Días económicos" />
                  <!-- mostrar si detecta que tiene días vencidos etc...  -->
                  <q-radio
                    v-if="detalleVacacionesDiasEconomicos?.vacacionesVencidasRestantes && detalleVacacionesDiasEconomicos?.vacacionesVencidasRestantes > 0"
                    v-model="solicitudObj.idTipoSolicitud" class="col-6" checked-icon="task_alt"
                    unchecked-icon="panorama_fish_eye" :val="5" label="Vacaciones vencidas" />
                  <q-radio
                    v-if="detalleVacacionesDiasEconomicos?.sabados5s && detalleVacacionesDiasEconomicos?.sabados5s > 0"
                    v-model="solicitudObj.idTipoSolicitud" class="col-6" checked-icon="task_alt"
                    unchecked-icon="panorama_fish_eye" :val="6" label="Sábados 5s" />
                  <q-radio
                    v-if="detalleVacacionesDiasEconomicos?.diasGanados && detalleVacacionesDiasEconomicos?.diasGanados > 0"
                    v-model="solicitudObj.idTipoSolicitud" class="col-6" checked-icon="task_alt"
                    unchecked-icon="panorama_fish_eye" :val="4" label="Días ganados" />
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

            <q-form
              v-if="[VACACIONES, DIAS_GANADOS, VACACIONES_VENCIDAS, SABADOS_5S].includes(solicitudObj.idTipoSolicitud)"
              ref="formulario">
              <div class="row q-my-sm" v-if="solicitudObj.idTipoSolicitud === SABADOS_5S">
                <q-card-section class="col-xs-12 col-sm-6 q-pt-none">
                  <label>Sábados 5s</label>
                  <q-input readonly outlined v-model="detalleVacacionesDiasEconomicos.sabados5s"></q-input>
                </q-card-section>
              </div>
              <div class="row q-my-sm" v-if="solicitudObj.idTipoSolicitud === VACACIONES_VENCIDAS">
                <q-card-section class="col-xs-12 col-sm-6 q-pt-none">
                  <label>Vacaciones vencidas</label>
                  <q-input readonly outlined v-model="detalleVacacionesDiasEconomicos.vacacionesVencidasRestantes"></q-input>
                </q-card-section>
              </div>
              <div class="row q-my-sm" v-if="solicitudObj.idTipoSolicitud === DIAS_GANADOS">
                <q-card-section class="col-xs-12 col-sm-6 q-pt-none">
                  <label>Días ganados disponibles</label>
                  <q-input readonly outlined v-model="detalleVacacionesDiasEconomicos.diasGanados"></q-input>
                </q-card-section>
              </div>
              <div v-if="solicitudObj.idTipoSolicitud === VACACIONES">
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
                    <label>Días que corresponden por años laborados </label>
                    <q-input readonly outlined v-model="detalleVacacionesDiasEconomicos.diasVacacionesLey"></q-input>
                  </q-card-section>
                  <q-card-section class="col-6 q-pt-none">
                    <label>Días disponibles </label>
                    <q-input readonly outlined
                      v-model="detalleVacacionesDiasEconomicos.diasVacacionesRestantes"></q-input>
                  </q-card-section>
                </div>
              </div>
              <div class=" q-my-sm">
                <q-card-section>
                  <label> Seleccione como máximo <span style="color: red;"><b>{{
                    numeroDiasRestantes }}</b></span>
                    días <span style="color: red;">*</span></label>
                </q-card-section>
                <div class="q-my-sm flex flex-center contenedor--fecha">
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
                  <label>Días que corresponden al año </label>
                  <q-input readonly outlined v-model="detalleVacacionesDiasEconomicos.diasEconomicosLey"></q-input>
                </q-card-section>
                <q-card-section class="col-6 q-pt-none">
                  <label>Días disponibles </label>
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
              <div class="row q-my-sm formulario--correos">
                <q-card-section v-if="!detalleJefeDirecto?.correo" class="col-6 q-pt-none formulario--correos__input">
                  <label>Email del solicitante <span style="color: red;">*</span></label>
                  <q-input outlined readonly v-model="detalleUsuario.correo"></q-input>
                </q-card-section>
                <q-card-section class="col-5 q-pt-none formulario--correos__input">
                  <label>Email del jefe inmediato <span style="color: red;">*</span></label>
                  <q-input outlined :readonly="!emailJefeIncorrecto" v-model="emailJefeDirecto" lazy-rules
                    :rules="validarCorreo"></q-input>
                </q-card-section>
                <q-card-section class="col-1 q-pt-none formulario--correos__input">
                  <div class="checkbox-container">
                    <q-checkbox v-model="emailJefeIncorrecto" label="Activar para cambiar el correo del jefe inmediato." />
                  </div>
                </q-card-section>
                <div v-if="emailJefeIncorrecto">
                  <span class="advertencia" >**Nota: Deberas notificar a R.H. para que se realice el cambio desde el origen.</span>
                </div>
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
import { ref, computed, watch } from 'vue'
import { useJustificantesVacacionesStore } from 'src/stores/justificantesVacaciones'
import { storeToRefs } from 'pinia'
import { notificacion } from 'src/helpers/mensajes'
import { validarCorreo } from 'src/helpers/inputReglas'
import dayjs from 'dayjs'

export default {
  setup() {
    const useJustificantesVacaciones = useJustificantesVacacionesStore()
    const { obtenerDetalleVacacionesDiasEconomicos, solicitarAusenciasYRetardos, solicitarVacaciones, solicitarDiasEconomicos, solicitarDiasGanados, solicitarVacacionesVencidas, solicitarSabados5s } = useJustificantesVacaciones
    const { cargandoEnvioSolicitud, detalleVacacionesDiasEconomicos, detalleUsuario, detalleJefeDirecto } = storeToRefs(useJustificantesVacaciones)

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
    const DIAS_GANADOS = 4
    const VACACIONES_VENCIDAS = 5
    const SABADOS_5S = 6

    const PASE_DE_ENTRADA = 1
    const PASE_DE_SALIDA = 2
    const FALTA = 3

    const MOTIVO_VACACIONES = 7
    const MOTIVO_DIAS_GANADOS = 8
    const MOTIVO_VACACIONES_VENCIDAS = 9
    const MOTIVO_SABADOS_5S = 10

    const emailJefeDirecto = ref('')
    const emailJefeIncorrecto = ref(false)

    const numeroDiasRestantes = computed(() => {
      return solicitudObj.value?.idTipoSolicitud === VACACIONES ? detalleVacacionesDiasEconomicos.value.diasVacacionesRestantes :
        solicitudObj.value?.idTipoSolicitud === DIAS_ECONOMICOS ? detalleVacacionesDiasEconomicos.value.diasEconomicosRestantes :
          solicitudObj.value?.idTipoSolicitud === DIAS_GANADOS ? detalleVacacionesDiasEconomicos.value.diasGanados :
            solicitudObj.value?.idTipoSolicitud === VACACIONES_VENCIDAS ? detalleVacacionesDiasEconomicos.value.vacacionesVencidasRestantes :
              solicitudObj.value?.idTipoSolicitud === SABADOS_5S ? detalleVacacionesDiasEconomicos.value.sabados5s : 0
    })

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
      if (numero_empleado == null || !Number.isInteger(numero_empleado)) {
        notificacion('negative', 'No se encontró el número de empleado o el número de empleado no es válido')
        console.log(numero_empleado)
        return
      }

      await obtenerDetalleVacacionesDiasEconomicos(numero_empleado)

      if (detalleVacacionesDiasEconomicos.value == null) {
        notificacion('negative', 'No se pudo obtener el detalle de vacaciones y días económicos')
        console.log(detalleVacacionesDiasEconomicos)
        return
      }

      solicitudObj.value = { ...solicitudInit }
      step.value = 1
      emailJefeIncorrecto.value = false

      const correo = detalleJefeDirecto.value?.correo
      emailJefeDirecto.value = correo != null ? correo : ''

      stepperSolicitud.value = true
    }

    const verificarCamposCompletos = (campos) => {
      return campos.every(campo => campo !== '' && campo !== undefined && campo !== null)
    }

    const validarPasoUno = () => {
      // Limpiar fechas seleccionadas antes del paso 2
      solicitudObj.value.fechasSeleccionadas = []
      solicitudObj.value.fechaDiaSolicitado = ''
      solicitudObj.value.horaDiaSolicitado = ''

      if (typeof solicitudObj.value.idTipoSolicitud !== 'number') {
        notificacion('warning', 'Selecciona un tipo de solicitud')
      } else {
        step.value++
      }
    }

    const validarPasoDos = () => {
      const { idTipoSolicitud, idMotivo, fechaDiaSolicitado, horaDiaSolicitado, descripcionMotivo, fechasSeleccionadas } = solicitudObj.value

      const notificarError = () => {
        notificacion('warning', 'Revise que la información esté completa')
        return
      }

      switch (idTipoSolicitud) {
        case AUSENCIAS_Y_RETARDOS:
          if (typeof idMotivo !== 'number') {
            notificacion('warning', 'Seleccione un tipo de pase')
            return
          }
          if ([PASE_DE_ENTRADA, PASE_DE_SALIDA].includes(idMotivo)) {
            if (verificarCamposCompletos([fechaDiaSolicitado, horaDiaSolicitado, descripcionMotivo])) {
              step.value++
            } else {
              notificarError()
            }
          }
          if (idMotivo === FALTA) {
            if (verificarCamposCompletos([descripcionMotivo]) && fechasSeleccionadas?.length > 0) {
              step.value++
            } else {
              notificarError()
            }
          }
          break

        case VACACIONES:
        case DIAS_GANADOS:
        case VACACIONES_VENCIDAS:
        case SABADOS_5S:
          if (verificarCamposCompletos([descripcionMotivo]) && fechasSeleccionadas?.length > 0) {
            //  "computed property names"
            solicitudObj.value.idMotivo = {
              [VACACIONES]: MOTIVO_VACACIONES,
              [DIAS_GANADOS]: MOTIVO_DIAS_GANADOS,
              [VACACIONES_VENCIDAS]: MOTIVO_VACACIONES_VENCIDAS,
              [SABADOS_5S]: MOTIVO_SABADOS_5S
            }[idTipoSolicitud]
            step.value++
          } else {
            notificarError()
          }
          break

        case DIAS_ECONOMICOS:
          if (verificarCamposCompletos([descripcionMotivo]) && fechasSeleccionadas?.length > 0 && typeof idMotivo === 'number') {
            step.value++
          } else {
            notificarError()
          }
          break

        default:
          notificacion('warning', 'Tipo de solicitud no válido')
          break
      }
    }

    const validarPasoTres = async () => {
      if (!await formularioCorreos.value.validate()) {
        notificacion('warning', 'Revise que la información esté completa')
        return
      }

        solicitudObj.value.numero_empleado = detalleUsuario.value.numero_empleado
        solicitudObj.value.claveSucursal = detalleVacacionesDiasEconomicos.value.claveSucursal
        solicitudObj.value.claveEmpresa = detalleVacacionesDiasEconomicos.value.claveEmpresa
        solicitudObj.value.claveDepartamento = detalleVacacionesDiasEconomicos.value.claveDepartamento

        // Ordena las fechas solicitadas
        solicitudObj.value.fechasSeleccionadas.sort((a, b) => {
          if (a < b) return -1
          if (a > b) return 1
          return 0
        })

        if (detalleJefeDirecto.value?.correo !== '') {
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
            case DIAS_GANADOS:
              await solicitarDiasGanados(solicitudObj.value, emailJefeDirecto.value)
              break
            case VACACIONES_VENCIDAS:
              await solicitarVacacionesVencidas(solicitudObj.value, emailJefeDirecto.value)
              break
            case SABADOS_5S:
              await solicitarSabados5s(solicitudObj.value, emailJefeDirecto.value)
              break
          }
          stepperSolicitud.value = false
        } else {
          notificacion('warning', 'Revise que la información esté completa')
        }
      }


    // observa los cambios en las fechas seleccionadas del q-date
    watch(() => solicitudObj.value.fechasSeleccionadas, (nuevoValor) => {
      if ([VACACIONES, DIAS_ECONOMICOS, DIAS_GANADOS, VACACIONES_VENCIDAS].includes(solicitudObj.value.idTipoSolicitud)) {

        if (nuevoValor && nuevoValor.length > numeroDiasRestantes.value) {
          errorSeleccion.value = true
          // corta el arreglo de fechas según el límite de días
          solicitudObj.value.fechasSeleccionadas = nuevoValor.slice(0, numeroDiasRestantes.value)
          notificacion('warning', `Alcanzaste el límite de días disponibles restantes`)
        } else {
          errorSeleccion.value = false
        }
      }

      if (solicitudObj.value.idTipoSolicitud === SABADOS_5S) {
        let error = false;

        // Verificar que todas las fechas seleccionadas sean sábados
        const todosSabados = nuevoValor?.every(fecha => dayjs(fecha).day() === 6);
        if (!todosSabados) {
          errorSeleccion.value = true;
          notificacion('warning', `Solo puedes seleccionar días sábado.`);
          error = true;
        } else {
          // Agrupar las fechas por mes
          const agrupadasPorMes = nuevoValor.reduce((acumulador, fecha) => {
            const mes = dayjs(fecha).format('YYYY-MM');
            if (!acumulador[mes]) acumulador[mes] = [];
            acumulador[mes].push(fecha);
            return acumulador;
          }, {});

          // Verificar que no haya más de un sábado por mes usando métodos modernos de JavaScript
          const masDeUnSabadoPorMes = Object.values(agrupadasPorMes).some(fechas => fechas.length > 1);

          if (masDeUnSabadoPorMes) {
            errorSeleccion.value = true;
            notificacion('warning', `Solo puedes seleccionar un sábado por mes.`);
            error = true;
          } else {
            // Limitar el número de días seleccionados según el límite permitido
            if (nuevoValor.length > numeroDiasRestantes.value) {
              solicitudObj.value.fechasSeleccionadas = nuevoValor.slice(0, numeroDiasRestantes.value);
              notificacion('warning', `Alcanzaste el límite de días disponibles restantes`);
              errorSeleccion.value = true;
            } else {
              errorSeleccion.value = false;
            }
          }
        }

        if (error) {
          solicitudObj.value.fechasSeleccionadas = []; // Limpiar la selección si hay un error
        } else {
          errorSeleccion.value = false;
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
      DIAS_GANADOS,
      VACACIONES_VENCIDAS,
      SABADOS_5S,
      PASE_DE_ENTRADA,
      PASE_DE_SALIDA,
      FALTA,
      numeroDiasRestantes,
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
/* .checkbox-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
} */
</style>
