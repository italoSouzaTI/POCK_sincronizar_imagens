import { Model } from "@nozbe/watermelondb";
import { field, date } from "@nozbe/watermelondb/decorators";

export class ProductModel extends Model {
    static table = "product";

    @field("name_product")
    name_product!: string;

    @field("qtd")
    qtd!: number;

    @field("file_photo")
    file_photo!: string;

    @date("created_at")
    created_at!: number;

    @date("updated_at")
    updated_at!: number;
}
