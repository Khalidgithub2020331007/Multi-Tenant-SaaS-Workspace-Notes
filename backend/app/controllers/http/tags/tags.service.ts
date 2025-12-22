import Tag from '#models/tag'
import User from '#models/user'

export default class TagsService {
  public async createTag(tag_name: string, user: User) {
    try {
      if (user.role !== 'owner') {
        throw new Error('Only owner can create a tag')
      }
      const existingTag = await Tag.query()
        .where('tag_name', tag_name)
        .andWhere('company_hostname', user.company_hostname)
        .first()
      if (existingTag) {
        throw new Error('Tag already exists for this user')
      }

      // Create a new tag
      const tag = new Tag()
      tag.tag_name = tag_name
      tag.company_hostname = user.company_hostname
      await tag.save()

      return {
        message: 'Tag created successfully',
        tag,
      }
    } catch (error) {
      throw new Error(`Failed to create tag: ${error.message}`)
    }
  }
  public async deleteTag(tag_name: string, company_owner_email: string, user_role: string) {
    try {
      const existingTag = await Tag.query()
        .where('tag_name', tag_name)
        .andWhere('company_owner_email', company_owner_email)
        .first()
      if (!existingTag) {
        throw new Error('Tag does not exist for this company')
      }
      if (user_role !== 'owner') {
        throw new Error('Only owner can delete a tag')
      }

      await existingTag.delete()

      return {
        message: 'Tag deleted successfully',
        tag: existingTag,
      }
    } catch (error) {
      throw new Error(`Failed to delete tag: ${error.message}`)
    }
  }
  public async get_all_tags(user: User) {
    try {
      const tags = await Tag.query()
        .select('*')
        .where('company_hostname', user.company_hostname)
        .orderBy('created_at', 'desc')
      console.log('Tags fetched:', tags)

      return {
        message: 'Tags fetched successfully',
        tags,
      }
    } catch (error) {
      throw new Error(`Failed to fetch tags: ${error.message}`)
    }
  }
}
