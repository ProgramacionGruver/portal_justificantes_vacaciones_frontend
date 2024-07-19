<template>
  <q-dialog v-model="modalDetalleSolicitud">
    <q-card class="q-pa-md" style="width: 700px; max-width: 80vw;">
      <q-btn style="float: right;" flat outline v-close-popup icon="close"></q-btn>
      <h3 class="text-center">Detalles de la solicitud</h3>
      <q-separator color="primary" class="q-my-md" />
      <div class="row q-my-sm">
        <div class="col-12">
          <label>Nombre del colaborador</label>
          <q-input :label="`${solicitud.usuario.nombre}`" outlined readonly />
        </div>
      </div>
      <div class="row q-my-sm">
        <div class="col-6 q-pr-sm">
          <label>Folio</label>
          <q-input :label="`${solicitud.folio}`" outlined readonly />
        </div>
        <div class="col-6 q-pl-sm">
          <label>Tipo solicitud</label>
          <q-input :label="`${solicitud.catalogo_tipo_solicitude.nombreSolicitud}`" outlined readonly />
        </div>
      </div>
      <div class="row q-my-sm">
        <div class="col-6 q-pr-sm">
          <label>Motivo</label>
          <q-input :label="`${solicitud.catalogo_motivo.nombreMotivo}`" outlined readonly />
        </div>
        <div class="col-6 q-pl-sm">
          <label>Fecha de solicitud</label>
          <q-input :label="`${formatearFecha(solicitud.createdAt)}`" outlined readonly />
        </div>
      </div>
      <div class="row q-my-sm">
        <div class="col-12">
          <label>Descripción de motivos</label>
          <q-input autogrow :label="`${solicitud.descripcionMotivo}`" outlined readonly />
        </div>
      </div>
      <p class="q-my-lg text-center">Autorizaciones</p>
      <q-table wrap-cells class="q-my-md" :rows="solicitud.solicitud_detalles" :columns="columnasDetalles" rows-per-page-label="Registros por página" no-data-label="Sin información">
        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th auto-width />
            <q-th v-for="columna in props.cols" :key="columna.name" :props="props">
              {{ columna.label }}
            </q-th>
          </q-tr>
        </template>

        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td auto-width>
              <q-btn size="sm" color="primary" dense rounded @click="alternarExpandir(props.row.idSolicitudDetalle)"
                :icon="filasExpandidas[props.row.idSolicitudDetalle] ? 'remove' : 'add'" />
            </q-td>
            <q-td v-for="columna in props.cols" :key="columna.name" :props="props">
              {{ columna.value }}
            </q-td>
          </q-tr>
          <q-tr v-show="filasExpandidas[props.row.idSolicitudDetalle]" :props="props">
            <q-td colspan="100%">
              <q-table wrap-cells dense flat :rows="props.row.autorizaciones_solicitudes" :columns="columnasAutorizaciones"
                no-data-label="No se encontró información" rows-per-page-label="Registros por página" row-key="idAutorizacion">
                <template v-slot:body="props">
                  <q-tr :props="props">
                    <q-td class="text-center"> {{ props.row.idTipoAutorizacion }}</q-td>
                    <q-td class="text-center"> {{ props.row.numeroEmpleadoAutoriza }}</q-td>
                    <q-td class="text-center"> {{ props.row.nombreEmpleadoAutoriza }}</q-td>
                    <q-td class="text-center"> {{ props.row.catalogo_estatus?.nombreEstatus }}</q-td>
                    <q-td class="text-center"> {{ props.row.comentario }}</q-td>
                    <q-td class="text-center"> {{ formatearFecha(props.row.updatedAt) }}</q-td>
                  </q-tr>
                </template>
              </q-table>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </q-card>
  </q-dialog>
</template>

<script>
import { formatearFecha } from 'src/helpers/formatearFecha'
import { ref } from 'vue'

export default {
  setup() {
    const modalDetalleSolicitud = ref(false)
    const solicitud = ref(null)
    const filasExpandidas = ref({})

    const columnasDetalles = [
      {
        name: 'fechaDiaSolicitado',
        label: 'Día',
        field: (row) => formatearFecha(row.fechaDiaSolicitado),
        align: 'center',
        sortable: true,
      },
      {
        name: 'estatus',
        label: 'Estatus',
        field: (row) => row.catalogo_estatus?.nombreEstatus,
        align: 'center',
        sortable: true,
      },
    ]

    const columnasAutorizaciones = [
      { name: 'tipoAutorizacion', label: '#', field: 'idTipoAutorizacion', align: 'center' },
      { name: 'numeroEmpleado', label: 'No. Empleado', field: 'numeroEmpleadoAutoriza', align: 'center' },
      { name: 'nombreEmpleado', label: 'Nombre', field: 'nombreEmpleadoAutoriza', align: 'center' },
      { name: 'estatus', label: 'Estatus', field: 'catalogo_estatus?.nombreEstatus', align: 'center' },
      { name: 'comentario', label: 'Comentario', field: 'comentario', align: 'center' },
      { name: 'fecha', label: 'Fecha', field: (row) => formatearFecha(updatedAt), align: 'center' }

    ]

    const alternarExpandir = (id) => {
      filasExpandidas.value[id] = !filasExpandidas.value[id]
    }

    const abrir = (detalle) => {
      solicitud.value = detalle
      filasExpandidas.value = {}
      modalDetalleSolicitud.value = true
    }

    return {
      modalDetalleSolicitud,
      solicitud,
      columnasDetalles,
      columnasAutorizaciones,
      filasExpandidas,
      alternarExpandir,
      abrir,
      formatearFecha,
    }
  }
}
</script>
