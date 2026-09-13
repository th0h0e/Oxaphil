import { property, z } from '@nuxt/content'

// Shape is read from TestFeature.vue's props rather than declared here, so
// adding a prop to that component is enough to expose it in Studio.
// `.inherit()` expects an object field and replaces its editor options, so the
// sub-labels come from the JSDoc comments on TestFeature.vue's props.
export const testFeatureSchema = z.object({
  testFeature: property(z.object({})).inherit('app/components/content/TestFeature.vue')
})
