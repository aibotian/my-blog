const {
  login
} = require('../controller/user')
const { SuccessModel, ErrorModel } = require('../model/resModel')
// 获取cookie过期时间
const getCookieExpires = () => {
  const d = new Date();
  d.setTime(d.getTime() + (24 * 60 * 60 * 1000));
  console.log( d.toGMTString())
  return d.toGMTString();
}

const handleUserRouter = (req, res) => {
  const method = req.method;

  // 登录
  if(method === 'GET' && req.path === '/api/user/login') {
    // const { username, password } = req.body;
    const { username, password } = req.query;
    const result = login(username, password);
    return result.then(data => {
      if(data.username) {
        req.session.username = data.username;
        req.session.realname = data.realname;
        console.log("req session is", req.session)
        res.setHeader('Set-Cookie', `username=${data.username}; path=/; httpOnly; expires=${getCookieExpires()}`)
        return Promise.resolve(new SuccessModel())
      }
      return  Promise.resolve(new ErrorModel("登录失败"));
    })
  }
  console.log(method, req.path)
  // 登录测试
  if(method === "GET" && req.path === "/api/user/login-test") {
    console.log("进来了")
    if(req.session.username) {
      return  Promise.resolve(new SuccessModel({
        session: req.session
      }))
    } else {
      console.log("返回了")
      return  Promise.resolve(new ErrorModel("尚未登录"))
    }
  }
}

module.exports = handleUserRouter;
