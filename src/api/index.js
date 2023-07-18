// 统一引入每个模块的所有接口，然后统一暴露
import * as Attr from "@/api/product/Attr";
import * as Sku from "@/api/product/Sku";
import * as tradeMark from "@/api/product/tradeMark";
import * as Spu from "@/api/product/Spu";
export default {
  Attr,
  Sku,
  tradeMark,
  Spu,
};
