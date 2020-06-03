<template>
<div>
  <div>
    <el-form :inline="true">
      <el-form-item>
        <el-input v-model="formInline.user" placeholder="搜索" style="width: 150%;" prefix-icon="el-icon-search"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="onSubmit" icon="el-icon-search"> 搜索 </el-button>
      </el-form-item>
    </el-form>
    <el-row class="carrot-button">
      <el-button type="primary" @click="1" icon="el-icon-plus"> 新增 </el-button>
      <el-button type="danger" @click="2" icon="el-icon-delete"> 删除 </el-button>
      <el-button type="info" @click="2" icon="el-icon-refresh"> 刷新 </el-button>
    </el-row>
  </div>
  <div>
    <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />
      <el-table-column :show-overflow-tooltip="true" prop="username" label="用户名" />
      <!-- <el-table-column :show-overflow-tooltip="true" prop="GID" label="GID" /> -->
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
          <span>scope.row.createTime</span>
        </template>
      </el-table-column>

      <el-table-column v-permission="['admin','user:edit','user:del']" label="操作" width="125" align="center" fixed="right">
        <template slot-scope="scope">
          <udOperation :data="scope.row" :permission="permission" />
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <pagination />
  </div>
</div>
</template>

<script>
import request from '@/utils/request'
export default {
  data() {
    return {
      tableData: [],
      multipleSelection: [],
      formInline: {
        user: '',
        region: ''
      },
      permission: {
        add: ['admin', 'user:add'],
        edit: ['admin', 'user:edit'],
        del: ['admin', 'user:del']
      },
      enabledTypeOptions: [
        { key: 'true', display_name: '激活' },
        { key: 'false', display_name: '锁定' }
      ]
    }
  },
  methods: {
    // 获取数据
    getData() {
      request.get(`/api/users`)
        .then(res => {
          console.log(res.data.users);
          this.tableData = res.data.users;
        })
    },
    onSubmit() {
      console.log('submit!');
    },
    // 改变状态
    changeEnabled(data, val) {
      this.$confirm('此操作将 "' + ((data.enabled) ? '激活' : '禁用') + '" ' + data.username + ', 是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        /**
        crudUser.edit(data).then(res => {
          this.crud.notify(((data.enabled) ? '激活' : '禁用') + '成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
        }).catch(() => {
          data.enabled = !data.enabled
        })*/
      }).catch(() => {
        data.enabled = !data.enabled
      })
    },
    // 获取全部角色
    formatRoles(roles) {
      // console.log(roles)
      const values = []
      for (const role of roles) {
        // console.log(role.name)
        values.push(role.name)
      }
      return values.join(',')
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
.el-form--inline .el-form-item {
  display: inline-block;
  margin-right: 120px;
  vertical-align: top;
}

.carrot-button {
  margin-bottom: 20px;
  margin-left: 20px;

}
</style>
