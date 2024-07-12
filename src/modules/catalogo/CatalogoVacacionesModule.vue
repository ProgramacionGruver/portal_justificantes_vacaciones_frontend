<template>
  <div class="q-pa-md">
    <h2>Catalogo de Vacaciones</h2>
    <q-separator color="primary" class="q-mb-lg"></q-separator>
    <q-table :columns="columns" :rows="catalogoVacaciones" :filter="buscar" :loading="cargando" no-data-label="No se encontró informacion disponible."
    loading-label="Buscando información. . . "  row-key="numero_empleado">
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
      <template v-slot:body-cell-aniosLaborados="props">
          <q-td>
            {{props.row.aniosLaborados}} años
          </q-td>
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
    <modal-catalogo-vacaciones ref="modalCatalogo"></modal-catalogo-vacaciones>
  </div>
</template>
<script>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useQuasar } from 'quasar'
import { useCatalogosStore } from 'src/stores/catalogos.js'
import { obtenerTextoSabados } from 'src/helpers/formatos'
import ModalCatalogoVacaciones from 'src/components/ModalCatalogoVacaciones.vue'

export default {
    components: {
      ModalCatalogoVacaciones
    },
    setup () {

      const useCatalogos = useCatalogosStore()
      const { obtenerCatalogoVacaciones, eliminarCatalogoVacaciones } = useCatalogos
      const { catalogoVacaciones, cargando } = storeToRefs(useCatalogos)

      const modalCatalogo = ref(null)
      const notificacionQuasar = useQuasar()

      const columns = [
        {
          name: "aniosLaborados",
          label: "Años laborados",
          align: "left",
          field: "aniosLaborados",
          sortable: true
        },
        {
          name: "sabadoLaborado",
          label: "Labora los sabados",
          align: "left",
          field: (row) => obtenerTextoSabados(row.sabadoLaborado),
          sortable: true
        },
        {
          name: "diasAsignados",
          label: "Dias Asignados",
          align: "left",
          field: "diasAsignados",
          sortable: true
        },
        {
          name: "semanas",
          label: "Semanas",
          align: "left",
          field: "semanas",
          sortable: true
        },
        {
          name: "acciones",
          align: "left",
        },
      ]

      onMounted(async () => {
        await obtenerCatalogoVacaciones()
      })

      const agregarCatalogo = () => {
        modalCatalogo.value.abrir()
      }

      const editarCatalogo = (catalogoObj) => {
        modalCatalogo.value.abrir(catalogoObj)
      }

      const eliminarCatalogo = (catalogoObj) => {
        notificacionQuasar
          .dialog({
            title: "¿Deseas eliminar el registro?",
            cancel: true,
            persistent: true,
            ok: "Eliminar",
          })
          .onOk(async () => {
            await eliminarCatalogoVacaciones(catalogoObj)
          })
          .onCancel(() => {})
      }

      return {
        buscar: ref(''),
        columns,
        cargando,
        catalogoVacaciones,
        agregarCatalogo,
        editarCatalogo,
        eliminarCatalogo,
        modalCatalogo,
      }
    }
  }
</script>
