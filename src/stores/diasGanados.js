import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { ref } from 'vue'
import { notificacion } from 'src/helpers/mensajes'

export const useDiasGanadosStore = defineStore("diasGanados", () => {
    const diasGanados = ref([])
    const diasGanadosFiltrados = ref([])

    const cargando = ref(false)

    const obtenerDiasGanados = async () => {
        try {
            cargando.value= true
            const { data } = await api.get('/diasGanados')
            diasGanados.value = data
            diasGanadosFiltrados.value = data
        } catch (error) {
            console.log(error)
        }finally{
            cargando.value = false
        }
    }

    const agregarDiasGanados = async (diasGanadosObj) => {
      try {
          cargando.value= true
          const { data } = await api.post('/diasGanados',diasGanadosObj)
          diasGanados.value = [...data, ...diasGanados.value]
          diasGanadosFiltrados.value = [...data, ...diasGanadosFiltrados.value]
          notificacion('positive', 'Registro agregado exitosamente')
      } catch (error) {
          notificacion('negative', error.response.data.message)
      }finally{
          cargando.value = false
      }
    }


    return {
        diasGanados,
        diasGanadosFiltrados,
        cargando,
        obtenerDiasGanados,
        agregarDiasGanados
    }
})
