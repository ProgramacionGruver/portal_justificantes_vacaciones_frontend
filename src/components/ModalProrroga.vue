<template>
  <q-dialog v-model="modalProrroga">
    <q-card class="q-pa-md" style="width: 850px; max-width: 80vw;">
      <q-card-section>
        <q-btn style="float: right;" flat outline v-close-popup icon="close"></q-btn>
        <h3 class="text-center">Solicitud de prórroga</h3>
        <q-separator color="primary" class="q-my-md" />
        <q-form @submit="enviarSolicitud()">
          <div class="row q-my-md">
            <div class="col-xs-12 col-sm-3 q-pr-sm">
              <label>No. empleado</label>
              <q-input :label="`${usuarioObj.numero_empleado}`" outlined readonly />
            </div>
            <div class="col-xs-12 col-sm-9 q-pl-sm">
              <label>Nombre del colaborador</label>
              <q-input :label="`${usuarioObj.nombre}`" outlined readonly />
            </div>
          </div>
          <div class="row q-my-md">
            <div class="col-xs-12 col-sm-4 q-pr-sm">
              <label>Empresa</label>
              <q-input :label="`${usuarioObj.division}`" outlined readonly />
            </div>
            <div class="col-xs-12 col-sm-4 q-pl-sm q-pr-sm">
              <label>Sucursal</label>
              <q-input :label="`${usuarioObj.centroTrabajo}`" outlined readonly />
            </div>
            <div class="col-xs-12 col-sm-4 q-pl-sm">
              <label>Departamento</label>
              <q-input :label="`${usuarioObj.departamento}`" outlined readonly />
            </div>
          </div>
          <div class="row q-my-md">
            <div class="col-xs-12 col-sm-3 q-pr-sm">
              <label>Dias a solicitar</label>
              <q-input type="number" v-model="solicitudProrrogaObj.numeroDiasProrroga" lazy-rules
                :rules="validarEnterosPositivos" outlined />
            </div>
            <div class="col-xs-12 col-sm-3 q-pl-sm q-pr-sm">
              <label>Vigencia</label>
              <q-input :label="fechaAniversario" outlined readonly />
            </div>
          </div>
          <div class="row q-my-md">
            <div class="col-12">
              <label>Descripción de los motivos</label>
              <q-input autogrow counter maxlength="350" outlined v-model="solicitudProrrogaObj.descripcionMotivo" lazy-rules :rules="validarTexto"/>
            </div>
          </div>
          <q-card-actions align="right">
            <q-btn icon-right="send" type="submit" label="Enviar" color="primary" :loading="cargandoEnvioSolicitud" />
          </q-card-actions>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { formatearFecha } from 'src/helpers/formatearFecha'
import { validarEnterosPositivos, validarTexto } from 'src/helpers/inputReglas'
import { ref, computed } from 'vue'
import dayjs from 'dayjs'
import { storeToRefs } from 'pinia'
import { useJustificantesVacacionesStore } from 'src/stores/justificantesVacaciones'

export default {
  setup() {
    const useJustificantesVacaciones = useJustificantesVacacionesStore()
    const { obtenerDetalleVacacionesDiasEconomicos, solicitarProrroga } = useJustificantesVacaciones
    const { detalleVacacionesDiasEconomicos, cargandoEnvioSolicitud } = storeToRefs(useJustificantesVacaciones)

    const modalProrroga = ref(false)
    const usuarioObj = ref(null)

    const PRORROGA = 7
    const MOTIVO_PRORROGA = 11

    const fechaAniversario = computed(() => {
      const fechaAlta = usuarioObj.value.fechaAlta
      const anioActual = dayjs().year()
      const aniversario = dayjs(fechaAlta).year(anioActual)
      return formatearFecha(aniversario)
    })

    const solicitudProrrogaInit = {
      folio: '',
      numero_empleado: '',
      numeroDiasProrroga: '',
      claveEmpresa: '',
      claveSucursal: '',
      claveDepartamento: '',
      idTipoSolicitud: PRORROGA,
      idMotivo: MOTIVO_PRORROGA,
      descripcionMotivo: ''
    }

    const solicitudProrrogaObj = ref(solicitudProrrogaInit)

    const abrir = async (numero_empleado) => {
      solicitudProrrogaObj.value = { ...solicitudProrrogaInit }
      await obtenerDetalleVacacionesDiasEconomicos(numero_empleado)
      usuarioObj.value = detalleVacacionesDiasEconomicos.value
      modalProrroga.value = true
    }

    const enviarSolicitud = async () => {

      solicitudProrrogaObj.value.claveEmpresa = detalleVacacionesDiasEconomicos.value.claveEmpresa
      solicitudProrrogaObj.value.claveSucursal = detalleVacacionesDiasEconomicos.value.claveSucursal
      solicitudProrrogaObj.value.claveDepartamento = detalleVacacionesDiasEconomicos.value.claveDepartamento
      solicitudProrrogaObj.value.numero_empleado = detalleVacacionesDiasEconomicos.value.numero_empleado

      await solicitarProrroga(solicitudProrrogaObj.value)

      modalProrroga.value = false
    }

    return {
      cargandoEnvioSolicitud,
      modalProrroga,
      usuarioObj,
      validarEnterosPositivos,
      validarTexto,
      solicitudProrrogaObj,
      fechaAniversario,
      abrir,
      formatearFecha,
      enviarSolicitud,

    }
  }
}
</script>
