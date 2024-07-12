import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { ref } from 'vue'

export const useAsistenciasStore = defineStore("asistencias", () => {
    const asistencias = ref([])
    const cargando = ref(false)

    const obtenerAsistencias = async (objBusqueda) => {
        try {
            cargando.value= true
            const { data } = await api.post('/obtener/asistencias', objBusqueda)
            asistencias.value = data
        } catch (error) {
            console.log(error)
        }finally{
          cargando.value = false
        }
    }

    return {
        asistencias,
        obtenerAsistencias,
        cargando
    }
})
