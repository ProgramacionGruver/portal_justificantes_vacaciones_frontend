<template>
  <q-dialog v-model="abrirModal">
    <q-card style="min-width: 70vw;">
      <q-card-section class="bg-primary text-white row items-center q-pb-none">
        <h2 class="text-h4">Agregar Días Ganados</h2>
        <q-space />
      </q-card-section>
      <div class="div--contenedor__general">
        <div style="display: block;">
          <label>Sábados 5s:</label>
            <div class="row">
              <q-radio v-model="diasGanadosObj.sabados5s" class="col-6" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" :val="true" label="SI" />
              <q-radio v-model="diasGanadosObj.sabados5s" class="col-6" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" :val="false" label="NO" />
            </div>
            <label v-if="!diasGanadosObj.sabados5s">Motivo:</label>
            <q-input
              v-if="!diasGanadosObj.sabados5s"
              dense
              class="q-mb-md"
              outlined
              v-model="diasGanadosObj.motivo"
              label="Escribe el motivo"
            />
            <label>Descripción:</label>
            <q-input
              dense
              class="q-mb-md"
              outlined
              autogrow
              v-model="diasGanadosObj.descripcionMotivo"
              label="Describe del motivo"
            />
            <label>Días Ganados:</label>
            <q-input
              ref="lista"
              dense
              outlined
              type="number"
              v-model="diasGanadosObj.diasGanados"
              label="Agrega los días ganados"
              :rules="[val => (val > 0) || 'LLena el este campo para continuar.']"
            />
        </div>
        <div style="display: block;">
            <div class="q-mb-md">
              <label>Agregar Colaboradores:</label>
              <div class="row">
                  <q-select
                    class="col-9"
                    outlined
                    clearable
                    use-input
                    input-debounce="0"
                    emit-value
                    map-options
                    option-value="value"
                    @filter="parametrosFiltradosColaboradores"
                    :options="opcionesEmpleados"
                    v-model="usuarioSeleccionado"
                    label="Buscar colaboradores"
                  />
                  <q-btn
                  class="col-2 q-ml-md"
                  flat
                  label="Agregar"
                  color="primary"
                  @click="agregarColaboradores()"
                />
              </div>
            </div>
            <q-scroll-area style="height: 25rem;" class="bg-grey-12">
              <div class="row q-pa-md" v-for="(usuarios, index) in listaUsuarios" :key="usuarios">
                <div class="col">{{ `${index+1}.- ${usuarios.nombre}`  }}</div>
                <q-input dense class="col q-mx-xs" label="Días ganados" outlined type="number" v-model="usuarios.diasGanados" :rules="[val => (val > 0) || 'LLena el este campo para continuar.']"></q-input>
                <q-btn flat dense color="negative" icon="delete" @click="eliminarColaboradores(index)"/>
              </div>
            </q-scroll-area>
        </div>
      </div>
      <q-card-section>
        <q-form ref="formulario" @submit.prevent="agregarDias">
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
import { useQuasar } from 'quasar'
import { filtradoBusquedaObj } from "src/helpers/filtradoBusquedaObj"
import { useColaboradoresStore } from 'src/stores/colaboradores'
import { useDiasGanadosStore } from "src/stores/diasGanados"
import { useAsistenciasStore } from "src/stores/asistencias"
import { useAutenticacionStore } from "src/stores/autenticaciones"

export default {
  setup() {
    const useColaboradores = useColaboradoresStore()
    const { opcionesColaboradores } = storeToRefs(useColaboradores)

    const useDiasGanados = useDiasGanadosStore()
    const { agregarDiasGanados } = useDiasGanados

    const useAutenticacion = useAutenticacionStore()
    const { usuarioAutenticado } = storeToRefs(useAutenticacion)

    const $q = useQuasar()
    const abrirModal = ref(false)
    const formulario = ref(null)
    const usuarioSeleccionado = ref(null)
    const listaUsuarios = ref([])
    const lista = ref(null)
    const opcionesEmpleados = ref(opcionesColaboradores.value)
    const objDiasGanados = ref(null)

    const diasGanadosObjInit = {
      motivo: "",
      descripcionMotivo : "",
      diasGanados: 1,
      sabados5s: true
    }

    const diasGanadosObj = ref(diasGanadosObjInit)

    const abrir = () => {
        objDiasGanados.value = null
        listaUsuarios.value = []
        usuarioSeleccionado.value = null
        diasGanadosObj.value = { ...diasGanadosObjInit }
        abrirModal.value = true
    }

    const agregarDias = async () => {
      if (!(await formulario.value.validate())) {
        return
      }
      if (!diasGanadosObj.value.descripcionMotivo) {
        $q.notify({
          type: 'negative',
          message: 'La descripción del motivo es obligatoria.',
        })
        return
      }
      if (listaUsuarios.value.length === 0) {
        $q.notify({
          type: 'negative',
          message: 'Debe agregar al menos un colaborador.',
        })
        return
      }
      if(diasGanadosObj.value.sabados5s){
        diasGanadosObj.value.motivo = 'Sabados 5s'
      }
      objDiasGanados.value = {
        diasArray:  listaUsuarios.value.map(usuario => ({
                      ...usuario,
                      motivo: diasGanadosObj.value.motivo,
                      descripcionMotivo: diasGanadosObj.value.descripcionMotivo,
                      editedBy: usuarioAutenticado.value.usuario
                    }))
      }
      await agregarDiasGanados(objDiasGanados.value)
      abrirModal.value = false
    }

    const agregarColaboradores = async() => {
      if (!(await lista.value.validate())) {
        return
      }
      if(usuarioSeleccionado.value){
        listaUsuarios.value = [...listaUsuarios.value, {...usuarioSeleccionado.value, diasGanados: diasGanadosObj.value.diasGanados}]
        usuarioSeleccionado.value = null
      }
    }

    const eliminarColaboradores = async(index) => {
      listaUsuarios.value.splice(index, 1)
    }

    const parametrosFiltradosColaboradores = (val, update) => {
      filtradoBusquedaObj(val, update, opcionesColaboradores.value, opcionesEmpleados)
    }


    return {
      abrir,
      abrirModal,
      formulario,
      diasGanadosObj,
      lista,
      listaUsuarios,
      opcionesEmpleados,
      usuarioSeleccionado,
      agregarDias,
      agregarColaboradores,
      eliminarColaboradores,
      parametrosFiltradosColaboradores
    }
  },
}
</script>
<style scoped>
.div--contenedor__general {
  display: grid;
  grid-template-columns: 0.5fr 1.5fr;
  column-gap: 1rem;
  margin: 1rem;
}
</style>
