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
import {status} from '@/config/constant'

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
  const { modalVisible, form, handleConfirm, handleModalVisible, editObj, roleList } = props;
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
      title={(editObj.id ? '编辑' : '新建') + '公司'}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
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
      <FormItem {...formLayout} label="排序">
        {form.getFieldDecorator('seq', {initialValue: editObj.seq})(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem {...formLayout} label="电话">
        {form.getFieldDecorator('phone', {initialValue: editObj.phone})(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem {...formLayout} label="邮箱">
        {form.getFieldDecorator('email', {initialValue: editObj.email})(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem {...formLayout} label="地址">
        {form.getFieldDecorator('address', {initialValue: editObj.address})(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem {...formLayout} label="描述">
        {form.getFieldDecorator('desc', {initialValue: editObj.desc})(<TextArea placeholder="请输入" />)}
      </FormItem>
      <FormItem {...formLayout} label="含有角色">
        {form.getFieldDecorator('roles', {initialValue: editObj.roles})(<Checkbox.Group
            style={{ width: '100%' }}>
            <Row>{roleList.map(item => <Col span={8} key={item.id}>
                <Checkbox value={item.id}>{item.name}</Checkbox>
              </Col>)}
            </Row>
          </Checkbox.Group>)}
      </FormItem>
    </Modal>
  )
})

/* eslint react/no-multi-comp:0 */
@connect(({ syscompany, loading }) => ({
  list: syscompany.list,
  pagination: syscompany.pagination,
  editObj: syscompany.editObj,
  roleList: syscompany.roleList,
  loading: loading.models.syscompany,
}))
@Form.create()
class Company extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
  };

  columns = [
    {
      title: '公司名称',
      dataIndex: 'name',
    },
    {
      title: '排序',
      dataIndex: 'seq',
    },
    {
      title: '电话',
      dataIndex: 'phone',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
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
      type: 'syscompany/fetch',
    });
    dispatch({
      type: 'syscompany/fetchRoles',
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
      type: 'syscompany/fetch',
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
      type: 'syscompany/fetch',
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
          type: 'syscompany/delete',
          payload: {
            ids: selectedRows.map(row => row.id),
          },
          callback: (res) => {
            this.setState({
              selectedRows: [],
            });
            if (res && res.code === 200) {
              this.handleSearch()
            }
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
        type: 'syscompany/fetch',
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
      type: 'syscompany/resetEditObj'
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
      type: 'syscompany/delete',
      payload: {ids:[id]},
      callback
    })
  }

  onEdit = (flag, id) => {
    this.handleModalVisible(flag)
    this.props.dispatch({
      type: 'syscompany/one',
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
      type: 'syscompany/save',
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
            <FormItem label="公司名称">
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
      roleList
    }
    return (
      <PageHeaderWrapper title="公司管理">
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

export default Company;
