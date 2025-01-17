import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import BaseController from '#core/base_controller'
import UserStatus from '#models/user_status'
import { existsRule } from '#rules/exists'

export default class UserStatusesController extends BaseController {
  /**
   * Display a list of resource
   */
  async index({ request }: HttpContext) {

    const params = request.all()

    let query: any = {
      table_and_join: 'from user_statuses',
      field_show: [
        'id',
        'user_status_name',
        'user_status_description',
      ],
      field_search: ['user_status_name'],
      pagination: true,
    }

    const result = await this.query.generate(params, query, this.db)
    this.responseList('Users retrieved successfully', result)
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request }: HttpContext) {
    const payload = request.body()
    const validator = vine.compile(
      vine.object({
        userStatusName: vine.string(),
        userStatusDescription: vine.string().optional(),
      })
    )
    const output = await validator.validate(payload)
    const data = await UserStatus.create(output)

    this.response('User status created successfully', { item: data })
  }

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {
    const data = await UserStatus.findOrFail(params.id)

    this.response('User status retrieved successfully', { item: data })
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request }: HttpContext) {
    const payload = request.body()
    const validator = vine.compile(
      vine.object({
        id: vine.number().use(existsRule({ table: 'user_statuses', column: 'id' })),
        userStatusName: vine.string(),
        userStatusDescription: vine.string().optional(),
      })
    )
    const output = await validator.validate({ id: params.id, ...payload })
    const data = await UserStatus.findOrFail(params.id)

    await data?.merge(output).save()

    this.response('User status updated successfully', { item: data })
  }

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {
    const data = await UserStatus.findOrFail(params.id)
    await data?.delete()

    this.response('User status deleted successfully')
  }
}
