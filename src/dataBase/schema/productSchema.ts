import { tableSchema } from "@nozbe/watermelondb";
export const productSchema = tableSchema({
    name: "product",
    columns: [
        { name: "name_product", type: "string" },
        { name: "qtd", type: "number" },
        { name: "file_photo", type: "string" },
        { name: "created_at", type: "number" },
        { name: "updated_at", type: "number" },
    ],
});
