import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { apiForm } from 'src/boot/axiosForm'
import { apiUsuarios } from 'src/boot/axiosUsuarios'
import { ref } from 'vue'
import { notificacion } from 'src/helpers/mensajes'
import { mensajeCorreoIncapacidades } from 'src/helpers/correos'

export const useIncapacidadesStore = defineStore("incapacidades", () => {
    const incapacidades = ref([])
    const incapacidadesFiltrados = ref([])
    const cargando = ref(false)
    const ramosSeleccionados = ref([])
    const riesgosSeleccionados = ref([])
    const tiposRamoSeleccionados = ref([])
    const tiposRiesgoSeleccionados = ref([])
    const todosTipoRamoSeleccionados = ref(true)
    const todosTipoRiesgoSeleccionados = ref(true)

    const obtenerIncapacidades = async (incapacidadesObj) => {
        try {
            cargando.value= true
            const { data } = await api.post('obtener/incapacidades', incapacidadesObj)
            incapacidades.value = data
            incapacidadesFiltrados.value = data
        } catch (error) {
          notificacion('negative', error.response.data.message)
        }finally{
            cargando.value = false
        }
    }

    const agregarIncapacidades = async (incapacidadesObj) => {
      try {
          const usuarioNomina = await apiUsuarios.post('/obtener/cargos', { claveEmpresa: incapacidadesObj.diasIncapacidadesNomina.claveEmpresa, claveSucursal: incapacidadesObj.diasIncapacidadesNomina.claveSucursal, clavePuesto: 'CONOM' })
          cargando.value= true
          const formData = new FormData()
          formData.append('archivo', incapacidadesObj.archivo)
          formData.append('archivoSt7', incapacidadesObj.archivoSt7)
          formData.append('archivoSt2', incapacidadesObj.archivoSt2)
          formData.append('archivoSiaat', incapacidadesObj.archivoSiaat)
          formData.append('diasIncapacidades', JSON.stringify(incapacidadesObj.diasIncapacidades))
          formData.append('diasIncapacidadesNomina', JSON.stringify(incapacidadesObj.diasIncapacidadesNomina))
          const { data } = await api.post('agregar/incapacidades', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
          await enviarCorreoForm(incapacidadesObj.diasIncapacidadesNomina, incapacidadesObj.diasIncapacidadesNomina.urlDocumento, `Nueva Incapacidad`, usuarioNomina.data[0]?.usuario?.correo?usuarioNomina.data[0]?.usuario?.correo:['amagdaleno@gruver.mx'])
          incapacidades.value = [data, ...incapacidades.value]
          incapacidadesFiltrados.value = [data, ...incapacidadesFiltrados.value]
          notificacion('positive', 'Registro agregado exitosamente')
      } catch (error) {
          notificacion('negative', error.response.data.message)
      }finally{
          cargando.value = false
      }
    }

    const actualizarIncapacidades = async (incapacidadesObj) => {
      try {
          cargando.value= true
          const formData = new FormData()
          formData.append('archivo', incapacidadesObj.archivo)
          formData.append('archivoSt7', incapacidadesObj.archivoSt7)
          formData.append('archivoSt2', incapacidadesObj.archivoSt2)
          formData.append('archivoSiaat', incapacidadesObj.archivoSiaat)
          formData.append('diasIncapacidades', JSON.stringify(incapacidadesObj.diasIncapacidades))
          formData.append('diasIncapacidadesNomina', JSON.stringify(incapacidadesObj.incapacidadesObj))
          const { data } = await api.post('/actualizar/incapacidades', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
          const index = incapacidades.value.findIndex(incapacidad => incapacidad.idIncapacidadNomina === incapacidadesObj.diasIncapacidadesNomina.idIncapacidadNomina)
          const indexFiltro = incapacidadesFiltrados.value.findIndex(incapacidad => incapacidad.idIncapacidadNomina === incapacidadesObj.diasIncapacidadesNomina.idIncapacidadNomina)
          incapacidades.value[index] = data
          incapacidadesFiltrados.value[indexFiltro] = data
          notificacion('positive', 'Registro actualizado exitosamente')
      } catch (error) {
          notificacion('negative', error.response.data.message)
      }finally{
          cargando.value = false
      }
    }

    const actualizarEstatusIncapacidades = async (incapacidadesObj) => {
      try {
          cargando.value= true
          const { data } = await api.post('actualizar/estatus/incapacidades',incapacidadesObj)
          const index = incapacidades.value.findIndex(incapacidad => incapacidad.idIncapacidadNomina === incapacidadesObj.idIncapacidadNomina)
          const indexFiltro = incapacidadesFiltrados.value.findIndex(incapacidad => incapacidad.idIncapacidadNomina === incapacidadesObj.idIncapacidadNomina)
          incapacidades.value[index] = data
          incapacidadesFiltrados.value[indexFiltro] = data
          notificacion('positive', 'Registro actualizado exitosamente')
      } catch (error) {
          notificacion('negative', error.response.data.message)
      }finally{
          cargando.value = false
      }
    }

    const enviarCorreoForm = async (incapacidadObj, url, titulo, destinatarios) => {
      try {
        await apiForm.post('/eventoCorreo', { correo: destinatarios, titulo: titulo, mensaje: mensajeCorreoIncapacidades(incapacidadObj, url) })
      } catch (error) {
        notificacion('negative', 'Error al enviar el correo')
      }
    }

    return {
        incapacidades,
        incapacidadesFiltrados,
        cargando,
        ramosSeleccionados,
        riesgosSeleccionados,
        tiposRamoSeleccionados,
        tiposRiesgoSeleccionados,
        todosTipoRamoSeleccionados,
        todosTipoRiesgoSeleccionados,
        obtenerIncapacidades,
        agregarIncapacidades,
        actualizarIncapacidades,
        actualizarEstatusIncapacidades
    }
})
