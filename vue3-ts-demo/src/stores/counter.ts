import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { getApiList } from "../axios/index"
import type { RootObject } from "./type"
export const useStore = defineStore({
  id: "counter",
  state: () => ({
    list: <RootObject>{},
    item: <any[]>[],
    chinaTotal: <any>{},
    chinaDetail: <any>[],
  }),
  actions: {
    async getList() {
      const result = await getApiList();
      this.list = result;
      console.log(this.list);
      this.chinaTotal = this.list.chinaTotal;
    },
    set_chinaDetail(val:Array<[]>) {
      this.chinaDetail = val;
    }
  }
})
