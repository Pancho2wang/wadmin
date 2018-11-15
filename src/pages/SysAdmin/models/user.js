import { queryUserList, queryUserById, addUser, updateUser, deleteUser, queryAllRoleList, queryAllCompanyList } from '@/services/api';

const srcObj = {
  id: null,
  account: null,
  password: null,
  name: null,
  status: 1,
  user_type: 0,
  companys: [],
  roles: []
}

export default {
  namespace: 'sysuser',

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
    companyList: [],
    editObj: {...srcObj}
  },

  effects: {
    *fetchCompanys(_, { call, put }) {
      const response = yield call(queryAllCompanyList)
      console.log('fetchRoles', response)
      const {code, msg, data} = response || {}
      const {list} = data || {}
      yield put({
        type: 'saveState',
        payload: { companyList: list || [] },
      })
    },
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
      const {pagination} = yield select(state => state.sysuser)
      const response = yield call(queryUserList, {
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
      const response = yield call(queryUserById, payload)
      const {code, msg, data} = response || {}
      yield put({
        type: 'saveState',
        payload: {editObj: data || {}},
      })
    },
    *save({ payload, callback }, { call, select }) {
      const {editObj} = yield select(state => state.sysuser)
      let response = null
      const param = {...editObj, ...payload, id: editObj.id}
      if (editObj.id) {
        response = yield call(updateUser, param)
      } else {
        response = yield call(addUser, param)
      }
      if (callback) callback(response || {}, editObj.id)
    },
    *delete({ payload, callback }, { call }) {
      const response = yield call(deleteUser, payload)
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
