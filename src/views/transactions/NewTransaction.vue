<template>
  <div>
    <CRow>
      <CCol
        col="8"
      >
        <CCard>
          <CCardHeader>
            Create New Transaction
          </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol col="8">
                <CSelect
                  :options="products"
                  :value.sync="selected"
                  placeholder="Select Product"
                >
                </CSelect>
              </CCol>
              <CCol>
                <CButton
                  size="sm"
                  color="info"
                  @click="fetchProductById"
                >
                  Add
                </CButton>
              </CCol>
            </CRow>
            <CRow>
              <CCol col="12" v-for="(product, i) in productSelected" :key="product.id">
                <CCardBody>
                  <CRow>
                    <CCol col="3">
                      <CImg width="200" :src="`http://localhost:8080/photo/inventory/${product.picture}`"></CImg>
                    </CCol>
                    <CCol>
                      {{ product.name }}
                    </CCol>
                    <CCol class="font-weight-bold">
                      {{ convertToIDR(product.price) }}
                    </CCol>
                    <CCol>
                      <CRow>
                        <CCol col="1">
                          <CButton @click="decrease(i)" size="sm" color="danger">
                            -
                          </CButton>
                        </CCol>
                        <CCol col="1" class="text-center font-weight-bold">
                          {{ product.qty }}
                        </CCol>
                        <CCol @click="increase(i)" col="1">
                          <CButton size="sm" color="danger">
                            +
                          </CButton>
                        </CCol>
                      </CRow>
                    </CCol>
                  </CRow>
                </CCardBody>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol
        col="4"
      >
        <CCard>
          <CCardHeader>
            Order Detail
          </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol col="4">
                Total
              </CCol>
              <CCol class="font-weight-bold" col="8">
                {{ convertToIDR(totalPrice) }}
              </CCol>

              <CCol col="4" class="my-2">
                Pembayaran
              </CCol>

              <CCol col="8" class="my-2">
                <CSelect
                  :options="pembayaran"
                  :value.sync="selectedPembayaran"
                />
              </CCol>

              <CCol class="mt-5">
                <CButton @click="bayar" :disabled="totalPrice <= 0" size="sm" color="success">
                  Bayar
                </CButton>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>

    </CRow>

    <CModal
      :title="payment.id"
      size="lg"
      centered
      :show.sync="showQr"
    >
      <CImg 
        :src="qrUrl"
      />

      <template v-slot:footer>
        <CRow>
            <CButton @click="getEWalletStatus" color="primary">
              Konfirmasi
            </CButton>
          </CRow>
      </template>
    </CModal> 

    <CModal
      :title="payment.id"
      size="lg"
      :show.sync="showPaymentModal"
    >
      <CRow>
        <CCol col="6">
          <h1>Total</h1>
        </CCol>
        <CCol col="6">
          <h1 class="font-weight-bold">{{ convertToIDR(payment.amount) }}</h1>
        </CCol>

        <CCol col="6">
          <h1>Masukkan Jumlah Uang</h1>
        </CCol>
        <CCol col="6">
          <CInput 
            type="number"
            v-model="jumlahUang"
          />
        </CCol>

        <CCol col="6">
          <h1>Kembalian</h1>
        </CCol>
        <CCol col="6">
          <h1 class="font-weight-bold"> 
            {{ convertToIDR(kembalian) }}
          </h1>
        </CCol>
      </CRow>
      <template v-slot:footer>
        <CRow>
            <CButton @click="konfirmasiCash" color="primary">
              Submit
            </CButton>
          </CRow>
      </template>
    </CModal>
  </div>
</template>

