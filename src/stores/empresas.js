import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { ref } from 'vue'
import { notificacion } from 'src/helpers/mensajes'

export const useEmpresasStore = defineStore("empresas", () => {

  const empresas = ref([])
  const empresasFiltradas = ref([])
  const empresasSeleccionadas = ref([])
  const listaClavesEmpresas = ref([])
  const todasEmpresasSeleccionadas = ref(true)

  const obtenerEmpresas = async () => {
    try {

      const { data } = await api.get('/obtenerEmpresas')
      empresas.value = data
      empresasFiltradas.value = data.map(empresa => { return { ...empresa, label: empresa.nombreEmpresa, value: empresa.claveEmpresa } })
      listaClavesEmpresas.value = empresasFiltradas.value.map(empresa => { return empresa.value })
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
    empresas,
    empresasFiltradas,
    empresasSeleccionadas,
    todasEmpresasSeleccionadas,
    listaClavesEmpresas,
    obtenerEmpresas,
    agregarEmpresa,
    actualizarEmpresa
  }
})
