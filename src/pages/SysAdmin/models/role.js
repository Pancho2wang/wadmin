import { queryRoleList, queryRoleById, addRole, updateRole, deleteRole, queryParentResourceList, queryAllSQLResourceList } from '@/services/api';

const srcObj = {
  id: null,
  name: null,
  alias_name: null,
  seq: 0,
  status: 1,
  desc: null,
  resources: [],
  sql_resources: [],
  resourcesChecked: {
    checked: [],
    halfChecked: [],
  }
}

function getCheckAndHalfCheck(list, resources) {
  let checked = []
  let halfChecked = []
  let num = 0
  list.forEach(obj => {
    if (resources.includes(obj.id)) {
      let children = obj.children || []
      let res = {}
      if (children.length > 0) {
        res = getCheckAndHalfCheck(children, resources)
        if (res.num === children.length) {
          num += 1
          checked.push(obj.id)
        } else {
          halfChecked.push(obj.id)
        }
      } else {
        num += 1
        checked.push(obj.id)
      }
      checked = [...checked, ...(res.checked || [])]
      halfChecked = [...halfChecked, ...(res.halfChecked || [])]
    }
  })
  return { checked, halfChecked, num }
}

export default {
  namespace: 'sysrole',

  state: {
    loading: false,
    list: [],
    pagination: {
      page: 1,
      pageSize: 10,
      total: 0,
      showTotal: total => `总共${total}条`,
    },
    resourceList: [],
    sqlResourceList: [],
    editObj: {...srcObj}
  },

  effects: {
    *fetchSQLResources(_, { call, put }) {
      const response = yield call(queryAllSQLResourceList)
      console.log('fetchRoles', response)
      const {code, msg, data} = response || {}
      const {list} = data || {}
      yield put({
        type: 'saveState',
        payload: { sqlResourceList: list || [] },
      })
    },
    *fetchResources(_, { call, put }) {
      const response = yield call(queryParentResourceList)
      console.log('fetchRoles', response)
      const {code, msg, data} = response || {}
      const {list} = data || {}
      yield put({
        type: 'saveState',
        payload: { resourceList: list || [] },
      })
    },
    *fetch({ payload }, { call, select, put }) {
      const {pagination} = yield select(state => state.sysrole)
      const response = yield call(queryRoleList, {
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
    *one({payload}, {call, put, select}) {
      const response = yield call(queryRoleById, payload)
      const {resourceList} = yield select(state => state.sysrole)
      const {code, msg, data} = response || {}
      const {resources} = data || {}
      const { checked, halfChecked } = getCheckAndHalfCheck(resourceList, resources || [])
      yield put({
        type: 'saveState',
        payload: {editObj: {...data, resourcesChecked: {checked, halfChecked}}},
      })
    },
    *save({ payload, callback }, { call, select }) {
      const {editObj} = yield select(state => state.sysrole)
      let response = null
      const param = {
        ...editObj,
        ...payload,
        resources: [
          ...payload.resourcesChecked.checked,
          ...payload.resourcesChecked.halfChecked
        ],
        id: editObj.id
      }
      if (editObj.id) {
        response = yield call(updateRole, param)
      } else {
        response = yield call(addRole, param)
      }
      if (callback) callback(response || {}, editObj.id)
    },
    *delete({ payload, callback }, { call }) {
      const response = yield call(deleteRole, payload)
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
