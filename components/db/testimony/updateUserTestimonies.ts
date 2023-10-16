import {
  collection,
  collectionGroup,
  getDocs,
  query,
  updateDoc,
  where,
  writeBatch
} from "firebase/firestore"
import { firestore } from "../../firebase"

// Updates the displayName for all testimonies under specified user
export const updateUserDisplayNameTestimonies = async (
  uid: string,
  displayName: string
) => {
  const batch = writeBatch(firestore)
  return getAllTestimony(uid).then(({ publishedTestimony, draftTestimony }) => {
    publishedTestimony.forEach(doc =>
      batch.update(doc.ref, { authorDisplayName: displayName })
    )
    draftTestimony.forEach(doc =>
      batch.update(doc.ref, { authorDisplayName: displayName })
    )
    batch.commit().then(result => result)
  })
}

export const getAllTestimony = async (uid: string) => {
  // Get all the published testimony under user
  const pTestimony = getDocs(
    query(
      collectionGroup(firestore, "publishedTestimony"),
      where("authorUid", "==", uid)
    )
  )
  // Get all the draft testimony under user
  const dTestimony = getDocs(
    collection(firestore, `users/${uid}/draftTestimony`)
  )

  const [publishedTestimony, draftTestimony] = await Promise.all([
    pTestimony,
    dTestimony
  ])

  return {
    publishedTestimony: publishedTestimony,
    draftTestimony: draftTestimony
  }
}
