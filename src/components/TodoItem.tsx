import { useState,  } from 'react';
import { FiCheck, FiTrash2,  } from "react-icons/fi";

import styled from "styled-components";
import format from 'date-fns/format';

import '../index.css';
import { TodoItemType, } from "../types/index.ts";

// import useTodoItems from "./pages/Main/hooks/useTodoItems.ts"

// import { TodoItemType, InputMode } from "../types/index.ts";
import Spacing from "./Spacing.tsx";

// import todoItemsDummy from '../assets/dummy/todoItems.ts';

//const defaultInputMode: InputMode = {type: "default"};

type TodoItemProps = {
    itemType: string;
    itemInfo: TodoItemType;
    onResetInputMode: () => void;
    onRefreshTodo : () => void;
    onEditTodo: () => void;
    currentDate: Date;
    contentValue: string;
    theme:string;
}

export default function TodoItem({
        itemType, 
        itemInfo, 
        onResetInputMode,
        onRefreshTodo,
        onEditTodo,
        currentDate,
        contentValue,
        theme,
    }:TodoItemProps) {
    
    //const [todoItems, setTodoItems] = useState<TodoItem[]>(todoItemsDummy);

    //const [inputMode, setInputMode] = useState<InputMode>(defaultInputMode);

    //const [currentDate, setCurrentDate] = useState( new Date() );

    // const { onAddTodoItem, onToggleDone } = useTodoItems(currentDate);

    const [addInputValue, setAddInputValue] = useState("");

    const [editInputValue, setEditInputValue] = useState(contentValue);

    function handleChangeAddInputValue(event:React.ChangeEvent<HTMLInputElement>) {
        setAddInputValue(event.target.value);
        //console.log(addInputValue);
    }

    function handleChangeEditInputValue(event: React.ChangeEvent<HTMLInputElement>) {
        setEditInputValue(event.target.value);
      }
    

    function onAddTodoItem() {
        // todoItems에 추가하고 인풋모드를 리셋한다.
        const localTodoData = localStorage.getItem('todoData');
        if(localTodoData!=null) {
            const newTodo = JSON.parse(localTodoData);
            const lastId = newTodo.map( (item:TodoItemType) => parseInt(item.id))
                .reduce((prev:number, curr:number) => prev > curr ? prev : curr, 0);
            newTodo.push({id: String(lastId+1),
            content : addInputValue,
            isDone: false,
            createdAt : format(currentDate, "yyyy-MM-dd"),
            });
            //setTodoItems(newTodo);
            //console.log(newTodo);
            localStorage.setItem('todoData', JSON.stringify(newTodo));
            onRefreshTodo();
        }
        // const date = new Date();
        // const year = date.getFullYear();
        // const month = ('0' + (date.getMonth() + 1)).slice(-2);
        // const day = ('0' + date.getDate()).slice(-2);
        // const dateStr = `${year}-${month}-${day}`;        
    }

    function onEditTodoItem(editInputValue:string, itemId:string) {
        const localTodoData = localStorage.getItem('todoData');
        if(localTodoData!=null) {
            const newTodo = JSON.parse(localTodoData);
            const targetItem = newTodo.filter((item:TodoItemType) => item.id === itemId );
            targetItem[0].content = editInputValue;
            localStorage.setItem('todoData', JSON.stringify(newTodo));
            onRefreshTodo();
        }
    }

    function onDeleteTodoItem(itemId:string) {
        const localTodoData = localStorage.getItem('todoData');
        if(localTodoData!=null) {
            const newTodo = JSON.parse(localTodoData);
            const targetItemIndex = newTodo.findIndex((item:TodoItemType) => item.id === itemId );
            console.log(targetItemIndex);
            newTodo.splice(targetItemIndex, 1);
            localStorage.setItem('todoData', JSON.stringify(newTodo));
            onRefreshTodo();
        }
    }

    const onToggleDone = (id:string) => {
        //console.log(id);
        const localTodoData = localStorage.getItem('todoData');
        if(localTodoData!=null) {
            const newTodo = JSON.parse(localTodoData);
            const targetItem = newTodo.filter((item:TodoItemType) => item.id === id );
            //console.log(targetItem);
            targetItem[0].isDone = !targetItem[0].isDone;
            localStorage.setItem('todoData', JSON.stringify(newTodo));
            onRefreshTodo();
        }
    }
    
    return(
        <div style={{padding:"0",display:"flex",flexDirection: "column", width:"100%", paddingLeft:"0.125em"}} >
            
            {itemType == "add" && ( <>
                <TodoInput placeholder="새로운 할 일을 추가하세요"
                            autoFocus
                            type="text"
                            onChange={(e) => handleChangeAddInputValue(e)}
                            onKeyDown={(e) => { 
                                if(e.key === "Enter") {
                                    if(addInputValue == "") {
                                        alert("1글자 이상 입력해주세요.");
                                        return;
                                    }
                                    onAddTodoItem();
                                    onResetInputMode();
                                }else if(e.key==="Escape"){
                                    onResetInputMode();
                                } }}
                />
                <Spacing size={8}/>
                <div style={{display:"flex", gap: 8, paddingRight:"0.25em"}}>
                    <button onClick={onResetInputMode}
                            style={theme === "theme-dark" 
                                   ? {border: "0.12em solid var(--color-gray-1)",background:"transparent", color: "var(--color-gray-0)", borderRadius: 30, fontWeight: 700, fontSize: "1.05em", cursor:"pointer", padding: "5px 13px 4px"}
                                   : {border: "0.12em solid var(--color-gray-0)",background:"transparent", color: "var(--color-gray-1)", borderRadius: 30, fontWeight: 700, fontSize: "1.05em", cursor:"pointer", padding: "5px 13px 4px"}}>
                        취소</button>
                    <button onClick={() => {
                            if(addInputValue == "") {
                                alert("1글자 이상 입력해주세요.");
                                return;
                            }
                            onAddTodoItem();
                            onResetInputMode();}}
                            style={{border:"none", background:"#CFFF48", color: "#000", borderRadius: 30, fontWeight: 700, fontSize: "1.05em",  cursor:"pointer", padding: "5px 13px 4px"}}>
                        할 일 추가</button>
                </div>
                <Spacing size={8}/>
            </>)}

            {itemType == "edit" && ( <>
                <TodoInput placeholder="수정할 내용을 입력하세요" 
                            autoFocus
                            value={`${editInputValue}`}
                            type="text"
                            onChange={(e) => handleChangeEditInputValue(e)}
                            onKeyDown={(e) => { 
                                if(e.key === "Enter") { 
                                    if(editInputValue == "") {
                                        alert("1글자 이상 입력해주세요.");
                                        return;
                                    }
                                    onEditTodoItem(editInputValue, itemInfo.id);
                                    onResetInputMode();
                                }else if(e.key === "Escape") {
                                    onResetInputMode();
                                }}}
                />
                <Spacing size={8}/>
                <div style={{display:"flex", gap: 8, paddingRight:"0.25em"}}>
                    <button onClick={onResetInputMode} 
                            style={theme === "theme-dark" 
                            ? {border: "0.12em solid var(--color-gray-1)",background:"transparent", color: "var(--color-gray-0)", borderRadius: 30, fontWeight: 700, fontSize: "1.05em", cursor:"pointer", padding: "5px 13px 4px"}
                            : {border: "0.12em solid var(--color-gray-0)",background:"transparent", color: "var(--color-gray-1)", borderRadius: 30, fontWeight: 700, fontSize: "1.05em", cursor:"pointer", padding: "5px 13px 4px"}}>
                        취소</button>
                    <button onClick={() => {
                        if(editInputValue == "") {
                            alert("1글자 이상 입력해주세요.");
                            return;
                        }
                        onEditTodoItem(editInputValue, itemInfo.id);
                        onResetInputMode();}}
                        style={{border:"none", background:"var(--color-primary)", color: "var(--color-gray-3)", borderRadius: 30, fontWeight: 700, fontSize: "1.05em",  cursor:"pointer", padding: "5px 13px 4px"}}>
                        수정</button>
                    <div style={{flexGrow:1}}></div>
                    <button 
                    onClick={() => { onDeleteTodoItem(itemInfo.id); }}
                            style={theme === "theme-dark" 
                            ? {display:"flex", alignItems:"center", gap:4, border: "2px solid var(--color-background)",background:"var(--color-gray-2)", color: "var(--color-text)", borderRadius: 30, fontWeight: 700, fontSize: "1.05em", cursor:"pointer", padding: "5px 13px 4px 11px"}
                            : {display:"flex", alignItems:"center", gap:4, border: "2px solid var(--color-background)",background:"var(--color-gray-0)", color: "var(--color-text)", borderRadius: 30, fontWeight: 700, fontSize: "1.05em", cursor:"pointer", padding: "5px 13px 4px 11px"}}>
                        <FiTrash2 size={18}/>
                        <span>삭제</span>
                    </button>
                </div>
                <Spacing size={8}/>
            </>)}

            {itemType==="default" && (
                <TodoListItem theme={theme} onClick={onEditTodo}  title={itemInfo.content}>
                    <Content 
                            isDone={itemInfo.isDone}>{itemInfo.content}</Content>
                    <DoneButton style={{padding: 12, cursor:"pointer", display:"flex"}}
                                isDone={itemInfo.isDone} 
                                onClick={()=> onToggleDone(itemInfo.id)}>
                        <FiCheck size={26} strokeWidth={3} />
                    </DoneButton>
                </TodoListItem>
            )}

        </div>  
    )
}

