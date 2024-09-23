<template>
  <q-dialog v-model="abrirModal">
    <q-card class="full-width">
      <q-card-section class="bg-primary text-white row items-center q-pb-none">
        <h2 class="text-h4">Agregar Día Feriado</h2>
        <q-space />
      </q-card-section>
      <q-card-section>
        <q-form ref="formulario">

          <div class="q-gutter-x-sm row">
            <div class="q-my-xs col">
              <label>Nombre Evento</label>
              <q-input
                      outlined
                      autogrow
                      v-model="diaFeriadoObj.nombre"
              />
            </div>
          </div>

          <div class="q-gutter-x-sm row">
            <div class="q-my-xs col">
              <label>Fecha Evento</label>
              <q-input
                outlined
                type="date"
                v-model="diaFeriadoObj.fecha"
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
              @click="guardarDia"
            />
            <q-btn
              v-if="edicion"
              icon-right="save"
              type="submit"
              label="Actualizar"
              color="primary"
              @click="editarDia"
            />
          </q-card-actions>

        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref } from "vue"
import { storeToRefs } from "pinia"
import { useDiasFeriadosStore } from "src/stores/diasFeriados"
import { useAutenticacionStore } from "src/stores/autenticaciones"

export default {
  setup() {
    const abrirModal = ref(false)
    const formulario = ref(null)
    const edicion = ref(false)

    const useDiasFeriados = useDiasFeriadosStore()
    const { agregarDiasFeriados, editarDiasFeriados } = useDiasFeriados

    const useAutenticacion = useAutenticacionStore()
    const { usuarioAutenticado } =storeToRefs(useAutenticacion)

    const catalagoInit = {
      nombre: "",
      fecha: "",
      editedBy: usuarioAutenticado.value.nombre
    }

    const diaFeriadoObj = ref(catalagoInit)

    const abrir = (catalagoEdicion) => {
      if (catalagoEdicion) {
        edicion.value = true
        diaFeriadoObj.value = { ...catalagoEdicion }
      } else {
        edicion.value = false
        diaFeriadoObj.value = { ...catalagoInit }
      }
      abrirModal.value = true
    }

    const guardarDia = async () => {
      if (!(await formulario.value.validate())) {
        return
      }
      await agregarDiasFeriados(diaFeriadoObj.value)
      abrirModal.value = false
    }

    const editarDia = async () => {
      if (!(await formulario.value.validate())) {
        return
      }
      await editarDiasFeriados(diaFeriadoObj.value)
      abrirModal.value = false
    }

    return {
      abrir,
      abrirModal,
      formulario,
      diaFeriadoObj,
      edicion,
      guardarDia,
      editarDia
    }
  },
}
</script>
