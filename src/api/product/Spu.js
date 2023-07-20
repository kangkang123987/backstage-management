import request from "@/utils/request";

export const reqSpuList = (page, limit) => {
  return request({
    url: `/admin/product/${page}/${limit}`,
    method: "get",
  });
};
