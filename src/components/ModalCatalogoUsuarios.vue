<template>
  <q-dialog v-model="abrirModal">
    <q-card class="full-width">
      <q-card-section class="bg-primary text-white row items-center q-pb-none">
        <h2 class="text-h4">Editar Usuarios</h2>
        <q-space />
      </q-card-section>
      <q-card-section>
        <q-form ref="formulario">

          <div class="q-px-md q-pt-xs">
                <q-tabs
                          v-model="tab"
                          dense
                          borderless
                          class="text-grey"
                          active-color="primary"
                          indicator-color="primary"
                          align="justify"
                        >
                          <q-tab name="turnos" label="Turnos" />
                          <q-tab name="dias" label="Días" />
                </q-tabs>
          </div>
          <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="turnos">
                <div class="q-gutter-x-sm row">
                    <div class="q-my-xs col">
                      <label>Turno Lunes-Viernes</label>
                      <q-select
                            filled
                            map-options
                            emit-value
                            option-value="turno"
                            :options="opcionesTurnos"
                            v-model="catalagoObj.turnoLunesViernes"
                      />
                    </div>
                    <div class="q-my-xs col">
                      <label>Turno Sabados</label>
                      <q-select
                            filled
                            map-options
                            emit-value
                            option-value="turno"
                            :options="opcionesTurnos"
                            v-model="catalagoObj.turnoSabados"
                      />
                    </div>
                  </div>
            </q-tab-panel>
            <q-tab-panel v-if="actualizar" name="dias">
                <div class="q-gutter-x-sm row">
                    <div class="q-my-xs col">
                      <label>Días Vacaciones Restantes</label>
                      <q-input
                            filled
                            type="number"
                            v-model="catalagoObj.diasVacacionesRestantes"
                      />
                    </div>
                    <div class="q-my-xs col">
                      <label>Días Economicos Restantes</label>
                      <q-input
                            filled
                            type="number"
                            v-model="catalagoObj.diasEconomicosRestantes"
                      />
                    </div>
                </div>
                <div class="q-gutter-x-sm row">
                  <div class="q-my-xs col">
                      <label>Días Vacaciones Vencidas</label>
                      <q-input
                            filled
                            type="number"
                            v-model="catalagoObj.vacacionesVencidas"
                      />
                    </div>
                    <div class="q-my-xs col">
                      <label>Días Vencidos Restantes</label>
                      <q-input
                            filled
                            type="number"
                            v-model="catalagoObj.vacacionesVencidasRestantes"
                      />
                    </div>
                </div>
                <div class="q-gutter-x-sm row">
                  <div class="q-my-xs col">
                      <label>Días Ganados</label>
                      <q-input
                            filled
                            type="number"
                            v-model="catalagoObj.diasGanados"
                      />
                    </div>
                    <div class="q-my-xs col">
                      <label>Sabados 5s</label>
                      <q-input
                            filled
                            type="number"
                            v-model="catalagoObj.sabados5s"
                      />
                    </div>
                </div>
            </q-tab-panel>
          </q-tab-panels>



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
              icon-right="save"
              type="submit"
              label="Guardar"
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
import { storeToRefs } from "pinia"
import { useCatalogosStore } from "src/stores/catalogos"
import { useAutenticacionStore } from "src/stores/autenticaciones"

export default {
  setup() {
    const abrirModal = ref(false)
    const formulario = ref(null)

    const useCatalogos = useCatalogosStore()
    const { editarCatalogoUsuarios } = useCatalogos
    const { opcionesTurnos } = storeToRefs(useCatalogos)

    const useAutenticacion = useAutenticacionStore()
    const { usuarioAutenticado } = storeToRefs(useAutenticacion)

    const catalagoObj = ref([])
    const tab = ref('turnos')

    const modulo = ref({})
    const agregar = ref(false)
    const actualizar = ref(false)
    const eliminar = ref(false)
    const leer = ref(false)

    const abrir = (catalago) => {
        tab.value = 'turnos'
        catalagoObj.value = { ...catalago }
        abrirModal.value = true
        modulo.value = usuarioAutenticado.value.modulos.find(modulo => modulo.idModulo === 68)
        agregar.value = modulo.value.agregar
        actualizar.value = modulo.value.actualizar
        eliminar.value = modulo.value.eliminar
        leer.value = modulo.value.leer
    }

    const editarCatalogo = async () => {
      if (!(await formulario.value.validate())) {
        return
      }
      await editarCatalogoUsuarios(catalagoObj.value)
      abrirModal.value = false
    }

    return {
      abrir,
      abrirModal,
      formulario,
      catalagoObj,
      opcionesTurnos,
      tab,
      editarCatalogo,
      agregar,
      actualizar,
      eliminar,
      leer
    }
  },
}
</script>
