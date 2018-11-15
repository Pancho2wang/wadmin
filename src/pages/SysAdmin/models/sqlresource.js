import { querySQLResourceList, querySQLResourceById, addSQLResource, updateSQLResource, deleteSQLResource } from '@/services/api';

const srcObj = {
  id: null,
  name: null,
  sql_id: null,
  sql_script: null,
  seq: 0,
  status: 1,
  desc: null,
}

export default {
  namespace: 'syssqlresource',

  state: {
    loading: false,
    list: [],
    pagination: {
      page: 1,
      pageSize: 10,
      total: 0,
      showTotal: total => `总共${total}条`,
    },
    editObj: {...srcObj}
  },

  effects: {
    *fetch({ payload }, { call, select, put }) {
      const {pagination} = yield select(state => state.syssqlresource)
      const response = yield call(querySQLResourceList, {
        ...pagination,
        ...payload,
      })
      console.log('fetch', response)
      const {code, msg, data} = response || {}
      const {list, total} = data || {}
      yield put({
        type: 'saveState',
        payload: { list: list || [], pagination: {...pagination, total: total || 0} },
      })
    },
    *one({payload}, {call, put}) {
      const response = yield call(querySQLResourceById, payload)
      const {code, msg, data} = response || {}
      yield put({
        type: 'saveState',
        payload: {editObj: data || {}},
      })
    },
    *save({ payload, callback }, { call, select }) {
      const {editObj} = yield select(state => state.syssqlresource)
      let response = null
      const param = {...editObj, ...payload, id: editObj.id}
      if (editObj.id) {
        response = yield call(updateSQLResource, param)
      } else {
        response = yield call(addSQLResource, param)
      }
      if (callback) callback(response || {}, editObj.id)
    },
    *delete({ payload, callback }, { call }) {
      const response = yield call(deleteSQLResource, payload)
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
      return {};
    },
    resetEditObj(state) {
      return {
        ...state,
        editObj: {...srcObj}
      }
    },
  },
};
