<template>
  <div div class="q-pa-md">
    <div div class="q-pa-md">
      <h2>Consulta Correos</h2>
    </div>
    <q-separator color="primary" class="q-my-md" inset />
    <div>
      <q-bt>
        Enviar Reporte de ordenes
      </q-bt>
    </div>
  </div>
</template>

<script>
import { onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useOrdenesStore } from "src/stores/ordenes.js";

export default {
  components: {

  },
  setup() {
    const useOrdenes = useOrdenesStore()
    const { ordenesEnProceso } = storeToRefs(useOrdenes)
    const { obtenerOrdenesEnProceso } = useOrdenes

    onMounted(async () => {
      await obtenerOrdenesEnProceso()
    })

    return {
    ordenesEnProceso
    }
  }
}

</script>
