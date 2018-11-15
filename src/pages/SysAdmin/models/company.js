import { queryCompanyList, queryCompanyById, addCompany, updateCompany, deleteCompany, queryAllRoleList } from '@/services/api';

const srcObj = {
  id: null,
  name: null,
  seq: 0,
  status: 1,
  phone: null,
  email: null,
  address: null,
  desc: null,
  roles: []
}

export default {
  namespace: 'syscompany',

  state: {
    loading: false,
    list: [],
    pagination: {
      page: 1,
      pageSize: 10,
      total: 0,
      showTotal: total => `总共${total}条`,
    },
    roleList: [],
    editObj: {...srcObj}
  },

  effects: {
    *fetchRoles(_, { call, put }) {
      const response = yield call(queryAllRoleList)
      console.log('fetchRoles', response)
      const {code, msg, data} = response || {}
      const {list} = data || {}
      yield put({
        type: 'saveState',
        payload: { roleList: list || [] },
      })
    },
    *fetch({ payload }, { call, select, put }) {
      const {pagination} = yield select(state => state.syscompany)
      const response = yield call(queryCompanyList, {
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
      const response = yield call(queryCompanyById, payload)
      const {code, msg, data} = response || {}
      yield put({
        type: 'saveState',
        payload: {editObj: data || {}},
      })
    },
    *save({ payload, callback }, { call, select }) {
      const {editObj} = yield select(state => state.syscompany)
      let response = null
      const param = {...editObj, ...payload, id: editObj.id}
      if (editObj.id) {
        response = yield call(updateCompany, param)
      } else {
        response = yield call(addCompany, param)
      }
      if (callback) callback(response || {}, editObj.id)
    },
    *delete({ payload, callback }, { call }) {
      const response = yield call(deleteCompany, payload)
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
