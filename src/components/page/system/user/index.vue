<template>
<div>
  <div>
    <el-form :inline="true">
      <el-form-item class='carrot-search'>
        <el-input v-model="pageQuery.search" placeholder="搜索" style="width: 150%;" prefix-icon="el-icon-search"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="onSubmit" icon="el-icon-search"> 搜索 </el-button>
      </el-form-item>
    </el-form>
    <el-row class="carrot-button">
      <el-button type="primary" @click="handleAdd" v-per="'user:add'" icon="el-icon-plus"> 新增 </el-button>
      <el-button type="danger" @click="deleteAllSelect" v-per="'user:del'" icon="el-icon-delete"> 删除 </el-button>
      <el-button type="warning" @click="reload" v-per="'user:list'" icon="el-icon-refresh"> 刷新 </el-button>
    </el-row>
  </div>
  <!--表单渲染-->
  <el-dialog append-to-body :visible.sync=editVisible :title="title" width="600px">
    <el-form ref="form" :inline="true" :model="form" :rules="rules" size="small" label-width="70px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" />
      </el-form-item>
      <el-form-item label="电话" prop="phone">
        <el-input v-model.number="form.phone" />
      </el-form-item>
      <el-form-item label="GID" prop="gid">
        <el-input v-model="form.gid" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email" />
      </el-form-item>
      <el-form-item label="性别">
        <el-radio-group v-model="form.sex" style="width: 178px">
          <el-radio label="男">男</el-radio>
          <el-radio label="女">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="状态">
        <el-radio-group v-model="form.enabled">
          <el-radio label="true">激活</el-radio>
          <el-radio label="false">未激活</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item style="margin-bottom: 0;" label="角色" prop="roles">
        <el-select v-model="form.roles" style="width: 437px" multiple placeholder="请选择" @remove-tag="deleteTag" @change="changeRole">
          <el-option v-for="item in roles" :key="item.name" :disabled="level !== 1 && item.level <= level" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="editVisible = false">取消</el-button>
      <el-button type="primary" @click="saveForm">确认</el-button>
    </div>
  </el-dialog>
  <div>
    <el-table ref="multipleTable" v-per="'user:list'" :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />
      <el-table-column :show-overflow-tooltip="true" prop="username" label="用户名" />
      <el-table-column :show-overflow-tooltip="true" prop="gid" label="GID" />
      <el-table-column :show-overflow-tooltip="true" prop="phone" width="100" label="电话" />
      <el-table-column :show-overflow-tooltip="true" width="125" prop="email" label="邮箱" />
      <el-table-column label="状态" align="center" prop="enabled">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.enabled" active-color="#409EFF" inactive-color="#F56C6C" @change="changeEnabled(scope.row, scope.row.enabled)" />
        </template>
      </el-table-column>

      <el-table-column label="角色">
        <template slot-scope="scope">
          <div v-html="formatRoles(scope.row.roles)" />
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="createTime" width="140" label="创建日期">
        <template slot-scope="scope">
          <span>{{scope.row.createTime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" align="center">
        <template slot-scope="scope">
          <el-button type="primary" v-per="'user:edit'" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)"></el-button>
          <el-button type="danger" v-per="'user:del'" icon="el-icon-delete" @click="handleDelete(scope.$index, scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <div class="pagination" v-per="'user:list'">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageQuery.pageIndex" :page-sizes="[5, 10, 15, 20, 25]" :page-size="pageQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageTotal">
      </el-pagination>
    </div>
  </div>
</div>
</template>

<script>
import request from '@/utils/request'

let userRoles = []
const defaultForm = {
  id: null,
  username: null,
  gid: null,
  sex: '男',
  email: null,
  enabled: 'false',
  roles: [],
  phone: null
}

export function isvalidPhone(phone) {
  const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
  return reg.test(phone)
}

export default {
  data() {
    // 自定义验证
    const validPhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入电话号码'))
      } else if (!isvalidPhone(value)) {
        callback(new Error('请输入正确的11位手机号码'))
      } else {
        callback()
      }
    }
    return {
      pageQuery: {
        search: null,
        pageIndex: 1,
        pageSize: 10
      },
      pageTotal: 0,
      tableData: [],
      multipleSelection: [],
      title: '',
      editVisible: false,
      level: 3,
      form: [],
      roles: [],
      rules: {
        username: [{
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          },
          {
            min: 2,
            max: 20,
            message: '长度在 2 到 20 个字符',
            trigger: 'blur'
          }
        ],
        gid: [{
            required: true,
            message: '请输入用户gid',
            trigger: 'blur'
          },
          {
            min: 2,
            max: 20,
            message: '长度在 2 到 20 个字符',
            trigger: 'blur'
          }
        ],
        email: [{
            required: true,
            message: '请输入邮箱地址',
            trigger: 'blur'
          },
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: 'blur'
          }
        ],
        phone: [{
          required: true,
          trigger: 'blur',
          validator: validPhone
        }]
      }
    }
  },
  methods: {
    // 获取数据
    getData() {
      request.get(`/api/users`,{params:this.pageQuery})
        .then(res => {
          //console.log(res.data.users);
          this.pageTotal = res.data.users.pageTotal;
          this.tableData = res.data.users.data;
        })
    },
    onSubmit() {
      //console.log(this.pageQuery);
      this.pageQuery.pageIndex = 1;
      this.getData();
    },
    handleSizeChange(val) {
      this.pageQuery.pageSize = val;
      this.getData();
    },
    handleCurrentChange(val) {
      this.pageQuery.pageIndex = val;
      this.getData();
    },
    reload() {
      this.getData();
    },
    // 触发搜索按钮
    handleSearch() {
      this.$set(this.pageQuery, 'pageIndex', 1);
      //this.pageQuery.pageIndex = 1;
      this.getData();
    },
    // 删除操作
    handleDelete(index, row) {
      // 二次确认删除
      //console.log(index);
      this.$confirm('确定要删除吗？', '提示', {
          type: 'warning'
        })
        .then(() => {
          request.delete(`/api/users`, {
            data: // 请求参数放在请求体
              [row.id]
          }).then(res => {
            this.$message.success('删除成功');
            this.tableData.splice(index, 1);
          })
        })
        .catch(() => {});
    },
    deleteAllSelect() {
      const length = this.multipleSelection.length;
      if (length === 0) {
        return
      }
      let str = '';
      let ids = [];
      for (let i = 0; i < length; i++) {
        str += this.multipleSelection[i].username + ' ';
        ids.push(this.multipleSelection[i].id)
      }
      // 二次确认删除
      this.$confirm('确定要删除吗？', '提示', {
          type: 'warning'
        })
        .then(() => {

          request.delete(`/api/users`, {
            data: ids // 请求参数放在请求体
          }).then(res => {
            this.$message.error(`删除了${str}`);
            this.tableData = this.tableData.filter(data => {
              return ids.indexOf(data.id) === -1;
            })
            this.multipleSelection = [];
          })
        })
        .catch(() => {});
    },
    //新增操作
    handleAdd() {
      this.title = "新增用户"
      this.getRoles();
      this.getLevel();
      this.form = JSON.parse(JSON.stringify(defaultForm));
      userRoles = [];
      this.form.roles = [];
      this.form.enabled = this.form.enabled.toString()
      this.editVisible = true;
    },
    // 编辑操作
    handleEdit(index, row) {
      // 打开编辑弹窗前做的操作
      // this.getJobs(this.form.dept.id)
      this.title = "编辑用户"
      this.getRoles();
      this.getLevel();
      userRoles = []
      const roles = []
      this.form = JSON.parse(JSON.stringify(row));

      this.form.roles.forEach(function(role, index) {
        roles.push(role.id)
        // 初始化编辑时候的角色
        const rol = { id: role.id }
        userRoles.push(rol)
      })
      this.form.roles = roles
      this.form.enabled = this.form.enabled.toString()
      this.editVisible = true;
    },
    //保存数据
    saveForm() {

      const user = JSON.parse(JSON.stringify(this.form));
      user.roles = userRoles;
      if (user.roles.length === 0) {
        this.$message({
          message: '角色不能为空',
          type: 'warning'
        })
        return false
      }
      //console.log(user);
      if(user.id === null){
        request.post("/api/users", user)
          .then(res => {
            this.$message.success('用户保存成功');
            this.getData();
            this.editVisible = false;
          })
          .catch(() => {});
      } else {
        request.put("/api/users", user)
          .then(res => {
            this.$message.success('用户修改成功');
            this.getData();
            this.editVisible = false;
          })
          .catch(() => {});
      }
    },
    deleteTag(value) {
      userRoles.forEach(function(data, index) {
        if (data.id === value) {
          userRoles.splice(index, value)
        }
      })
      //console.log(userRoles)
    },
    changeRole(value) {
      userRoles = []
      value.forEach(function(data, index) {
        const role = {
          id: data
        }
        userRoles.push(role)
      })
      //console.log(userRoles)
    },
    // 改变状态
    changeEnabled(data, val) {
      this.$confirm('此操作将 "' + ((data.enabled) ? '激活' : '禁用') + '" ' + data.username + ', 是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if(data.username === 'admin'){
            this.$message.warning('admin用户不可以被禁用')
            data.enabled = !data.enabled
            return
        }
        request.put('/api/users',data).then(res => {
          this.$message({message: '"' +((data.enabled) ? '激活' : '禁用') + '" ' + data.username + '成功.', type: (data.enabled) ? 'success' : 'warning'});
        }).catch(() => {
          data.enabled = !data.enabled
        })
      }).catch(() => {
        data.enabled = !data.enabled
      })
    },
    // 获取当前用户的角色
    formatRoles(rowRoles) {
      // console.log(roles)
      const values = []
      for (const rowRole of rowRoles) {
        // console.log(role.name)
        values.push(rowRole.name)
      }
      return values.join(',')
    },
    //获取权限级别
    getLevel() {
      request.get("/api/roles/level")
        .then(res => {
          this.level = res.data.level
        })
        .catch(() => {});
    },
    //获取全权限
    getRoles() {
      request.get("/api/roles/all")
        .then(res => {
          this.roles = res.data.roles
        })
        .catch(() => {});
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    }
  },
  created() {
    this.getData();
  }
}
</script>
<style scoped>
.carrot-search {
  display: inline-block;
  margin-right: 120px;
  vertical-align: top;
}

.carrot-button {
  margin-bottom: 20px;
  margin-left: 20px;

}

.el-button--small .el-button--small.is-round {
  padding: 7px 15px;
}
</style>
