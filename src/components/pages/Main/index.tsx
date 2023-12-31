import { useState, useRef, useEffect } from 'react';
import '../../../index.css';

import { FiPlus, FiCoffee } from "react-icons/fi";
import todoItemsDummy from '../../../assets/dummy/todoItems.ts';
import format from 'date-fns/format';
import addDays from 'date-fns/addDays';
import subDays from 'date-fns/subDays';

import { TodoItemType, InputMode } from "../../../types/index.ts";
import TodoItem from "../../TodoItem.tsx";
import Header from "../../Header.tsx";
import TodoItemsListHeader from "./TodoItemsRate/index.tsx";
import SelectFilter from "./SelectFilter/index.tsx";

import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { todoItemsAtom, filteredTodoItemsSelector, currentDateAtom } from "../../Atoms/todoItemsAtom.ts";

const defaultInputMode: InputMode = {type: "default"};

const today = format( new Date(), "MM월 dd일");

export default function Main() {

  //const [currentDate, setCurrentDate] = useState( new Date() );
  const [currentDate, setCurrentDate] = useRecoilState(currentDateAtom);

  // const [todoItems, setTodoItems] = useRecoilState(todoItemsAtom);
  const setTodoItems = useSetRecoilState(todoItemsAtom);
  const filteredTodoItems: TodoItemType[] | undefined = useRecoilValue(filteredTodoItemsSelector)
  // filteredTodoItems에는 아래를 참고해서 필터된 밸류를 할당하고, 기존 todoItems를 바꾼다.
  // const percentage = useRecoilValue(todoItemsProgressPercentageSelector);


  const [editInputValue, setEditInputValue] = useState("");
  
  const [inputMode, setInputMode] = useState<InputMode>(defaultInputMode);

  //const [isListOverflow, setIsListOverflow] = useState<boolean>(false);

  const elementRef = useRef(null);
  //console.log(currentDate);
  const todoItemListRef = useRef(null);
  const mainRef = useRef(null);
  //const addInputElementRef = useRef(null);
  
  const [theme, setTheme] = useState("theme-dark");

  function handleAddMode() {
    setInputMode({type: "add"});
  }

  function handleEditMode(item: TodoItemType) {
    console.log(editInputValue);
    setInputMode({ type: "edit", item : item});
    setEditInputValue(item.content);
  }

  function handleResetInputMode() {
    setInputMode(defaultInputMode);
  }

  function handleMoveNextDate() {
    const newDate = addDays(currentDate, 1);
    //console.log(newDate);
    setCurrentDate(newDate);
  }

  function handleMovePrevDate() {
    const newDate = subDays(currentDate, 1);
    //console.log(newDate);
    setCurrentDate(newDate);
  }

  function toggleTheme():void {
    if(theme === "theme-dark") {
      setTheme("theme-light");
    } else {
      setTheme("theme-dark");
    }
    console.log(theme);
  }

  // const scrollToTop = ():void => {
  //   const element = elementRef.current;
  //   if (element) {
  //     element.scrollTo({top:900, behavior:"smooth"});
  //   }
  // };

  // const calcListOverflowed = ():boolean => {
  //   const containerHeight = todoItemListRef.current.getBoundingClientRect().height;
  //   const appHeight = mainRef.current.clientHeight - 67;
  //   console.log(appHeight, containerHeight);
    
  //   if(appHeight < containerHeight) {
  //     setIsListOverflow(true);
  //     console.log(isListOverflow);
  //     return true;
  //   }
  //   else {
  //     setIsListOverflow(false);
  //     console.log(isListOverflow);
  //     return false;
  //   }
  // }

  function onRefreshTodo() {

    const dateString = format(currentDate, 'yyyy-MM-dd'); // date type을 스트링으로 바꿔서 비교해야 함
    //console.log(dateString);
    const localStorageItem = localStorage.getItem('todoData');

    if(localStorageItem != null) {
      const localTodoData = JSON.parse(localStorageItem);
      const todayTodo = localTodoData.filter( (item:TodoItemType) => item.createdAt === dateString);
      //console.log(todayTodo);
      setTodoItems(todayTodo);
    }
  }

  // init
  useEffect( () => {
    const savedData = localStorage.getItem('todoData');
    if (!savedData) {
        localStorage.setItem('todoData', JSON.stringify(todoItemsDummy));
        return;
    }
    const parsedData = JSON.parse(savedData);
    setTodoItems(parsedData);
  },[]);

  // date 변경 hook
  useEffect( () => {
    onRefreshTodo();
    handleResetInputMode();
  }, [currentDate, ]);


  return (      
    <main ref={mainRef} className={theme}
          style={{ maxWidth: 420, height: "100vh", margin: "0 auto",backgroundColor: "var(--color-background)",position:"relative",transition:"var(--transition-ease-out)"}}>
      
      <button onClick={() => {
                handleAddMode();
                setTimeout(() => {
                  //scrollToTop();
                },200);
              }}
            style={{borderRadius: 30, backgroundColor: "var(--color-primary)", color: "var(--color-dark)", top: "calc(100% - 70px)", left: "calc(100% - 70px)", display: "flex", position: "absolute",
            width: 48, height: 48, placeItems: "center",placeContent: "center", cursor:"pointer", border:"none", zIndex:12 }}>
        <FiPlus color="var(--color-gray-3)" size={30}/>
      </button>

      <section ref={elementRef} 
               style={{overflow:"hidden auto", height: "100%", padding: "0 0 2em", }}>
        
        <Header handleMovePrevDate={() => handleMovePrevDate()}
                handleMoveNextDate={() => handleMoveNextDate()}
                theme={theme}
                toggleTheme={toggleTheme} 
                handleMoveHome ={()=> console.log("move to home")}
                today={today}/>
               
        <div className="todoItemList" ref={todoItemListRef} 
            style={{display:"flex", flexDirection: "column", alignItems:"center",padding: "1em 1em 2.5em 1em"}}>
          
          <div style={{display:"flex", width:"100%", alignItems:"baseline", padding: "0 0 0.75em",borderBottom: "0px solid var(--color-gray-2)", marginBottom: "0.5em",
              position: "sticky", top: 83, background: "var(--color-background)", boxShadow: "0 -16px 0 0 var(--color-background)", transition:"var(--transition-ease-out)"}}>
            <TodoItemsListHeader />
            <SelectFilter theme={theme} />
          </div>

          {(filteredTodoItems != undefined && filteredTodoItems.length > 0) && [...filteredTodoItems].map( (todo:TodoItemType) =>  {
            const isEditMode = // 렌더링 컨디션 지정을 위한 변수 
                  inputMode.type === "edit" && inputMode.item === todo;
            return (
              <div key={todo.id} style={{padding: "0", width:"100%"}}>
               
                {isEditMode && (
                    <TodoItem itemType="edit" 
                              contentValue={todo.content} 
                              onEditTodo={()=> {}}
                              onResetInputMode={handleResetInputMode} 
                              onRefreshTodo={onRefreshTodo} 
                              itemInfo={todo}
                              theme={theme}
                              currentDate={currentDate}/>

                )}

                {!isEditMode && (
                    <TodoItem itemType="default" 
                              contentValue={""} 
                              onEditTodo={()=> handleEditMode(todo)}
                              onResetInputMode={handleResetInputMode} 
                              onRefreshTodo={onRefreshTodo} 
                              itemInfo={todo}
                              theme={theme}
                              currentDate={currentDate}/>
                )}
              </div>
              )
            })
          }

          {filteredTodoItems != undefined && inputMode.type === "add" && (
            <TodoItem itemType="add" 
                      contentValue={""} 
                      onEditTodo={()=> console.log("Edit")}
                      onResetInputMode={handleResetInputMode}
                      onRefreshTodo={onRefreshTodo} 
                      itemInfo={filteredTodoItems[0]}
                      theme={theme}
                      currentDate={currentDate}/>
          )}
          
          {/* { isListOverflow &&  (
            <div style={{display:"flex", justifyContent:"center", width:"fit-content", margin: "2em 0 0", cursor:"pointer"}}
                 onClick={scrollToTop}>
                <FiArrowUpCircle color="#505050" size="36"/>
            </div>
          )} */}

          {(filteredTodoItems != undefined && filteredTodoItems.length == 0 && inputMode.type !== "add") && (
            <div style={{height:"calc(100vh - 7em)", display:"flex", alignItems:"center", userSelect: "none", textAlign:"center",
            flexDirection: "column", justifyContent: "center", gap: 24, color: "var(--color-text)",fontSize:"1.2em",opacity:"0.5"}}>
                <FiCoffee size="48" color=""/>
                <div className="text-xl font-bold">등록된 할 일이 없네요!<br/>커피 한 잔의 여유를 즐겨보세요.</div>
            </div>
          )}
          
        </div>
      </section>
    </main>
  )
}