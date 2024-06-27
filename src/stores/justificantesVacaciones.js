import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { apiUsuarios } from 'src/boot/axiosUsuarios'
import { ref } from 'vue'
import { notificacion } from 'src/helpers/mensajes'

export const useJustificantesVacacionesStore = defineStore('justificantesVacaciones', () => {
  const todosUsuarios = ref([])
  const todosUsuariosFiltrados = ref([])
  const todasEmpresas = ref([])
  const todasEmpresasFiltradas = ref([])
  const todasSucursales = ref([])
  const todasSucursalesFiltradas = ref([])
  const todosDepartamentos = ref([])
  const todosDepartamentosFiltrados = ref([])
  const todosEstatus = ref([])
  const todosEstatusFiltrados = ref([])
  const todosMotivos = ref([])
  const todosMotivosFiltrados = ref([])
  const todosTipoSolicitudes = ref([])
  const todosTipoSolicitudesFiltrados = ref([])
  const detalleUsuario = ref([])
  const detalleJefeDirecto = ref([])
  const todasSolicitudesEmpleado = ref([])
  const cargandoMisSolicitudes = ref(false)
  const cargandoEnvioSolicitud = ref(false)


  const detalleVacacionesDiasEconomicos = ref(null)

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

  const obtenerEmpresas = async () => {
    try {
      const { data } = await api.get('/obtenerEmpresas')
      todasEmpresas.value = [...data]
      todasEmpresasFiltradas.value = data.map(empresa => { return { label: empresa.nombreEmpresa, value: empresa.claveEmpresa } })
    } catch (error) {
      notificacion('negative', error.response.data.message)
    }
  }

  const obtenerSucursales = async () => {
    try {
      const { data } = await api.get('/obtenerSucursales')
      todasSucursales.value = [...data]
      todasSucursalesFiltradas.value = data.map(sucursal => {
        return { label: sucursal.nombreSucursal, value: sucursal.claveSucursal }
      })
    } catch (error) {
      notificacion('negative', error.response.data.message)
    }
  }

  const obtenerDepartamentos = async () => {
    try {
      const { data } = await api.get('/obtenerDepartamentos')
      todosDepartamentos.value = [...data]
      todosDepartamentosFiltrados.value = data.map(departamento => {
        return { label: departamento.nombreDepartamento, value: departamento.claveDepartamento }
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
    } catch (error) {
      notificacion('negative', error.response.data.message)
    }
  }

  const obtenerTipoSolicitudes = async () => {
    try {
      const { data } = await api.get('/obtenerTipoSolicitudes')
      todosTipoSolicitudes.value = [...data]
      todosTipoSolicitudesFiltrados.value = data.map(tipo => {
        return { label: tipo.nombreSolicitd, value: tipo.idTipoSolicitud }
      })
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
      const usuariosAutorizan = await obtenerUsuariosAutorizan({ centroTrabajo: detalleUsuario.value.centroTrabajo, departamento: detalleUsuario.value.departamento })
      const usuariosAutorizanObj = {
        primeraAutorizacion: detalleJefeDirecto.value,
        segundaAutorizacion: solicitudObj.claveEmpresa === 'MB' ? usuariosAutorizan.obtenerGerenteAdministrativo : usuariosAutorizan.obtenerRevisaRH
      }
      solicitudObj.usuariosAutorizan = usuariosAutorizanObj

      const { data } = await api.post('/solicitarAusenciasYRetardos', solicitudObj)
      todasSolicitudesEmpleado.value.unshift(data)
      notificacion('positive', 'Solicitud generada exitosamente')
    } catch (error) {
      notificacion('negative', error.response.data.message)
    } finally {
      cargandoEnvioSolicitud.value = false
    }
  }

  const solicitarVacaciones = async (solicitudObj) => {
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
      const usuariosAutorizan = await obtenerUsuariosAutorizan({ centroTrabajo: detalleUsuario.value.centroTrabajo, departamento: detalleUsuario.value.departamento })
      const usuariosAutorizanObj = {
        primeraAutorizacion: detalleJefeDirecto.value,
        segundaAutorizacion: solicitudObj.claveEmpresa === 'MB' ? usuariosAutorizan.obtenerGerenteAdministrativo : usuariosAutorizan.obtenerRevisaRH
      }
      solicitudObj.usuariosAutorizan = usuariosAutorizanObj
      const { data } = await api.post('/solicitarDiasEconomicos', solicitudObj)
      todasSolicitudesEmpleado.value.unshift(data)
      notificacion('positive', 'Solicitud generada exitosamente')
    } catch (error) {
      notificacion('negative', error.response.data.message)
    } finally {
      cargandoEnvioSolicitud.value = false
    }
  }

  return {
    todosUsuarios,
    todosUsuariosFiltrados,
    todasEmpresas,
    todasEmpresasFiltradas,
    todasSucursales,
    todasSucursalesFiltradas,
    todosDepartamentos,
    todosDepartamentosFiltrados,
    todosEstatus,
    todosEstatusFiltrados,
    todosMotivos,
    todosMotivosFiltrados,
    todosTipoSolicitudes,
    todosTipoSolicitudesFiltrados,
    detalleVacacionesDiasEconomicos,
    detalleUsuario,
    detalleJefeDirecto,
    todasSolicitudesEmpleado,
    cargandoMisSolicitudes,
    cargandoEnvioSolicitud,
    obtenerUsuarios,
    obtenerEmpresas,
    obtenerSucursales,
    obtenerDepartamentos,
    obtenerEstatus,
    obtenerMotivos,
    obtenerTipoSolicitudes,
    obtenerSolicitudesPorEmpleado,
    obtenerDetalleVacacionesDiasEconomicos,
    obtenerDetalleEmpleadoYJefeDirecto,
    obtenerUsuariosAutorizan,
    solicitarAusenciasYRetardos,
    solicitarVacaciones,
    solicitarDiasEconomicos

  }
})
