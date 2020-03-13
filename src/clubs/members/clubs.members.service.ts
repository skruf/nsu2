import {
  insert, findMany, destroyOne,
  destroyMany, updateOne
} from "@/db/queries"
import { filterInputUtil } from "@/utils"
import { ClubsMembersProperties, ClubsMembersDocument } from "./clubs.members.types"
import clubsMembersStub from "./clubs.members.stub"

const populate = async (doc: ClubsMembersDocument): Promise<ClubsMembersProperties> => {
  const club = await doc.populate("clubId")
  const member = doc.toJSON()
  if(club) member.club = club.toJSON()
  return member
}

const list = async (filter: ClubsMembersProperties | {}): Promise<{
  items: ClubsMembersProperties[],
  count: number
}> => {
  const { items, count } = await findMany<ClubsMembersDocument>("clubs_members", filter)
  const populated = await Promise.all(items.map((doc) => populate(doc)))
  return {
    items: populated,
    count
  }
}

const create = async (item: ClubsMembersProperties): Promise<
  ClubsMembersProperties
> => {
  const data = filterInputUtil<ClubsMembersProperties, any>(
    item, clubsMembersStub
  )
  const result = await insert<ClubsMembersDocument>(
    "clubs_members", data, true
  )
  return result
}

const removeOne = async (clubMember: { id: string }): Promise<true> => {
  await destroyOne<ClubsMembersProperties>(
    "clubs_members", { id: clubMember.id }
  )
  return true
}

const removeMany = async (items: { id: string }[]): Promise<true> => {
  const filter = { id: { $in: items.map(({ id }) => id) } }
  await destroyMany<any>("clubs_members", filter)
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
    "clubs_members", filter, data, true
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
