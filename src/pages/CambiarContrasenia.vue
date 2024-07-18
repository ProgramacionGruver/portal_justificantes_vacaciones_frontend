<template>
  <q-layout class="layout--registrarse">
    <q-card style="width: 35vw; border-radius: 2%; padding: 3rem">
      <q-card-section>
        <div style="width: 100%">
          <img
            src="../img/logoGruver.png"
            alt="Logo Gruver"
            style="width: 100%; height: 100%"
          />
        </div>
      </q-card-section>
      <q-card-section class="q-mt-md">
        <div style="display: block; width: 100%">
          <p class="text-center text-h4">
            Estimado(a) colaborador(a): <strong>{{ objUsuario.nombre }}</strong
            >, le pedimos por favor que cambie su contraseña.
          </p>
          <q-input
            v-model="contrasenia"
            filled
            :type="isPassword ? 'password' : 'text'"
            label="Ingresa su nueva contraseña"
            lazy-rules
            :rules="[
              (val) =>v
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
          <q-input
            v-model="confirmarContrasenia"
            filled
            :type="isPassword2 ? 'password' : 'text'"
            label="Confirmar contraseña"
            lazy-rules
            :rules="[
              (val) =>
                (val && val.length > 0) || 'Debes ingresar una contraseña' ,
            ]"
          >
            <template v-slot:append>
              <q-icon
                :name="isPassword2 ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPassword2 = !isPassword2"
              />
            </template>
          </q-input>
          <div
            style="
              width: 100%;
              display: flex;
              justify-content: center;
              align-items: center;
            "
          >
            <q-btn
              color="primary"
              label="Registrar contraseña"
              icon="done"
              @click="registrar"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-layout>
</template>

<script>
import { storeToRefs } from "pinia";
import { ID_SERVIDOR } from "src/constant/servidor";
import { notificacion } from "src/helpers/mensajes";
import { useAutenticacionStore } from "src/stores/autenticaciones";
import { ref } from "vue";
import { useRouter } from "vue-router";

export default {
  setup() {
    const useAutenticaciones = useAutenticacionStore();
    const { registrarContrasenia, iniciarSesionNumEmpleado } = useAutenticaciones;
    const { objUsuario, infoUsuario } = storeToRefs(useAutenticaciones);

    const router = useRouter();

    const contrasenia = ref("");
    const confirmarContrasenia = ref("");

    const isPassword = ref(true);
    const isPassword2 = ref(true);

    const registrar = async () => {
      if (contrasenia.value !== confirmarContrasenia.value) {
        notificacion('warning', 'Las contraseñas no coinciden');
        return;
      }

      if (contrasenia.value === 'Soporte1') {
        notificacion('warning', 'La contraseña no puede ser igual a la generica');
        return;
      }

      await registrarContrasenia(
        objUsuario.value.idUsuario,
        contrasenia.value,
      );

      try {
        const infoUsuarioInicarSesion = {
          noEmpleado: infoUsuario.value.usuario.numero_empleado,
          contrasena: infoUsuario.value.contrasenia,
          portal: ID_SERVIDOR,
        }

        await iniciarSesionNumEmpleado(infoUsuarioInicarSesion);
        router.push("/principal");
      } catch (error) {
        console.log(error);
      }
    }

    return {
      // States
      objUsuario,
      contrasenia,
      confirmarContrasenia,
      isPassword,
      isPassword2,
      // Methods
      registrar
    };
  },
};
</script>

<style>
.layout--registrarse {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  overflow: hidden !important;
  background-color: #f3f4f6;
}
</style>
