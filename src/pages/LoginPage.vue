<template>
  <div v-if="isLogin" class="centrar-circular-progres">
    <q-circular-progress
      indeterminate
      rounded
      size="50px"
      color="primary"
      class="q-ma-md"
    />
  </div>
  <div v-else class="contenedor-login">
    <div class="informacion-login contenedor">
      <div class="portada-login">
        <h1> <span>Bienvenido a, </span> Portal de Justificantes, Vacaciones y Días económicos </h1>

      </div>
      <q-form
        ref="formulario"
        class="bg-white formulario-login"
        @submit.prevent="login"
      >
        <div class="q-pa-xl">
          <div class="contenedor-logo-gruver">
            <q-img
              src="../img/logoGruver.png"
              spinner-color="white"
              class="q-mb-xl imagen-gruver"
            />
          </div>
          <div class="q-mb-md">
            <q-input
              ref="usuarioRef"
              v-model="usuarioObj.usuario"
              label="Ingresa el nombre de usuario"
              :rules="[
                (val) =>
                  (val && val.length > 0) ||
                  'Debes ingresar un nombre de usuario',
              ]"
            >
              <template v-slot:append>
                <q-icon name="person" />
              </template>
            </q-input>
          </div>
          <div class="q-mb-md">
            <q-input
              ref="contrasenaRef"
              v-model="usuarioObj.contrasena"
              filled
              :type="isPassword ? 'password' : 'text'"
              label="Ingresa la contraseña"
              lazy-rules
              :rules="[
                (val) =>
                  (val && val.length > 0) || 'Debes ingresar una contraseña',
              ]"
            >
              <template v-slot:append>
                <q-icon
                  :name="isPassword ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPassword = !isPassword"
                />
              </template>
            </q-input>
          </div>
          <div class="btn-login">
            <q-btn color="primary" type="submit" label="Iniciar Sesión" />
          </div>
        </div>
      </q-form>
    </div>
  </div>
</template>
<script>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAutenticacionStore } from '../stores/autenticaciones'
import { ID_SERVIDOR } from 'src/constant/servidor'
import { storeToRefs } from 'pinia'

export default {
  setup () {
    const useAutenticacion = useAutenticacionStore()
    const { iniciarSesion, autenticarUsuario } = useAutenticacion
    const { isLogin } = storeToRefs(useAutenticacion)
    const router = useRouter()
    const isPassword = ref(true)
    const formulario = ref(null)

    onMounted(async () => {
      await autenticarUsuario()
      if (isLogin.value) {
        router.push('/principal')
      }
    })

    const usuarioObj = reactive({
      usuario: '',
      contrasena: '',
      portal: ID_SERVIDOR
    })

    const login = async () => {
      try {
        if (await formulario.value.validate()) {
          await iniciarSesion(usuarioObj)
          router.push('/principal')
        }
      } catch (error) {
        // mostrarNotificacion(error);
        console.log(error)
      }
    }

    return {
      usuarioObj,
      isPassword,
      login,
      formulario,
      isLogin
    }
  }
}
</script>

<style scoped>
h1 {
  margin-top: 0;
}

.contenedor-login {
  background-color: #f3f4f6;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
.centrar-circular-progres{
  display: flex;
  height: 100vh;
  justify-content: center;
  align-items: center;
}
</style>
