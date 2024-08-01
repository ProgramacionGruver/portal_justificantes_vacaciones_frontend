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
    <div class="informacion-login">
      <div class="portada-login">
        <h1>
          <span>Bienvenido a, </span> Portal de Justificantes, Vacaciones y Días
          económicos
        </h1>
      </div>
      <div class="portada-form">
        <q-tabs
          v-model="tab"
          class="text-h6"
          active-bg-color="primary"
          active-color="white"
          dense
        >
          <q-tab
            name="login_usuario"
            label="Iniciar sesión con nombre de usuario"
            class="portada-tab"
          />
          <q-tab
            name="login_num_empleado"
            label="Iniciar sesión con número de empleado"
            class="portada-tab"
          />
        </q-tabs>

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="login_usuario">
            <q-form
              ref="formulario"
              class="bg-white formulario-login"
              @submit.prevent="login('login_usuario')"
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
                        (val && val.length > 0) ||
                        'Debes ingresar una contraseña',
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
          </q-tab-panel>

          <q-tab-panel name="login_num_empleado">
            <q-form
              ref="formulario"
              class="bg-white formulario-login"
              @submit.prevent="login('login_num_empleado')"
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
                    v-model="usuarioObj.numero_empleado"
                    label="Ingresa tu número de empleado"
                    :rules="[
                      (val) =>
                        (val && val.length > 0) ||
                        'Debes ingresar un nombre de usuario',
                    ]"
                    type="number"
                  >
                    <template v-slot:append>
                      <q-icon name="tag" />
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
                        (val && val.length > 0) ||
                        'Debes ingresar una contraseña',
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
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
  </div>
</template>
<script>
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAutenticacionStore } from "../stores/autenticaciones";
import { ID_SERVIDOR } from "src/constant/servidor";
import { storeToRefs } from "pinia";

export default {
  setup() {
    const useAutenticacion = useAutenticacionStore();
    const { iniciarSesion, autenticarUsuario, obtenerInfoColaborador, iniciarSesionNumEmpleado } =
      useAutenticacion;
    const { isLogin, objUsuario } = storeToRefs(useAutenticacion);
    const router = useRouter();
    const isPassword = ref(true);
    const formulario = ref(null);

    onMounted(async () => {
      await autenticarUsuario();
    });

    const usuarioObj = reactive({
      usuario: "",
      contrasena: "",
      numero_empleado: "",
      portal: ID_SERVIDOR,
    });

    const tab = ref("login_usuario");

    const login = async (origen) => {
      if (origen === "login_usuario") {
        try {
          if (await formulario.value.validate()) {
            await iniciarSesion(usuarioObj);
            router.push("/principal");
          }
        } catch (error) {
          // mostrarNotificacion(error);
          console.log(error);
        }
      } else {
        await obtenerInfoColaborador(usuarioObj.numero_empleado);

        if (usuarioObj.contrasena === "Soporte1") {
          if (
            objUsuario.value.usuario === null ||
            objUsuario.value.usuario === ""
          ) {
            router.push("/cambiar/contrasena");
          } else {
            try {
              const infoUsuarioInicarSesion = {
                noEmpleado: objUsuario.value.numero_empleado,
                contrasena: usuarioObj.contrasena,
                portal: ID_SERVIDOR,
              };

              await iniciarSesionNumEmpleado(infoUsuarioInicarSesion);
              router.push("/principal");
            } catch (error) {
              console.log(error);
            }
          }
        } else {
          try {
            const infoUsuarioInicarSesion = {
              noEmpleado: objUsuario.value.numero_empleado,
              contrasena: usuarioObj.contrasena,
              portal: ID_SERVIDOR,
            };

            await iniciarSesionNumEmpleado(infoUsuarioInicarSesion);
            router.push("/principal");
          } catch (error) {
            console.log(error);
          }
        }
      }
    };

    return {
      usuarioObj,
      isPassword,
      login,
      formulario,
      isLogin,
      tab,
    };
  },
};
</script>
