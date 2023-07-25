import request from "@/utils/request";
// 获得spulist列表接口

export const reqSpuList = (page, limit, category3Id) => {
  return request({
    url: `/admin/product/${page}/${limit}`,
    method: "get",
    params: { category3Id },
  });
};

// SpuForm页面的四个接口

// 销售属性接口
export const reqSaleAttrList = () => {
  return request({
    url: "/admin/product/baseSaleAttrList",
    method: "get",
  });
};
// spu信息接口：名称，描述
export const reqSpu = (spuId) => {
  return request({
    url: `/admin/product/getSpuById/${spuId}`,
    method: "get",
  });
};
// 品牌列表接口
export const reqTradeMarkList = () => {
  return request({
    url: "/admin/product/baseTrademark/getTrademarkList",
    method: "get",
  });
};

// spu图片接口
export const reqSpuImageList = (spuId) => {
  return request({
    url: `/admin/product/spuImageList/${spuId}`,
    method: "get",
  });
};

// spu信息的保存接口（更新和添加）
export const reqAddOrUpdateSpu = (spuInfo) => {
  if (spuInfo.id) {
    return request({
      url: "/admin/product/updateSpuInfo",
      method: "post",
      data: spuInfo,
    });
  } else {
    return request({
      url: "/admin/product/saveSpuInfo",
      method: "post",
      data: spuInfo,
    });
  }
};
// 删除spu的操作
export const reqDeleteSpu = (spuId) => {
  return request({
    url: `/admin/product/deleteSpu/${spuId}`,
    method: "delete",
  });
};

// Sku页面的四个接口
// 获取spu图片数据
export const reqspuImageList = (spuId) => {
  return request({
    url: `/admin/product/spuImageList/${spuId}`,
    method: "get",
  });
};

// 获取销售属性的数据

export const reqSkuSaleAttrList = (spuId) => {
  return request({
    url: `/admin/product/spuSaleAttrList/${spuId}`,
    method: "get",
  });
};

// 平台属性的接口
export const reqAttrInfoList = (category1Id, category2Id, category3Id) => {
  return request({
    url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
    method: "get",
  });
};

// 保存sku的接口

export const reqSaveSkuInfo = (skuInfo) => {
  return request({
    url: "/admin/product/saveSkuInfo",
    method: "post",
    data: skuInfo,
  });
};

// 获取sku列表数据（弹出表格展示）

export const reqSkuList = (spuId) => {
  return request({
    url: `/admin/product/findBySpuId/${spuId}`,
    method: "get",
  });
};
