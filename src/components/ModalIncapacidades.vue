<template>
  <q-dialog v-model="abrirModal">
    <q-card style="min-width: 50vw;">
      <q-card-section class="bg-primary text-white row items-center q-pb-none">
        <h2 class="text-h4">Agregar Incapacidades</h2>
        <q-space />
      </q-card-section>
      <q-form ref="formulario" @submit.prevent="agregarDias">
        <div class="div--contenedor__general">
          <div style="display: block;">
            <div class="q-ma-md ">
              <label>Agregar Colaborador:</label>
              <q-select
                dense
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
                :rules="[(val) => { return val !== null && val !== undefined && val !== '' ? true : 'Seleccione un usuario' }]"
              />
              <div class="row items-start q-col-gutter-sm">
                <div class="col-6">
                  <label>Folio:</label>
                  <q-input
                    dense
                    outlined
                    v-model="incapacidadesObj.folio"
                    label="Escribe el folio"
                    :rules="[(val) => { return val !== null && val !== undefined && val !== '' ? true : 'Escribe un folio' }]"
                  />
                </div>
                <div class="col-6">
                  <label>Motivo:</label>
                  <q-input
                    dense
                    outlined
                    v-model="incapacidadesObj.motivo"
                    label="Escribe el motivo"
                    :rules="[(val) => { return val !== null && val !== undefined && val !== '' ? true : 'Escribe un motivo' }]"
                  />
                </div>
              </div>
              <label>Descripción:</label>
              <q-input
                dense
                outlined
                autogrow
                v-model="incapacidadesObj.descripcionMotivo"
                label="Describe del motivo"
                :rules="[(val) => { return val !== null && val !== undefined && val !== '' ? true : 'Escribe una descripcion del motivo' }]"
              />
              <label>Días Incapacidad:</label>
              <div class="flex flex-center">
                    <q-date landscape multiple mask="YYYY-MM-DD" v-model="fechasSeleccionadas"
                      :locale="myLocale"></q-date>
              </div>
            </div>
          </div>
        </div>

      <q-card-section>

          <q-card-actions align="right">
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
      </q-card-section>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref } from "vue"
import { storeToRefs } from "pinia"
import { useQuasar } from 'quasar'
import { filtradoBusquedaObj } from "src/helpers/filtradoBusquedaObj"
import { useColaboradoresStore } from 'src/stores/colaboradores'
import { useIncapacidadesStore } from "src/stores/incapacidades"
import { useAutenticacionStore } from "src/stores/autenticaciones"

export default {
  setup() {
    const useColaboradores = useColaboradoresStore()
    const { opcionesColaboradores } = storeToRefs(useColaboradores)

    const useIncapacidades = useIncapacidadesStore()
    const { agregarIncapacidades } = useIncapacidades

    const useAutenticacion = useAutenticacionStore()
    const { usuarioAutenticado } = storeToRefs(useAutenticacion)

    const $q = useQuasar()
    const abrirModal = ref(false)
    const formulario = ref(null)
    const usuarioSeleccionado = ref(null)
    const fechasSeleccionadas = ref(null)
    const opcionesEmpleados = ref(opcionesColaboradores.value)
    const objIncapacidad = ref(null)

    const incapacidadesObjInit = {
      folio: "",
      motivo: "",
      descripcionMotivo : "",
      fechasIncapacidad: ""
    }

    const incapacidadesObj = ref(incapacidadesObjInit)

    const abrir = () => {
        objIncapacidad.value = null
        fechasSeleccionadas.value = null
        usuarioSeleccionado.value = null
        incapacidadesObj.value = { ...incapacidadesObjInit }
        abrirModal.value = true
    }

    const agregarDias = async () => {
      if (!(await formulario.value.validate())) {
        return
      }
      if (!fechasSeleccionadas.value) {
        $q.notify({
          type: 'negative',
          message: 'Seleccione al menos un dia.',
        })
        return
      }
      objIncapacidad.value = {
        diasArray:  fechasSeleccionadas.value.map(fecha => ({
                      fechaIncapacidad: fecha,
                      folio: incapacidadesObj.value.folio,
                      motivo: incapacidadesObj.value.motivo,
                      descripcionMotivo: incapacidadesObj.value.descripcionMotivo,
                      editedBy: usuarioAutenticado.value.nombre,
                      numero_empleado: usuarioSeleccionado.value.numero_empleado,
                      nombre: usuarioSeleccionado.value.nombre,
                      claveEmpresa: usuarioSeleccionado.value.claveEmpresa,
                      claveSucursal: usuarioSeleccionado.value.claveSucursal,
                      claveDepartamento: usuarioSeleccionado.value.claveDepartamento
                    }))
      }
      await agregarIncapacidades(objIncapacidad.value)
      abrirModal.value = false
    }

    const parametrosFiltradosColaboradores = (val, update) => {
      filtradoBusquedaObj(val, update, opcionesColaboradores.value, opcionesEmpleados)
    }


    return {
      abrir,
      abrirModal,
      formulario,
      incapacidadesObj,
      opcionesEmpleados,
      usuarioSeleccionado,
      fechasSeleccionadas,
      agregarDias,
      parametrosFiltradosColaboradores,
      myLocale: {
        /* starting with Sunday */
        days: 'Domingo_Lunes_Martes_Miércoles_Jueves_Viernes_Sábado'.split('_'),
        daysShort: 'Dom_Lun_Mar_Mié_Jue_Vie_Sáb'.split('_'),
        months: 'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split('_'),
        monthsShort: 'Ene_Feb_Mar_Abr_May_Jun_Jul_Ago_Sep_Oct_Nov_Dic'.split('_'),
        firstDayOfWeek: 1, // 0-6, 0 - Sunday, 1 Monday, ...
        format24h: true,
        pluralDay: 'dias'
      },
    }
  },
}
</script>
<style scoped>
.div--contenedor__general {
  display: grid;
  column-gap: 1rem;
  margin: 1rem;
}
</style>
