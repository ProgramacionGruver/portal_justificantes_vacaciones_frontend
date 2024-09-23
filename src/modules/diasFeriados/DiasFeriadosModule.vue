<template>
  <div class="q-pa-md">
    <h2>Días Feriados</h2>
    <q-separator color="primary" class="q-mb-lg"></q-separator>
    <q-table :columns="columns" :rows="diasFeriados" :filter="buscar" :loading="cargando" no-data-label="No se encontró informacion disponible."
    loading-label="Buscando información. . . "  row-key="idDiaFeriado">
    <template v-slot:top-right="props">
        <q-input borderless dense debounce="300" v-model="buscar" placeholder="Buscar">
          <template v-slot:append>
            <q-icon color="primary" name="search" />
          </template>
        </q-input>
        <q-btn flat round color="primary" dense :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
          @click="props.toggleFullscreen" class="q-ml-md" />
      </template>
      <template v-slot:top-left>
        <q-btn class="q-pl-md" dense color="primary" icon-right="playlist_add" label="Agregar"
        @click="agregarCatalogo" />
      </template>
      <template v-slot:body-cell-acciones="props">
          <q-td>
            <q-btn flat color="primary" icon="edit" @click="editarCatalogo(props.row)">
              <q-tooltip>
                Editar
              </q-tooltip>
            </q-btn>
            <q-btn flat color="negative" icon="delete" @click="eliminarCatalogo(props.row)">
              <q-tooltip>
                Eliminar
              </q-tooltip>
            </q-btn>
          </q-td>
        </template>
    </q-table>
    <modal-dias-feriados ref="modalCatalogo"></modal-dias-feriados>
  </div>
</template>
<script>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useQuasar } from 'quasar'
import { useDiasFeriadosStore } from 'src/stores/diasFeriados'
import ModalDiasFeriados from 'src/components/ModalDiasFeriados.vue'

export default {
    components: {
      ModalDiasFeriados
    },
    setup () {

      const useDiasFeriados = useDiasFeriadosStore()
      const { obtenerDiasFeriados, eliminarDiasFeriados } = useDiasFeriados
      const { diasFeriados, cargando } = storeToRefs(useDiasFeriados)

      const modalCatalogo = ref(null)
      const notificacionQuasar = useQuasar()

      const columns = [
        {
          name: "idDiaFeriado",
          label: "ID",
          align: "left",
          field: "idDiaFeriado",
          sortable: true
        },
        {
          name: "nombre",
          label: "Nombre evento",
          align: "left",
          field: "nombre",
          sortable: true
        },
        {
          name: "fecha",
          label: "Fecha",
          align: "left",
          field: "fecha",
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
          name: "acciones",
          align: "left",
        },
      ]

      onMounted(async () => {
        await obtenerDiasFeriados()
      })

      const agregarCatalogo = () => {
        modalCatalogo.value.abrir()
      }

      const editarCatalogo = (diaFeriadoObj) => {
        modalCatalogo.value.abrir(diaFeriadoObj)
      }

      const eliminarCatalogo = (diaFeriadoObj) => {
        notificacionQuasar
          .dialog({
            title: "¿Deseas eliminar el registro?",
            cancel: true,
            persistent: true,
            ok: "Eliminar",
          })
          .onOk(async () => {
            await eliminarDiasFeriados(diaFeriadoObj)
          })
          .onCancel(() => {})
      }

      return {
        buscar: ref(''),
        columns,
        cargando,
        diasFeriados,
        agregarCatalogo,
        editarCatalogo,
        eliminarCatalogo,
        modalCatalogo,
      }
    }
  }
</script>
