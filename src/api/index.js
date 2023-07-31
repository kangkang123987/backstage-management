// 统一引入每个模块的所有接口，然后统一暴露
import * as Attr from "@/api/product/Attr";
import * as Sku from "@/api/product/Sku";
import * as tradeMark from "@/api/product/tradeMark";
import * as Spu from "@/api/product/Spu";
import * as User from "@/api/acl/User";
import * as Role from "@/api/acl/Role";
import * as Menu from "@/api/acl/Menu";

export default {
  Attr,
  Sku,
  tradeMark,
  Spu,
  User,
  Role,
  Menu,
};
