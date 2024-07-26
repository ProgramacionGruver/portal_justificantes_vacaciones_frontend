import { defineStore, storeToRefs } from 'pinia'
import { api } from 'src/boot/axios'
import { ref } from 'vue'
import { notificacion } from 'src/helpers/mensajes'
import { llenarOpcionesEmpresas, filtrarElementos } from 'src/helpers/filtros'
import { useModulosStore } from 'src/stores/permisosModulos'
import { useAutenticacionStore } from 'src/stores/autenticaciones'

export const useEmpresasStore = defineStore("empresas", () => {

  const primeraCarga = ref(true)
  const empresas = ref([])
  const empresasFiltradas = ref([])
  const modelEmpresasSeleccionadas = ref([])
  const listaClavesEmpresas = ref([])
  const todasEmpresasSeleccionadas = ref(true)
  const empresasAcceso = ref([])

  const useUsuario = useAutenticacionStore()
  const { usuarioAutenticado } = storeToRefs(useUsuario)

  const useModulos = useModulosStore()
  const { permisosSucursales } = storeToRefs(useModulos)
  const { obtenerPermisosSucursalesByUser } = useModulos

  const obtenerEmpresas = async () => {
    try {
      const { data } = await api.get('/obtenerEmpresas')
      empresas.value = [...data]
      empresas.value = llenarOpcionesEmpresas(empresas.value)
      await obtenerPermisosSucursalesByUser(usuarioAutenticado.value.idUsuario)

      //Permisos de empresas por user en modulos
      empresasAcceso.value = permisosSucursales.value.map( permiso => { return permiso.claveEmpresa} )
      empresas.value = filtrarElementos(empresasAcceso.value, empresas.value, 'claveEmpresa')

      empresasFiltradas.value = empresas.value
      listaClavesEmpresas.value = empresasFiltradas.value.map(
        (elemento) => elemento.claveEmpresa
      )
    } catch (error) {
      console.log(error)
    }
  }


  const agregarEmpresa = async (objEmpresa) => {
    try {

      const { data } = await api.post('/empresa', objEmpresa)
      empresas.value = [data, ...empresas.value]
      notificacion('positive', `Se registró correctamente la empresa ${data.nombre}`)

    } catch (error) {
      notificacion('warning', `Error al agregar la empresa. ${error}`)
    }
  }

  const actualizarEmpresa = async (objEmpresa) => {
    try {

      const { data } = await api.put('/empresa', objEmpresa)
      const index = empresas.value.findIndex(empresa => empresa.idEmpresa === objEmpresa.idEmpresa)
      empresas.value[index] = data
      notificacion('positive', `Se actualizo correctamente la empresa ${data.nombre}`)

    } catch (error) {
      notificacion('warning', `Error al agregar la empresa. ${error}`)
    }
  }


  return {
    primeraCarga,
    empresas,
    empresasFiltradas,
    modelEmpresasSeleccionadas,
    todasEmpresasSeleccionadas,
    listaClavesEmpresas,
    obtenerEmpresas,
    agregarEmpresa,
    actualizarEmpresa
  }
})
