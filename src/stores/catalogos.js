import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { ref } from 'vue'
import { notificacion } from 'src/helpers/mensajes'

export const useCatalogosStore = defineStore("catalogos", () => {
    const catalogoVacaciones = ref([])
    const catalogoUsuarios = ref([])
    const cargando = ref(false)

    const obtenerCatalogoVacaciones = async () => {
        try {
            cargando.value= true
            const { data } = await api.get('/catalogoVacaciones')
            catalogoVacaciones.value = data
        } catch (error) {
            console.log(error)
        }finally{
            cargando.value = false
        }
    }

    const agregarCatalogoVacaciones = async (catalogoObj) => {
      try {
          cargando.value= true
          const { data } = await api.post('/catalogoVacaciones',catalogoObj)
          catalogoVacaciones.value = [data, ...catalogoVacaciones.value]
          notificacion('positive', 'Registro agregado exitosamente')
      } catch (error) {
          notificacion('negative', error.response.data.message)
      }finally{
          cargando.value = false
      }
    }

    const editarCatalogoVacaciones = async (catalogoObj) => {
      try {
        const { data } = await api.put(`/catalogoVacaciones/${catalogoObj.idVacaciones}`,catalogoObj)
        const index = catalogoVacaciones.value.findIndex((catalogo) => catalogo.idVacaciones === catalogoObj.idVacaciones)
        catalogoVacaciones.value.splice(index, 1, catalogoObj)
        notificacion("positive", "Registro Actualizado Correctamente")
      } catch (error) {
        notificacion("negative", error.response.data.message)
      }
    }

    const eliminarCatalogoVacaciones = async (catalogoObj) => {
      try {
        const { data } = await api.delete(`/catalogoVacaciones/${catalogoObj.idVacaciones}`)
        catalogoVacaciones.value = catalogoVacaciones.value.filter((catalogo) => catalogo.idVacaciones !== catalogoObj.idVacaciones)
        notificacion("positive", "Registro eliminado correctamente")
      } catch (error) {
        notificacion("negative", error.response.data.message)
      }
    }

    const obtenerCatalogoUsuarios = async () => {
      try {
          cargando.value= true
          const { data } = await api.get('/catalogoUsuarios')
          catalogoUsuarios.value = data
      } catch (error) {
          console.log(error)
      }finally{
          cargando.value = false
      }
  }

    return {
        catalogoVacaciones,
        catalogoUsuarios,
        cargando,
        obtenerCatalogoVacaciones,
        obtenerCatalogoUsuarios,
        agregarCatalogoVacaciones,
        editarCatalogoVacaciones,
        eliminarCatalogoVacaciones
    }
})
