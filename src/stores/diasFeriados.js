import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { ref } from 'vue'
import { notificacion } from 'src/helpers/mensajes'

export const useDiasFeriadosStore = defineStore("diasFeriados", () => {
    const diasFeriados = ref([])
    const cargando = ref(false)

    const obtenerDiasFeriados = async () => {
        try {
            cargando.value= true
            const { data } = await api.get('/diasFeriados')
            diasFeriados.value = data
        } catch (error) {
            console.log(error)
        }finally{
            cargando.value = false
        }
    }

    const agregarDiasFeriados = async (diasFeriadosObj) => {
      try {
          cargando.value= true
          const { data } = await api.post('/diasFeriados',diasFeriadosObj)
          diasFeriados.value = [data, ...diasFeriados.value]
          notificacion('positive', 'Registro agregado exitosamente')
      } catch (error) {
          notificacion('negative', error.response.data.message)
      }finally{
          cargando.value = false
      }
    }

    const editarDiasFeriados = async (diasFeriadosObj) => {
      try {
        const { data } = await api.put(`/diasFeriados/${diasFeriadosObj.idDiaFeriado}`,diasFeriadosObj)
        const index = diasFeriados.value.findIndex((catalogo) => catalogo.idDiaFeriado === diasFeriadosObj.idDiaFeriado)
        diasFeriados.value.splice(index, 1, diasFeriadosObj)
        notificacion("positive", "Registro Actualizado Correctamente")
      } catch (error) {
        notificacion("negative", error.response.data.message)
      }
    }

    const eliminarDiasFeriados = async (diasFeriadosObj) => {
      try {
        const { data } = await api.delete(`/diasFeriados/${diasFeriadosObj.idDiaFeriado}`)
        diasFeriados.value = diasFeriados.value.filter((catalogo) => catalogo.idDiaFeriado !== diasFeriadosObj.idDiaFeriado)
        notificacion("positive", "Registro eliminado correctamente")
      } catch (error) {
        notificacion("negative", error.response.data.message)
      }
    }

    return {
        diasFeriados,
        cargando,
        obtenerDiasFeriados,
        agregarDiasFeriados,
        editarDiasFeriados,
        eliminarDiasFeriados
    }
})
