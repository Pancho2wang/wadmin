import { queryResourceList, queryParentResourceList, queryResourceById, addResource, updateResource, deleteResource } from '@/services/api';

const srcObj = {
  id: null,
  name: null,
  pid: null,
  per_type: 0,
  status: 1,
  seq: 0,
  url: null,
  icon: null,
  desc: null
}

export default {
  namespace: 'sysresource',

  state: {
    list: [],
    editObj: {...srcObj},
    pList: [],
    loading: false,
  },

  effects: {
    *getParentList(_, { call, put }) {
      const response = yield call(queryParentResourceList)
      const {code, msg, data} = response
      const {list} = data || {}
      yield put({
        type: 'saveState',
        payload: {pList: list || []},
      })
    },
    *fetch(_, { call, put }) {
      const response = yield call(queryResourceList)
      const {code, msg, data} = response
      const {list} = data || {}
      yield put({
        type: 'saveState',
        payload: {list: list || []},
      })
    },
    *one({payload}, {call, put}) {
      const response = yield call(queryResourceById, payload)
      const {code, msg, data} = response
      yield put({
        type: 'saveState',
        payload: {editObj: data || {}},
      })
    },
    *save({ payload, callback }, { call, select }) {
      const {editObj} = yield select(state => state.sysresource)
      let response = null
      const param = {...editObj, ...payload, id: editObj.id}
      if (editObj.id) {
        response = yield call(updateResource, param)
      } else {
        response = yield call(addResource, param)
      }
      if (callback) callback(response || {}, editObj.id)
    },
    *delete({ payload, callback }, { call }) {
      const response = yield call(deleteResource, payload)
      if (callback) callback(response || {})
    }
  },

  reducers: {
    saveState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    clearState() {
      return {
        list: [],
        editObj: {...srcObj},
        loading: false,
      }
    },
    resetEditObj(state) {
      return {
        ...state,
        editObj: {...srcObj}
      }
    },
  },
};
