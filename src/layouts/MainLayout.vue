<template>
  <q-layout view="hHh LpR fFf">
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
  </q-layout>
</template>

<script>
import { ref, onMounted } from 'vue'
import NavBar from '../components/NavBar.vue'
import { storeToRefs } from 'pinia'
import { useAutenticacionStore } from '../stores/autenticaciones'
import { useRouter } from 'vue-router'

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

    const router = useRouter()

    onMounted(async () => {
      // autenticarUsuario()
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
