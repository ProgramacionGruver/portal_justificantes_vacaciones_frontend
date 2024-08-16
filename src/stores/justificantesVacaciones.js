import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { apiUsuarios } from 'src/boot/axiosUsuarios'
import { ref } from 'vue'
import { notificacion } from 'src/helpers/mensajes'
import { apiForm } from 'src/boot/axiosForm'
import { ID_FORM_JUSTIFICANTES_VACACIONES } from 'src/constant/servidor'
import { mensajeCorreoAutorizacionJustificantesVacaciones } from 'src/helpers/correos'

export const useJustificantesVacacionesStore = defineStore('justificantesVacaciones', () => {
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
  const todasProrrogasEmpleado = ref([])
  const historialSolicitudes = ref([])
  const historialSolicitudesFiltradas = ref([])
  const cargandoMisSolicitudes = ref(false)
  const cargandoHistorialSolicitudes = ref(false)
  const cargandoEnvioSolicitud = ref(false)

  const usuarioSeleccionado = ref(null)
  const emailJefeDirecto = ref('')
  const emailJefeIncorrecto = ref(false)

  const detalleVacacionesDiasEconomicos = ref(null)

  const urlForm = ref('')

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

  const obtenerProrrogasPorEmpleado = async (numero_empleado) => {
    try {
      cargandoMisSolicitudes.value = true
      const { data } = await api.get(`/obtenerProrrogasPorEmpleado/${numero_empleado}`)
      todasProrrogasEmpleado.value = data
    } catch (error) {
      notificacion('negative', error.response.data.message)
    } finally {
      cargandoMisSolicitudes.value = false
    }
  }

  const obtenerTodasSolicitudes = async (objBusqueda) => {
    try {
      cargandoHistorialSolicitudes.value = true
      const { data } = await api.post('/obtenerTodasSolicitudes', objBusqueda)
      historialSolicitudes.value = data
      historialSolicitudesFiltradas.value = data
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

  const solicitarAusenciasYRetardos = async (solicitudObj) => {
    try {
      cargandoEnvioSolicitud.value = true
      const usuariosAutorizanObj = {
        primeraAutorizacion: emailJefeIncorrecto.value === true ? usuarioSeleccionado.value : detalleJefeDirecto.value,
      }
      solicitudObj.usuariosAutorizan = usuariosAutorizanObj

      const { data } = await api.post('/solicitarAusenciasYRetardos', solicitudObj)
      todasSolicitudesEmpleado.value.unshift(data)

      const eventoObj = {
        nombreEvento: `-${data.folio}_1`,
        formulario: ID_FORM_JUSTIFICANTES_VACACIONES
      }

      await crearEventoForm(eventoObj)

      await enviarCorreoForm(data, urlForm.value, `Autorización de ${data.catalogo_tipo_solicitude.nombreSolicitud}`, [emailJefeDirecto.value])

      notificacion('positive', 'Solicitud generada exitosamente')
    } catch (error) {
      notificacion('negative', error.response?.data.message)
    } finally {
      cargandoEnvioSolicitud.value = false
      urlForm.value = ''
    }
  }

  const solicitarVacaciones = async (solicitudObj) => {
    try {
      cargandoEnvioSolicitud.value = true
      const usuariosAutorizanObj = {
        primeraAutorizacion: emailJefeIncorrecto.value === true ? usuarioSeleccionado.value : detalleJefeDirecto.value,
      }
      solicitudObj.usuariosAutorizan = usuariosAutorizanObj
      const { data } = await api.post('/solicitarVacaciones', solicitudObj)
      todasSolicitudesEmpleado.value.unshift(data)

      const eventoObj = {
        nombreEvento: `-${data.folio}_1`,
        formulario: ID_FORM_JUSTIFICANTES_VACACIONES
      }

      await crearEventoForm(eventoObj)

      await enviarCorreoForm(data, urlForm.value, `Autorización de ${data.catalogo_tipo_solicitude.nombreSolicitud}`, [emailJefeDirecto.value])

      notificacion('positive', 'Solicitud generada exitosamente')
    } catch (error) {
      notificacion('negative', error.response.data.message)
    } finally {
      cargandoEnvioSolicitud.value = false
    }
  }

  const solicitarDiasEconomicos = async (solicitudObj) => {
    try {
      cargandoEnvioSolicitud.value = true
      const usuariosAutorizanObj = {
        primeraAutorizacion: emailJefeIncorrecto.value === true ? usuarioSeleccionado.value : detalleJefeDirecto.value,
      }
      solicitudObj.usuariosAutorizan = usuariosAutorizanObj
      const { data } = await api.post('/solicitarDiasEconomicos', solicitudObj)
      todasSolicitudesEmpleado.value.unshift(data)

      const eventoObj = {
        nombreEvento: `-${data.folio}_1`,
        formulario: ID_FORM_JUSTIFICANTES_VACACIONES
      }

      await crearEventoForm(eventoObj)

      await enviarCorreoForm(data, urlForm.value, `Autorización de ${data.catalogo_tipo_solicitude.nombreSolicitud}`, [emailJefeDirecto.value])

      notificacion('positive', 'Solicitud generada exitosamente')
    } catch (error) {
      notificacion('negative', error.response.data.message)
    } finally {
      cargandoEnvioSolicitud.value = false
    }
  }

  const solicitarDiasGanados = async (solicitudObj) => {
    try {
      cargandoEnvioSolicitud.value = true
      const usuariosAutorizanObj = {
        primeraAutorizacion: emailJefeIncorrecto.value === true ? usuarioSeleccionado.value : detalleJefeDirecto.value,
      }
      solicitudObj.usuariosAutorizan = usuariosAutorizanObj
      const { data } = await api.post('/solicitarDiasGanados', solicitudObj)
      todasSolicitudesEmpleado.value.unshift(data)

      const eventoObj = {
        nombreEvento: `-${data.folio}_1`,
        formulario: ID_FORM_JUSTIFICANTES_VACACIONES
      }

      await crearEventoForm(eventoObj)

      await enviarCorreoForm(data, urlForm.value, `Autorización de ${data.catalogo_tipo_solicitude.nombreSolicitud}`, [emailJefeDirecto.value])

      notificacion('positive', 'Solicitud generada exitosamente')
    } catch (error) {
      notificacion('negative', error.response.data.message)
    } finally {
      cargandoEnvioSolicitud.value = false
    }
  }

  const solicitarVacacionesVencidas = async (solicitudObj) => {
    try {
      cargandoEnvioSolicitud.value = true
      const usuariosAutorizanObj = {
        primeraAutorizacion: emailJefeIncorrecto.value === true ? usuarioSeleccionado.value : detalleJefeDirecto.value,
      }
      solicitudObj.usuariosAutorizan = usuariosAutorizanObj
      const { data } = await api.post('/solicitarVacacionesVencidas', solicitudObj)
      todasSolicitudesEmpleado.value.unshift(data)

      const eventoObj = {
        nombreEvento: `-${data.folio}_1`,
        formulario: ID_FORM_JUSTIFICANTES_VACACIONES
      }

      await crearEventoForm(eventoObj)

      await enviarCorreoForm(data, urlForm.value, `Autorización de ${data.catalogo_tipo_solicitude.nombreSolicitud}`, [emailJefeDirecto.value])

      notificacion('positive', 'Solicitud generada exitosamente')
    } catch (error) {
      notificacion('negative', error.response.data.message)
    } finally {
      cargandoEnvioSolicitud.value = false
    }
  }

  const solicitarSabados5s = async (solicitudObj) => {
    try {
      cargandoEnvioSolicitud.value = true
      const usuariosAutorizanObj = {
        primeraAutorizacion: emailJefeIncorrecto.value === true ? usuarioSeleccionado.value : detalleJefeDirecto.value,
      }
      solicitudObj.usuariosAutorizan = usuariosAutorizanObj
      const { data } = await api.post('/solicitarSabados5s', solicitudObj)
      todasSolicitudesEmpleado.value.unshift(data)

      const eventoObj = {
        nombreEvento: `-${data.folio}_1`,
        formulario: ID_FORM_JUSTIFICANTES_VACACIONES
      }

      await crearEventoForm(eventoObj)

      await enviarCorreoForm(data, urlForm.value, `Autorización de ${data.catalogo_tipo_solicitude.nombreSolicitud}`, [emailJefeDirecto.value])

      notificacion('positive', 'Solicitud generada exitosamente')
    } catch (error) {
      notificacion('negative', error.response.data.message)
    } finally {
      cargandoEnvioSolicitud.value = false
    }
  }

  const solicitarProrroga = async (solicitudObj) => {
    try {
      cargandoEnvioSolicitud.value = true
      const usuariosAutorizan = await obtenerUsuariosAutorizan({ centroTrabajo: detalleUsuario.value.centroTrabajo, departamento: detalleUsuario.value.departamento })
      solicitudObj.usuarioAutoriza = usuariosAutorizan.obtenerGerenteRH
      const { data } = await api.post('/solicitarProrroga', solicitudObj)
      todasProrrogasEmpleado.value.unshift(data)

      const eventoObj = {
        nombreEvento: `-${data.folio}_1`,
        formulario: ID_FORM_JUSTIFICANTES_VACACIONES
      }

      const destinatario = solicitudObj.usuarioAutoriza.correo

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
    todasProrrogasEmpleado,
    historialSolicitudes,
    historialSolicitudesFiltradas,
    cargandoMisSolicitudes,
    cargandoHistorialSolicitudes,
    cargandoEnvioSolicitud,
    urlForm,
    usuarioSeleccionado,
    emailJefeDirecto,
    emailJefeIncorrecto,
    obtenerEstatus,
    obtenerMotivos,
    obtenerTipoSolicitudes,
    obtenerSolicitudesPorEmpleado,
    obtenerProrrogasPorEmpleado,
    obtenerTodasSolicitudes,
    obtenerDetalleVacacionesDiasEconomicos,
    obtenerDetalleEmpleadoYJefeDirecto,
    obtenerUsuariosAutorizan,
    solicitarAusenciasYRetardos,
    solicitarVacaciones,
    solicitarDiasEconomicos,
    solicitarDiasGanados,
    solicitarVacacionesVencidas,
    solicitarSabados5s,
    solicitarProrroga
  }
})
