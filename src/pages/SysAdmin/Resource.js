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
  Button,
  Menu,
  InputNumber,
  Modal,
  message,
  Badge,
  Divider,
  Radio,
  Table,
  TreeSelect,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import {status, resourceType} from '@/config/constant'
import styles from './style.less';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;
const { TreeNode } = TreeSelect

const ModalForm = Form.create()(props => {
  const { modalVisible, form, handleConfirm, handleModalVisible, editObj, pList } = props;
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

  const traverse = arr => {
    for (let i in arr) {
      if (typeof arr[i] === 'object') {
        arr[i] = {
          ...arr[i],
          value: arr[i].id,
          key: arr[i].id,
          title: arr[i].name
        }
        if (arr[i].children && arr[i].children.constructor === Array) {
          traverse(arr[i].children)
        }
      }
    }
  }
  let treeData = JSON.parse(JSON.stringify(pList))
  traverse(treeData)
  return (
    <Modal
      destroyOnClose
      title={(editObj.id ? '编辑' : '新建') + '资源'}
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
      <FormItem {...formLayout} label="类型">
        {form.getFieldDecorator('per_type', {
          initialValue: editObj.per_type + '',
          rules: [{ required: true, message: '请选择状态！' }],
        })(<RadioGroup>
          {
            Object.keys(resourceType).map(key => <Radio value={key} key={key}>{resourceType[key]}</Radio>)
          }
        </RadioGroup>)}
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
      <FormItem {...formLayout} label="父节点">
        {form.getFieldDecorator('pid', {
          initialValue: editObj.pid
        })(<TreeSelect
          allowClear
          style={{ width: 300 }}
          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
          treeData={treeData}
          treeDefaultExpandAll
        />)}
      </FormItem>
      <FormItem {...formLayout} label="排序">
        {form.getFieldDecorator('seq', {initialValue: editObj.seq})(<InputNumber placeholder="请输入" />)}
      </FormItem>
      <FormItem {...formLayout} label="URL">
        {form.getFieldDecorator('url', {initialValue: editObj.url})(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem {...formLayout} label="图标">
        {form.getFieldDecorator('icon', {initialValue: editObj.icon})(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem {...formLayout} label="描述">
        {form.getFieldDecorator('desc', {initialValue: editObj.desc})(<TextArea placeholder="请输入" />)}
      </FormItem>
    </Modal>
  )
})

/* eslint react/no-multi-comp:0 */
@connect(({ sysresource, loading }) => ({
  list: sysresource.list,
  pList: sysresource.pList,
  editObj: sysresource.editObj,
  loading: loading.models.sysresource,
}))
@Form.create()
class Resource extends PureComponent {
  state = {
    modalVisible: false,
  }
  columns = [
    {
      title: '名称',
      dataIndex: 'name'
    },
    {
      title: '类型',
      dataIndex: 'per_type',
      width: 60,
      render: (text) => {
        return resourceType[text]
      }
    },
    {
      title: 'URL',
      dataIndex: 'url',
      width: 220
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 80,
      filters: [
        {
          text: status['0'][0],
          value: 0,
        },
        {
          text: status['1'][0],
          value: 1,
        }
      ],
      render(val) {
        return <Badge status={status[val][1]} text={status[val][0]} />;
      }
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      sorter: true,
      width: 200
    },
    {
      title: '操作',
      width: 110,
      render: (text, record) => (
        <Fragment>
          <a onClick={_ => this.onEdit(true, record.id)}>编辑</a>
          <Divider type="vertical" />
          <a onClick={_ => this.onDelete(record.id)}>删除</a>
        </Fragment>
      )
    },
  ];

  componentDidMount() {
    this.handleReflash()
  }

  handleReflash() {
    this.props.dispatch({
      type: 'sysresource/fetch',
    })
    this.props.dispatch({
      type: 'sysresource/getParentList',
    })
  }

  handleModalVisible = flag => {
    this.setState({modalVisible: !!flag})
  };

  onDelete = id => {
    const callback = (res) => {
      const {code, msg} = res
      if (code === 200) {
        message.success(msg || `删除成功`)
        this.handleReflash()
      } else {
        message.error(msg || `删除失败`)
      }
    }
    this.props.dispatch({
      type: 'sysresource/delete',
      payload: {id},
      callback
    })
  }

  onEdit = (flag, id) => {
    this.handleModalVisible(flag)
    this.props.dispatch({
      type: 'sysresource/one',
      payload: {id}
    })
  }

  handleNew = _ => {
    this.handleModalVisible(true)
    this.props.dispatch({
      type: 'sysresource/resetEditObj'
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
        this.handleReflash()
      } else {
        message.error(msg || `${str}失败`)
      }
    }
    this.props.dispatch({
      type: 'sysresource/save',
      payload: fields,
      callback
    })
  }

  render() {
    const { list, loading, editObj, pList } = this.props
    const {modalVisible} = this.state
    const parentMethods = {
      handleConfirm: this.handleConfirm,
      editObj: editObj,
      pList: pList,
      handleModalVisible: this.handleModalVisible,
    }
    return (
      <PageHeaderWrapper title="资源管理">
        <Card bordered={false}>
          <div className={styles.admin}>
            <div className={styles.adminOperator}>
              <Button type="primary" onClick={() => this.handleReflash()}>
                刷新
              </Button>
              <Button icon="plus" type="primary" onClick={() => this.handleNew()}>
                新建
              </Button>
            </div>
            <Table
              loading={loading}
              dataSource={list}
              rowKey="id"
              columns={this.columns}
              pagination={false}
            />
          </div>
        </Card>
        <ModalForm {...parentMethods} modalVisible={modalVisible} />
      </PageHeaderWrapper>
    );
  }
}

export default Resource;
