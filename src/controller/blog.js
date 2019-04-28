const { exec } = require("../db/mysql")

const getList = (author, keyword) => {
  let sql = `select id, title, content, author from blogs where 1=1 `;

  if(author) {
    sql += `and author='${author}' `
  }
  if(keyword) {
    sql += `and title like '%${keyword}%' `
  }
  sql += `order by createtime desc;`

  return exec(sql)
}

const getDetail = (id) => {
  const sql = `select * from blogs where id='${id}'`;
  return exec(sql).then(rows => {
    return rows[0]
  })
}

const newBlog = (blogData = {}) => {
  // blogData 是一个博客对象
  const { title, content, author, createtime = Date.now() } = blogData;
  const sql  = `insert into blogs (title, content, createtime, author) values ('${title}','${content}',${createtime},'${author}');`
  return exec(sql).then(insertData => {
    console.log('insertData is' , insertData);
    return {
      id: insertData.insertId
    }
  })
}

const updateBlog = (id, blogData = {}) => {
  console.log('update blog', id, blogData);
  // blogData 是一个博客对象
  const { title, content } = blogData;
  const sql = `update blogs set title='${title}', content='${content}' where id=${id}`;

  return exec(sql).then(updateData => {
    if(updateData.affectedRows > 0) {
      return true;
    }
    return false;
  })
}
const deleteBlog = (id, author='') => {
  const sql = `delete from blogs where id=${id} and author=='${author}'`;
  return exec(sql).then(data => {
    if(data.affectedRows > 0) {
      return true;
    }
    return false;
  })
}
module.exports = {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  deleteBlog
}
