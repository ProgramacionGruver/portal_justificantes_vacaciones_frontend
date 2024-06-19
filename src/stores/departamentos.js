import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { ref } from 'vue'

export const useDepartamentosStore = defineStore("departamentos", () => {

    const departamentos = ref([])

    const obtenerDepartamentos = async () => {
        try {

            const { data } = await api.get('/departamentos')
            departamentos.value = data

        } catch (error) {
            //console.log( error )
        }
    }

    return {
        departamentos,
        obtenerDepartamentos
    }
})
