import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { apiUsuarios } from 'src/boot/axiosUsuarios'
import { ref } from 'vue'
import { notificacion } from 'src/helpers/mensajes'
import { apiForm } from 'src/boot/axiosForm'
import { ID_FORM_JUSTIFICANTES_VACACIONES } from 'src/constant/servidor'
import { mensajeCorreoAutorizacionJustificantesVacaciones } from 'src/helpers/correos'
import { apiCorreo } from 'src/boot/axiosCorreo'

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
  const detalleGerenteSucursal = ref([])
  const todasSolicitudesEmpleado = ref([])
  const todasAutorizacionesEmpleado = ref([])
  const todasProrrogasEmpleado = ref([])
  const historialSolicitudes = ref([])
  const historialSolicitudesFiltradas = ref([])
  const justificantesMasivos = ref([])
  const justificantesMasivosFiltrados = ref([])
  const cargandoMisSolicitudes = ref(false)
  const cargandoHistorialSolicitudes = ref(false)
  const cargandoEnvioSolicitud = ref(false)
  const cargandoJustificantesMasivos = ref(false)

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
      const { data: { detalleEmpleado, detalleJefe, detalleGerente } } = await api.get(`/obtenerDetalleEmpleadoYJefeDirecto/${numero_empleado}`)
      detalleUsuario.value = detalleEmpleado
      detalleJefeDirecto.value = detalleJefe
      detalleGerenteSucursal.value = detalleGerente
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

  const obtenerAutorizacionesPorEmpleado = async (objBusqueda) => {
    try {
      const { data } = await api.post(`/obtenerAutorizacionesPorEmpleado`, objBusqueda)
      todasAutorizacionesEmpleado.value = data
    } catch (error) {
      notificacion('negative', error.response.data.message)
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

      if (detalleJefeDirecto.value.numero_empleado === 1028) {
        detalleJefeDirecto.value = detalleGerenteSucursal.value
        emailJefeDirecto.value = detalleJefeDirecto.value.correo
      }

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

      await enviarCorreoForm(data, urlForm.value, `Autorización de ${data.catalogo_tipo_solicitude.nombreSolicitud} - ${data.folio}`, [emailJefeDirecto.value])

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

      await enviarCorreoForm(data, urlForm.value, `Autorización de ${data.catalogo_tipo_solicitude.nombreSolicitud} - ${data.folio}`, [emailJefeDirecto.value])

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

      if (detalleJefeDirecto.value.numero_empleado === 1028) {
        detalleJefeDirecto.value = detalleGerenteSucursal.value
        emailJefeDirecto.value = detalleJefeDirecto.value.correo
      }

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

      await enviarCorreoForm(data, urlForm.value, `Autorización de ${data.catalogo_tipo_solicitude.nombreSolicitud} - ${data.folio}`, [emailJefeDirecto.value])

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

      if (detalleJefeDirecto.value.numero_empleado === 1028) {
        detalleJefeDirecto.value = detalleGerenteSucursal.value
        emailJefeDirecto.value = detalleJefeDirecto.value.correo
      }

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

      await enviarCorreoForm(data, urlForm.value, `Autorización de ${data.catalogo_tipo_solicitude.nombreSolicitud} - ${data.folio}`, [emailJefeDirecto.value])

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

      await enviarCorreoForm(data, urlForm.value, `Autorización de ${data.catalogo_tipo_solicitude.nombreSolicitud} - ${data.folio}`, [emailJefeDirecto.value])

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

      if (detalleJefeDirecto.value.numero_empleado === 1028) {
        detalleJefeDirecto.value = detalleGerenteSucursal.value
        emailJefeDirecto.value = detalleJefeDirecto.value.correo
      }

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

      await enviarCorreoForm(data, urlForm.value, `Autorización de ${data.catalogo_tipo_solicitude.nombreSolicitud} - ${data.folio}`, [emailJefeDirecto.value])

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

      await enviarCorreoForm(data, urlForm.value, `Autorización de ${data.catalogo_tipo_solicitude.nombreSolicitud} - ${data.folio}`, [destinatario])

      notificacion('positive', 'Solicitud generada exitosamente')
    } catch (error) {
      notificacion('negative', error.response.data.message)
    } finally {
      cargandoEnvioSolicitud.value = false
    }
  }

  const solicitarCapacitaciones = async (solicitudObj) => {
    try {
      cargandoEnvioSolicitud.value = true

      if (detalleJefeDirecto.value.numero_empleado === 1028) {
        detalleJefeDirecto.value = detalleGerenteSucursal.value
        emailJefeDirecto.value = detalleJefeDirecto.value.correo
      }

      const usuariosAutorizanObj = {
        primeraAutorizacion: emailJefeIncorrecto.value === true ? usuarioSeleccionado.value : detalleJefeDirecto.value,
      }
      solicitudObj.usuariosAutorizan = usuariosAutorizanObj

      const { data } = await api.post('/solicitarCapacitaciones', solicitudObj)
      todasSolicitudesEmpleado.value.unshift(data)

      const eventoObj = {
        nombreEvento: `-${data.folio}_1`,
        formulario: ID_FORM_JUSTIFICANTES_VACACIONES
      }

      await crearEventoForm(eventoObj)

      await enviarCorreoForm(data, urlForm.value, `Autorización de ${data.catalogo_tipo_solicitude.nombreSolicitud} - ${data.folio}`, [emailJefeDirecto.value])

      notificacion('positive', 'Solicitud generada exitosamente')
    } catch (error) {
      notificacion('negative', error.response?.data.message)
    } finally {
      cargandoEnvioSolicitud.value = false
      urlForm.value = ''
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
      // await apiForm.post('/eventoCorreo', { correo: destinatarios, titulo: titulo, mensaje: mensajeCorreoAutorizacionJustificantesVacaciones(solicitudObj, url) })
      await apiCorreo.post('/envio/correo', { destinatarios, copia: [], copiaOculta: [], asunto: titulo, html: mensajeCorreoAutorizacionJustificantesVacaciones(solicitudObj, url), adjuntos: [] })
    } catch (error) {
      notificacion('negative', 'Error al enviar el correo')
      console.error(error)
      urlForm.value = ''
    }
  }

  const obtenerJustificantesMasivos = async (objBusqueda) => {
    try {
      cargandoJustificantesMasivos.value = true
      const { data } = await api.post('/obtenerJustificantesMasivos', objBusqueda)
      justificantesMasivos.value = data
      justificantesMasivosFiltrados.value = data
    } catch (error) {
      notificacion('negative', error.response.data.message)
    } finally {
      cargandoJustificantesMasivos.value = false
    }
  }

  const agregarJustificantesMasivos = async (justificanteObj) => {
    try {
      cargandoJustificantesMasivos.value = true
      const { data } = await api.post('/agregarJustificantesMasivos', justificanteObj)
      justificantesMasivos.value = [data, ...justificantesMasivos.value]
      justificantesMasivosFiltrados.value = [data, ...justificantesMasivosFiltrados.value]
    } catch (error) {
      notificacion('negative', error.response.data.message)
      cargandoJustificantesMasivos.value = false
    } finally {
      cargandoJustificantesMasivos.value = false
    }
  }

  const cancelarAutorizaciones = async (autorizacionObj) => {
    try {
      const { data } = await api.post('/cancelarAutorizaciones', autorizacionObj)
      actualizarArreglo(historialSolicitudes.value, autorizacionObj, data)
      actualizarArreglo(historialSolicitudesFiltradas.value, autorizacionObj, data)
      notificacion('positive', 'Dia cancelado exitosamente')
      return data
    } catch (error) {
      notificacion('negative', error.response.data.message)
    }
  }

  const actualizarArreglo = (arreglo, autorizacionObj, data) => {
    const solicitudIndex = arreglo.findIndex(solicitud => solicitud.folio === autorizacionObj.folio)
    if (solicitudIndex !== -1) {
      const detalleIndex = arreglo[solicitudIndex].solicitud_detalles.findIndex(
        detalle => detalle.idSolicitudDetalle === autorizacionObj.idSolicitudDetalle
      )
      if (detalleIndex !== -1) {
        arreglo[solicitudIndex].solicitud_detalles[detalleIndex] = { ...arreglo[solicitudIndex].solicitud_detalles[detalleIndex], data }
      }
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
    todasAutorizacionesEmpleado,
    todasProrrogasEmpleado,
    historialSolicitudes,
    historialSolicitudesFiltradas,
    justificantesMasivos,
    justificantesMasivosFiltrados,
    cargandoMisSolicitudes,
    cargandoHistorialSolicitudes,
    cargandoEnvioSolicitud,
    cargandoJustificantesMasivos,
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
    solicitarProrroga,
    solicitarCapacitaciones,
    obtenerAutorizacionesPorEmpleado,
    obtenerJustificantesMasivos,
    agregarJustificantesMasivos,
    cancelarAutorizaciones
  }
})
