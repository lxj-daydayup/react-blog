import React,{useState,useEffect} from 'react';
import marked from 'marked'
import '../static/AddArticle.css'
import { Row, Col ,Input, Select ,Button ,DatePicker, message } from 'antd'
import axios from 'axios'
import servicePath from '../config/apiURL'
import hljs from "highlight.js";
import 'highlight.js/styles/monokai-sublime.css';

const { Option } = Select
const { TextArea } = Input
const renderer = new marked.Renderer();

marked.setOptions({
    renderer: renderer, 
    gfm: true,
    pedantic: false,
    sanitize: false,
    tables: true,
    breaks: false,
    smartLists: true,
    smartypants: false,
    highlight: function (code) {
            return hljs.highlightAuto(code).value;
    }
  }); 

function AddArticle(props){
const [articleId,setArticleId] = useState('0')  // 文章的ID，如果是0说明是新增加，如果不是0，说明是修改
const [articleTitle,setArticleTitle] = useState('')   //文章标题
const [articleContent , setArticleContent] = useState('')  //markdown的编辑内容
const [markdownContent, setMarkdownContent] = useState('预览内容') //html内容
const [introducemd,setIntroducemd] = useState()            //简介的markdown内容
const [introducehtml,setIntroducehtml] = useState('等待编辑') //简介的html内容
const [showDate,setShowDate] = useState()   //发布日期
const [updateDate,setUpdateDate] = useState('') //修改日志的日期
const [typeInfo ,setTypeInfo] = useState([]) // 文章类别信息
const [selectedType,setSelectType] = useState('请选择类别') //选择的文章类别

const getTypeInfo=()=>{
         axios({
             method:'get',
             url:servicePath.getTypeInfo,
             withCredentials: true

         }).then((res)=>{
             if(res.data.data=='没有登陆'){
                 localStorage.removeItem('openId')
                 props.history.push('/')
                 console.log('fail')
             }else{
                 setTypeInfo(res.data.data)
                 console.log(typeInfo)
             }

         })
     }
const getArticleById=(id)=>{
        axios(servicePath.getArticleById+id,{withCredentials:true}).then((res)=>{
            const articleInfo=res.data.data[0]
            setArticleId(articleInfo.id)
            setArticleTitle(articleInfo.title)
            setArticleContent(articleInfo.content)
            setMarkdownContent(marked(articleInfo.content))
            setIntroducemd(articleInfo.introduce)
            setIntroducehtml(marked(articleInfo.introduce))
            setShowDate(articleInfo.addTime)
            setSelectType(articleInfo.typeId)

        })
    }



const ChangeContent=(e)=>{
    setArticleContent(e.target.value)
    let html = marked(e.target.value)
    setMarkdownContent(html)    
}
const ChangeIntroduce=(e)=>{
    setIntroducemd(e.target.value)
    let html = marked(e.target.value)
    setIntroducehtml(html)
}
const HandelTypeChange=(value)=>{
    setSelectType(value)
}
const SaveArtical=()=>{
    if(!selectedType){message.error('请选择文章类型'); return false}
    else if(!articleContent){message.error('内容不能为空');return false}
    else if(!introducemd){message.error('简介不能为空');return false}
    else if(!showDate){message.error('发布日期不能为空');return false}
    let saveProps={}
    saveProps.title=articleTitle
    saveProps.content=articleContent
    saveProps.introduce=introducemd
    saveProps.addTime=new Date(showDate.replace('-','/')).getTime()
    if(articleId==0){
        console.log('articleId= '+articleId)
        saveProps.view = 0
        axios(
            {
                method:'post',
                url:servicePath.addArticle,
                data:saveProps,
                withCredentials:true
            }
        ).then((res)=>{
            setArticleId(res.data.insertId)
            if(res.data.isSuccess){message.success('添加成功')}
            else{message.error('添加失败')}
        })
    }else{
        saveProps.id=articleId
        axios(
            {
                method:'post',
                url:servicePath.changeArticle,
                data:saveProps,
                withCredentials:true
            }
        ).then((res)=>{
            
            if(res.data.isSuccess){message.success('保存成功')}
            else{message.error('保存失败')}
        })
    }
    }
 useEffect(()=>{
    getTypeInfo()
    const tmpId=props.match.params.id
    if(tmpId){
        setArticleId(tmpId)
        getArticleById(tmpId)}
    },[])

    return(
        <div>
        <Row gutter={5}>
            <Col span={18}>
           <Row gutter={10}>
               <Col span={20}>
               <Input 
               placeholder='博客标题' 
               size='large' 
               value={articleTitle} 
               onChange={e=>{setArticleTitle(e.target.value)}}
               />
               </Col>
               <Col span={4}>
                   &nbsp;
                <Select value={selectedType} size="large" onChange={HandelTypeChange}>
                {
                    typeInfo.map((item,index)=>{
                        return (<Option key={index} value={item.id}>{item.typeName}</Option>)
                    })
                 }
                </Select>
                   
               
               </Col>
           </Row>
           <br/>
           <Row>
               <Col span={12}>
                   <TextArea className="markdown-content" 
                        rows={35} 
                        value={articleContent} 
                        
                        onChange={ChangeContent}
                        onPressEnter={ChangeContent}/>
               </Col>
               <Col span={12}>
                   <div className="show-html" dangerouslySetInnerHTML={{__html:markdownContent}}></div>
               </Col>
           </Row>
           </Col>
            <Col span={6}>
            <Row>
                <Col span={24}>
                    <Button>保存文章</Button>&nbsp;&nbsp;
                    <Button type='primary' onClick={SaveArtical}>发布文章</Button>
                    <br/><br/>
                </Col>
            </Row>
            <Row>
                <Col ><br/>
                <TextArea 
                        rows={4}  
                        placeholder="文章简介" 
                        value={introducehtml}
                        onChange={ChangeIntroduce}
                        onPressEnter={ChangeIntroduce}/><br/><br/>
                    
                    <div className='introduce-html' dangerouslySetInnerHTML={{__html:introducehtml}}></div><br/>
                </Col>
                <Col >
                <div className='date-select'>
                    <DatePicker
                    
                    onChange={(date,dateString)=>{setShowDate(dateString)}}
                    placeholder='发布日期'/>
                </div>
                </Col>
            </Row>
            </Col>
        </Row>
        </div>
    )
}
export default AddArticle;