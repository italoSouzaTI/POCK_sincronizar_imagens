import { appSchema } from "@nozbe/watermelondb";

import { productSchema } from "./productSchema";

export const schemas = appSchema({
    version: 1,
    tables: [productSchema],
});
