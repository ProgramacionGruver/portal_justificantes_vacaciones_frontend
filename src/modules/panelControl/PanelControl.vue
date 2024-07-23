<template>
  <q-layout>
    <div class="q-pa-md">
      <h2 class="q-ml-md">Panel de control</h2>
      <q-separator color="primary" class="q-my-md" inset />
      <div class="permisos">
        <div class="permisos__left q-ml-md">
          <div class="text-h4 q-mb-sm">Lista de modulos</div>
          <q-input
            outlined
            dense
            v-model="buscarModulos"
            label="Buscar modulo"
            class="q-mb-md"
            @keyup.enter="filtrarModulos"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
          <q-list bordered class="rounded-borders text-primary">
            <q-item
              v-for="modulo in modulosFiltrados"
              :key="modulo.name"
              clickable
              v-ripple
              :active="moduloSeleccionado === modulo.name"
              active-class="bg-primary text-white"
              @click="seleccionModulo(modulo.name)"
            >
              <q-item-section avatar>
                <q-icon :name="modulo.icono" />
              </q-item-section>

              <q-item-section style="display: grid; grid-template-columns: 1.5fr 0.5fr; column-gap: 4rem;">
                <div>
                  <span>{{ modulo.label }}</span>
                </div>
                <div style="position: relative">
                  <q-avatar
                    v-for="(usuario, index) in usuariosModulos[modulo.name]?.slice(0, 3)"
                    :key="index"
                    size="3rem"
                    :style="{ position: 'absolute', left: `${index * 1.5}rem` }"
                  >
                    <img :src="obtenerURLImage(usuario.numero_empleado)">
                  </q-avatar>

                  <q-avatar
                    v-if="usuariosModulos[modulo.name]?.length > 3"
                    size="3rem"
                    color="primary"
                    :style="{ position: 'absolute', left: '4.5rem' }"
                    class="text-white"
                  >
                  <span>
                    +{{ usuariosModulos[modulo.name]?.length - 3 }}
                  </span>
                  </q-avatar>
                </div>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
        <div class="permisos__right q-mr-md">
          <q-table
            grid
            flat
            bordered
            v-if="moduloSeleccionado"
            :rows="usuariosAcceso"
            :columns="columns"
            row key="nombre"
            :filter="buscarUsuario"
            hide-header
            :rows-per-page-options="[15]"
          >
            <template v-slot:top-right>
              <q-input
                outlined
                dense
                v-model="buscarUsuario"
                label="Buscar usuario"
              >
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
              <q-btn
                color="primary"
                label="Gestionar permisos de usuarios"
                class="q-ml-md"
                @click="gestionarPermisos(moduloSeleccionado)"
              />
            </template>

            <template v-slot:item="props">
              <div class="q-pa-sm col-md-4">
                <q-card style="height: 16rem; margin: 0.5rem">
                  <q-card-section class="text-center">
                    <q-avatar size="6rem" class="q-mt-md">
                      <img :src="obtenerURLImage(props.row.numero_empleado)">
                    </q-avatar>
                  </q-card-section>

                  <q-card-section>
                    <p style="font-size: small; font-weight: bold; margin-bottom: 0; text-align: center;">{{ props.row.nombre }}</p>
                    <p style="font-size: small; margin-bottom: 0; text-align: center;">{{ props.row.usuario }}</p>
                  </q-card-section>
                </q-card>
              </div>
            </template>
          </q-table>
        </div>
      </div>
    </div>
    <ModalPermisosUsuarios ref="modalPermisos">></ModalPermisosUsuarios>
  </q-layout>
</template>

<script>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useModulosStore } from 'src/stores/permisosModulos.js'
import { useSucursalesStore } from 'src/stores/sucursales.js'
import { obtenerURLImage } from 'src/helpers/abrirURL.js'
import ModalPermisosUsuarios from 'src/components/ModalPermisosUsuarios.vue'

export default {
  components: {
    ModalPermisosUsuarios
  },
  setup() {
    const useModulos = useModulosStore();
    const { usuariosModulos, usuariosAcceso, filtrousuariosAcceso, listaModulos } = storeToRefs(useModulos);

    const useSucursales = useSucursalesStore();
    const { obtenerSucursalesAgrupadasEmpresas } = useSucursales;

    const router = useRouter();

    const buscarModulos = ref('');
    const buscarUsuario = ref('');
    const modulosFiltrados = ref([]);
    const moduloSeleccionado = ref('');
    const usuariosModuloSeleccionando = ref([]);

    const modalPermisos = ref(false);

    const columns = [
      {
        name: 'nombre',
        label: 'Nombre',
        field: 'nombre'
      },
      {
        name: 'usuario',
        label: 'Usuario',
        field: 'usuario'
      }
    ]

    onMounted(async () => {
      listaModulos.value = router.options.routes.find((r) => {
        return r.name === 'principal'
      }).children

      modulosFiltrados.value = listaModulos.value
      await obtenerSucursalesAgrupadasEmpresas()
    });

    const filtrarModulos = () => {
      modulosFiltrados.value = listaModulos.value

      if (buscarModulos.value) {
        modulosFiltrados.value = listaModulos.value.filter((modulo) => modulo.name.toLowerCase().includes(buscarModulos.value.toLowerCase()))
      } else {
        modulosFiltrados.value = listaModulos.value
      }
    }

    const seleccionModulo = (modulo) => {
      if (moduloSeleccionado.value === modulo) {
        moduloSeleccionado.value = ''
        usuariosAcceso.value = [...filtrousuariosAcceso.value]
      } else {
        moduloSeleccionado.value = modulo
        usuariosAcceso.value = usuariosModulos.value[modulo]
      }
    }

    const gestionarPermisos = (modulo) => {
      modalPermisos.value.abrir(listaModulos.value)
    }

    return {
      // States / Vars
      buscarModulos,
      modulosFiltrados,
      moduloSeleccionado,
      columns,
      usuariosModulos,
      usuariosModuloSeleccionando,
      buscarUsuario,
      modalPermisos,
      usuariosAcceso,
      // Methods
      filtrarModulos,
      seleccionModulo,
      obtenerURLImage,
      gestionarPermisos
    }
  }
}
</script>

<style lang="sass" scoped>
.permisos
  display: grid
  gap: 1rem
  grid-template-columns: 0.8fr 1.2fr

.q-card__section--vert
  padding: 0.5rem 0 0.5rem 0
</style>