const TodoListItem = styled.div<{theme:string}>`
    display:flex;
    align-items:center;
    flex-direction: row;
    justify-content: space-between;
    gap: 8px;
    border-radius: 4px;
    padding-left: 0.75em;
    transition: var(--transition-ease-out);

    
    &:hover {
        cursor:text;
        background-color: ${(props) => ( props.theme === "theme-dark" ? "var(--color-gray-2)" : "var(--color-light-gray-0)")};
    }
`;

const Content = styled.div<{isDone:boolean}>`
    white-space: nowrap;
    overflow: hidden;
    text-overflow:ellipsis;
    user-select: none;
    font-size: 1em;
    flex-grow: 1;
    text-decoration:  ${(props) => (props.isDone ? "line-through" : "none")};
    color: ${(props) => (props.isDone ? "var(--color-gray-1)" : "var(--color-text)")};

    &:before {
        content: "";
    }
`;

const DoneButton = styled.div<{isDone:boolean}>`
    & > * {
        color: ${(props) => (props.isDone ? "var(--color-primary-deep)" : "var(--color-gray-1)")};
    }
`;

const TodoInput = styled.input`
    font-size: 1em;
    padding:0;
    font-family :var(--font-family);
    background: transparent;
    border: none; 
    border-bottom: 1px solid transparent;
    outline: none;
    padding: 0 0.75em;
    color: var(--color-text);
    height:52px;

    & + div {
        position: relative;
    }
    & + div:nth-child(2):after {
        content: '';
        top: -3px;
        left: 0;
        right: 8px;
        height: 1px;
        background-color: var(--color-gray-1);
        position: absolute;
    }
    & + div:nth-child(2):before {
        content:'';
        background-color: var(--color-text);
        height: 2px;
        position: absolute;
        top: -3px;
        transform: scaleX(0);
        transform-origin: center;
        width: calc(100% - 0.5em);
        z-index:1;
    }
    &:focus + div:nth-child(2):before {
        transform: scaleX(1);
        transition: transform 250ms cubic-bezier(0.57, 0.09, 0.46, 1.01);
    }
`;