import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { ref } from 'vue'

export const useSucursalesStore = defineStore("sucursales", () => {

    const sucursales = ref([])

    const obtenerSucursales = async () => {
        try {

            const { data } = await api.get('/sucursales')
            sucursales.value = data

        } catch (error) {
            console.log(error)
        }
    }

    return {
        sucursales,
        obtenerSucursales,
    }
})
