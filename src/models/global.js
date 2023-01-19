export default {
  namespace: 'global',
  state: {},
  effects: {
    // 用于所有的操作接口的按钮submiting效果，如const submiting = useSelector(state => state.loading).effects['global/service']
    *service({ payload, service }, { select, call, put }) {
      const response = yield call(service, payload);
      return response
    },
    // 用于所有的非表格查询的loading效果，如const loading = useSelector(state => state.loading).effects['global/query']
    *query({ payload, service }, { select, call, put }) {
      const response = yield call(service, payload);
      return response
    }
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    }
  },
  subscriptions: {},
};
