import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { apiUsuarios } from 'src/boot/axiosUsuarios'
import { ref } from 'vue'
import { notificacion } from 'src/helpers/mensajes'
import { apiForm } from 'src/boot/axiosForm'
import { ID_FORM_JUSTIFICANTES_VACACIONES } from 'src/constant/servidor'
import { mensajeCorreoAutorizacionJustificantesVacaciones } from 'src/helpers/correos'

export const useJustificantesVacacionesStore = defineStore('justificantesVacaciones', () => {
  const todosUsuarios = ref([])
  const todosUsuariosFiltrados = ref([])
  const todosEstatus = ref([])
  const todosEstatusFiltrados = ref([])
  const todosMotivos = ref([])
  const todosMotivosFiltrados = ref([])
  const motivosSeleccionados = ref([])
  const todosMotivosSeleccionados = ref(true)
  const listaIdsMotivos = ref([])
  const todosTipoSolicitudes = ref([])
  const todosTipoSolicitudesFiltrados = ref([])
  const tiposSolicitudSeleccionados = ref([])
  const todosTipoSolicitudesSeleccionados = ref(true)
  const listaIdsTipoSolicitudes = ref([])
  const detalleUsuario = ref([])
  const detalleJefeDirecto = ref([])
  const todasSolicitudesEmpleado = ref([])
  const historialSolicitudes = ref([])
  const historialSolicitudesFiltradas = ref([])
  const cargandoMisSolicitudes = ref(false)
  const cargandoHistorialSolicitudes = ref(false)
  const cargandoEnvioSolicitud = ref(false)

  const detalleVacacionesDiasEconomicos = ref(null)

  const urlForm = ref('')

  const obtenerUsuarios = async () => {
    try {
      const { data } = await api.get('/obtenerUsuarios')
      todosUsuarios.value = [...data]
      todosUsuariosFiltrados.value = data.map(usuario => {
        return { label: `${usuario.numero_empleado}-${usuario.nombre}-${usuario.siglasCentroTrabajo}`, value: usuario }
      })
    } catch (error) {
      notificacion('negative', error.response.data.message)
    }
  }

  const obtenerEstatus = async () => {
    try {
      const { data } = await api.get('/obtenerEstatus')
      todosEstatus.value = [...data]
      todosEstatusFiltrados.value = data.map(estatus => {
        return { label: estatus.nombreEstatus, value: estatus.idEstatusSolicitud }
      })
    } catch (error) {
      notificacion('negative', error.response.data.message)
    }
  }

  const obtenerMotivos = async () => {
    try {
      const { data } = await api.get('/obtenerMotivos')
      todosMotivos.value = [...data]
      todosMotivosFiltrados.value = data.map(motivo => {
        return { label: motivo.nombreMotivo, value: motivo.idMotivo }
      })
      listaIdsMotivos.value = todosMotivosFiltrados.value.map(motivo => { return motivo.value })
    } catch (error) {
      notificacion('negative', error.response.data.message)
    }
  }

  const obtenerTipoSolicitudes = async () => {
    try {
      const { data } = await api.get('/obtenerTipoSolicitudes')
      todosTipoSolicitudes.value = [...data]
      todosTipoSolicitudesFiltrados.value = data.map(tipo => {
        return { label: tipo.nombreSolicitud, value: tipo.idTipoSolicitud }
      })
      listaIdsTipoSolicitudes.value = todosTipoSolicitudesFiltrados.value.map(tipoSolicitud => { return tipoSolicitud.value })
    } catch (error) {
      notificacion('negative', error.response.data.message)
    }
  }

  const obtenerDetalleVacacionesDiasEconomicos = async (numero_empleado) => {
    try {
      const { data } = await api.get(`/obtenerDetalleVacacionesDiasEconomicos/${numero_empleado}`)
      detalleVacacionesDiasEconomicos.value = { ...data }
    } catch (error) {
      notificacion('negative', error.response.data.message)
    }
  }

  const obtenerDetalleEmpleadoYJefeDirecto = async (numero_empleado) => {
    try {
      const { data: { detalleEmpleado, detalleJefe } } = await api.get(`/obtenerDetalleEmpleadoYJefeDirecto/${numero_empleado}`)
      detalleUsuario.value = detalleEmpleado
      detalleJefeDirecto.value = detalleJefe
    } catch (error) {
      notificacion('negative', error.response.data.message)
    }
  }

  const obtenerSolicitudesPorEmpleado = async (numero_empleado) => {
    try {
      cargandoMisSolicitudes.value = true
      const { data } = await api.get(`/obtenerSolicitudesPorEmpleado/${numero_empleado}`)
      todasSolicitudesEmpleado.value = data
    } catch (error) {
      notificacion('negative', error.response.data.message)
    } finally {
      cargandoMisSolicitudes.value = false
    }
  }

  const obtenerTodasSolicitudes = async () => {
    try {
      cargandoHistorialSolicitudes.value = true
      const { data } = await api.get('/obtenerTodasSolicitudes')
      historialSolicitudes.value = data
    } catch (error) {
      notificacion('negative', error.response.data.message)
    } finally {
      cargandoHistorialSolicitudes.value = false
    }
  }

  const obtenerUsuariosAutorizan = async (centroTrabajoDepartamentoObj) => {
    try {
      const { data } = await apiUsuarios.post('/obtenerUsuariosAutorizacion', centroTrabajoDepartamentoObj)
      return data
    } catch (error) {
      notificacion('negative', 'Error al obtener usuarios autorizan: ' + error.response.data.message)
    }
  }

  const solicitarAusenciasYRetardos = async (solicitudObj, destinatario) => {
    try {
      cargandoEnvioSolicitud.value = true
      const usuariosAutorizan = await obtenerUsuariosAutorizan({ centroTrabajo: detalleUsuario.value.centroTrabajo, departamento: detalleUsuario.value.departamento })
      const usuariosAutorizanObj = {
        primeraAutorizacion: detalleJefeDirecto.value,
        segundaAutorizacion: solicitudObj.claveEmpresa === 'MB' ? usuariosAutorizan.obtenerGerenteAdministrativo : usuariosAutorizan.obtenerRevisaRH
      }
      solicitudObj.usuariosAutorizan = usuariosAutorizanObj

      const { data } = await api.post('/solicitarAusenciasYRetardos', solicitudObj)
      todasSolicitudesEmpleado.value.unshift(data)

      const eventoObj = {
        nombreEvento: `-${data.folio}_1`,
        formulario: ID_FORM_JUSTIFICANTES_VACACIONES
      }

      await crearEventoForm(eventoObj)

      await enviarCorreoForm(data, urlForm.value, `Autorización de ${data.catalogo_tipo_solicitude.nombreSolicitud}`, [destinatario])

      notificacion('positive', 'Solicitud generada exitosamente')
    } catch (error) {
      notificacion('negative', error.response?.data.message)
    } finally {
      cargandoEnvioSolicitud.value = false
      urlForm.value = ''
    }
  }

  const solicitarVacaciones = async (solicitudObj, destinatario) => {
    try {
      cargandoEnvioSolicitud.value = true
      const usuariosAutorizan = await obtenerUsuariosAutorizan({ centroTrabajo: detalleUsuario.value.centroTrabajo, departamento: detalleUsuario.value.departamento })
      const usuariosAutorizanObj = {
        primeraAutorizacion: detalleJefeDirecto.value,
        segundaAutorizacion: solicitudObj.claveEmpresa === 'MB' ? usuariosAutorizan.obtenerGerenteAdministrativo : usuariosAutorizan.obtenerRevisaRH
      }
      solicitudObj.usuariosAutorizan = usuariosAutorizanObj
      const { data } = await api.post('/solicitarVacaciones', solicitudObj)
      todasSolicitudesEmpleado.value.unshift(data)

      const eventoObj = {
        nombreEvento: `-${data.folio}_1`,
        formulario: ID_FORM_JUSTIFICANTES_VACACIONES
      }

      await crearEventoForm(eventoObj)

      await enviarCorreoForm(data, urlForm.value, `Autorización de ${data.catalogo_tipo_solicitude.nombreSolicitud}`, [destinatario])

      notificacion('positive', 'Solicitud generada exitosamente')
    } catch (error) {
      notificacion('negative', error.response.data.message)
    } finally {
      cargandoEnvioSolicitud.value = false
    }
  }

  const solicitarDiasEconomicos = async (solicitudObj, destinatario) => {
    try {
      cargandoEnvioSolicitud.value = true
      const usuariosAutorizan = await obtenerUsuariosAutorizan({ centroTrabajo: detalleUsuario.value.centroTrabajo, departamento: detalleUsuario.value.departamento })
      const usuariosAutorizanObj = {
        primeraAutorizacion: detalleJefeDirecto.value,
        segundaAutorizacion: solicitudObj.claveEmpresa === 'MB' ? usuariosAutorizan.obtenerGerenteAdministrativo : usuariosAutorizan.obtenerRevisaRH
      }
      solicitudObj.usuariosAutorizan = usuariosAutorizanObj
      const { data } = await api.post('/solicitarDiasEconomicos', solicitudObj)
      todasSolicitudesEmpleado.value.unshift(data)

      const eventoObj = {
        nombreEvento: `-${data.folio}_1`,
        formulario: ID_FORM_JUSTIFICANTES_VACACIONES
      }

      await crearEventoForm(eventoObj)

      await enviarCorreoForm(data, urlForm.value, `Autorización de ${data.catalogo_tipo_solicitude.nombreSolicitud}`, [destinatario])

      notificacion('positive', 'Solicitud generada exitosamente')
    } catch (error) {
      notificacion('negative', error.response.data.message)
    } finally {
      cargandoEnvioSolicitud.value = false
    }
  }

  const crearEventoForm = async (eventoObj) => {
    try {
      const { data } = await apiForm.post('/generarEventoAutorizacion', eventoObj)
      urlForm.value = data.url
    } catch (error) {
      notificacion('negative', error.response.data.message)
      urlForm.value = ''
    }
  }

  const enviarCorreoForm = async (solicitudObj, url, titulo, destinatarios) => {
    try {
      await apiForm.post('/eventoCorreo', { correo: destinatarios, titulo: titulo, mensaje: mensajeCorreoAutorizacionJustificantesVacaciones(solicitudObj, url) })
    } catch (error) {
      notificacion('negative', 'Error al enviar el correo')
      console.error(error)
      urlForm.value = ''
    }
  }

  return {
    todosUsuarios,
    todosUsuariosFiltrados,
    todosEstatus,
    todosEstatusFiltrados,
    todosMotivos,
    todosMotivosFiltrados,
    motivosSeleccionados,
    todosMotivosSeleccionados,
    listaIdsMotivos,
    todosTipoSolicitudes,
    todosTipoSolicitudesFiltrados,
    tiposSolicitudSeleccionados,
    todosTipoSolicitudesSeleccionados,
    listaIdsTipoSolicitudes,
    detalleVacacionesDiasEconomicos,
    detalleUsuario,
    detalleJefeDirecto,
    todasSolicitudesEmpleado,
    historialSolicitudes,
    historialSolicitudesFiltradas,
    cargandoMisSolicitudes,
    cargandoHistorialSolicitudes,
    cargandoEnvioSolicitud,
    urlForm,
    obtenerUsuarios,
    obtenerEstatus,
    obtenerMotivos,
    obtenerTipoSolicitudes,
    obtenerSolicitudesPorEmpleado,
    obtenerTodasSolicitudes,
    obtenerDetalleVacacionesDiasEconomicos,
    obtenerDetalleEmpleadoYJefeDirecto,
    obtenerUsuariosAutorizan,
    solicitarAusenciasYRetardos,
    solicitarVacaciones,
    solicitarDiasEconomicos,
  }
})
