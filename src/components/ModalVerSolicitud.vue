<template>
    <q-dialog v-model="modalVerSolicitud">
       <q-card class="full-width">
         <q-card-section>
            <q-btn icon="close" flat round dense v-close-popup />
           <div v-if="!incapacidad" class="text-h4 text-center q-mb-sm">
             Solicitud #{{solicitudObj.folio}}
             <q-separator/>
           </div>
           <div v-else class="text-h4 text-center q-mb-sm">
             Incapacidad #{{solicitudObj.folio}}
             <q-separator/>
           </div>
         </q-card-section>
         <div v-if="!incapacidad" class="text-h5 q-pa-sm text-center bg-primary text-white q-mb-md">
           Información del Solicitante
         </div>
         <div v-else class="text-h5 q-pa-sm text-center bg-primary text-white q-mb-md">
           Información del Colaborador
         </div>
         <div class="row q-my-sm">
           <q-card-section class="col-6 q-pt-none">
             <label class="label-negritas">Número de empleado</label>
             <q-input
               v-model="solicitudObj.numero_empleado"
               outlined
               readonly
               />
           </q-card-section>
           <q-card-section class="col-6 q-pt-none">
             <label class="label-negritas">Nombre del colaborador</label>
             <q-input
                 v-model="solicitudObj.nombre"
                 outlined
                 readonly
             />
           </q-card-section>
         </div>
         <div v-if="!incapacidad" class="text-h5 q-pa-sm text-center bg-primary text-white q-mb-md">
           Información de la Solicitud
         </div>
         <div v-else class="text-h5 q-pa-sm text-center bg-primary text-white q-mb-md">
           Información de la Incapacidad
         </div>
         <div v-if="solicitudObj.horaDiaSolicitado" class="row q-my-sm">
           <q-card-section class="col-4 q-pt-none">
             <label class="label-negritas">Fecha de creación</label>
             <q-input
               v-model="solicitudObj.createdAt"
               outlined
               readonly
               />
           </q-card-section>
           <q-card-section class="col-4 q-pt-none">
             <label class="label-negritas">Fecha de aplicación</label>
             <q-input
                 v-model="solicitudObj.fechaDiaSolicitado"
                 outlined
                 readonly
             />
           </q-card-section>
           <q-card-section class="col-4 q-pt-none">
             <label class="label-negritas">Hora de aplicación</label>
             <q-input
                 v-model="solicitudObj.horaDiaSolicitado"
                 outlined
                 readonly
             />
           </q-card-section>
         </div>
         <div v-else class="row q-my-sm">
           <q-card-section class="col-6 q-pt-none">
             <label class="label-negritas">Fecha de creación</label>
             <q-input
               v-model="solicitudObj.createdAt"
               outlined
               readonly
               />
           </q-card-section>
           <q-card-section class="col-6 q-pt-none">
             <label class="label-negritas">Fecha de aplicación</label>
             <q-input
                 v-model="solicitudObj.fechaDiaSolicitado"
                 outlined
                 readonly
             />
           </q-card-section>
         </div>
         <div v-if="!incapacidad" class="text-h5 q-pa-sm text-center bg-primary text-white q-mb-md">
           Detalle de la Solicitud
         </div>
         <div v-else class="text-h5 q-pa-sm text-center bg-primary text-white q-mb-md">
           Detalle de la Incapacidad
         </div>
         <div class="row q-my-sm">
           <q-card-section v-if="!incapacidad" class="col-12 q-pt-none">
             <label class="label-negritas">Solicitud</label>
             <q-input
               v-model="solicitudObj.nombreSolicitud"
               outlined
               readonly
             />
           </q-card-section>
           <q-card-section class="col-12 q-pt-none">
             <label class="label-negritas">Motivo</label>
             <q-input
               v-model="solicitudObj.nombreMotivo"
               outlined
               readonly
             />
           </q-card-section>
           <q-card-section class="col-12 q-pt-none">
             <label class="label-negritas">Descripción Motivo</label>
             <q-input
               v-model="solicitudObj.descripcionMotivo"
               outlined
               readonly
             />
           </q-card-section>
          </div>
          <div class="text-h5 q-pa-sm text-center bg-primary text-white q-mb-md">
           Información de Autorizaciones
         </div>
         <div class="row q-my-sm">
           <q-card-section v-if="!incapacidad" class="col-3 q-pt-none">
             <label class="label-negritas">Estatus</label>
             <div class="q-pt-xs">
              <q-chip
                        class="text-white"
                        size="1.3rem"
                        unelevated
                        rounded
                        :color="colorAutorizacion(solicitudObj.nombreEstatus1)"
                        :label="solicitudObj.nombreEstatus1"
              />
             </div>
           </q-card-section>
           <q-card-section v-if="!incapacidad" class="col-4 q-pt-none">
             <label class="label-negritas">Fecha</label>
             <q-input
               v-model="solicitudObj.fechaAutorizacion1"
               outlined
               readonly
               />
           </q-card-section>
           <q-card-section v-if="!incapacidad" class="col-5 q-pt-none">
             <label class="label-negritas">Nombre del autorizador</label>
             <q-input
                 v-model="solicitudObj.nombreEmpleadoAutoriza1"
                 outlined
                 readonly
             />
           </q-card-section>
           <q-card-section v-else class="col-12 q-pt-none">
             <label class="label-negritas">Nombre del autorizador</label>
             <q-input
                 v-model="solicitudObj.editedBy"
                 outlined
                 readonly
             />
           </q-card-section>
         </div>
       </q-card>
     </q-dialog>
 </template>

<script>
import { ref } from 'vue'
import { formatearFecha, formatearHora } from 'src/helpers/formatearFecha'
import { coloresAutorizaciones } from 'src/constant/constantes'

const incapacidad = ref(false)

export default {
  setup () {
    const modalVerSolicitud = ref(false)
    const solicitudObj = ref(null)
    const abrir = (movimiento) => {
      solicitudObj.value = { ...movimiento }
      solicitudObj.value.createdAt = formatearFecha(solicitudObj.value.createdAt)
      if(solicitudObj.value.fechaDiaSolicitado){
        solicitudObj.value.fechaDiaSolicitado = formatearFecha(solicitudObj.value.fechaDiaSolicitado)
        incapacidad.value = false
      }else{
        solicitudObj.value.fechaDiaSolicitado = formatearFecha(solicitudObj.value.fechaIncapacidad)
        solicitudObj.value.nombreMotivo = solicitudObj.value.motivo
        incapacidad.value = true
      }
      solicitudObj.value.fechaAutorizacion1 = formatearHora(solicitudObj.value.fechaAutorizacion1)
      modalVerSolicitud.value = true
    }

    const colorAutorizacion = (estado) => {
      const colores = coloresAutorizaciones.find(e => e.estado === estado)
      return colores?.color
    }

    return {
      abrir,
      modalVerSolicitud,
      solicitudObj,
      incapacidad,
      colorAutorizacion
    }
  }
}
</script>
z
