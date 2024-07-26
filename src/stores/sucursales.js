import { defineStore, storeToRefs } from 'pinia'
import { api } from 'src/boot/axios'
import { ref } from 'vue'
import { filtrarElementos, llenarOpcionesSucursales } from 'src/helpers/filtros'
import { useModulosStore } from 'src/stores/permisosModulos'

export const useSucursalesStore = defineStore("sucursales", () => {

  const sucursales = ref([])
  const sucursalesFiltradas = ref([])
  const modelSucursalesSeleccionadas = ref([])
  const listaClavesSucursales = ref([])
  const todasSucursalesSeleccionadas = ref(true)
  const sucursalesAgrupadas = ref([])
  const sucursalesAcceso = ref([])

  const useModulos = useModulosStore()
  const { permisosSucursales } = storeToRefs(useModulos)

  const obtenerSucursales = async () => {
    try {

      const { data } = await api.get('/obtenerSucursales')
      sucursales.value = [...data]
      sucursales.value = llenarOpcionesSucursales(sucursales.value)

      //Permisos de sucursales por user en modulos
      sucursalesAcceso.value = permisosSucursales.value.map( permiso => { return permiso.claveSucursal} )
      sucursales.value = filtrarElementos(sucursalesAcceso.value, sucursales.value, 'claveSucursal')
      sucursalesFiltradas.value = sucursales.value
      listaClavesSucursales.value = sucursales.value.map( elemento => elemento.claveSucursal)

      } catch (error) {
      console.log(error)
    }
  }

  const obtenerSucursalesAgrupadasEmpresas = async () => {
    try {
      const { data } = await api.get('/sucursalesAgrupadasEmpresas');
      sucursalesAgrupadas.value = data;
    } catch (error) {
      console.log(error);
    }
  }

  return {
    sucursales,
    sucursalesFiltradas,
    modelSucursalesSeleccionadas,
    todasSucursalesSeleccionadas,
    listaClavesSucursales,
    sucursalesAgrupadas,
    obtenerSucursales,
    obtenerSucursalesAgrupadasEmpresas
  }
})
