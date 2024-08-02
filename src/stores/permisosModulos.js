import { defineStore } from 'pinia'
import { ref } from 'vue'
import { apiUsuarios } from 'src/boot/axiosUsuarios'
import { notificacion } from 'src/helpers/mensajes'

export const useModulosStore = defineStore('modulos', () => {

  const listaModulos = ref([])
  const usuariosModulos = ref([])
  const usuariosAcceso = ref([])
  const filtroUsuariosAcceso = ref([])
  const permisosSucursales = ref([])

  const clavesPermisosSucursales = ref([])

  const obtenerUsuariosModulo = async (id) => {
    try {
      const { data } = await apiUsuarios.post('/modulos', { id })
      usuariosModulos.value = data.usuariosPorModulo
      usuariosAcceso.value = data.usuariosPortal
      filtroUsuariosAcceso.value = data.usuariosPortal
    } catch (error) {
      notificacion('negative', error.response.data.message)
    }
  }

  const actualizarPermisosModulos = async (permisosObj) => {
    try {
      const { data } = await apiUsuarios.put('/modulos', permisosObj)
      usuariosModulos.value = data
      notificacion('positive', 'Permisos de módulos actualizados correctamente')
    } catch (error) {
      notificacion('negative', error.response.data.message)
    }
  }

  const obtenerPermisosSucursalesByUser = async (idUsuario) => {
    try {
      const { data } = await apiUsuarios.post('/permisos/sucursales/justificantes', { idUsuario })
      permisosSucursales.value = [...data]
      clavesPermisosSucursales.value = permisosSucursales.value.map( permiso => { return permiso.claveSucursal} )
    } catch (error) {
      console.log(error)
    }
  }

  const actualizarPermisosSucursales = async (permisosObj) => {
    try {
      const { data } = await apiUsuarios.put('/permisos/sucursales/justificantes', permisosObj)
      permisosSucursales.value = data
      notificacion('positive', data.message)
    } catch (error) {
      notificacion('negative', error.response.data.message)
    }
  }

  return {
    // state
    usuariosModulos,
    usuariosAcceso,
    filtroUsuariosAcceso,
    listaModulos,
    permisosSucursales,
    clavesPermisosSucursales,
    // methods
    obtenerUsuariosModulo,
    actualizarPermisosModulos,
    obtenerPermisosSucursalesByUser,
    actualizarPermisosSucursales
  }
})
