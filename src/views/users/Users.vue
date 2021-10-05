<template>
  <div>
    <CRow>
      <CCol col="12" xl="12" md="12">
        <CCard>
          <CCardHeader>
            <CRow>
              <CCol col="11">
                Users
              </CCol>
              <CCol col="1">
                <CButton @click="showModal = true" color="primary">
                  Add User
                </CButton>
              </CCol>
            </CRow>
          </CCardHeader>
          <CCardBody>
            <CDataTable
              hover
              striped
              :items="items"
              :fields="fields"
              :items-per-page="itemsPerPage"
              items-per-page-select
              column-filter
              sorter
              :loading="tableLoading"
              :pagination="{ doubleArrows: false, align: 'center'}"
              @page-change="pageChange"
              :active-page="activePage"
            >
              <template #status="data">
                <td>
                  <CBadge :color="getBadge(data.item.status)">
                    {{data.item.status}}
                  </CBadge>
                </td>
              </template>
              <template #actions="{item}">
                <CButton @click="showUpdateModal(item)" size="sm" color="warning" class="mr-2">
                  Edit
                </CButton>
                <CButton @click="deleteData(item.id)" size="sm" color="danger" class="">
                  Delete
                </CButton>
              </template>
            </CDataTable>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
    <CModal
      title="Create User Form"
      size="lg"
      :show.sync="showModal"
    >
      <CForm>
        <CRow>
          <CCol col="6" sm="12">
            <CInput
              v-model="formData.fullName"
              label="Full Name"
              placeholder="Enter Fullname"
            />
          </CCol>
          <CCol col="6" sm="12">
            <CInput
              v-model="formData.username"
              label="Username"
              placeholder="Enter Username"
            />
          </CCol>
          <CCol col="6" sm="6">
            <CInput
              v-model="formData.password"
              label="Password"
              placeholder="Enter Password"
              type="password"
            />
          </CCol>
          <CCol col="6" sm="6">
            <CInput
              label="Confirm Password"
              v-model="formData.confirmPassword"
              placeholder="Enter Password Confirmation"
              type="password"
            />
          </CCol>
          <CCol col="12" sm="12">
            <CSelect
              label="Role"
              :value.sync="formData.role"
              placeholder="Select Role"
              :options="roles"
            />
          </CCol>
        </CRow>
      </CForm>
        <template v-slot:footer>
          <CRow>
            <CButton @click="formSubmit" color="primary">
              Submit
            </CButton>
            <CButton @click="showModal = false" color="default">
              Cancel
            </CButton>
          </CRow>
        </template>
    </CModal>
  </div>
</template>

<script>
import httpService from '../../helpers/http'
import { confirmAlert, toast } from '../../helpers/swal'

export default {
  name: 'Users',
  data () {
    return {
      items: [],
      showModal: false,
      isEdit: false,
      roles: [
        {
          value: 'admin',
          label: 'ADMIN'
        },
        {
          value: 'kasir',
          label: 'KASIR'
        }
      ],
      fields: [
        { key: 'id', _classes: 'font-weight-bold' },
        { key: 'username' },
        { key: 'fullName', label: 'Fullname' },
        { key: 'role' },
        { key: 'createdAt', label: 'Created At' },
        { key: 'updatedAt', label: 'Updated At' },
        { key: 'actions', label: '', sorter: false, filter: false }
      ],
      activePage: 1,
      tableLoading: true,
      itemsPerPage: 10,
      formData: {
        id: '',
        fullName: '',
        username: '',
        password: '',
        confirmPassword: '',
        role: '',
      }
    }
  },
  watch: {
    showModal: function(newVal, oldVal) {
      if (!newVal) { 
        this.formData = {
          id: '',
          fullName: '',
          username: '',
          password: '',
          confirmPassword: '',
          role: '',
        }
        this.isEdit = false
      }
    }
  },
  methods: {
    formSubmit() {
      this.isEdit ? this.updateUser() : this.createUser()
    },
    showUpdateModal(data) {
      this.showModal = true
      this.isEdit = true
      this.formData = data
    },
    createUser() {
      const payload = {
        fullName: this.formData.fullName,
        username: this.formData.username,
        password: this.formData.password,
        confirmPassword: this.formData.confirmPassword,
        role: this.formData.role
      }
      httpService.post(`/v1/user`, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accesstoken')}`
        }
      })
        .then(() => {
          this.showModal = false
          toast('User Created Successfully', 'success')
        })
        .catch(err => {
          console.log(err)
          toast(err.response.data.message, 'error')
        })
        .finally(() => {
          this.fetchUser()
        })
    },
    fetchUser() {
      httpService.get(`/v1/user`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accesstoken')}`
        }
      })
        .then(({ data }) => {
          this.items = data
        })
        .finally(() => {
          this.tableLoading = false
        })
    },
    updateUser() {
      httpService.put('/v1/user/' + this.formData.id, this.formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accesstoken')}`
        }
      })
        .then((res) => {
          toast('User Update Successfully', 'success')
        })
        .finally(() => {
          this.showModal = false
          this.fetchUser()
        })
    },
    deleteData(id) {
      confirmAlert().then((result) => {
        if (result.isConfirmed)
          httpService.delete('/v1/user/' + id, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accesstoken')}`
            }
          })
            .then((res) => {
              this.fetchUser()
            })
            .catch(err => console.error(err))
            .finally(() => toast('User Removed', 'success'))
      })
    },
    rowClicked (item, index) {
      console.log(item)
      this.$router.push({path: `users/${index + 1}`})
    },
    pageChange (val) {
      this.activePage = val
      this.fetchUser(val)
    }
  },
  mounted() {
    this.fetchUser()
  }
}
</script>
