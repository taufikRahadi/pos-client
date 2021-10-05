import Vue from 'vue'
import VueSweetalert2 from 'vue-sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css';

Vue.use(VueSweetalert2)

const toast = (message, icon) => {
  Vue.swal({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    icon: icon,
    title: message,
    onOpen: (toast) => {
      toast.addEventListener('mouseenter', Vue.swal.stopTimer)
      toast.addEventListener('mouseleave', Vue.swal.resumeTimer)
    }
  })
}

const alert = (text, icon, title) => {
  Vue.swal({
    icon,
    title,
    text
  })
}

const confirmAlert = () => {
  return Vue.swal({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then(result => result)
}

export { toast, alert, confirmAlert }
