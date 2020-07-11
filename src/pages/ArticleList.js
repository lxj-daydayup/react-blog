import React,{useState,useEffect} from 'react'
import { List ,Row ,Col , Modal ,message ,Button,Switch} from 'antd';
import axios from 'axios'
import  servicePath  from '../config/apiURL'
import AddArticle from './AddArticle';
const { confirm } = Modal;
function  ArticleList(props) {
    const[list,setList]=useState([])
    const getList=()=>{
        axios({
            method:'get',
            url:servicePath.getArticleList,
            withCredentials:true
        }).then((res)=>{setList(res.data.list)})
    }
    const delArticle=(id)=>{
        confirm({
            title:'确定要删除吗',
            content:'点击OK将永久删除博客',
            onOk(){axios(servicePath.delArticle+id,{withCredentials:true}).then((res)=>{message.success('删除成功'); getList()})},
            onCancel(){message.success('已取消删除')}
        })
        

    }
    const updateArticle=(id)=>{
        props.history.push('/index/add/'+id)
    }
    useEffect(()=>{getList()},[])
    return(
        <div>
            <List
            header={
                <Row>
                    <Col span={8}><b>标题</b></Col>
                    <Col span={3}><b>类别</b></Col>
                    <Col span={3}><b>发布时间</b></Col>
                    <Col span={3}><b>集数</b></Col>
                    <Col span={3}><b>浏览量</b></Col>
                    <Col span={4}><b>操作</b></Col>

                </Row>           
            }
            bordered
            dataSource={list}
            renderItem={(item)=>(
                <List.Item>
                    <Col span={8}>{item.title}</Col>
                    <Col span={3}>{item.typeName}</Col>
                    <Col span={3}>{item.addTime}</Col>
                    <Col span={3}>{item.part_count}</Col>
                    <Col span={3}>{item.view}</Col>
                    <Col span={4}>
                    <Button type='primary' onClick={()=>{updateArticle(item.id)}}>修改</Button> &nbsp;
                    <Button onClick={()=>delArticle(item.id)}>删除</Button>
                    </Col>
                </List.Item>
            )}
            />
        </div>
    )
    
}

export default ArticleList