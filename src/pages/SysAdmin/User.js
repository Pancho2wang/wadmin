import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Dropdown,
  Menu,
  InputNumber,
  DatePicker,
  Modal,
  message,
  Badge,
  Divider,
  Steps,
  Radio,
  Checkbox,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import {status, userType} from '@/config/constant'

import styles from './style.less';
const FormItem = Form.Item;
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const ModalForm = Form.create()(props => {
  const { modalVisible, form, handleConfirm, handleModalVisible, editObj, roleList, companyList } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleConfirm(fieldsValue);
    });
  };
  const formLayout = {
    labelCol: {span: 5},
    wrapperCol: {span: 15}
  }

  return (
    <Modal
      destroyOnClose
      title={(editObj.id ? '编辑' : '新建') + '用户'}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem {...formLayout} label="账号">
        {form.getFieldDecorator('account', {
          initialValue: editObj.account,
          rules: [{ required: true, message: '请输入账号！' }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem {...formLayout} label="密码">
        {form.getFieldDecorator('password', {
          initialValue: editObj.password,
          rules: [{ required: true, message: '请输入密码！' }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem {...formLayout} label="名称">
        {form.getFieldDecorator('name', {
          initialValue: editObj.name,
          rules: [{ required: true, message: '请输入名称！' }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem {...formLayout} label="状态">
        {form.getFieldDecorator('status', {
          initialValue: editObj.status + '',
          rules: [{ required: true, message: '请选择状态！' }],
        })(<RadioGroup>
          {
            Object.keys(status).reverse().map(key => <Radio value={key} key={key}>{status[key][0]}</Radio>)
          }
        </RadioGroup>)}
      </FormItem>
      <FormItem {...formLayout} label="用户类型">
        {form.getFieldDecorator('user_type', {
          initialValue: editObj.user_type + '',
          rules: [{ required: true, message: '请用户类型' }],
        })(
          <Select>
            {
              Object.keys(userType).map(key => <Option value={key} key={key}>{userType[key]}</Option>)
            }
          </Select>
        )}
      </FormItem>
      <FormItem {...formLayout} label="归属角色">
        {form.getFieldDecorator('roles', {initialValue: editObj.roles})(<Checkbox.Group
            style={{ width: '100%' }}>
            <Row>{roleList.map(item => <Col span={8} key={item.id}>
                <Checkbox value={item.id}>{item.name}</Checkbox>
              </Col>)}
            </Row>
          </Checkbox.Group>)}
      </FormItem>
      <FormItem {...formLayout} label="归属公司">
        {form.getFieldDecorator('companys', {initialValue: editObj.companys})(<Checkbox.Group
            style={{ width: '100%' }}>
            <Row>{companyList.map(item => <Col span={8} key={item.id}>
                <Checkbox value={item.id}>{item.name}</Checkbox>
              </Col>)}
            </Row>
          </Checkbox.Group>)}
      </FormItem>
    </Modal>
  )
})

/* eslint react/no-multi-comp:0 */
@connect(({ sysuser, loading }) => ({
  list: sysuser.list,
  pagination: sysuser.pagination,
  editObj: sysuser.editObj,
  roleList: sysuser.roleList,
  companyList: sysuser.companyList,
  loading: loading.models.sysuser,
}))
@Form.create()
class User extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
  };

  columns = [
    {
      title: '账号',
      dataIndex: 'account',
    },
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '用户类型',
      dataIndex: 'user_type',
      render: (text) => {
        return userType[text]
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      filters: [
        {
          text: status['0'][0],
          value: 0,
        },
        {
          text: status['1'][0],
          value: 1,
        },
      ],
      render(val) {
        return <Badge status={status[val][1]} text={status[val][0]} />;
      },
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      sorter: true
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={_ => this.onEdit(true, record.id)}>编辑</a>
          <Divider type="vertical" />
          <a onClick={_ => this.onDelete(record.id)}>删除</a>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'sysuser/fetch',
    });
    dispatch({
      type: 'sysuser/fetchRoles',
    });
    dispatch({
      type: 'sysuser/fetchCompanys',
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      page: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'sysuser/fetch',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'sysuser/fetch',
      payload: {},
    });
  };

  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;
    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'sysuser/delete',
          payload: {
            ids: selectedRows.map(row => row.key),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = e => {
    e && e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'sysuser/fetch',
        payload: values,
      });
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleNew = _ => {
    this.handleModalVisible(true)
    this.props.dispatch({
      type: 'sysuser/resetEditObj'
    })
  }

  onDelete = id => {
    const callback = (res) => {
      const {code, msg} = res
      if (code === 200) {
        message.success(msg || `删除成功`)
        this.handleSearch()
      } else {
        message.error(msg || `删除失败`)
      }
    }
    this.props.dispatch({
      type: 'sysuser/delete',
      payload: {ids:[id]},
      callback
    })
  }

  onEdit = (flag, id) => {
    this.handleModalVisible(flag)
    this.props.dispatch({
      type: 'sysuser/one',
      payload: {id}
    })
  }

  handleConfirm = fields => {
    const callback = (res, id) => {
      const {code, msg} = res
      let str = '添加'
      if (id) str = '编辑'
      if (code === 200) {
        message.success(msg || `${str}成功`)
        this.handleModalVisible()
        this.handleSearch()
      } else {
        message.error(msg || `${str}失败`)
      }
    }
    this.props.dispatch({
      type: 'sysuser/save',
      payload: fields,
      callback
    })
  };

  renderForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="账号">
              {getFieldDecorator('account')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="名称">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      list,
      pagination,
      loading,
      editObj,
      roleList,
      companyList,
    } = this.props;
    const { selectedRows, modalVisible } = this.state;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        {/* <Menu.Item key="approval">批量审批</Menu.Item> */}
      </Menu>
    );

    const parentMethods = {
      handleConfirm: this.handleConfirm,
      handleModalVisible: this.handleModalVisible,
      editObj,
      roleList,
      companyList,
    }
    return (
      <PageHeaderWrapper title="用户管理">
        <Card bordered={false}>
          <div className={styles.admin}>
            <div className={styles.adminForm}>{this.renderForm()}</div>
            <div className={styles.adminOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleNew()}>
                新建
              </Button>
              {selectedRows.length > 0 && (
                <span>
                  {/* <Button>批量操作</Button> */}
                  <Dropdown overlay={menu}>
                    <Button>
                      更多操作 <Icon type="down" />
                    </Button>
                  </Dropdown>
                </span>
              )}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              list={list}
              pagination={pagination}
              rowKey="id"
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <ModalForm {...parentMethods} modalVisible={modalVisible} />
      </PageHeaderWrapper>
    );
  }
}

export default User;
