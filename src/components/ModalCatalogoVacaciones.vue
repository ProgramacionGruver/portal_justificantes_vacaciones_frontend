<template>
  <q-dialog v-model="abrirModal">
    <q-card class="full-width">
      <q-card-section class="bg-primary text-white row items-center q-pb-none">
        <h2 class="text-h4">Agregar Registro Vacaciones</h2>
        <q-space />
      </q-card-section>
      <q-card-section>
        <q-form ref="formulario">

          <div class="q-gutter-x-sm row">
            <div class="q-my-xs col">
              <label>Años Laborados</label>
              <q-input
                      outlined
                      type="number"
                      v-model="catalagoObj.aniosLaborados"
              />
            </div>
            <div class="q-my-xs col">
              <label>Labora los sabados</label>
              <q-select
                    filled
                    map-options
                    emit-value
                    option-value="value"
                    :options="opcionesSabados"
                    v-model="catalagoObj.sabadoLaborado"
              />
            </div>
          </div>

          <div class="q-gutter-x-sm row">
            <div class="q-my-xs col">
              <label>Dias Asignados</label>
              <q-input
                outlined
                type="number"
                v-model="catalagoObj.diasAsignados"
              />
            </div>
            <div class="q-my-xs col">
              <label>Semanas</label>
              <q-input
                outlined
                type="number"
                v-model="catalagoObj.semanas"
              />
            </div>
          </div>

          <q-card-actions class="q-pt-md" align="right">
            <q-btn
              icon-right="close"
              flat
              label="Cancelar"
              text-color="dark"
              color="gris"
              v-close-popup
            />
            <q-btn
              v-if="!edicion"
              icon-right="save"
              type="submit"
              label="Guardar"
              color="primary"
              @click="guardarCatalogo"
            />
            <q-btn
              v-if="edicion"
              icon-right="save"
              type="submit"
              label="Actualizar"
              color="primary"
              @click="editarCatalogo"
            />
          </q-card-actions>

        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref } from "vue"
import { useCatalogosStore } from "src/stores/catalogos"

export default {
  setup() {
    const abrirModal = ref(false)
    const formulario = ref(null)
    const edicion = ref(false)
    const opcionesSabados = [
      {label: 'Si', value: true},
      {label: 'No', value: false}
    ]

    const useCatalogos = useCatalogosStore()
    const { agregarCatalogoVacaciones, editarCatalogoVacaciones } = useCatalogos

    const catalagoInit = {
      aniosLaborados: 1,
      sabadoLaborado: true,
      semanas: 1,
      diasAsignados: 1,
    }

    const catalagoObj = ref(catalagoInit)

    const abrir = (catalagoEdicion) => {
      if (catalagoEdicion) {
        edicion.value = true
        catalagoObj.value = { ...catalagoEdicion }
      } else {
        edicion.value = false
        catalagoObj.value = { ...catalagoInit }
      }
      abrirModal.value = true
    }

    const guardarCatalogo = async () => {
      if (!(await formulario.value.validate())) {
        return
      }
      await agregarCatalogoVacaciones(catalagoObj.value)
      abrirModal.value = false
    }

    const editarCatalogo = async () => {
      if (!(await formulario.value.validate())) {
        return
      }
      await editarCatalogoVacaciones(catalagoObj.value)
      abrirModal.value = false
    }

    return {
      abrir,
      abrirModal,
      formulario,
      catalagoObj,
      edicion,
      guardarCatalogo,
      editarCatalogo,
      opcionesSabados
    }
  },
}
</script>
