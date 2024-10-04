import { Database } from "@nozbe/watermelondb";
import SQLiteAdapter from "@nozbe/watermelondb/adapters/sqlite";

import { schemas } from "./schema";
import { ProductModel } from "./model/productModel";

const adapter = new SQLiteAdapter({
    schema: schemas,
});

export const database = new Database({
    adapter,
    modelClasses: [ProductModel],
});
