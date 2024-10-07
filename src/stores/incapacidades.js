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
          const usuariosNomina = await apiUsuarios.post('/obtener/cargos/multiples', { claveEmpresa: incapacidadesObj.diasIncapacidadesNomina.claveEmpresa, claveSucursal: incapacidadesObj.diasIncapacidadesNomina.claveSucursal, clavePuestos: ['CONOM', 'AUXNOM'] })
          const correosDestinatarios = [ usuariosNomina.data[0]?.usuario?.correo, usuariosNomina.data[1]?.usuario?.correo]
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
          await enviarCorreoForm(incapacidadesObj.diasIncapacidadesNomina, incapacidadesObj.diasIncapacidadesNomina.urlDocumento, `Nueva Incapacidad`, correosDestinatarios?correosDestinatarios:['amagdaleno@gruver.mx'])
          incapacidades.value = [data, ...incapacidades.value]
          incapacidadesFiltrados.value = [data, ...incapacidadesFiltrados.value]
          notificacion('positive', 'Registro agregado exitosamente')
          return data
      } catch (error) {
          notificacion('negative', error.response.data.message)
      }finally{
          cargando.value = false
      }
    }

    const actualizarIncapacidades = async (incapacidadesObj) => {
      try {
          const usuariosNomina = await apiUsuarios.post('/obtener/cargos/multiples', { claveEmpresa: incapacidadesObj.diasIncapacidadesNomina.claveEmpresa, claveSucursal: incapacidadesObj.diasIncapacidadesNomina.claveSucursal, clavePuestos: ['CONOM', 'AUXNOM'] })
          const correosDestinatarios = [ usuariosNomina.data[0]?.usuario?.correo, usuariosNomina.data[1]?.usuario?.correo]
          cargando.value= true
          const formData = new FormData()
          formData.append('archivo', incapacidadesObj.archivo)
          formData.append('archivoSt7', incapacidadesObj.archivoSt7)
          formData.append('archivoSt2', incapacidadesObj.archivoSt2)
          formData.append('archivoSiaat', incapacidadesObj.archivoSiaat)
          formData.append('diasIncapacidades', JSON.stringify(incapacidadesObj.diasIncapacidades))
          formData.append('diasIncapacidadesNomina', JSON.stringify(incapacidadesObj.diasIncapacidadesNomina))
          const { data } = await api.post('/actualizar/incapacidades', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
          if(incapacidadesObj.archivoSt7?.name || incapacidadesObj.archivoSt2?.name || incapacidadesObj.archivoSiaat?.name){
            await enviarCorreoForm(incapacidadesObj.diasIncapacidadesNomina, incapacidadesObj.diasIncapacidadesNomina.urlDocumento, `Nuevo archivo seguimiento de Incapacidad`, correosDestinatarios?correosDestinatarios:['amagdaleno@gruver.mx'], true, incapacidadesObj.archivoSt7?.name, incapacidadesObj.archivoSt2?.name, incapacidadesObj.archivoSiaat?.name)
          }
          const index = incapacidades.value.findIndex(incapacidad => incapacidad.idIncapacidadNomina === incapacidadesObj.diasIncapacidadesNomina.idIncapacidadNomina)
          const indexFiltro = incapacidadesFiltrados.value.findIndex(incapacidad => incapacidad.idIncapacidadNomina === incapacidadesObj.diasIncapacidadesNomina.idIncapacidadNomina)
          incapacidades.value[index] = data
          incapacidadesFiltrados.value[indexFiltro] = data
          notificacion('positive', 'Registro actualizado exitosamente')
          return data
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

    const enviarCorreoForm = async (incapacidadObj, url, titulo, destinatarios, actualizar, archivoSt7, archivoSt2, archivoSiaat) => {
      try {
        await apiForm.post('/eventoCorreo', { correo: destinatarios, titulo: titulo, mensaje: mensajeCorreoIncapacidades(incapacidadObj, url, actualizar, archivoSt7, archivoSt2, archivoSiaat) })
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
