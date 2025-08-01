// content-collections.ts
import { defineCollection, defineConfig } from "@content-collections/core"
import { compileMDX } from "@content-collections/mdx"
import rehypeSlug from "rehype-slug"
import { z } from "zod"

var sectionSchema = z.object({
	title: z.string(),
})
var section = defineCollection({
	name: "section",
	directory: "content",
	include: "**/index.md",
	schema: sectionSchema,
	transform: (document) => {
		const segments = document._meta.path.split("/")
		const version = segments[0]
		const sectionId = segments.length > 1 ? segments[segments.length - 2] : segments[0]
		const cleanedSlug = segments.map((seg) => seg.replace(/^\d{2,}-/, "")).join("/")
		return {
			...document,
			slug: cleanedSlug,
			sectionId,
			version,
		}
	},
})
var pageSchema = z.object({
	title: z.string(),
	summary: z.string(),
	description: z.string(),
	lastUpdated: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/, {
			message: "Date must be in YYYY-MM-DD format",
		})
		.optional(),
	author: z.string().optional(),
})
var page = defineCollection({
	name: "page",
	directory: "content",
	include: "**/**/*.mdx",
	schema: pageSchema,
	transform: async (document, context) => {
		const content = await compileMDX(context, document, {
			rehypePlugins: [rehypeSlug],
		})
		const slug = document._meta.path
		const segments = slug.split("/")
		const section2 = segments[segments.length - 2]
		const rawMdx = document.content.replace(/^---\s*[\r\n](.*?|\r|\n)---/, "").trim()
		const cleanedSlug = segments.map((seg) => seg.replace(/^\d{2,}-/, "")).join("/")
		return {
			...document,
			content,
			slug: cleanedSlug,
			section: section2,
			rawMdx,
		}
	},
})
var content_collections_default = defineConfig({
	collections: [section, page],
})
export { content_collections_default as default }
