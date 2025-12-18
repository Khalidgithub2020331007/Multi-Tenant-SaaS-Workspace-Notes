import { HttpContext } from '@adonisjs/core/http'
import TagService from '../tags/tags.service.js'
import { tagCreateValidator, tagDeleteValidator } from '../tags/tags.validator.js'

export default class TagController {
  private service: TagService

  constructor() {
    this.service = new TagService()
  }

  /**
   * Create a new tag
   */
  public async create_tag({ request, response, auth }: HttpContext) {
    try {
      const user = auth.user
      if (!user) {
        throw new Error('User not authenticated')
      }
      const payload = await request.validateUsing(tagCreateValidator)

      const result = await this.service.createTag(payload.tag_name, user!.email, user!)

      return response.created({
        message: result.message,
        tag: result.tag,
      })
    } catch (error) {
      return response.badRequest({
        message: 'Tag creation failed',
        errors: error.messages || error.message,
      })
    }
  }
  public async delete_tag({ request, response, auth }: HttpContext) {
    try {
      const user = auth.user
      if (!user) {
        throw new Error('User not authenticated')
      }
      const payload = await request.validateUsing(tagDeleteValidator)
      const result = await this.service.deleteTag(payload.tag_name, user!.email, user!.role)

      return response.created({
        message: result.message,
        tag: result.tag,
      })
    } catch (error) {
      return response.badRequest({
        message: 'Tag deletion failed',
        errors: error.messages || error.message,
      })
    }
  }
}
