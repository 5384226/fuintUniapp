import request from "@/utils/request";

// api地址
const api = {
  getStore: "api/storebind/get_store",
  bindStore: "api/storebind/bind_store",
  unbindStore: "api/storebind/unbind_store",
};

// 获取店铺绑定信息
export function getStore() {
  return request.get(api.getStore);
}

// 绑定店铺
export function bindStore(data) {
  return request.post(api.bindStore, data);
}

// 解绑店铺
export function unbindStore(data) {
  return request.post(api.unbindStore, data);
}
