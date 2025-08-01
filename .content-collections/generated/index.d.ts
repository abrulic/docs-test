import configuration from "../../content-collections.ts"
import { GetTypeByName } from "@content-collections/core"

export type Section = GetTypeByName<typeof configuration, "section">
export declare const allSections: Array<Section>

export type Page = GetTypeByName<typeof configuration, "page">
export declare const allPages: Array<Page>
