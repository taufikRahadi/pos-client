<template>
  <div>
    <CRow>
      <CCol>
        <CCard>
          <CCardHeader>
            <CRow>
              <CCol col="11">
                Transactions
              </CCol>
            </CRow>
          </CCardHeader>

          <CCardBody>
            <CDataTable
              hover
              :items="orders"
              :fields="fields"
              :items-per-page="10"
              :loading="tableLoading"
              sorter
              column-filter
              :pagination="{ doubleArrow: false, align: 'center' }"
            >
              <template #status="data">
                <td>
                  <CBadge :color="data.item.status === 'waiting' ? 'danger' : 'success'">
                    {{ data.item.status }}
                  </CBadge>
                </td>
              </template>
              <template #price="data">
                <td>
                  {{ convertToIDR(data.item.price) }}
                </td>
              </template>
              <template #user="data">
                <td class="font-weight-bold">
                  {{ data.item.user.fullName }}
                </td>
              </template>
              <template #actions="{item, index}">
                <CButton @click="toggleCollapse(item, index)" size="sm" color="info" variant="outline" class="mr-2">
                  Show
                </CButton>
              </template>
              <template #details="{item}">
                <CCollapse :show="Boolean(item._toggled)" :duration="collapseDuration">
                  <CCardHeader>
                    Order Details  
                  </CCardHeader>
                  <CCardBody>
                    <CDataTable 
                      :items="item.orderDetails"
                      :fields="orderDetailFields"
                      border
                    >
                      <template #price="{item: detail}">
                        <td>
                          {{ convertToIDR(detail.price) }}
                        </td>
                      </template>
                      <template #product="{item: detail}">
                        <td>
                          {{ detail.product.name }}
                        </td>
                      </template>
                    </CDataTable>
                  </CCardBody>

                  <CCardHeader>
                    Payment Detail
                  </CCardHeader>
                  <CCardBody>
                    <CDataTable
                      :fields="paymentDetailFields"
                      :items="item.payments"
                      border
                    >
                      <template #status="{item: payment}">
                        <td>
                          <CBadge :color="payment.status === 'waiting' ? 'danger' : 'success'">
                            {{ payment.status }}
                          </CBadge>
                        </td>
                      </template>
                    </CDataTable>
                  </CCardBody>
                </CCollapse>
              </template>
            </CDataTable>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  </div>
</template>

<script>
import httpService from '../../helpers/http'
export default {
  data: () => ({
    orders: [],
    fields: [
      { key: 'id', label: 'ID', _classes: 'font-weight-bold' },
      { key: 'price', label: 'Price' },
      { key: 'status', label: 'Status' },
      { key: 'user', label: 'User' },
      { key: 'createdAt', label: 'Created At' },
      { key: 'actions', label: '', sorter: false, filter: false }
    ],
    orderDetailFields: [
      { key: 'product', label: 'Product' },
      { key: 'qty', label: 'QTY' },
      { key: 'price', label: 'Price' }
    ],
    paymentDetailFields: [
      { key: 'provider', label: 'Provider' },
      { key: 'status', label: 'Status' }
    ],
    itemsPerPage: 10,
    tableLoading: true,
    collapseDuration: 0,
  }),
  methods: {
    test(val) {
      console.log(val)
      return ''
    },
    toggleCollapse(item, index) {
      this.$set(this.orders[index], '_toggled', !item._toggled)
      this.collapseDuration = 300
      this.$nextTick(() => { this.collapseDuration = 0 })
    },
    convertToIDR(number) {
      return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number)
    },
    fetchOrders() {
      httpService.get('/v1/order', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accesstoken')}`
        }
      })
        .then(({ data }) => {
          this.orders = data
          this.tableLoading = false
        })
        .catch(({ response }) => {
          toast(response.data.message, 'error')
          this.tableLoading = false
        })
    }
  },
  mounted() {
    this.fetchOrders()
  }
}
</script>
