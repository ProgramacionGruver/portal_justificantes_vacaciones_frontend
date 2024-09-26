<template>
  <q-dialog v-model="abrirModal">
    <q-card style="min-width: 70vw;">
      <q-card-section class="bg-primary text-white row items-center q-pb-none">
        <h2 class="text-h4">Justificante Masivo</h2>
        <q-space />
      </q-card-section>
      <div class="div--contenedor__general">
          <div style="display: block;">
            <div class="q-ma-md">
              <div class="row items-start q-col-gutter-sm q-pt-md">
                <div class="col-6">
                  <label>Folio:</label>
                  <q-input
                    readonly
                    dense
                    outlined
                    v-model="justificanteObj.folioJustificanteMasivo"
                  />
                </div>
                <div class="col-6">
                  <label>Agregado por:</label>
                  <q-input
                    readonly
                    dense
                    outlined
                    v-model="justificanteObj.editedBy"
                  />
                </div>
              </div>
              <div class="row items-start q-col-gutter-sm q-pt-md">
                <div class="col-6">
                  <label>Motivo:</label>
                  <q-input
                    readonly
                    dense
                    outlined
                    v-model="justificanteObj.motivo"
                  />
                </div>
                <div class="col-6">
                  <label>Descripción Motivo:</label>
                  <q-input
                    readonly
                    dense
                    outlined
                    v-model="justificanteObj.descripcionMotivo"
                  />
                </div>
              </div>
            </div>
            <div class="q-ma-md q-pt-md">
              <q-table
                title="Justificantes"
                :rows="justificanteObj.solicitudes"
                :columns="columns"
                row-key="name"
              >
              <template v-slot:body-cell-estatus="props">
              <q-td>
                <q-chip clickable @click="verDetalleSolicitud(props.row)" :icon="obtenerPropsQChip(props.row.solicitud_detalles).icono" text-color="white"
                  :color="obtenerPropsQChip(props.row.solicitud_detalles).color" :label="obtenerPropsQChip(props.row.solicitud_detalles).nombre"><q-tooltip>Ver detalles</q-tooltip></q-chip>
              </q-td>
            </template>
              </q-table>
            </div>
          </div>
      </div>
      <q-card-section>
          <q-card-actions align="right">
            <q-btn
              icon-right="close"
              flat
              label="Cerrar"
              text-color="dark"
              color="gris"
              v-close-popup
            />
          </q-card-actions>
      </q-card-section>
    </q-card>
  </q-dialog>
  <ModalVerDetalleSolicitud ref="modalDetalle"></ModalVerDetalleSolicitud>
</template>

<script>
import { ref } from "vue"
import { formatearFecha } from "src/helpers/formatearFecha";
import ModalVerDetalleSolicitud from 'src/components/ModalVerDetalleSolicitud.vue'
import { obtenerPropsQChip } from 'src/helpers/autorizacionesSolicitud.js'

export default {
  components: {
    ModalVerDetalleSolicitud
  },
  setup() {
    const abrirModal = ref(false)
    const justificanteObj = ref(null)
    const modalDetalle = ref(null)

    const abrir = (justificanteMasivo) => {
        justificanteObj.value = { ...justificanteMasivo }
        abrirModal.value = true
    }

    const columns = [
      {
        name: 'folio',
        label: 'Folio',
        field: 'folio',
        align: 'center',
        sortable: true
      },
      {
        name: 'estatus',
        label: 'Estatus',
        align: 'left',
        sortable: true
      },
      {
        name: 'numero_empleado',
        label: 'No. Empleado',
        field: (row) => row.usuario.numero_empleado,
        align: 'left',
        sortable: true
      },
      {
        name: 'nombre',
        label: 'Nombre',
        field: (row) => row.usuario.nombre,
        align: 'left',
        sortable: true
      },
      {
        name: 'tipoSolicitud',
        label: 'Tipo',
        field: (row) => row.catalogo_tipo_solicitude.nombreSolicitud,
        align: 'center',
        sortable: true
      },
      {
        name: 'motivo',
        label: 'Motivo',
        field: (row) => row.catalogo_motivo?.nombreMotivo,
        align: 'center',
        sortable: true
      },
      {
        name: 'fecha',
        label: 'Fecha solicitud',
        field: (row) => formatearFecha(row.createdAt),
        align: 'center',
        sortable: true
      },
      {
        name: 'acciones',
        align: 'center'
      }
    ]

    const verDetalleSolicitud = (row) => {
      modalDetalle.value.abrir(row)
    }

    return {
      abrir,
      abrirModal,
      justificanteObj,
      columns,
      verDetalleSolicitud,
      modalDetalle,
      obtenerPropsQChip
    }
  },
}
</script>
