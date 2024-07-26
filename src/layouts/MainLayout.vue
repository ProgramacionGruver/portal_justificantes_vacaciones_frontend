<template>
  <q-layout view="hHh LpR fFf">
    <div v-if="cargando">
      <div
        style="
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: 100vw;
          height: 100vh;
        "
      >
        <q-spinner-ios size="200px" color="primary" />
        <div class="text-h2 q-mt-xl">
          Obteniendo la información del portal, espere un momento...
        </div>
      </div>
    </div>
    <div v-else>
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <q-avatar class="logo-inicio">
            <img src="../img/logog.png" />
          </q-avatar>
          Portal de Justificantes, Vacaciones y Días económicos
        </q-toolbar-title>
        <q-btn flat @click="logout"> Cerrar sesión </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
      <!-- drawer content -->
      <div class="row justify-center contenedor-menu">
        <q-img src="../img/banner.jpg" id="target-img-1" style="height: 100px">
          <div class="absolute-bottom-right" style="border-top-left-radius: 5px">

              {{ usuarioAutenticado?.nombre }}
              <span style="font-weight: bold"></span>

              </div>
        </q-img>
      </div>
      <NavBar></NavBar>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </div>
  </q-layout>
</template>

<script>
import { ref, onMounted } from 'vue'
import NavBar from '../components/NavBar.vue'
import { storeToRefs } from 'pinia'
import { useAutenticacionStore } from '../stores/autenticaciones'
import { useRouter } from 'vue-router'
import { useJustificantesVacacionesStore } from 'src/stores/justificantesVacaciones'
import { useEmpresasStore } from 'src/stores/empresas'
import { useSucursalesStore } from 'src/stores/sucursales'
import { useDepartamentosStore } from 'src/stores/departamentos'
import { useModulosStore } from 'src/stores/permisosModulos'
import { ID_SERVIDOR } from 'src/constant/servidor'

export default {
  components: {
    NavBar
  },
  setup () {
    const leftDrawerOpen = ref(false)
    const useUsuario = useAutenticacionStore()
    const { usuarioAutenticado } = storeToRefs(useUsuario)
    const { cerrarSesion } = useUsuario
    // const { autenticarUsuario } = useUsuario

    const useEmpresas = useEmpresasStore()
    const { obtenerEmpresas } = useEmpresas

    const useSucursales = useSucursalesStore()
    const { obtenerSucursales } = useSucursales

    const useDepartamentos = useDepartamentosStore()
    const { obtenerDepartamentos } = useDepartamentos

    const useJustificantesVacaciones = useJustificantesVacacionesStore()
    const { obtenerEstatus, obtenerMotivos, obtenerTipoSolicitudes, obtenerDetalleEmpleadoYJefeDirecto, obtenerSolicitudesPorEmpleado} = useJustificantesVacaciones

    const useModulos = useModulosStore()
    const { obtenerUsuariosModulo, obtenerPermisosSucursalesByUser } = useModulos

    const router = useRouter()
    const cargando = ref(false)

    onMounted(async () => {
      cargando.value = true
      // autenticarUsuario()
      await obtenerEstatus()
      await obtenerTipoSolicitudes()
      await obtenerMotivos()
      await obtenerSolicitudesPorEmpleado(usuarioAutenticado.value.numero_empleado)
      cargando.value = false
      await obtenerDetalleEmpleadoYJefeDirecto(usuarioAutenticado.value.numero_empleado)
      await obtenerUsuariosModulo(ID_SERVIDOR)
      await obtenerPermisosSucursalesByUser(usuarioAutenticado.value.idUsuario)
      await obtenerEmpresas()
      await obtenerSucursales()
      await obtenerDepartamentos()
    })
    const logout = () => {
      router.push('/')
      cerrarSesion()
    }
    return {
      leftDrawerOpen,
      // inicialesUsuario,
      usuarioAutenticado,
      logout,
      cargando,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  }
}
</script>
<style scoped>
.logo-inicio {
  background-color: white;
}
.logo-inicio img {
  padding: 0.3rem;
}
.contenedor-menu {
  margin-bottom: 1rem;
}
</style>
