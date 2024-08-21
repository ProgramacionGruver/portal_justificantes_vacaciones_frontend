import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { ref } from 'vue'
import { notificacion } from 'src/helpers/mensajes'

export const useIncapacidadesStore = defineStore("incapacidades", () => {
    const incapacidades = ref([])
    const incapacidadesFiltrados = ref([])

    const cargando = ref(false)

    const obtenerIncapacidades = async () => {
        try {
            cargando.value= true
            const { data } = await api.get('/incapacidades')
            incapacidades.value = data
            incapacidadesFiltrados.value = data
        } catch (error) {
            console.log(error)
        }finally{
            cargando.value = false
        }
    }

    const agregarIncapacidades = async (incapacidadesObj) => {
      try {
          cargando.value= true
          const { data } = await api.post('/incapacidades',incapacidadesObj)
          incapacidades.value = [...data, ...incapacidades.value]
          incapacidadesFiltrados.value = [...data, ...incapacidadesFiltrados.value]
          notificacion('positive', 'Registro agregado exitosamente')
      } catch (error) {
          notificacion('negative', error.response.data.message)
      }finally{
          cargando.value = false
      }
    }


    return {
        incapacidades,
        incapacidadesFiltrados,
        cargando,
        obtenerIncapacidades,
        agregarIncapacidades
    }
})
