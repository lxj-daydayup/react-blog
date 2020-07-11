let ip='http://127.0.0.1:7001/admin'
let servicePath={
    checkLogin:ip+'/checkLogin',
    getTypeInfo:ip+'/getTypeInfo',
    addArticle:ip+'/addArticle',
    changeArticle:ip+'/changeArticle',
    getArticleList:ip+'/getArticleList',
    delArticle:ip+'/delArticle/',
    getArticleById:ip+'/getArticleById/'

    
}
;
export default servicePath;