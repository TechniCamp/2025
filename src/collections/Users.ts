import { User } from '@/payload-types'
import type { Access, CollectionConfig } from 'payload'

const selfAccess: Access<User> = ({ data, req: { user } }) => {
  if (process.env.NODE_ENV === 'development') return true
  if (!user || !data) return false
  if (user.id === data.id) return true
  return false
}

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  access: {
    create: () => true,
    read: ({ req: { user } }) => !!user,
    update: selfAccess,
    delete: selfAccess,
    admin: () => process.env.NODE_ENV === 'development',
  },
  fields: [],
}
