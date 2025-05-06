export type UserAddress = {
  street: string
  suite: string
  city: string
  zipcode: string
  geo: {
    lat: number
    lng: number
  }
}

export type UserCompany = {
  name: string
  catchPhrase: string
  bs: string
}

export type User = {
  id: number
  name: string
  username: string
  email: string
  phone: string
  website: string
  address: UserAddress
  company: UserCompany
}
