import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { ref } from 'vue'

export const useSucursalesStore = defineStore("sucursales", () => {

  const sucursales = ref([])
  const sucursalesFiltradas = ref([])
  const modelSucursalesSeleccionadas = ref([])
  const listaClavesSucursales = ref([])
  const todasSucursalesSeleccionadas = ref(true)

  const obtenerSucursales = async () => {
    try {

      const { data } = await api.get('/obtenerSucursales')
      sucursales.value = data.map(sucursal => { return { ...sucursal, label: sucursal.nombreSucursal, value: sucursal.claveSucursal } })
      sucursalesFiltradas.value = data.map(sucursal => {
        return { ...sucursal, label: sucursal.nombreSucursal, value: sucursal.claveSucursal }
      })
      listaClavesSucursales.value = sucursalesFiltradas.value.map((sucursal) => { return sucursal.value })

    } catch (error) {
      console.log(error)
    }
  }

  return {
    sucursales,
    sucursalesFiltradas,
    modelSucursalesSeleccionadas,
    todasSucursalesSeleccionadas,
    listaClavesSucursales,
    obtenerSucursales,
  }
})
