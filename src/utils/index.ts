export { default as getIdUtil } from "./getId.util"
export { default as getTimestampUtil } from "./getTimestamp.util"
export { default as filterInputUtil } from "./filterInput.util"
export { default as timeUtil } from "./time.util"
export { default as kebabcaseUtil } from "./kebabcase.util"
export { default as queryHelperUtil } from "./queryHelper.util"
export { default as createLocalVueTestUtil } from "./createLocalVue.test.util"
export { default as dbTestUtil } from "./db.test.util"
export { default as randomArrayItemUtil } from "./randomArrayItem.util"
export { default as openExternalUrlUtil } from "./openExternalUrl.util"
export { default as printUtil } from "./print.util"
export { default as promiseSequenceUtil } from "./promiseSequence.util"
// export { default as mockQueriesTestUtil } from "./mockQueries.test.util"
// export { default as mountTestUtil } from "./mount.test.util"
// export { default as mockServiceTestUtil } from "./mockService.test.util"

export const sortCollator = new Intl.Collator("no-nb", { usage: "sort" })