<script>
import httpService from '../../helpers/http'
import { toast } from '../../helpers/swal';
export default {
  data: () => ({
    products: [],
    selected: '',
    productSelected: [],
    totalPrice: 0,
    jumlahUang: 0,
    showPaymentModal: false,
    showQr: false,
    pembayaran: [
      {
        value: 'cash',
        label: 'Cash'
      },
      {
        value: 'shopee',
        label: 'Shopee'
      },
      {
        value: 'gopay',
        label: 'Gopay'
      },
      {
        value: 'ovo',
        label: 'OVO'
      }
    ],
    selectedPembayaran: 'cash',
    payment: {},
    qrUrl: '',
    getStatusUrl: ''
  }),
  computed: {
    kembalian: function() {
      const kembalian = this.jumlahUang - this.payment.amount

      return kembalian > 0 ?  kembalian : 0
    }
  },
  methods: {
    getEWalletStatus() {
      http.
    },
    konfirmasiEWallet() {
      httpService.post('/v1/payment/checkout-ewallet', {
        paymentId: this.payment.id
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accesstoken')}`
        }
      })
        .then(({ data }) => {
          this.payment = {}
          this.productSelected = []
          this.selected = ''
          this.showPaymentModal = false
          this.totalPrice = 0
          this.jumlahUang = 0
          this.showQr = true
          this.qrUrl = data.qrCode
          this.getStatusUrl = data.getStatus
        })
        .catch((err) => {
          toast(err.response.data.message, 'error')
        })
    },
    konfirmasiCash() {
      httpService.post('/v1/payment/checkout-cash', {
        paymentId: this.payment.id
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accesstoken')}`
        }
      })
        .then(() => {
          this.payment = {}
          this.productSelected = []
          this.selected = ''
          this.showPaymentModal = false
          this.totalPrice = 0
          this.jumlahUang = 0

          toast('Pembayaran Sukses', 'success')
        })
        .catch((err) => {
          toast(err.response.data.message, 'error')
        })
    },
    bayar() {
      const payload = {
        orderDetails: this.productSelected.map((selected) => ({ productId: selected.id, qty: selected.qty, price: selected.price })),
      }
      switch(this.selectedPembayaran) {
        case 'cash':

          httpService.post('/v1/order', payload, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accesstoken')}`
            }
          })
            .then(({ data }) => {
              httpService.post('/v1/payment', {
                orderId: data.id,
                provider: this.selectedPembayaran
              }, {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem('accesstoken')}`
                }
              })
                .then(({ data }) => {
                  this.payment = data
                  this.showPaymentModal = true
                })
            })
            .catch((err) => console.error(err))
        default:
          httpService.post('/v1/order', payload, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accesstoken')}`
            }
          })
            .then(({ data }) => {
              httpService.post('/v1/payment', {
                orderId: data.id,
                provider: this.selectedPembayaran
              }, {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem('accesstoken')}`
                }
              })
                .then(({ data }) => {
                  this.payment = data

                  this.konfirmasiEWallet()
                })
            })
            .catch((err) => console.error(err))
      }
    },
    increase(index) {
      const getPrice = this.productSelected[index].price / this.productSelected[index].qty
      this.productSelected[index].qty++
      this.productSelected[index].price = this.productSelected[index].price + getPrice
      this.getTotalPrice()
    },
    getTotalPrice() {
      let total = 0
      for (let i in this.productSelected) {
        total = total + this.productSelected[i].price
      }
      this.totalPrice = total
    },  
    decrease(index) {
      const getPrice = this.productSelected[index].price / this.productSelected[index].qty
      if (this.productSelected[index].qty > 1) {
        this.productSelected[index].qty--
        this.productSelected[index].price = this.productSelected[index].price - getPrice
      } else {
        this.productSelected.splice(index, 1)
      }

      this.getTotalPrice()
    },
    fetchProductById() {
      if (this.selected)
        httpService.get(`/v1/inventory/${this.selected}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accesstoken')}`
          }
        })
          .then(({ data }) => {
            const productSelected = { id: data.id, name: data.name, qty: 1, price: data.price, picture: data.picture }
            const findInSelectedProduct = this.productSelected.findIndex(p => p.id === data.id)

            if (findInSelectedProduct < 0) {
              this.productSelected.push(productSelected)
            } else { 
              const indext = this.productSelected.findIndex(p => p.id === data.id)
              this.productSelected[indext] = {
                id: data.id,
                name: data.name,
                qty: this.productSelected[indext].qty + 1,
                price: this.productSelected[indext].price * (this.productSelected[indext].qty + 1)
              }
            }

            let total = 0
            for (let i in this.productSelected) {
              total = total + this.productSelected[i].price
            }
            this.totalPrice = total
            this.selected = ''
          })
          .catch((err) => {
            console.log(err);
            // toast(err.response.data.message, 'error')
          })
    },
    convertToIDR(number) {
      return new Intl.NumberFormat('id-ID', { style: 'currency', 'currency': 'IDR' }).format(number)
    },
    fetchProducts() {
      httpService.get('/v1/inventory', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accesstoken')}`
        }
      })
        .then(({ data }) => {
          this.products = data.map(inventory => ({ value: inventory.id, label: `${inventory.name} - ${this.convertToIDR(inventory.price)}` }))
        })
    }
  },
  mounted() {
    this.fetchProducts()
  }
}
</script>
