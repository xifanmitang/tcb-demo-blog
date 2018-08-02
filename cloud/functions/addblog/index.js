
const app = require('tcb-admin-node');

// 用于权限控制
let whiteList = [];

// 云函数入口函数
exports.main = async (event, context) => {
  let {
    cover,
    title,
    content,
    userInfo
  } = event;

  let openId = userInfo.openId; // 添加博客者的openId

  app.init({
    env: '<%=env%>',
    mpAppId: userInfo.appId,
  });

  // 数据库引用
  const db = app.database();
  // 集合引用
  const collection = db.collection('blog');

  if (whiteList.length && !whiteList.includes(openId)) {
    return {
      code: 2, // 没有权限
      msg: '没有权限发布文章'
    }
  }

  let result = null;
  
  try {
    result = await collection.add({
      cover,
      title,
      content,
      // _openid: openId
    });
  }
  catch(e) {
    return {
      code: 1, // 添加数据失败
      msg: e.message
    };
  }

  console.log(result);

  return {
    code: 0,
    data: {
      id: result.id
    }
  };
};