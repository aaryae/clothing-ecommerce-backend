import { IUser } from '../interface/user.interface'
import Product from '../models/product.model'
import User from '../models/user.model'
import HttpException from '../utils/HttpException.utils'

import BcryptService from './bcrypt.service'

class AdminService {

  constructor(private readonly bcrpytService = new BcryptService()) {}

  async getAll(page: number, perpage: number) {
    const query = User.find({ role: { $ne: 'ADMIN' } })
      .select('id name email phone role')
      .sort('createdAt')
      .skip((page - 1) * perpage)
      .limit(perpage)

    const data = await query.exec()
    const total = await User.countDocuments({ role: { $ne: 'ADMIN' } })

    return { data, total }
  }

  async addProducts(data: IUser) {
    try {
        const userResponse = await Product.create(data)
    } catch (error: any) {
      throw HttpException.badRequest(error?.message)
    }
  }

  async deleteUser(id: string) {
    
    const user = await User.findById(id)

    if (user?.role === 'ADMIN') {
      throw HttpException.forbidden('Admin cannot be deleted.')
    }

    await User.deleteOne({ _id: id })
    return null
  }
}

export default new AdminService()
