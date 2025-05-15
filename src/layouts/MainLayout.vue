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
        <div class="text-h2 q-mt-xl q-mr-md q-ml-md text-center">
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
            <img src="https://backend.gruver.com.mx/componentes/navbar-26.webp" />
          </q-avatar>
          <span class="q-ml-sm">
            Portal de Justificantes, Vacaciones y Días económicos
          </span>
        </q-toolbar-title>
        <q-btn
          flat
          round
          dense
          icon="info"
          @click="abrirUrl"
        >
          <q-tooltip class="text-h5">
            Manual de Usuario
          </q-tooltip>
        </q-btn>
        <q-btn flat @click="logout"> Cerrar sesión </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
      <!-- drawer content -->
      <div class="contenedor-perfil">
        <div style="background-color: rgba(0, 0, 0, 0.5);" class="q-px-md q-py-sm">
            <div style="display: flex; justify-content: center;">
              <q-avatar size="7rem">
                <q-img
                  :src="calcularURLFoto(usuarioAutenticado?.numero_empleado)"
                  spinner-color="white"/>
              </q-avatar>
            </div>
            <div style="display: flex; justify-content: center; " >
              {{ usuarioAutenticado?.nombre }}
            </div>
        </div>
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
import { useColaboradoresStore } from 'src/stores/colaboradores'
import { ID_SERVIDOR } from 'src/constant/servidor'

export default {
  components: {
    NavBar
  },
  setup () {
    const leftDrawerOpen = ref(false)
    const useUsuario = useAutenticacionStore()
    const { usuarioAutenticado, usuarioJefe } = storeToRefs(useUsuario)
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

    const useColaboradores = useColaboradoresStore()
    const { obtenerColaboradoresPortalSistemas } = useColaboradores

    const router = useRouter()
    const cargando = ref(false)

    onMounted(async () => {
      cargando.value = true
      // autenticarUsuario()
      await obtenerColaboradoresPortalSistemas()
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

    const calcularURLFoto = (numeroEmpleado) => {
      const idFormateado = String(numeroEmpleado).padStart(7, '0')
      const url = `https://backend.gruver.com.mx/rh/api/fotos/${idFormateado}.jpg`
      return url
    }

    const abrirUrl = async () => {
      if(usuarioJefe.value){
        window.open('https://gruvermx.sharepoint.com/:b:/s/GruverProgramacin/EUNFHuQ8Dc5HiYF1xH42Oi4BJ3curXA6-aIiq9m29ZkRiA?e=dLO00J', '_blank')
      }else{
        window.open('https://gruvermx.sharepoint.com/:b:/s/GruverProgramacin/ETrVe0NpxvtOmlTwtCnZ-qIB4H95aOWd5Xpewvaao0z5cQ?e=ECH4lS', '_blank')
      }
    }

    return {
      leftDrawerOpen,
      // inicialesUsuario,
      usuarioAutenticado,
      logout,
      cargando,
      calcularURLFoto,
      abrirUrl,
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
