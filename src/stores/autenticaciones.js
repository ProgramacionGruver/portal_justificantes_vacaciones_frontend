import { defineStore } from 'pinia'
import { apiUsuarios } from 'src/boot/axiosUsuarios'
import { ref } from 'vue'
import { notificacion } from 'src/helpers/mensajes'
import { ca } from 'date-fns/locale'
import { useRouter } from 'vue-router'
import { ID_SERVIDOR } from 'src/constant/servidor'

export const useAutenticacionStore = defineStore('autenticaciones', () => {
  const empleado = ref(null)
  const empleadoAutoriza = ref(null)
  const empleadoPrimeraAutorizacion = ref(null)
  const empleadoSegundaAutorizacion = ref(null)
  const empleadoTerceraAutorizacion = ref(null)
  const usuarioAutenticado = ref(null)
  const isLogin = ref(false)
  const objUsuario = ref(null)
  const infoUsuario = ref(null)
  const router = useRouter();
  const usuarioJefe = ref(false)

  const obtenerEmpleado = async (empleado) => {
    try {
      const { data } = await apiUsuarios.post('/noEmpleado', empleado)
      empleado.value = data
    } catch (error) {
      notificacion('negative', error.response.data.message)
    }
  }

  const obtenerEmpleadoAutoriza = async (empleado) => {
    try {
      const { data } = await apiUsuarios.post('/noEmpleado', empleado)
      empleadoAutoriza.value = data
    } catch (error) {
      // notificacion('negative', error.response.data.message)
    }
  }

  const iniciarSesion = async (usuario) => {
    try {
      const { data } = await apiUsuarios.post('/usuarios/login', usuario)
      isLogin.value = true
      localStorage.setItem('token', data)
    } catch (error) {
      notificacion('negative', error.response.data.message)
    }
  }

  // reseteamos el store de la autenticacion
  const cerrarSesion = async () => {
    try {
      usuarioAutenticado.value = null
      localStorage.removeItem('token')
      isLogin.value = false
    } catch (error) {
      // console.log(error)
    }
  }

  const autenticarUsuario = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      // console.log('No hay token')
      return
    }

    const configuracion = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        idPort: ID_SERVIDOR
      }
    }

    try {
      const { data } = await apiUsuarios.get('/usuarios/perfil', configuracion)
      isLogin.value = true
      usuarioAutenticado.value = { ...data }
    } catch (error) {
      isLogin.value = false
      notificacion('negative', error.response.data.message)
    }
  }

  const obtenerInfoColaborador = async (numero_empleado) => {
    try {
      const { data } = await apiUsuarios.get(`/info/colaborador/${numero_empleado}`)
      objUsuario.value = data
    } catch (error) {
      console.log(error)
    }
  }

  const registrarContrasenia = async (idUsuario, contrasenia) => {
    try {
      const { data } = await apiUsuarios.put('/registrar/contrasenia', { idUsuario, contrasenia })

      infoUsuario.value = {
        contrasenia: data.contrasenia,
        usuario: data.usuario
      }

      notificacion('positive', data.message)
    } catch (error) {
      notificacion('negative', error.response.data.message)
      router.push('/')
    }
  }

  const iniciarSesionNumEmpleado = async (usuario) => {
    try {
      const { data } = await apiUsuarios.post('/usuarios/loginNumEmpleado', { usuario })
      isLogin.value = true
      localStorage.setItem('token', data)
    } catch (error) {
      notificacion('negative', error.response.data.message)
    }
  }

  return {
    empleado,
    obtenerEmpleado,
    empleadoAutoriza,
    empleadoPrimeraAutorizacion,
    empleadoSegundaAutorizacion,
    empleadoTerceraAutorizacion,
    obtenerEmpleadoAutoriza,
    iniciarSesion,
    cerrarSesion,
    autenticarUsuario,
    usuarioAutenticado,
    isLogin,
    objUsuario,
    obtenerInfoColaborador,
    registrarContrasenia,
    iniciarSesionNumEmpleado,
    infoUsuario,
    usuarioJefe
  }
})
