import {
  insert, findMany, destroyOne,
  destroyMany, updateOne
} from "@/db/queries"
import { db } from "@/db"
import { filterInputUtil, sortCollator } from "@/utils"
import clubsMembersStub from "./clubs.members.stub"
import { ClubsMembersProperties, ClubsMembersDocument }
  from "./clubs.members.types"

const populate = async (doc: ClubsMembersDocument): Promise<ClubsMembersProperties> => {
  const club = await doc.populate("clubId")
  const member = doc.toJSON()
  if(club) member.club = club.toJSON()
  return member
}

const list = async (filter: ClubsMembersProperties): Promise<{
  items: ClubsMembersProperties[],
  count: number
}> => {
  const { items, count } = await findMany<ClubsMembersDocument>(db.clubs_members, filter)
  const populated = await Promise.all(items.map(populate))
  return {
    count: count,
    items: populated.sort((a, b) => {
      return sortCollator.compare(a.firstName, b.firstName)
    })
  }
}

const create = async (item: ClubsMembersProperties): Promise<
  ClubsMembersProperties
> => {
  const data = filterInputUtil<ClubsMembersProperties, any>(
    item, clubsMembersStub
  )
  const result = await insert<ClubsMembersDocument>(
    db.clubs_members, data, true
  )
  return result
}

const removeOne = async (clubMember: { id: string }): Promise<true> => {
  await destroyOne<ClubsMembersProperties>(
    db.clubs_members, { id: clubMember.id }
  )
  return true
}

const removeMany = async (items: { id: string }[]): Promise<true> => {
  const filter = { id: { $in: items.map(({ id }) => id) } }
  await destroyMany<any>(db.clubs_members, filter)
  return true
}

const editOne = async (item: ClubsMembersProperties): Promise<
  ClubsMembersProperties
> => {
  const filter = { id: item.id }
  const data = filterInputUtil<ClubsMembersProperties, any>(
    item, clubsMembersStub
  )
  const result = await updateOne<ClubsMembersDocument>(
    db.clubs_members, filter, data, true
  )
  return result
}

export default {
  list,
  create,
  removeOne,
  removeMany,
  editOne
}
